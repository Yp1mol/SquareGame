import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    darkMode ? document.documentElement.classList.add('dark') : document.documentElement.classList.remove('dark');
  }, [darkMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser({ username, password });
      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 relative">
        <h1 className="text-3xl font-black mb-6 text-gray-900 dark:text-white text-center">Join Us</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full border dark:border-gray-600 p-3 rounded-xl bg-transparent dark:text-white outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Choose Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="w-full border dark:border-gray-600 p-3 rounded-xl bg-transparent dark:text-white outline-none focus:ring-2 focus:ring-green-500"
            type="password"
            placeholder="Create Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transform active:scale-95 transition">
            Create Account
          </button>
        </form>
        <p className="mt-6 text-center text-gray-500 dark:text-gray-400">
          Already have an account? <Link to="/login" className="text-blue-500 font-bold hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}