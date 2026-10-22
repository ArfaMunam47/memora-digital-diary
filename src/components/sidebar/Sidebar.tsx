import React, { useState, useRef } from 'react';
import {
  LayoutTemplate,
  UploadCloud,
  Shapes,
  Type,
  Image as ImageIcon,
  Sparkles,
  Heart,
  Star,
  Plus,
  Trash2,
  Bookmark
} from 'lucide-react';
import { STARTER_TEMPLATES } from '../../data/templates';
import { STARTER_STICKERS, STARTER_SHAPES, STARTER_FRAMES, StickerItem, ShapeItem, FrameItem } from '../../data/starterDecorations';
import { DiaryElement, TemplateDefinition, PageBackground, PatternType, TemplateElement } from '../../types/diary';

export type SidebarTab = 'templates' | 'uploads' | 'elements' | 'text' | 'backgrounds';

interface SidebarProps {
  activeTab: SidebarTab;
  onTabChange: (tab: SidebarTab) => void;
  onApplyTemplate: (template: TemplateDefinition) => void;
  onAddElement: (element: TemplateElement) => void;
  onUpdateBackground: (updates: Partial<PageBackground>) => void;
  selectedElementId: string | null;
  uploadedImages: string[];
  onUploadImage: (dataUrl: string) => void;
  onDeleteUploadedImage?: (index: number) => void;
  currentBgColor: string;
  currentPattern: PatternType;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  onApplyTemplate,
  onAddElement,
  onUpdateBackground,
  selectedElementId,
  uploadedImages,
  onUploadImage,
  onDeleteUploadedImage,
  currentBgColor,
  currentPattern,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [elementCategory, setElementCategory] = useState<'stickers' | 'shapes' | 'frames' | 'tapes'>('stickers');

