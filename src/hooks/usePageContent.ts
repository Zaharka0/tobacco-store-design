import { useState, useEffect } from 'react';

const CONTENT_API_URL = 'https://functions.poehali.dev/0f5283c3-17d4-488f-8881-4751a4272c14';

interface ContentBlock {
  id: number;
  page_name: string;
  block_key: string;
  block_type: string;
  content: any;
  is_visible: boolean;
  display_order: number;
}

export function usePageContent(pageName: string) {
  const [content, setContent] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(`${CONTENT_API_URL}?page=${pageName}`);
        if (!response.ok) throw new Error('Failed to load content');
        
        const data: ContentBlock[] = await response.json();
        
        const contentMap: Record<string, any> = {};
        data
          .filter(block => block.is_visible)
          .forEach(block => {
            contentMap[block.block_key] = block.content;
          });
        
        setContent(contentMap);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [pageName]);

  const getText = (key: string, defaultValue: string = '') => {
    return content[key] || defaultValue;
  };

  const getJson = (key: string, defaultValue: any = null) => {
    return content[key] || defaultValue;
  };

  return { content, loading, error, getText, getJson };
}
