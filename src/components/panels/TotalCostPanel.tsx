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
    .slice(0, 5);

  const recentDays = [...dailyCosts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-sm font-medium text-gray-500">Total Cost</h3>
      {isLoading ? (
        <div className="animate-pulse h-8 bg-gray-200 rounded mt-2 w-24" />
      ) : (
        <>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {formatCurrency(totalCost)}
          </p>

          {(topModels.length > 0 || recentDays.length > 0) && (
            <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col gap-6">
              {topModels.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    By Model
                  </h4>
                  <div className="space-y-2">
                    {topModels.map((model) => (
                      <div
                        key={model.modelName}
                        className="flex justify-between items-center text-sm"
                      >
                        <span
                          className="text-gray-600 truncate mr-2"
                          title={model.modelName}
                        >
                          {model.modelName}
                        </span>
                        <span className="font-medium text-gray-900 whitespace-nowrap">
                          {formatCurrency(model.cost)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {recentDays.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    By Day
                  </h4>
                  <div className="space-y-2">
                    {recentDays.map((day) => (
                      <div
                        key={day.date}
                        className="flex justify-between items-center text-sm"
                      >
                        <span className="text-gray-600">
                          {new Date(day.date).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                        <span className="font-medium text-gray-900">
                          {formatCurrency(day.cost)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
