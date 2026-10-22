import React from 'react';
import { ImageElement } from '../../types/diary';
import { Image as ImageIcon, Upload } from 'lucide-react';

interface ImageRendererProps {
  element: ImageElement;
  onUploadClick?: () => void;
}

export const ImageRenderer: React.FC<ImageRendererProps> = ({ element, onUploadClick }) => {
  const { url, objectFit, borderRadius, borderWidth, borderColor, shadow, isPlaceholder, filter } = element;

  const filterString = filter
    ? `brightness(${filter.brightness}%) contrast(${filter.contrast}%) sepia(${filter.sepia}%) grayscale(${filter.grayscale}%) blur(${filter.blur}px)`
    : undefined;

  if (isPlaceholder || !url) {
    return (
      <div
        onClick={(e) => {
          e.stopPropagation();
          onUploadClick?.();
        }}
        className="w-full h-full bg-slate-100 hover:bg-slate-200/80 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-colors group select-none"
        style={{
          borderRadius: `${borderRadius || 8}px`,
        }}
      >
        <div className="w-12 h-12 rounded-full bg-white shadow-xs group-hover:scale-105 flex items-center justify-center text-slate-400 group-hover:text-amber-600 transition-all mb-2">
          <Upload className="w-6 h-6" />
        </div>
        <span className="text-xs font-semibold text-slate-700">Photo Slot</span>
        <span className="text-[11px] text-slate-400 mt-0.5">Click or tap to upload photo</span>
      </div>
    );
  }

  return (
    <div
      className={`w-full h-full overflow-hidden relative select-none ${
        shadow ? 'shadow-lg' : ''
      }`}
      style={{
        borderRadius: `${borderRadius || 0}px`,
        border: borderWidth ? `${borderWidth}px solid ${borderColor || '#ffffff'}` : undefined,
      }}
    >
      <img
        src={url}
        alt="Diary moment"
        referrerPolicy="no-referrer"
        className="w-full h-full pointer-events-none transition-all duration-150"
        style={{
          objectFit: objectFit || 'cover',
          filter: filterString,
        }}
      />
    </div>
  );
};
