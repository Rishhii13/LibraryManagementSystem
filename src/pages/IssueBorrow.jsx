import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { LibraryContext } from "../context/LibraryContext";

function IssueBorrow() {
  const {
    books,
    borrowBook,
    addReturnRecord,
  } = useContext(LibraryContext);

  const [student, setStudent] = useState("");
  const [book, setBook] = useState("");
  const [duration, setDuration] = useState("14");
  const [issueDate, setIssueDate] = useState("30 Aug 2026");
  const [showSuccess, setShowSuccess] = useState(false);

  const students = [
    { id: "STU001", name: "Rahul Sharma", phone: "+91 98765 43210" },
    { id: "STU002", name: "Priya Patel", phone: "+91 97654 32109" },
    { id: "STU003", name: "Amit Shah", phone: "+91 98987 65432" },
    { id: "STU004", name: "Neha Mehta", phone: "+91 91234 56789" },
  ];

  const selectedStudent = students.find(
    (s) => s.id === student
  );

  const selectedBook = books.find(
    (b) => b.id === Number(book)
  );

  const calculateDueDate = () => {
    if (!issueDate) return "-";

    const date = new Date("2026-08-30");

    date.setDate(
      date.getDate() + Number(duration)
    );

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleIssue = () => {
    if (!student || !book) {
      alert("Please select both student and book.");
      return;
    }

    if (!selectedBook) {
      alert("Selected book was not found.");
      return;
    }

    if (selectedBook.available <= 0) {
      alert("This book is currently unavailable.");
      return;
    }

    /* Decrease available book copies */
    borrowBook(selectedBook.id);

    /* Create shared return transaction */
    addReturnRecord({
      id: `TXN${Date.now()}`,
      student: selectedStudent.name,
      book: selectedBook.title,
      issueDate: "2026-08-30",
      dueDate: calculateDueDate(),
      returnDate: "",
      status: "Active",
    });

    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* SIDEBAR */}
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-64 border-r border-slate-800 bg-slate-900 md:block">

        <div className="flex h-20 items-center gap-3 border-b border-slate-800 px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600">
            📚
          </div>

          <div>
            <h1 className="font-bold">LibManage</h1>

            <p className="text-xs text-slate-400">
              Librarian Portal
            </p>
          </div>
        </div>

        <nav className="p-4">

          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Main Menu
          </p>

          <Link to="/dashboard">
            <NavItem icon="📊" text="Dashboard" />
          </Link>

          <Link to="/books">
            <NavItem icon="📚" text="Books" />
          </Link>

          <Link to="/members">
            <NavItem icon="👥" text="Members" />
          </Link>

          <NavItem
            icon="🔄"
            text="Issue / Borrow"
            active
          />

          <Link to="/returns">
            <NavItem icon="↩️" text="Returns" />
          </Link>

          <Link to="/due-overdue">
            <NavItem icon="⚠️" text="Due & Overdue" />
          </Link>

          <Link to="/notifications">
            <NavItem icon="📱" text="SMS Notifications" />
          </Link>

          <div className="my-5 border-t border-slate-800" />

          <NavItem icon="💰" text="Fine Management" />

          <NavItem icon="⚙️" text="Settings" />

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

      {/* MAIN */}
      <main className="md:ml-64">

        {/* TOPBAR */}
        <header className="flex h-20 items-center justify-between border-b border-slate-800 px-6">

          <div>

            <h2 className="text-xl font-bold">
              Issue / Borrow
            </h2>

            <p className="text-sm text-slate-500">
              Issue books to registered library members
            </p>

          </div>

          <div className="flex items-center gap-4">

            <button className="relative rounded-xl border border-slate-800 p-3">
              🔔

              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
            </button>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 font-bold">
              L
            </div>

          </div>

        </header>

        <div className="p-6 lg:p-8">

          {/* PAGE HEADING */}
          <div>

            <p className="text-sm text-indigo-400">
              Library Transactions
            </p>

            <h1 className="mt-1 text-3xl font-bold">
              Issue a Book
            </h1>

            <p className="mt-2 text-slate-400">
              Select a member, book and borrowing duration.
            </p>

          </div>

          {/* SUCCESS MESSAGE */}
          {showSuccess && (
            <div className="mt-6 rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-green-400">
              ✅ Book issued successfully! Due date has been calculated.
            </div>
          )}

          <div className="mt-8 grid gap-6 lg:grid-cols-3">

            {/* FORM */}
            <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900 p-6">

              <h2 className="text-xl font-bold">
                Borrow Details
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Enter the borrowing information below.
              </p>

              {/* STUDENT */}
              <div className="mt-6">

                <label className="text-sm font-medium text-slate-300">
                  Select Student
                </label>

                <select
                  value={student}
                  onChange={(e) => setStudent(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
                >

                  <option value="">
                    Select a student
                  </option>

                  {students.map((item) => (
                    <option
                      key={item.id}
                      value={item.id}
                    >
                      {item.name} — {item.id}
                    </option>
                  ))}

                </select>

              </div>

              {/* STUDENT INFO */}
              {selectedStudent && (
                <div className="mt-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4">

                  <div className="flex items-center justify-between">

                    <div>

                      <p className="font-semibold">
                        {selectedStudent.name}
                      </p>

                      <p className="mt-1 text-sm text-slate-400">
                        Student ID: {selectedStudent.id}
                      </p>

                    </div>

                    <div className="text-right">

                      <p className="text-xs text-slate-500">
                        Registered Phone
                      </p>

                      <p className="mt-1 text-sm text-indigo-400">
                        📱 {selectedStudent.phone}
                      </p>

                    </div>

                  </div>

                </div>
              )}

              {/* BOOK */}
              <div className="mt-6">

                <label className="text-sm font-medium text-slate-300">
                  Select Book
                </label>

                <select
                  value={book}
                  onChange={(e) => setBook(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
                >

                  <option value="">
                    Select a book
                  </option>

                  {books.map((item) => (
                    <option
                      key={item.id}
                      value={item.id}
                      disabled={item.available <= 0}
                    >
                      {item.title} — {item.available} available
                    </option>
                  ))}

                </select>

              </div>

              {/* BOOK INFO */}
              {selectedBook && (
                <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-4">

                  <div className="flex items-center justify-between">

                    <div>

                      <p className="font-semibold">
                        {selectedBook.title}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {selectedBook.author}
                      </p>

                    </div>

                    <div
                      className={`rounded-lg px-3 py-2 text-sm ${
                        selectedBook.available > 0
                          ? "bg-green-500/10 text-green-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {selectedBook.available} Available
                    </div>

                  </div>

                </div>
              )}

              {/* DATE + DURATION */}
              <div className="mt-6 grid gap-4 md:grid-cols-2">

                <div>

                  <label className="text-sm font-medium text-slate-300">
                    Issue Date
                  </label>

                  <input
                    type="text"
                    value={issueDate}
                    onChange={(e) =>
                      setIssueDate(e.target.value)
                    }
                    className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
                  />

                </div>

                <div>

                  <label className="text-sm font-medium text-slate-300">
                    Borrow Duration
                  </label>

                  <select
                    value={duration}
                    onChange={(e) =>
                      setDuration(e.target.value)
                    }
                    className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
                  >

                    <option value="7">
                      7 Days
                    </option>

                    <option value="14">
                      14 Days
                    </option>

                    <option value="21">
                      21 Days
                    </option>

                    <option value="30">
                      30 Days
                    </option>

                  </select>

                </div>

              </div>

              {/* DUE DATE */}
              <div className="mt-6 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-5">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-sm text-slate-500">
                      Automatically Calculated Due Date
                    </p>

                    <p className="mt-1 text-xl font-bold text-yellow-400">
                      {calculateDueDate()}
                    </p>

                  </div>

                  <div className="text-3xl">
                    📅
                  </div>

                </div>

              </div>

              {/* SMS */}
              <div className="mt-5 rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4">

                <div className="flex gap-3">

                  <div className="text-xl">
                    📱
                  </div>

                  <div>

                    <p className="font-semibold">
                      SMS Notification
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                      The student will receive an SMS containing the book
                      details and due date.
                    </p>

                  </div>

                </div>

              </div>

              {/* BUTTON */}
              <button
                onClick={handleIssue}
                className="mt-6 w-full rounded-xl bg-indigo-600 py-4 font-bold hover:bg-indigo-500"
              >
                📚 Issue Book
              </button>

            </div>

            {/* SUMMARY */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

              <h2 className="text-xl font-bold">
                Issue Summary
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Review before issuing
              </p>

              <div className="mt-6 space-y-5">

                <SummaryRow
                  label="Student"
                  value={
                    selectedStudent
                      ? selectedStudent.name
                      : "Not selected"
                  }
                />

                <SummaryRow
                  label="Student ID"
                  value={
                    selectedStudent
                      ? selectedStudent.id
                      : "-"
                  }
                />

                <SummaryRow
                  label="Book"
                  value={
                    selectedBook
                      ? selectedBook.title
                      : "Not selected"
                  }
                />

                <SummaryRow
                  label="Issue Date"
                  value={issueDate}
                />

                <SummaryRow
                  label="Duration"
                  value={`${duration} Days`}
                />

                <div className="border-t border-slate-800 pt-5">

                  <p className="text-sm text-slate-500">
                    Due Date
                  </p>

                  <p className="mt-2 text-xl font-bold text-yellow-400">
                    {calculateDueDate()}
                  </p>

                </div>

              </div>

              {/* RULES */}
              <div className="mt-8 rounded-xl bg-slate-950 p-4">

                <p className="font-semibold">
                  📌 Library Rules
                </p>

                <ul className="mt-3 space-y-2 text-xs text-slate-500">

                  <li>• Return books before the due date.</li>

                  <li>• Overdue books may generate a fine.</li>

                  <li>• SMS reminders are sent before due date.</li>

                  <li>• Overdue notifications are sent automatically.</li>

                </ul>

              </div>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}


/* NAV ITEM */

function NavItem({ icon, text, active }) {
  return (
    <div
      className={`mb-1 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium ${
        active
          ? "bg-indigo-600 text-white"
          : "text-slate-400 hover:bg-slate-800 hover:text-white"
      }`}
    >
      <span>{icon}</span>
      {text}
    </div>
  );
}


/* SUMMARY ROW */

function SummaryRow({ label, value }) {
  return (
    <div>

      <p className="text-xs uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-1 font-medium text-slate-200">
        {value}
      </p>

    </div>
  );
}

export default IssueBorrow;