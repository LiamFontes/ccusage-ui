import { ChevronDown } from 'lucide-react';
import { usePlan } from './PlanProvider';
import type { Plan } from '../lib/constants';

const PLAN_OPTIONS: { value: Plan; label: string }[] = [
  { value: 'pro', label: 'Pro ($20/mo)' },
  { value: 'max5x', label: 'Max ($100/mo)' },
  { value: 'max20x', label: 'Max 20x ($200/mo)' },
];

export function PlanSelector() {
  const { plan, setPlan } = usePlan();

  return (
    <div className="relative inline-flex items-center">
      <select
        value={plan}
        onChange={(e) => setPlan(e.target.value as Plan)}
        className="appearance-none bg-transparent text-xs font-semibold text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-zinc-700 rounded-lg px-3 py-1.5 pr-7 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 dark:focus:ring-offset-zinc-900 transition-colors"
        aria-label="Select subscription plan"
      >
        {PLAN_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={14}
        className="absolute right-2 pointer-events-none text-gray-400 dark:text-zinc-500"
      />
    </div>
  );
}
