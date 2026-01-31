import { createFileRoute } from '@tanstack/react-router';
import { useCcusageSessions } from '../hooks/useCcusageSessions';
import {
  formatCurrency,
  formatCompactNumber,
  formatDate,
  getModelDisplayName,
} from '../lib/formatters';
import { useState } from 'react';
import type { Session } from '../server/ccusage.types';

export const Route = createFileRoute('/sessions')({
  component: SessionsPage,
});

function SessionsPage() {
  const { data, isLoading, error } = useCcusageSessions();
  const [expandedSession, setExpandedSession] = useState<string | null>(null);

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="text-red-800 font-medium">
          Error loading sessions data
        </h3>
        <p className="text-red-700 text-sm mt-1">{error.message}</p>
      </div>
    );
  }

  const sessions = data?.sessions ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Sessions
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Token usage and costs by conversation session
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-800">
          <thead className="bg-gray-50 dark:bg-zinc-800/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Session ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Last Activity
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Total Tokens
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Cost
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Models
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-zinc-900 divide-y divide-gray-200 dark:divide-zinc-800">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-6 py-4">
                  <div className="animate-pulse flex space-x-4">
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-3/4" />
                      <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-1/2" />
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              sessions.map((session, index) => (
                <SessionRow
                  key={`${session.sessionId}-${index}`}
                  session={session}
                  isExpanded={expandedSession === session.sessionId}
                  onToggle={() =>
                    setExpandedSession(
                      expandedSession === session.sessionId
                        ? null
                        : session.sessionId,
                    )
                  }
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface SessionRowProps {
  session: Session;
  isExpanded: boolean;
  onToggle: () => void;
}

function SessionRow({ session, isExpanded, onToggle }: SessionRowProps) {
  return (
    <>
      <tr
        className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 cursor-pointer"
        onClick={onToggle}
      >
        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-gray-400">{isExpanded ? '▼' : '▶'}</span>
            <span className="truncate max-w-xs" title={session.sessionId}>
              {session.sessionId}
            </span>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
          {formatDate(session.lastActivity)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 text-right">
          {formatCompactNumber(session.totalTokens)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100 text-right">
          {formatCurrency(session.totalCost)}
        </td>
        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex flex-wrap gap-1">
            {session.modelsUsed.map((model) => (
              <span
                key={model}
                className="inline-flex px-2 py-0.5 text-xs rounded bg-gray-100 dark:bg-zinc-800 dark:text-gray-300"
              >
                {getModelDisplayName(model)}
              </span>
            ))}
          </div>
        </td>
      </tr>
      {isExpanded && (
        <tr>
          <td colSpan={5} className="px-6 py-4 bg-gray-50 dark:bg-zinc-800/30">
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Input Tokens
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {formatCompactNumber(session.inputTokens)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Output Tokens
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {formatCompactNumber(session.outputTokens)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Cache Creation
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {formatCompactNumber(session.cacheCreationTokens)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Cache Read
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {formatCompactNumber(session.cacheReadTokens)}
                  </p>
                </div>
              </div>

              {session.modelBreakdowns.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Model Breakdown
                  </h4>
                  <div className="bg-white dark:bg-zinc-900 rounded border border-gray-200 dark:border-zinc-700 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-800">
                      <thead className="bg-gray-50 dark:bg-zinc-800/50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                            Model
                          </th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400">
                            Input
                          </th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400">
                            Output
                          </th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400">
                            Cache Creation
                          </th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400">
                            Cache Read
                          </th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400">
                            Cost
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
                        {session.modelBreakdowns.map((breakdown) => (
                          <tr key={breakdown.modelName}>
                            <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">
                              {getModelDisplayName(breakdown.modelName)}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 text-right">
                              {formatCompactNumber(breakdown.inputTokens)}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 text-right">
                              {formatCompactNumber(breakdown.outputTokens)}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 text-right">
                              {formatCompactNumber(
                                breakdown.cacheCreationTokens,
                              )}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 text-right">
                              {formatCompactNumber(breakdown.cacheReadTokens)}
                            </td>
                            <td className="px-4 py-2 text-sm font-medium text-gray-900 dark:text-gray-100 text-right">
                              {formatCurrency(breakdown.cost)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
