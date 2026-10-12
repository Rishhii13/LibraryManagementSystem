import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { LibraryContext } from "../context/LibraryContext";

function FineManagement() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const {
    returnRecords,
    paidFines,
    markFinePaid,
  } = useContext(LibraryContext);

  const students = [
    {
      name: "Rahul Sharma",
      id: "STU001",
    },
    {
      name: "Priya Patel",
      id: "STU002",
    },
    {
      name: "Amit Shah",
      id: "STU003",
    },
    {
      name: "Neha Mehta",
      id: "STU004",
    },
  ];

  /*
    Create fine records from shared return records.
    Overdue records are used to calculate fines.
  */

  const fines = returnRecords
    .filter((record) => record.status === "Overdue")
    .map((record) => {
      const studentInfo = students.find(
        (student) => student.name === record.student
      );

      const dueDate = new Date(record.dueDate);
      const today = new Date("2026-08-30");

      const difference =
        today.getTime() - dueDate.getTime();

      const lateDays = Math.max(
        1,
        Math.ceil(
          difference /
            (1000 * 60 * 60 * 24)
        )
      );

      const fine = lateDays * 10;

      const fineId = `F-${record.id}`;

      const status = paidFines.includes(fineId)
        ? "Paid"
        : "Pending";

      return {
        id: fineId,
        student: record.student,
        studentId: studentInfo
          ? studentInfo.id
          : "-",
        book: record.book,
        dueDate: new Date(
          record.dueDate
        ).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        returnedDate:
          record.returnDate || "-",
        lateDays,
        fine,
        status,
      };
    });

  const filteredFines = fines.filter((item) => {
    const matchesFilter =
      filter === "All" ||
      item.status === filter;

    const searchValue =
      search.toLowerCase();

    const matchesSearch =
      item.student
        .toLowerCase()
        .includes(searchValue) ||
      item.studentId
        .toLowerCase()
        .includes(searchValue) ||
      item.book
        .toLowerCase()
        .includes(searchValue);

    return (
      matchesFilter &&
      matchesSearch
    );
  });

  const totalFine = fines.reduce(
    (total, item) =>
      total + item.fine,
    0
  );

  const pendingFine = fines
    .filter(
      (item) =>
        item.status === "Pending"
    )
    .reduce(
      (total, item) =>
        total + item.fine,
      0
    );

  const paidFine = fines
    .filter(
      (item) =>
        item.status === "Paid"
    )
    .reduce(
      (total, item) =>
        total + item.fine,
      0
    );

  const studentsWithFines =
    new Set(
      fines.map(
        (item) => item.studentId
      )
    ).size;

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* SIDEBAR */}

      <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-slate-800 bg-slate-900 md:block">

        <div className="flex h-20 items-center gap-3 border-b border-slate-800 px-6">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-xl">
            📚
          </div>

          <div>
            <h1 className="font-bold">
              LibManage
            </h1>

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
            <NavItem
              icon="📊"
              text="Dashboard"
            />
          </Link>

          <Link to="/books">
            <NavItem
              icon="📚"
              text="Books"
            />
          </Link>

          <Link to="/members">
            <NavItem
              icon="👥"
              text="Members"
            />
          </Link>

          <Link to="/issue-borrow">
            <NavItem
              icon="🔄"
              text="Issue / Borrow"
            />
          </Link>

          <Link to="/returns">
            <NavItem
              icon="↩️"
              text="Returns"
            />
          </Link>

          <Link to="/due-overdue">
            <NavItem
              icon="⚠️"
              text="Due & Overdue"
            />
          </Link>

          <Link to="/notifications">
            <NavItem
              icon="📱"
              text="SMS Notifications"
            />
          </Link>

          <div className="my-5 border-t border-slate-800" />

          {/* ACTIVE */}

          <NavItem
            icon="💰"
            text="Fine Management"
            active
          />

          {/* SETTINGS */}

          <Link to="/settings">
            <NavItem
              icon="⚙️"
              text="Settings"
            />
          </Link>

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
              Fine Management
            </h2>

            <p className="text-sm text-slate-500">
              Manage library fines and payments
            </p>
          </div>

          <div className="flex items-center gap-4">

            <button className="relative rounded-xl border border-slate-800 p-3">
              🔔
            </button>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 font-bold">
              L
            </div>

          </div>

        </header>

        {/* CONTENT */}

        <div className="p-6 lg:p-8">

          <p className="text-sm text-indigo-400">
            Library Finance
          </p>

          <h1 className="mt-1 text-3xl font-bold">
            Fine Management
          </h1>

          <p className="mt-2 text-slate-400">
            Track overdue fines, payments and outstanding balances.
          </p>

          {/* STATISTICS */}

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <StatCard
              title="Total Fines"
              value={`₹${totalFine}`}
              icon="💰"
            />

            <StatCard
              title="Pending Fines"
              value={`₹${pendingFine}`}
              icon="⏳"
            />

            <StatCard
              title="Collected"
              value={`₹${paidFine}`}
              icon="✓"
            />

            <StatCard
              title="Students with Fines"
              value={studentsWithFines}
              icon="👥"
            />

          </div>

          {/* SEARCH + FILTER */}

          <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-5">

            <div className="flex flex-col gap-4 lg:flex-row">

              <input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search student, ID or book..."
                className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-indigo-500"
              />

              <div className="flex gap-2">

                {[
                  "All",
                  "Pending",
                  "Paid",
                ].map((item) => (

                  <button
                    key={item}
                    onClick={() =>
                      setFilter(item)
                    }
                    className={`rounded-xl px-5 py-3 text-sm ${
                      filter === item
                        ? "bg-indigo-600 text-white"
                        : "border border-slate-700 text-slate-400"
                    }`}
                  >
                    {item}
                  </button>

                ))}

              </div>

            </div>

          </div>

          {/* FINE TABLE */}

          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">

            <div className="border-b border-slate-800 p-6">

              <h2 className="font-bold">
                Fine Records
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Complete record of overdue fines
              </p>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full text-left">

                <thead className="border-b border-slate-800 text-sm text-slate-500">

                  <tr>

                    <th className="px-6 py-4">
                      Student
                    </th>

                    <th className="px-6 py-4">
                      Book
                    </th>

                    <th className="px-6 py-4">
                      Due Date
                    </th>

                    <th className="px-6 py-4">
                      Late Days
                    </th>

                    <th className="px-6 py-4">
                      Fine
                    </th>

                    <th className="px-6 py-4">
                      Status
                    </th>

                    <th className="px-6 py-4">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-800">

                  {filteredFines.map(
                    (item) => (

                      <tr
                        key={item.id}
                        className="hover:bg-slate-800/40"
                      >

                        <td className="px-6 py-5">

                          <p className="font-medium">
                            {item.student}
                          </p>

                          <p className="text-xs text-slate-500">
                            {item.studentId}
                          </p>

                        </td>

                        <td className="px-6 py-5 text-sm text-slate-300">
                          {item.book}
                        </td>

                        <td className="px-6 py-5 text-sm text-slate-400">
                          {item.dueDate}
                        </td>

                        <td className="px-6 py-5">

                          <span className="rounded-lg bg-red-500/10 px-3 py-1 text-sm text-red-400">
                            {item.lateDays} days
                          </span>

                        </td>

                        <td className="px-6 py-5 font-bold">
                          ₹{item.fine}
                        </td>

                        <td className="px-6 py-5">

                          <span
                            className={`rounded-full px-3 py-1 text-xs ${
                              item.status ===
                              "Paid"
                                ? "bg-green-500/10 text-green-400"
                                : "bg-yellow-500/10 text-yellow-400"
                            }`}
                          >
                            {item.status}
                          </span>

                        </td>

                        <td className="px-6 py-5">

                          {item.status ===
                          "Pending" ? (

                            <button
                              onClick={() =>
                                markFinePaid(
                                  item.id
                                )
                              }
                              className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold hover:bg-indigo-500"
                            >
                              Mark Paid
                            </button>

                          ) : (

                            <span className="text-xs text-slate-600">
                              Completed
                            </span>

                          )}

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          </div>

          {/* FINE RULES */}

          <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <h2 className="font-bold">
              Fine Rules
            </h2>

            <div className="mt-4 grid gap-4 md:grid-cols-3">

              <Rule
                title="Daily Fine"
                value="₹10 / day"
              />

              <Rule
                title="Grace Period"
                value="0 days"
              />

              <Rule
                title="Maximum Fine"
                value="₹500 / book"
              />

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}


/* ================= COMPONENTS ================= */

function NavItem({
  icon,
  text,
  active,
}) {
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


function StatCard({
  title,
  value,
  icon,
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold">
            {value}
          </p>

        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-800 text-xl">
          {icon}
        </div>

      </div>

    </div>
  );
}


function Rule({
  title,
  value,
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">

      <p className="text-sm text-slate-500">
        {title}
      </p>

      <p className="mt-1 text-lg font-bold">
        {value}
      </p>

    </div>
  );
}


export default FineManagement;