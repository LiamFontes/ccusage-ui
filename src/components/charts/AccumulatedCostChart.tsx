import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
} from 'recharts';
import type { DailyEntry } from '../../server/ccusage.types';
import { formatDate, formatCurrency } from '../../lib/formatters';
import { useIsDark } from '../ThemeProvider';

interface AccumulatedCostChartProps {
  data: DailyEntry[];
  isLoading?: boolean;
}

export function AccumulatedCostChart({
  data,
  isLoading,
}: AccumulatedCostChartProps) {
  const isDark = useIsDark();

  if (isLoading) {
    return (
      <div className="card-premium p-6 h-[400px]">
        <h3 className="text-sm font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-6">
          Cost Accumulation
        </h3>
        <div className="animate-pulse bg-gray-100 dark:bg-zinc-800/50 rounded-lg h-[280px]" />
      </div>
    );
  }

  // Calculate accumulated cost
  let runningTotal = 0;
  const chartData = data.map((entry) => {
    runningTotal += entry.totalCost;
    return {
      date: formatDate(entry.date),
      dailyCost: entry.totalCost,
      accumulatedCost: runningTotal,
    };
  });

  return (
    <div className="card-premium p-6">
      <h3 className="text-sm font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-widest mb-6">
        Cost Accumulation
      </h3>
      <div className="h-[300px] sm:h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 10, right: 10, bottom: 0, left: 0 }}
          >
            <defs>
              <linearGradient
                id="accumulatedGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor={isDark ? '#ef4444' : '#ef4444'}
                  stopOpacity={0.1}
                />
                <stop
                  offset="95%"
                  stopColor={isDark ? '#ef4444' : '#ef4444'}
                  stopOpacity={0}
                />
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
              tickFormatter={(val) => `$${val}`}
              tick={{
                fill: isDark ? '#71717a' : '#94a3b8',
                fontSize: 10,
                fontWeight: 600,
              }}
            />
            <Tooltip
              cursor={{
                fill: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
              }}
              contentStyle={{
                backgroundColor: isDark ? '#18181b' : '#fff',
                border: isDark ? '1px solid #27272a' : '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '12px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                fontSize: '12px',
                fontWeight: 'bold',
              }}
              itemStyle={{
                padding: '2px 0',
                color: isDark ? '#f4f4f5' : '#18181b',
              }}
              labelStyle={{
                color: isDark ? '#a1a1aa' : '#71717a',
                marginBottom: '4px',
              }}
              formatter={(value: any, name: any) => {
                if (name === 'accumulated_background') return null;
                return formatCurrency(value);
              }}
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
              dataKey="accumulatedCost"
              stroke="none"
              fillOpacity={1}
              fill="url(#accumulatedGradient)"
              legendType="none"
              name="accumulated_background"
              activeDot={false}
            />
            <Bar
              dataKey="dailyCost"
              barSize={12}
              fill={isDark ? '#3b82f6' : '#2563eb'}
              radius={[4, 4, 0, 0]}
              name="Daily Spend"
            />
            <Line
              type="monotone"
              dataKey="accumulatedCost"
              stroke={isDark ? '#ef4444' : '#dc2626'}
              strokeWidth={3}
              dot={{ r: 0 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
              name="Accumulated"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
