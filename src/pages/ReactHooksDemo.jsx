
import { useContext, useEffect, useState } from "react";
import { LibraryContext } from "../context/LibraryContext";
import useLibraryStats from "../hooks/useLibraryStats";

function ReactHooksDemo() {
  const {
    librarianName,
    books,
    totalBooks,
    availableBooks,
    borrowedBooks,
    setLibrarianName,
    addBook,
  } = useContext(LibraryContext);

  // Custom Hook
  const stats = useLibraryStats(books);

  // useState
  const [bookTitle, setBookTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("Programming");
  const [message, setMessage] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");

  // useEffect
  useEffect(() => {
    setLastUpdated(new Date().toLocaleTimeString());
  }, [books]);

  const handleAddBook = (e) => {
    e.preventDefault();

    if (!bookTitle.trim() || !author.trim()) {
      setMessage("Please enter the book title and author.");
      return;
    }

    addBook({
      title: bookTitle.trim(),
      author: author.trim(),
      category,
      available: 1,
      copies: 1,
    });

    setBookTitle("");
    setAuthor("");
    setMessage("Book added successfully!");
  };

  const changeLibrarian = () => {
    const name = prompt("Enter librarian name:", librarianName);

    if (name && name.trim()) {
      setLibrarianName(name.trim());
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              React Hooks Demo
            </h1>
            <p className="mt-2 text-slate-600">
              Library Management System — Experiment 2
            </p>
          </div>

          <a
            href="/dashboard"
            className="rounded-lg bg-slate-900 px-4 py-2 text-white"
          >
            Back to Dashboard
          </a>
        </header>

        {/* useContext */}
        <section className="mb-6 rounded-xl bg-white p-6 shadow">
          <h2 className="mb-3 text-xl font-bold">1. useContext</h2>
          <p className="text-slate-700">
            Librarian: <strong>{librarianName}</strong>
          </p>
          <p className="mt-2 text-sm text-slate-500">
            This component reads shared library data directly from
            LibraryContext.
          </p>
          <button
            onClick={changeLibrarian}
            className="mt-4 rounded-lg bg-purple-600 px-4 py-2 text-white"
          >
            Change Librarian
          </button>
        </section>

        {/* useState */}
        <section className="mb-6 rounded-xl bg-white p-6 shadow">
          <h2 className="mb-3 text-xl font-bold">2. useState</h2>
          <p className="mb-4 text-sm text-slate-600">
            Enter a book below. The form fields, message and shared book
            data update using state.
          </p>

          <form onSubmit={handleAddBook} className="grid gap-3 md:grid-cols-3">
            <input
              value={bookTitle}
              onChange={(e) => setBookTitle(e.target.value)}
              placeholder="Book title"
              className="rounded-lg border p-3"
            />

            <input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Author"
              className="rounded-lg border p-3"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-lg border bg-white p-3"
            >
              <option>Programming</option>
              <option>Database</option>
              <option>Operating System</option>
              <option>Networking</option>
              <option>IoT</option>
              <option>Cloud Computing</option>
              <option>Other</option>
            </select>

            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-3 font-medium text-white md:col-span-3"
            >
              Add Book
            </button>
          </form>

          {message && (
            <p className="mt-3 text-sm font-medium text-blue-700">
              {message}
            </p>
          )}
        </section>

        {/* Statistics */}
        <section className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl bg-white p-5 shadow">
            <p className="text-sm text-slate-500">Total Books</p>
            <p className="mt-2 text-3xl font-bold">{totalBooks}</p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow">
            <p className="text-sm text-slate-500">Books with Available Copies</p>
            <p className="mt-2 text-3xl font-bold text-green-600">
              {availableBooks}
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow">
            <p className="text-sm text-slate-500">Books with No Available Copies</p>
            <p className="mt-2 text-3xl font-bold text-red-600">
              {borrowedBooks}
            </p>
          </div>
        </section>

        {/* Custom Hook */}
        <section className="mb-6 rounded-xl bg-white p-6 shadow">
          <h2 className="mb-3 text-xl font-bold">
            3. Custom Hook — useLibraryStats
          </h2>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Custom Total</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>

            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Custom Available</p>
              <p className="text-2xl font-bold text-green-600">
                {stats.available}
              </p>
            </div>

            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Custom Borrowed</p>
              <p className="text-2xl font-bold text-red-600">
                {stats.borrowed}
              </p>
            </div>
          </div>
        </section>

        {/* useEffect */}
        <section className="mb-6 rounded-xl bg-white p-6 shadow">
          <h2 className="mb-2 text-xl font-bold">4. useEffect</h2>
          <p className="text-slate-600">
            Last book-data update:{" "}
            <strong>{lastUpdated || "Waiting for update..."}</strong>
          </p>
          <p className="mt-2 text-sm text-slate-500">
            The effect runs when the books array changes.
          </p>
        </section>

        {/* Book list */}
        <section className="rounded-xl bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-bold">
            Books from Shared Context ({books.length})
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b bg-slate-50">
                  <th className="p-3">Title</th>
                  <th className="p-3">Author</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Available</th>
                </tr>
              </thead>

              <tbody>
                {books.map((book) => (
                  <tr key={book.id} className="border-b">
                    <td className="p-3">{book.title}</td>
                    <td className="p-3">{book.author}</td>
                    <td className="p-3">{book.category}</td>
                    <td className="p-3">{book.available}</td>
                  </tr>
                ))}

                {books.length === 0 && (
                  <tr>
                    <td colSpan="4" className="p-4 text-center">
                      No books available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <p className="mt-6 text-sm text-slate-500">
          Note: This demo uses in-memory React state. Newly added books reset
          when the application reloads; persistent storage is a separate task.
        </p>
      </div>
    </div>
  );
}

export default ReactHooksDemo;
