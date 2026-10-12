
const Book = require("../models/Book");

// GET all books
const getBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch books",
      error: error.message,
    });
  }
};

// GET one book by ID
const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    res.status(200).json(book);
  } catch (error) {
    res.status(400).json({
      message: "Invalid book ID or failed to fetch book",
      error: error.message,
    });
  }
};

// CREATE a new book
const createBook = async (req, res) => {
  try {
    const { title, author, category, isbn, copies, available } = req.body;

    if (!title || !author || !category) {
      return res.status(400).json({
        message: "Title, author, and category are required.",
      });
    }

    const book = await Book.create({
      title: title.trim(),
      author: author.trim(),
      category: category.trim(),
      isbn: isbn ? String(isbn).trim() : "",
      copies: copies ?? 1,
      available: available ?? copies ?? 1,
    });

    const io = req.app.get("io");

    if (io) {
      io.emit("book-created", {
        message: "A new book has been added to the library.",
        book,
      });
    }

    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create book",
      error: error.message,
    });
  }
};

// UPDATE a book
const updateBook = async (req, res) => {
  try {
    const updates = { ...req.body };

    if (updates.isbn !== undefined) {
      updates.isbn = String(updates.isbn).trim();
    }

    const book = await Book.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    const io = req.app.get("io");

    if (io) {
      io.emit("book-updated", {
        message: "A book's details have been updated.",
        book,
      });
    }

    res.status(200).json(book);
  } catch (error) {
    res.status(400).json({
      message: "Failed to update book",
      error: error.message,
    });
  }
};

// DELETE a book
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    const io = req.app.get("io");

    if (io) {
      io.emit("book-deleted", {
        message: "A book has been removed from the library.",
        bookId: book._id,
        title: book.title || "Book",
      });
    }

    res.status(200).json({
      message: "Book deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to delete book",
      error: error.message,
    });
  }
};

module.exports = {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
};
