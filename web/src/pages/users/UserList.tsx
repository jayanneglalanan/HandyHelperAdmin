import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Edit, Ban, CheckCircle } from 'lucide-react';
import { Card, SearchBar, Dropdown, StatusBadge, Avatar, PageSkeleton } from '../../components/ui';
import ResponsiveTable from '../../components/ui/ResponsiveTable';
import { useUsers } from '../../hooks/useMockData';
import { useLoading } from '../../hooks/useLoading';
import { useToast } from '../../components/ui/Toast';
import { formatDate } from '@shared/utils/formatters';

export default function UserList() {
  const navigate = useNavigate();
  const loading = useLoading(800);
  const users = useUsers();
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [userStatuses, setUserStatuses] = useState<Record<string, string>>({});

  const getUserStatus = (user: any) => userStatuses[user.id] || user.status;

  const handleSuspend = (e: any, userId: string, name: string) => {
    e.stopPropagation();
    setUserStatuses(prev => ({ ...prev, [userId]: 'suspended' }));
    showToast(`${name} has been suspended`);
  };

  const handleActivate = (e: any, userId: string, name: string) => {
    e.stopPropagation();
    setUserStatuses(prev => ({ ...prev, [userId]: 'active' }));
    showToast(`${name} has been activated`);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = `${user.firstName} ${user.lastName} ${user.email}`.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || getUserStatus(user) === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Users</h1>
          <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500">{filteredUsers.length} users total</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          <SearchBar value={search} onChange={setSearch} placeholder="Search users..." className="sm:w-64" />
          <div className="flex gap-2 sm:contents">
            <Dropdown value={roleFilter} onChange={setRoleFilter} fullWidth className="sm:w-auto sm:flex-shrink-0" options={[
              { value: 'all', label: 'All Roles' },
              { value: 'client', label: 'Clients' },
              { value: 'member', label: 'Members' },
              { value: 'admin', label: 'Admin' }
            ]} />
            <Dropdown value={statusFilter} onChange={setStatusFilter} fullWidth className="sm:w-auto sm:flex-shrink-0" options={[
              { value: 'all', label: 'All Status' },
              { value: 'active', label: 'Active' },
              { value: 'suspended', label: 'Suspended' }
            ]} />
          </div>
        </div>
      </div>

      {loading ? (
        <PageSkeleton type="list" />
      ) : (
      <Card padding="none">
        <ResponsiveTable
          data={filteredUsers}
          keyExtractor={(user) => user.id}
          onRowClick={(user) => navigate(`/users/${user.id}`)}
          columns={[
            { key: 'user', header: 'User', render: (user) => (
              <div className="flex items-center gap-3"><Avatar initials={`${user.firstName[0]}${user.lastName[0]}`} size="sm" /><div><span className="text-sm font-medium text-gray-900 dark:text-white block">{user.firstName} {user.lastName}</span><span className="text-xs text-gray-500 dark:text-gray-400 sm:hidden">{user.email}</span></div></div>
            )},
            { key: 'role', header: 'Role', render: (user) => <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">{user.role}</span>, hideOnMobile: true },
            { key: 'email', header: 'Email', render: (user) => <span className="text-sm text-gray-600 dark:text-gray-400">{user.email}</span>, hideOnMobile: true },
            { key: 'phone', header: 'Phone', render: (user) => <span className="text-sm text-gray-600 dark:text-gray-400">{user.phone}</span>, hideOnMobile: true },
            { key: 'status', header: 'Status', render: (user) => <StatusBadge status={getUserStatus(user)} /> },
            { key: 'joined', header: 'Joined', render: (user) => <span className="text-sm text-gray-500 dark:text-gray-400">{formatDate(user.dateJoined)}</span>, hideOnMobile: true },
            { key: 'actions', header: '', render: (user) => (
              <div className="flex items-center justify-end gap-1">
                <button onClick={(e) => { e.stopPropagation(); navigate(`/users/${user.id}`); }} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg dark:hover:text-gray-300 dark:hover:bg-gray-700 min-w-[36px] min-h-[36px] flex items-center justify-center"><Eye size={16} /></button>
                <button onClick={(e) => { e.stopPropagation(); navigate(`/users/${user.id}`); }} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg dark:hover:text-gray-300 dark:hover:bg-gray-700 min-w-[36px] min-h-[36px] flex items-center justify-center"><Edit size={16} /></button>
                {getUserStatus(user) === 'active' ? (
                  <button onClick={(e) => handleSuspend(e, user.id, user.firstName)} className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg dark:hover:bg-amber-900/20 min-w-[36px] min-h-[36px] flex items-center justify-center"><Ban size={16} /></button>
                ) : (
                  <button onClick={(e) => handleActivate(e, user.id, user.firstName)} className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg dark:hover:bg-emerald-900/20 min-w-[36px] min-h-[36px] flex items-center justify-center"><CheckCircle size={16} /></button>
                )}
              </div>
            )},
          ]}
          mobileCardRender={(user) => (
            <div className="flex items-center gap-3">
              <Avatar initials={`${user.firstName[0]}${user.lastName[0]}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2"><p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user.firstName} {user.lastName}</p><StatusBadge status={getUserStatus(user)} /></div>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                <div className="flex items-center gap-3 mt-1"><span className="text-xs text-gray-400 capitalize">{user.role}</span><span className="text-xs text-gray-400">{formatDate(user.dateJoined)}</span></div>
              </div>
              <Eye size={16} className="text-gray-300 dark:text-gray-600 shrink-0" />
            </div>
          )}
        />
      </Card>
      )}
    </div>
  );
}
