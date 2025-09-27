export interface VideoLesson {
  id: string;
  title: string;
  description: string;
  youtubeUrl: string;
  theory: string;
  order: number;
  duration: number;
  isCompleted?: boolean;
}

export interface VideoCourse {
  _id?: string;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  lessons: VideoLesson[];
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  estimatedDuration: number;
}

export interface VideoCourseCreateData {
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  lessons: Omit<VideoLesson, 'id'>[];
  isPublished: boolean;
  estimatedDuration: number;
}

export interface VideoCourseUpdateData {
  title?: string;
  description?: string;
  thumbnail?: string;
  category?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  lessons?: Omit<VideoLesson, 'id'>[];
  isPublished?: boolean;
  estimatedDuration?: number;
}
