import { useState, useEffect } from 'react';

export function useOnlineUsers() {
  const [onlineCount, setOnlineCount] = useState(0);

  useEffect(() => {
    const generateRealisticCount = () => {
      const baseCount = 15;
      const variation = Math.floor(Math.random() * 10);
      return baseCount + variation;
    };

    setOnlineCount(generateRealisticCount());

    const interval = setInterval(() => {
      setOnlineCount(generateRealisticCount());
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return onlineCount;
}
