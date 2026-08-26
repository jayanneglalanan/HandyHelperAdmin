import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { Card, SearchBar, StatusBadge, Tabs, Badge, PageSkeleton } from '../../components/ui';
import ResponsiveTable from '../../components/ui/ResponsiveTable';
import { useJobs } from '../../hooks/useMockData';
import { useLoading } from '../../hooks/useLoading';
import { formatDate, formatCurrency } from '@shared/utils/formatters';

export default function JobList() {
  const navigate = useNavigate();
  const loading = useLoading(800);
  const jobs = useJobs();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const tabs = [
    { id: 'all', label: 'All', count: jobs.length },
    { id: 'pending', label: 'Pending', count: jobs.filter(j => j.status === 'pending').length },
    { id: 'open', label: 'Open', count: jobs.filter(j => j.status === 'open').length },
    { id: 'in_progress', label: 'Active', count: jobs.filter(j => j.status === 'in_progress').length },
    { id: 'completed', label: 'Done', count: jobs.filter(j => j.status === 'completed').length },
    { id: 'cancelled', label: 'Cancelled', count: jobs.filter(j => j.status === 'cancelled').length },
  ];

  const filtered = jobs.filter(job => {
    const matchesTab = activeTab === 'all' || job.status === activeTab;
    const matchesSearch = job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.clientName.toLowerCase().includes(search.toLowerCase()) ||
      job.category.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Jobs</h1>
          <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500">{filtered.length} jobs</p>
        </div>
        <SearchBar value={search} onChange={setSearch} placeholder="Search jobs..." className="w-full sm:w-64" />
      </div>

      {loading ? (
        <PageSkeleton type="list" />
      ) : (
      <Card padding="none">
        <div className="px-3 sm:px-4 pt-3 sm:pt-4 overflow-x-auto">
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        </div>

        <div className="p-2 sm:p-4">
          <ResponsiveTable
            data={filtered}
            keyExtractor={(job) => job.id}
            onRowClick={(job) => navigate(`/jobs/${job.id}`)}
            columns={[
              {
                key: 'title',
                header: 'Job',
                render: (job) => (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{job.title}</span>
                    {job.urgent && <Badge variant="error">Urgent</Badge>}
                  </div>
                ),
              },
              { key: 'client', header: 'Client', render: (job) => <span className="text-sm text-gray-600 dark:text-gray-400">{job.clientName}</span> },
              { key: 'category', header: 'Category', render: (job) => <Badge>{job.category}</Badge>, hideOnMobile: true },
              { key: 'budget', header: 'Budget', render: (job) => <span className="text-sm font-medium text-gray-900 dark:text-white">{formatCurrency(job.budget)}</span> },
              { key: 'status', header: 'Status', render: (job) => <StatusBadge status={job.status} /> },
              { key: 'date', header: 'Posted', render: (job) => <span className="text-sm text-gray-500 dark:text-gray-400">{formatDate(job.postedDate)}</span>, hideOnMobile: true },
              {
                key: 'action',
                header: '',
                render: () => (
                  <Eye size={16} className="text-gray-400" />
                ),
              },
            ]}
            mobileCardRender={(job) => (
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{job.title}</p>
                    {job.urgent && <Badge variant="error">Urgent</Badge>}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{job.clientName} · {job.category}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{formatCurrency(job.budget)}</span>
                    <StatusBadge status={job.status} />
                  </div>
                </div>
                <Eye size={16} className="text-gray-300 dark:text-gray-600 shrink-0 mt-1" />
              </div>
            )}
          />
        </div>
      </Card>
      )}
    </div>
  );
}
