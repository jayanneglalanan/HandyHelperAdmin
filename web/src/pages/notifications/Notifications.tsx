import { useState } from 'react';
import { CheckCheck } from 'lucide-react';
import { Card, Tabs, Button } from '../../components/ui';
import { useNotifications } from '../../hooks/useMockData';
import { useToast } from '../../components/ui/Toast';
import { formatDate } from '@shared/utils/formatters';

export default function Notifications() {
  const notifications = useNotifications();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('all');
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  const isRead = (n: any) => n.read || readIds.has(n.id);
  const unreadCount = notifications.filter(n => !isRead(n)).length;

  const tabs = [
    { id: 'all', label: 'All', count: notifications.length },
    { id: 'unread', label: 'Unread', count: unreadCount },
  ];

  const filtered = notifications.filter(n => {
    if (activeTab === 'unread') return !isRead(n);
    return true;
  });

  const handleMarkAllRead = () => {
    setReadIds(new Set(notifications.map(n => n.id)));
    showToast('All notifications marked as read');
  };

  const handleMarkRead = (id: string) => {
    setReadIds(prev => new Set([...prev, id]));
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'registration': return 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'credential': return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
      case 'job': return 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400';
      case 'report': return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';
      case 'dispute': return 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400';
      case 'subscription': return 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400';
      default: return 'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'registration': return 'New User';
      case 'credential': return 'Credential';
      case 'job': return 'Job';
      case 'report': return 'Report';
      case 'dispute': return 'Dispute';
      case 'subscription': return 'Subscription';
      default: return 'System';
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Notifications</h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{unreadCount} unread</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleMarkAllRead}><CheckCheck size={16} className="mr-1" /> Mark All Read</Button>
      </div>

      <Card padding="none">
        <div className="px-3 sm:px-4 pt-3 sm:pt-4 overflow-x-auto"><Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} /></div>
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {filtered.map((notif) => (
            <div key={notif.id} onClick={() => handleMarkRead(notif.id)} className={`p-3 sm:p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer ${!isRead(notif) ? 'bg-blue-50/30 dark:bg-blue-900/5' : ''}`}>
              <div className="flex items-start gap-3">
                <div className={`p-1.5 rounded-full shrink-0 ${getIconColor(notif.type)}`}><span className="text-[10px] font-bold">{getTypeLabel(notif.type)}</span></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2"><h3 className="text-sm font-medium text-gray-900 dark:text-white">{notif.title}</h3>{!isRead(notif) && <div className="w-2 h-2 bg-blue-500 rounded-full shrink-0" />}</div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{notif.message}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{formatDate(notif.date)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
