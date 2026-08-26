export type ReportType = 'user' | 'job' | 'review' | 'message' | 'suspicious_activity';
export type ReportStatus = 'pending' | 'investigating' | 'resolved' | 'dismissed';

export interface Report {
  id: string;
  reporterId: string;
  reporterName: string;
  reportedUserId: string;
  reportedUserName: string;
  type: ReportType;
  reason: string;
  description: string;
  relatedJobId?: string;
  relatedJobTitle?: string;
  status: ReportStatus;
  filedDate: string;
  resolvedDate?: string;
  resolution?: string;
}

export type DisputeStatus = 'pending' | 'investigating' | 'resolved' | 'dismissed';

export interface Dispute {
  id: string;
  clientId: string;
  clientName: string;
  memberId: string;
  memberName: string;
  jobId: string;
  jobTitle: string;
  reason: string;
  description: string;
  evidence: string[];
  status: DisputeStatus;
  filedDate: string;
  resolvedDate?: string;
  resolution?: string;
}
