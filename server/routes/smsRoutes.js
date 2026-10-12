
const express = require("express");
const twilio = require("twilio");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

/* ================= TWILIO CONFIG ================= */

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// Initialize Twilio only when credentials are configured
const client =
  accountSid && authToken
    ? twilio(accountSid, authToken)
    : null;

/* ================= TEST ROUTE ================= */

// Authenticated users can check the SMS API
router.get("/test", protect, (req, res) => {
  return res.status(200).json({
    message: "SMS API is working",
  });
});

/* ================= SEND SMS ================= */

// Only librarians and admins can send SMS
router.post(
  "/send",
  protect,
  authorize("librarian", "admin"),
  async (req, res) => {
    try {
      const { to, message } = req.body;

      // Validate required fields
      if (
        typeof to !== "string" ||
        typeof message !== "string" ||
        !to.trim() ||
        !message.trim()
      ) {
        return res.status(400).json({
          success: false,
          message: "Valid phone number and message are required.",
        });
      }

      // Check Twilio configuration
      if (!client || !twilioPhoneNumber) {
        return res.status(503).json({
          success: false,
          message: "SMS service is not configured.",
        });
      }

      // Basic phone number format validation
      const phoneNumber = to.trim();

      if (!/^\+[1-9]\d{7,14}$/.test(phoneNumber)) {
        return res.status(400).json({
          success: false,
          message:
            "Enter the phone number in international format, for example +919876543210.",
        });
      }

      // Avoid sending empty or excessively long messages
      const smsMessage = message.trim();

      if (smsMessage.length > 1500) {
        return res.status(400).json({
          success: false,
          message: "Message is too long. Please shorten it.",
        });
      }

      // Send SMS through Twilio
      const sms = await client.messages.create({
        body: smsMessage,
        from: twilioPhoneNumber,
        to: phoneNumber,
      });

      console.log("SMS request processed:", {
        userId: req.user.id,
        status: sms.status,
      });

      return res.status(200).json({
        success: true,
        message: "SMS request submitted successfully.",
        sid: sms.sid,
        status: sms.status,
      });
    } catch (error) {
      // Keep sensitive provider details in server logs only
      console.error("SMS sending failed:", error.message);

      return res.status(500).json({
        success: false,
        message: "Failed to send SMS. Please check the number and SMS configuration.",
      });
    }
  }
);

module.exports = router;
