import { useState } from 'react';
import { Cpu, ChevronRight, ChevronUp } from 'lucide-react';
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
  const [showAll, setShowAll] = useState(false);

  const displayedModels = showAll
    ? modelBreakdowns
    : modelBreakdowns.slice(0, 2);
  const otherModelsCount = Math.max(0, modelBreakdowns.length - 2);

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
          Total Tokens
        </h3>
        <Cpu size={18} className="text-blue-500" />
      </div>

      <div className="flex-grow flex flex-col justify-center">
        {isLoading ? (
          <div className="animate-pulse h-8 bg-gray-200 dark:bg-zinc-800 rounded w-24" />
        ) : (
          <>
            <div className="flex items-baseline gap-1">
              <span
                className="text-4xl font-black text-gray-900 dark:text-white"
                title={formatNumber(totalTokens)}
              >
                {formatCompactNumber(totalTokens)}
              </span>
            </div>

            <div
              className={`mt-8 space-y-5 ${showAll ? 'max-h-[300px] overflow-y-auto pr-2 custom-scrollbar' : ''}`}
            >
              {displayedModels.map((model) => {
                const modelTotal =
                  model.inputTokens +
                  model.outputTokens +
                  model.cacheCreationTokens +
                  model.cacheReadTokens;
                const percentage =
                  totalTokens > 0 ? (modelTotal / totalTokens) * 100 : 0;

                return (
                  <div key={model.modelName} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-gray-700 dark:text-zinc-300 truncate max-w-[120px]">
                        {model.modelName}
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        {formatCompactNumber(modelTotal)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-500 h-full rounded-full transition-all duration-700"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}

              {otherModelsCount > 0 && (
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight hover:underline w-full pt-1"
                >
                  {showAll ? (
                    <>
                      Show Less
                      <ChevronUp size={12} />
                    </>
                  ) : (
                    <>
                      View {otherModelsCount}{' '}
                      {otherModelsCount === 1 ? 'other model' : 'other models'}
                      <ChevronRight size={12} />
                    </>
                  )}
                </button>
              )}
            </div>
          </>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100 dark:border-zinc-800 grid grid-cols-3 gap-1 text-center">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase">Input</p>
          <p className="text-xs font-bold text-gray-700 dark:text-zinc-300">
            {formatCompactNumber(
              modelBreakdowns.reduce((acc, m) => acc + m.inputTokens, 0),
            )}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase">
            Output
          </p>
          <p className="text-xs font-bold text-gray-700 dark:text-zinc-300">
            {formatCompactNumber(
              modelBreakdowns.reduce((acc, m) => acc + m.outputTokens, 0),
            )}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase">
            Cached
          </p>
          <p className="text-xs font-bold text-gray-700 dark:text-zinc-300">
            {formatCompactNumber(
              modelBreakdowns.reduce(
                (acc, m) => acc + m.cacheCreationTokens + m.cacheReadTokens,
                0,
              ),
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
