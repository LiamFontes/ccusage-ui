import { useQuery } from '@tanstack/react-query'
import { fetchSessionsUsage } from '../server/ccusage.functions'

const POLL_INTERVAL_MS = 60_000

export function useCcusageSessions() {
  return useQuery({
    queryKey: ['ccusage', 'sessions'],
    queryFn: () => fetchSessionsUsage(),
    refetchInterval: POLL_INTERVAL_MS,
    staleTime: POLL_INTERVAL_MS / 2,
  })
}
