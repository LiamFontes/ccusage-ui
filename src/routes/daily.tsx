import { createFileRoute } from '@tanstack/react-router';
import { useCcusageDaily } from '../hooks/useCcusageDaily';
import { TokenUsageChart } from '../components/charts/TokenUsageChart';
import {
  formatCurrency,
  formatCompactNumber,
  formatDate,
} from '../lib/formatters';

export const Route = createFileRoute('/daily')({
  component: DailyPage,
});

function DailyPage() {
  const { data, isLoading, error } = useCcusageDaily();

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="text-red-800 font-medium">Error loading daily data</h3>
        <p className="text-red-700 text-sm mt-1">{error.message}</p>
      </div>
    );
  }

  const dailyEntries = data?.daily ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Daily Usage
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Token usage and costs by day
        </p>
      </div>

      <TokenUsageChart data={dailyEntries} isLoading={isLoading} />

      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow overflow-hidden border border-gray-100 dark:border-zinc-800">
        {/* Desktop Table */}
        <div className="hidden sm:block">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-800">
            <thead className="bg-gray-50 dark:bg-zinc-800/50">
              <tr>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Date
                </th>
                <th className="px-6 py-4 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Total Tokens
                </th>
                <th className="px-6 py-4 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Input
                </th>
                <th className="px-6 py-4 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Output
                </th>
                <th className="px-6 py-4 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Caching
                </th>
                <th className="px-6 py-4 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Cost
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-zinc-900 divide-y divide-gray-200 dark:divide-zinc-800">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8">
                    <div className="animate-pulse flex space-x-4 justify-center">
                      <div className="h-4 bg-gray-100 dark:bg-zinc-800 rounded w-1/3" />
                    </div>
                  </td>
                </tr>
              ) : (
                dailyEntries.map((entry) => (
                  <tr
                    key={entry.date}
                    className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-gray-100">
                      {formatDate(entry.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-zinc-400 text-right">
                      {formatCompactNumber(entry.totalTokens)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-zinc-500 text-right">
                      {formatCompactNumber(entry.inputTokens)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-zinc-500 text-right">
                      {formatCompactNumber(entry.outputTokens)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-zinc-500 text-right">
                      <span className="text-[10px] text-gray-400">R:</span>{' '}
                      {formatCompactNumber(entry.cacheReadTokens)}
                      <span className="mx-1 text-gray-300">|</span>
                      <span className="text-[10px] text-gray-400">W:</span>{' '}
                      {formatCompactNumber(entry.cacheCreationTokens)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-black text-gray-900 dark:text-white text-right">
                      {formatCurrency(entry.totalCost)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card List */}
        <div className="block sm:hidden divide-y divide-gray-100 dark:divide-zinc-800">
          {isLoading ? (
            <div className="p-6 text-center animate-pulse text-gray-400">
              Loading...
            </div>
          ) : (
            dailyEntries.map((entry) => (
              <div key={entry.date} className="p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {formatDate(entry.date)}
                  </span>
                  <span className="text-sm font-black text-blue-600 dark:text-blue-400">
                    {formatCurrency(entry.totalCost)}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">
                      Tokens
                    </p>
                    <p className="font-medium text-gray-700 dark:text-zinc-300">
                      {formatCompactNumber(entry.totalTokens)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">
                      Input / Output
                    </p>
                    <p className="font-medium text-gray-700 dark:text-zinc-300">
                      {formatCompactNumber(entry.inputTokens)} /{' '}
                      {formatCompactNumber(entry.outputTokens)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
