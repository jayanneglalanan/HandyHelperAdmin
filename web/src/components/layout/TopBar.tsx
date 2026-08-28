import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, Bell, Sun, Moon, ChevronDown, CheckCheck } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useBrand } from '../../context/BrandContext';
import { useNotifications } from '../../hooks/useMockData';
import Avatar from '../ui/Avatar';

interface TopBarProps {
  onMenuClick: () => void;
}

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/users': 'Users',
  '/verification': 'Verification',
  '/jobs': 'Jobs',
  '/categories': 'Categories',
  '/subscriptions': 'Subscriptions',
  '/reviews': 'Reviews',
  '/reports': 'Reports',
  '/disputes': 'Disputes',
  '/advanced-reports': 'Reports',
  '/analytics': 'Analytics',
  '/content': 'Content',
  '/audit-logs': 'Audit Logs',
  '/settings': 'Settings',
};

export default function TopBar({ onMenuClick }: TopBarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { brandName } = useBrand();
  const notifications = useNotifications();
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const unreadCount = notifications.filter(n => !n.read && !readIds.has(n.id)).length;
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfile(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAsRead = (id: string) => {
    setReadIds(prev => new Set(prev).add(id));
  };

  const markAllRead = () => {
    setReadIds(new Set(notifications.map(n => n.id)));
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.startsWith('/users/')) return 'User Details';
    if (path.startsWith('/jobs/')) return 'Job Details';
    return pageTitles[path] || brandName;
  };

  return (
    <header className="sticky top-0 z-30 h-14 sm:h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 dark:bg-gray-900/80 dark:border-gray-800">
      <div className="flex items-center justify-between h-full px-3 sm:px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 -ml-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-800 transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center"
          >
            <Menu size={22} />
          </button>
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white truncate">{getPageTitle()}</h2>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={toggleTheme}
            className="p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-800 transition-all duration-200 min-w-[40px] min-h-[40px] flex items-center justify-center"
          >
            {theme === 'dark' ? <Sun size={20} className="transition-transform duration-200 hover:rotate-45" /> : <Moon size={20} className="transition-transform duration-200 hover:-rotate-12" />}
          </button>

          <div className="relative" ref={notifRef}>
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfile(false);
              }}
              className="relative p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-800 transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-accent text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-14 w-72 sm:w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden max-h-[60vh] animate-fade-in-up">
                <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Notifications</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 min-h-[28px]"
                    >
                      <CheckCheck size={14} />
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="overflow-y-auto max-h-72">
                  {notifications.slice(0, 8).map((notif) => {
                    const isRead = notif.read || readIds.has(notif.id);
                    return (
                      <div
                        key={notif.id}
                        className={`p-3 border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150 ${
                          !isRead ? 'bg-purple-50/50 dark:bg-accent/5' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{notif.title}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{notif.message}</p>
                          </div>
                          {!isRead && (
                            <button
                              onClick={() => markAsRead(notif.id)}
                              className="shrink-0 text-[10px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 whitespace-nowrap min-h-[24px] px-1.5 py-0.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              Mark read
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="relative" ref={profileRef}>
            <button
              onClick={() => {
                setShowProfile(!showProfile);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-lg dark:hover:bg-gray-800 transition-colors min-h-[40px]"
            >
              <Avatar initials="AU" size="sm" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block">Admin</span>
              <ChevronDown size={16} className="text-gray-400 hidden sm:block" />
            </button>

            {showProfile && (
              <div className="absolute right-0 top-14 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden animate-fade-in-up">
                <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Admin User</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">admin@handyhelper.com</p>
                </div>
                <div className="p-1">
                  <button
                    onClick={() => { setShowProfile(false); navigate('/settings'); }}
                    className="w-full text-left px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-100 rounded-lg dark:text-gray-300 dark:hover:bg-gray-700 transition-colors duration-150"
                  >
                    Settings
                  </button>
                  <button
                    onClick={() => { setShowProfile(false); navigate('/login'); }}
                    className="w-full text-left px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg dark:text-red-400 dark:hover:bg-red-900/20 transition-colors duration-150"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
