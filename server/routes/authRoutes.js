const express = require("express");

const {
  signup,
  login,
} = require("../controllers/authController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Public signup and login routes
router.post("/signup", signup);
router.post("/login", login);

// Protected profile route
router.get("/profile", protect, (req, res) => {
  return res.status(200).json({
    message: "Protected profile accessed successfully.",
    user: {
      id: req.user.id,
      name: req.user.name,
      role: req.user.role,
    },
  });
});

// Admin-only route
router.get(
  "/admin-test",
  protect,
  authorize("admin"),
  (req, res) => {
    return res.status(200).json({
      message: "Admin access granted.",
      user: {
        id: req.user.id,
        name: req.user.name,
        role: req.user.role,
      },
    });
  }
);

module.exports = router;