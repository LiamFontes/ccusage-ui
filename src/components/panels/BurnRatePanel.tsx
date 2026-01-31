import { Flame, Gauge, Info, AlertTriangle, CheckCircle2 } from 'lucide-react';
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
  isLoading,
}: BurnRatePanelProps) {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6 h-full border border-transparent">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Burn Rate
        </h3>
        <div className="animate-pulse h-8 bg-gray-200 dark:bg-zinc-800 rounded mt-2 w-24" />
      </div>
    );
  }

  if (!burnRate) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6 h-full border border-dashed border-gray-200 dark:border-zinc-800 flex flex-col justify-center items-center text-center">
        <Gauge className="w-8 h-8 text-gray-300 dark:text-zinc-700 mb-2" />
        <h3 className="text-sm font-medium text-gray-400 dark:text-gray-600">
          No Activity
        </h3>
        <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">
          Start using Claude Code to see metrics.
        </p>
      </div>
    );
  }

  const quotaLimit = 5.0;
  const quotaPercent = Math.min((activeBlockCost / quotaLimit) * 100, 100);

  let statusColor = 'bg-blue-500';
  let textColor = 'text-blue-600 dark:text-blue-400';
  let Icon = Info;

  if (quotaPercent > 80) {
    statusColor = 'bg-red-500';
    textColor = 'text-red-600 dark:text-red-400';
    Icon = AlertTriangle;
  } else if (quotaPercent > 50) {
    statusColor = 'bg-amber-500';
    textColor = 'text-amber-600 dark:text-amber-400';
    Icon = Info;
  } else if (quotaPercent > 0) {
    statusColor = 'bg-green-500';
    textColor = 'text-green-600 dark:text-green-400';
    Icon = CheckCircle2;
  }

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
          Burn Rate
        </h3>
        <Flame size={18} className="text-orange-500" />
      </div>

      <div className="flex-grow flex flex-col justify-center">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-black text-gray-900 dark:text-white">
            {formatCompactNumber(burnRate.tokensPerMinute)}
          </span>
          <span className="text-sm font-medium text-gray-500 dark:text-zinc-500">
            tokens / min
          </span>
        </div>

        <div className="mt-8 space-y-3">
          <div className="flex justify-between items-end">
            <div className="flex items-center gap-1.5">
              <Icon size={14} className={textColor} />
              <span className="text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase letter-spacing-tight">
                Session Quota
              </span>
            </div>
            <span className={`text-sm font-black ${textColor}`}>
              {quotaPercent.toFixed(0)}%
            </span>
          </div>

          <div className="w-full bg-gray-100 dark:bg-zinc-800 rounded-full h-3 overflow-hidden">
            <div
              className={`${statusColor} h-full rounded-full transition-all duration-1000 ease-out`}
              style={{ width: `${quotaPercent}%` }}
            />
          </div>

          <div className="flex justify-between text-[11px] font-medium">
            <span className="text-gray-500">
              {formatCurrency(activeBlockCost)} used
            </span>
            <span className="text-gray-500">
              {formatCurrency(quotaLimit)} limit
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100 dark:border-zinc-800 flex justify-between items-center">
        <div className="space-y-0.5">
          <p className="text-[10px] font-bold text-gray-400 uppercase">
            Hourly Cost
          </p>
          <p className="text-sm font-bold text-gray-900 dark:text-white">
            {formatCurrency(burnRate.costPerHour)}/hr
          </p>
        </div>
        <div className="text-right space-y-0.5">
          <p className="text-[10px] font-bold text-gray-400 uppercase">
            Projection
          </p>
          <p className="text-sm font-bold text-amber-600 dark:text-amber-400">
            ~{remainingMinutes ? formatCompactNumber(remainingMinutes) : '0'}m
            left
          </p>
        </div>
      </div>
    </div>
  );
}
