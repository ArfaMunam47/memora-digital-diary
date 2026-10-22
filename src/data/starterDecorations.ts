import { ShapeType, StickerCategory, FrameStyle } from '../types/diary';

export interface StickerItem {
  id: string;
  name: string;
  category: StickerCategory;
  defaultWidth: number;
  defaultHeight: number;
  previewSvg: string; // SVG path or markup
  primaryColor?: string;
  secondaryColor?: string;
}

export interface ShapeItem {
  id: string;
  name: string;
  shapeType: ShapeType;
  defaultWidth: number;
  defaultHeight: number;
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
}

export interface FrameItem {
  id: string;
  name: string;
  style: FrameStyle;
  defaultWidth: number;
  defaultHeight: number;
  caption: string;
}

export const STARTER_STICKERS: StickerItem[] = [
  // Stars
  {
    id: 'star-sparkle',
    name: 'Sparkle Star',
    category: 'stickers',
    defaultWidth: 70,
    defaultHeight: 70,
    primaryColor: '#F59E0B',
    previewSvg: 'M35 5 L42 26 L65 35 L42 44 L35 65 L28 44 L5 35 L28 26 Z'
  },
  {
    id: 'star-handdrawn',
    name: 'Doodle Star',
    category: 'stickers',
    defaultWidth: 80,
    defaultHeight: 80,
    primaryColor: '#EAB308',
    previewSvg: 'M40 8 L49 28 L72 30 L55 45 L60 68 L40 56 L20 68 L25 45 L8 30 L31 28 Z'
  },
  {
    id: 'star-cluster',
    name: 'Star Glow',
    category: 'stickers',
    defaultWidth: 75,
    defaultHeight: 75,
    primaryColor: '#FBBF24',
    previewSvg: 'M37 10 L41 27 L58 31 L43 40 L46 58 L33 46 L18 53 L24 37 L12 25 L29 25 Z'
  },
  // Hearts
  {
    id: 'heart-sketch',
    name: 'Sketched Heart',
    category: 'love',
    defaultWidth: 75,
    defaultHeight: 70,
    primaryColor: '#F43F5E',
    previewSvg: 'M40 65 C18 50 8 36 8 23 C8 12 16 5 26 5 C33 5 37 9 40 13 C43 9 47 5 54 5 C64 5 72 12 72 23 C72 36 62 50 40 65 Z'
  },
  {
    id: 'heart-double',
    name: 'Double Hearts',
    category: 'love',
    defaultWidth: 90,
    defaultHeight: 70,
    primaryColor: '#FB7185',
    secondaryColor: '#FDA4AF',
    previewSvg: 'M30 55 C12 42 5 30 5 19 C5 9 12 3 20 3 C26 3 29 6 31 10 C33 6 36 3 42 3 C50 3 57 9 57 19 C57 30 50 42 30 55 Z'
  },
  // Flowers
  {
    id: 'flower-daisy',
    name: 'Sweet Daisy',
    category: 'nature',
    defaultWidth: 80,
    defaultHeight: 80,
    primaryColor: '#F87171',
    secondaryColor: '#FCD34D',
    previewSvg: 'flower-daisy'
  },
  {
    id: 'flower-rose',
    name: 'Rose Bloom',
    category: 'nature',
    defaultWidth: 80,
    defaultHeight: 80,
    primaryColor: '#E11D48',
    previewSvg: 'flower-rose'
  },
  {
    id: 'botanical-leaf',
    name: 'Olive Sprig',
    category: 'nature',
    defaultWidth: 60,
    defaultHeight: 90,
    primaryColor: '#10B981',
    previewSvg: 'botanical-leaf'
  },
  // Bows and Ribbons
  {
    id: 'bow-cute',
    name: 'Ribbon Bow',
    category: 'banners',
    defaultWidth: 90,
    defaultHeight: 65,
    primaryColor: '#EC4899',
    previewSvg: 'bow-cute'
  },
  {
    id: 'ribbon-banner',
    name: 'Notched Ribbon',
    category: 'banners',
    defaultWidth: 140,
    defaultHeight: 45,
    primaryColor: '#F472B6',
    previewSvg: 'ribbon-banner'
  },
  // Washi Tapes
  {
    id: 'washi-rose',
    name: 'Rose Striped Tape',
    category: 'tapes',
    defaultWidth: 160,
    defaultHeight: 42,
    primaryColor: '#FDA4AF',
    previewSvg: 'washi-rose'
  },
  {
    id: 'washi-sage',
    name: 'Sage Botanical Tape',
    category: 'tapes',
    defaultWidth: 160,
    defaultHeight: 42,
    primaryColor: '#A7F3D0',
    previewSvg: 'washi-sage'
  },
  {
    id: 'washi-kraft',
    name: 'Kraft Paper Tape',
    category: 'tapes',
    defaultWidth: 150,
    defaultHeight: 40,
    primaryColor: '#D6C0A4',
    previewSvg: 'washi-kraft'
  },
  {
    id: 'washi-grid',
    name: 'Grid Washi Tape',
    category: 'tapes',
    defaultWidth: 160,
    defaultHeight: 42,
    primaryColor: '#E2E8F0',
    previewSvg: 'washi-grid'
  },
  // Arrows & Underlines
  {
    id: 'arrow-scribble',
    name: 'Curved Arrow',
    category: 'arrows',
    defaultWidth: 110,
    defaultHeight: 50,
    primaryColor: '#0EA5E9',
    previewSvg: 'arrow-scribble'
  },
  {
    id: 'arrow-pointer',
    name: 'Doodle Arrow',
    category: 'arrows',
    defaultWidth: 100,
    defaultHeight: 40,
    primaryColor: '#6366F1',
    previewSvg: 'arrow-pointer'
  },
  {
    id: 'underline-swirl',
    name: 'Handdrawn Underline',
    category: 'arrows',
    defaultWidth: 130,
    defaultHeight: 25,
    primaryColor: '#F43F5E',
    previewSvg: 'underline-swirl'
  },
  {
    id: 'underline-zigzag',
    name: 'Zigzag Underline',
    category: 'arrows',
    defaultWidth: 130,
    defaultHeight: 22,
    primaryColor: '#F59E0B',
    previewSvg: 'underline-zigzag'
  },
  // Speech Bubbles & Badges
  {
    id: 'speech-bubble-cute',
    name: 'Speech Bubble',
    category: 'stickers',
    defaultWidth: 110,
    defaultHeight: 80,
    primaryColor: '#38BDF8',
    previewSvg: 'speech-bubble-cute'
  },
  {
    id: 'stamp-postage',
    name: 'Postage Stamp',
    category: 'stickers',
    defaultWidth: 80,
    defaultHeight: 95,
    primaryColor: '#B45309',
    previewSvg: 'stamp-postage'
  },
  {
    id: 'badge-award',
    name: 'Scalloped Badge',
    category: 'banners',
    defaultWidth: 85,
    defaultHeight: 85,
    primaryColor: '#8B5CF6',
    previewSvg: 'badge-award'
  }
];

