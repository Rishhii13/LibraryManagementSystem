const mongoose = require("mongoose");

const borrowSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    studentName: { type: String, required: true, trim: true },
    studentId: { type: String, default: "" },
    studentPhone: { type: String, required: true, trim: true },
    bookTitle: { type: String, required: true, trim: true },
    issueDate: { type: Date, required: true },
    dueDate: { type: Date, required: true },
    returnedAt: { type: Date, default: null },
    reminderSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

borrowSchema.index({ returnedAt: 1, dueDate: 1 });

module.exports = mongoose.model("Borrow", borrowSchema);
