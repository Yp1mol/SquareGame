import React from "react";
import { useTheme } from "../../hooks/useTheme";

export default function NavBar() {
  const { isDark, setIsDark } = useTheme();

  return (
    <nav className="bg-gray-100 dark:bg-gray-900 p-4 flex justify-end">
      <button
        onClick={() => setIsDark(!isDark)}
        className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
      >
        {isDark ? "☀️" : "🌙"}
      </button>
    </nav>
  );
}