"use client";

import { useState, useRef, useEffect } from 'react';
import { Download, Eye, EyeOff, ZoomIn, ZoomOut, RotateCw, Maximize, Minimize } from 'lucide-react';

interface PDFViewerProps {
  pdfUrl: string;
  title: string;
  onClose?: () => void;
}

export function PDFViewer({ pdfUrl, title, onClose }: PDFViewerProps) {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = title;
    link.click();
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${isFullscreen ? 'p-0' : 'p-4'}`}>
      <div className={`bg-white rounded-2xl shadow-2xl ${isFullscreen ? 'w-full h-full rounded-none' : 'w-11/12 h-5/6 max-w-6xl'}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 truncate">{title}</h2>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowControls(!showControls)}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {showControls ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
            
            {showControls && (
              <>
                <button
                  onClick={handleZoomOut}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ZoomOut className="w-5 h-5" />
                </button>
                
                <span className="text-sm text-gray-600 min-w-16 text-center">
                  {Math.round(scale * 100)}%
                </span>
                
                <button
                  onClick={handleZoomIn}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ZoomIn className="w-5 h-5" />
                </button>
                
                <button
                  onClick={handleRotate}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <RotateCw className="w-5 h-5" />
                </button>
                
                <button
                  onClick={handleFullscreen}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                </button>
                
                <button
                  onClick={handleDownload}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Download className="w-5 h-5" />
                </button>
              </>
            )}
            
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ✕
              </button>
            )}
          </div>
        </div>
        
        <div className="relative overflow-hidden" style={{ height: isFullscreen ? 'calc(100vh - 80px)' : 'calc(80vh - 80px)' }}>
          <iframe
            ref={iframeRef}
            src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1`}
            className="w-full h-full border-0"
            style={{
              transform: `scale(${scale}) rotate(${rotation}deg)`,
              transformOrigin: 'top left',
              width: `${100 / scale}%`,
              height: `${100 / scale}%`
            }}
            title={title}
          />
        </div>
      </div>
    </div>
  );
}
