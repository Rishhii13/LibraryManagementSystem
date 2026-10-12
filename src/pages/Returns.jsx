import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { LibraryContext } from "../context/LibraryContext";

function Returns() {
  const {
    books,
    returnRecords,
    completeReturn,
  } = useContext(LibraryContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  /* ================= SEARCH ================= */

  const filteredRecords = returnRecords.filter((record) =>
    record.student
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
    record.book
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
    record.id
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  /* ================= RETURN BOOK ================= */

  const handleReturn = () => {
    if (!selectedRecord) {
      return;
    }

    completeReturn(selectedRecord.id);

    setSelectedRecord(null);
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  /* ================= COUNTS ================= */

  const activeReturns = returnRecords.filter(
    (record) =>
      record.status === "Active" ||
      record.status === "Due Today" ||
      record.status === "Overdue"
  ).length;

  const returnedBooks = returnRecords.filter(
    (record) => record.status === "Returned"
  ).length;

  const overdueBooks = returnRecords.filter(
    (record) => record.status === "Overdue"
  ).length;

  return (
    <div className="min-h-screen bg-slate-100 flex">

      {/* ================= SIDEBAR ================= */}

      <aside className="w-64 bg-slate-900 text-white min-h-screen p-5">

        <div className="mb-8">
          <h1 className="text-2xl font-bold">
            LibManage
          </h1>

          <p className="text-slate-400 text-sm mt-1">
            Librarian Portal
          </p>
        </div>

        <nav className="space-y-2">

          <Link
            to="/dashboard"
            className="sidebar-item flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            📊
            <span>Dashboard</span>
          </Link>

          <Link
            to="/books"
            className="sidebar-item flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            📚
            <span>Books</span>
          </Link>

          <Link
            to="/members"
            className="sidebar-item flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            👥
            <span>Members</span>
          </Link>

          <Link
            to="/issue-borrow"
            className="sidebar-item flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            📤
            <span>Issue / Borrow</span>
          </Link>

          <Link
            to="/returns"
            className="sidebar-item flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-800 text-white"
          >
            📥
            <span>Returns</span>
          </Link>

          <Link
            to="/due-overdue"
            className="sidebar-item flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            ⏰
            <span>Due & Overdue</span>
          </Link>

          <Link
            to="/notifications"
            className="sidebar-item flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            🔔
            <span>SMS Notifications</span>
          </Link>

          <Link
            to="/fine-management"
            className="sidebar-item flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            💰
            <span>Fine Management</span>
          </Link>

          <Link
            to="/settings"
            className="sidebar-item flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            ⚙️
            <span>Settings</span>
          </Link>

        </nav>
      </aside>

      {/* ================= MAIN CONTENT ================= */}

      <main className="flex-1 p-8">

        {/* HEADER */}

        <div className="flex justify-between items-center mb-8">

          <div>
            <h2 className="text-3xl font-bold text-slate-800">
              Returns
            </h2>

            <p className="text-slate-500 mt-1">
              Manage returned books and return transactions
            </p>
          </div>

          <div className="bg-white px-4 py-3 rounded-xl shadow-sm">
            <p className="text-sm text-slate-500">
              Return Policy
            </p>

            <p className="font-semibold text-slate-800">
              ₹10/day fine
            </p>
          </div>

        </div>

        {/* ================= SUCCESS MESSAGE ================= */}

        {showSuccess && (
          <div className="mb-6 bg-green-100 border border-green-300 text-green-700 px-5 py-4 rounded-xl">
            <div className="font-semibold">
              Book returned successfully!
            </div>

            <div className="text-sm mt-1">
              The return transaction has been updated.
            </div>
          </div>
        )}

        {/* ================= STATISTICS ================= */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-slate-500 text-sm">
              Active Returns
            </p>

            <h3 className="text-3xl font-bold text-slate-800 mt-2">
              {activeReturns}
            </h3>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-slate-500 text-sm">
              Returned Books
            </p>

            <h3 className="text-3xl font-bold text-slate-800 mt-2">
              {returnedBooks}
            </h3>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-slate-500 text-sm">
              Overdue Returns
            </p>

            <h3 className="text-3xl font-bold text-red-600 mt-2">
              {overdueBooks}
            </h3>
          </div>

        </div>

        {/* ================= SEARCH ================= */}

        <div className="bg-white rounded-2xl shadow-sm p-6">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

            <div>
              <h3 className="text-xl font-bold text-slate-800">
                Return Transactions
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                Track all issued and returned books
              </p>
            </div>

            <input
              type="text"
              placeholder="Search student, book or transaction..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
              className="custom-input border border-slate-300 rounded-lg px-4 py-2 w-full md:w-80"
            />

          </div>

          {/* ================= TABLE ================= */}

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>
                <tr className="border-b border-slate-200 text-left">

                  <th className="py-4 px-3 text-sm font-semibold text-slate-600">
                    Transaction ID
                  </th>

                  <th className="py-4 px-3 text-sm font-semibold text-slate-600">
                    Student
                  </th>

                  <th className="py-4 px-3 text-sm font-semibold text-slate-600">
                    Book
                  </th>

                  <th className="py-4 px-3 text-sm font-semibold text-slate-600">
                    Issue Date
                  </th>

                  <th className="py-4 px-3 text-sm font-semibold text-slate-600">
                    Due Date
                  </th>

                  <th className="py-4 px-3 text-sm font-semibold text-slate-600">
                    Status
                  </th>

                  <th className="py-4 px-3 text-sm font-semibold text-slate-600">
                    Action
                  </th>

                </tr>
              </thead>

              <tbody>

                {filteredRecords.map((record) => (

                  <tr
                    key={record.id}
                    className="table-row border-b border-slate-100"
                  >

                    <td className="py-4 px-3 font-medium text-slate-800">
                      {record.id}
                    </td>

                    <td className="py-4 px-3 text-slate-700">
                      {record.student}
                    </td>

                    <td className="py-4 px-3 text-slate-700">
                      {record.book}
                    </td>

                    <td className="py-4 px-3 text-slate-600">
                      {record.issueDate}
                    </td>

                    <td className="py-4 px-3 text-slate-600">
                      {record.dueDate}
                    </td>

                    <td className="py-4 px-3">

                      <span
                        className={`status-badge ${
                          record.status === "Returned"
                            ? "bg-green-100 text-green-700"
                            : record.status === "Overdue"
                            ? "bg-red-100 text-red-700"
                            : record.status === "Due Today"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {record.status}
                      </span>

                    </td>

                    <td className="py-4 px-3">

                      {record.status !== "Returned" ? (
                        <button
                          onClick={() =>
                            setSelectedRecord(record)
                          }
                          className="custom-button bg-slate-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-slate-700"
                        >
                          Return
                        </button>
                      ) : (
                        <span className="text-green-600 text-sm font-medium">
                          Completed
                        </span>
                      )}

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      </main>

      {/* ================= RETURN MODAL ================= */}

      {selectedRecord && (

        <div className="modal-overlay">

          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 mx-4">

            <h3 className="text-xl font-bold text-slate-800">
              Confirm Book Return
            </h3>

            <p className="text-slate-500 text-sm mt-2">
              Please confirm that the following book has been returned.
            </p>

            <div className="bg-slate-50 rounded-xl p-4 mt-5 space-y-3">

              <div>
                <p className="text-xs text-slate-500">
                  Student
                </p>

                <p className="font-semibold text-slate-800">
                  {selectedRecord.student}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">
                  Book
                </p>

                <p className="font-semibold text-slate-800">
                  {selectedRecord.book}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">
                  Due Date
                </p>

                <p className="font-semibold text-slate-800">
                  {selectedRecord.dueDate}
                </p>
              </div>

            </div>

            <div className="flex justify-end gap-3 mt-6">

              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>

              <button
                onClick={handleReturn}
                className="px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-700"
              >
                Confirm Return
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Returns;