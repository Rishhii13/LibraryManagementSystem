import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { LibraryContext } from "../context/LibraryContext";

const BOOKS_API = "http://localhost:5000/api/books";
const MEMBERS_API = "http://localhost:5000/api/members/active/count";

function getAuthHeaders() {
  const token = localStorage.getItem("token");

  return token
    ? { Authorization: `Bearer ${token}` }
    : {};
}

function Dashboard() {
  const { librarianName, borrowedBooks } = useContext(LibraryContext);

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [books, setBooks] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [booksError, setBooksError] = useState("");

  const [activeMembers, setActiveMembers] = useState(0);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [membersError, setMembersError] = useState("");

  // Fetch books from the protected API
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoadingBooks(true);
        setBooksError("");

        const response = await fetch(BOOKS_API, {
          headers: getAuthHeaders(),
        });

        if (response.status === 401 || response.status === 403) {
          throw new Error("Authentication failed. Please log in again.");
        }

        if (!response.ok) {
          throw new Error("Failed to fetch books");
        }

        const data = await response.json();

        setBooks(
          Array.isArray(data)
            ? data
            : Array.isArray(data.books)
            ? data.books
            : []
        );
      } catch (error) {
        console.error("Dashboard books error:", error);
        setBooksError(error.message || "Unable to load book data");
      } finally {
        setLoadingBooks(false);
      }
    };

    fetchBooks();
  }, []);

  // Fetch active members from the protected API
  useEffect(() => {
    const fetchActiveMembers = async () => {
      try {
        setLoadingMembers(true);
        setMembersError("");

        const response = await fetch(MEMBERS_API, {
          headers: getAuthHeaders(),
        });

        if (response.status === 401 || response.status === 403) {
          throw new Error("Authentication failed. Please log in again.");
        }

        if (!response.ok) {
          throw new Error("Failed to fetch active members");
        }

        const data = await response.json();
        setActiveMembers(Number(data.count || 0));
      } catch (error) {
        console.error("Dashboard members error:", error);
        setMembersError(error.message || "Unable to load member data");
      } finally {
        setLoadingMembers(false);
      }
    };

    fetchActiveMembers();
  }, []);

  // Calculate book statistics
  const totalBooks = books.length;

  const totalCopies = books.reduce(
    (total, book) => total + Number(book.copies || 0),
    0
  );

  const availableCopies = books.reduce(
    (total, book) => total + Number(book.available || 0),
    0
  );

  const calculatedBorrowed = Math.max(
    totalCopies - availableCopies,
    0
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-30 h-screen w-64 border-r border-slate-800 bg-slate-900 transition-transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
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

          <NavItem icon="📊" text="Dashboard" active />

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

          <Link to="/notifications">
            <NavItem icon="📱" text="SMS Notifications" />
          </Link>

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

      {/* Main Content */}
      <main
        className={`transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        {/* Topbar */}
        <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-800 bg-slate-950/95 px-6 backdrop-blur">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-lg border border-slate-800 px-3 py-2 hover:bg-slate-800"
          >
            ☰
          </button>

          <div className="flex items-center gap-4">
            <button className="relative rounded-xl border border-slate-800 p-3 hover:bg-slate-800">
              🔔
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
            </button>

            <div className="flex items-center gap-3 border-l border-slate-800 pl-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 font-bold">
                L
              </div>

              <div className="hidden sm:block">
                <p className="text-sm font-semibold">
                  {librarianName || "Library Admin"}
                </p>
                <p className="text-xs text-slate-500">Administrator</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard */}
        <div className="p-6 lg:p-8">
          <div className="mb-8">
            <p className="text-sm text-indigo-400">Librarian Dashboard</p>

            <h2 className="mt-1 text-3xl font-bold">
              Good Morning, {librarianName || "Library Admin"} 👋
            </h2>

            <p className="mt-2 text-slate-400">
              Here's what's happening in your library today.
            </p>
          </div>

          {/* Statistics */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Books"
              value={
                loadingBooks ? "..." : booksError ? "—" : totalBooks
              }
              icon="📚"
              subtitle={
                loadingBooks
                  ? "Loading from database..."
                  : booksError
                  ? "Database unavailable"
                  : `${totalCopies} total copies`
              }
            />

            <StatCard
              title="Active Members"
              value={
                loadingMembers
                  ? "..."
                  : membersError
                  ? "—"
                  : activeMembers
              }
              icon="👥"
              subtitle={
                loadingMembers
                  ? "Loading from database..."
                  : membersError
                  ? "Database unavailable"
                  : "Currently active members"
              }
            />

            <StatCard
              title="Currently Borrowed"
              value={
                calculatedBorrowed > 0
                  ? calculatedBorrowed
                  : borrowedBooks || 0
              }
              icon="🔄"
              subtitle="Based on book availability"
            />

            <StatCard
              title="Overdue Books"
              value="—"
              icon="⚠️"
              subtitle="Borrowing API not connected yet"
              danger
            />
          </div>

          {/* Database Status */}
          <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-bold">Database Overview</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Live book information from MongoDB Atlas
                </p>
              </div>

              <div
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  booksError
                    ? "bg-red-500/10 text-red-400"
                    : loadingBooks
                    ? "bg-yellow-500/10 text-yellow-400"
                    : "bg-green-500/10 text-green-400"
                }`}
              >
                {booksError
                  ? "● Database Error"
                  : loadingBooks
                  ? "● Loading..."
                  : "● Connected"}
              </div>
            </div>

            {(booksError || membersError) && (
              <p className="mt-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-300">
                {booksError || membersError}
              </p>
            )}

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <DatabaseStat
                label="Book Records"
                value={loadingBooks ? "..." : totalBooks}
              />

              <DatabaseStat
                label="Total Copies"
                value={loadingBooks ? "..." : totalCopies}
              />

              <DatabaseStat
                label="Available Copies"
                value={loadingBooks ? "..." : availableCopies}
              />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <h3 className="mb-4 text-lg font-bold">Quick Actions</h3>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <QuickAction
                icon="📚"
                title="Manage Books"
                description="View and manage inventory"
                link="/books"
              />

              <QuickAction
                icon="👤"
                title="Manage Members"
                description="View registered members"
                link="/members"
              />

              <QuickAction
                icon="🔄"
                title="Issue Book"
                description="Record a new borrowing"
                link="/issue-borrow"
              />

              <QuickAction
                icon="📱"
                title="Notifications"
                description="Send member reminders"
                link="/notifications"
              />
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

function StatCard({ title, value, icon, subtitle, danger }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-800 text-xl">
          {icon}
        </div>

        <span
          className={`text-3xl font-bold ${
            danger ? "text-red-400" : "text-white"
          }`}
        >
          {value}
        </span>
      </div>

      <h3 className="mt-5 font-semibold">{title}</h3>
      <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
    </div>
  );
}

function DatabaseStat({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}

function QuickAction({ icon, title, description, link }) {
  return (
    <Link
      to={link}
      className="rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:-translate-y-1 hover:border-indigo-500/50"
    >
      <div className="text-2xl">{icon}</div>
      <h4 className="mt-4 font-bold">{title}</h4>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
    </Link>
  );
}

export default Dashboard;