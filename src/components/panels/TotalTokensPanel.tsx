import { formatCompactNumber, formatNumber } from '../../lib/formatters';

import { ModelBreakdown } from '../../server/ccusage.types';

interface TotalTokensPanelProps {
  totalTokens: number;
  modelBreakdowns?: ModelBreakdown[];
  isLoading?: boolean;
}

export function TotalTokensPanel({
  totalTokens,
  modelBreakdowns = [],
  isLoading,
}: TotalTokensPanelProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
        Total Tokens
      </h3>
      {isLoading ? (
        <div className="animate-pulse h-8 bg-gray-200 dark:bg-zinc-800 rounded mt-2 w-24" />
      ) : (
        <>
          <p
            className="text-3xl font-bold text-gray-900 dark:text-white mt-2"
            title={formatNumber(totalTokens)}
          >
            {formatCompactNumber(totalTokens)}
          </p>
          {modelBreakdowns.length > 0 && (
            <div className="mt-6 space-y-6">
              <div className="h-px bg-gray-100 dark:bg-zinc-800" />
              <div className="space-y-6">
                {modelBreakdowns.map((model) => (
                  <div key={model.modelName} className="text-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className="font-medium text-gray-700 dark:text-gray-300 truncate"
                        title={model.modelName}
                      >
                        {model.modelName}
                      </span>
                      <span
                        className="font-medium text-gray-900 dark:text-gray-200"
                        title={`Total: ${formatNumber(model.inputTokens + model.outputTokens)}`}
                      >
                        {formatCompactNumber(
                          model.inputTokens + model.outputTokens,
                        )}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-gray-500 dark:text-gray-400 pl-2 border-l-2 border-gray-100 dark:border-zinc-800">
                      <div className="flex justify-between">
                        <span>Input:</span>
                        <span>{formatCompactNumber(model.inputTokens)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Output:</span>
                        <span>{formatCompactNumber(model.outputTokens)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cache Read:</span>
                        <span>
                          {formatCompactNumber(model.cacheReadTokens)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cache Write:</span>
                        <span>
                          {formatCompactNumber(model.cacheCreationTokens)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
