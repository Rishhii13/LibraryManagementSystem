
import { useState } from "react";
import { Link } from "react-router-dom";

const API_URL =
  "https://librarymanagementsystem-2-yja2.onrender.com/api/sms/send";

function Notifications() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [notificationType, setNotificationType] =
    useState("Due Reminder");

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [notifications, setNotifications] = useState([]);

  const students = [
    {
      student: "Amit Shah",
      studentId: "STU003",
      book: "Database System Concepts",
      dueDate: "27 Aug 2026",
      lateDays: 3,
      fine: 30,
    },
    {
      student: "Neha Mehta",
      studentId: "STU004",
      book: "Operating System Concepts",
      dueDate: "30 Aug 2026",
      lateDays: 0,
      fine: 0,
    },
    {
      student: "Karan Patel",
      studentId: "STU005",
      book: "Computer Networks",
      dueDate: "31 Aug 2026",
      lateDays: 0,
      fine: 0,
    },
    {
      student: "Sneha Joshi",
      studentId: "STU006",
      book: "Artificial Intelligence",
      dueDate: "26 Aug 2026",
      lateDays: 4,
      fine: 40,
    },
  ];

  const selectedStudentData = students.find(
    (student) => student.studentId === selectedStudent
  );

  const generateMessage = () => {
    if (!selectedStudentData) {
      return "Please select a student first.";
    }

    const { student, book, lateDays, fine, dueDate } =
      selectedStudentData;

    if (notificationType === "Due Reminder") {
      return `Hello ${student}, your library book "${book}" is due on ${dueDate}. Please return it on time to avoid a fine.`;
    }

    if (notificationType === "Overdue Reminder") {
      return `Hello ${student}, your library book "${book}" is overdue by ${lateDays} days. Please return it immediately. Current fine: Rs. ${fine}.`;
    }

    if (notificationType === "Return Confirmation") {
      return `Hello ${student}, your book "${book}" has been successfully returned to the library. Thank you!`;
    }

    if (notificationType === "Fine Reminder") {
      return `Hello ${student}, you have an outstanding library fine of Rs. ${fine} for "${book}". Please clear the fine at the earliest.`;
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
      item.email.toLowerCase().includes(value);

    return matchesType && matchesSearch;
  });

  const handleSend = async () => {
    setSuccessMessage("");
    setErrorMessage("");

    if (!selectedStudentData) {
      setErrorMessage("Please select a student first.");
      return;
    }

    const recipient = email.trim().toLowerCase();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(recipient)) {
      setErrorMessage("Please enter a valid Gmail address.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setErrorMessage("Your login session is missing. Please log in again.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          to: recipient,
          subject: `${notificationType} - ${selectedStudentData.student}`,
          message,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to send the email."
        );
      }

      const newNotification = {
        id: data.messageId || `EMAIL-${Date.now()}`,
        student: selectedStudentData.student,
        studentId: selectedStudentData.studentId,
        email: recipient,
        book: selectedStudentData.book,
        message,
        type: notificationType,
        date: new Date().toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: "Sent by Gmail",
      };

      setNotifications((previous) => [
        newNotification,
        ...previous,
      ]);

      setSuccessMessage(
        "Email sent successfully. Please check your Gmail inbox and spam folder."
      );
    } catch (error) {
      console.error("Email sending error:", error);
      setErrorMessage(
        error.message || "Unable to send the email. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
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

          <Link to="/dashboard"><NavItem icon="📊" text="Dashboard" /></Link>
          <Link to="/books"><NavItem icon="📚" text="Books" /></Link>
          <Link to="/members"><NavItem icon="👥" text="Members" /></Link>
          <Link to="/issue-borrow"><NavItem icon="🔄" text="Issue / Borrow" /></Link>
          <Link to="/returns"><NavItem icon="↩️" text="Returns" /></Link>
          <Link to="/due-overdue"><NavItem icon="⚠️" text="Due & Overdue" /></Link>

          <NavItem icon="📧" text="Email Notifications" active />

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
            <h2 className="text-xl font-bold">Email Notifications</h2>
            <p className="text-sm text-slate-500">
              Send library notifications through Gmail
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="rounded-full bg-indigo-500/10 px-3 py-2 text-sm text-indigo-400">
              📧 Email Service
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 font-bold">
              L
            </div>
          </div>
        </header>

        <div className="p-6 lg:p-8">
          <p className="text-sm text-indigo-400">Communication Center</p>
          <h1 className="mt-1 text-3xl font-bold">Email Notifications</h1>
          <p className="mt-2 text-slate-400">
            Send due reminders, overdue reminders and library updates to your Gmail for testing.
          </p>

          {successMessage && (
            <div className="mt-6 rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-300">
              <p className="font-semibold">✓ Email request successful</p>
              <p className="mt-1">{successMessage}</p>
            </div>
          )}

          {errorMessage && (
            <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
              <p className="font-semibold">Email sending failed</p>
              <p className="mt-1">{errorMessage}</p>
            </div>
          )}

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Emails Sent" value={notifications.length} icon="📧" />
            <StatCard
              title="Due Reminders"
              value={notifications.filter((item) => item.type === "Due Reminder").length}
              icon="📅"
            />
            <StatCard
              title="Overdue Reminders"
              value={notifications.filter((item) => item.type === "Overdue Reminder").length}
              icon="⚠️"
            />
            <StatCard title="Delivery Status" value="Check Inbox" icon="✓" />
          </div>

          <div className="mt-8 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-6">
            <h2 className="text-xl font-bold">Send New Email</h2>
            <p className="mt-1 text-sm text-slate-400">
              Select a sample student and enter your own Gmail address to receive the test notification.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-slate-400">
                  Student
                </label>
                <select
                  value={selectedStudent}
                  onChange={(e) => {
                    setSelectedStudent(e.target.value);
                    setSuccessMessage("");
                    setErrorMessage("");
                  }}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-indigo-500"
                >
                  <option value="">Select Student</option>
                  {students.map((student) => (
                    <option key={student.studentId} value={student.studentId}>
                      {student.student} - {student.studentId}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-400">
                  Your Gmail Address (Recipient)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your Gmail address"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-indigo-500"
                />
                <p className="mt-2 text-xs text-indigo-300">
                  Enter the same Gmail address configured in your server .env file.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-400">
                  Notification Type
                </label>
                <select
                  value={notificationType}
                  onChange={(e) => {
                    setNotificationType(e.target.value);
                    setSuccessMessage("");
                    setErrorMessage("");
                  }}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-indigo-500"
                >
                  <option value="Due Reminder">Due Reminder</option>
                  <option value="Overdue Reminder">Overdue Reminder</option>
                  <option value="Return Confirmation">Return Confirmation</option>
                  <option value="Fine Reminder">Fine Reminder</option>
                </select>
              </div>

              {selectedStudentData && (
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Selected Book Details
                  </p>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div>
                      <p className="text-xs text-slate-500">Book</p>
                      <p className="mt-1 text-sm font-semibold">{selectedStudentData.book}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Due Date</p>
                      <p className="mt-1 text-sm font-semibold">{selectedStudentData.dueDate}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Current Fine</p>
                      <p className="mt-1 text-sm font-semibold text-red-400">₹{selectedStudentData.fine}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm text-slate-400">
                  Email Message
                </label>
                <textarea
                  rows={4}
                  value={message}
                  readOnly
                  className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-300 outline-none"
                />
                <p className="mt-2 text-xs text-slate-500">
                  Message is automatically generated from the selected sample student.
                </p>
              </div>

              <div className="flex justify-end md:col-span-2">
                <button
                  onClick={handleSend}
                  disabled={loading}
                  className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Sending Email..." : "📧 Send Test Email"}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="flex flex-col gap-4 lg:flex-row">
              <div className="flex-1">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search student, book or email..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-indigo-500"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {["All", "Due Reminder", "Overdue Reminder", "Return Confirmation", "Fine Reminder"].map((item) => (
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

          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
            <div className="border-b border-slate-800 p-6">
              <h2 className="font-bold">Email Notification History</h2>
              <p className="mt-1 text-sm text-slate-500">
                Emails accepted by Gmail during this session.
              </p>
            </div>

            <div className="divide-y divide-slate-800">
              {filteredNotifications.length === 0 ? (
                <div className="p-10 text-center text-slate-500">
                  No email notifications found.
                </div>
              ) : (
                filteredNotifications.map((item) => (
                  <div key={item.id} className="p-6 hover:bg-slate-800/40">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-xl">
                          📧
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-semibold">{item.student}</h3>
                            <span className="rounded-full bg-indigo-500/10 px-2 py-1 text-xs text-indigo-400">
                              {item.type}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-slate-500">
                            {item.studentId} • {item.email}
                          </p>
                          <p className="mt-2 text-sm text-slate-400">
                            📚 {item.book}
                          </p>
                        </div>
                      </div>

                      <div className="max-w-xl flex-1">
                        <p className="text-sm text-slate-400">{item.message}</p>
                        <p className="mt-2 text-xs text-slate-600">{item.date}</p>
                        <p className="mt-1 text-xs text-slate-600">
                          Message ID: {item.id}
                        </p>
                      </div>

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

          <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="flex gap-4">
              <div className="text-2xl">🤖</div>
              <div className="flex-1">
                <h3 className="font-bold">Automatic Reminder System</h3>
                <p className="mt-1 text-sm text-slate-400">
                  The system can be extended to send emails automatically based on due dates, overdue status and outstanding fines.
                </p>
                <div className="mt-4 grid gap-3 md:grid-cols-4">
                  <Reminder title="Before Due Date" text="Send reminder 1 day before" />
                  <Reminder title="Due Today" text="Notify student on due date" />
                  <Reminder title="After Due Date" text="Send overdue reminder" />
                  <Reminder title="Return" text="Send return confirmation" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

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

function Reminder({ title, text }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
      <p className="text-sm font-semibold">{title}</p>
      <p className="mt-1 text-xs text-slate-500">{text}</p>
    </div>
  );
}

export default Notifications;
