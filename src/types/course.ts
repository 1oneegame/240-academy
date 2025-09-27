export interface Video {
  id: string;
  title: string;
  description: string;
  url: string;
  duration: number;
  order: number;
}

export interface Course {
  _id?: string;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  videos: Video[];
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface CourseCreateData {
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  videos: Omit<Video, 'id'>[];
  isPublished: boolean;
}
