import { useEffect, useState } from 'react';
import { formatTimeAgo } from '../lib/formatters';

interface LastRefreshedProps {
  timestamp: number;
}

export function LastRefreshed({ timestamp }: LastRefreshedProps) {
  const [timeAgo, setTimeAgo] = useState('');

  useEffect(() => {
    const updateTime = () => {
      setTimeAgo(formatTimeAgo(timestamp));
    };

    // Initial update
    updateTime();

    // Update every second for the first minute, then every minute
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [timestamp]);

  if (!timestamp) return null;

  return (
    <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-300">
      <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
      <span>Last updated {timeAgo}</span>
    </div>
  );
}
