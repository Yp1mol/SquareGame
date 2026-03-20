import React from "react";
import { useTheme } from "../../hooks/useTheme";

export default function NavBar() {
  const { isDark, setIsDark } = useTheme();

  return (
    <nav className="bg-gray-900 p-4 flex justify-end">
      <button
        onClick={() => setIsDark(!isDark)}
        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700"
      >
        {isDark ? "☀️" : "🌙"}
      </button>
    </nav>
  );
}