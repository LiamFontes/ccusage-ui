import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import type { DailyEntry, ModelBreakdown } from '../../server/ccusage.types'
import { formatCurrency, getModelDisplayName } from '../../lib/formatters'

interface CostBreakdownChartProps {
  data: DailyEntry[]
  isLoading?: boolean
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

export function CostBreakdownChart({ data, isLoading }: CostBreakdownChartProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 h-80">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Cost by Model</h3>
        <div className="animate-pulse bg-gray-200 rounded h-56" />
      </div>
    )
  }

  const modelCosts = data.reduce<Record<string, number>>((acc, entry) => {
    entry.modelBreakdowns.forEach((breakdown: ModelBreakdown) => {
      const name = getModelDisplayName(breakdown.modelName)
      acc[name] = (acc[name] ?? 0) + breakdown.cost
    })
    return acc
  }, {})

  const chartData = Object.entries(modelCosts)
    .map(([name, cost]) => ({ name, value: cost }))
    .sort((a, b) => b.value - a.value)

  if (chartData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 h-80">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Cost by Model</h3>
        <div className="flex items-center justify-center h-56 text-gray-400">
          No data available
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Cost by Model</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            fill="#8884d8"
            paddingAngle={2}
            dataKey="value"
            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            labelLine={false}
          >
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => formatCurrency(value)}
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
