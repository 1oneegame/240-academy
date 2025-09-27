import mongoose from 'mongoose';

export interface IResource extends mongoose.Document {
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

const ResourceSchema = new mongoose.Schema<IResource>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['document', 'video', 'link', 'file']
  },
  url: {
    type: String,
    required: true,
    trim: true
  },
  fileName: {
    type: String,
    trim: true
  },
  fileSize: {
    type: Number,
    min: 0
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: String,
    required: true,
    index: true
  }
}, {
  timestamps: true
});

ResourceSchema.index({ category: 1, isPublished: 1 });
ResourceSchema.index({ createdBy: 1, createdAt: -1 });

export default mongoose.models.Resource || mongoose.model<IResource>('Resource', ResourceSchema);
