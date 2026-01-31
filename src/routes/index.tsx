import { createFileRoute } from '@tanstack/react-router';
import { DollarSign, Activity, Calendar, Zap } from 'lucide-react';
import { useCcusageDaily } from '../hooks/useCcusageDaily';
import { useCcusageBlocks } from '../hooks/useCcusageBlocks';
import { TotalCostPanel } from '../components/panels/TotalCostPanel';
import { TotalTokensPanel } from '../components/panels/TotalTokensPanel';
import { ActiveBlockPanel } from '../components/panels/ActiveBlockPanel';
import { BurnRatePanel } from '../components/panels/BurnRatePanel';
import { TokenUsageChart } from '../components/charts/TokenUsageChart';
import { CostBreakdownChart } from '../components/charts/CostBreakdownChart';
import { AccumulatedCostChart } from '../components/charts/AccumulatedCostChart';
import { QuotaProjectionChart } from '../components/charts/QuotaProjectionChart';
import { LastRefreshed } from '../components/LastRefreshed';
import { calculateTotals } from '../server/ccusage.types';
import { SESSION_COST_LIMIT } from '../lib/constants';

export const Route = createFileRoute('/')({
  component: Dashboard,
});

function Dashboard() {
  const {
    data: dailyData,
    isLoading: isDailyLoading,
    dataUpdatedAt: dailyUpdatedAt,
  } = useCcusageDaily();

  const {
    data: blocksData,
    isLoading: isBlocksLoading,
    dataUpdatedAt: blocksUpdatedAt,
  } = useCcusageBlocks();

  const totals = dailyData?.daily ? calculateTotals(dailyData.daily) : null;
  const activeBlock = blocksData?.blocks.find((block) => block.isActive);

  const lastRefreshed = Math.max(dailyUpdatedAt, blocksUpdatedAt || 0);

  // Calculate remaining minutes based on both time projection and cost limit
  let remainingMinutes = activeBlock?.projection?.remainingMinutes;

  if (
    activeBlock &&
    activeBlock.burnRate &&
    activeBlock.burnRate.costPerHour > 0
  ) {
    const remainingBudget = Math.max(
      0,
      SESSION_COST_LIMIT - activeBlock.costUSD,
    );
    const costBasedRemainingMinutes =
      (remainingBudget / activeBlock.burnRate.costPerHour) * 60;

    // Use cost-based limit if we don't have a backend projection,
    // or if the cost-based limit is MORE restrictive (safety fallback)
    if (remainingMinutes !== undefined) {
      remainingMinutes = Math.min(remainingMinutes, costBasedRemainingMinutes);
    } else {
      remainingMinutes = costBasedRemainingMinutes;
    }
  }

  const todayStr = new Date().toISOString().split('T')[0];
  const todayEntry = dailyData?.daily?.find((d) => d.date === todayStr);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            Dashboard
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Real-time Claude Code token usage and costs
          </p>
        </div>
        <LastRefreshed timestamp={lastRefreshed} />
      </div>

      {/* Summary Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Today's Spend",
            value: `$${todayEntry?.totalCost.toFixed(2) ?? '0.00'}`,
            icon: <DollarSign size={14} className="text-blue-500" />,
            trend: todayEntry?.totalCost ? 'Live' : 'Idle',
          },
          {
            label: 'Active Sessions',
            value: activeBlock ? '1' : '0',
            icon: <Activity size={14} className="text-green-500" />,
            trend: activeBlock ? 'Monitoring' : 'None',
          },
          {
            label: 'Days in Period',
            value: dailyData?.daily?.length ?? 0,
            icon: <Calendar size={14} className="text-purple-500" />,
            trend: 'Current Cycle',
          },
          {
            label: 'Cycle Status',
            value: 'Active',
            icon: <Zap size={14} className="text-amber-500" />,
            trend: 'Standard',
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="card-premium p-4 flex flex-col justify-between"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest">
                {stat.label}
              </span>
              <div className="p-1.5 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                {stat.icon}
              </div>
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900 dark:text-white">
                {stat.value}
              </p>
              <p className="text-[10px] font-bold text-gray-400 dark:text-zinc-600 uppercase mt-1">
                {stat.trend}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="min-h-[280px]">
          <TotalCostPanel
            totalCost={totals?.totalCost ?? 0}
            modelBreakdowns={totals?.modelBreakdowns}
            dailyCosts={dailyData?.daily?.map((d) => ({
              date: d.date,
              cost: d.totalCost,
            }))}
            isLoading={isDailyLoading}
          />
        </div>
        <div className="min-h-[280px]">
          <TotalTokensPanel
            totalTokens={totals?.totalTokens ?? 0}
            modelBreakdowns={totals?.modelBreakdowns}
            isLoading={isDailyLoading}
          />
        </div>
        <div className="min-h-[280px]">
          <ActiveBlockPanel
            activeBlock={activeBlock}
            isLoading={isBlocksLoading}
          />
        </div>
        <div className="min-h-[280px]">
          <BurnRatePanel
            burnRate={activeBlock?.burnRate}
            remainingMinutes={remainingMinutes}
            activeBlockCost={activeBlock?.costUSD}
            activeBlockTokens={activeBlock?.totalTokens}
            isLoading={isBlocksLoading}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <TokenUsageChart
            data={dailyData?.daily ?? []}
            isLoading={isDailyLoading}
          />
          <AccumulatedCostChart
            data={dailyData?.daily ?? []}
            isLoading={isDailyLoading}
          />
        </div>
        <div className="space-y-6">
          <CostBreakdownChart
            data={dailyData?.daily ?? []}
            isLoading={isDailyLoading}
          />
          <QuotaProjectionChart
            activeBlock={activeBlock}
            limit={SESSION_COST_LIMIT}
            isLoading={isBlocksLoading}
          />
        </div>
      </div>
    </div>
  );
}
