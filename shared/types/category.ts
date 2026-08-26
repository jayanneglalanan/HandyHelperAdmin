export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: 'active' | 'inactive';
  memberCount: number;
  jobCount: number;
}
