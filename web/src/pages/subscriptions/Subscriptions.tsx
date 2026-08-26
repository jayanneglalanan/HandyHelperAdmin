import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Card, Tabs, Badge, Button, PageSkeleton } from '../../components/ui';
import { useSubscriptions } from '../../hooks/useMockData';
import { useLoading } from '../../hooks/useLoading';
import { formatCurrency } from '@shared/utils/formatters';

export default function Subscriptions() {
  const loading = useLoading(800);
  const subscriptions = useSubscriptions();
  const [activeTab, setActiveTab] = useState('all');

  const tabs = [
    { id: 'all', label: 'All', count: subscriptions.length },
    { id: 'active', label: 'Active', count: subscriptions.filter(s => s.status === 'active').length },
  ];

  const filtered = subscriptions.filter(s => {
    return activeTab === 'all' || s.status === activeTab;
  });

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Subscriptions</h1>
          <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500">{filtered.length} plans</p>
        </div>
        <Button className="hidden sm:flex">
          <Plus size={16} className="mr-1" /> Add Plan
        </Button>
      </div>

      {loading ? (
        <PageSkeleton type="grid" />
      ) : (
      <Card padding="none">
        <div className="px-3 sm:px-4 pt-3 sm:pt-4 overflow-x-auto">
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        </div>
        <div className="p-3 sm:p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map((sub) => (
              <Card key={sub.id} className="hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">{sub.name}</h3>
                      <Badge variant="success">{sub.status}</Badge>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 capitalize">{sub.duration}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{formatCurrency(sub.price)}/year</span>
                    </div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {sub.subscriberCount} subscribers
                    </p>
                    <div className="mt-2 space-y-1">
                      {sub.features.slice(0, 3).map((f, i) => (
                        <p key={i} className="text-[10px] text-gray-400 dark:text-gray-500">• {f}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Card>
      )}

      {/* Mobile FAB */}
      <button className="fixed bottom-20 right-4 z-40 w-14 h-14 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors lg:hidden">
        <Plus size={24} />
      </button>
    </div>
  );
}
