import type { BurnRate } from '../../server/ccusage.types';
import { formatCompactNumber, formatCurrency } from '../../lib/formatters';

interface BurnRatePanelProps {
  burnRate: BurnRate | null | undefined;
  remainingMinutes?: number;
  isLoading?: boolean;
}

export function BurnRatePanel({
  burnRate,
  remainingMinutes,
  isLoading,
}: BurnRatePanelProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-sm font-medium text-gray-500">Burn Rate</h3>
        <div className="animate-pulse h-8 bg-gray-200 rounded mt-2 w-24" />
      </div>
    );
  }

  if (!burnRate) {
    return (
      <div className="bg-gray-50 rounded-lg shadow p-6">
        <h3 className="text-sm font-medium text-gray-500">Burn Rate</h3>
        <p className="text-xl font-semibold text-gray-400 mt-2">--</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-sm font-medium text-gray-500">Burn Rate</h3>
      <p className="text-2xl font-bold text-gray-900 mt-2">
        {formatCompactNumber(burnRate.tokensPerMinute)}
        <span className="text-lg font-normal text-gray-500">/min</span>
      </p>
      <div className="flex justify-between items-end mt-1">
        <p className="text-sm text-gray-600">
          {formatCurrency(burnRate.costPerHour)}/hour
        </p>

        {remainingMinutes !== undefined && remainingMinutes > 0 && (
          <p className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
            ~{formatCompactNumber(remainingMinutes)}m left
          </p>
        )}
      </div>
    </div>
  );
}
