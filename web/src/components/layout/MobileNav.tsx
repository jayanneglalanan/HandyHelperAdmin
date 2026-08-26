import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Briefcase, ShieldCheck } from 'lucide-react';

const navItems = [
  { label: 'Home', path: '/', icon: LayoutDashboard },
  { label: 'Users', path: '/users', icon: Users },
  { label: 'Jobs', path: '/jobs', icon: Briefcase },
  { label: 'Verify', path: '/verification', icon: ShieldCheck },
];

export default function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 dark:bg-gray-900 dark:border-gray-800 lg:hidden safe-area-bottom">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 min-w-[48px] py-1 active:scale-95 transition-all duration-150 ${
                  isActive
                    ? 'text-accent'
                    : 'text-gray-400 dark:text-gray-500'
                }`
              }
            >
              <Icon size={20} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
