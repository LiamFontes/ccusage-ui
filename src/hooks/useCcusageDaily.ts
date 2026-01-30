import { useQuery } from '@tanstack/react-query'
import { fetchDailyUsage } from '../server/ccusage.functions'

const POLL_INTERVAL_MS = 60_000

export function useCcusageDaily() {
  return useQuery({
    queryKey: ['ccusage', 'daily'],
    queryFn: () => fetchDailyUsage(),
    refetchInterval: POLL_INTERVAL_MS,
    staleTime: POLL_INTERVAL_MS / 2,
  })
}
