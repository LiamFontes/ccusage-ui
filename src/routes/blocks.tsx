import { createFileRoute } from '@tanstack/react-router';
import { TrendingUp } from 'lucide-react';
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

      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow overflow-hidden border border-gray-100 dark:border-zinc-800">
        {/* Desktop Table */}
        <div className="hidden sm:block">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-800">
            <thead className="bg-gray-50 dark:bg-zinc-800/50">
              <tr>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Start Time
                </th>
                <th className="px-6 py-4 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Entries
                </th>
                <th className="px-6 py-4 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Tokens
                </th>
                <th className="px-6 py-4 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Cost
                </th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Models
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
                nonGapBlocks.map((block) => (
                  <tr
                    key={block.id}
                    className={`hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors ${block.isActive ? 'bg-green-50/50 dark:bg-green-900/10' : ''}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      {block.isActive ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 uppercase tracking-tight">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-500 dark:bg-zinc-800 dark:text-zinc-500 uppercase tracking-tight">
                          Completed
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      {formatDateTime(block.startTime)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-zinc-400 text-right">
                      {block.entries}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-zinc-400 text-right">
                      {formatCompactNumber(block.totalTokens)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-black text-gray-900 dark:text-white text-right">
                      {formatCurrency(block.costUSD)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex flex-wrap gap-1">
                        {block.models
                          .filter((m) => m !== '<synthetic>')
                          .map((model) => (
                            <span
                              key={model}
                              className="inline-flex px-1.5 py-0.5 text-[10px] font-medium rounded bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400"
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

        {/* Mobile Card List */}
        <div className="block sm:hidden divide-y divide-gray-100 dark:divide-zinc-800">
          {isLoading ? (
            <div className="p-6 text-center animate-pulse text-gray-400">
              Loading...
            </div>
          ) : (
            nonGapBlocks.map((block) => (
              <div
                key={block.id}
                className={`p-4 space-y-3 ${block.isActive ? 'bg-green-50/50 dark:bg-green-900/10' : ''}`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-500 dark:text-zinc-400">
                    {formatDateTime(block.startTime)}
                  </span>
                  {block.isActive ? (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 uppercase tracking-tight">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-500 dark:bg-zinc-800 dark:text-zinc-500 uppercase tracking-tight">
                      Completed
                    </span>
                  )}
                </div>
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">
                      Tokens
                    </p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {formatCompactNumber(block.totalTokens)}
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">
                      Cost
                    </p>
                    <p className="text-sm font-black text-blue-600 dark:text-blue-400">
                      {formatCurrency(block.costUSD)}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {block.models
                    .filter((m) => m !== '<synthetic>')
                    .map((model) => (
                      <span
                        key={model}
                        className="inline-flex px-1.5 py-0.5 text-[9px] font-bold rounded bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-500 uppercase tracking-tighter"
                      >
                        {model.split('-').slice(0, 2).join(' ')}
                      </span>
                    ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function ActiveBlockAlert({ block }: { block: Block }) {
  const burnRate = block.burnRate;
  const projection = block.projection;

  return (
    <div className="bg-green-50/50 dark:bg-green-950/10 border border-green-200 dark:border-green-900/30 rounded-xl p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        <div className="flex-shrink-0 flex items-center gap-3">
          <div className="relative">
            <div className="w-4 h-4 bg-green-500 rounded-full animate-ping absolute inset-0 opacity-75" />
            <div className="w-4 h-4 bg-green-500 rounded-full relative shadow-[0_0_10px_rgba(34,197,94,0.4)]" />
          </div>
          <div>
            <h3 className="text-xl font-black text-green-800 dark:text-green-400 uppercase tracking-tighter">
              Active Block
            </h3>
            <p className="text-xs font-bold text-green-700/60 dark:text-green-300/60 uppercase tracking-widest">
              Live Monitoring
            </p>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
              Started
            </p>
            <p className="text-sm font-bold text-gray-900 dark:text-white uppercase">
              {new Date(block.startTime).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
              Current Cost
            </p>
            <p className="text-sm font-bold text-gray-900 dark:text-white">
              {formatCurrency(block.costUSD)}
            </p>
          </div>
          {burnRate && (
            <>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                  Burn Rate
                </p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  {formatCompactNumber(burnRate.tokensPerMinute)}/m
                </p>
              </div>
              <div className="space-y-1 text-right md:text-left">
                <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                  Proj. Remainder
                </p>
                <p className="text-sm font-bold text-amber-600 dark:text-amber-400">
                  ~
                  {projection
                    ? formatMinutes(projection.remainingMinutes)
                    : '--'}
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {projection && (
        <div className="mt-6 p-4 bg-white/60 dark:bg-zinc-900/60 rounded-lg border border-green-100 dark:border-green-900/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-amber-50 dark:bg-amber-900/20 rounded">
              <TrendingUp size={14} className="text-amber-600" />
            </div>
            <p className="text-sm font-bold text-gray-700 dark:text-zinc-300">
              Estimated Block Completion
            </p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-[10px] font-bold text-gray-400 uppercase">
                Total Tokens
              </p>
              <p className="text-sm font-black text-gray-900 dark:text-white">
                {formatCompactNumber(projection.totalTokens)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-gray-400 uppercase">
                Total Cost
              </p>
              <p className="text-sm font-black text-gray-900 dark:text-white">
                {formatCurrency(projection.totalCost)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
