export type Plan = 'pro' | 'max5x' | 'max20x';

export interface PlanConfig {
  label: string;
  monthlyPrice: number;
  sessionCostLimit: number;
  weeklyCostLimit: number;
}

export const PLAN_CONFIGS: Record<Plan, PlanConfig> = {
  pro: {
    label: 'Pro',
    monthlyPrice: 20,
    sessionCostLimit: 5.62,
    weeklyCostLimit: 46.83,
  },
  max5x: {
    label: 'Max',
    monthlyPrice: 100,
    sessionCostLimit: 28.1,
    weeklyCostLimit: 234.15,
  },
  max20x: {
    label: 'Max (20x)',
    monthlyPrice: 200,
    sessionCostLimit: 112.4,
    weeklyCostLimit: 936.6,
  },
};

export const DEFAULT_PLAN: Plan = 'pro';

/**
 * Calculate the number of days until the next Sunday 9:00 AM ET (week reset time)
 * @returns Number of days until next Sunday reset (0 if today and past 9 AM ET, or if it's Sunday before 9 AM)
 */
export function getDaysUntilSunday(): number {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const currentHour = now.getHours();

  if (dayOfWeek === 0) {
    // If it's Sunday but before 9 AM, the reset hasn't happened yet
    if (currentHour < 9) {
      return 0; // Reset happens today
    }
    // If it's Sunday after 9 AM, next reset is in 7 days
    return 7;
  }

  return 7 - dayOfWeek; // Days until next Sunday
}

/**
 * Get the date of the most recent Sunday 9:00 AM ET (start of current week)
 * @returns Date object representing the most recent Sunday at 9:00 AM ET
 */
export function getWeekStartDate(): Date {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const currentHour = now.getHours();
  const weekStart = new Date(now);

  // If it's Sunday before 9 AM, we're still in the previous week
  if (dayOfWeek === 0 && currentHour < 9) {
    // Go back to last Sunday
    weekStart.setDate(now.getDate() - 7);
  } else {
    // Subtract days to get to most recent Sunday
    weekStart.setDate(now.getDate() - dayOfWeek);
  }

  weekStart.setHours(9, 0, 0, 0); // Set to 9:00 AM ET

  return weekStart;
}
