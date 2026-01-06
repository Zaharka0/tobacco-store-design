import { useState, useEffect } from 'react';

const SITE_CONTENT_API_URL = 'https://functions.poehali.dev/7546cfc1-3fc6-4986-9138-b14f9fb94058';

interface ContentItem {
  value: string;
  section: string;
  description: string;
}

interface SiteContent {
  [key: string]: ContentItem;
}

export function useSiteContent() {
  const [content, setContent] = useState<SiteContent>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const response = await fetch(SITE_CONTENT_API_URL);
      if (!response.ok) throw new Error('Failed to load content');
      const data = await response.json();
      setContent(data);
    } catch (error) {
      console.error('Failed to load site content:', error);
    } finally {
      setLoading(false);
    }
  };

  const getText = (key: string, fallback: string = ''): string => {
    return content[key]?.value || fallback;
  };

  return { content, loading, getText, reload: loadContent };
}