  // Handle local file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        onUploadImage(dataUrl);
        // Automatically add image to page or let user click it
        onAddElement({
          type: 'image',
          x: 150,
          y: 200,
          width: 260,
          height: 200,
          rotation: 0,
          zIndex: 10,
          opacity: 1,
          url: dataUrl,
          objectFit: 'cover',
          borderRadius: 8,
          shadow: true,
        });
      }
    };
    reader.readAsDataURL(file);
    // reset input
    e.target.value = '';
  };

  // Add text preset
  const handleAddTextPreset = (preset: 'heading' | 'subheading' | 'journal' | 'handwritten') => {
    if (preset === 'heading') {
      onAddElement({
        type: 'text',
        x: 80,
        y: 120,
        width: 440,
        height: 60,
        rotation: 0,
        zIndex: 10,
        opacity: 1,
        content: 'A Memorable Chapter',
        fontFamily: 'Playfair Display',
        fontSize: 36,
        fontWeight: 700,
        fontStyle: 'normal',
        color: '#1E293B',
        textAlign: 'center',
        lineHeight: 1.2,
        letterSpacing: 0,
      });
    } else if (preset === 'subheading') {
      onAddElement({
        type: 'text',
        x: 100,
        y: 180,
        width: 400,
        height: 35,
        rotation: 0,
        zIndex: 10,
        opacity: 1,
        content: 'Thursday Afternoon · October 22',
        fontFamily: 'Outfit',
        fontSize: 15,
        fontWeight: 500,
        fontStyle: 'normal',
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 1.2,
        letterSpacing: 0.5,
      });
    } else if (preset === 'journal') {
      onAddElement({
        type: 'text',
        x: 60,
        y: 230,
        width: 480,
        height: 180,
        rotation: 0,
        zIndex: 10,
        opacity: 1,
        content:
          'Write your story here... Capture the atmosphere, the little conversations, and the unexpected moments that made you smile today.',
        fontFamily: 'Caveat',
        fontSize: 24,
        fontWeight: 400,
        fontStyle: 'normal',
        color: '#334155',
        textAlign: 'left',
        lineHeight: 1.5,
        letterSpacing: 0,
      });
    } else {
      onAddElement({
        type: 'text',
        x: 120,
        y: 280,
        width: 340,
        height: 100,
        rotation: -2,
        zIndex: 10,
        opacity: 1,
        content: '“Cherish every second.” ♡',
        fontFamily: 'Patrick Hand',
        fontSize: 26,
        fontWeight: 600,
        fontStyle: 'normal',
        color: '#BE185D',
        textAlign: 'center',
        lineHeight: 1.3,
        letterSpacing: 0,
        backgroundColor: '#FFF1F2',
        padding: 12,
        borderRadius: 8,
      });
    }
  };

  return (
    <div className="flex h-full bg-stone-50/80 border-r border-stone-200">
      {/* Icon Navigation Column */}
      <div className="w-16 flex flex-col items-center py-4 bg-white border-r border-stone-200 shrink-0 gap-3">
        <button
          onClick={() => onTabChange('templates')}
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-lg transition-all ${
            activeTab === 'templates'
              ? 'bg-amber-100/80 text-amber-900 font-semibold shadow-xs'
              : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
          }`}
          title="Templates"
        >
          <LayoutTemplate className="w-5 h-5 mb-0.5 text-amber-700" />
          <span className="text-[10px]">Layouts</span>
        </button>

        <button
          onClick={() => onTabChange('uploads')}
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-lg transition-all ${
            activeTab === 'uploads'
              ? 'bg-amber-100/80 text-amber-900 font-semibold shadow-xs'
              : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
          }`}
          title="Uploads"
        >
          <UploadCloud className="w-5 h-5 mb-0.5 text-amber-700" />
          <span className="text-[10px]">Uploads</span>
        </button>

        <button
          onClick={() => onTabChange('elements')}
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-lg transition-all ${
            activeTab === 'elements'
              ? 'bg-amber-100/80 text-amber-900 font-semibold shadow-xs'
              : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
          }`}
          title="Elements & Stickers"
        >
          <Shapes className="w-5 h-5 mb-0.5 text-amber-700" />
          <span className="text-[10px]">Elements</span>
        </button>

        <button
          onClick={() => onTabChange('text')}
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-lg transition-all ${
            activeTab === 'text'
              ? 'bg-amber-100/80 text-amber-900 font-semibold shadow-xs'
              : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
          }`}
          title="Text"
        >
          <Type className="w-5 h-5 mb-0.5 text-amber-700" />
          <span className="text-[10px]">Text</span>
        </button>

        <button
          onClick={() => onTabChange('backgrounds')}
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-lg transition-all ${
            activeTab === 'backgrounds'
              ? 'bg-amber-100/80 text-amber-900 font-semibold shadow-xs'
              : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
          }`}
          title="Paper Backgrounds"
        >
          <Bookmark className="w-5 h-5 mb-0.5 text-amber-700" />
          <span className="text-[10px]">Papers</span>
        </button>
      </div>

      {/* Expanded Tab Content Drawer */}
      <div className="w-64 md:w-72 h-full overflow-y-auto p-4 bg-white/60">
        {/* 1. TEMPLATES TAB */}
        {activeTab === 'templates' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                Starter Page Layouts
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Apply a layout with fully editable notes, frames, stickers, and washi tapes.
              </p>
            </div>

            <div className="space-y-3">
              {STARTER_TEMPLATES.map((tpl) => (
                <div
                  key={tpl.id}
                  onClick={() => onApplyTemplate(tpl)}
                  className="p-3 bg-white rounded-lg border border-stone-200 hover:border-amber-500 hover:shadow-md cursor-pointer transition-all group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-stone-800 group-hover:text-amber-800">
                      {tpl.title}
                    </span>
                    <span className="text-[10px] text-amber-700 font-medium">
                      {tpl.thumbnailBadge}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed">
                    {tpl.description}
                  </p>
                  <div className="mt-2 text-[10px] text-amber-600 font-medium flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Use this template →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. UPLOADS TAB */}
        {activeTab === 'uploads' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                Photo Uploads
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Upload images from your device to preserve in your journal.
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-3 px-4 border-2 border-dashed border-amber-300 hover:border-amber-500 bg-amber-50/50 hover:bg-amber-50 rounded-lg flex flex-col items-center justify-center gap-1.5 transition-all text-amber-800 group cursor-pointer"
            >
              <UploadCloud className="w-6 h-6 text-amber-600 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold">Choose photo from device</span>
              <span className="text-[10px] text-amber-700/70">JPG, PNG, WebP supported</span>
            </button>

            {/* Gallery of Uploaded Photos */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-medium text-stone-700">Uploaded Gallery ({uploadedImages.length})</span>
              {uploadedImages.length === 0 ? (
                <div className="text-center py-6 text-xs text-stone-400 border border-stone-100 rounded-lg bg-stone-50/50">
                  No photos uploaded yet. Click above to add your first memory!
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {uploadedImages.map((img, i) => (
                    <div
                      key={i}
                      className="group relative aspect-square rounded-md overflow-hidden border border-stone-200 bg-stone-100 cursor-pointer shadow-2xs hover:shadow-sm"
                      onClick={() =>
                        onAddElement({
                          type: 'image',
                          x: 120,
                          y: 180,
                          width: 240,
                          height: 190,
                          rotation: 0,
                          zIndex: 10,
                          opacity: 1,
                          url: img,
                          objectFit: 'cover',
                          borderRadius: 8,
                          shadow: true,
                        })
                      }
                    >
                      <img
                        src={img}
                        alt={`Upload ${i + 1}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <span className="text-[11px] text-white font-medium bg-black/60 px-2 py-1 rounded">
                          + Add to page
                        </span>
                      </div>
                      {onDeleteUploadedImage && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteUploadedImage(i);
                          }}
                          className="absolute top-1 right-1 p-1 bg-white/80 hover:bg-rose-600 hover:text-white rounded text-stone-600 opacity-0 group-hover:opacity-100 transition-all"
                          title="Delete photo"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. ELEMENTS & STICKERS TAB */}
        {activeTab === 'elements' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                Stickers & Decorations
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Add hand-drawn stickers, shapes, frames, and tapes.
              </p>
            </div>

            {/* Category Sub-tabs */}
            <div className="grid grid-cols-4 gap-1 p-1 bg-stone-100 rounded-lg text-xs font-medium text-stone-600">
              <button
                onClick={() => setElementCategory('stickers')}
                className={`py-1 text-center rounded transition-colors ${
                  elementCategory === 'stickers' ? 'bg-white text-stone-900 shadow-xs' : 'hover:text-stone-900'
                }`}
              >
                Stickers
              </button>
              <button
                onClick={() => setElementCategory('tapes')}
                className={`py-1 text-center rounded transition-colors ${
                  elementCategory === 'tapes' ? 'bg-white text-stone-900 shadow-xs' : 'hover:text-stone-900'
                }`}
              >
                Tapes
              </button>
              <button
                onClick={() => setElementCategory('frames')}
                className={`py-1 text-center rounded transition-colors ${
                  elementCategory === 'frames' ? 'bg-white text-stone-900 shadow-xs' : 'hover:text-stone-900'
                }`}
              >
                Frames
              </button>
              <button
                onClick={() => setElementCategory('shapes')}
                className={`py-1 text-center rounded transition-colors ${
                  elementCategory === 'shapes' ? 'bg-white text-stone-900 shadow-xs' : 'hover:text-stone-900'
                }`}
              >
                Shapes
              </button>
            </div>

            {/* Sub-tab 1: Stickers */}
            {elementCategory === 'stickers' && (
              <div className="grid grid-cols-2 gap-2">
                {STARTER_STICKERS.filter((s) => s.category !== 'tapes').map((sticker) => (
                  <button
                    key={sticker.id}
                    onClick={() =>
                      onAddElement({
                        type: 'sticker',
                        stickerKey: sticker.id,
                        category: sticker.category,
                        x: 220,
                        y: 250,
                        width: sticker.defaultWidth,
                        height: sticker.defaultHeight,
                        rotation: Math.floor(Math.random() * 12) - 6,
                        zIndex: 10,
                        opacity: 1,
                        primaryColor: sticker.primaryColor,
                        secondaryColor: sticker.secondaryColor,
                      })
                    }
                    className="p-3 bg-white rounded-lg border border-stone-200 hover:border-amber-400 hover:shadow-xs flex flex-col items-center justify-center gap-1.5 transition-all text-center group cursor-pointer"
                  >
                    <div className="w-12 h-12 flex items-center justify-center group-hover:scale-110 transition-transform">
                      {/* Quick SVG Preview */}
                      {sticker.category === 'love' ? (
                        <Heart className="w-8 h-8 text-rose-500 fill-rose-500/20" />
                      ) : sticker.category === 'nature' ? (
                        <Sparkles className="w-8 h-8 text-emerald-500" />
                      ) : (
                        <Star className="w-8 h-8 text-amber-500 fill-amber-500/20" />
                      )}
                    </div>
                    <span className="text-[11px] font-medium text-stone-700 truncate max-w-full">
                      {sticker.name}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Sub-tab 2: Washi Tapes */}
            {elementCategory === 'tapes' && (
              <div className="space-y-2">
                {STARTER_STICKERS.filter((s) => s.category === 'tapes').map((tape) => (
                  <button
                    key={tape.id}
                    onClick={() =>
                      onAddElement({
                        type: 'sticker',
                        stickerKey: tape.id,
                        category: 'tapes',
                        x: 180,
                        y: 200,
                        width: tape.defaultWidth,
                        height: tape.defaultHeight,
                        rotation: -3,
                        zIndex: 10,
                        opacity: 0.9,
                        primaryColor: tape.primaryColor,
                      })
                    }
                    className="w-full p-2.5 bg-white rounded-lg border border-stone-200 hover:border-amber-400 hover:shadow-xs flex items-center justify-between transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-12 h-4 rounded-xs border border-dashed border-stone-400/40"
                        style={{ backgroundColor: tape.primaryColor }}
                      />
                      <span className="text-xs font-medium text-stone-700">{tape.name}</span>
                    </div>
                    <Plus className="w-4 h-4 text-stone-400 group-hover:text-amber-600" />
                  </button>
                ))}
              </div>
            )}

            {/* Sub-tab 3: Photo Frames */}
            {elementCategory === 'frames' && (
              <div className="space-y-2.5">
                {STARTER_FRAMES.map((frm) => (
                  <button
                    key={frm.id}
                    onClick={() =>
                      onAddElement({
                        type: 'frame',
                        frameStyle: frm.style,
                        x: 170,
                        y: 190,
                        width: frm.defaultWidth,
                        height: frm.defaultHeight,
                        rotation: -2,
                        zIndex: 10,
                        opacity: 1,
                        caption: frm.caption,
                        isPlaceholder: true,
                      })
                    }
                    className="w-full p-3 bg-white rounded-lg border border-stone-200 hover:border-amber-500 hover:shadow-xs flex items-center justify-between transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-10 bg-amber-50 border border-stone-300 rounded-xs flex items-center justify-center text-amber-700">
                        <ImageIcon className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <span className="text-xs font-semibold text-stone-800 block">
                          {frm.name}
                        </span>
                        <span className="text-[10px] text-stone-500">{frm.caption}</span>
                      </div>
                    </div>
                    <Plus className="w-4 h-4 text-stone-400 group-hover:text-amber-600" />
                  </button>
                ))}
              </div>
            )}

            {/* Sub-tab 4: Basic Shapes */}
            {elementCategory === 'shapes' && (
              <div className="grid grid-cols-2 gap-2">
                {STARTER_SHAPES.map((shp) => (
                  <button
                    key={shp.id}
                    onClick={() =>
                      onAddElement({
                        type: 'shape',
                        shapeType: shp.shapeType,
                        x: 200,
                        y: 200,
                        width: shp.defaultWidth,
                        height: shp.defaultHeight,
                        rotation: 0,
                        zIndex: 5,
                        opacity: 1,
                        fillColor: shp.fillColor,
                        strokeColor: shp.strokeColor,
                        strokeWidth: shp.strokeWidth,
                        strokeStyle: 'solid',
                        cornerRadius: 12,
                      })
                    }
                    className="p-3 bg-white rounded-lg border border-stone-200 hover:border-amber-400 hover:shadow-xs flex flex-col items-center justify-center gap-1.5 transition-all text-center group cursor-pointer"
                  >
                    <div
                      className="w-10 h-7 rounded border flex items-center justify-center text-[10px] text-stone-600"
                      style={{
                        backgroundColor: shp.fillColor,
                        borderColor: shp.strokeColor,
                        borderWidth: `${shp.strokeWidth}px`,
                      }}
                    >
                      {shp.shapeType === 'circle' ? '●' : shp.shapeType === 'heart' ? '♥' : '■'}
                    </div>
                    <span className="text-[11px] font-medium text-stone-700 truncate max-w-full">
                      {shp.name}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 4. TEXT TAB */}
        {activeTab === 'text' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                Text Presets
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Click to add headlines, thoughts, and calligraphy notes to the page.
              </p>
            </div>

            <div className="space-y-2.5">
              <button
                onClick={() => handleAddTextPreset('heading')}
                className="w-full p-3 bg-white border border-stone-200 hover:border-amber-500 rounded-lg text-left transition-all hover:shadow-xs group cursor-pointer"
              >
                <span className="block text-xl font-bold font-serif text-stone-900 group-hover:text-amber-800">
                  Chapter Heading
                </span>
                <span className="text-[11px] text-stone-500">Playfair Display · 36px</span>
              </button>

              <button
                onClick={() => handleAddTextPreset('subheading')}
                className="w-full p-3 bg-white border border-stone-200 hover:border-amber-500 rounded-lg text-left transition-all hover:shadow-xs group cursor-pointer"
              >
                <span className="block text-sm font-semibold text-stone-800 tracking-wide group-hover:text-amber-800">
                  Date & Subheading
                </span>
                <span className="text-[11px] text-stone-500">Outfit · 15px Medium</span>
              </button>

              <button
                onClick={() => handleAddTextPreset('journal')}
                className="w-full p-3 bg-white border border-stone-200 hover:border-amber-500 rounded-lg text-left transition-all hover:shadow-xs group cursor-pointer"
              >
                <span className="block text-lg font-['Caveat'] text-stone-800 group-hover:text-amber-800">
                  Dear Diary story paragraph...
                </span>
                <span className="text-[11px] text-stone-500">Caveat Handwriting · 24px</span>
              </button>

              <button
                onClick={() => handleAddTextPreset('handwritten')}
                className="w-full p-3 bg-rose-50/50 border border-rose-200 hover:border-rose-400 rounded-lg text-left transition-all hover:shadow-xs group cursor-pointer"
              >
                <span className="block text-base font-['Patrick_Hand'] text-rose-700">
                  “Sweet Quote & Highlight”
                </span>
                <span className="text-[11px] text-rose-500">Patrick Hand · Highlighted Box</span>
              </button>
            </div>
          </div>
        )}

        {/* 5. BACKGROUNDS TAB */}
        {activeTab === 'backgrounds' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                Paper Backgrounds
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Choose authentic journal paper patterns and parchment tones.
              </p>
            </div>

            {/* Pattern Grids */}
            <div className="space-y-2">
              <span className="text-xs font-medium text-stone-700">Paper Texture</span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'lined', name: 'Lined Journal' },
                  { id: 'dotted', name: 'Bullet Dotted' },
                  { id: 'grid', name: 'Grid Paper' },
                  { id: 'kraft', name: 'Kraft Brown' },
                  { id: 'gingham', name: 'Gingham Plaid' },
                  { id: 'vintage-linen', name: 'Vintage Linen' },
                  { id: 'none', name: 'Clean Solid' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onUpdateBackground({ pattern: item.id as PatternType })}
                    className={`p-2.5 rounded-lg border text-left text-xs font-medium transition-all ${
                      currentPattern === item.id
                        ? 'border-amber-600 bg-amber-50 text-amber-900 shadow-xs'
                        : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Palette */}
            <div className="space-y-2 pt-2 border-t border-stone-200">
              <span className="text-xs font-medium text-stone-700">Paper Tone</span>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { color: '#FFFDF9', name: 'Cream' },
                  { color: '#FEFCE8', name: 'Warm' },
                  { color: '#FFF1F2', name: 'Blush' },
                  { color: '#F0FDF4', name: 'Sage' },
                  { color: '#F0F9FF', name: 'Sky' },
                  { color: '#F7EEDD', name: 'Kraft' },
                  { color: '#FAF5FF', name: 'Lilac' },
                  { color: '#FFFFFF', name: 'White' },
                ].map((c) => (
                  <button
                    key={c.color}
                    onClick={() => onUpdateBackground({ color: c.color })}
                    className={`flex flex-col items-center p-2 rounded-md border text-center transition-all ${
                      currentBgColor === c.color
                        ? 'border-amber-600 ring-2 ring-amber-500/20 shadow-xs'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div
                      className="w-6 h-6 rounded-full border border-stone-300 shadow-2xs"
                      style={{ backgroundColor: c.color }}
                    />
                    <span className="text-[10px] text-stone-600 mt-1 truncate">{c.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
