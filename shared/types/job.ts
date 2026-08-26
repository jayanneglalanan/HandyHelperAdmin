export type JobStatus = 'pending' | 'open' | 'accepted' | 'in_progress' | 'completed' | 'cancelled' | 'disputed';

export interface Job {
  id: string;
  title: string;
  description: string;
  clientId: string;
  clientName: string;
  category: string;
  location: string;
  budget: number;
  status: JobStatus;
  postedDate: string;
  acceptedDate?: string;
  completedDate?: string;
  assignedMemberId?: string;
  assignedMemberName?: string;
  preferredSchedule: string;
  images: string[];
  urgent: boolean;
}
