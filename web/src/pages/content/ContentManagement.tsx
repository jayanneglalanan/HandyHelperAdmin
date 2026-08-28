import { useState, useEffect } from 'react';
import { Edit, Trash2, Plus, Eye, X } from 'lucide-react';
import { Card, Button, SearchBar, Badge, PageSkeleton } from '../../components/ui';
import { useContent } from '../../hooks/useMockData';
import { useLoading } from '../../hooks/useLoading';
import { useToast } from '../../components/ui/Toast';
import { formatDate } from '@shared/utils/formatters';

const STORAGE_KEY = 'handyhelper_content';

function loadCustom(): any[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}

export default function ContentManagement() {
  const loading = useLoading(800);
  const baseContent = useContent();
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());
  const [customItems, setCustomItems] = useState<any[]>(loadCustom);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', type: 'faq', status: 'draft', content: '' });

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(customItems)); }, [customItems]);

  const allContent = [...baseContent.filter(c => !deletedIds.has(c.id)), ...customItems.filter(c => !deletedIds.has(c.id))];
  const filtered = allContent.filter(c => c.title.toLowerCase().includes(search.toLowerCase()));

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Delete "${title}"?`)) {
      setDeletedIds(prev => new Set(prev).add(id));
      showToast(`"${title}" deleted`);
    }
  };

  const handleSave = () => {
    if (!form.title.trim()) { showToast('Title is required', 'error'); return; }
    if (!form.content.trim()) { showToast('Content is required', 'error'); return; }
    const today = new Date().toISOString().split('T')[0];
    const slug = '/' + form.title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const newItem = { id: `page_custom_${Date.now()}`, title: form.title.trim(), slug, type: form.type, status: form.status, lastUpdated: today, updatedBy: 'Admin', content: form.content.trim() };
    setCustomItems(prev => [newItem, ...prev]);
    setForm({ title: '', type: 'faq', status: 'draft', content: '' });
    setShowModal(false);
    showToast(`"${newItem.title}" added`);
  };

  const getTypeIcon = (type: string) => {
    switch (type) { case 'faq': return '❓'; case 'announcement': return '📢'; case 'terms': return '📄'; case 'help': return '📖'; default: return '📝'; }
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
          <Button className="hidden sm:flex" onClick={() => setShowModal(true)}><Plus size={16} className="mr-1" /> Add</Button>
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
                  <div className="flex items-center gap-2 flex-wrap"><h3 className="text-sm font-medium text-gray-900 dark:text-white">{item.title}</h3><Badge variant={item.status === 'published' ? 'success' : 'neutral'}>{item.status}</Badge><Badge>{item.type}</Badge></div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{item.content}</p>
                  <div className="flex items-center gap-3 mt-2"><span className="text-xs text-gray-400">By {item.updatedBy}</span><span className="text-xs text-gray-400">{formatDate(item.lastUpdated)}</span></div>
                </div>
              </div>
              <div className="flex gap-1 sm:flex-shrink-0">
                <button onClick={() => showToast(`Viewing "${item.title}"`, 'info')} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg dark:hover:bg-gray-700 min-w-[36px] min-h-[36px] flex items-center justify-center"><Eye size={16} /></button>
                <button onClick={() => showToast(`Editing "${item.title}"`, 'info')} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg dark:hover:bg-gray-700 min-w-[36px] min-h-[36px] flex items-center justify-center"><Edit size={16} /></button>
                <button onClick={() => handleDelete(item.id, item.title)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg dark:hover:bg-red-900/20 min-w-[36px] min-h-[36px] flex items-center justify-center"><Trash2 size={16} /></button>
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
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">Add Content</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"><X size={18} /></button>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Title *</label>
              <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="Page title" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Type</label>
                <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option value="faq">FAQ</option>
                  <option value="announcement">Announcement</option>
                  <option value="help">Help</option>
                  <option value="terms">Terms</option>
                  <option value="privacy">Privacy</option>
                  <option value="homepage">Homepage</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Status</label>
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Content *</label>
              <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} rows={4} className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none" placeholder="Page content..." />
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
