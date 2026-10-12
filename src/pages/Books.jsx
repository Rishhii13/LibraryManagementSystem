
import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { LibraryContext } from "../context/LibraryContext";

const API_URL = "http://localhost:5000/api/books";

const getAuthHeaders = (includeJson = false) => {
  const token = localStorage.getItem("token");
  return {
    ...(includeJson ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const emptyBook = {
  title: "",
  author: "",
  category: "Programming",
  copies: 1,
  isbn: "",
};

function Books() {
  const { books, borrowBook, returnBook } = useContext(LibraryContext);

  const [apiBooks, setApiBooks] = useState([]);
  const [apiLoading, setApiLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [showAddBook, setShowAddBook] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [saving, setSaving] = useState(false);
  const [newBook, setNewBook] = useState(emptyBook);

  const fetchBooks = async () => {
    try {
      setApiLoading(true);
      setApiError("");

      const response = await fetch(API_URL, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error("Session expired or access denied. Please log in again.");
        }
        throw new Error("Failed to fetch books.");
      }

      const data = await response.json();
      const fetchedBooks = Array.isArray(data)
        ? data
        : Array.isArray(data.books)
          ? data.books
          : [];

      setApiBooks(fetchedBooks);
    } catch (error) {
      console.error("Failed to fetch books:", error);
      setApiError(error.message || "Unable to connect to library database.");
    } finally {
      setApiLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const displayBooks = apiBooks.length > 0 || !apiError ? apiBooks : books;

  const filteredBooks = displayBooks.filter((book) => {
    const searchValue = search.toLowerCase();
    const bookId = book._id || book.id || "";

    const matchesSearch =
      String(book.title || "").toLowerCase().includes(searchValue) ||
      String(book.author || "").toLowerCase().includes(searchValue) ||
      String(bookId).toLowerCase().includes(searchValue) ||
      String(book.isbn || "").toLowerCase().includes(searchValue);

    const matchesCategory =
      category === "All Categories" ||
      String(book.category || "").toLowerCase() === category.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  const totalBooks = displayBooks.length;
  const totalCopies = displayBooks.reduce(
    (total, book) => total + Number(book.copies || 1),
    0
  );
  const availableCopies = displayBooks.reduce(
    (total, book) => total + Number(book.available ?? 0),
    0
  );
  const borrowedCopies = Math.max(totalCopies - availableCopies, 0);

  const categories = [
    ...new Set(displayBooks.map((book) => book.category).filter(Boolean)),
  ];

  const handleAddBook = async () => {
    if (
      !newBook.title.trim() ||
      !newBook.author.trim() ||
      !newBook.category.trim()
    ) {
      alert("Please enter book title, author and category.");
      return;
    }

    const copies = Number(newBook.copies);

    if (!Number.isInteger(copies) || copies <= 0) {
      alert("Number of copies must be greater than 0.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(API_URL, {
        method: "POST",
        headers: getAuthHeaders(true),
        body: JSON.stringify({
          title: newBook.title.trim(),
          author: newBook.author.trim(),
          category: newBook.category.trim(),
          copies,
          available: copies,
          isbn: newBook.isbn.trim(),
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Failed to add book.");
      }

      const createdBook = data.book || data;

      if (!createdBook._id && !createdBook.id) {
        throw new Error("The server did not return the saved book record.");
      }

      setApiBooks((previous) => [...previous, createdBook]);
      setNewBook({ ...emptyBook });
      setShowAddBook(false);
      alert("Book added successfully!");
    } catch (error) {
      console.error("Add book error:", error);
      alert(error.message || "Failed to add book.");
    } finally {
      setSaving(false);
    }
  };

  const openEditBook = (book) => {
    if (!book._id) {
      alert("Only books saved in the database can be edited here.");
      return;
    }

    setEditingBook({
      _id: book._id,
      title: book.title || "",
      author: book.author || "",
      category: book.category || "Programming",
      copies: book.copies ?? 1,
      available: book.available ?? 0,
      isbn: book.isbn || "",
    });
  };

  const handleUpdateBook = async () => {
    if (!editingBook) return;

    if (
      !editingBook.title.trim() ||
      !editingBook.author.trim() ||
      !editingBook.category.trim()
    ) {
      alert("Title, author and category cannot be empty.");
      return;
    }

    const copies = Number(editingBook.copies);
    const available = Number(editingBook.available);

    if (
      !Number.isInteger(copies) ||
      copies < 1 ||
      !Number.isInteger(available) ||
      available < 0 ||
      available > copies
    ) {
      alert("Enter valid copies and available quantities.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(`${API_URL}/${editingBook._id}`, {
        method: "PUT",
        headers: getAuthHeaders(true),
        body: JSON.stringify({
          title: editingBook.title.trim(),
          author: editingBook.author.trim(),
          category: editingBook.category.trim(),
          copies,
          available,
          isbn: editingBook.isbn.trim(),
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Failed to update book.");
      }

      const updatedBook = data.book || data;

      setApiBooks((previous) =>
        previous.map((book) =>
          book._id === editingBook._id ? updatedBook : book
        )
      );

      setEditingBook(null);
      alert("Book updated successfully!");
    } catch (error) {
      console.error("Update book error:", error);
      alert(
        error.message ||
          "Could not update the book. Check your login and permissions."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBook = async (book) => {
    if (!window.confirm(`Delete "${book.title}" from the library?`)) return;

    if (!book._id) {
      alert("This is a local Context book. Only database books can be deleted here.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${book._id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete book.");
      }

      setApiBooks((previous) =>
        previous.filter((item) => item._id !== book._id)
      );

      alert("Book deleted successfully!");
    } catch (error) {
      console.error("Delete book error:", error);
      alert(error.message || "Failed to delete book.");
    }
  };

  const handleViewBook = (book) => {
    alert(
      `${book.title}\n\n` +
        `Author: ${book.author}\n` +
        `Category: ${book.category}\n` +
        `ISBN: ${book.isbn || "Not provided"}\n` +
        `Available: ${book.available ?? 0}/${book.copies || 1}`
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-64 border-r border-slate-800 bg-slate-900 md:block">
        <div className="flex h-20 items-center gap-3 border-b border-slate-800 px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600">
            📚
          </div>
          <div>
            <h1 className="font-bold">LibManage</h1>
            <p className="text-xs text-slate-400">Librarian Portal</p>
          </div>
        </div>

        <nav className="p-4">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Main Menu
          </p>
          <Link to="/dashboard"><NavItem icon="📊" text="Dashboard" /></Link>
          <NavItem icon="📚" text="Books" active />
          <Link to="/members"><NavItem icon="👥" text="Members" /></Link>
          <Link to="/issue-borrow"><NavItem icon="🔄" text="Issue / Borrow" /></Link>
          <Link to="/returns"><NavItem icon="↩️" text="Returns" /></Link>
          <Link to="/due-overdue"><NavItem icon="⚠️" text="Due & Overdue" /></Link>
          <Link to="/notifications"><NavItem icon="📱" text="SMS Notifications" /></Link>
          <div className="my-5 border-t border-slate-800" />
          <Link to="/fine-management"><NavItem icon="💰" text="Fine Management" /></Link>
          <Link to="/settings"><NavItem icon="⚙️" text="Settings" /></Link>
        </nav>

        <div className="absolute bottom-0 w-full border-t border-slate-800 p-4">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            🚪 Logout
          </Link>
        </div>
      </aside>

      <main className="md:ml-64">
        <header className="flex h-20 items-center justify-between border-b border-slate-800 bg-slate-950 px-6">
          <div>
            <h2 className="text-xl font-bold">Books Management</h2>
            <p className="text-sm text-slate-500">Manage your library inventory</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => alert("No new notifications")}
              className="relative rounded-xl border border-slate-800 p-3 hover:bg-slate-800"
            >
              🔔
            </button>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 font-bold">
              L
            </div>
          </div>
        </header>

        <div className="p-6 lg:p-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <p className="text-sm text-indigo-400">Library Inventory</p>
              <h1 className="mt-1 text-3xl font-bold">Manage Books</h1>
              <p className="mt-2 text-slate-400">
                Add, search and manage all books in your library.
              </p>
            </div>
            <button
              onClick={() => setShowAddBook(true)}
              className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold hover:bg-indigo-500"
            >
              + Add New Book
            </button>
          </div>

          <div className="mt-4 text-xs">
            {apiLoading ? (
              <span className="text-yellow-400">Connecting to library database...</span>
            ) : apiError ? (
              <span className="text-red-400">{apiError}</span>
            ) : (
              <span className="text-green-400">● Connected to library database</span>
            )}
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MiniStat title="Total Books" value={totalBooks} icon="📚" />
            <MiniStat title="Total Copies" value={totalCopies} icon="📖" />
            <MiniStat title="Available" value={availableCopies} icon="✅" />
            <MiniStat title="Borrowed" value={borrowedCopies} icon="🔄" />
          </div>

          <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="relative flex-1">
                <span className="absolute left-4 top-3 text-slate-500">🔍</span>
                <input
                  type="text"
                  placeholder="Search by title, author, ISBN or book ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-11 pr-4 text-white outline-none focus:border-indigo-500"
                />
              </div>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-300 outline-none focus:border-indigo-500"
              >
                <option>All Categories</option>
                {categories.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
            <div className="border-b border-slate-800 p-6">
              <h2 className="font-bold">Book Inventory</h2>
              <p className="mt-1 text-sm text-slate-500">
                Showing {filteredBooks.length} books
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-950 text-sm text-slate-500">
                  <tr>
                    <th className="px-6 py-4">Book ID</th>
                    <th className="px-6 py-4">Book Details</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Copies</th>
                    <th className="px-6 py-4">Available</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredBooks.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-10 text-center text-slate-500">
                        {apiLoading
                          ? "Loading books..."
                          : apiError
                            ? "Could not load books. Check your session and backend."
                            : "No books found."}
                      </td>
                    </tr>
                  ) : (
                    filteredBooks.map((book) => (
                      <tr key={book._id || book.id} className="hover:bg-slate-800/40">
                        <td className="px-6 py-5 font-mono text-sm text-indigo-400">
                          {book._id ? book._id.slice(-6) : book.id}
                        </td>
                        <td className="px-6 py-5">
                          <p className="font-semibold">{book.title}</p>
                          <p className="mt-1 text-sm text-slate-500">{book.author}</p>
                          <p className="mt-1 text-xs text-slate-500">
                            ISBN: {book.isbn || "Not provided"}
                          </p>
                        </td>
                        <td className="px-6 py-5">{book.category}</td>
                        <td className="px-6 py-5">{book.copies || 1}</td>
                        <td className="px-6 py-5">{book.available ?? 0}</td>
                        <td className="px-6 py-5">
                          <span className={`rounded-full px-3 py-1 text-xs ${
                            Number(book.available) > 0
                              ? "bg-green-500/10 text-green-400"
                              : "bg-red-500/10 text-red-400"
                          }`}>
                            {Number(book.available) > 0 ? "Available" : "Borrowed"}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-wrap gap-2">
                            {Number(book.available) > 0 && (
                              <button
                                onClick={() => book._id
                                  ? alert("Borrow through the Issue / Borrow page.")
                                  : borrowBook(book.id)}
                                className="rounded-lg border border-green-700 px-3 py-2 text-xs text-green-400"
                              >
                                Borrow
                              </button>
                            )}
                            {Number(book.available ?? 0) < Number(book.copies || 1) && (
                              <button
                                onClick={() => book._id
                                  ? alert("Return through the Returns page.")
                                  : returnBook(book.id)}
                                className="rounded-lg border border-blue-700 px-3 py-2 text-xs text-blue-400"
                              >
                                Return
                              </button>
                            )}
                            <button
                              onClick={() => handleViewBook(book)}
                              className="rounded-lg border border-slate-700 px-3 py-2 text-xs"
                            >
                              View
                            </button>
                            <button
                              onClick={() => openEditBook(book)}
                              className="rounded-lg border border-indigo-700 px-3 py-2 text-xs text-indigo-300"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteBook(book)}
                              className="rounded-lg border border-red-700 px-3 py-2 text-xs text-red-400"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {showAddBook && (
        <BookModal
          title="Add New Book"
          book={newBook}
          setBook={setNewBook}
          saving={saving}
          onClose={() => setShowAddBook(false)}
          onSave={handleAddBook}
          saveText="Add Book"
        />
      )}

      {editingBook && (
        <BookModal
          title="Edit Book Details"
          book={editingBook}
          setBook={setEditingBook}
          saving={saving}
          onClose={() => setEditingBook(null)}
          onSave={handleUpdateBook}
          saveText="Save Changes"
          editing
        />
      )}
    </div>
  );
}

function BookModal({
  title,
  book,
  setBook,
  saving,
  onClose,
  onSave,
  saveText,
  editing = false,
}) {
  const update = (field, value) =>
    setBook((previous) => ({ ...previous, [field]: value }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 px-4 py-8">
      <div className="my-auto w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">{title}</h2>
            <p className="mt-1 text-sm text-slate-500">
              {editing ? "Update the existing book record." : "Add a book to your library."}
            </p>
          </div>
          <button onClick={onClose} className="text-xl text-slate-400">✕</button>
        </div>

        <div className="mt-6 space-y-4">
          <Input
            label="Book Title"
            value={book.title}
            placeholder="Enter book title"
            onChange={(e) => update("title", e.target.value)}
          />
          <Input
            label="Author"
            value={book.author}
            placeholder="Enter author name"
            onChange={(e) => update("author", e.target.value)}
          />
          <Input
            label="Category"
            value={book.category}
            placeholder="e.g. Programming"
            onChange={(e) => update("category", e.target.value)}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Number of Copies"
              type="number"
              value={book.copies}
              onChange={(e) => update("copies", e.target.value)}
            />
            {editing && (
              <Input
                label="Available Copies"
                type="number"
                value={book.available}
                onChange={(e) => update("available", e.target.value)}
              />
            )}
          </div>
          <Input
            label="ISBN"
            placeholder="Paste ISBN number here"
            value={book.isbn}
            onChange={(e) => update("isbn", e.target.value)}
          />
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            disabled={saving}
            className="flex-1 rounded-xl border border-slate-700 py-3 font-semibold hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={saving}
            className="flex-1 rounded-xl bg-indigo-600 py-3 font-semibold hover:bg-indigo-500 disabled:opacity-50"
          >
            {saving ? "Saving..." : saveText}
          </button>
        </div>
      </div>
    </div>
  );
}

function NavItem({ icon, text, active }) {
  return (
    <div className={`mb-1 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium ${
      active
        ? "bg-indigo-600 text-white"
        : "text-slate-400 hover:bg-slate-800 hover:text-white"
    }`}>
      <span>{icon}</span>
      {text}
    </div>
  );
}

function MiniStat({ title, value, icon }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="mt-2 text-2xl font-bold">{value}</p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-800 text-xl">
          {icon}
        </div>
      </div>
    </div>
  );
}

function Input({ label, placeholder, type = "text", value, onChange }) {
  return (
    <div>
      <label className="text-sm font-medium text-slate-300">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value ?? ""}
        onChange={onChange}
        className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
      />
    </div>
  );
}

export default Books;
