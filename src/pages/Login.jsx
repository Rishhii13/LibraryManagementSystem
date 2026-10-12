import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Invalid email or password.");
        setLoading(false);
        return;
      }

      // Save JWT token
      localStorage.setItem("token", data.token);

      // Save logged-in user details
      localStorage.setItem("user", JSON.stringify(data.user));

      // Go to dashboard only after successful authentication
      navigate("/dashboard");
    } catch (error) {
      setError(
        "Unable to connect to the server. Make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">

      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-2xl">
            📚
          </div>

          <h1 className="mt-4 text-3xl font-bold">
            Librarian Login
          </h1>

          <p className="mt-2 text-slate-400">
            Sign in to manage your library
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">

          <form onSubmit={handleLogin}>

            {/* Email */}
            <label className="text-sm font-medium text-slate-300">
              Email Address
            </label>

            <input
              type="email"
              placeholder="librarian@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
            />

            {/* Password */}
            <label className="mt-5 block text-sm font-medium text-slate-300">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
            />

            {/* Error Message */}
            {error && (
              <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-xl bg-indigo-600 py-3 font-semibold hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login to Dashboard"}
            </button>

          </form>

          <div className="my-6 border-t border-slate-800" />

          <p className="text-center text-sm text-slate-400">
            Don't have a librarian account?
          </p>

          <Link
            to="/signup"
            className="mt-3 block w-full rounded-xl border border-slate-700 py-3 text-center font-semibold hover:bg-slate-800"
          >
            Create Librarian Account
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

export default Login;