import React, { useState, useRef, useEffect } from 'react';
import { useDiaryStore } from './hooks/useDiaryStore';
import { TopToolbar } from './components/toolbar/TopToolbar';
import { Sidebar, SidebarTab } from './components/sidebar/Sidebar';
import { DiaryCanvas } from './components/canvas/DiaryCanvas';
import { PropertiesPanel } from './components/panels/PropertiesPanel';
import { PageNavigation } from './components/navigation/PageNavigation';
import {
  LayoutTemplate,
  UploadCloud,
  Shapes,
  Type,
  Bookmark,
  Sliders,
  X,
  ChevronDown,
  Download,
  Check,
  BookOpen
} from 'lucide-react';

export default function App() {
  const {
    book,
    activePageIndex,
    activePage,
    selectedElementId,
    selectedElement,
    canUndo,
    canRedo,
    saveStatus,
    undo,
    redo,
    selectElement,
    updateElement,
    addElement,
    deleteElement,
    duplicateElement,
    reorderElement,
    updatePageBackground,
    updatePageTitle,
    addPage,
    duplicatePage,
    deletePage,
    switchPage,
    reorderPages,
    applyTemplateToCurrentPage,
    updateBookTitle,
  } = useDiaryStore();

  // Sidebar state
  const [activeTab, setActiveTab] = useState<SidebarTab>('templates');
  const [zoom, setZoom] = useState<number>(0.85);
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);

  // Mobile state
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false);
  const [mobilePropertiesOpen, setMobilePropertiesOpen] = useState<boolean>(false);

  // Uploaded images gallery state (persisted in localStorage)
  const [uploadedImages, setUploadedImages] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('keepsake_uploaded_images');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Export Modal state
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [exportCopied, setExportCopied] = useState<boolean>(false);

  // Target element ID for direct file replacement (e.g. Polaroid frame photo)
  const [targetImageElementId, setTargetImageElementId] = useState<string | null>(null);
  const directFileInputRef = useRef<HTMLInputElement>(null);

  // Auto-fit zoom on window resize
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setZoom(0.55); // mobile fit
      } else if (width < 1024) {
        setZoom(0.7); // tablet fit
      } else {
        setZoom(0.85); // desktop fit
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // When an element is selected on mobile, allow quick access to properties
  useEffect(() => {
    if (selectedElementId && window.innerWidth < 1024) {
      setMobilePropertiesOpen(true);
    }
  }, [selectedElementId]);

  const handleUploadImage = (dataUrl: string) => {
    const nextImages = [dataUrl, ...uploadedImages.slice(0, 19)];
    setUploadedImages(nextImages);
    try {
      localStorage.setItem('keepsake_uploaded_images', JSON.stringify(nextImages));
    } catch (e) {
      console.warn('Storage quota reached for uploaded images', e);
    }
  };

  const handleDeleteUploadedImage = (index: number) => {
    const nextImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(nextImages);
    try {
      localStorage.setItem('keepsake_uploaded_images', JSON.stringify(nextImages));
    } catch (e) {
      console.warn('Could not update uploaded images storage', e);
    }
  };

  // Direct image replacement trigger (for frames or existing image objects)
  const handleRequestImageUpload = (elementId?: string) => {
    if (elementId) {
      setTargetImageElementId(elementId);
    } else if (selectedElementId) {
      setTargetImageElementId(selectedElementId);
    }
    directFileInputRef.current?.click();
  };

  const handleDirectFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        handleUploadImage(dataUrl);

        if (targetImageElementId) {
          const targetEl = activePage.elements.find((el) => el.id === targetImageElementId);
          if (targetEl?.type === 'frame') {
            updateElement(targetImageElementId, { imageUrl: dataUrl, isPlaceholder: false });
          } else if (targetEl?.type === 'image') {
            updateElement(targetImageElementId, { url: dataUrl, isPlaceholder: false });
          }
        }
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
    setTargetImageElementId(null);
  };

  // Export Book Data
  const handleExport = () => {
    setShowExportModal(true);
  };

  const handleDownloadJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(book, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${book.title.replace(/\s+/g, '_').toLowerCase()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(book, null, 2));
    setExportCopied(true);
    setTimeout(() => setExportCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-stone-100 font-sans antialiased text-stone-900 select-none">
      {/* Hidden file input for direct photo slot insertion */}
      <input
        ref={directFileInputRef}
        type="file"
        accept="image/*"
        onChange={handleDirectFileChange}
        className="hidden"
      />

      {/* Top Toolbar */}
      <TopToolbar
        bookTitle={book.title}
        onUpdateBookTitle={updateBookTitle}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={undo}
        onRedo={redo}
        saveStatus={saveStatus}
        isPreviewMode={isPreviewMode}
        onTogglePreview={() => setIsPreviewMode(!isPreviewMode)}
        zoom={zoom}
        onZoomChange={setZoom}
        onExport={handleExport}
      />

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Desktop Left Sidebar */}
        {!isPreviewMode && (
          <aside className="hidden lg:block h-full shrink-0 z-10">
            <Sidebar
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onApplyTemplate={applyTemplateToCurrentPage}
              onAddElement={addElement}
              onUpdateBackground={updatePageBackground}
              selectedElementId={selectedElementId}
              uploadedImages={uploadedImages}
              onUploadImage={handleUploadImage}
              onDeleteUploadedImage={handleDeleteUploadedImage}
              currentBgColor={activePage.background.color}
              currentPattern={activePage.background.pattern}
            />
          </aside>
        )}

        {/* Central Canvas Viewport */}
        <main
          className="flex-1 h-full overflow-auto bg-[#EDEAE3] flex flex-col relative items-center justify-start p-2 md:p-6"
          onClick={() => {
            if (selectedElementId) selectElement(null);
          }}
        >
          {/* Subtle canvas breadcrumb banner */}
          <div className="sticky top-2 z-10 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs text-stone-600 shadow-xs border border-stone-200/80 mb-2 flex items-center gap-2">
            <span className="font-medium text-stone-800">{activePage.title}</span>
            <span className="text-stone-300">·</span>
            <span className="text-[11px] text-stone-500 font-mono">
              {activePage.elements.length} elements
            </span>
            {selectedElement && (
              <>
                <span className="text-stone-300">·</span>
                <span className="text-[11px] text-amber-700 font-medium capitalize">
                  {selectedElement.type} selected
                </span>
              </>
            )}
          </div>

          {/* Interactive Diary Canvas */}
          <DiaryCanvas
            page={activePage}
            selectedElementId={isPreviewMode ? null : selectedElementId}
            onSelectElement={selectElement}
            onUpdateElement={updateElement}
            onDeleteElement={deleteElement}
            onDuplicateElement={duplicateElement}
            onReorderElement={reorderElement}
            onRequestImageUpload={handleRequestImageUpload}
            zoom={zoom}
          />
        </main>

        {/* Desktop Right Properties Panel */}
        {!isPreviewMode && (
          <aside className="hidden lg:block w-72 xl:w-80 h-full bg-white border-l border-stone-200 shrink-0 z-10">
            <PropertiesPanel
              selectedElement={selectedElement}
              activePage={activePage}
              onUpdateElement={updateElement}
              onDeleteElement={deleteElement}
              onDuplicateElement={duplicateElement}
              onReorderElement={reorderElement}
              onUpdateBackground={updatePageBackground}
              onUpdatePageTitle={updatePageTitle}
              onRequestImageUpload={handleRequestImageUpload}
            />
          </aside>
        )}
      </div>

      {/* Page Navigation Thumbnails Bar */}
      {!isPreviewMode && (
        <PageNavigation
          book={book}
          activePageIndex={activePageIndex}
          onSwitchPage={switchPage}
          onAddPage={addPage}
          onDuplicatePage={duplicatePage}
          onDeletePage={deletePage}
          onReorderPages={reorderPages}
        />
      )}

      {/* MOBILE BOTTOM TOOLBAR (Responsive Adaptations) */}
      {!isPreviewMode && (
        <div className="lg:hidden h-14 bg-white border-t border-stone-200 flex items-center justify-around px-2 shrink-0 z-30">
          <button
            onClick={() => {
              setActiveTab('templates');
              setMobileDrawerOpen(true);
            }}
            className={`flex flex-col items-center justify-center p-1 text-xs ${
              activeTab === 'templates' && mobileDrawerOpen ? 'text-amber-700' : 'text-stone-600'
            }`}
          >
            <LayoutTemplate className="w-5 h-5" />
            <span className="text-[10px]">Layouts</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('uploads');
              setMobileDrawerOpen(true);
            }}
            className={`flex flex-col items-center justify-center p-1 text-xs ${
              activeTab === 'uploads' && mobileDrawerOpen ? 'text-amber-700' : 'text-stone-600'
            }`}
          >
            <UploadCloud className="w-5 h-5" />
            <span className="text-[10px]">Photos</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('elements');
              setMobileDrawerOpen(true);
            }}
            className={`flex flex-col items-center justify-center p-1 text-xs ${
              activeTab === 'elements' && mobileDrawerOpen ? 'text-amber-700' : 'text-stone-600'
            }`}
          >
            <Shapes className="w-5 h-5" />
            <span className="text-[10px]">Stickers</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('text');
              setMobileDrawerOpen(true);
            }}
            className={`flex flex-col items-center justify-center p-1 text-xs ${
              activeTab === 'text' && mobileDrawerOpen ? 'text-amber-700' : 'text-stone-600'
            }`}
          >
            <Type className="w-5 h-5" />
            <span className="text-[10px]">Text</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('backgrounds');
              setMobileDrawerOpen(true);
            }}
            className={`flex flex-col items-center justify-center p-1 text-xs ${
              activeTab === 'backgrounds' && mobileDrawerOpen ? 'text-amber-700' : 'text-stone-600'
            }`}
          >
            <Bookmark className="w-5 h-5" />
            <span className="text-[10px]">Paper</span>
          </button>

          {/* Properties Toggle on mobile */}
          <button
            onClick={() => setMobilePropertiesOpen(!mobilePropertiesOpen)}
            className={`flex flex-col items-center justify-center p-1 text-xs ${
              mobilePropertiesOpen ? 'text-amber-700 font-semibold' : 'text-stone-600'
            }`}
          >
            <Sliders className="w-5 h-5" />
            <span className="text-[10px]">{selectedElement ? 'Edit' : 'Page'}</span>
          </button>
        </div>
      )}

      {/* MOBILE TOOL DRAWER (Bottom Sheet / Modal) */}
      {mobileDrawerOpen && (
        <div className="lg:hidden fixed inset-0 bg-stone-900/50 backdrop-blur-xs flex flex-col justify-end z-40">
          <div className="bg-white rounded-t-2xl max-h-[80vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between p-3 border-b border-stone-200">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                {activeTab}
              </span>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1 rounded-full text-stone-500 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <Sidebar
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onApplyTemplate={(tpl) => {
                  applyTemplateToCurrentPage(tpl);
                  setMobileDrawerOpen(false);
                }}
                onAddElement={(el) => {
                  addElement(el);
                  setMobileDrawerOpen(false);
                }}
                onUpdateBackground={updatePageBackground}
                selectedElementId={selectedElementId}
                uploadedImages={uploadedImages}
                onUploadImage={handleUploadImage}
                onDeleteUploadedImage={handleDeleteUploadedImage}
                currentBgColor={activePage.background.color}
                currentPattern={activePage.background.pattern}
              />
            </div>
          </div>
        </div>
      )}

      {/* MOBILE PROPERTIES DRAWER */}
      {mobilePropertiesOpen && (
        <div className="lg:hidden fixed inset-0 bg-stone-900/50 backdrop-blur-xs flex flex-col justify-end z-40">
          <div className="bg-white rounded-t-2xl max-h-[75vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-3 border-b border-stone-200">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                {selectedElement ? `${selectedElement.type} Settings` : 'Page Paper Settings'}
              </span>
              <button
                onClick={() => setMobilePropertiesOpen(false)}
                className="p-1 rounded-full text-stone-500 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <PropertiesPanel
                selectedElement={selectedElement}
                activePage={activePage}
                onUpdateElement={updateElement}
                onDeleteElement={(id) => {
                  deleteElement(id);
                  setMobilePropertiesOpen(false);
                }}
                onDuplicateElement={duplicateElement}
                onReorderElement={reorderElement}
                onUpdateBackground={updatePageBackground}
                onUpdatePageTitle={updatePageTitle}
                onRequestImageUpload={handleRequestImageUpload}
              />
            </div>
          </div>
        </div>
      )}

      {/* EXPORT BOOK DATA MODAL */}
      {showExportModal && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-4 border border-stone-200">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2 text-stone-900">
                <Download className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-base">Export Diary Book</h3>
              </div>
              <button
                onClick={() => setShowExportModal(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Your journal is saved in independent page and element data structures. You can download the complete book schema as JSON or copy it to clipboard.
            </p>

            <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs text-stone-700 font-mono max-h-40 overflow-y-auto">
              <pre>{JSON.stringify({ title: book.title, pages: book.pages.length, elements: book.pages.reduce((acc, p) => acc + p.elements.length, 0) }, null, 2)}</pre>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={handleCopyJSON}
                className="px-3 py-2 rounded-lg border border-stone-200 text-xs font-medium text-stone-700 hover:bg-stone-50 flex items-center gap-1.5 transition-colors"
              >
                {exportCopied ? <Check className="w-4 h-4 text-emerald-600" /> : null}
                <span>{exportCopied ? 'Copied!' : 'Copy Book JSON'}</span>
              </button>
              <button
                onClick={handleDownloadJSON}
                className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>Download .JSON File</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
