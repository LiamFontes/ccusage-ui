import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
} from 'recharts';
import type { Block } from '../../server/ccusage.types';
import { formatCurrency } from '../../lib/formatters';
import { useIsDark } from '../ThemeProvider';

interface QuotaProjectionChartProps {
  activeBlock: Block | undefined;
  limit: number;
  isLoading?: boolean;
}

export function QuotaProjectionChart({
  activeBlock,
  limit,
  isLoading,
}: QuotaProjectionChartProps) {
  const isDark = useIsDark();

  if (isLoading) {
    return (
      <div className="card-premium p-6 h-[400px]">
        <h3 className="text-sm font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-6">
          Quota Projection
        </h3>
        <div className="animate-pulse bg-gray-100 dark:bg-zinc-800/50 rounded-lg h-[280px]" />
      </div>
    );
  }

  if (!activeBlock || !activeBlock.burnRate) {
    return (
      <div className="card-premium p-6 h-[400px] flex flex-col">
        <h3 className="text-sm font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-widest mb-6">
          Quota Projection
        </h3>
        <div className="flex-grow flex items-center justify-center text-gray-400 dark:text-zinc-600 font-medium">
          No active session to project
        </div>
      </div>
    );
  }

  const startTime = new Date(activeBlock.startTime).getTime();
  const now = Date.now();
  const currentCost = activeBlock.costUSD;
  const costPerHour = activeBlock.burnRate.costPerHour;

  const costPerMs = costPerHour / (60 * 60 * 1000);
  const msRemaining = (limit - currentCost) / costPerMs;
  const projectedEndTime = now + Math.max(0, msRemaining); // Ensure non-negative

  const data = [
    {
      time: startTime,
      actualCost: 0,
      projectedCost: 0,
    },
    {
      time: now,
      actualCost: currentCost,
      projectedCost: currentCost,
    },
    {
      time: projectedEndTime,
      projectedCost: limit,
    },
  ];

  const formatTimeKey = (time: number) => {
    return new Date(time).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="card-premium p-6">
      <h3 className="text-sm font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-widest mb-6">
        Quota Projection
      </h3>
      <div className="h-[300px] sm:h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke={isDark ? '#27272a' : '#f1f5f9'}
            />
            <XAxis
              dataKey="time"
              type="number"
              domain={['dataMin', 'dataMax']}
              axisLine={false}
              tickLine={false}
              tickFormatter={formatTimeKey}
              tick={{
                fill: isDark ? '#71717a' : '#94a3b8',
                fontSize: 10,
                fontWeight: 600,
              }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `$${value}`}
              domain={[0, Math.max(limit * 1.1, currentCost * 1.1)]}
              tick={{
                fill: isDark ? '#71717a' : '#94a3b8',
                fontSize: 10,
                fontWeight: 600,
              }}
            />
            <Tooltip
              labelFormatter={(value) => formatTimeKey(value as number)}
              contentStyle={{
                backgroundColor: isDark ? '#18181b' : '#fff',
                border: isDark ? '1px solid #27272a' : '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '12px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                fontSize: '12px',
                fontWeight: 'bold',
              }}
              itemStyle={{ color: isDark ? '#f4f4f5' : '#18181b' }}
              labelStyle={{
                color: isDark ? '#a1a1aa' : '#71717a',
                marginBottom: '4px',
              }}
              formatter={(value: any) => formatCurrency(value ?? 0)}
            />
            <ReferenceLine
              y={limit}
              stroke={isDark ? '#ef4444' : '#ef4444'}
              strokeWidth={1}
              strokeDasharray="4 4"
              label={{
                value: `LIMIT (${formatCurrency(limit)})`,
                fill: isDark ? '#f87171' : '#ef4444',
                position: 'insideBottomRight',
                fontSize: 10,
                fontWeight: 800,
                dy: -10,
              }}
            />
            <Area
              type="monotone"
              dataKey="actualCost"
              stroke="#3b82f6"
              strokeWidth={3}
              fill="url(#actualGradient)"
              connectNulls
              name="Actual Spend"
            />
            <Line
              type="monotone"
              dataKey="projectedCost"
              stroke={isDark ? '#71717a' : '#94a3b8'}
              strokeDasharray="6 6"
              strokeWidth={2}
              dot={false}
              name="Projection"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
