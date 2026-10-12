import { Link } from "react-router-dom";

function Landing() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* ==================== NAVBAR ==================== */}
      <nav className="border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          
          {/* Logo / Brand */}
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-2xl text-white shadow-md">
              📚
            </div>

            <div>
              <h1 className="text-xl font-bold text-slate-900">
                LibManage
              </h1>
              <p className="text-xs text-slate-500">
                Librarian Portal
              </p>
            </div>
          </Link>

          {/* Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#home"
              className="font-medium text-slate-600 transition hover:text-blue-600"
            >
              Home
            </a>

            <a
              href="#features"
              className="font-medium text-slate-600 transition hover:text-blue-600"
            >
              Features
            </a>

            <a
              href="#about"
              className="font-medium text-slate-600 transition hover:text-blue-600"
            >
              About
            </a>
          </div>

          {/* Login / Signup */}
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="hidden rounded-lg px-4 py-2 font-medium text-blue-600 transition hover:bg-blue-50 sm:block"
            >
              Login
            </Link>

            <Link
              to="/signup"
              className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white shadow-sm transition hover:bg-blue-700"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ==================== HERO SECTION ==================== */}
      <section id="home" className="overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:py-28">
          
          {/* Hero Content */}
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
              <span>●</span>
              Smart Library Management
            </div>

            <h2 className="text-4xl font-bold leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Manage Your Library
              <span className="block text-blue-600">
                Smarter &amp; Faster
              </span>
            </h2>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              A simple and efficient library management system designed for
              librarians to manage books, members, borrowing, returns, fines,
              and notifications from one place.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/login"
                className="rounded-xl bg-blue-600 px-7 py-3.5 text-center font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-700"
              >
                Login to Dashboard →
              </Link>

              <Link
                to="/signup"
                className="rounded-xl border border-slate-300 bg-white px-7 py-3.5 text-center font-semibold text-slate-700 transition hover:border-blue-400 hover:bg-blue-50"
              >
                Create Account
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="mt-10 grid max-w-xl grid-cols-3 gap-4">
              <div>
                <p className="text-2xl font-bold text-slate-900">1000+</p>
                <p className="text-sm text-slate-500">Books</p>
              </div>

              <div>
                <p className="text-2xl font-bold text-slate-900">500+</p>
                <p className="text-sm text-slate-500">Members</p>
              </div>

              <div>
                <p className="text-2xl font-bold text-slate-900">24/7</p>
                <p className="text-sm text-slate-500">Access</p>
              </div>
            </div>
          </div>

          {/* Hero Illustration */}
          <div className="relative">
            <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-blue-200 opacity-40 blur-3xl"></div>
            <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-indigo-200 opacity-40 blur-3xl"></div>

            <div className="relative rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
              
              {/* Dashboard Header */}
              <div className="mb-5 flex items-center justify-between border-b pb-4">
                <div>
                  <p className="text-sm text-slate-500">
                    Library Overview
                  </p>
                  <h3 className="text-xl font-bold text-slate-900">
                    Dashboard
                  </h3>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                  📊
                </div>
              </div>

              {/* Dashboard Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-blue-50 p-5">
                  <div className="mb-3 text-2xl">📚</div>
                  <p className="text-sm text-slate-500">Total Books</p>
                  <p className="mt-1 text-2xl font-bold text-blue-700">
                    1,248
                  </p>
                </div>

                <div className="rounded-2xl bg-green-50 p-5">
                  <div className="mb-3 text-2xl">👥</div>
                  <p className="text-sm text-slate-500">Members</p>
                  <p className="mt-1 text-2xl font-bold text-green-700">
                    536
                  </p>
                </div>

                <div className="rounded-2xl bg-orange-50 p-5">
                  <div className="mb-3 text-2xl">📖</div>
                  <p className="text-sm text-slate-500">Issued Books</p>
                  <p className="mt-1 text-2xl font-bold text-orange-700">
                    184
                  </p>
                </div>

                <div className="rounded-2xl bg-red-50 p-5">
                  <div className="mb-3 text-2xl">⚠️</div>
                  <p className="text-sm text-slate-500">Overdue</p>
                  <p className="mt-1 text-2xl font-bold text-red-700">
                    23
                  </p>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="mt-5 rounded-2xl bg-slate-50 p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="font-semibold text-slate-800">
                    Recent Activity
                  </h4>

                  <span className="text-xs font-medium text-green-600">
                    ● Live
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-lg bg-white p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                        📖
                      </div>

                      <div>
                        <p className="text-sm font-medium">
                          Book Issued
                        </p>
                        <p className="text-xs text-slate-500">
                          Java: The Complete Reference
                        </p>
                      </div>
                    </div>

                    <span className="text-xs text-slate-400">
                      Today
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-lg bg-white p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                        ✓
                      </div>

                      <div>
                        <p className="text-sm font-medium">
                          Book Returned
                        </p>
                        <p className="text-xs text-slate-500">
                          Clean Code
                        </p>
                      </div>
                    </div>

                    <span className="text-xs text-slate-400">
                      Today
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FEATURES ==================== */}
      <section id="features" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-semibold text-blue-600">
              FEATURES
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
              Everything You Need to Manage Your Library
            </h2>

            <p className="mt-4 text-slate-600">
              Manage daily library operations efficiently using a single
              centralized system.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            
            {/* Feature 1 */}
            <div className="custom-card rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-2xl">
                📚
              </div>

              <h3 className="mt-5 text-xl font-bold text-slate-900">
                Book Management
              </h3>

              <p className="mt-2 leading-7 text-slate-600">
                Add, update, search, and manage all books available in the
                library.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="custom-card rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-2xl">
                👥
              </div>

              <h3 className="mt-5 text-xl font-bold text-slate-900">
                Member Management
              </h3>

              <p className="mt-2 leading-7 text-slate-600">
                Maintain student and member information including contact
                details.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="custom-card rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-2xl">
                🔄
              </div>

              <h3 className="mt-5 text-xl font-bold text-slate-900">
                Issue &amp; Return
              </h3>

              <p className="mt-2 leading-7 text-slate-600">
                Track issued books, return dates, borrowing duration, and
                current status.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="custom-card rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-2xl">
                ⚠️
              </div>

              <h3 className="mt-5 text-xl font-bold text-slate-900">
                Due &amp; Overdue Tracking
              </h3>

              <p className="mt-2 leading-7 text-slate-600">
                Quickly identify books that are due today or have crossed
                their due date.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="custom-card rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-2xl">
                📱
              </div>

              <h3 className="mt-5 text-xl font-bold text-slate-900">
                SMS Notifications
              </h3>

              <p className="mt-2 leading-7 text-slate-600">
                Keep members informed about due dates, overdue books, and
                return confirmations.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="custom-card rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100 text-2xl">
                💰
              </div>

              <h3 className="mt-5 text-xl font-bold text-slate-900">
                Fine Management
              </h3>

              <p className="mt-2 leading-7 text-slate-600">
                Calculate and track fines for overdue books with a simple
                centralized system.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== ABOUT ==================== */}
      <section id="about" className="bg-slate-50 py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2">
          
          <div>
            <p className="font-semibold text-blue-600">
              ABOUT THE SYSTEM
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
              A Simple Solution for Modern Library Operations
            </h2>

            <p className="mt-5 leading-8 text-slate-600">
              LibManage is designed from the librarian's perspective. It
              provides a centralized interface for maintaining library
              records and monitoring everyday activities.
            </p>

            <p className="mt-4 leading-8 text-slate-600">
              The system helps librarians manage books, members, borrowing,
              returns, overdue records, notifications, and fines in an
              organized manner.
            </p>

            <div className="mt-7">
              <Link
                to="/login"
                className="inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                Explore Dashboard →
              </Link>
            </div>
          </div>

          {/* About Cards */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="text-3xl">🎯</div>
              <h3 className="mt-4 font-bold text-slate-900">
                Organized
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Keep all library information organized in one centralized
                system.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="text-3xl">⚡</div>
              <h3 className="mt-4 font-bold text-slate-900">
                Efficient
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Reduce manual work and quickly access important library
                information.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="text-3xl">🔒</div>
              <h3 className="mt-4 font-bold text-slate-900">
                Secure
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                The project can be extended with authentication and role-based
                access.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="text-3xl">📊</div>
              <h3 className="mt-4 font-bold text-slate-900">
                Informative
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Get a quick overview of books, members, issues, returns, and
                fines.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== CTA ==================== */}
      <section className="bg-blue-600 py-16">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to Manage Your Library?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-blue-100">
            Start managing your books, members, borrowing records, and
            library operations from one simple dashboard.
          </p>

          <div className="mt-7">
            <Link
              to="/login"
              className="inline-block rounded-xl bg-white px-7 py-3.5 font-semibold text-blue-700 shadow-lg transition hover:bg-blue-50"
            >
              Get Started →
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="bg-slate-900 py-8 text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 md:flex-row">
          
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">📚</span>
              <span className="font-bold">LibManage</span>
            </div>

            <p className="mt-1 text-sm text-slate-400">
              Library Management System
            </p>
          </div>

          <p className="text-sm text-slate-400">
            © 2026 LibManage. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Landing;