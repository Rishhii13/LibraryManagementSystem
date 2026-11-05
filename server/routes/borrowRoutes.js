const express = require("express");
const mongoose = require("mongoose");
const Borrow = require("../models/Borrow");
const Book = require("../models/Book");
const Member = require("../models/Member");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();
const STAFF = [protect, authorize("librarian", "admin")];
const FINE_PER_DAY = 10;

function startOfDay(date) {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  return value;
}

function formatBorrow(record) {
  const today = startOfDay(new Date());
  const due = startOfDay(record.dueDate);
  const daysLate = record.returnedAt
    ? 0
    : Math.max(0, Math.floor((today - due) / 86400000));

  let status = "Upcoming";
  if (record.returnedAt) status = "Returned";
  else if (due.getTime() === today.getTime()) status = "Due Today";
  else if (due < today) status = "Overdue";
  else if (due.getTime() - today.getTime() === 86400000) status = "Due Tomorrow";

  return {
    id: record._id,
    transactionId: record.transactionId,
    student: record.studentName,
    studentId: record.studentId || String(record.member),
    phone: record.studentPhone,
    book: record.bookTitle,
    bookId: record.book,
    memberId: record.member,
    issueDate: record.issueDate,
    dueDate: record.dueDate,
    returnDate: record.returnedAt,
    status,
    days: daysLate,
    fine: daysLate * FINE_PER_DAY,
    reminderSent: record.reminderSent,
  };
}

// Get all borrowing and return transactions.
router.get("/", ...STAFF, async (req, res) => {
  try {
    const records = await Borrow.find().sort({ createdAt: -1 });
    res.status(200).json(records.map(formatBorrow));
  } catch (error) {
    console.error("Borrow records fetch failed:", error.message);
    res.status(500).json({ message: "Failed to fetch borrowing records." });
  }
});

// Issue a book.
router.post("/", ...STAFF, async (req, res) => {
  let reservedBookId = null;

  try {
    const { memberId, bookId, duration } = req.body;
    const days = Number(duration);

    if (
      !mongoose.isValidObjectId(memberId) ||
      !mongoose.isValidObjectId(bookId) ||
      !Number.isInteger(days) ||
      days < 1 ||
      days > 365
    ) {
      return res.status(400).json({
        message: "Select a valid member, book and borrowing duration.",
      });
    }

    const member = await Member.findById(memberId);
    if (!member || member.status !== "active") {
      return res.status(404).json({ message: "Active member not found." });
    }

    const book = await Book.findOneAndUpdate(
      { _id: bookId, available: { $gt: 0 } },
      { $inc: { available: -1 } },
      { new: true }
    );

    if (!book) {
      return res.status(409).json({ message: "This book is currently unavailable." });
    }
    reservedBookId = book._id;

    const issueDate = new Date();
    const dueDate = new Date(issueDate);
    dueDate.setDate(dueDate.getDate() + days);

    const transactionId = `TXN${Date.now()}`;
    const record = await Borrow.create({
      transactionId,
      member: member._id,
      book: book._id,
      studentName: member.name,
      studentId: member.studentId || "",
      studentPhone: member.phone,
      bookTitle: book.title,
      issueDate,
      dueDate,
    });

    const io = req.app.get("io");
    if (io) io.emit("book-issued", { transactionId, bookTitle: book.title });

    return res.status(201).json({
      message: "Book issued successfully.",
      record: formatBorrow(record),
    });
  } catch (error) {
    if (reservedBookId) {
      await Book.updateOne({ _id: reservedBookId }, { $inc: { available: 1 } }).catch(() => {});
    }
    console.error("Book issue failed:", error.message);
    return res.status(500).json({ message: "Failed to issue book." });
  }
});

// Complete a return.
router.patch("/:id/return", ...STAFF, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid transaction ID." });
    }

    const record = await Borrow.findOneAndUpdate(
      { _id: req.params.id, returnedAt: null },
      { $set: { returnedAt: new Date() } },
      { new: true }
    );

    if (!record) {
      return res.status(404).json({
        message: "Active borrowing record not found. It may already be returned.",
      });
    }

    await Book.updateOne(
      { _id: record.book },
      { $inc: { available: 1 } }
    );

    const io = req.app.get("io");
    if (io) io.emit("book-returned", { transactionId: record.transactionId });

    return res.status(200).json({
      message: "Book returned successfully.",
      record: formatBorrow(record),
    });
  } catch (error) {
    console.error("Book return failed:", error.message);
    return res.status(500).json({ message: "Failed to return book." });
  }
});

// Mark that a reminder was successfully sent.
router.patch("/:id/reminder", ...STAFF, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid transaction ID." });
    }
    const record = await Borrow.findOneAndUpdate(
      { _id: req.params.id, returnedAt: null },
      { $set: { reminderSent: true } },
      { new: true }
    );
    if (!record) {
      return res.status(404).json({ message: "Active borrowing record not found." });
    }
    return res.status(200).json({ message: "Reminder status updated." });
  } catch (error) {
    console.error("Reminder update failed:", error.message);
    return res.status(500).json({ message: "Failed to update reminder status." });
  }
});

module.exports = router;
