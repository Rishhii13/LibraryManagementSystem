
const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Check whether the email API is working.
router.get("/test", protect, (req, res) => {
  return res.status(200).json({
    message: "Email notification API is working.",
  });
});

// Send email using Resend API.
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
          message: "Please enter a valid email address.",
        });
      }

      if (!process.env.RESEND_API_KEY) {
        return res.status(503).json({
          success: false,
          message: "Resend API key is not configured.",
        });
      }

      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "LibManage <onboarding@resend.dev>",
          to: [email],
          subject:
            typeof subject === "string" && subject.trim()
              ? subject.trim()
              : "Library Notification - LibManage",
          text: message.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("Resend API error:", result);

        return res.status(response.status).json({
          success: false,
          message:
            result.message || "Resend could not send the email.",
        });
      }

      console.log("Email sent successfully:", result.id);

      const io = req.app.get("io");

      if (io) {
        io.emit("email-sent", {
          recipient: email,
          messageId: result.id,
          status: "sent",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Email sent successfully.",
        messageId: result.id,
      });
    } catch (error) {
      console.error("Email sending failed:", error.message);

      return res.status(500).json({
        success: false,
        message: "Email could not be sent. Please try again.",
      });
    }
  }
);

module.exports = router;
