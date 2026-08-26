import { Users, Briefcase, DollarSign, TrendingUp, AlertTriangle, CreditCard } from 'lucide-react';
import { Card, CardTitle, DashboardStatsSkeleton, ChartSkeleton, CardSkeleton } from '../../components/ui';
import { useAnalytics, useJobs, useReports, useReviews, useSubscriptions } from '../../hooks/useMockData';
import { useLoading } from '../../hooks/useLoading';
import { formatCurrency } from '@shared/utils/formatters';

export default function Dashboard() {
  const loading = useLoading(1000);
  const analytics = useAnalytics();
  const jobs = useJobs();
  const reports = useReports();
  const reviews = useReviews();
  const subscriptions = useSubscriptions();

  const activeJobs = jobs.filter(j => j.status === 'in_progress' || j.status === 'open').length;
  const pendingReports = reports.filter(r => r.status === 'pending').length;
  const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
  const totalUsers = analytics.userGrowth.reduce((sum, m) => sum + m.count, 0);
  const maxGrowth = Math.max(...analytics.userGrowth.map(m => m.count));
  const subscriptionRevenue = subscriptions.reduce((sum, sub) => sum + sub.price * sub.subscriberCount, 0);

  const stats = [
    { label: 'Total Users', value: totalUsers.toLocaleString(), icon: Users, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { label: 'Active Jobs', value: activeJobs.toLocaleString(), icon: Briefcase, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
    { label: 'Completed', value: analytics.jobStats.completed.toLocaleString(), icon: DollarSign, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
    { label: 'Avg Rating', value: avgRating.toFixed(1), icon: TrendingUp, color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
    { label: 'Disputes', value: pendingReports.toLocaleString(), icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' },
    { label: 'Subscription Revenue', value: formatCurrency(subscriptionRevenue), icon: CreditCard, color: 'text-cyan-500', bg: 'bg-cyan-50 dark:bg-cyan-900/20' },
  ];

  return (
    <div className="space-y-3 sm:space-y-4">
      <div>
        <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500">Welcome back, Admin</p>
      </div>

      {loading ? (
        <>
          <DashboardStatsSkeleton />
          <ChartSkeleton />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <CardSkeleton />
            <CardSkeleton />
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.label} className="animate-fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className={`p-1.5 sm:p-2 rounded-lg ${stat.bg}`}>
                      <Icon size={16} className={`${stat.color} sm:w-5 sm:h-5`} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 truncate">{stat.label}</p>
                      <p className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white truncate">{stat.value}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          <Card>
            <CardTitle>User Growth Trend</CardTitle>
            <div className="mt-3 flex items-end gap-1 h-32 sm:h-48">
              {analytics.userGrowth.map((item) => (
                <div key={item.month} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-accent rounded-t-sm min-h-[2px] animate-bar-grow transition-all duration-500"
                    style={{ height: `${(item.count / maxGrowth) * 100}%` }}
                  />
                  <span className="text-[8px] sm:text-[10px] text-gray-400 dark:text-gray-500 truncate w-full text-center">{item.month}</span>
                </div>
              ))}
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <Card>
              <CardTitle>Top Skills</CardTitle>
              <div className="mt-3 space-y-2">
                {analytics.topSkills.slice(0, 5).map((skill) => (
                  <div key={skill.name} className="flex items-center justify-between py-1.5 border-b border-gray-100 dark:border-gray-700/50 last:border-0">
                    <span className="text-sm text-gray-700 dark:text-gray-300 truncate">{skill.name}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-gray-500">{skill.jobCount} jobs</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <CardTitle>Top Locations</CardTitle>
              <div className="mt-3 space-y-2">
                {analytics.topLocations.slice(0, 5).map((loc) => (
                  <div key={loc.name} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700/50 last:border-0">
                    <span className="text-sm text-gray-700 dark:text-gray-300">{loc.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500">{loc.userCount} users</span>
                      <span className="text-xs font-medium text-gray-900 dark:text-white">{loc.jobCount} jobs</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
