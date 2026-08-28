import { useState } from 'react';
import { Eye } from 'lucide-react';
import { Card, SearchBar, Tabs, Badge, StatusBadge, PageSkeleton } from '../../components/ui';
import ResponsiveTable from '../../components/ui/ResponsiveTable';
import { useReports } from '../../hooks/useMockData';
import { useLoading } from '../../hooks/useLoading';
import { useToast } from '../../components/ui/Toast';
import { formatDate } from '@shared/utils/formatters';

export default function ReportList() {
  const loading = useLoading(800);
  const reports = useReports();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('pending');
  const [search, setSearch] = useState('');

  const tabs = [
    { id: 'pending', label: 'Pending', count: reports.filter(r => r.status === 'pending').length },
    { id: 'investigating', label: 'Investigating', count: reports.filter(r => r.status === 'investigating').length },
    { id: 'resolved', label: 'Resolved', count: reports.filter(r => r.status === 'resolved').length },
    { id: 'dismissed', label: 'Dismissed', count: reports.filter(r => r.status === 'dismissed').length },
  ];

  const filtered = reports.filter(r => {
    const matchesTab = r.status === activeTab;
    const matchesSearch = r.reporterName.toLowerCase().includes(search.toLowerCase()) || r.reportedUserName.toLowerCase().includes(search.toLowerCase()) || r.reason.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Reports</h1>
          <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500">Review user reports</p>
        </div>
        <SearchBar value={search} onChange={setSearch} placeholder="Search reports..." className="w-full sm:w-64" />
      </div>

      {loading ? (
        <PageSkeleton type="list" />
      ) : (
      <Card padding="none">
        <div className="px-3 sm:px-4 pt-3 sm:pt-4 overflow-x-auto"><Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} /></div>
        <div className="p-3 sm:p-4">
          <ResponsiveTable
            data={filtered}
            keyExtractor={(r) => r.id}
            columns={[
              { key: 'info', header: 'Report', render: (r) => (
                <div><div className="flex items-center gap-2"><span className="text-sm font-medium text-gray-900 dark:text-white">{r.reason}</span><Badge>{r.type}</Badge></div><p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">{r.description}</p></div>
              )},
              { key: 'reporter', header: 'Reporter', render: (r) => <span className="text-sm text-gray-600 dark:text-gray-400">{r.reporterName}</span>, hideOnMobile: true },
              { key: 'target', header: 'Target', render: (r) => <span className="text-sm text-gray-600 dark:text-gray-400">{r.reportedUserName}</span> },
              { key: 'date', header: 'Date', render: (r) => <span className="text-xs text-gray-500 dark:text-gray-400">{formatDate(r.filedDate)}</span>, hideOnMobile: true },
              { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
              { key: 'actions', header: '', render: () => (
                <button onClick={() => showToast('Viewing report details', 'info')} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg dark:hover:bg-blue-900/20 min-w-[36px] min-h-[36px] flex items-center justify-center"><Eye size={16} /></button>
              )},
            ]}
            mobileCardRender={(r) => (
              <div>
                <div className="flex items-center gap-2 mb-1"><Badge>{r.type}</Badge><StatusBadge status={r.status} /></div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{r.reason}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{r.reporterName} → {r.reportedUserName}</p>
              </div>
            )}
          />
        </div>
      </Card>
      )}
    </div>
  );
}
