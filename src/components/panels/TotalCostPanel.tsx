import { formatCurrency } from '../../lib/formatters'

interface TotalCostPanelProps {
  totalCost: number
  isLoading?: boolean
}

export function TotalCostPanel({ totalCost, isLoading }: TotalCostPanelProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-sm font-medium text-gray-500">Total Cost</h3>
      {isLoading ? (
        <div className="animate-pulse h-8 bg-gray-200 rounded mt-2 w-24" />
      ) : (
        <p className="text-3xl font-bold text-gray-900 mt-2">
          {formatCurrency(totalCost)}
        </p>
      )}
    </div>
  )
}
