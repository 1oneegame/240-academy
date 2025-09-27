import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  email: string;
  name: string;
  role: 'student' | 'admin';
  isActive: boolean;
  createdAt: Date;
  lastLoginAt?: Date;
  testResults?: string[];
  completedCourses?: string[];
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLoginAt: {
    type: Date
  },
  testResults: [{
    type: Schema.Types.ObjectId,
    ref: 'TestResult'
  }],
  completedCourses: [{
    type: Schema.Types.ObjectId,
    ref: 'VideoCourse'
  }]
}, {
  timestamps: true
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
