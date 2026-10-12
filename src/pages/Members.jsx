import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const MEMBERS_API = "http://localhost:5000/api/members";

function Members() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Members");

  const [showAddMember, setShowAddMember] = useState(false);

  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [membersError, setMembersError] = useState("");

  const [savingMember, setSavingMember] = useState(false);
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    studentId: "",
    phone: "",
    email: "",
    department: "",
    year: "",
  });

  /* ================= FETCH MEMBERS ================= */

  const fetchMembers = async () => {
    try {
      setLoadingMembers(true);
      setMembersError("");

      const response = await fetch(MEMBERS_API);

      if (!response.ok) {
        throw new Error("Failed to fetch members");
      }

      const data = await response.json();

      setMembers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Members fetch error:", error);
      setMembersError("Unable to load members from database.");
      setMembers([]);
    } finally {
      setLoadingMembers(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  /* ================= FORM HANDLER ================= */

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* ================= REGISTER MEMBER ================= */

  const handleRegisterMember = async () => {
    setFormError("");
    setSuccessMessage("");

    const {
      name,
      phone,
      email,
      department,
      year,
    } = formData;

    if (!name || !phone || !email || !department || !year) {
      setFormError(
        "Please fill in all required fields."
      );
      return;
    }

    try {
      setSavingMember(true);

      const response = await fetch(MEMBERS_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          course: department.trim(),
          year: year.trim(),
          status: "active",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to register member."
        );
      }

      setSuccessMessage("Member registered successfully.");

      setFormData({
        name: "",
        studentId: "",
        phone: "",
        email: "",
        department: "",
        year: "",
      });

      await fetchMembers();

      setTimeout(() => {
        setShowAddMember(false);
        setSuccessMessage("");
      }, 1000);
    } catch (error) {
      console.error("Register member error:", error);

      setFormError(
        error.message || "Failed to register member."
      );
    } finally {
      setSavingMember(false);
    }
  };

  /* ================= NORMALIZE MEMBER DATA ================= */

  const formattedMembers = members.map((member, index) => {
    let displayStatus = "Active";

    if (member.status === "inactive") {
      displayStatus = "Inactive";
    }

    return {
      id:
        member.studentId ||
        member.memberId ||
        `MEM${String(index + 1).padStart(3, "0")}`,

      name: member.name || "Unknown Member",

      department:
        member.course || "Not specified",

      year:
        member.year || "Not specified",

      phone:
        member.phone || "Not available",

      email:
        member.email || "Not available",

      borrowed:
        Number(member.borrowed || 0),

      due:
        member.due || "-",

      status: displayStatus,
    };
  });

  /* ================= FILTER MEMBERS ================= */

  const filteredMembers = formattedMembers.filter(
    (member) => {
      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        member.name.toLowerCase().includes(searchText) ||
        member.id.toLowerCase().includes(searchText) ||
        member.phone.toLowerCase().includes(searchText) ||
        member.email.toLowerCase().includes(searchText);

      const matchesStatus =
        status === "All Members" ||
        member.status === status;

      return matchesSearch && matchesStatus;
    }
  );

  /* ================= REAL STATISTICS ================= */

  const totalMembers = members.length;

  const activeMembers = members.filter(
    (member) => member.status === "active"
  ).length;

  const inactiveMembers = members.filter(
    (member) => member.status === "inactive"
  ).length;

  /*
    Borrowed / overdue information will come from the
    borrowing API later. For now we calculate borrowed
    only if those fields exist in the member documents.
  */

  const currentlyBorrowing = members.reduce(
    (total, member) =>
      total + Number(member.borrowed || 0),
    0
  );

  const overdueMembers = members.filter(
    (member) =>
      member.status === "overdue" ||
      member.status === "Overdue"
  ).length;

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* ================= SIDEBAR ================= */}

      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-64 border-r border-slate-800 bg-slate-900 md:block">

        {/* Logo */}

        <div className="flex h-20 items-center gap-3 border-b border-slate-800 px-6">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600">
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

        {/* Navigation */}

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

          <NavItem
            icon="👥"
            text="Members"
            active
          />

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

        {/* Logout */}

        <div className="absolute bottom-0 w-full border-t border-slate-800 p-4">

          <Link
            to="/"
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            🚪 Logout
          </Link>

        </div>

      </aside>

      {/* ================= MAIN ================= */}

      <main className="md:ml-64">

        {/* Topbar */}

        <header className="flex h-20 items-center justify-between border-b border-slate-800 bg-slate-950 px-6">

          <div>
            <h2 className="text-xl font-bold">
              Members Management
            </h2>

            <p className="text-sm text-slate-500">
              Manage registered students and their
              borrowing information
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

        {/* Page Content */}

        <div className="p-6 lg:p-8">

          {/* Heading */}

          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

            <div>

              <p className="text-sm text-indigo-400">
                Student Directory
              </p>

              <h1 className="mt-1 text-3xl font-bold">
                Library Members
              </h1>

              <p className="mt-2 text-slate-400">
                Keep track of students, contact details
                and borrowing activity.
              </p>

            </div>

            <button
              onClick={() => {
                setFormError("");
                setSuccessMessage("");
                setShowAddMember(true);
              }}
              className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold hover:bg-indigo-500"
            >
              + Register Member
            </button>

          </div>

          {/* ================= STATISTICS ================= */}

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <MiniStat
              title="Total Members"
              value={
                loadingMembers
                  ? "..."
                  : membersError
                  ? "—"
                  : totalMembers
              }
              icon="👥"
            />

            <MiniStat
              title="Active Members"
              value={
                loadingMembers
                  ? "..."
                  : membersError
                  ? "—"
                  : activeMembers
              }
              icon="✅"
            />

            <MiniStat
              title="Currently Borrowing"
              value={
                loadingMembers
                  ? "..."
                  : membersError
                  ? "—"
                  : currentlyBorrowing
              }
              icon="📚"
            />

            <MiniStat
              title="Overdue Members"
              value={
                loadingMembers
                  ? "..."
                  : membersError
                  ? "—"
                  : overdueMembers
              }
              icon="⚠️"
            />

          </div>

          {/* ================= ERROR ================= */}

          {membersError && (
            <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
              {membersError}
            </div>
          )}

          {/* ================= SEARCH ================= */}

          <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-5">

            <div className="flex flex-col gap-4 md:flex-row">

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
                  placeholder="Search by student name, ID, phone or email..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-11 pr-4 text-white outline-none focus:border-indigo-500"
                />

              </div>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value)
                }
                className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-300 outline-none focus:border-indigo-500"
              >
                <option>All Members</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>

            </div>

          </div>

          {/* ================= MEMBER TABLE ================= */}

          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">

            <div className="border-b border-slate-800 p-6">

              <h2 className="font-bold">
                Registered Members
              </h2>

              <p className="mt-1 text-sm text-slate-500">

                {loadingMembers
                  ? "Loading members..."
                  : `Showing ${filteredMembers.length} members`}

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
                      Contact
                    </th>

                    <th className="px-6 py-4">
                      Department
                    </th>

                    <th className="px-6 py-4">
                      Borrowed
                    </th>

                    <th className="px-6 py-4">
                      Due Date
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

                  {loadingMembers ? (

                    <tr>
                      <td
                        colSpan="7"
                        className="px-6 py-12 text-center text-slate-500"
                      >
                        Loading members from MongoDB...
                      </td>
                    </tr>

                  ) : filteredMembers.length === 0 ? (

                    <tr>
                      <td
                        colSpan="7"
                        className="px-6 py-12 text-center"
                      >

                        <div className="text-4xl">
                          👥
                        </div>

                        <p className="mt-3 font-semibold text-slate-300">
                          No members found
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          Register a new member to add them
                          to the library.
                        </p>

                      </td>
                    </tr>

                  ) : (

                    filteredMembers.map((member) => (

                      <tr
                        key={member.id}
                        className="hover:bg-slate-800/40"
                      >

                        {/* Student */}

                        <td className="px-6 py-5">

                          <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600/20 font-semibold text-indigo-400">
                              {member.name.charAt(0)}
                            </div>

                            <div>

                              <p className="font-semibold">
                                {member.name}
                              </p>

                              <p className="mt-1 font-mono text-xs text-slate-500">
                                {member.id}
                              </p>

                            </div>

                          </div>

                        </td>

                        {/* Contact */}

                        <td className="px-6 py-5">

                          <p className="text-sm text-slate-300">
                            📱 {member.phone}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {member.email}
                          </p>

                        </td>

                        {/* Department */}

                        <td className="px-6 py-5">

                          <p className="text-sm text-slate-300">
                            {member.department}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {member.year}
                          </p>

                        </td>

                        {/* Borrowed */}

                        <td className="px-6 py-5">

                          <span className="font-semibold">
                            {member.borrowed}
                          </span>

                          <span className="ml-1 text-xs text-slate-500">
                            books
                          </span>

                        </td>

                        {/* Due */}

                        <td className="px-6 py-5">

                          <span
                            className={
                              member.status === "Overdue"
                                ? "text-red-400"
                                : "text-slate-300"
                            }
                          >
                            {member.due}
                          </span>

                        </td>

                        {/* Status */}

                        <td className="px-6 py-5">

                          <StatusBadge
                            status={member.status}
                          />

                        </td>

                        {/* Actions */}

                        <td className="px-6 py-5">

                          <div className="flex gap-2">

                            <button
                              className="rounded-lg border border-slate-700 px-3 py-2 text-xs hover:bg-slate-800"
                            >
                              View
                            </button>

                            <button
                              className="rounded-lg border border-indigo-500/30 px-3 py-2 text-xs text-indigo-400 hover:bg-indigo-500/10"
                            >
                              SMS
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

          {/* ================= SMS INFO ================= */}

          <div className="mt-6 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-6">

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

              <div className="flex gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-xl">
                  📱
                </div>

                <div>

                  <h3 className="font-bold">
                    SMS Reminder System
                  </h3>

                  <p className="mt-1 text-sm text-slate-400">
                    Member phone numbers will be used to
                    send automatic reminders for upcoming
                    and overdue books.
                  </p>

                </div>

              </div>

              <Link
                to="/notifications"
                className="rounded-xl border border-indigo-500/30 px-5 py-3 text-center text-sm font-semibold text-indigo-400 hover:bg-indigo-500/10"
              >
                Manage Notifications →
              </Link>

            </div>

          </div>

        </div>

      </main>

      {/* ================= ADD MEMBER MODAL ================= */}

      {showAddMember && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">

          <div className="w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-900 p-6">

            {/* Modal Header */}

            <div className="flex items-center justify-between">

              <div>

                <h2 className="text-xl font-bold">
                  Register New Member
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Add student information to the library
                  system.
                </p>

              </div>

              <button
                onClick={() => {
                  setShowAddMember(false);
                  setFormError("");
                  setSuccessMessage("");
                }}
                className="text-xl text-slate-400 hover:text-white"
              >
                ✕
              </button>

            </div>

            {/* Form Error */}

            {formError && (

              <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
                {formError}
              </div>

            )}

            {/* Success */}

            {successMessage && (

              <div className="mt-5 rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-sm text-green-400">
                {successMessage}
              </div>

            )}

            {/* Form */}

            <div className="mt-6 grid gap-4 sm:grid-cols-2">

              <Input
                label="Student Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter full name"
              />

              <Input
                label="Student ID"
                name="studentId"
                value={formData.studentId}
                onChange={handleInputChange}
                placeholder="e.g. STU007"
              />

              <Input
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+91 XXXXX XXXXX"
              />

              <Input
                label="Email Address"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="student@example.com"
                type="email"
              />

              <Input
                label="Department"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                placeholder="e.g. Information Technology"
              />

              <Input
                label="Year"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                placeholder="e.g. 3rd Year"
              />

            </div>

            {/* SMS Consent */}

            <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950 p-4">

              <div className="flex items-start gap-3">

                <input
                  type="checkbox"
                  defaultChecked
                  className="mt-1 h-4 w-4 accent-indigo-600"
                />

                <div>

                  <p className="text-sm font-medium">
                    Enable SMS reminders
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Allow the library system to send
                    due-date and overdue reminders to this
                    member's registered phone number.
                  </p>

                </div>

              </div>

            </div>

            {/* Buttons */}

            <div className="mt-6 flex gap-3">

              <button
                onClick={() => {
                  setShowAddMember(false);
                  setFormError("");
                  setSuccessMessage("");
                }}
                disabled={savingMember}
                className="flex-1 rounded-xl border border-slate-700 py-3 font-semibold hover:bg-slate-800 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleRegisterMember}
                disabled={savingMember}
                className="flex-1 rounded-xl bg-indigo-600 py-3 font-semibold hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {savingMember
                  ? "Registering..."
                  : "Register Member"}
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

/* ================= NAVIGATION ITEM ================= */

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

/* ================= MINI STAT ================= */

function MiniStat({ title, value, icon }) {
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

/* ================= STATUS BADGE ================= */

function StatusBadge({ status }) {
  const styles = {
    Active: "bg-green-500/10 text-green-400",
    Overdue: "bg-red-500/10 text-red-400",
    "Due Soon": "bg-yellow-500/10 text-yellow-400",
    Inactive: "bg-slate-500/10 text-slate-400",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs ${
        styles[status] || styles.Active
      }`}
    >
      {status}
    </span>
  );
}

/* ================= INPUT ================= */

function Input({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
}) {
  return (
    <div>

      <label className="text-sm font-medium text-slate-300">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
      />

    </div>
  );
}

export default Members;