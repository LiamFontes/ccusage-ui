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

      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-800">
          <thead className="bg-gray-50 dark:bg-zinc-800/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Total Tokens
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Input
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Output
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Cache Creation
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Cache Read
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Cost
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-zinc-900 divide-y divide-gray-200 dark:divide-zinc-800">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-6 py-4">
                  <div className="animate-pulse flex space-x-4">
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-3/4" />
                      <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-1/2" />
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              dailyEntries.map((entry) => (
                <tr
                  key={entry.date}
                  className="hover:bg-gray-50 dark:hover:bg-zinc-800/50"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                    {formatDate(entry.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 text-right">
                    {formatCompactNumber(entry.totalTokens)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-right">
                    {formatCompactNumber(entry.inputTokens)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-right">
                    {formatCompactNumber(entry.outputTokens)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-right">
                    {formatCompactNumber(entry.cacheCreationTokens)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-right">
                    {formatCompactNumber(entry.cacheReadTokens)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100 text-right">
                    {formatCurrency(entry.totalCost)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
