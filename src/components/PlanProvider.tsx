import { createContext, useContext, useState } from 'react';
import { PLAN_CONFIGS, DEFAULT_PLAN } from '../lib/constants';
import type { Plan, PlanConfig } from '../lib/constants';

interface PlanProviderProps {
  children: React.ReactNode;
  storageKey?: string;
}

interface PlanProviderState {
  plan: Plan;
  planConfig: PlanConfig;
  setPlan: (plan: Plan) => void;
}

const initialState: PlanProviderState = {
  plan: DEFAULT_PLAN,
  planConfig: PLAN_CONFIGS[DEFAULT_PLAN],
  setPlan: () => null,
};

const PlanProviderContext = createContext<PlanProviderState>(initialState);

function isValidPlan(value: string): value is Plan {
  return value in PLAN_CONFIGS;
}

export function PlanProvider({
  children,
  storageKey = 'ccusage-plan',
}: PlanProviderProps) {
  const [plan, setPlanState] = useState<Plan>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(storageKey);
      if (stored && isValidPlan(stored)) {
        return stored;
      }
    }
    return DEFAULT_PLAN;
  });

  const planConfig = PLAN_CONFIGS[plan];

  const setPlan = (newPlan: Plan) => {
    localStorage.setItem(storageKey, newPlan);
    setPlanState(newPlan);
  };

  const value: PlanProviderState = {
    plan,
    planConfig,
    setPlan,
  };

  return (
    <PlanProviderContext.Provider value={value}>
      {children}
    </PlanProviderContext.Provider>
  );
}

export const usePlan = () => {
  const context = useContext(PlanProviderContext);

  if (context === undefined)
    throw new Error('usePlan must be used within a PlanProvider');

  return context;
};
