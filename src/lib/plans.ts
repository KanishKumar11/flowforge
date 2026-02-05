export const PLANS = {
  FREE: {
    id: "free",
    name: "Free",
    limits: {
      workflows: 3,
      executionsPerMonth: 100,
      teamMembers: 1,
    },
    features: {
      apiAccess: false,
      prioritySupport: false,
      customRetention: false,
    }
  },
  PRO: {
    id: "pro",
    name: "Pro",
    limits: {
      workflows: 100,
      executionsPerMonth: 10000,
      teamMembers: 10,
    },
    features: {
      apiAccess: true,
      prioritySupport: true,
      customRetention: true,
    }
  }
} as const;

export type PlanType = keyof typeof PLANS;
export type PlanLimits = typeof PLANS.FREE.limits;
