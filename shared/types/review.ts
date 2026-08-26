export interface Review {
  id: string;
  reviewerId: string;
  reviewerName: string;
  reviewedMemberId: string;
  reviewedMemberName: string;
  jobId: string;
  jobTitle: string;
  rating: number;
  comment: string;
  date: string;
  status: 'visible' | 'hidden' | 'flagged';
}
