export type NotificationType = 'registration' | 'credential' | 'job' | 'report' | 'dispute' | 'subscription' | 'system';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  date: string;
  read: boolean;
  relatedId?: string;
}
