import { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Card, Button, SearchBar, Badge, PageSkeleton } from '../../components/ui';
import { useCategories } from '../../hooks/useMockData';
import { useLoading } from '../../hooks/useLoading';

export default function Categories() {
  const loading = useLoading(800);
  const categories = useCategories();
  const [search, setSearch] = useState('');

  const filtered = categories.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Categories</h1>
          <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500">{filtered.length} categories</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <SearchBar value={search} onChange={setSearch} placeholder="Search..." className="flex-1 sm:flex-none sm:w-48" />
          <Button className="hidden sm:flex"><Plus size={16} className="mr-1" /> Add</Button>
        </div>
      </div>

      {loading ? (
        <PageSkeleton type="grid" />
      ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((cat) => (
          <Card key={cat.id}>
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">{cat.name}</h3>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 line-clamp-2">{cat.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge>{cat.jobCount} jobs</Badge>
                  <Badge variant="neutral">{cat.memberCount} members</Badge>
                </div>
              </div>
              <div className="flex flex-col gap-1 shrink-0 ml-2">
                <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded dark:hover:bg-gray-700 min-w-[32px] min-h-[32px] flex items-center justify-center">
                  <Edit size={14} />
                </button>
                <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded dark:hover:bg-red-900/20 min-w-[32px] min-h-[32px] flex items-center justify-center">
                  <Trash2 size={14} />
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
