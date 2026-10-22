import React from 'react';
import { FrameElement } from '../../types/diary';
import { Image as ImageIcon, Camera } from 'lucide-react';

interface FrameRendererProps {
  element: FrameElement;
  onReplaceImage?: () => void;
  onCaptionChange?: (newCaption: string) => void;
  isSelected?: boolean;
}

export const FrameRenderer: React.FC<FrameRendererProps> = ({
  element,
  onReplaceImage,
  onCaptionChange,
  isSelected
}) => {
  const { frameStyle, imageUrl, caption, isPlaceholder } = element;

  switch (frameStyle) {
    case 'polaroid':
      return (
        <div className="w-full h-full bg-white rounded-sm shadow-md p-3 pb-8 flex flex-col box-border border border-slate-200/60 transition-shadow">
          <div className="relative flex-1 bg-amber-50/40 rounded-sm overflow-hidden flex items-center justify-center border border-slate-100">
            {imageUrl && !isPlaceholder ? (
              <img
                src={imageUrl}
                alt="Framed memory"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover select-none pointer-events-none"
              />
            ) : (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onReplaceImage?.();
                }}
                className="flex flex-col items-center justify-center gap-1.5 text-slate-400 hover:text-amber-700 cursor-pointer p-4 text-center group"
              >
                <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-amber-100 flex items-center justify-center transition-colors">
                  <Camera className="w-5 h-5 text-slate-400 group-hover:text-amber-600" />
                </div>
                <span className="text-xs font-medium text-slate-500">Tap to insert photo</span>
              </div>
            )}
          </div>
          {/* Caption text area at bottom of polaroid */}
          <div className="mt-2 px-1 text-center">
            {isSelected ? (
              <input
                type="text"
                value={caption || ''}
                onChange={(e) => onCaptionChange?.(e.target.value)}
                placeholder="Write caption..."
                className="w-full text-center bg-transparent border-b border-dashed border-slate-300 focus:outline-none focus:border-amber-500 text-sm font-['Caveat'] text-slate-700"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <p className="text-sm font-['Caveat'] text-slate-700 truncate min-h-[1.25rem]">
                {caption || 'Add a memory caption...'}
              </p>
            )}
          </div>
        </div>
      );

    case 'washi-pinned':
      return (
        <div className="w-full h-full relative p-2 pt-5">
          {/* Top washi tape graphic */}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-24 h-6 bg-rose-200/85 shadow-sm transform -rotate-1 z-10 border-x-2 border-dashed border-rose-300/60" />
          <div className="w-full h-full bg-white rounded shadow-md p-2 flex flex-col border border-slate-200">
            <div className="relative flex-1 bg-stone-100 rounded overflow-hidden flex items-center justify-center">
              {imageUrl && !isPlaceholder ? (
                <img
                  src={imageUrl}
                  alt="Pinned photo"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover select-none pointer-events-none"
                />
              ) : (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    onReplaceImage?.();
                  }}
                  className="flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-rose-600 cursor-pointer p-4 text-center group"
                >
                  <ImageIcon className="w-6 h-6 text-slate-400 group-hover:text-rose-500" />
                  <span className="text-xs font-medium">Add Photo</span>
                </div>
              )}
            </div>
            {caption && (
              <p className="mt-1.5 text-xs text-center font-['Patrick_Hand'] text-slate-600 truncate">
                {caption}
              </p>
            )}
          </div>
        </div>
      );

    case 'filmstrip':
      return (
        <div className="w-full h-full bg-slate-900 rounded p-3 flex flex-col shadow-lg border border-slate-800">
          {/* Film perforations top */}
          <div className="flex justify-between items-center mb-1.5 px-1">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-2.5 h-2 bg-white/70 rounded-xs" />
            ))}
          </div>
          {/* Center photo */}
          <div className="relative flex-1 bg-slate-800 rounded-xs overflow-hidden flex items-center justify-center">
            {imageUrl && !isPlaceholder ? (
              <img
                src={imageUrl}
                alt="Film still"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover select-none pointer-events-none"
              />
            ) : (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onReplaceImage?.();
                }}
                className="flex flex-col items-center justify-center text-slate-400 hover:text-white cursor-pointer"
              >
                <Camera className="w-6 h-6 mb-1" />
                <span className="text-xs">Film Frame</span>
              </div>
            )}
          </div>
          {/* Film perforations bottom */}
          <div className="flex justify-between items-center mt-1.5 px-1">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-2.5 h-2 bg-white/70 rounded-xs" />
            ))}
          </div>
        </div>
      );

    case 'gold-scallop':
      return (
        <div className="w-full h-full p-3 bg-gradient-to-tr from-amber-200 via-amber-100 to-amber-300 rounded shadow-lg border-2 border-amber-400 flex flex-col">
          <div className="w-full h-full bg-white p-1 rounded-sm border border-amber-300/80 flex flex-col overflow-hidden">
            <div className="relative flex-1 bg-amber-50/50 flex items-center justify-center overflow-hidden">
              {imageUrl && !isPlaceholder ? (
                <img
                  src={imageUrl}
                  alt="Scalloped frame"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover select-none pointer-events-none"
                />
              ) : (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    onReplaceImage?.();
                  }}
                  className="flex flex-col items-center justify-center text-amber-700/80 hover:text-amber-900 cursor-pointer"
                >
                  <Camera className="w-6 h-6 mb-1" />
                  <span className="text-xs font-serif">Insert Photo</span>
                </div>
              )}
            </div>
            {caption && (
              <p className="mt-1 text-xs text-center font-['Playfair_Display'] italic text-amber-900 truncate">
                {caption}
              </p>
            )}
          </div>
        </div>
      );

    case 'vintage-postage':
    default:
      return (
        <div className="w-full h-full p-2 bg-[#FAF7F0] border-2 border-dashed border-amber-800/40 rounded shadow-md flex flex-col">
          <div className="relative flex-1 bg-amber-100/30 border border-amber-200 rounded-sm overflow-hidden flex items-center justify-center">
            {imageUrl && !isPlaceholder ? (
              <img
                src={imageUrl}
                alt="Postage photo"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover select-none pointer-events-none"
              />
            ) : (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onReplaceImage?.();
                }}
                className="flex flex-col items-center justify-center text-amber-800/70 hover:text-amber-900 cursor-pointer"
              >
                <Camera className="w-6 h-6 mb-1" />
                <span className="text-xs font-serif">Vintage Photo</span>
              </div>
            )}
          </div>
          {caption && (
            <p className="mt-1 text-xs text-center font-serif text-amber-900/80 truncate">
              {caption}
            </p>
          )}
        </div>
      );
  }
};
