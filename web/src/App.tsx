import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import AdminLayout from './components/layout/AdminLayout';
import AdminLogin from './pages/auth/AdminLogin';
import Dashboard from './pages/dashboard/Dashboard';
import UserList from './pages/users/UserList';
import UserDetail from './pages/users/UserDetail';
import MemberVerification from './pages/verification/MemberVerification';
import JobList from './pages/jobs/JobList';
import JobDetail from './pages/jobs/JobDetail';
import Categories from './pages/categories/Categories';
import Subscriptions from './pages/subscriptions/Subscriptions';
import Reviews from './pages/reviews/Reviews';
import ReportList from './pages/reports/ReportList';
import DisputeList from './pages/disputes/DisputeList';
import AdvancedReports from './pages/reports/AdvancedReports';
import Analytics from './pages/analytics/Analytics';
import ContentManagement from './pages/content/ContentManagement';
import AuditLogs from './pages/audit/AuditLogs';
import Settings from './pages/settings/Settings';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<AdminLogin />} />
          <Route path="/" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="users" element={<UserList />} />
            <Route path="users/:id" element={<UserDetail />} />
            <Route path="verification" element={<MemberVerification />} />
            <Route path="jobs" element={<JobList />} />
            <Route path="jobs/:id" element={<JobDetail />} />
            <Route path="categories" element={<Categories />} />
            <Route path="subscriptions" element={<Subscriptions />} />
            <Route path="reviews" element={<Reviews />} />
            <Route path="reports" element={<ReportList />} />
            <Route path="disputes" element={<DisputeList />} />
            <Route path="advanced-reports" element={<AdvancedReports />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="content" element={<ContentManagement />} />
            <Route path="audit-logs" element={<AuditLogs />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
