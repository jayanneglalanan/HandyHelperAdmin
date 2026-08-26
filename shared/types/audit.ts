export type AuditAction = 'create' | 'update' | 'delete' | 'login' | 'logout' | 'verify' | 'suspend' | 'activate' | 'approve' | 'reject' | 'flag' | 'resolve';

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: AuditAction;
  targetType: 'user' | 'job' | 'credential' | 'category' | 'subscription' | 'review' | 'report' | 'dispute' | 'content' | 'system';
  targetId: string;
  targetName: string;
  details: string;
  ipAddress: string;
  timestamp: string;
}
