import { createServerFn } from '@tanstack/react-start'
import { exec } from 'node:child_process'
import { promisify } from 'node:util'
import type { BlocksResponse, DailyResponse, SessionsResponse } from './ccusage.types'

const execAsync = promisify(exec)

const CCUSAGE_COMMAND = 'npx ccusage@latest'

export const fetchDailyUsage = createServerFn({
  method: 'GET',
}).handler(async (): Promise<DailyResponse> => {
  const { stdout } = await execAsync(`${CCUSAGE_COMMAND} daily -j`)
  return JSON.parse(stdout)
})

export const fetchBlocksUsage = createServerFn({
  method: 'GET',
}).handler(async (): Promise<BlocksResponse> => {
  const { stdout } = await execAsync(`${CCUSAGE_COMMAND} blocks -j`)
  return JSON.parse(stdout)
})

export const fetchSessionsUsage = createServerFn({
  method: 'GET',
}).handler(async (): Promise<SessionsResponse> => {
  const { stdout } = await execAsync(`${CCUSAGE_COMMAND} session -j`)
  return JSON.parse(stdout)
})
