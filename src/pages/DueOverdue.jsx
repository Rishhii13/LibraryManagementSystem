import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { LibraryContext } from "../context/LibraryContext";

function DueOverdue() {
  const {
    returnRecords,
  } = useContext(LibraryContext);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [sentReminder, setSentReminder] = useState(false);
  const [reminderRecords, setReminderRecords] = useState([]);

  /* ================= STUDENT DETAILS ================= */

  const students = [
    {
      id: "STU001",
      name: "Rahul Sharma",
      phone: "+91 98765 43210",
    },
    {
      id: "STU002",
      name: "Priya Patel",
      phone: "+91 97654 32109",
    },
    {
      id: "STU003",
      name: "Amit Shah",
      phone: "+91 98987 65432",
    },
    {
      id: "STU004",
      name: "Neha Mehta",
      phone: "+91 91234 56789",
    },
  ];

  /* ================= CONVERT RETURN RECORDS ================= */

  const records = returnRecords
    .filter((record) => record.status !== "Returned")
    .map((record) => {
      const studentInfo = students.find(
        (item) => item.name === record.student
      );

      let status = record.status;

      if (status === "Active") {
        status = "Upcoming";
      }

      let days = 0;
      let fine = 0;

      if (status === "Overdue") {
        const dueDate = new Date(record.dueDate);
        const today = new Date("2026-08-30");

        const difference =
          today.getTime() - dueDate.getTime();

        days = Math.max(
          1,
          Math.ceil(
            difference / (1000 * 60 * 60 * 24)
          )
        );

        fine = days * 10;
      }

      return {
        id: record.id,
        student: record.student,
        studentId: studentInfo
          ? studentInfo.id
          : "-",
        phone: studentInfo
          ? studentInfo.phone
          : "-",
        book: record.book,
        issueDate: record.issueDate,
        dueDate: record.dueDate,
        days,
        fine,
        status,
        reminderSent: reminderRecords.includes(record.id),
      };
    });

  /* ================= FILTERING ================= */

  const filteredRecords = records.filter((item) => {
    const value = search.toLowerCase();

    const matchesSearch =
      item.student
        .toLowerCase()
        .includes(value) ||
      item.studentId
        .toLowerCase()
        .includes(value) ||
      item.book
        .toLowerCase()
        .includes(value) ||
      item.id
        .toLowerCase()
        .includes(value) ||
      item.phone.includes(value);

    const matchesFilter =
      filter === "All" ||
      item.status === filter;

    return matchesSearch && matchesFilter;
  });

  /* ================= STATISTICS ================= */

  const overdueCount = records.filter(
    (item) => item.status === "Overdue"
  ).length;

  const dueTodayCount = records.filter(
    (item) => item.status === "Due Today"
  ).length;

  const dueTomorrowCount = records.filter(
    (item) => item.status === "Due Tomorrow"
  ).length;

  const totalFine = records.reduce(
    (total, item) => total + item.fine,
    0
  );

  /* ================= SEND REMINDER ================= */

  const sendReminder = (id) => {
    setReminderRecords((previous) => [
      ...previous,
      id,
    ]);

    setSentReminder(true);

    setTimeout(() => {
      setSentReminder(false);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* SIDEBAR */}

      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-64 border-r border-slate-800 bg-slate-900 md:block">

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
            <NavItem icon="📊" text="Dashboard" />
          </Link>

          <Link to="/books">
            <NavItem icon="📚" text="Books" />
          </Link>

          <Link to="/members">
            <NavItem icon="👥" text="Members" />
          </Link>

          <Link to="/issue-borrow">
            <NavItem icon="🔄" text="Issue / Borrow" />
          </Link>

          <Link to="/returns">
            <NavItem icon="↩️" text="Returns" />
          </Link>

          <NavItem
            icon="⚠️"
            text="Due & Overdue"
            active
          />

          <Link to="/notifications">
            <NavItem icon="📱" text="SMS Notifications" />
          </Link>

          <div className="my-5 border-t border-slate-800" />

          <Link to="/fine-management">
            <NavItem
              icon="💰"
              text="Fine Management"
            />
          </Link>

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

        <header className="flex h-20 items-center justify-between border-b border-slate-800 bg-slate-950 px-6">

          <div>

            <h2 className="text-xl font-bold">
              Due & Overdue
            </h2>

            <p className="text-sm text-slate-500">
              Track upcoming due dates and overdue books
            </p>

          </div>

          <div className="flex items-center gap-4">

            <button className="relative rounded-xl border border-slate-800 p-3 hover:bg-slate-800">

              🔔

              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />

            </button>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 font-bold">
              L
            </div>

          </div>

        </header>

        {/* CONTENT */}

        <div className="p-6 lg:p-8">

          <p className="text-sm text-indigo-400">
            Circulation Monitoring
          </p>

          <h1 className="mt-1 text-3xl font-bold">
            Due & Overdue Books
          </h1>

          <p className="mt-2 text-slate-400">
            Monitor due dates, identify overdue books and notify students.
          </p>

          {/* SUCCESS */}

          {sentReminder && (
            <div className="mt-6 rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-green-400">
              ✅ Reminder notification sent successfully.
            </div>
          )}

          {/* STATISTICS */}

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <StatCard
              title="Overdue Books"
              value={overdueCount}
              icon="🚨"
            />

            <StatCard
              title="Due Today"
              value={dueTodayCount}
              icon="📅"
            />

            <StatCard
              title="Due Tomorrow"
              value={dueTomorrowCount}
              icon="⏰"
            />

            <StatCard
              title="Outstanding Fine"
              value={`₹${totalFine}`}
              icon="💰"
            />

          </div>

          {/* ALERT */}

          {overdueCount > 0 && (
            <div className="mt-8 flex gap-4 rounded-2xl border border-red-500/20 bg-red-500/5 p-5">

              <div className="text-2xl">
                ⚠️
              </div>

              <div>

                <h3 className="font-semibold text-red-400">
                  Overdue Books Require Attention
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  {overdueCount} book(s) are currently overdue.
                  Consider sending reminders to the concerned students.
                </p>

              </div>

            </div>
          )}

          {/* SEARCH + FILTER */}

          <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-5">

            <div className="flex flex-col gap-4 lg:flex-row">

              <div className="relative flex-1">

                <span className="absolute left-4 top-3 text-slate-500">
                  🔍
                </span>

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search student, ID, book or phone number..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-11 pr-4 outline-none focus:border-indigo-500"
                />

              </div>

              <div className="flex flex-wrap gap-2">

                {[
                  "All",
                  "Overdue",
                  "Due Today",
                  "Due Tomorrow",
                  "Upcoming",
                ].map((item) => (

                  <button
                    key={item}
                    onClick={() => setFilter(item)}
                    className={`rounded-xl px-4 py-3 text-sm font-medium ${
                      filter === item
                        ? "bg-indigo-600 text-white"
                        : "border border-slate-700 text-slate-400 hover:bg-slate-800"
                    }`}
                  >
                    {item}
                  </button>

                ))}

              </div>

            </div>

          </div>

          {/* RECORDS */}

          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">

            <div className="border-b border-slate-800 p-6">

              <h2 className="font-bold">
                Due Date Records
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Books requiring monitoring or student action
              </p>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full text-left">

                <thead className="bg-slate-950 text-sm text-slate-500">

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
                      Days
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

                  {filteredRecords.length === 0 ? (

                    <tr>

                      <td
                        colSpan="7"
                        className="px-6 py-12 text-center text-slate-500"
                      >
                        No records found.
                      </td>

                    </tr>

                  ) : (

                    filteredRecords.map((item) => (

                      <tr
                        key={item.id}
                        className="hover:bg-slate-800/40"
                      >

                        {/* STUDENT */}

                        <td className="px-6 py-5">

                          <p className="font-semibold">
                            {item.student}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {item.studentId}
                          </p>

                          <p className="mt-1 text-xs text-slate-600">
                            📱 {item.phone}
                          </p>

                        </td>

                        {/* BOOK */}

                        <td className="px-6 py-5">

                          <p className="text-sm font-medium">
                            {item.book}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            Issue: {item.issueDate}
                          </p>

                        </td>

                        {/* DUE DATE */}

                        <td className="px-6 py-5 text-sm text-slate-300">
                          {item.dueDate}
                        </td>

                        {/* DAYS */}

                        <td className="px-6 py-5">

                          {item.status === "Overdue" ? (

                            <span className="rounded-lg bg-red-500/10 px-3 py-1 text-sm text-red-400">
                              {item.days} days late
                            </span>

                          ) : (

                            <span className="text-sm text-slate-500">
                              —
                            </span>

                          )}

                        </td>

                        {/* FINE */}

                        <td className="px-6 py-5 font-semibold">

                          {item.fine > 0 ? (

                            <span className="text-red-400">
                              ₹{item.fine}
                            </span>

                          ) : (

                            <span className="text-green-400">
                              ₹0
                            </span>

                          )}

                        </td>

                        {/* STATUS */}

                        <td className="px-6 py-5">

                          <span
                            className={`rounded-full px-3 py-1 text-xs ${
                              item.status === "Overdue"
                                ? "bg-red-500/10 text-red-400"
                                : item.status === "Due Today"
                                ? "bg-yellow-500/10 text-yellow-400"
                                : item.status === "Due Tomorrow"
                                ? "bg-orange-500/10 text-orange-400"
                                : "bg-indigo-500/10 text-indigo-400"
                            }`}
                          >
                            {item.status}
                          </span>

                        </td>

                        {/* ACTION */}

                        <td className="px-6 py-5">

                          {item.status !== "Upcoming" ? (

                            item.reminderSent ? (

                              <span className="text-xs text-green-400">
                                ✓ Reminder Sent
                              </span>

                            ) : (

                              <button
                                onClick={() =>
                                  sendReminder(item.id)
                                }
                                className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold hover:bg-indigo-500"
                              >
                                📱 Send Reminder
                              </button>

                            )

                          ) : (

                            <span className="text-xs text-slate-600">
                              No action needed
                            </span>

                          )}

                        </td>

                      </tr>

                    ))

                  )}

                </tbody>

              </table>

            </div>

          </div>

          {/* REMINDER SYSTEM */}

          <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <div className="flex gap-4">

              <div className="text-2xl">
                🤖
              </div>

              <div className="flex-1">

                <h2 className="font-bold">
                  Due Date Reminder System
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  The system can automatically notify students based on their book due dates.
                </p>

                <div className="mt-5 grid gap-4 md:grid-cols-3">

                  <Reminder
                    title="1 Day Before"
                    text="Send an SMS reminder before the due date."
                  />

                  <Reminder
                    title="Due Today"
                    text="Notify the student that the book is due today."
                  />

                  <Reminder
                    title="Overdue"
                    text="Notify the student about late return and fine."
                  />

                </div>

              </div>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}


/* ================= COMPONENTS ================= */

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


function StatCard({ title, value, icon }) {
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


function Reminder({ title, text }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">

      <p className="font-semibold">
        {title}
      </p>

      <p className="mt-1 text-sm text-slate-500">
        {text}
      </p>

    </div>
  );
}


export default DueOverdue;