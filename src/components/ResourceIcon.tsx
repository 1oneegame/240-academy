import { FileText, Video, Link as LinkIcon, Download } from 'lucide-react';

interface ResourceIconProps {
  type: 'document' | 'video' | 'link' | 'file';
  className?: string;
}

export function ResourceIcon({ type, className = "w-6 h-6" }: ResourceIconProps) {
  switch (type) {
    case 'document':
      return <FileText className={className} />;
    case 'video':
      return <Video className={className} />;
    case 'link':
      return <LinkIcon className={className} />;
    case 'file':
      return <Download className={className} />;
    default:
      return <FileText className={className} />;
  }
}
