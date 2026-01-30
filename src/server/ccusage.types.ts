export interface TokenCounts {
  inputTokens: number;
  outputTokens: number;
  cacheCreationInputTokens: number;
  cacheReadInputTokens: number;
}

export interface BurnRate {
  tokensPerMinute: number;
  tokensPerMinuteForIndicator: number;
  costPerHour: number;
}

export interface BlockProjection {
  totalTokens: number;
  totalCost: number;
  remainingMinutes: number;
}

export interface Block {
  id: string;
  startTime: string;
  endTime: string;
  actualEndTime: string | null;
  isActive: boolean;
  isGap: boolean;
  entries: number;
  tokenCounts: TokenCounts;
  totalTokens: number;
  costUSD: number;
  models: string[];
  burnRate: BurnRate | null;
  projection: BlockProjection | null;
}

export interface BlocksResponse {
  blocks: Block[];
}

export interface ModelBreakdown {
  modelName: string;
  inputTokens: number;
  outputTokens: number;
  cacheCreationTokens: number;
  cacheReadTokens: number;
  cost: number;
}

export interface DailyEntry {
  date: string;
  inputTokens: number;
  outputTokens: number;
  cacheCreationTokens: number;
  cacheReadTokens: number;
  totalTokens: number;
  totalCost: number;
  modelsUsed: string[];
  modelBreakdowns: ModelBreakdown[];
}

export interface DailyResponse {
  daily: DailyEntry[];
}

export interface Session {
  sessionId: string;
  inputTokens: number;
  outputTokens: number;
  cacheCreationTokens: number;
  cacheReadTokens: number;
  totalTokens: number;
  totalCost: number;
  lastActivity: string;
  modelsUsed: string[];
  modelBreakdowns: ModelBreakdown[];
  projectPath: string;
}

export interface SessionsResponse {
  sessions: Session[];
}

export interface Totals {
  totalCost: number;
  totalTokens: number;
  inputTokens: number;
  outputTokens: number;
  cacheCreationTokens: number;
  cacheReadTokens: number;
  modelBreakdowns: ModelBreakdown[];
}

export function calculateTotals(daily: DailyEntry[]): Totals {
  // Aggregate model breakdowns across all daily entries
  const modelMap = new Map<string, ModelBreakdown>();

  daily.forEach((entry) => {
    entry.modelBreakdowns.forEach((breakdown) => {
      const existing = modelMap.get(breakdown.modelName);
      if (existing) {
        existing.inputTokens += breakdown.inputTokens;
        existing.outputTokens += breakdown.outputTokens;
        existing.cacheCreationTokens += breakdown.cacheCreationTokens;
        existing.cacheReadTokens += breakdown.cacheReadTokens;
        existing.cost += breakdown.cost;
      } else {
        modelMap.set(breakdown.modelName, { ...breakdown });
      }
    });
  });

  // Convert map to array and sort by cost descending
  const modelBreakdowns = Array.from(modelMap.values()).sort(
    (a, b) => b.cost - a.cost,
  );

  return daily.reduce(
    (acc, entry) => ({
      ...acc,
      totalCost: acc.totalCost + entry.totalCost,
      totalTokens: acc.totalTokens + entry.totalTokens,
      inputTokens: acc.inputTokens + entry.inputTokens,
      outputTokens: acc.outputTokens + entry.outputTokens,
      cacheCreationTokens: acc.cacheCreationTokens + entry.cacheCreationTokens,
      cacheReadTokens: acc.cacheReadTokens + entry.cacheReadTokens,
    }),
    {
      totalCost: 0,
      totalTokens: 0,
      inputTokens: 0,
      outputTokens: 0,
      cacheCreationTokens: 0,
      cacheReadTokens: 0,
      modelBreakdowns,
    },
  );
}
