import React from "react";
import { Moon, Sun } from "lucide-react";
import { useDarkMode } from "../contexts/DarkModeContext";

const DarkModeToggle = ({ className = "" }) => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <button
      onClick={toggleDarkMode}
      className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
        isDarkMode
          ? "bg-gray-700 hover:bg-gray-600 text-yellow-300"
          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
      } ${className}`}
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      <div className="relative w-5 h-5">
        {isDarkMode ? (
          <Moon className="w-5 h-5 transition-all duration-300 rotate-0" />
        ) : (
          <Sun className="w-5 h-5 transition-all duration-300 rotate-0" />
        )}
      </div>
    </button>
  );
};

export default DarkModeToggle;
