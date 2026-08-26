import { useState } from 'react';
import { Card, Tabs, PageSkeleton } from '../../components/ui';
import { useAnalytics } from '../../hooks/useMockData';
import { useLoading } from '../../hooks/useLoading';

export default function Analytics() {
  const loading = useLoading(800);
  const analytics = useAnalytics();
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'growth', label: 'Growth' },
    { id: 'skills', label: 'Skills' },
    { id: 'locations', label: 'Locations' },
  ];

  const maxUserGrowth = Math.max(...analytics.userGrowth.map(m => m.count));
  const maxJobGrowth = Math.max(...analytics.jobGrowth.map(m => m.count));

  return (
    <div className="space-y-3 sm:space-y-4">
      <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Analytics</h1>

      {loading ? (
        <PageSkeleton type="dashboard" />
      ) : (
        <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        <Card><p className="text-xs text-gray-500">Total Users</p><p className="text-lg font-bold text-gray-900 dark:text-white">{analytics.userGrowth.reduce((s, m) => s + m.count, 0).toLocaleString()}</p></Card>
        <Card><p className="text-xs text-gray-500">Total Jobs</p><p className="text-lg font-bold text-gray-900 dark:text-white">{analytics.jobStats.total}</p></Card>
        <Card><p className="text-xs text-gray-500">Completed</p><p className="text-lg font-bold text-gray-900 dark:text-white">{analytics.jobStats.completed}</p></Card>
        <Card><p className="text-xs text-gray-500">Avg Completion</p><p className="text-lg font-bold text-gray-900 dark:text-white">{analytics.jobStats.avgCompletionDays}d</p></Card>
      </div>

      <Card padding="none">
        <div className="px-3 sm:px-4 pt-3 sm:pt-4 overflow-x-auto">
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        </div>
        <div className="p-3 sm:p-4">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <Card>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">User Growth</h3>
                <div className="mt-3 flex items-end gap-1 h-32 sm:h-48">
                  {analytics.userGrowth.map((item) => (
                    <div key={item.month} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full bg-gray-900 dark:bg-white rounded-t-sm min-h-[2px]" style={{ height: `${(item.count / maxUserGrowth) * 100}%` }} />
                      <span className="text-[8px] sm:text-[10px] text-gray-400 truncate w-full text-center">{item.month}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'growth' && (
            <div className="space-y-4">
              <Card>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">Job Growth</h3>
                <div className="mt-3 flex items-end gap-1 h-32 sm:h-48">
                  {analytics.jobGrowth.map((item) => (
                    <div key={item.month} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full bg-emerald-500 rounded-t-sm min-h-[2px]" style={{ height: `${(item.count / maxJobGrowth) * 100}%` }} />
                      <span className="text-[8px] sm:text-[10px] text-gray-400 truncate w-full text-center">{item.month}</span>
                    </div>
                  ))}
                </div>
              </Card>
              <Card>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">Revenue by Month</h3>
                <div className="mt-3 flex items-end gap-1 h-32 sm:h-48">
                  {analytics.revenueData.map((item) => (
                    <div key={item.month} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full bg-blue-500 rounded-t-sm min-h-[2px]" style={{ height: `${(item.count / Math.max(...analytics.revenueData.map(r => r.count))) * 100}%` }} />
                      <span className="text-[8px] sm:text-[10px] text-gray-400 truncate w-full text-center">{item.month}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="space-y-2">
              {analytics.topSkills.map((skill) => (
                <div key={skill.name} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700/50 last:border-0">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{skill.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500">{skill.jobCount} jobs</span>
                    <span className="text-xs text-gray-400">{skill.memberCount} members</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'locations' && (
            <div className="space-y-2">
              {analytics.topLocations.map((loc) => (
                <div key={loc.name} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700/50 last:border-0">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{loc.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500">{loc.userCount} users</span>
                    <span className="text-xs font-medium text-gray-900 dark:text-white">{loc.jobCount} jobs</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
        </>
      )}
    </div>
  );
}
