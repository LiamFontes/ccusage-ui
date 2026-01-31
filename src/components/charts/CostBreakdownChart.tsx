import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import type { DailyEntry, ModelBreakdown } from '../../server/ccusage.types';
import { formatCurrency, getModelDisplayName } from '../../lib/formatters';
import { useIsDark } from '../ThemeProvider';

interface CostBreakdownChartProps {
  data: DailyEntry[];
  isLoading?: boolean;
}

const COLORS = [
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#06b6d4', // cyan
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ef4444', // red
];

export function CostBreakdownChart({
  data,
  isLoading,
}: CostBreakdownChartProps) {
  const isDark = useIsDark();

  if (isLoading) {
    return (
      <div className="card-premium p-6 h-[400px]">
        <h3 className="text-sm font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-6">
          Cost by Model
        </h3>
        <div className="animate-pulse bg-gray-100 dark:bg-zinc-800/50 rounded-full h-56 w-56 mx-auto" />
      </div>
    );
  }

  const modelCosts = data.reduce<Record<string, number>>((acc, entry) => {
    entry.modelBreakdowns.forEach((breakdown: ModelBreakdown) => {
      const name = getModelDisplayName(breakdown.modelName);
      acc[name] = (acc[name] ?? 0) + breakdown.cost;
    });
    return acc;
  }, {});

  const chartData = Object.entries(modelCosts)
    .map(([name, cost]) => ({ name, value: cost }))
    .sort((a, b) => b.value - a.value);

  if (chartData.length === 0) {
    return (
      <div className="card-premium p-6 h-[400px] flex flex-col">
        <h3 className="text-sm font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-widest mb-6">
          Cost by Model
        </h3>
        <div className="flex-grow flex items-center justify-center text-gray-400 dark:text-zinc-600 font-medium">
          No data available
        </div>
      </div>
    );
  }

  return (
    <div className="card-premium p-6">
      <h3 className="text-sm font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-widest mb-6">
        Cost by Model
      </h3>
      <div className="h-[300px] sm:h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
              animationBegin={0}
              animationDuration={1500}
            >
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  stroke={isDark ? '#18181b' : '#fff'}
                  strokeWidth={2}
                />
              ))}
            </Pie>
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
              formatter={(value: any) => formatCurrency(value ?? 0)}
            />
            <Legend
              verticalAlign="bottom"
              align="center"
              iconType="circle"
              wrapperStyle={{
                paddingTop: '20px',
                fontSize: '10px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
