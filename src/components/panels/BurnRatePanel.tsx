import {
  Flame,
  Gauge,
  Info,
  AlertTriangle,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import type { BurnRate } from '../../server/ccusage.types';
import { formatCompactNumber, formatCurrency } from '../../lib/formatters';
import {
  SESSION_COST_LIMIT,
  WEEKLY_COST_LIMIT,
  getDaysUntilSunday,
} from '../../lib/constants';

interface BurnRatePanelProps {
  burnRate: BurnRate | null | undefined;
  remainingMinutes?: number;
  activeBlockCost?: number;
  activeBlockTokens?: number;
  totalWeeklyCost?: number;
  isLoading?: boolean;
}

export function BurnRatePanel({
  burnRate,
  remainingMinutes,
  activeBlockCost = 0,
  totalWeeklyCost = 0,
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

  const sessionQuotaPercent = Math.min(
    (activeBlockCost / SESSION_COST_LIMIT) * 100,
    100,
  );
  const weeklyQuotaPercent = Math.min(
    (totalWeeklyCost / WEEKLY_COST_LIMIT) * 100,
    100,
  );
  const daysUntilReset = getDaysUntilSunday();

  // Determine status color for session quota
  let sessionStatusColor = 'bg-blue-500';
  let sessionTextColor = 'text-blue-600 dark:text-blue-400';
  let SessionIcon = Info;

  if (sessionQuotaPercent > 80) {
    sessionStatusColor = 'bg-red-500';
    sessionTextColor = 'text-red-600 dark:text-red-400';
    SessionIcon = AlertTriangle;
  } else if (sessionQuotaPercent > 50) {
    sessionStatusColor = 'bg-amber-500';
    sessionTextColor = 'text-amber-600 dark:text-amber-400';
    SessionIcon = Info;
  } else if (sessionQuotaPercent > 0) {
    sessionStatusColor = 'bg-green-500';
    sessionTextColor = 'text-green-600 dark:text-green-400';
    SessionIcon = CheckCircle2;
  }

  // Determine status color for weekly quota
  let weeklyStatusColor = 'bg-blue-500';
  let weeklyTextColor = 'text-blue-600 dark:text-blue-400';
  let WeeklyIcon = Info;

  if (weeklyQuotaPercent > 80) {
    weeklyStatusColor = 'bg-red-500';
    weeklyTextColor = 'text-red-600 dark:text-red-400';
    WeeklyIcon = AlertTriangle;
  } else if (weeklyQuotaPercent > 50) {
    weeklyStatusColor = 'bg-amber-500';
    weeklyTextColor = 'text-amber-600 dark:text-amber-400';
    WeeklyIcon = Info;
  } else if (weeklyQuotaPercent > 0) {
    weeklyStatusColor = 'bg-green-500';
    weeklyTextColor = 'text-green-600 dark:text-green-400';
    WeeklyIcon = CheckCircle2;
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

        <div className="mt-6 space-y-4">
          {/* Session Quota */}
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <div className="flex items-center gap-1.5">
                <SessionIcon size={14} className={sessionTextColor} />
                <span className="text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase letter-spacing-tight">
                  Session Quota
                </span>
              </div>
              <span className={`text-sm font-black ${sessionTextColor}`}>
                {sessionQuotaPercent.toFixed(0)}%
              </span>
            </div>

            <div className="w-full bg-gray-100 dark:bg-zinc-800 rounded-full h-2.5 overflow-hidden">
              <div
                className={`${sessionStatusColor} h-full rounded-full transition-all duration-1000 ease-out`}
                style={{ width: `${sessionQuotaPercent}%` }}
              />
            </div>

            <div className="flex justify-between text-[10px] font-medium">
              <span className="text-gray-500">
                {formatCurrency(activeBlockCost)} used
              </span>
              <span className="text-gray-500">
                {formatCurrency(SESSION_COST_LIMIT)} limit
              </span>
            </div>
          </div>

          {/* Weekly Quota */}
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <div className="flex items-center gap-1.5">
                <WeeklyIcon size={14} className={weeklyTextColor} />
                <span className="text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase letter-spacing-tight">
                  Weekly Quota
                </span>
              </div>
              <span className={`text-sm font-black ${weeklyTextColor}`}>
                {weeklyQuotaPercent.toFixed(0)}%
              </span>
            </div>

            <div className="w-full bg-gray-100 dark:bg-zinc-800 rounded-full h-2.5 overflow-hidden">
              <div
                className={`${weeklyStatusColor} h-full rounded-full transition-all duration-1000 ease-out`}
                style={{ width: `${weeklyQuotaPercent}%` }}
              />
            </div>

            <div className="flex justify-between text-[10px] font-medium">
              <span className="text-gray-500">
                {formatCurrency(totalWeeklyCost)} used
              </span>
              <span className="text-gray-500">
                {formatCurrency(WEEKLY_COST_LIMIT)} limit
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100 dark:border-zinc-800 grid grid-cols-3 gap-3">
        <div className="space-y-0.5">
          <p className="text-[10px] font-bold text-gray-400 uppercase">
            Hourly Cost
          </p>
          <p className="text-sm font-bold text-gray-900 dark:text-white">
            {formatCurrency(burnRate.costPerHour)}/hr
          </p>
        </div>
        <div className="text-center space-y-0.5">
          <p className="text-[10px] font-bold text-gray-400 uppercase flex items-center justify-center gap-1">
            <Calendar size={10} />
            Week Reset
          </p>
          <p className="text-sm font-bold text-purple-600 dark:text-purple-400">
            {daysUntilReset === 0
              ? 'Today'
              : daysUntilReset === 1
                ? '1 day'
                : `${daysUntilReset} days`}
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
