import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { resolvedTheme, setTheme } = useTheme();

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="relative inline-flex h-5 w-9 items-center rounded-full bg-gray-200 dark:bg-gray-700 transition-colors focus:outline-none"
      title={`Switch to ${isDark ? 'light' : 'dark'} theme`}
    >
      <span
        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
          isDark ? 'translate-x-5' : 'translate-x-1'
        }`}
      >
        {isDark ? (
          <Moon className="h-2 w-2 text-gray-700 m-0.5" />
        ) : (
          <Sun className="h-2 w-2 text-yellow-500 m-0.5" />
        )}
      </span>
    </button>
  );
};

export default ThemeToggle;