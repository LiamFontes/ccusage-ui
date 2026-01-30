import { useQuery } from '@tanstack/react-query'
import { fetchBlocksUsage } from '../server/ccusage.functions'

const ACTIVE_POLL_INTERVAL_MS = 5_000
const INACTIVE_POLL_INTERVAL_MS = 30_000

export function useCcusageBlocks() {
  return useQuery({
    queryKey: ['ccusage', 'blocks'],
    queryFn: () => fetchBlocksUsage(),
    refetchInterval: (query) => {
      const hasActiveBlock = query.state.data?.blocks.some(
        (block) => block.isActive
      )
      return hasActiveBlock ? ACTIVE_POLL_INTERVAL_MS : INACTIVE_POLL_INTERVAL_MS
    },
    staleTime: ACTIVE_POLL_INTERVAL_MS / 2,
  })
}
