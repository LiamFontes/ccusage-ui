import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import type { DailyEntry } from '../../server/ccusage.types'
import { formatDate, formatCompactNumber } from '../../lib/formatters'

interface TokenUsageChartProps {
  data: DailyEntry[]
  isLoading?: boolean
}

export function TokenUsageChart({ data, isLoading }: TokenUsageChartProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 h-80">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Token Usage</h3>
        <div className="animate-pulse bg-gray-200 rounded h-56" />
      </div>
    )
  }

  const chartData = data.map((entry) => ({
    date: formatDate(entry.date),
    input: entry.inputTokens,
    output: entry.outputTokens,
    cacheCreation: entry.cacheCreationTokens,
    cacheRead: entry.cacheReadTokens,
  }))

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Token Usage Over Time</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis tickFormatter={(value) => formatCompactNumber(value)} />
          <Tooltip
            formatter={(value: number) => formatCompactNumber(value)}
            labelStyle={{ color: '#374151' }}
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="cacheRead"
            stackId="1"
            stroke="#10b981"
            fill="#d1fae5"
            name="Cache Read"
          />
          <Area
            type="monotone"
            dataKey="cacheCreation"
            stackId="1"
            stroke="#f59e0b"
            fill="#fef3c7"
            name="Cache Creation"
          />
          <Area
            type="monotone"
            dataKey="input"
            stackId="1"
            stroke="#3b82f6"
            fill="#dbeafe"
            name="Input"
          />
          <Area
            type="monotone"
            dataKey="output"
            stackId="1"
            stroke="#8b5cf6"
            fill="#ede9fe"
            name="Output"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
