import { createFileRoute } from '@tanstack/react-router';
import { useCcusageBlocks } from '../hooks/useCcusageBlocks';
import {
  formatCurrency,
  formatCompactNumber,
  formatDateTime,
  formatMinutes,
} from '../lib/formatters';
import type { Block } from '../server/ccusage.types';

export const Route = createFileRoute('/blocks')({
  component: BlocksPage,
});

function BlocksPage() {
  const { data, isLoading, error } = useCcusageBlocks();

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="text-red-800 font-medium">Error loading blocks data</h3>
        <p className="text-red-700 text-sm mt-1">{error.message}</p>
      </div>
    );
  }

  const blocks = data?.blocks ?? [];
  const activeBlock = blocks.find((b) => b.isActive);
  const nonGapBlocks = blocks.filter((b) => !b.isGap);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Billing Blocks
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          5-hour billing block analysis and projections
        </p>
      </div>

      {activeBlock && <ActiveBlockAlert block={activeBlock} />}

      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-800">
          <thead className="bg-gray-50 dark:bg-zinc-800/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Start Time
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Entries
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Tokens
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Cost
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Models
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-zinc-900 divide-y divide-gray-200 dark:divide-zinc-800">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-6 py-4">
                  <div className="animate-pulse flex space-x-4">
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-3/4" />
                      <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-1/2" />
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              nonGapBlocks.map((block) => (
                <tr
                  key={block.id}
                  className={`hover:bg-gray-50 dark:hover:bg-zinc-800/50 ${block.isActive ? 'bg-green-50 dark:bg-green-900/10' : ''}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    {block.isActive ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-zinc-800 dark:text-gray-300">
                        Completed
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {formatDateTime(block.startTime)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 text-right">
                    {block.entries}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 text-right">
                    {formatCompactNumber(block.totalTokens)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100 text-right">
                    {formatCurrency(block.costUSD)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex flex-wrap gap-1">
                      {block.models
                        .filter((m) => m !== '<synthetic>')
                        .map((model) => (
                          <span
                            key={model}
                            className="inline-flex px-2 py-0.5 text-xs rounded bg-gray-100 dark:bg-zinc-800 dark:text-gray-300"
                          >
                            {model.split('-').slice(0, 2).join(' ')}
                          </span>
                        ))}
                    </div>
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

function ActiveBlockAlert({ block }: { block: Block }) {
  const burnRate = block.burnRate;
  const projection = block.projection;

  return (
    <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/30 rounded-lg p-6">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mt-1" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-medium text-green-800 dark:text-green-400">
            Active Block
          </h3>
          <p className="text-green-700 dark:text-green-300 mt-1">
            Started {formatDateTime(block.startTime)} with {block.entries}{' '}
            entries
          </p>

          {burnRate && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-green-600 dark:text-green-400">
                  Burn Rate
                </p>
                <p className="text-xl font-semibold text-green-900 dark:text-green-100">
                  {formatCompactNumber(burnRate.tokensPerMinute)}/min
                </p>
              </div>
              <div>
                <p className="text-sm text-green-600 dark:text-green-400">
                  Cost Rate
                </p>
                <p className="text-xl font-semibold text-green-900 dark:text-green-100">
                  {formatCurrency(burnRate.costPerHour)}/hr
                </p>
              </div>
              {projection && (
                <div>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    Time Remaining
                  </p>
                  <p className="text-xl font-semibold text-green-900 dark:text-green-100">
                    {formatMinutes(projection.remainingMinutes)}
                  </p>
                </div>
              )}
            </div>
          )}

          {projection && (
            <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <p className="text-sm text-green-800 dark:text-green-300">
                <span className="font-medium">Projection:</span> This block will
                use approximately {formatCompactNumber(projection.totalTokens)}{' '}
                tokens and cost {formatCurrency(projection.totalCost)} by
                completion.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
