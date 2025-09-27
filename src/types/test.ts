export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  points: number;
}

export interface Test {
  _id?: string;
  title: string;
  description: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  questions: Question[];
  timeLimit: number;
  passingScore: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface TestCreateData {
  title: string;
  description: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  questions: Omit<Question, 'id'>[];
  timeLimit: number;
  passingScore: number;
  isPublished: boolean;
}

export interface TestResult {
  _id?: string;
  testId: string;
  userId: string;
  userName: string;
  userEmail: string;
  mode: 'exam' | 'training';
  score: number;
  totalQuestions: number;
  percentage: number;
  answers: (number | null)[];
  timeSpent: number;
  completedAt: Date;
  createdAt: Date;
}