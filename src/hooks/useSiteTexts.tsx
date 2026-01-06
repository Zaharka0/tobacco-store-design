import { useState, useEffect } from 'react';

const TEXTS_API_URL = 'https://functions.poehali.dev/310d84a8-a8a4-4b85-9dfa-a83fce97e4f8';

interface TextItem {
  value: string;
  section: string;
  description: string;
}

interface SiteTexts {
  [key: string]: TextItem;
}

export function useSiteTexts() {
  const [texts, setTexts] = useState<SiteTexts>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTexts();
  }, []);

  const loadTexts = async () => {
    try {
      const response = await fetch(TEXTS_API_URL);
      if (!response.ok) throw new Error('Failed to load texts');
      const data = await response.json();
      setTexts(data);
    } catch (error) {
      console.error('Failed to load site texts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getText = (key: string, fallback: string = ''): string => {
    return texts[key]?.value || fallback;
  };

  return { texts, loading, getText, reload: loadTexts };
}
