import { useState } from "react";
import { Link } from "react-router-dom";

function Notifications() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");
  const [sent, setSent] = useState(false);

  const [selectedStudent, setSelectedStudent] = useState("");
  const [notificationType, setNotificationType] =
    useState("Due Reminder");

  const students = [
    {
      student: "Amit Shah",
      studentId: "STU003",
      phone: "+91 98987 65432",
      book: "Database System Concepts",
      dueDate: "27 Aug 2026",
      lateDays: 3,
      fine: 30,
    },
    {
      student: "Neha Mehta",
      studentId: "STU004",
      phone: "+91 91234 56789",
      book: "Operating System Concepts",
      dueDate: "30 Aug 2026",
      lateDays: 0,
      fine: 0,
    },
    {
      student: "Karan Patel",
      studentId: "STU005",
      phone: "+91 98761 23456",
      book: "Computer Networks",
      dueDate: "31 Aug 2026",
      lateDays: 0,
      fine: 0,
    },
    {
      student: "Sneha Joshi",
      studentId: "STU006",
      phone: "+91 97654 87654",
      book: "Artificial Intelligence",
      dueDate: "26 Aug 2026",
      lateDays: 4,
      fine: 40,
    },
  ];

  const [notifications, setNotifications] = useState([
    {
      id: "SMS001",
      student: "Amit Shah",
      studentId: "STU003",
      phone: "+91 98987 65432",
      book: "Database System Concepts",
      message:
        'Hello Amit Shah, your library book "Database System Concepts" is overdue by 3 days. Please return it immediately. Current fine: ₹30.',
      type: "Overdue Reminder",
      date: "30 Aug 2026, 10:30 AM",
      status: "Sent",
    },
    {
      id: "SMS002",
      student: "Neha Mehta",
      studentId: "STU004",
      phone: "+91 91234 56789",
      book: "Operating System Concepts",
      message:
        'Hello Neha Mehta, your library book "Operating System Concepts" is due on 30 Aug 2026. Please return it on time to avoid a fine.',
      type: "Due Reminder",
      date: "30 Aug 2026, 09:15 AM",
      status: "Sent",
    },
    {
      id: "SMS003",
      student: "Karan Patel",
      studentId: "STU005",
      phone: "+91 98761 23456",
      book: "Computer Networks",
      message:
        'Reminder: Your library book "Computer Networks" is due tomorrow.',
      type: "Due Reminder",
      date: "30 Aug 2026, 08:45 AM",
      status: "Sent",
    },
    {
      id: "SMS004",
      student: "Sneha Joshi",
      studentId: "STU006",
      phone: "+91 97654 87654",
      book: "Artificial Intelligence",
      message:
        'Hello Sneha Joshi, your library book "Artificial Intelligence" is overdue by 4 days. Please return it immediately. Current fine: ₹40.',
      type: "Overdue Reminder",
      date: "30 Aug 2026, 08:20 AM",
      status: "Sent",
    },
  ]);

  const selectedStudentData = students.find(
    (student) => student.studentId === selectedStudent
  );

  const generateMessage = () => {
    if (!selectedStudentData) {
      return "Please select a student first.";
    }

    const student = selectedStudentData.student;
    const book = selectedStudentData.book;
    const days = selectedStudentData.lateDays;
    const fine = selectedStudentData.fine;
    const dueDate = selectedStudentData.dueDate;

    if (notificationType === "Due Reminder") {
      return `Hello ${student}, your library book "${book}" is due on ${dueDate}. Please return it on time to avoid a fine.`;
    }

    if (notificationType === "Overdue Reminder") {
      return `Hello ${student}, your library book "${book}" is overdue by ${days} days. Please return it immediately. Current fine: ₹${fine}.`;
    }

    if (notificationType === "Return Confirmation") {
      return `Hello ${student}, your book "${book}" has been successfully returned to the library. Thank you!`;
    }

    if (notificationType === "Fine Reminder") {
      return `Hello ${student}, you have an outstanding library fine of ₹${fine} for "${book}". Please clear the fine at the earliest.`;
    }

    return "";
  };

  const message = generateMessage();

  const filteredNotifications = notifications.filter((item) => {
    const matchesType = type === "All" || item.type === type;

    const value = search.toLowerCase();

    const matchesSearch =
      item.student.toLowerCase().includes(value) ||
      item.studentId.toLowerCase().includes(value) ||
      item.book.toLowerCase().includes(value) ||
      item.phone.toLowerCase().includes(value);

    return matchesType && matchesSearch;
  });

  const handleSend = () => {
    if (!selectedStudentData) {
      alert("Please select a student first.");
      return;
    }

    const newNotification = {
      id: `SMS${String(notifications.length + 1).padStart(3, "0")}`,
      student: selectedStudentData.student,
      studentId: selectedStudentData.studentId,
      phone: selectedStudentData.phone,
      book: selectedStudentData.book,
      message: message,
      type: notificationType,
      date: new Date().toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "Sent",
    };

    setNotifications((prev) => [newNotification, ...prev]);

    setSent(true);

    setTimeout(() => {
      setSent(false);
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
            <h1 className="font-bold">LibManage</h1>
            <p className="text-xs text-slate-400">Librarian Portal</p>
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

          <Link to="/due-overdue">
            <NavItem icon="⚠️" text="Due & Overdue" />
          </Link>

          <NavItem icon="📱" text="SMS Notifications" active />

          <div className="my-5 border-t border-slate-800" />

          <Link to="/fine-management">
            <NavItem icon="💰" text="Fine Management" />
          </Link>

          <Link to="/settings">
            <NavItem icon="⚙️" text="Settings" />
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
            <h2 className="text-xl font-bold">SMS Notifications</h2>
            <p className="text-sm text-slate-500">
              Notify students about their library books
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
          <div>
            <p className="text-sm text-indigo-400">Communication Center</p>

            <h1 className="mt-1 text-3xl font-bold">SMS Notifications</h1>

            <p className="mt-2 text-slate-400">
              Send reminders and confirmations to students using their
              registered phone numbers.
            </p>
          </div>

          {/* SUCCESS */}

          {sent && (
            <div className="mt-6 rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-green-400">
              ✅ SMS notification sent successfully.
            </div>
          )}

          {/* STATISTICS */}

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="SMS Sent Today"
              value={notifications.length}
              icon="📱"
            />

            <StatCard
              title="Due Reminders"
              value={
                notifications.filter(
                  (item) => item.type === "Due Reminder"
                ).length
              }
              icon="📅"
            />

            <StatCard
              title="Overdue Reminders"
              value={
                notifications.filter(
                  (item) => item.type === "Overdue Reminder"
                ).length
              }
              icon="⚠️"
            />

            <StatCard title="Delivery Rate" value="98%" icon="✓" />
          </div>

          {/* SEND SMS */}

          <div className="mt-8 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-6">
            <div>
              <h2 className="text-xl font-bold">Send New SMS</h2>

              <p className="mt-1 text-sm text-slate-400">
                Select a student and notification type. The message will be
                generated automatically.
              </p>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {/* STUDENT */}

              <div>
                <label className="mb-2 block text-sm text-slate-400">
                  Student
                </label>

                <select
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-indigo-500"
                >
                  <option value="">Select Student</option>

                  {students.map((student) => (
                    <option
                      key={student.studentId}
                      value={student.studentId}
                    >
                      {student.student} - {student.studentId}
                    </option>
                  ))}
                </select>

                {selectedStudentData && (
                  <p className="mt-2 text-xs text-slate-500">
                    📱 {selectedStudentData.phone}
                  </p>
                )}
              </div>

              {/* TYPE */}

              <div>
                <label className="mb-2 block text-sm text-slate-400">
                  Notification Type
                </label>

                <select
                  value={notificationType}
                  onChange={(e) => setNotificationType(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-indigo-500"
                >
                  <option value="Due Reminder">Due Reminder</option>
                  <option value="Overdue Reminder">
                    Overdue Reminder
                  </option>
                  <option value="Return Confirmation">
                    Return Confirmation
                  </option>
                  <option value="Fine Reminder">Fine Reminder</option>
                </select>
              </div>

              {/* BOOK DETAILS */}

              {selectedStudentData && (
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 md:col-span-2">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <p className="text-xs text-slate-500">Book</p>

                      <p className="mt-1 text-sm font-semibold">
                        {selectedStudentData.book}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">Due Date</p>

                      <p className="mt-1 text-sm font-semibold">
                        {selectedStudentData.dueDate}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">Current Fine</p>

                      <p className="mt-1 text-sm font-semibold text-red-400">
                        ₹{selectedStudentData.fine}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* MESSAGE */}

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm text-slate-400">
                  Message
                </label>

                <textarea
                  rows={4}
                  value={message}
                  readOnly
                  className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-300 outline-none"
                />

                <p className="mt-2 text-xs text-slate-600">
                  Message is automatically generated based on the selected
                  student and notification type.
                </p>
              </div>

              {/* SEND BUTTON */}

              <div className="flex justify-end md:col-span-2">
                <button
                  onClick={handleSend}
                  className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold hover:bg-indigo-500"
                >
                  📱 Send SMS
                </button>
              </div>
            </div>
          </div>

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
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search student, book or phone number..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-11 pr-4 outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  "All",
                  "Due Reminder",
                  "Overdue Reminder",
                  "Return Confirmation",
                  "Fine Reminder",
                ].map((item) => (
                  <button
                    key={item}
                    onClick={() => setType(item)}
                    className={`rounded-xl px-4 py-3 text-sm font-medium ${
                      type === item
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

          {/* HISTORY */}

          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
            <div className="border-b border-slate-800 p-6">
              <h2 className="font-bold">Notification History</h2>

              <p className="mt-1 text-sm text-slate-500">
                Recent SMS notifications sent by the librarian
              </p>
            </div>

            <div className="divide-y divide-slate-800">
              {filteredNotifications.length === 0 ? (
                <div className="p-10 text-center text-slate-500">
                  No notifications found.
                </div>
              ) : (
                filteredNotifications.map((item) => (
                  <div
                    key={item.id}
                    className="p-6 hover:bg-slate-800/40"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                      {/* STUDENT */}

                      <div className="flex gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-xl">
                          📱
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-semibold">
                              {item.student}
                            </h3>

                            <span className="rounded-full bg-indigo-500/10 px-2 py-1 text-xs text-indigo-400">
                              {item.type}
                            </span>
                          </div>

                          <p className="mt-1 text-sm text-slate-500">
                            {item.studentId} • {item.phone}
                          </p>

                          <p className="mt-2 text-sm text-slate-400">
                            📚 {item.book}
                          </p>
                        </div>
                      </div>

                      {/* MESSAGE */}

                      <div className="max-w-xl flex-1">
                        <p className="text-sm text-slate-400">
                          "{item.message}"
                        </p>

                        <p className="mt-2 text-xs text-slate-600">
                          {item.date}
                        </p>
                      </div>

                      {/* STATUS */}

                      <div>
                        <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400">
                          ✓ {item.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* AUTOMATION */}

          <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="flex gap-4">
              <div className="text-2xl">🤖</div>

              <div className="flex-1">
                <h3 className="font-bold">
                  Automatic Reminder System
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  In the final backend, the system can automatically send SMS
                  reminders based on due dates, overdue status and fines.
                </p>

                <div className="mt-4 grid gap-3 md:grid-cols-4">
                  <Reminder
                    title="Before Due Date"
                    text="Send reminder 1 day before"
                  />

                  <Reminder
                    title="Due Today"
                    text="Notify student on due date"
                  />

                  <Reminder
                    title="After Due Date"
                    text="Send overdue reminder"
                  />

                  <Reminder
                    title="Return"
                    text="Send return confirmation"
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

/* NAVIGATION ITEM */

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

/* STATISTICS CARD */

function StatCard({ title, value, icon }) {
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

/* AUTOMATION REMINDER */

function Reminder({ title, text }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
      <p className="text-sm font-semibold">{title}</p>

      <p className="mt-1 text-xs text-slate-500">{text}</p>
    </div>
  );
}

export default Notifications;