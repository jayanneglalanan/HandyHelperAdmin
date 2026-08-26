import { useState } from 'react';
import { Edit, Trash2, Plus, Eye } from 'lucide-react';
import { Card, Button, SearchBar, Badge, PageSkeleton } from '../../components/ui';
import { useContent } from '../../hooks/useMockData';
import { useLoading } from '../../hooks/useLoading';
import { formatDate } from '@shared/utils/formatters';

export default function ContentManagement() {
  const loading = useLoading(800);
  const content = useContent();
  const [search, setSearch] = useState('');

  const filtered = content.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'faq': return '❓';
      case 'announcement': return '📢';
      case 'terms': return '📄';
      case 'help': return '📖';
      default: return '📝';
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Content</h1>
          <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500">{filtered.length} pages</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <SearchBar value={search} onChange={setSearch} placeholder="Search..." className="flex-1 sm:flex-none sm:w-48" />
          <Button className="hidden sm:flex"><Plus size={16} className="mr-1" /> Add</Button>
        </div>
      </div>

      {loading ? (
        <PageSkeleton type="list" />
      ) : (
      <div className="space-y-3">
        {filtered.map((item) => (
          <Card key={item.id}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <span className="text-lg shrink-0">{getTypeIcon(item.type)}</span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">{item.title}</h3>
                    <Badge variant={item.status === 'published' ? 'success' : 'neutral'}>{item.status}</Badge>
                    <Badge>{item.type}</Badge>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{item.content}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-gray-400">By {item.updatedBy}</span>
                    <span className="text-xs text-gray-400">{formatDate(item.lastUpdated)}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-1 sm:flex-shrink-0">
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg dark:hover:bg-gray-700 min-w-[36px] min-h-[36px] flex items-center justify-center">
                  <Eye size={16} />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg dark:hover:bg-gray-700 min-w-[36px] min-h-[36px] flex items-center justify-center">
                  <Edit size={16} />
                </button>
                <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg dark:hover:bg-red-900/20 min-w-[36px] min-h-[36px] flex items-center justify-center">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
      )}

      {/* Mobile FAB */}
      <button className="fixed bottom-20 right-4 z-40 w-14 h-14 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors lg:hidden">
        <Plus size={24} />
      </button>
    </div>
  );
}
