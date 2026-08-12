import React from "react";
import { useTheme } from "../../hooks/useTheme";
import { Link } from "react-router-dom";
import { useAuth } from "../../features/auth/authContext";

export default function NavBar() {
  const { isDark, setIsDark } = useTheme();
  const { token } = useAuth();

  return (
    <nav className="dark:bg-gray-900 p-4 flex justify-end items-center gap-4">
      <button
        onClick={() => setIsDark(!isDark)}
        className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
      >
        {isDark ? "☀️" : "🌙"}
      </button>

      {token && (
        <Link to="/notifications" className="relative p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <span className="text-xl">🔔</span>
        </Link>
      )}
    </nav>
  );
}