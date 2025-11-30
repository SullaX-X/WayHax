export type UserRole = 'participant' | 'organizer' | 'admin';
export type ContestType = 'olympiad' | 'creative' | 'sport' | 'hackathon';
export type ContestStatus = 'open' | 'closed' | 'judging' | 'completed';
export type ApplicationStatus = 'pending' | 'approved' | 'rejected' | 'winner' | 'participant';
export type ToastType = 'success' | 'error' | 'info';
export type ThemeColor = 'blue' | 'green' | 'purple' | 'orange';
export type Language = 'ru' | 'en';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  group?: string;
  avatar?: string;
  phone?: string;
  bio?: string;
}

export interface Contest {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  type: ContestType;
  startDate: string;
  endDate: string;
  organizerId: string;
  organizerName: string;
  image: string;
  status: ContestStatus;
  participantLimit?: number;
  files?: Array<{ name: string; size: string }>;
  resultsPublished: boolean;
}

export interface Application {
  id: string;
  contestId: string;
  userId: string;
  applicantName: string;
  group: string;
  email: string;
  status: ApplicationStatus;
  submissionDate: string;
  score?: number;
}

export interface ThemeSettings {
  color: ThemeColor;
  fontSize: number; // multiplier 14, 16, 18
  highContrast: boolean;
  hideImages: boolean;
  darkMode: boolean;
}