import { createFileRoute } from '@tanstack/react-router';
import { useCcusageDaily } from '../hooks/useCcusageDaily';
import { useCcusageBlocks } from '../hooks/useCcusageBlocks';
import { TotalCostPanel } from '../components/panels/TotalCostPanel';
import { TotalTokensPanel } from '../components/panels/TotalTokensPanel';
import { ActiveBlockPanel } from '../components/panels/ActiveBlockPanel';
import { BurnRatePanel } from '../components/panels/BurnRatePanel';
import { TokenUsageChart } from '../components/charts/TokenUsageChart';
import { CostBreakdownChart } from '../components/charts/CostBreakdownChart';
import { AccumulatedCostChart } from '../components/charts/AccumulatedCostChart';
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

    // If we have a projection, take the minimum of time-based and cost-based
    // Otherwise just use cost-based
    if (remainingMinutes !== undefined) {
      remainingMinutes = Math.min(remainingMinutes, costBasedRemainingMinutes);
    } else {
      remainingMinutes = costBasedRemainingMinutes;
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-600 mt-1">
            Real-time Claude Code token usage and costs
          </p>
        </div>
        <LastRefreshed timestamp={lastRefreshed} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <TotalCostPanel
          totalCost={totals?.totalCost ?? 0}
          isLoading={isDailyLoading}
        />
        <TotalTokensPanel
          totalTokens={totals?.totalTokens ?? 0}
          modelBreakdowns={totals?.modelBreakdowns}
          isLoading={isDailyLoading}
        />
        <ActiveBlockPanel
          activeBlock={activeBlock}
          isLoading={isBlocksLoading}
        />
        <BurnRatePanel
          burnRate={activeBlock?.burnRate}
          remainingMinutes={remainingMinutes}
          isLoading={isBlocksLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TokenUsageChart
          data={dailyData?.daily ?? []}
          isLoading={isDailyLoading}
        />
        <CostBreakdownChart
          data={dailyData?.daily ?? []}
          isLoading={isDailyLoading}
        />
        <AccumulatedCostChart
          data={dailyData?.daily ?? []}
          isLoading={isDailyLoading}
        />
      </div>

      {activeBlock?.projection && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h3 className="font-medium text-amber-800">
            Active Block Projection
          </h3>
          <p className="text-amber-700 mt-1">
            At the current rate, this block will use approximately{' '}
            <span className="font-semibold">
              {activeBlock.projection.totalTokens.toLocaleString()} tokens
            </span>{' '}
            and cost{' '}
            <span className="font-semibold">
              ${activeBlock.projection.totalCost.toFixed(2)}
            </span>{' '}
            by the time it ends.
          </p>
        </div>
      )}
    </div>
  );
}
