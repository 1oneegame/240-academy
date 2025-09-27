export interface Resource {
  _id?: string;
  title: string;
  description: string;
  type: 'document' | 'video' | 'link' | 'file';
  url: string;
  fileName?: string;
  fileSize?: number;
  category: string;
  isPublished: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ResourceCreateData {
  title: string;
  description: string;
  type: 'document' | 'video' | 'link' | 'file';
  url: string;
  category: string;
  isPublished: boolean;
}

export interface ResourceUpdateData {
  title?: string;
  description?: string;
  type?: 'document' | 'video' | 'link' | 'file';
  url?: string;
  fileName?: string;
  fileSize?: number;
  category?: string;
  isPublished?: boolean;
}
