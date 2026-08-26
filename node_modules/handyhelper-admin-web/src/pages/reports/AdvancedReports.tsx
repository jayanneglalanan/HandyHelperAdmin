import { useState } from 'react';
import { Card, CardTitle, Tabs, PageSkeleton } from '../../components/ui';
import { useAnalytics } from '../../hooks/useMockData';
import { useLoading } from '../../hooks/useLoading';

export default function AdvancedReports() {
  const loading = useLoading(800);
  const analytics = useAnalytics();
  const [activeTab, setActiveTab] = useState('revenue');

  const tabs = [
    { id: 'revenue', label: 'Revenue' },
    { id: 'users', label: 'Users' },
    { id: 'performance', label: 'Performance' },
  ];

  const maxRevenue = Math.max(...analytics.revenueData.map(r => r.count));
  const maxUserGrowth = Math.max(...analytics.userGrowth.map(m => m.count));

  return (
    <div className="space-y-3 sm:space-y-4">
      <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Advanced Reports</h1>

      {loading ? (
        <PageSkeleton type="dashboard" />
      ) : (
      <Card padding="none">
        <div className="px-3 sm:px-4 pt-3 sm:pt-4 overflow-x-auto">
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        </div>
        <div className="p-3 sm:p-4">
          {activeTab === 'revenue' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
                <Card><p className="text-xs text-gray-500">Total Jobs</p><p className="text-lg font-bold text-gray-900 dark:text-white">{analytics.jobStats.total}</p></Card>
                <Card><p className="text-xs text-gray-500">Completed</p><p className="text-lg font-bold text-gray-900 dark:text-white">{analytics.jobStats.completed}</p></Card>
                <Card><p className="text-xs text-gray-500">Active</p><p className="text-lg font-bold text-gray-900 dark:text-white">{analytics.jobStats.active}</p></Card>
                <Card><p className="text-xs text-gray-500">Cancelled</p><p className="text-lg font-bold text-gray-900 dark:text-white">{analytics.jobStats.cancelled}</p></Card>
              </div>
              <Card>
                <CardTitle>Revenue Trend</CardTitle>
                <div className="mt-3 flex items-end gap-1 h-32 sm:h-48">
                  {analytics.revenueData.map((item) => (
                    <div key={item.month} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full bg-gray-900 dark:bg-white rounded-t-sm min-h-[2px]" style={{ height: `${(item.count / maxRevenue) * 100}%` }} />
                      <span className="text-[8px] sm:text-[10px] text-gray-400 truncate w-full text-center">{item.month}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
                <Card><p className="text-xs text-gray-500">User Growth</p><p className="text-lg font-bold text-gray-900 dark:text-white">{analytics.userGrowth.reduce((s, m) => s + m.count, 0).toLocaleString()}</p></Card>
                <Card><p className="text-xs text-gray-500">Job Growth</p><p className="text-lg font-bold text-gray-900 dark:text-white">{analytics.jobGrowth.reduce((s, m) => s + m.count, 0).toLocaleString()}</p></Card>
                <Card><p className="text-xs text-gray-500">Member Growth</p><p className="text-lg font-bold text-gray-900 dark:text-white">{analytics.memberGrowth.reduce((s, m) => s + m.count, 0).toLocaleString()}</p></Card>
                <Card><p className="text-xs text-gray-500">Avg Completion</p><p className="text-lg font-bold text-gray-900 dark:text-white">{analytics.jobStats.avgCompletionDays}d</p></Card>
              </div>
              <Card>
                <CardTitle>User Growth</CardTitle>
                <div className="mt-3 flex items-end gap-1 h-32 sm:h-48">
                  {analytics.userGrowth.map((item) => (
                    <div key={item.month} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full bg-blue-500 rounded-t-sm min-h-[2px]" style={{ height: `${(item.count / maxUserGrowth) * 100}%` }} />
                      <span className="text-[8px] sm:text-[10px] text-gray-400 truncate w-full text-center">{item.month}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
                <Card><p className="text-xs text-gray-500">Completion Rate</p><p className="text-lg font-bold text-gray-900 dark:text-white">{analytics.jobStats.total > 0 ? ((analytics.jobStats.completed / analytics.jobStats.total) * 100).toFixed(1) : 0}%</p></Card>
                <Card><p className="text-xs text-gray-500">Avg Completion</p><p className="text-lg font-bold text-gray-900 dark:text-white">{analytics.jobStats.avgCompletionDays} days</p></Card>
                <Card><p className="text-xs text-gray-500">Active Jobs</p><p className="text-lg font-bold text-gray-900 dark:text-white">{analytics.jobStats.active}</p></Card>
                <Card><p className="text-xs text-gray-500">Cancelled</p><p className="text-lg font-bold text-gray-900 dark:text-white">{analytics.jobStats.cancelled}</p></Card>
              </div>
              <Card>
                <CardTitle>Rating Distribution</CardTitle>
                <div className="mt-3 space-y-2">
                  {analytics.ratingDistribution.map((r) => (
                    <div key={r.rating} className="flex items-center gap-3">
                      <span className="text-sm text-gray-700 dark:text-gray-300 w-8">{r.rating}★</span>
                      <div className="flex-1 h-4 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-400 rounded-full" style={{ width: `${r.percentage}%` }} />
                      </div>
                      <span className="text-xs text-gray-500 w-16 text-right">{r.count} ({r.percentage}%)</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </div>
      </Card>
      )}
    </div>
  );
}
