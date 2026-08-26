export type ContentStatus = 'draft' | 'published' | 'archived';

export interface ContentPage {
  id: string;
  title: string;
  slug: string;
  type: 'homepage' | 'faq' | 'announcement' | 'terms' | 'privacy' | 'help';
  status: ContentStatus;
  lastUpdated: string;
  updatedBy: string;
  content: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  published: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'maintenance' | 'update';
  status: 'active' | 'scheduled' | 'expired';
  startDate: string;
  endDate: string;
  createdBy: string;
}
