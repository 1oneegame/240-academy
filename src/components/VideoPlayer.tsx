"use client";
import { useState, useEffect } from 'react';

interface VideoPlayerProps {
  youtubeUrl: string;
  title: string;
  className?: string;
}

export function VideoPlayer({ youtubeUrl, title, className = "" }: VideoPlayerProps) {
  const [videoId, setVideoId] = useState<string>('');

  useEffect(() => {
    const extractVideoId = (url: string): string => {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      return (match && match[2].length === 11) ? match[2] : '';
    };

    setVideoId(extractVideoId(youtubeUrl));
  }, [youtubeUrl]);

  if (!videoId) {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`}>
        <p className="text-gray-500">Неверная ссылка на видео</p>
      </div>
    );
  }

  return (
    <div className={`relative w-full ${className}`}>
      <div className="relative w-full h-0 pb-[56.25%] bg-gray-900 rounded-lg overflow-hidden shadow-lg">
        <iframe
          className="absolute top-0 left-0 w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}
