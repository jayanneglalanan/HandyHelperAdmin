import { useState } from 'react';
import { User, Bell, Shield, Palette, Save, Settings as SettingsIcon } from 'lucide-react';
import { Card, CardTitle, Button, Input, PageSkeleton } from '../../components/ui';
import { useTheme } from '../../context/ThemeContext';
import { useBrand } from '../../context/BrandContext';
import { useLoading } from '../../hooks/useLoading';
import { useToast } from '../../components/ui/Toast';

export default function Settings() {
  const loading = useLoading(800);
  const { theme, toggleTheme } = useTheme();
  const { brandName, setBrandName } = useBrand();
  const { showToast } = useToast();
  const [activeSection, setActiveSection] = useState('general');
  const [brandInput, setBrandInput] = useState(brandName);
  const [profileName, setProfileName] = useState('Admin User');
  const [profileEmail, setProfileEmail] = useState('admin@handyhelper.com');
  const [profilePhone, setProfilePhone] = useState('+1 (555) 123-4567');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [notifications, setNotifications] = useState({
    email: true, push: true, newUser: true, newJob: true, report: true, dispute: true,
  });

  const sections = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ];

  const handleSaveBrand = () => {
    if (brandInput.trim()) {
      setBrandName(brandInput.trim());
      showToast('Brand name updated successfully');
    }
  };

  const handleSaveProfile = () => {
    showToast('Profile saved successfully');
  };

  const handleSaveNotifications = () => {
    showToast('Notification settings saved');
  };

  const handleUpdatePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast('Please fill in all password fields', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    showToast('Password updated successfully');
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Settings</h1>

      {loading ? (
        <PageSkeleton type="detail" />
      ) : (
      <div className="flex flex-col lg:flex-row gap-4">
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

        <div className="flex-1">
          {activeSection === 'general' && (
            <Card>
              <CardTitle>General Settings</CardTitle>
              <div className="mt-4 space-y-4 max-w-lg">
                <Input label="Brand Name" value={brandInput} onChange={(e) => setBrandInput(e.target.value)} placeholder="Enter brand name" />
                <p className="text-xs text-gray-500 dark:text-gray-400">This will update the brand name across the login page, sidebar, and top bar.</p>
                <Button onClick={handleSaveBrand}><Save size={16} className="mr-2" /> Save Brand Name</Button>
              </div>
            </Card>
          )}

          {activeSection === 'profile' && (
            <Card>
              <CardTitle>Profile Settings</CardTitle>
              <div className="mt-4 space-y-4 max-w-lg">
                <Input label="Full Name" value={profileName} onChange={(e) => setProfileName(e.target.value)} />
                <Input label="Email" type="email" value={profileEmail} onChange={(e) => setProfileEmail(e.target.value)} />
                <Input label="Phone" type="tel" value={profilePhone} onChange={(e) => setProfilePhone(e.target.value)} />
                <Button onClick={handleSaveProfile}><Save size={16} className="mr-2" /> Save Changes</Button>
              </div>
            </Card>
          )}

          {activeSection === 'notifications' && (
            <Card>
              <CardTitle>Notification Settings</CardTitle>
              <div className="mt-4 space-y-4 max-w-lg">
                {([
                  ['email', 'Email Notifications'],
                  ['push', 'Push Notifications'],
                  ['newUser', 'New User Alerts'],
                  ['newJob', 'New Job Alerts'],
                  ['report', 'Report Alerts'],
                  ['dispute', 'Dispute Alerts'],
                ] as const).map(([key, label]) => (
                  <label key={key} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700/50 last:border-0 cursor-pointer">
                    <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                    <input
                      type="checkbox"
                      checked={notifications[key]}
                      onChange={(e) => setNotifications(prev => ({ ...prev, [key]: e.target.checked }))}
                      className="w-5 h-5 rounded border-gray-300 text-gray-900 focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-700"
                    />
                  </label>
                ))}
                <Button onClick={handleSaveNotifications}><Save size={16} className="mr-2" /> Save</Button>
              </div>
            </Card>
          )}

          {activeSection === 'security' && (
            <Card>
              <CardTitle>Security Settings</CardTitle>
              <div className="mt-4 space-y-4 max-w-lg">
                <Input label="Current Password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                <Input label="New Password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                <Input label="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                <Button onClick={handleUpdatePassword}><Save size={16} className="mr-2" /> Update Password</Button>
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
                  <Button variant="outline" size="sm" onClick={toggleTheme}><Palette size={16} className="mr-1" /> Toggle Theme</Button>
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
