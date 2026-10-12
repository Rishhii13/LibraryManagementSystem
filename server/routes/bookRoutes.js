const express = require("express");

const {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} = require("../controllers/bookController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

// GET all books - authenticated users
router.get("/", protect, getBooks);

// GET one book - authenticated users
router.get("/:id", protect, getBookById);

// CREATE a book - librarian or admin
router.post(
  "/",
  protect,
  authorize("librarian", "admin"),
  createBook
);

// UPDATE a book - librarian or admin
router.put(
  "/:id",
  protect,
  authorize("librarian", "admin"),
  updateBook
);

// DELETE a book - admin only
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteBook
);

module.exports = router;