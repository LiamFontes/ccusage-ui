import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { DailyEntry } from '../../server/ccusage.types';
import { formatDate, formatCompactNumber } from '../../lib/formatters';
import { useIsDark } from '../ThemeProvider';

interface TokenUsageChartProps {
  data: DailyEntry[];
  isLoading?: boolean;
}

export function TokenUsageChart({ data, isLoading }: TokenUsageChartProps) {
  const isDark = useIsDark();

  if (isLoading) {
    return (
      <div className="card-premium p-6 h-[400px]">
        <h3 className="text-sm font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-6">
          Token Usage
        </h3>
        <div className="animate-pulse bg-gray-100 dark:bg-zinc-800/50 rounded-lg h-[280px]" />
      </div>
    );
  }

  const chartData = data.map((entry) => ({
    date: formatDate(entry.date),
    input: entry.inputTokens,
    output: entry.outputTokens,
    cacheCreation: entry.cacheCreationTokens,
    cacheRead: entry.cacheReadTokens,
  }));

  return (
    <div className="card-premium p-6">
      <h3 className="text-sm font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-widest mb-6">
        Token Usage Over Time
      </h3>
      <div className="h-[300px] sm:h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorInput" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorOutput" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke={isDark ? '#27272a' : '#f1f5f9'}
            />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
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
              tickFormatter={(value) => formatCompactNumber(value)}
              tick={{
                fill: isDark ? '#71717a' : '#94a3b8',
                fontSize: 10,
                fontWeight: 600,
              }}
            />
            <Tooltip
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
              formatter={(value: any) => formatCompactNumber(value ?? 0)}
            />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{
                paddingBottom: '20px',
                fontSize: '10px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
              }}
            />
            <Area
              type="monotone"
              dataKey="cacheRead"
              stackId="1"
              stroke="#10b981"
              fillOpacity={0.1}
              fill="#10b981"
              name="Cache Read"
            />
            <Area
              type="monotone"
              dataKey="cacheCreation"
              stackId="1"
              stroke="#f59e0b"
              fillOpacity={0.1}
              fill="#f59e0b"
              name="Cache Creation"
            />
            <Area
              type="monotone"
              dataKey="input"
              stackId="1"
              stroke="#3b82f6"
              fillOpacity={1}
              fill="url(#colorInput)"
              name="Input"
            />
            <Area
              type="monotone"
              dataKey="output"
              stackId="1"
              stroke="#8b5cf6"
              fillOpacity={1}
              fill="url(#colorOutput)"
              name="Output"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
