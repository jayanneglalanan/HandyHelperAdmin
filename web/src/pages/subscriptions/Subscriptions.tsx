import { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { Card, Tabs, Badge, Button, Dropdown, PageSkeleton } from '../../components/ui';
import { useSubscriptions } from '../../hooks/useMockData';
import { useLoading } from '../../hooks/useLoading';
import { useToast } from '../../components/ui/Toast';
import { formatCurrency } from '@shared/utils/formatters';

const STORAGE_KEY = 'handyhelper_subscriptions';

function loadCustom(): any[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}

export default function Subscriptions() {
  const loading = useLoading(800);
  const basePlans = useSubscriptions();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('all');
  const [customItems, setCustomItems] = useState<any[]>(loadCustom);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', price: '', duration: 'yearly', featuresText: '' });

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(customItems)); }, [customItems]);

  const plans = [...basePlans, ...customItems];
  const tabs = [
    { id: 'all', label: 'All', count: plans.length },
    { id: 'active', label: 'Active', count: plans.filter(s => s.status === 'active').length },
  ];
  const filtered = plans.filter(s => activeTab === 'all' || s.status === activeTab);

  const handleSave = () => {
    if (!form.name.trim()) { showToast('Name is required', 'error'); return; }
    const price = Number(form.price);
    if (!price || price < 0) { showToast('Enter a valid price', 'error'); return; }
    const features = form.featuresText.split('\n').map(f => f.trim()).filter(Boolean);
    const newItem = { id: `plan_custom_${Date.now()}`, name: form.name.trim(), price, duration: form.duration, features, status: 'active' as const, subscriberCount: 0 };
    setCustomItems(prev => [newItem, ...prev]);
    setForm({ name: '', price: '', duration: 'yearly', featuresText: '' });
    setShowModal(false);
    showToast(`"${newItem.name}" plan added`);
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Subscriptions</h1>
          <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500">{plans.length} plans</p>
        </div>
        <Button className="hidden sm:flex" onClick={() => setShowModal(true)}><Plus size={16} className="mr-1" /> Add Plan</Button>
      </div>

      {loading ? (
        <PageSkeleton type="grid" />
      ) : (
      <Card padding="none">
        <div className="px-3 sm:px-4 pt-3 sm:pt-4 overflow-x-auto"><Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} /></div>
        <div className="p-3 sm:p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map((sub) => (
              <Card key={sub.id} className="hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2"><h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">{sub.name}</h3><Badge variant="success">{sub.status}</Badge></div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 capitalize">{sub.duration}</p>
                    <div className="flex items-center gap-3 mt-2"><span className="text-sm font-bold text-gray-900 dark:text-white">{formatCurrency(sub.price)}/year</span></div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{sub.subscriberCount} subscribers</p>
                    <div className="mt-2 space-y-1">{sub.features.slice(0, 3).map((f: string, i: number) => <p key={i} className="text-[10px] text-gray-400 dark:text-gray-500">• {f}</p>)}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Card>
      )}

      <button onClick={() => setShowModal(true)} className="fixed bottom-20 right-4 z-40 w-14 h-14 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors lg:hidden">
        <Plus size={24} />
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)} />
          <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">Add Plan</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"><X size={18} /></button>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Plan Name *</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="e.g. Basic" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Price (₱) *</label>
                <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="0" min="0" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Duration</label>
                <Dropdown value={form.duration} onChange={v => setForm(f => ({ ...f, duration: v }))} fullWidth options={[
                  { value: 'monthly', label: 'Monthly' },
                  { value: 'yearly', label: 'Yearly' }
                ]} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Features (one per line)</label>
              <textarea value={form.featuresText} onChange={e => setForm(f => ({ ...f, featuresText: e.target.value }))} rows={4} className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none" placeholder={"Feature 1\nFeature 2\nFeature 3"} />
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
