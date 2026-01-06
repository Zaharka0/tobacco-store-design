import { useEffect } from 'react';

const THEME_API_URL = 'https://functions.poehali.dev/ede28564-2e57-4545-aebb-ff117c81a6f4';

export function useTheme() {
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const response = await fetch(THEME_API_URL);
        if (!response.ok) return;
        
        const colors = await response.json();
        
        const root = document.documentElement;
        Object.entries(colors).forEach(([key, value]) => {
          root.style.setProperty(`--${key}`, value as string);
        });
      } catch (error) {
        console.error('Failed to load theme:', error);
      }
    };

    loadTheme();
  }, []);
}
