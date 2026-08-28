import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { Card, Button, SearchBar, Badge, PageSkeleton } from '../../components/ui';
import { useCategories } from '../../hooks/useMockData';
import { useLoading } from '../../hooks/useLoading';
import { useToast } from '../../components/ui/Toast';

const STORAGE_KEY = 'handyhelper_categories';

function loadCustom(): any[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}

export default function Categories() {
  const loading = useLoading(800);
  const baseCategories = useCategories();
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());
  const [customItems, setCustomItems] = useState<any[]>(loadCustom);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', icon: '🔧', description: '' });

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(customItems)); }, [customItems]);

  const categories = [...baseCategories.filter(c => !deletedIds.has(c.id)), ...customItems.filter(c => !deletedIds.has(c.id))];
  const filtered = categories.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Delete category "${name}"?`)) {
      setDeletedIds(prev => new Set(prev).add(id));
      showToast(`"${name}" deleted`);
    }
  };

  const handleSave = () => {
    if (!form.name.trim()) { showToast('Name is required', 'error'); return; }
    const newItem = { id: `cat_custom_${Date.now()}`, name: form.name.trim(), icon: form.icon || '🔧', description: form.description.trim(), status: 'active' as const, memberCount: 0, jobCount: 0 };
    setCustomItems(prev => [newItem, ...prev]);
    setForm({ name: '', icon: '🔧', description: '' });
    setShowModal(false);
    showToast(`"${newItem.name}" added`);
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Categories</h1>
          <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500">{filtered.length} categories</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <SearchBar value={search} onChange={setSearch} placeholder="Search..." className="flex-1 sm:flex-none sm:w-48" />
          <Button className="hidden sm:flex" onClick={() => setShowModal(true)}><Plus size={16} className="mr-1" /> Add</Button>
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
                <div className="flex items-center gap-2 mt-2"><Badge>{cat.jobCount} jobs</Badge><Badge variant="neutral">{cat.memberCount} members</Badge></div>
              </div>
              <div className="flex flex-col gap-1 shrink-0 ml-2">
                <button onClick={() => showToast(`Editing "${cat.name}"`, 'info')} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded dark:hover:bg-gray-700 min-w-[32px] min-h-[32px] flex items-center justify-center"><Edit size={14} /></button>
                <button onClick={() => handleDelete(cat.id, cat.name)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded dark:hover:bg-red-900/20 min-w-[32px] min-h-[32px] flex items-center justify-center"><Trash2 size={14} /></button>
              </div>
            </div>
          </Card>
        ))}
      </div>
      )}

      <button onClick={() => setShowModal(true)} className="fixed bottom-20 right-4 z-40 w-14 h-14 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors lg:hidden">
        <Plus size={24} />
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)} />
          <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">Add Category</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"><X size={18} /></button>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Name *</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="e.g. Roofing" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Icon (emoji)</label>
              <input value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="🔧" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Description</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none" placeholder="Brief description of the category" />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button onClick={handleSave}>Save</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
