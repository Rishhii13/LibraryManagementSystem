import { useState } from "react";
import { Link } from "react-router-dom";

function Settings() {
  const [saved, setSaved] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [autoReminders, setAutoReminders] = useState(true);

  const handleSave = () => {
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* ================= SIDEBAR ================= */}

      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-64 border-r border-slate-800 bg-slate-900 md:block">

        {/* Logo */}

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

          <Link to="/fine-management">
            <NavItem
              icon="💰"
              text="Fine Management"
            />
          </Link>

          <NavItem
            icon="⚙️"
            text="Settings"
            active
          />

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
              Settings
            </h2>

            <p className="text-sm text-slate-500">
              Manage your library system preferences
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

        {/* Content */}

        <div className="p-6 lg:p-8">

          {/* Page Header */}

          <div>

            <p className="text-sm text-indigo-400">
              System Configuration
            </p>

            <h1 className="mt-1 text-3xl font-bold">
              Library Settings
            </h1>

            <p className="mt-2 text-slate-400">
              Configure library information, borrowing rules and notifications.
            </p>

          </div>

          {/* Success Message */}

          {saved && (
            <div className="mt-6 rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-green-400">
              ✅ Settings saved successfully.
            </div>
          )}

          {/* ================= LIBRARY INFORMATION ================= */}

          <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900">

            <div className="border-b border-slate-800 p-6">

              <h2 className="text-lg font-bold">
                🏫 Library Information
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Basic information about your library.
              </p>

            </div>

            <div className="grid gap-5 p-6 md:grid-cols-2">

              <Input
                label="Library Name"
                defaultValue="LibManage Library"
              />

              <Input
                label="Librarian Name"
                defaultValue="Library Administrator"
              />

              <Input
                label="Email Address"
                type="email"
                defaultValue="library@example.com"
              />

              <Input
                label="Phone Number"
                type="tel"
                defaultValue="+91 98765 43210"
              />

              <div className="md:col-span-2">

                <label className="text-sm font-medium text-slate-300">
                  Library Address
                </label>

                <textarea
                  rows="3"
                  defaultValue="VESIT Campus, Mumbai, Maharashtra"
                  className="mt-2 w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
                />

              </div>

            </div>

          </section>

          {/* ================= BORROWING SETTINGS ================= */}

          <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900">

            <div className="border-b border-slate-800 p-6">

              <h2 className="text-lg font-bold">
                📚 Borrowing Rules
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Configure how books can be issued and returned.
              </p>

            </div>

            <div className="grid gap-5 p-6 md:grid-cols-3">

              <Input
                label="Maximum Books per Student"
                type="number"
                defaultValue="3"
              />

              <Input
                label="Borrowing Period (Days)"
                type="number"
                defaultValue="7"
              />

              <Input
                label="Fine per Late Day (₹)"
                type="number"
                defaultValue="10"
              />

            </div>

          </section>

          {/* ================= NOTIFICATION SETTINGS ================= */}

          <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900">

            <div className="border-b border-slate-800 p-6">

              <h2 className="text-lg font-bold">
                📱 Notification Settings
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Control reminders and student notifications.
              </p>

            </div>

            <div className="divide-y divide-slate-800">

              <ToggleSetting
                title="SMS Notifications"
                description="Send SMS notifications to students."
                enabled={smsNotifications}
                onChange={() =>
                  setSmsNotifications(!smsNotifications)
                }
              />

              <ToggleSetting
                title="Email Notifications"
                description="Send library notifications through email."
                enabled={emailNotifications}
                onChange={() =>
                  setEmailNotifications(!emailNotifications)
                }
              />

              <ToggleSetting
                title="Automatic Reminders"
                description="Automatically remind students before and after the due date."
                enabled={autoReminders}
                onChange={() =>
                  setAutoReminders(!autoReminders)
                }
              />

            </div>

          </section>

          {/* ================= REMINDER CONFIGURATION ================= */}

          <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900">

            <div className="border-b border-slate-800 p-6">

              <h2 className="text-lg font-bold">
                ⏰ Reminder Configuration
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Configure when students should receive reminders.
              </p>

            </div>

            <div className="grid gap-5 p-6 md:grid-cols-3">

              <Input
                label="Before Due Date"
                type="number"
                defaultValue="1"
              />

              <Input
                label="Due Date Reminder"
                defaultValue="On Due Date"
              />

              <Input
                label="Overdue Reminder"
                defaultValue="Every 2 Days"
              />

            </div>

          </section>

          {/* ================= SYSTEM SETTINGS ================= */}

          <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900">

            <div className="border-b border-slate-800 p-6">

              <h2 className="text-lg font-bold">
                ⚙️ System Preferences
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                General preferences for the library management system.
              </p>

            </div>

            <div className="grid gap-5 p-6 md:grid-cols-2">

              <div>

                <label className="text-sm font-medium text-slate-300">
                  Date Format
                </label>

                <select
                  defaultValue="DD MMM YYYY"
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
                >

                  <option>
                    DD MMM YYYY
                  </option>

                  <option>
                    DD/MM/YYYY
                  </option>

                  <option>
                    MM/DD/YYYY
                  </option>

                </select>

              </div>

              <div>

                <label className="text-sm font-medium text-slate-300">
                  Language
                </label>

                <select
                  defaultValue="English"
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
                >

                  <option>
                    English
                  </option>

                  <option>
                    Hindi
                  </option>

                </select>

              </div>

            </div>

          </section>

          {/* ================= SAVE BUTTON ================= */}

          <div className="mt-6 flex justify-end">

            <button
              onClick={handleSave}
              className="rounded-xl bg-indigo-600 px-7 py-3 font-semibold hover:bg-indigo-500"
            >
              💾 Save Settings
            </button>

          </div>

          {/* ================= INFORMATION ================= */}

          <div className="mt-6 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-6">

            <div className="flex gap-4">

              <div className="text-2xl">
                💡
              </div>

              <div>

                <h3 className="font-bold">
                  Settings Information
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  These settings control the basic behaviour of the library
                  management system. Backend integration can be connected
                  later to permanently store these preferences.
                </p>

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


function Input({
  label,
  defaultValue,
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
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
      />

    </div>
  );
}


function ToggleSetting({
  title,
  description,
  enabled,
  onChange,
}) {
  return (
    <div className="flex items-center justify-between gap-5 p-6">

      <div>

        <p className="font-semibold">
          {title}
        </p>

        <p className="mt-1 text-sm text-slate-500">
          {description}
        </p>

      </div>

      <button
        onClick={onChange}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          enabled
            ? "bg-indigo-600"
            : "bg-slate-700"
        }`}
      >

        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
            enabled
              ? "left-6"
              : "left-1"
          }`}
        />

      </button>

    </div>
  );
}


export default Settings;