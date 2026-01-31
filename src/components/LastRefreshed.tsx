import { useEffect, useState } from 'react';
import { RefreshCw, Clock } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { formatTimeAgo } from '../lib/formatters';

interface LastRefreshedProps {
  timestamp: number;
}

export function LastRefreshed({ timestamp }: LastRefreshedProps) {
  const [timeAgo, setTimeAgo] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const updateTime = () => {
      setTimeAgo(formatTimeAgo(timestamp));
    };

    updateTime();
    const interval = setInterval(updateTime, 10000); // Update less frequently now
    return () => clearInterval(interval);
  }, [timestamp]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await queryClient.invalidateQueries();
    // Artificial delay for visual feedback
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  if (!timestamp) return null;

  return (
    <div className="flex items-center gap-3">
      <div className="flex flex-col items-end">
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest">
          <Clock size={10} />
          Last Synchronized
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
          <span className="text-sm font-bold text-gray-700 dark:text-zinc-300">
            {timeAgo}
          </span>
        </div>
      </div>

      <button
        onClick={handleRefresh}
        disabled={isRefreshing}
        className={`p-2 rounded-lg bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-500 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-blue-500 transition-all duration-200 shadow-sm ${isRefreshing ? 'opacity-50 pointer-events-none' : ''}`}
        title="Refresh data"
      >
        <RefreshCw
          size={16}
          className={isRefreshing ? 'animate-spin text-blue-500' : ''}
        />
      </button>
    </div>
  );
}
