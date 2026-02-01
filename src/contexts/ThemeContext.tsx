import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  actualTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem('theme') as Theme;
    return stored || 'system';
  });

  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const root = window.document.documentElement;
    
    const getSystemTheme = () => {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    const applyTheme = (newTheme: 'light' | 'dark') => {
      root.classList.remove('light', 'dark');
      root.classList.add(newTheme);
      setActualTheme(newTheme);
    };

    if (theme === 'system') {
      const systemTheme = getSystemTheme();
      applyTheme(systemTheme);

      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        applyTheme(e.matches ? 'dark' : 'light');
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      applyTheme(theme);
    }
  }, [theme]);

  const handleSetTheme = (newTheme: Theme) => {
    localStorage.setItem('theme', newTheme);
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme, actualTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
