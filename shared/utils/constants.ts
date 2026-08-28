export const APP_NAME = 'HandyHelper Admin';
export const BRAND_NAME = 'HandyHelper';
export const APP_VERSION = '1.0.0';

export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/',
  USERS: '/users',
  USER_DETAIL: '/users/:id',
  VERIFICATION: '/verification',
  JOBS: '/jobs',
  JOB_DETAIL: '/jobs/:id',
  CATEGORIES: '/categories',
  SUBSCRIPTIONS: '/subscriptions',
  REVIEWS: '/reviews',
  REPORTS: '/reports',
  DISPUTES: '/disputes',
  SETTINGS: '/settings',
} as const;

export const USER_ROLES = {
  ADMIN: 'admin',
  CLIENT: 'client',
  MEMBER: 'member',
} as const;

export const JOB_STATUSES = {
  PENDING: 'pending',
  OPEN: 'open',
  ACCEPTED: 'accepted',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  DISPUTED: 'disputed',
} as const;

export const ITEMS_PER_PAGE = 10;
