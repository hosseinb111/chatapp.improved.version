import React from 'react';
import { Moon, Sun } from 'lucide-react';

interface HeaderProps {
  isDark: boolean;
  toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isDark, toggleTheme }) => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md p-4 sticky top-0 z-10 flex justify-between items-center rounded-b-2xl mx-2 mt-2">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-brand-600 dark:text-brand-500">
          Free & Complicated Messenger 😉✌️
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Real-time chaos with a sprinkle of order
        </p>
      </div>
      <button
        onClick={toggleTheme}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        aria-label="Toggle theme"
      >
        {isDark ? (
          <>
            <Sun className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium">Light</span>
          </>
        ) : (
          <>
            <Moon className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium">Dark</span>
          </>
        )}
      </button>
    </header>
  );
};
