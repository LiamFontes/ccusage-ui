import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
} from 'lucide-react';
import { formatCurrency } from '../../lib/formatters';
import { ModelBreakdown } from '../../server/ccusage.types';

interface TotalCostPanelProps {
  totalCost: number;
  modelBreakdowns?: ModelBreakdown[];
  dailyCosts?: { date: string; cost: number }[];
  isLoading?: boolean;
}

export function TotalCostPanel({
  totalCost,
  modelBreakdowns = [],
  dailyCosts = [],
  isLoading,
}: TotalCostPanelProps) {
  // Sort and slice data
  const topModels = [...modelBreakdowns]
    .sort((a, b) => b.cost - a.cost)
    .slice(0, 3);

  const recentDays = [...dailyCosts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  // Simple trend calculation (comparing today with yesterday)
  const todayValue = recentDays[0]?.cost ?? 0;
  const yesterdayValue = recentDays[1]?.cost ?? 0;
  const isTrendingUp = todayValue > yesterdayValue;
  const trendPercent =
    yesterdayValue > 0
      ? ((todayValue - yesterdayValue) / yesterdayValue) * 100
      : 0;

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
          Total Cost
        </h3>
        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <DollarSign size={18} className="text-blue-600 dark:text-blue-400" />
        </div>
      </div>

      <div className="flex-grow flex flex-col justify-center">
        {isLoading ? (
          <div className="animate-pulse h-8 bg-gray-200 dark:bg-zinc-800 rounded w-24" />
        ) : (
          <>
            <div className="flex items-center gap-3">
              <span className="text-4xl font-black text-gray-900 dark:text-white">
                {formatCurrency(totalCost)}
              </span>
              {trendPercent !== 0 && (
                <div
                  className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${isTrendingUp ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400' : 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400'}`}
                >
                  {isTrendingUp ? (
                    <TrendingUp size={12} />
                  ) : (
                    <TrendingDown size={12} />
                  )}
                  {Math.abs(trendPercent).toFixed(0)}%
                </div>
              )}
            </div>

            <div className="mt-8 space-y-5">
              <div className="space-y-3">
                <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-tight flex items-center gap-1">
                  <ArrowUpRight size={12} />
                  Top Model Spending
                </p>
                <div className="space-y-2.5">
                  {topModels.map((model) => (
                    <div
                      key={model.modelName}
                      className="flex justify-between items-center group"
                    >
                      <span className="text-xs font-bold text-gray-600 dark:text-zinc-400 truncate group-hover:text-blue-500 transition-colors">
                        {model.modelName}
                      </span>
                      <span className="text-xs font-black text-gray-900 dark:text-white">
                        {formatCurrency(model.cost)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-tight">
                  Recent Daily Spend
                </p>
                <div className="space-y-2.5">
                  {recentDays.map((day) => (
                    <div
                      key={day.date}
                      className="flex justify-between items-center"
                    >
                      <span className="text-xs font-medium text-gray-500 dark:text-zinc-500">
                        {new Date(day.date).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      <span className="text-xs font-bold text-gray-900 dark:text-white">
                        {formatCurrency(day.cost)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
