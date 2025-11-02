import React, { useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from './icons';
import { Photo, Video } from '../types';

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  item: Photo | Video;
  hasPrev: boolean;
  hasNext: boolean;
}

const Lightbox: React.FC<LightboxProps> = ({ isOpen, onClose, onPrev, onNext, item, hasPrev, hasNext }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && hasPrev) onPrev();
      if (e.key === 'ArrowRight' && hasNext) onNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onPrev, onNext, hasPrev, hasNext]);
  
  if (!isOpen || !item) return null;

  const isPhoto = 'src' in item;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 z-50 flex justify-center items-center backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full h-full flex items-center justify-center p-4 md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col items-center justify-center">
            {isPhoto ? (
                <img src={item.src} alt={item.caption} className="block max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl" />
            ) : (
                <div className="aspect-video w-full">
                    <iframe src={item.url} title={item.caption} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full rounded-lg shadow-lg"></iframe>
                </div>
            )}
            
            {item.caption && (
                <div className="absolute -bottom-2 left-0 right-0 text-white text-center p-4">
                    <p className="font-sans bg-black/50 rounded-full inline-block px-4 py-1">{item.caption}</p>
                </div>
            )}
        </div>

        <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-transform transform hover:scale-125"
            aria-label="Close lightbox"
        >
          <XIcon className="w-8 h-8" />
        </button>

        {hasPrev && (
            <button 
                onClick={onPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 text-white/80 hover:text-white hover:bg-black/60 p-2 rounded-full transition-transform transform hover:scale-110"
                aria-label="Previous image"
            >
                <ChevronLeftIcon className="w-8 h-8" />
            </button>
        )}

        {hasNext && (
            <button
                onClick={onNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 text-white/80 hover:text-white hover:bg-black/60 p-2 rounded-full transition-transform transform hover:scale-110"
                aria-label="Next image"
            >
                <ChevronRightIcon className="w-8 h-8" />
            </button>
        )}

      </div>
    </div>
  );
};

export default Lightbox;