import { useState } from 'react';
import { MessageSquare, AlertTriangle } from 'lucide-react';
import { Card, SearchBar, Badge, Button } from '../../components/ui';
import { useConversations } from '../../hooks/useMockData';
import { formatDate } from '@shared/utils/formatters';

export default function ChatMonitoring() {
  const conversations = useConversations();
  const [search, setSearch] = useState('');
  const [flagFilter, setFlagFilter] = useState('all');

  const filtered = conversations.filter(c => {
    const matchesSearch = c.participant1Name.toLowerCase().includes(search.toLowerCase()) ||
      c.participant2Name.toLowerCase().includes(search.toLowerCase());
    const matchesFlag = flagFilter === 'all' ||
      (flagFilter === 'flagged' && (c.status === 'flagged' || c.status === 'reported')) ||
      (flagFilter === 'normal' && c.status === 'normal');
    return matchesSearch && matchesFlag;
  });

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Chat Monitoring</h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Monitor user conversations</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          <SearchBar value={search} onChange={setSearch} placeholder="Search conversations..." className="sm:w-64" />
          <select
            value={flagFilter}
            onChange={(e) => setFlagFilter(e.target.value)}
            className="px-3 py-2.5 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 min-h-[40px]"
          >
            <option value="all">All</option>
            <option value="flagged">Flagged</option>
            <option value="normal">Normal</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((conv) => (
          <Card key={conv.id}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg shrink-0">
                  <MessageSquare size={18} className="text-gray-400" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      {conv.participant1Name} ↔ {conv.participant2Name}
                    </h3>
                    {(conv.status === 'flagged' || conv.status === 'reported') && (
                      <Badge variant="error">
                        <AlertTriangle size={10} className="mr-1" />
                        {conv.status === 'reported' ? 'Reported' : 'Flagged'}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{conv.lastMessage}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-400">{conv.messageCount} messages</span>
                    <span className="text-xs text-gray-400">{formatDate(conv.lastMessageDate)}</span>
                    <Badge>{conv.jobTitle}</Badge>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 sm:flex-shrink-0">
                <Button variant="outline" size="sm">View</Button>
                {(conv.status === 'flagged' || conv.status === 'reported') && (
                  <Button variant="danger" size="sm">Review</Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
