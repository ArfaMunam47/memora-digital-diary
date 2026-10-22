import React, { useState } from 'react';
import { DiaryBook, DiaryPage } from '../../types/diary';
import {
  Plus,
  Copy,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  AlertTriangle
} from 'lucide-react';

interface PageNavigationProps {
  book: DiaryBook;
  activePageIndex: number;
  onSwitchPage: (index: number) => void;
  onAddPage: (templateId?: string) => void;
  onDuplicatePage: (index?: number) => void;
  onDeletePage: (index?: number) => void;
  onReorderPages: (fromIndex: number, toIndex: number) => void;
}

export const PageNavigation: React.FC<PageNavigationProps> = ({
  book,
  activePageIndex,
  onSwitchPage,
  onAddPage,
  onDuplicatePage,
  onDeletePage,
  onReorderPages,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [pageToDelete, setPageToDelete] = useState<number | null>(null);

  const confirmDelete = (idx: number) => {
    setPageToDelete(idx);
    setShowDeleteConfirm(true);
  };

  const handleExecuteDelete = () => {
    if (pageToDelete !== null) {
      onDeletePage(pageToDelete);
    }
    setShowDeleteConfirm(false);
    setPageToDelete(null);
  };

  return (
    <>
      <footer className="h-20 md:h-24 bg-white/95 backdrop-blur-sm border-t border-stone-200 px-3 md:px-6 flex items-center justify-between gap-3 shrink-0 z-20">
        {/* Left: Previous / Next & Page Counter */}
        <div className="flex items-center gap-1.5 md:gap-2">
          <button
            onClick={() => onSwitchPage(Math.max(0, activePageIndex - 1))}
            disabled={activePageIndex === 0}
            className={`p-1.5 rounded-md border border-stone-200 transition-colors ${
              activePageIndex === 0
                ? 'opacity-40 cursor-not-allowed text-stone-300'
                : 'text-stone-700 hover:bg-stone-50 cursor-pointer'
            }`}
            title="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-xs font-medium text-stone-700 whitespace-nowrap px-1">
            Page <span className="font-semibold text-stone-900">{activePageIndex + 1}</span> of{' '}
            {book.pages.length}
          </span>

          <button
            onClick={() => onSwitchPage(Math.min(book.pages.length - 1, activePageIndex + 1))}
            disabled={activePageIndex === book.pages.length - 1}
            className={`p-1.5 rounded-md border border-stone-200 transition-colors ${
              activePageIndex === book.pages.length - 1
                ? 'opacity-40 cursor-not-allowed text-stone-300'
                : 'text-stone-700 hover:bg-stone-50 cursor-pointer'
            }`}
            title="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Center: Scrollable Thumbnails Strip */}
        <div className="flex-1 flex items-center justify-center gap-2 overflow-x-auto py-1 max-w-2xl px-2">
          {book.pages.map((page, idx) => {
            const isActive = idx === activePageIndex;

            return (
              <div
                key={page.id}
                onClick={() => onSwitchPage(idx)}
                className={`group relative shrink-0 w-12 h-16 md:w-14 md:h-18 rounded border-2 cursor-pointer transition-all flex flex-col justify-between p-1 shadow-2xs ${
                  isActive
                    ? 'border-amber-600 ring-2 ring-amber-500/30 scale-105 bg-white'
                    : 'border-stone-200 hover:border-amber-300 bg-stone-50'
                }`}
                style={{ backgroundColor: page.background.color || '#FFFDF9' }}
              >
                {/* Mini content representation */}
                <div className="flex-1 overflow-hidden opacity-60 flex flex-col gap-0.5 pointer-events-none">
                  <div className="h-1 w-3/4 bg-stone-400 rounded-full" />
                  <div className="h-1 w-1/2 bg-stone-300 rounded-full" />
                  {page.elements.length > 2 && (
                    <div className="mt-auto h-3 w-3 rounded-full bg-amber-400/50 self-end" />
                  )}
                </div>

                <div className="flex items-center justify-between text-[9px] font-mono font-medium text-stone-600">
                  <span>{idx + 1}</span>
                  <span className="text-[8px] opacity-70 truncate max-w-[28px]">
                    {page.elements.length} obj
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Page Management Controls */}
        <div className="flex items-center gap-1 md:gap-2">
          {/* Reorder Left */}
          <button
            onClick={() => onReorderPages(activePageIndex, activePageIndex - 1)}
            disabled={activePageIndex === 0}
            title="Move Page Earlier"
            className="hidden sm:flex p-1.5 rounded-md border border-stone-200 text-stone-600 hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>

          {/* Reorder Right */}
          <button
            onClick={() => onReorderPages(activePageIndex, activePageIndex + 1)}
            disabled={activePageIndex === book.pages.length - 1}
            title="Move Page Later"
            className="hidden sm:flex p-1.5 rounded-md border border-stone-200 text-stone-600 hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Duplicate Page */}
          <button
            onClick={() => onDuplicatePage(activePageIndex)}
            title="Duplicate Page"
            className="p-1.5 md:px-2.5 md:py-1.5 rounded-md border border-stone-200 text-stone-700 hover:bg-stone-50 flex items-center gap-1 text-xs font-medium transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Duplicate</span>
          </button>

          {/* Delete Page */}
          <button
            onClick={() => confirmDelete(activePageIndex)}
            disabled={book.pages.length <= 1}
            title={book.pages.length <= 1 ? 'Cannot delete the only page' : 'Delete Page'}
            className="p-1.5 md:px-2.5 md:py-1.5 rounded-md border border-stone-200 text-rose-600 hover:bg-rose-50 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 text-xs font-medium transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Delete</span>
          </button>

          {/* Add New Page Button */}
          <button
            onClick={() => onAddPage()}
            className="px-2.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-md flex items-center gap-1 text-xs font-medium transition-colors shadow-xs"
            title="Add New Blank Page"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Page</span>
          </button>
        </div>
      </footer>

      {/* Confirmation Modal for Page Deletion */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-5 space-y-4 border border-stone-200">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-900">Delete Page {(pageToDelete ?? 0) + 1}?</h4>
                <p className="text-xs text-stone-500">This action will remove all elements on this page.</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3 py-1.5 rounded-md border border-stone-200 text-xs font-medium text-stone-700 hover:bg-stone-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteDelete}
                className="px-3 py-1.5 rounded-md bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium transition-colors shadow-xs"
              >
                Delete Page
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
