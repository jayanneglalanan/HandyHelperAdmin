export type UserRole = 'admin' | 'client' | 'member';
export type UserStatus = 'active' | 'suspended' | 'deactivated';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  profilePicture: string;
  dateJoined: string;
  lastActive: string;
}

export interface Client extends User {
  role: 'client';
  jobsPosted: number;
  jobsCompleted: number;
  averageRating: number;
}

export interface Member extends User {
  role: 'member';
  skills: string[];
  verificationStatus: VerificationStatus;
  subscription: SubscriptionTier;
  jobsCompleted: number;
  averageRating: number;
  totalReviews: number;
  credentials: Credential[];
  yearsExperience: number;
  bio: string;
}

export type VerificationStatus = 'pending' | 'verified' | 'rejected' | 'needs_update';
export type SubscriptionTier = 'free' | 'basic' | 'professional' | 'premium';
