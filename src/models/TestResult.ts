import mongoose from 'mongoose';

export interface ITestResult extends mongoose.Document {
  userId: string;
  testId: string;
  testTitle: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  answers: (number | null)[];
  mode: 'exam' | 'training';
  timeSpent: number;
  completedAt: Date;
}

const TestResultSchema = new mongoose.Schema<ITestResult>({
  userId: {
    type: String,
    required: true,
    index: true
  },
  testId: {
    type: String,
    required: true,
    index: true
  },
  testTitle: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true,
    min: 0
  },
  totalQuestions: {
    type: Number,
    required: true,
    min: 1
  },
  percentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  answers: {
    type: [Number],
    required: true
  },
  mode: {
    type: String,
    required: true,
    enum: ['exam', 'training']
  },
  timeSpent: {
    type: Number,
    required: true,
    min: 0
  },
  completedAt: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

TestResultSchema.index({ userId: 1, completedAt: -1 });
TestResultSchema.index({ testId: 1, userId: 1 });

export default mongoose.models.TestResult || mongoose.model<ITestResult>('TestResult', TestResultSchema);
