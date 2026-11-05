
const express = require("express");
const nodemailer = require("nodemailer");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Test whether the email API is working.
router.get("/test", protect, (req, res) => {
  return res.status(200).json({
    message: "Email notification API is working.",
  });
});

// Send a real email.
router.post(
  "/send",
  protect,
  authorize("librarian", "admin"),
  async (req, res) => {
    try {
      const { to, message, subject } = req.body;

      if (
        typeof to !== "string" ||
        typeof message !== "string" ||
        !to.trim() ||
        !message.trim()
      ) {
        return res.status(400).json({
          success: false,
          message: "Recipient email and message are required.",
        });
      }

      const email = to.trim();

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(email)) {
        return res.status(400).json({
          success: false,
          message: "Please enter a valid recipient email address.",
        });
      }

      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        return res.status(503).json({
          success: false,
          message: "Gmail is not configured. Check EMAIL_USER and EMAIL_PASS.",
        });
      }

      const info = await transporter.sendMail({
        from: `"LibManage Library" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: subject?.trim() || "Library Notification - LibManage",
        text: message.trim(),
      });

      console.log("Email sent:", info.messageId);

      const io = req.app.get("io");
      if (io) {
        io.emit("email-sent", {
          recipient: email,
          messageId: info.messageId,
          status: "sent",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Email sent successfully.",
        messageId: info.messageId,
      });
    } catch (error) {
      console.error("Email sending failed:", error.message);

      return res.status(500).json({
        success: false,
        message: "Email could not be sent. Please check Gmail configuration.",
      });
    }
  }
);

module.exports = router;
