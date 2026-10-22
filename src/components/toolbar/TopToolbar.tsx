import React, { useState } from 'react';
import {
  Undo2,
  Redo2,
  Eye,
  EyeOff,
  Download,
  BookOpen,
  ZoomIn,
  ZoomOut,
  Maximize,
  CheckCircle2,
  Clock,
  Sparkles,
  BookMarked
} from 'lucide-react';

interface TopToolbarProps {
  bookTitle: string;
  onUpdateBookTitle: (title: string) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  saveStatus: 'saved' | 'saving' | 'unsaved';
  isPreviewMode: boolean;
  onTogglePreview: () => void;
  zoom: number;
  onZoomChange: (newZoom: number) => void;
  onExport: () => void;
}

export const TopToolbar: React.FC<TopToolbarProps> = ({
  bookTitle,
  onUpdateBookTitle,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  saveStatus,
  isPreviewMode,
  onTogglePreview,
  zoom,
  onZoomChange,
  onExport,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(bookTitle);

  const handleTitleSubmit = () => {
    setIsEditingTitle(false);
    if (titleInput.trim()) {
      onUpdateBookTitle(titleInput.trim());
    }
  };

  return (
    <header className="h-14 bg-white border-b border-stone-200 px-3 md:px-6 flex items-center justify-between gap-2 md:gap-4 shrink-0 shadow-2xs z-30">
      {/* Zone 1: Brand & Book Title */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center shadow-xs">
            <BookMarked className="w-4 h-4" />
          </div>
          <span className="font-serif font-bold text-stone-900 text-base hidden sm:inline tracking-tight">
            Keepsake
          </span>
        </div>

        <div className="h-4 w-px bg-stone-200 hidden sm:block" />

        {/* Editable Title */}
        <div className="min-w-0">
          {isEditingTitle ? (
            <input
              type="text"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleTitleSubmit();
                if (e.key === 'Escape') setIsEditingTitle(false);
              }}
              autoFocus
              className="text-xs md:text-sm font-medium text-stone-800 border-b border-amber-600 focus:outline-none bg-transparent py-0.5 px-1 w-40 md:w-56"
            />
          ) : (
            <button
              onClick={() => {
                setTitleInput(bookTitle);
                setIsEditingTitle(true);
              }}
              title="Click to rename journal"
              className="text-xs md:text-sm font-medium text-stone-700 hover:text-amber-800 hover:bg-stone-50 px-2 py-1 rounded transition-colors truncate max-w-[140px] md:max-w-[240px] block text-left"
            >
              {bookTitle}
            </button>
          )}
        </div>
      </div>

      {/* Zone 2: Central Undo / Redo & Save status */}
      <div className="flex items-center gap-1 md:gap-2">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
          className={`p-1.5 md:p-2 rounded-md transition-colors ${
            canUndo
              ? 'text-stone-700 hover:bg-stone-100 hover:text-stone-900 cursor-pointer'
              : 'text-stone-300 cursor-not-allowed'
          }`}
        >
          <Undo2 className="w-4 h-4" />
        </button>

        <button
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo (Ctrl+Y)"
          className={`p-1.5 md:p-2 rounded-md transition-colors ${
            canRedo
              ? 'text-stone-700 hover:bg-stone-100 hover:text-stone-900 cursor-pointer'
              : 'text-stone-300 cursor-not-allowed'
          }`}
        >
          <Redo2 className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-stone-200 mx-1 hidden sm:block" />

        {/* Save Status (Text without pill badges as per anti-slop rules) */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-stone-500 font-medium whitespace-nowrap">
          {saveStatus === 'saved' && (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Saved</span>
            </>
          )}
          {saveStatus === 'saving' && (
            <>
              <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin" />
              <span>Saving...</span>
            </>
          )}
          {saveStatus === 'unsaved' && (
            <>
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Unsaved changes</span>
            </>
          )}
        </div>
      </div>

      {/* Zone 3: Zoom, Preview & Export */}
      <div className="flex items-center gap-1 md:gap-2 shrink-0">
        {/* Zoom Controls */}
        <div className="hidden md:flex items-center gap-1 bg-stone-100 p-0.5 rounded-lg border border-stone-200">
          <button
            onClick={() => onZoomChange(Math.max(0.5, zoom - 0.1))}
            title="Zoom Out"
            className="p-1 hover:bg-white text-stone-600 hover:text-stone-900 rounded transition-colors"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] font-mono font-medium text-stone-700 px-1 w-10 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => onZoomChange(Math.min(1.4, zoom + 0.1))}
            title="Zoom In"
            className="p-1 hover:bg-white text-stone-600 hover:text-stone-900 rounded transition-colors"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onZoomChange(0.85)}
            title="Fit Page"
            className="p-1 hover:bg-white text-stone-600 hover:text-stone-900 rounded transition-colors text-[10px] font-medium px-1"
          >
            Fit
          </button>
        </div>

        {/* Preview Button */}
        <button
          onClick={onTogglePreview}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            isPreviewMode
              ? 'bg-amber-100 text-amber-900 font-semibold'
              : 'text-stone-700 hover:bg-stone-100'
          }`}
          title={isPreviewMode ? 'Exit Preview' : 'Preview Diary Page'}
        >
          {isPreviewMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          <span className="hidden sm:inline">{isPreviewMode ? 'Exit Preview' : 'Preview'}</span>
        </button>

        {/* Future Export Action */}
        <button
          onClick={onExport}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-medium transition-colors shadow-xs"
          title="Export Diary Book Data"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export</span>
        </button>
      </div>
    </header>
  );
};
