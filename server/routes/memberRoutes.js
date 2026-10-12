
const express = require("express");
const Member = require("../models/Member");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

/* ================= TEST ROUTE ================= */

// Authenticated users can check the Members API
router.get("/test", protect, (req, res) => {
  res.status(200).json({
    message: "Members API is working",
  });
});

/* ================= GET ALL MEMBERS ================= */

// Librarian or admin can view all members
router.get("/", protect, authorize("librarian", "admin"), async (req, res) => {
  try {
    const members = await Member.find().sort({ createdAt: -1 });

    return res.status(200).json(members);
  } catch (error) {
    console.error("Error fetching members:", error.message);

    return res.status(500).json({
      message: "Failed to fetch members.",
    });
  }
});

/* ================= ACTIVE MEMBERS COUNT ================= */

// Librarian or admin can view the active members count
router.get(
  "/active/count",
  protect,
  authorize("librarian", "admin"),
  async (req, res) => {
    try {
      const count = await Member.countDocuments({
        status: "active",
      });

      return res.status(200).json({
        count,
      });
    } catch (error) {
      console.error("Error counting active members:", error.message);

      return res.status(500).json({
        message: "Failed to count active members.",
      });
    }
  }
);

/* ================= ADD MEMBER ================= */

// Librarian or admin can add a member
router.post(
  "/",
  protect,
  authorize("librarian", "admin"),
  async (req, res) => {
    try {
      const {
        name,
        email,
        phone,
        course,
        year,
        status,
      } = req.body;

      // Validate required fields
      if (
        !name ||
        !email ||
        !phone ||
        !course ||
        year === undefined ||
        year === null ||
        String(year).trim() === ""
      ) {
        return res.status(400).json({
          message: "Name, email, phone, course and year are required.",
        });
      }

      if (
        typeof name !== "string" ||
        typeof email !== "string" ||
        typeof phone !== "string" ||
        typeof course !== "string"
      ) {
        return res.status(400).json({
          message: "Invalid member details.",
        });
      }

      const normalizedEmail = email.trim().toLowerCase();

      if (!normalizedEmail || !name.trim()) {
        return res.status(400).json({
          message: "Name and email cannot be empty.",
        });
      }

      // Only allow valid member statuses
      const memberStatus = status || "active";

      if (!["active", "inactive"].includes(memberStatus)) {
        return res.status(400).json({
          message: "Status must be active or inactive.",
        });
      }

      // Check for an existing member
      const existingMember = await Member.findOne({
        email: normalizedEmail,
      });

      if (existingMember) {
        return res.status(409).json({
          message: "Member with this email already exists.",
        });
      }

      const member = await Member.create({
        name: name.trim(),
        email: normalizedEmail,
        phone: phone.trim(),
        course: course.trim(),
        year,
        status: memberStatus,
      });

      return res.status(201).json({
        message: "Member created successfully.",
        member,
      });
    } catch (error) {
      console.error("Error creating member:", error.message);

      if (error.code === 11000) {
        return res.status(409).json({
          message: "Member with this email already exists.",
        });
      }

      return res.status(400).json({
        message: "Failed to create member. Please check the provided details.",
      });
    }
  }
);

module.exports = router;
