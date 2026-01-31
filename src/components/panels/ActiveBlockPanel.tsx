import type { Block } from '../../server/ccusage.types';
import {
  formatCurrency,
  formatMinutes,
  formatDateTime,
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
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Active Block
        </h3>
        <div className="animate-pulse h-8 bg-gray-200 dark:bg-zinc-800 rounded mt-2 w-24" />
      </div>
    );
  }

  if (!activeBlock) {
    return (
      <div className="bg-gray-50 dark:bg-zinc-900 rounded-lg shadow p-6">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Active Block
        </h3>
        <p className="text-xl font-semibold text-gray-400 dark:text-gray-600 mt-2">
          No active block
        </p>
      </div>
    );
  }

  const remainingMinutes = activeBlock.projection?.remainingMinutes ?? 0;
  const projectedCost =
    activeBlock.projection?.totalCost ?? activeBlock.costUSD;

  return (
    <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/20 rounded-lg shadow p-6">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <h3 className="text-sm font-medium text-green-700 dark:text-green-400">
          Active Block
        </h3>
      </div>
      <div className="mt-3 space-y-2">
        <div className="flex justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Entries
          </span>
          <span className="font-medium text-gray-900 dark:text-gray-200">
            {activeBlock.entries}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Current Cost
          </span>
          <span className="font-medium text-gray-900 dark:text-gray-200">
            {formatCurrency(activeBlock.costUSD)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Projected Cost
          </span>
          <span className="font-medium text-amber-600 dark:text-amber-400">
            {formatCurrency(projectedCost)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Time Remaining
          </span>
          <span className="font-medium text-gray-900 dark:text-gray-200">
            {formatMinutes(remainingMinutes)}
          </span>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-500 mt-2 pt-2 border-t border-green-200 dark:border-green-900/20">
          Started {formatDateTime(activeBlock.startTime)}
        </div>
      </div>
    </div>
  );
}
