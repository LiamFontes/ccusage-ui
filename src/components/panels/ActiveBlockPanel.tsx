import { Zap, TrendingUp, Clock, History } from 'lucide-react';
import type { Block } from '../../server/ccusage.types';
import {
  formatCurrency,
  formatMinutes,
  formatDateTime,
  formatCompactNumber,
} from '../../lib/formatters';

interface ActiveBlockPanelProps {
  activeBlock: Block | undefined;
  isLoading?: boolean;
}

export function ActiveBlockPanel({
  activeBlock,
  isLoading,
}: ActiveBlockPanelProps) {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6 h-full border border-transparent">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Active Session
        </h3>
        <div className="animate-pulse h-8 bg-gray-200 dark:bg-zinc-800 rounded mt-2 w-24" />
      </div>
    );
  }

  if (!activeBlock) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6 h-full border border-dashed border-gray-200 dark:border-zinc-800 flex flex-col justify-center items-center text-center">
        <History className="w-8 h-8 text-gray-300 dark:text-zinc-700 mb-2" />
        <h3 className="text-sm font-medium text-gray-400 dark:text-gray-600">
          No Active Session
        </h3>
        <p className="text-xs text-gray-400 dark:text-gray-600 mt-1 max-w-[150px]">
          Claude Code is not currently running.
        </p>
      </div>
    );
  }

  const remainingMinutes = activeBlock.projection?.remainingMinutes ?? 0;
  const projectedCost =
    activeBlock.projection?.totalCost ?? activeBlock.costUSD;
  const projectedTokens = activeBlock.projection?.totalTokens ?? 0;

  return (
    <div className="bg-green-50/50 dark:bg-green-950/10 border border-green-200/50 dark:border-green-900/20 rounded-lg shadow-sm p-6 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping absolute inset-0 opacity-75" />
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full relative" />
          </div>
          <h3 className="text-sm font-bold text-green-700 dark:text-green-400 uppercase tracking-wider">
            Active Session
          </h3>
        </div>
        <Zap size={16} className="text-green-600 dark:text-green-500" />
      </div>

      <div className="mt-4 flex-grow space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">
              Cost
            </p>
            <p className="text-lg font-bold text-gray-900 dark:text-white leading-none">
              {formatCurrency(activeBlock.costUSD)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">
              Time
            </p>
            <p className="text-lg font-bold text-gray-900 dark:text-white leading-none flex items-center gap-1">
              <Clock size={14} className="text-gray-400" />
              {formatMinutes(remainingMinutes)}
            </p>
          </div>
        </div>

        {activeBlock.projection && (
          <div className="mt-4 p-3 bg-white/60 dark:bg-zinc-900/60 rounded-lg border border-green-100 dark:border-green-900/30 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-tight">
              <TrendingUp size={12} />
              Projection
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] text-gray-500">Projected Cost</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  {formatCurrency(projectedCost)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-gray-500">Est. Tokens</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  {formatCompactNumber(projectedTokens)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-auto pt-4 flex items-center gap-1.5">
        <Clock size={10} />
        Started {formatDateTime(activeBlock.startTime)}
      </div>
    </div>
  );
}
