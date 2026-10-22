import React from 'react';
import { DiaryElement, DiaryPage, PageBackground, TextElement, ImageElement, ShapeElement, StickerElement, FrameElement, FontFamily, PatternType } from '../../types/diary';
import {
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  ChevronsUp,
  ChevronsDown,
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Upload,
  Type,
  Sparkles,
  Layers,
  Palette,
  Maximize2,
  FileText
} from 'lucide-react';

interface PropertiesPanelProps {
  selectedElement: DiaryElement | null;
  activePage: DiaryPage;
  onUpdateElement: (id: string, updates: Partial<DiaryElement>) => void;
  onDeleteElement: (id: string) => void;
  onDuplicateElement: (id: string) => void;
  onReorderElement: (id: string, action: 'front' | 'back' | 'forward' | 'backward') => void;
  onUpdateBackground: (updates: Partial<PageBackground>) => void;
  onUpdatePageTitle: (title: string) => void;
  onRequestImageUpload: (elementId?: string) => void;
}

const FONTS: { label: string; value: FontFamily }[] = [
  { label: 'Caveat (Handwritten)', value: 'Caveat' },
  { label: 'Patrick Hand (Casual Script)', value: 'Patrick Hand' },
  { label: 'Playfair Display (Editorial)', value: 'Playfair Display' },
  { label: 'Lora (Journal Serif)', value: 'Lora' },
  { label: 'Outfit (Clean Sans)', value: 'Outfit' },
  { label: 'Courier New (Typewriter)', value: 'Courier New' },
];

const COLOR_PALETTE = [
  '#1E293B', '#475569', '#854D0E', '#B45309', '#DC2626',
  '#E11D48', '#BE185D', '#7C3AED', '#2563EB', '#0D9488',
  '#15803D', '#FFFFFF', '#FEF3C7', '#FCE7F3', '#E0F2FE'
];

const PAPER_COLORS = [
  { label: 'Cream', color: '#FFFDF9' },
  { label: 'Parchment', color: '#FEFCE8' },
  { label: 'Blush Rose', color: '#FFF1F2' },
  { label: 'Sage Mint', color: '#F0FDF4' },
  { label: 'Soft Sky', color: '#F0F9FF' },
  { label: 'Kraft Brown', color: '#F7EEDD' },
  { label: 'Lavender', color: '#FAF5FF' },
  { label: 'Crisp White', color: '#FFFFFF' },
];

