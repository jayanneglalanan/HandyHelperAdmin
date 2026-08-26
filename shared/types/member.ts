export type CredentialStatus = 'pending' | 'approved' | 'rejected' | 'expired';

export interface Credential {
  id: string;
  memberId: string;
  memberName: string;
  type: CredentialType;
  title: string;
  description: string;
  documentUrl: string;
  status: CredentialStatus;
  submittedDate: string;
  reviewedDate?: string;
  expiryDate?: string;
  reviewerNotes?: string;
}

export type CredentialType = 'certificate' | 'license' | 'training' | 'experience' | 'id_document';
