'use client';

import { Moon, Sun } from '@/lib/icons';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9 rounded-full bg-gray-200 animate-pulse" />;
  }

  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="relative w-9 h-9 rounded-full bg-gradient-to-r from-[#ed5925] to-[#96abdc] p-0.5 hover:from-[#d14a1f] hover:to-[#7a95d1] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <div className="w-full h-full rounded-full bg-white dark:bg-[#002244] flex items-center justify-center transition-colors duration-300">
        {isDark ? (
          <Sun className="w-4 h-4 text-[#ed5925] transition-transform duration-300 rotate-0" />
        ) : (
          <Moon className="w-4 h-4 text-[#004953] transition-transform duration-300 rotate-0" />
        )}
      </div>
    </button>
  );
}
