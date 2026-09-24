import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

const LIGHT_THEME = {
  '--bg': '#F8F9FC',
  '--surface': '#FFFFFF',
  '--surface-2': '#F1F5F9',
  '--surface-sunken': '#E2E8F0',
  '--border': '#E2E8F0',
  '--border-focus': '#4F46E5',
  '--text': '#0F172A',
  '--text-primary': '#0F172A',
  '--text-secondary': '#475569',
  '--text-muted': '#94A3B8',
  '--primary': '#4F46E5',
  '--primary-dark': '#3730A3',
  '--primary-light': '#818CF8',
  '--accent': '#F59E0B',
  '--shadow-sm': '0 1px 3px rgba(0,0,0,0.08)',
  '--shadow-md': '0 4px 16px rgba(0,0,0,0.10)',
  '--shadow-lg': '0 12px 40px rgba(0,0,0,0.14)',
};

const DARK_THEME = {
  '--bg': '#0B0F19',
  '--surface': '#111827',
  '--surface-2': '#1F2937',
  '--surface-sunken': '#0D1117',
  '--border': '#374151',
  '--border-focus': '#818CF8',
  '--text': '#F9FAFB',
  '--text-primary': '#F9FAFB',
  '--text-secondary': '#D1D5DB',
  '--text-muted': '#9CA3AF',
  '--primary': '#6366F1',
  '--primary-dark': '#4F46E5',
  '--primary-light': '#818CF8',
  '--accent': '#FBBF24',
  '--shadow-sm': '0 1px 3px rgba(0,0,0,0.4)',
  '--shadow-md': '0 4px 16px rgba(0,0,0,0.5)',
  '--shadow-lg': '0 12px 40px rgba(0,0,0,0.6)',
};

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      const stored = localStorage.getItem('vh_theme');
      if (stored === 'dark' || stored === 'light') return stored;
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    } catch (e) {
      console.error(e);
    }
    return 'light';
  });

  const isDark = theme === 'dark';

  // Apply CSS variables and attributes dynamically
  useEffect(() => {
    const root = document.documentElement;
    const activeVars = isDark ? DARK_THEME : LIGHT_THEME;

    Object.entries(activeVars).forEach(([key, val]) => {
      root.style.setProperty(key, val);
    });

    root.setAttribute('data-theme', theme);
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    try {
      localStorage.setItem('vh_theme', theme);
    } catch (e) {
      console.error(e);
    }
  }, [theme, isDark]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const value = useMemo(() => ({
    theme,
    isDark,
    isLight: !isDark,
    toggleTheme,
    setTheme,
    // backwards compatibility aliases
    themeConfig: { preset: theme },
    setPreset: (preset) => setTheme(preset === 'dark' ? 'dark' : 'light'),
    currentPreset: { name: isDark ? 'Dark' : 'Light' },
  }), [theme, isDark, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
};
