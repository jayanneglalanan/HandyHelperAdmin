import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Briefcase,
  Tag,
  CreditCard,
  Star,
  AlertTriangle,
  BarChart3,
  ChevronDown,
  ChevronRight,
  FileText,
  History,
  X,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  children?: { label: string; path: string }[];
}

const allNavItems: NavItem[] = [
  { label: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
  {
    label: 'Users',
    path: '/users',
    icon: <Users size={20} />,
    children: [
      { label: 'All Users', path: '/users' },
    ],
  },
  { label: 'Member Verification', path: '/verification', icon: <ShieldCheck size={20} /> },
  {
    label: 'Jobs',
    path: '/jobs',
    icon: <Briefcase size={20} />,
    children: [
      { label: 'All Jobs', path: '/jobs' },
    ],
  },
  { label: 'Categories & Skills', path: '/categories', icon: <Tag size={20} /> },
  { label: 'Subscriptions', path: '/subscriptions', icon: <CreditCard size={20} /> },
  { label: 'Ratings & Reviews', path: '/reviews', icon: <Star size={20} /> },
  {
    label: 'Reports',
    path: '/reports',
    icon: <AlertTriangle size={20} />,
    children: [
      { label: 'Reports', path: '/reports' },
      { label: 'Disputes', path: '/disputes' },
      { label: 'Advanced Reports', path: '/advanced-reports' },
    ],
  },
  { label: 'Analytics', path: '/analytics', icon: <BarChart3 size={20} /> },
  { label: 'Content Management', path: '/content', icon: <FileText size={20} /> },
  { label: 'Audit Logs', path: '/audit-logs', icon: <History size={20} /> },
];

const bottomNavPaths = ['/', '/users', '/verification', '/jobs'];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>(['/users', '/jobs', '/reports']);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const navItems = isMobile
    ? allNavItems.filter(item => !bottomNavPaths.includes(item.path))
    : allNavItems;

  const toggleExpand = (path: string) => {
    setExpandedItems(prev =>
      prev.includes(path) ? prev.filter(p => p !== path) : [...prev, path]
    );
  };

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 dark:bg-gray-900 dark:border-gray-800 transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">HH</span>
            </div>
            <div>
              <h1 className="text-sm font-bold text-gray-900 dark:text-white">HandyHelper</h1>
              <p className="text-xs text-gray-400 dark:text-gray-500">Admin Panel</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-gray-600 min-w-[40px] min-h-[40px] flex items-center justify-center">
            <X size={20} />
          </button>
        </div>

        <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100%-4rem)]">
          {navItems.map((item) => (
            <div key={item.path}>
              {item.children ? (
                <>
                  <button
                    onClick={() => toggleExpand(item.path)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 min-h-[40px] ${
                      isActive(item.path)
                        ? 'bg-purple-50 text-accent dark:bg-accent/10 dark:text-accent'
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      {item.label}
                    </div>
                    {expandedItems.includes(item.path) ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>
                  {expandedItems.includes(item.path) && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <NavLink
                          key={child.path}
                          to={child.path}
                          onClick={onClose}
                          className={({ isActive }) =>
                            `block px-3 py-1.5 text-sm rounded-lg transition-all duration-200 min-h-[36px] ${
                              isActive
                                ? 'bg-purple-50 text-accent font-medium dark:bg-accent/10 dark:text-accent'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300'
                            }`
                          }
                        >
                          {child.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <NavLink
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 min-h-[40px] ${
                      isActive
                        ? 'bg-purple-50 text-accent dark:bg-accent/10 dark:text-accent'
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white'
                    }`
                  }
                >
                  {item.icon}
                  {item.label}
                </NavLink>
              )}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