export const STARTER_SHAPES: ShapeItem[] = [
  {
    id: 'rect',
    name: 'Rectangle',
    shapeType: 'rectangle',
    defaultWidth: 150,
    defaultHeight: 100,
    fillColor: '#FEF3C7',
    strokeColor: '#D97706',
    strokeWidth: 2
  },
  {
    id: 'rounded-rect',
    name: 'Rounded Note',
    shapeType: 'rounded-rect',
    defaultWidth: 160,
    defaultHeight: 120,
    fillColor: '#EDE9FE',
    strokeColor: '#8B5CF6',
    strokeWidth: 2
  },
  {
    id: 'circle',
    name: 'Circle Tag',
    shapeType: 'circle',
    defaultWidth: 110,
    defaultHeight: 110,
    fillColor: '#FCE7F3',
    strokeColor: '#EC4899',
    strokeWidth: 2
  },
  {
    id: 'badge',
    name: 'Label Badge',
    shapeType: 'badge',
    defaultWidth: 140,
    defaultHeight: 65,
    fillColor: '#CCFBF1',
    strokeColor: '#0D9488',
    strokeWidth: 2
  },
  {
    id: 'speech-bubble',
    name: 'Thought Bubble',
    shapeType: 'speech-bubble',
    defaultWidth: 140,
    defaultHeight: 100,
    fillColor: '#E0F2FE',
    strokeColor: '#0284C7',
    strokeWidth: 2
  },
  {
    id: 'heart-shape',
    name: 'Heart Shape',
    shapeType: 'heart',
    defaultWidth: 110,
    defaultHeight: 100,
    fillColor: '#FFE4E6',
    strokeColor: '#E11D48',
    strokeWidth: 2
  },
  {
    id: 'star-shape',
    name: 'Star Shape',
    shapeType: 'star',
    defaultWidth: 110,
    defaultHeight: 110,
    fillColor: '#FEF08A',
    strokeColor: '#CA8A04',
    strokeWidth: 2
  }
];

export const STARTER_FRAMES: FrameItem[] = [
  {
    id: 'frame-polaroid',
    name: 'Polaroid Instant',
    style: 'polaroid',
    defaultWidth: 200,
    defaultHeight: 240,
    caption: 'Sunny morning ♡'
  },
  {
    id: 'frame-washi-pinned',
    name: 'Washi Pinned Photo',
    style: 'washi-pinned',
    defaultWidth: 210,
    defaultHeight: 220,
    caption: 'Favorite memory'
  },
  {
    id: 'frame-filmstrip',
    name: 'Film Negative Strip',
    style: 'filmstrip',
    defaultWidth: 190,
    defaultHeight: 240,
    caption: '01 / Take'
  },
  {
    id: 'frame-gold-scallop',
    name: 'Antique Scalloped',
    style: 'gold-scallop',
    defaultWidth: 210,
    defaultHeight: 250,
    caption: 'Treasured moment'
  },
  {
    id: 'frame-vintage-postage',
    name: 'Postcard Frame',
    style: 'vintage-postage',
    defaultWidth: 220,
    defaultHeight: 200,
    caption: 'Airmail dispatch'
  }
];
