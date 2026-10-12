import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6 py-10">

      <div className="w-full max-w-lg">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-2xl">
            📚
          </div>

          <h1 className="mt-4 text-3xl font-bold">
            Create Librarian Account
          </h1>

          <p className="mt-2 text-slate-400">
            Set up your library management account
          </p>
        </div>

        {/* Signup Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">

          <form onSubmit={handleSignup}>

            {/* Name */}
            <label className="text-sm font-medium text-slate-300">
              Librarian Name
            </label>

            <input
              type="text"
              placeholder="Enter your full name"
              required
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
            />

            {/* Library Name */}
            <label className="mt-5 block text-sm font-medium text-slate-300">
              Library Name
            </label>

            <input
              type="text"
              placeholder="Enter library name"
              required
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
            />

            {/* Email */}
            <label className="mt-5 block text-sm font-medium text-slate-300">
              Email Address
            </label>

            <input
              type="email"
              placeholder="librarian@example.com"
              required
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
            />

            {/* Phone */}
            <label className="mt-5 block text-sm font-medium text-slate-300">
              Phone Number
            </label>

            <input
              type="tel"
              placeholder="+91 XXXXX XXXXX"
              required
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
            />

            {/* Password */}
            <label className="mt-5 block text-sm font-medium text-slate-300">
              Password
            </label>

            <input
              type="password"
              placeholder="Create a strong password"
              required
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
            />

            {/* Button */}
            <button
              type="submit"
              className="mt-6 w-full rounded-xl bg-indigo-600 py-3 font-semibold hover:bg-indigo-500"
            >
              Create Librarian Account
            </button>

          </form>

          <div className="my-6 border-t border-slate-800" />

          <p className="text-center text-sm text-slate-400">
            Already have an account?
          </p>

          <Link
            to="/login"
            className="mt-3 block w-full rounded-xl border border-slate-700 py-3 text-center font-semibold hover:bg-slate-800"
          >
            Login
          </Link>

          <Link
            to="/"
            className="mt-5 block text-center text-sm text-indigo-400 hover:text-indigo-300"
          >
            ← Back to Landing Page
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Signup;