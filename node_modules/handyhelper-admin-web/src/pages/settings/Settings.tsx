import { useState } from 'react';
import { User, Bell, Shield, Palette, Save } from 'lucide-react';
import { Card, CardTitle, Button, Input, PageSkeleton } from '../../components/ui';
import { useTheme } from '../../context/ThemeContext';
import { useLoading } from '../../hooks/useLoading';

export default function Settings() {
  const loading = useLoading(800);
  const { theme, toggleTheme } = useTheme();
  const [activeSection, setActiveSection] = useState('profile');

  const sections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ];

  return (
    <div className="space-y-3 sm:space-y-4">
      <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Settings</h1>

      {loading ? (
        <PageSkeleton type="detail" />
      ) : (
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Sidebar */}
        <div className="w-full lg:w-48 shrink-0">
          <Card padding="none" className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible">
            {sections.map((sec) => {
              const Icon = sec.icon;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap min-h-[44px] ${
                    activeSection === sec.id
                      ? 'text-gray-900 bg-gray-100 dark:text-white dark:bg-gray-700'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-800/50'
                  }`}
                >
                  <Icon size={16} />
                  {sec.label}
                </button>
              );
            })}
          </Card>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeSection === 'profile' && (
            <Card>
              <CardTitle>Profile Settings</CardTitle>
              <div className="mt-4 space-y-4 max-w-lg">
                <Input label="Full Name" defaultValue="Admin User" />
                <Input label="Email" type="email" defaultValue="admin@handyhelper.com" />
                <Input label="Phone" type="tel" defaultValue="+1 (555) 123-4567" />
                <Button><Save size={16} className="mr-2" /> Save Changes</Button>
              </div>
            </Card>
          )}

          {activeSection === 'notifications' && (
            <Card>
              <CardTitle>Notification Settings</CardTitle>
              <div className="mt-4 space-y-4 max-w-lg">
                {['Email Notifications', 'Push Notifications', 'New User Alerts', 'New Job Alerts', 'Report Alerts', 'Dispute Alerts'].map((item) => (
                  <label key={item} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700/50 last:border-0 cursor-pointer">
                    <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                    <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-gray-300 text-gray-900 focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-700" />
                  </label>
                ))}
                <Button><Save size={16} className="mr-2" /> Save</Button>
              </div>
            </Card>
          )}

          {activeSection === 'security' && (
            <Card>
              <CardTitle>Security Settings</CardTitle>
              <div className="mt-4 space-y-4 max-w-lg">
                <Input label="Current Password" type="password" />
                <Input label="New Password" type="password" />
                <Input label="Confirm Password" type="password" />
                <Button><Save size={16} className="mr-2" /> Update Password</Button>
              </div>
            </Card>
          )}

          {activeSection === 'appearance' && (
            <Card>
              <CardTitle>Appearance</CardTitle>
              <div className="mt-4 space-y-4 max-w-lg">
                <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700/50">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Theme</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Current: {theme === 'dark' ? 'Dark' : 'Light'}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={toggleTheme}>
                    <Palette size={16} className="mr-1" />
                    Toggle Theme
                  </Button>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700/50">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Compact Mode</p>
                  <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-gray-900 focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-700" />
                </div>
                <div className="flex items-center justify-between py-3">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Show Sidebar Labels</p>
                  <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-gray-300 text-gray-900 focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-700" />
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
      )}
    </div>
  );
}
