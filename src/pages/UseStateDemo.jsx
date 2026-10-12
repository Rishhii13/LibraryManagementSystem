import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LibraryContext } from "../context/LibraryContext";
import useLibraryStats from "../hooks/useLibraryStats";

function UseStateDemo() {
  const {
    librarianName,
    setLibrarianName,
    books,
    addBook,
    deleteBook,
    borrowBook,
    returnBook,
  } = useContext(LibraryContext);

  const { total, available, borrowed } = useLibraryStats(books);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [lastUpdated, setLastUpdated] = useState(
    new Date().toLocaleTimeString()
  );

  useEffect(() => {
    setLastUpdated(new Date().toLocaleTimeString());
  }, [books]);

  const handleAddBook = (e) => {
    e.preventDefault();

    if (!title || !author || !category) {
      alert("Please fill all fields.");
      return;
    }

    addBook({
      title,
      author,
      category,
      available: 1,
    });

    setTitle("");
    setAuthor("");
    setCategory("");
  };

  const handleChangeLibrarian = () => {
    const newName = prompt("Enter librarian name:", librarianName);

    if (newName) {
      setLibrarianName(newName);
    }
  };

  const categories = [
    "All",
    ...new Set(books.map((book) => book.category)),
  ];

  const addBookCategories = [
    "Programming",
    "Database",
    "Operating System",
    "Networking",
    "IoT",
    "Cloud Computing",
    "Other",
  ];

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      filterCategory === "All" ||
      book.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-100">

      {/* Header */}
      <header className="bg-slate-900 text-white px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">
              Library Management System
            </h1>

            <p className="text-slate-300 text-sm">
              Experiment 3 - Context API
            </p>
          </div>

          <Link
            to="/dashboard"
            className="bg-white text-slate-900 px-4 py-2 rounded-lg font-medium"
          >
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">

        {/* Context API */}
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-5 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-purple-600 font-semibold">
                CONTEXT API
              </p>

              <h2 className="text-xl font-bold text-purple-900 mt-1">
                Librarian: {librarianName}
              </h2>

              <p className="text-purple-700 text-sm mt-1">
                Library data is shared globally using React Context API.
              </p>
            </div>

            <button
              onClick={handleChangeLibrarian}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
            >
              Change Librarian
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">

          <div className="bg-white rounded-xl shadow p-5">
            <p className="text-slate-500 text-sm">
              Total Books
            </p>

            <h2 className="text-3xl font-bold text-slate-900 mt-2">
              {total}
            </h2>
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <p className="text-slate-500 text-sm">
              Available Books
            </p>

            <h2 className="text-3xl font-bold text-green-600 mt-2">
              {available}
            </h2>
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <p className="text-slate-500 text-sm">
              Currently Borrowed
            </p>

            <h2 className="text-3xl font-bold text-red-600 mt-2">
              {borrowed}
            </h2>
          </div>

        </div>

        {/* Add Book */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">

          <h2 className="text-xl font-bold text-slate-900 mb-4">
            Add New Book
          </h2>

          <form
            onSubmit={handleAddBook}
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
          >

            {/* Book Title */}
            <input
              type="text"
              placeholder="Book Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border rounded-lg px-4 py-2"
            />

            {/* Author */}
            <input
              type="text"
              placeholder="Author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="border rounded-lg px-4 py-2"
            />

            {/* Category Dropdown */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border rounded-lg px-4 py-2 bg-white"
            >
              <option value="">
                Select Category
              </option>

              {addBookCategories.map((categoryName) => (
                <option
                  key={categoryName}
                  value={categoryName}
                >
                  {categoryName}
                </option>
              ))}
            </select>

            {/* Add Button */}
            <button
              type="submit"
              className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700"
            >
              Add Book
            </button>

          </form>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <input
              type="text"
              placeholder="Search by title or author..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded-lg px-4 py-2"
            />

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="border rounded-lg px-4 py-2"
            >
              {categories.map((categoryName) => (
                <option
                  key={categoryName}
                  value={categoryName}
                >
                  {categoryName}
                </option>
              ))}
            </select>

          </div>
        </div>

        {/* Books Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">

          <div className="p-6 border-b">

            <div className="flex justify-between items-center">

              <h2 className="text-xl font-bold text-slate-900">
                Library Books
              </h2>

              <p className="text-sm text-slate-500">
                Last Updated: {lastUpdated}
              </p>

            </div>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-slate-50">

                <tr>

                  <th className="text-left px-6 py-3">
                    Book
                  </th>

                  <th className="text-left px-6 py-3">
                    Author
                  </th>

                  <th className="text-left px-6 py-3">
                    Category
                  </th>

                  <th className="text-left px-6 py-3">
                    Available
                  </th>

                  <th className="text-left px-6 py-3">
                    Borrow / Return
                  </th>

                  <th className="text-left px-6 py-3">
                    Delete
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredBooks.map((book) => (

                  <tr
                    key={book.id}
                    className="border-t hover:bg-slate-50"
                  >

                    <td className="px-6 py-4 font-medium">
                      {book.title}
                    </td>

                    <td className="px-6 py-4">
                      {book.author}
                    </td>

                    <td className="px-6 py-4">
                      {book.category}
                    </td>

                    <td className="px-6 py-4 font-semibold">
                      {book.available}
                    </td>

                    <td className="px-6 py-4">

                      <div className="flex gap-2">

                        <button
                          onClick={() => borrowBook(book.id)}
                          disabled={book.available === 0}
                          className={`px-3 py-1 rounded text-sm text-white ${
                            book.available === 0
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-orange-500 hover:bg-orange-600"
                          }`}
                        >
                          Borrow
                        </button>

                        <button
                          onClick={() => returnBook(book.id)}
                          className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                        >
                          Return
                        </button>

                      </div>

                    </td>

                    <td className="px-6 py-4">

                      <button
                        onClick={() => deleteBook(book.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                      >
                        Delete
                      </button>

                    </td>

                  </tr>

                ))}

                {filteredBooks.length === 0 && (

                  <tr>

                    <td
                      colSpan="6"
                      className="text-center py-8 text-slate-500"
                    >
                      No books found.
                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>

        {/* Experiment Explanation */}
        <div className="bg-white rounded-xl shadow p-6 mt-6">

          <h2 className="text-xl font-bold mb-4">
            Experiment 3 Concepts
          </h2>

          <div className="space-y-2 text-slate-700">

            <p>
              <strong>Context API:</strong> Shares library data
              between components without passing props manually.
            </p>

            <p>
              <strong>Global State:</strong> Books, librarian
              information and library operations are managed from
              LibraryContext.
            </p>

            <p>
              <strong>Reusable Functions:</strong> Add, delete,
              borrow and return operations are available through
              the Context API.
            </p>

          </div>

        </div>

      </main>

    </div>
  );
}

export default UseStateDemo;