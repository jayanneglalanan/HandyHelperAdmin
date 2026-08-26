import { useState } from 'react';
import { CheckCircle, XCircle, RefreshCw, FileText } from 'lucide-react';
import { Card, Tabs, StatusBadge, Badge, Button, SearchBar, PageSkeleton } from '../../components/ui';
import { useCredentials } from '../../hooks/useMockData';
import { useLoading } from '../../hooks/useLoading';
import { formatDate } from '@shared/utils/formatters';

export default function MemberVerification() {
  const loading = useLoading(800);
  const credentials = useCredentials();
  const [activeTab, setActiveTab] = useState('pending');
  const [search, setSearch] = useState('');

  const tabs = [
    { id: 'pending', label: 'Pending', count: credentials.filter(c => c.status === 'pending').length },
    { id: 'approved', label: 'Approved', count: credentials.filter(c => c.status === 'approved').length },
    { id: 'rejected', label: 'Rejected', count: credentials.filter(c => c.status === 'rejected').length },
    { id: 'needs_update', label: 'Update', count: credentials.filter(c => c.status === 'needs_update').length },
  ];

  const filtered = credentials.filter(c => {
    const matchesTab = c.status === activeTab;
    const matchesSearch = c.memberName.toLowerCase().includes(search.toLowerCase()) ||
      c.title.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Verification</h1>
          <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500">Review member credentials</p>
        </div>
        <SearchBar value={search} onChange={setSearch} placeholder="Search..." className="w-full sm:w-64" />
      </div>

      {loading ? (
        <PageSkeleton type="list" />
      ) : (
      <Card padding="none">
        <div className="px-3 sm:px-4 pt-3 sm:pt-4 overflow-x-auto">
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        </div>

        <div className="p-3 sm:p-4 space-y-3">
          {filtered.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">No credentials found</p>
          ) : (
            filtered.map((cred) => (
              <div key={cred.id} className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 shrink-0">
                      <FileText size={18} className="text-gray-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">{cred.memberName}</h3>
                        <Badge variant="neutral">{cred.type}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">{cred.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 hidden sm:block">{cred.description}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        {formatDate(cred.submittedDate)}
                        {cred.expiryDate && ` · Exp: ${formatDate(cred.expiryDate)}`}
                      </p>
                      {cred.reviewerNotes && (
                        <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">Note: {cred.reviewerNotes}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:flex-shrink-0">
                    <StatusBadge status={cred.status} />
                    {cred.status === 'pending' && (
                      <div className="flex gap-1">
                        <Button variant="success" size="sm">
                          <CheckCircle size={14} className="mr-1" />
                          Verify
                        </Button>
                        <Button variant="danger" size="sm">
                          <XCircle size={14} className="mr-1" />
                          Reject
                        </Button>
                      </div>
                    )}
                    {cred.status === 'needs_update' && (
                      <Button variant="outline" size="sm">
                        <RefreshCw size={14} className="mr-1" />
                        Update
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
      )}
    </div>
  );
}
