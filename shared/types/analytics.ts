export interface AnalyticsData {
  userGrowth: MonthlyData[];
  jobGrowth: MonthlyData[];
  memberGrowth: MonthlyData[];
  jobStats: JobStats;
  topSkills: SkillStat[];
  topLocations: LocationStat[];
  ratingDistribution: RatingStat[];
  revenueData: MonthlyData[];
}

export interface MonthlyData {
  month: string;
  count: number;
}

export interface JobStats {
  total: number;
  completed: number;
  cancelled: number;
  active: number;
  avgCompletionDays: number;
}

export interface SkillStat {
  name: string;
  jobCount: number;
  memberCount: number;
}

export interface LocationStat {
  name: string;
  jobCount: number;
  userCount: number;
}

export interface RatingStat {
  rating: number;
  count: number;
  percentage: number;
}
