export interface User {
  _id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
  testResultsCount?: number;
  completedCoursesCount?: number;
}

export interface UserStats {
  total: number;
  active: number;
  students: number;
  admins: number;
  newThisMonth: number;
}
