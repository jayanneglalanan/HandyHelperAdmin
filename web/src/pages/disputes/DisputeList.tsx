import { useState } from 'react';
import { Card, Tabs, Button, StatusBadge, SearchBar, PageSkeleton } from '../../components/ui';
import ResponsiveTable from '../../components/ui/ResponsiveTable';
import { useDisputes } from '../../hooks/useMockData';
import { useLoading } from '../../hooks/useLoading';
import { formatDate } from '@shared/utils/formatters';

export default function DisputeList() {
  const loading = useLoading(800);
  const disputes = useDisputes();
  const [activeTab, setActiveTab] = useState('pending');
  const [search, setSearch] = useState('');

  const tabs = [
    { id: 'pending', label: 'Pending', count: disputes.filter(d => d.status === 'pending').length },
    { id: 'investigating', label: 'In Review', count: disputes.filter(d => d.status === 'investigating').length },
    { id: 'resolved', label: 'Resolved', count: disputes.filter(d => d.status === 'resolved').length },
  ];

  const filtered = disputes.filter(d => {
    const matchesTab = d.status === activeTab;
    const matchesSearch = d.clientName.toLowerCase().includes(search.toLowerCase()) ||
      d.memberName.toLowerCase().includes(search.toLowerCase()) ||
      d.reason.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Disputes</h1>
          <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500">Resolve payment and service disputes</p>
        </div>
        <SearchBar value={search} onChange={setSearch} placeholder="Search disputes..." className="w-full sm:w-64" />
      </div>

      {loading ? (
        <PageSkeleton type="list" />
      ) : (
      <Card padding="none">
        <div className="px-3 sm:px-4 pt-3 sm:pt-4 overflow-x-auto">
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        </div>
        <div className="p-3 sm:p-4">
          <ResponsiveTable
            data={filtered}
            keyExtractor={(d) => d.id}
            columns={[
              {
                key: 'info', header: 'Dispute',
                render: (d) => (
                  <div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{d.reason}</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">{d.description}</p>
                  </div>
                ),
              },
              { key: 'parties', header: 'Parties', render: (d) => <span className="text-sm text-gray-600 dark:text-gray-400">{d.clientName} vs {d.memberName}</span>, hideOnMobile: true },
              { key: 'job', header: 'Job', render: (d) => <span className="text-sm text-gray-500 dark:text-gray-400">{d.jobTitle}</span> },
              { key: 'date', header: 'Date', render: (d) => <span className="text-xs text-gray-500 dark:text-gray-400">{formatDate(d.filedDate)}</span>, hideOnMobile: true },
              { key: 'status', header: 'Status', render: (d) => <StatusBadge status={d.status} /> },
              {
                key: 'actions', header: '', render: (d) => (
                  <div className="flex gap-1">
                    {d.status === 'pending' && (
                      <Button variant="outline" size="sm">Review</Button>
                    )}
                    {d.status === 'investigating' && (
                      <Button variant="success" size="sm">Resolve</Button>
                    )}
                  </div>
                ),
              },
            ]}
            mobileCardRender={(d) => (
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <StatusBadge status={d.status} />
                </div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{d.reason}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{d.clientName} vs {d.memberName}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-400">{formatDate(d.filedDate)}</span>
                  {d.status === 'pending' && <Button variant="outline" size="sm">Review</Button>}
                  {d.status === 'investigating' && <Button variant="success" size="sm">Resolve</Button>}
                </div>
              </div>
            )}
          />
        </div>
      </Card>
      )}
    </div>
  );
}
