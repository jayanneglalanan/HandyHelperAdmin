import { useState } from 'react';
import { Eye } from 'lucide-react';
import { Card, SearchBar, Dropdown, PageSkeleton } from '../../components/ui';
import ResponsiveTable from '../../components/ui/ResponsiveTable';
import { useAuditLogs } from '../../hooks/useMockData';
import { useLoading } from '../../hooks/useLoading';
import { useToast } from '../../components/ui/Toast';
import { formatDateTime } from '@shared/utils/formatters';
import Badge from '../../components/ui/Badge';

export default function AuditLogs() {
  const loading = useLoading(800);
  const logs = useAuditLogs();
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const actionTypes = [...new Set(logs.map(l => l.action))];

  const filtered = logs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(search.toLowerCase()) || log.userName.toLowerCase().includes(search.toLowerCase()) || log.targetType.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || log.action === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Audit Logs</h1>
          <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500">{filtered.length} entries</p>
        </div>
        <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
          <SearchBar value={search} onChange={setSearch} placeholder="Search logs..." className="flex-1 sm:flex-none sm:w-48" />
          <Dropdown value={typeFilter} onChange={setTypeFilter} options={[
            { value: 'all', label: 'All Actions' },
            ...actionTypes.map(t => ({ value: t, label: t }))
          ]} />
        </div>
      </div>

      {loading ? (
        <PageSkeleton type="list" />
      ) : (
      <Card padding="none">
        <ResponsiveTable
          data={filtered}
          keyExtractor={(log) => log.id}
          columns={[
            { key: 'time', header: 'Time', render: (log) => <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">{formatDateTime(log.timestamp)}</span> },
            { key: 'admin', header: 'Admin', render: (log) => <span className="text-sm text-gray-700 dark:text-gray-300">{log.userName}</span> },
            { key: 'action', header: 'Action', render: (log) => <span className="text-sm text-gray-900 dark:text-white">{log.action}</span> },
            { key: 'target', header: 'Target', render: (log) => <Badge>{log.targetType}</Badge>, hideOnMobile: true },
            { key: 'details', header: 'Details', render: (log) => <span className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{log.details}</span>, hideOnMobile: true },
            { key: 'view', header: '', render: () => (
              <button onClick={() => showToast('Viewing log details', 'info')} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg dark:hover:bg-gray-700 min-w-[36px] min-h-[36px] flex items-center justify-center"><Eye size={16} /></button>
            )},
          ]}
          mobileCardRender={(log) => (
            <div>
              <div className="flex items-center gap-2 mb-1"><Badge>{log.targetType}</Badge><span className="text-[10px] text-gray-400 font-mono">{formatDateTime(log.timestamp)}</span></div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{log.action}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">by {log.userName}</p>
              <p className="text-xs text-gray-400 mt-0.5">{log.details}</p>
            </div>
          )}
        />
      </Card>
      )}
    </div>
  );
}