const PATTERNS: { label: string; value: PatternType }[] = [
  { label: 'Clean Paper', value: 'none' },
  { label: 'Lined Journal', value: 'lined' },
  { label: 'Bullet Dotted', value: 'dotted' },
  { label: 'Notebook Grid', value: 'grid' },
  { label: 'Kraft Fiber', value: 'kraft' },
  { label: 'Gingham Plaid', value: 'gingham' },
  { label: 'Vintage Linen', value: 'vintage-linen' },
];

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedElement,
  activePage,
  onUpdateElement,
  onDeleteElement,
  onDuplicateElement,
  onReorderElement,
  onUpdateBackground,
  onUpdatePageTitle,
  onRequestImageUpload,
}) => {
  // If NO element is selected, show Page & Background Properties
  if (!selectedElement) {
    return (
      <div className="w-full h-full overflow-y-auto p-4 space-y-6 text-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 tracking-wider uppercase mb-1">
            <FileText className="w-4 h-4 text-amber-600" />
            <span>Page Settings</span>
          </div>
          <p className="text-xs text-slate-500">Configure page paper texture, title, and canvas tone.</p>
        </div>

        {/* Page Title */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-700">Page Title</label>
          <input
            type="text"
            value={activePage.title}
            onChange={(e) => onUpdatePageTitle(e.target.value)}
            className="w-full px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="e.g. Autumn Memories"
          />
        </div>

        {/* Paper Color Palette */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-slate-700">Paper Tone</label>
          <div className="grid grid-cols-4 gap-2">
            {PAPER_COLORS.map((p) => (
              <button
                key={p.color}
                onClick={() => onUpdateBackground({ color: p.color })}
                className={`p-2 rounded-md border text-left flex flex-col items-center gap-1 transition-all ${
                  activePage.background.color === p.color
                    ? 'border-amber-600 ring-2 ring-amber-500/20 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div
                  className="w-6 h-6 rounded-full border border-slate-300 shadow-xs"
                  style={{ backgroundColor: p.color }}
                />
                <span className="text-[10px] text-slate-600 truncate max-w-full">{p.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Pattern Style */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-slate-700">Ruling & Texture Pattern</label>
          <div className="grid grid-cols-2 gap-2">
            {PATTERNS.map((pat) => (
              <button
                key={pat.value}
                onClick={() => onUpdateBackground({ pattern: pat.value })}
                className={`px-3 py-2 text-xs font-medium rounded-md border text-left transition-all ${
                  activePage.background.pattern === pat.value
                    ? 'bg-amber-50 border-amber-500 text-amber-900 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {pat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Pattern Opacity */}
        {activePage.background.pattern !== 'none' && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-slate-600">
              <span>Pattern Intensity</span>
              <span className="font-mono">{Math.round((activePage.background.patternOpacity ?? 0.15) * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.5"
              step="0.02"
              value={activePage.background.patternOpacity ?? 0.15}
              onChange={(e) => onUpdateBackground({ patternOpacity: parseFloat(e.target.value) })}
              className="w-full accent-amber-600"
            />
          </div>
        )}

        <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-lg text-xs text-amber-800 space-y-1">
          <p className="font-medium">💡 Quick Tips:</p>
          <p className="text-amber-700/90 leading-relaxed">
            Click on any item on the page to adjust its size, rotation, typography, or layer stacking order.
          </p>
        </div>
      </div>
    );
  }

  // ELEMENT SPECIFIC CONTROLS
  return (
    <div className="w-full h-full overflow-y-auto p-4 space-y-5 text-slate-800">
      {/* Header bar with Type and Quick Actions */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
            {selectedElement.type} Element
          </span>
          <p className="text-[11px] text-slate-500">ID: {selectedElement.id.slice(0, 10)}</p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onDuplicateElement(selectedElement.id)}
            title="Duplicate element"
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDeleteElement(selectedElement.id)}
            title="Delete element"
            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stacking Order & Layer Arrangement */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-slate-500" />
          <span>Layer Arrangement</span>
        </label>
        <div className="grid grid-cols-4 gap-1">
          <button
            onClick={() => onReorderElement(selectedElement.id, 'front')}
            title="Bring to Front"
            className="flex flex-col items-center justify-center p-1.5 bg-white border border-slate-200 rounded text-xs text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <ChevronsUp className="w-4 h-4 text-amber-600" />
            <span className="text-[10px] mt-0.5">Top</span>
          </button>
          <button
            onClick={() => onReorderElement(selectedElement.id, 'forward')}
            title="Bring Forward"
            className="flex flex-col items-center justify-center p-1.5 bg-white border border-slate-200 rounded text-xs text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <ArrowUp className="w-4 h-4 text-amber-600" />
            <span className="text-[10px] mt-0.5">Up</span>
          </button>
          <button
            onClick={() => onReorderElement(selectedElement.id, 'backward')}
            title="Send Backward"
            className="flex flex-col items-center justify-center p-1.5 bg-white border border-slate-200 rounded text-xs text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <ArrowDown className="w-4 h-4 text-amber-600" />
            <span className="text-[10px] mt-0.5">Down</span>
          </button>
          <button
            onClick={() => onReorderElement(selectedElement.id, 'back')}
            title="Send to Back"
            className="flex flex-col items-center justify-center p-1.5 bg-white border border-slate-200 rounded text-xs text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <ChevronsDown className="w-4 h-4 text-amber-600" />
            <span className="text-[10px] mt-0.5">Bottom</span>
          </button>
        </div>
      </div>

      {/* Geometry: Position, Size & Rotation */}
      <div className="space-y-3 p-3 bg-slate-50/80 rounded-lg border border-slate-200/70">
        <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
          <Maximize2 className="w-3.5 h-3.5 text-slate-500" />
          <span>Transform & Position</span>
        </label>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-slate-500 text-[10px]">X Position</span>
            <input
              type="number"
              value={Math.round(selectedElement.x)}
              onChange={(e) => onUpdateElement(selectedElement.id, { x: parseInt(e.target.value) || 0 })}
              className="w-full px-2 py-1 bg-white border border-slate-200 rounded focus:ring-1 focus:ring-amber-500 text-xs font-mono"
            />
          </div>
          <div>
            <span className="text-slate-500 text-[10px]">Y Position</span>
            <input
              type="number"
              value={Math.round(selectedElement.y)}
              onChange={(e) => onUpdateElement(selectedElement.id, { y: parseInt(e.target.value) || 0 })}
              className="w-full px-2 py-1 bg-white border border-slate-200 rounded focus:ring-1 focus:ring-amber-500 text-xs font-mono"
            />
          </div>
          <div>
            <span className="text-slate-500 text-[10px]">Width (px)</span>
            <input
              type="number"
              min="20"
              value={Math.round(selectedElement.width)}
              onChange={(e) => onUpdateElement(selectedElement.id, { width: Math.max(20, parseInt(e.target.value) || 20) })}
              className="w-full px-2 py-1 bg-white border border-slate-200 rounded focus:ring-1 focus:ring-amber-500 text-xs font-mono"
            />
          </div>
          <div>
            <span className="text-slate-500 text-[10px]">Height (px)</span>
            <input
              type="number"
              min="20"
              value={Math.round(selectedElement.height)}
              onChange={(e) => onUpdateElement(selectedElement.id, { height: Math.max(20, parseInt(e.target.value) || 20) })}
              className="w-full px-2 py-1 bg-white border border-slate-200 rounded focus:ring-1 focus:ring-amber-500 text-xs font-mono"
            />
          </div>
        </div>

        {/* Rotation Slider */}
        <div className="space-y-1 pt-1">
          <div className="flex justify-between text-xs text-slate-600">
            <span>Rotation</span>
            <span className="font-mono text-xs">{selectedElement.rotation || 0}°</span>
          </div>
          <input
            type="range"
            min="0"
            max="360"
            value={selectedElement.rotation || 0}
            onChange={(e) => onUpdateElement(selectedElement.id, { rotation: parseInt(e.target.value) })}
            className="w-full accent-amber-600"
          />
          <div className="flex justify-between gap-1 pt-1">
            {[0, 90, 180, 270].map((deg) => (
              <button
                key={deg}
                onClick={() => onUpdateElement(selectedElement.id, { rotation: deg })}
                className="px-1.5 py-0.5 text-[10px] bg-white border border-slate-200 rounded text-slate-600 hover:bg-slate-100"
              >
                {deg}°
              </button>
            ))}
          </div>
        </div>

        {/* Opacity Slider */}
        <div className="space-y-1 pt-1">
          <div className="flex justify-between text-xs text-slate-600">
            <span>Opacity</span>
            <span className="font-mono text-xs">{Math.round((selectedElement.opacity ?? 1) * 100)}%</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.05"
            value={selectedElement.opacity ?? 1}
            onChange={(e) => onUpdateElement(selectedElement.id, { opacity: parseFloat(e.target.value) })}
            className="w-full accent-amber-600"
          />
        </div>
      </div>

      {/* TYPE-SPECIFIC EDITORS */}

      {/* 1. TEXT CONTROLS */}
      {selectedElement.type === 'text' && (
        <div className="space-y-4">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
            <Type className="w-4 h-4 text-amber-600" />
            <span>Typography & Styling</span>
          </div>

          {/* Text Content */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">Text Content</label>
            <textarea
              rows={3}
              value={(selectedElement as TextElement).content}
              onChange={(e) => onUpdateElement(selectedElement.id, { content: e.target.value })}
              className="w-full px-2.5 py-1.5 text-sm bg-white border border-slate-200 rounded-md focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Font Family */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">Font Family</label>
            <select
              value={(selectedElement as TextElement).fontFamily}
              onChange={(e) => onUpdateElement(selectedElement.id, { fontFamily: e.target.value as FontFamily })}
              className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:ring-2 focus:ring-amber-500"
            >
              {FONTS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>

          {/* Font Size & Weight */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-medium text-slate-700">Font Size ({ (selectedElement as TextElement).fontSize }px)</label>
              <input
                type="range"
                min="12"
                max="72"
                value={(selectedElement as TextElement).fontSize}
                onChange={(e) => onUpdateElement(selectedElement.id, { fontSize: parseInt(e.target.value) })}
                className="w-full accent-amber-600 mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700">Style</label>
              <div className="flex items-center gap-1 mt-1">
                <button
                  onClick={() =>
                    onUpdateElement(selectedElement.id, {
                      fontWeight: (selectedElement as TextElement).fontWeight === 'bold' || (selectedElement as TextElement).fontWeight === 700 ? 'normal' : 'bold',
                    })
                  }
                  className={`p-1.5 border rounded flex-1 flex justify-center ${
                    (selectedElement as TextElement).fontWeight === 'bold' || (selectedElement as TextElement).fontWeight === 700
                      ? 'bg-amber-100 border-amber-500 text-amber-900 font-bold'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  onClick={() =>
                    onUpdateElement(selectedElement.id, {
                      fontStyle: (selectedElement as TextElement).fontStyle === 'italic' ? 'normal' : 'italic',
                    })
                  }
                  className={`p-1.5 border rounded flex-1 flex justify-center ${
                    (selectedElement as TextElement).fontStyle === 'italic'
                      ? 'bg-amber-100 border-amber-500 text-amber-900'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <Italic className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Alignment */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">Text Align</label>
            <div className="flex rounded-md border border-slate-200 bg-white p-0.5">
              {(['left', 'center', 'right'] as const).map((align) => (
                <button
                  key={align}
                  onClick={() => onUpdateElement(selectedElement.id, { textAlign: align })}
                  className={`flex-1 py-1 flex items-center justify-center rounded text-xs capitalize ${
                    (selectedElement as TextElement).textAlign === align
                      ? 'bg-amber-100 text-amber-900 font-medium'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {align === 'left' && <AlignLeft className="w-4 h-4" />}
                  {align === 'center' && <AlignCenter className="w-4 h-4" />}
                  {align === 'right' && <AlignRight className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>

          {/* Text Color */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700">Text Color</label>
            <div className="flex flex-wrap gap-1.5">
              {COLOR_PALETTE.map((c) => (
                <button
                  key={c}
                  onClick={() => onUpdateElement(selectedElement.id, { color: c })}
                  className={`w-6 h-6 rounded-full border shadow-2xs transition-transform ${
                    (selectedElement as TextElement).color === c ? 'scale-115 ring-2 ring-amber-500' : 'border-slate-300'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. IMAGE CONTROLS */}
      {selectedElement.type === 'image' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-800">Photo Properties</span>
            <button
              onClick={() => onRequestImageUpload(selectedElement.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 text-white rounded-md text-xs font-medium hover:bg-amber-700 shadow-xs"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Replace Photo</span>
            </button>
          </div>

          {/* Border Radius */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-slate-600">
              <span>Corner Rounding</span>
              <span>{(selectedElement as ImageElement).borderRadius || 0}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="40"
              value={(selectedElement as ImageElement).borderRadius || 0}
              onChange={(e) => onUpdateElement(selectedElement.id, { borderRadius: parseInt(e.target.value) })}
              className="w-full accent-amber-600"
            />
          </div>

          {/* Drop shadow toggle */}
          <div className="flex items-center justify-between text-xs py-1">
            <span className="text-slate-700 font-medium">Soft Drop Shadow</span>
            <input
              type="checkbox"
              checked={!!(selectedElement as ImageElement).shadow}
              onChange={(e) => onUpdateElement(selectedElement.id, { shadow: e.target.checked })}
              className="w-4 h-4 accent-amber-600 rounded"
            />
          </div>

          {/* Image Filters */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <label className="text-xs font-medium text-slate-700">Photo Mood Filters</label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() =>
                  onUpdateElement(selectedElement.id, {
                    filter: { brightness: 100, contrast: 100, sepia: 0, grayscale: 0, blur: 0 },
                  })
                }
                className="py-1 px-2 border border-slate-200 rounded text-slate-700 hover:bg-slate-50"
              >
                Normal
              </button>
              <button
                onClick={() =>
                  onUpdateElement(selectedElement.id, {
                    filter: { brightness: 105, contrast: 95, sepia: 40, grayscale: 0, blur: 0 },
                  })
                }
                className="py-1 px-2 border border-amber-300 bg-amber-50/50 rounded text-amber-900"
              >
                Warm Vintage
              </button>
              <button
                onClick={() =>
                  onUpdateElement(selectedElement.id, {
                    filter: { brightness: 100, contrast: 110, sepia: 0, grayscale: 100, blur: 0 },
                  })
                }
                className="py-1 px-2 border border-slate-300 bg-slate-100 rounded text-slate-800"
              >
                Black & White
              </button>
              <button
                onClick={() =>
                  onUpdateElement(selectedElement.id, {
                    filter: { brightness: 115, contrast: 105, sepia: 15, grayscale: 0, blur: 0 },
                  })
                }
                className="py-1 px-2 border border-rose-200 bg-rose-50 rounded text-rose-800"
              >
                Golden Glow
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. FRAME CONTROLS */}
      {selectedElement.type === 'frame' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-800">Scrapbook Frame</span>
            <button
              onClick={() => onRequestImageUpload(selectedElement.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 text-white rounded-md text-xs font-medium hover:bg-amber-700 shadow-xs"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Insert Photo</span>
            </button>
          </div>

          {/* Frame Style Picker */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">Frame Style</label>
            <select
              value={(selectedElement as FrameElement).frameStyle}
              onChange={(e) => onUpdateElement(selectedElement.id, { frameStyle: e.target.value as any })}
              className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:ring-2 focus:ring-amber-500"
            >
              <option value="polaroid">Polaroid Instant Film</option>
              <option value="washi-pinned">Washi Tape Pinned</option>
              <option value="filmstrip">Cinema 35mm Strip</option>
              <option value="gold-scallop">Antique Gold Scallop</option>
              <option value="vintage-postage">Postcard Frame</option>
            </select>
          </div>

          {/* Caption */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">Handwritten Caption</label>
            <input
              type="text"
              value={(selectedElement as FrameElement).caption || ''}
              onChange={(e) => onUpdateElement(selectedElement.id, { caption: e.target.value })}
              placeholder="e.g. Summer holiday 2026"
              className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>
      )}

      {/* 4. SHAPE CONTROLS */}
      {selectedElement.type === 'shape' && (
        <div className="space-y-4">
          <span className="text-xs font-semibold text-slate-800">Shape Styling</span>

          {/* Fill Color */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700">Fill Color</label>
            <div className="flex flex-wrap gap-1.5">
              {COLOR_PALETTE.map((c) => (
                <button
                  key={c}
                  onClick={() => onUpdateElement(selectedElement.id, { fillColor: c })}
                  className={`w-6 h-6 rounded-full border shadow-2xs ${
                    (selectedElement as ShapeElement).fillColor === c ? 'scale-115 ring-2 ring-amber-500' : 'border-slate-300'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Stroke Color */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700">Outline Color</label>
            <div className="flex flex-wrap gap-1.5">
              {COLOR_PALETTE.map((c) => (
                <button
                  key={c}
                  onClick={() => onUpdateElement(selectedElement.id, { strokeColor: c })}
                  className={`w-6 h-6 rounded-full border shadow-2xs ${
                    (selectedElement as ShapeElement).strokeColor === c ? 'scale-115 ring-2 ring-amber-500' : 'border-slate-300'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Stroke Width */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-slate-600">
              <span>Stroke Thickness</span>
              <span>{(selectedElement as ShapeElement).strokeWidth}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="8"
              value={(selectedElement as ShapeElement).strokeWidth}
              onChange={(e) => onUpdateElement(selectedElement.id, { strokeWidth: parseInt(e.target.value) })}
              className="w-full accent-amber-600"
            />
          </div>
        </div>
      )}

      {/* 5. STICKER CONTROLS */}
      {selectedElement.type === 'sticker' && (
        <div className="space-y-4">
          <span className="text-xs font-semibold text-slate-800">Sticker Palette</span>

          {/* Primary Color */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700">Sticker Primary Hue</label>
            <div className="flex flex-wrap gap-1.5">
              {COLOR_PALETTE.map((c) => (
                <button
                  key={c}
                  onClick={() => onUpdateElement(selectedElement.id, { primaryColor: c })}
                  className={`w-6 h-6 rounded-full border shadow-2xs ${
                    (selectedElement as StickerElement).primaryColor === c ? 'scale-115 ring-2 ring-amber-500' : 'border-slate-300'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
