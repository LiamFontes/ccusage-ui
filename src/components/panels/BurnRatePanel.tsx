import type { BurnRate } from '../../server/ccusage.types';
import { formatCompactNumber, formatCurrency } from '../../lib/formatters';

interface BurnRatePanelProps {
  burnRate: BurnRate | null | undefined;
  remainingMinutes?: number;
  activeBlockCost?: number;
  activeBlockTokens?: number;
  isLoading?: boolean;
}

export function BurnRatePanel({
  burnRate,
  remainingMinutes,
  activeBlockCost = 0,
  activeBlockTokens = 0,
  isLoading,
}: BurnRatePanelProps) {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Burn Rate
        </h3>
        <div className="animate-pulse h-8 bg-gray-200 dark:bg-zinc-800 rounded mt-2 w-24" />
      </div>
    );
  }

  if (!burnRate) {
    return (
      <div className="bg-gray-50 dark:bg-zinc-900 rounded-lg shadow p-6">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Burn Rate
        </h3>
        <p className="text-xl font-semibold text-gray-400 dark:text-gray-600 mt-2">
          --
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
        Burn Rate
      </h3>
      <p className="text-2xl font-bold text-gray-900 dark:text-gray-50 mt-2">
        {formatCompactNumber(burnRate.tokensPerMinute)}
        <span className="text-lg font-normal text-gray-500 dark:text-gray-400">
          /min
        </span>
      </p>
      <div className="mt-6 pt-6 border-t border-gray-100 dark:border-zinc-800 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Session Cost
          </p>
          <p className="text-lg font-medium text-gray-900 dark:text-white mt-1">
            {formatCurrency(activeBlockCost)}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Session Tokens
          </p>
          <p className="text-lg font-medium text-gray-900 dark:text-white mt-1">
            {formatCompactNumber(activeBlockTokens)}
          </p>
        </div>
      </div>
      <div className="flex justify-between items-end mt-4 pt-4 border-t border-gray-100 dark:border-zinc-800">
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Hourly Rate
          </span>
          <span className="text-sm font-medium text-gray-900 dark:text-gray-200">
            {formatCurrency(burnRate.costPerHour)}/hr
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Token Rate
          </span>
          <span className="text-sm font-medium text-gray-900 dark:text-gray-200">
            {formatCompactNumber(burnRate.tokensPerMinute * 60)}/hr
          </span>
        </div>

        {remainingMinutes !== undefined && remainingMinutes > 0 && (
          <div className="ml-4">
            <p className="text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-md border border-amber-100 dark:border-amber-900/30 whitespace-nowrap">
              ~{formatCompactNumber(remainingMinutes)}m left
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
