export type ElementType = 'text' | 'image' | 'sticker' | 'shape' | 'frame';

export type FontFamily = 
  | 'Caveat' 
  | 'Playfair Display' 
  | 'Lora' 
  | 'Patrick Hand' 
  | 'Outfit' 
  | 'Courier New'
  | 'Georgia';

export type TextAlign = 'left' | 'center' | 'right' | 'justify';

export interface BaseElement {
  id: string;
  type: ElementType;
  x: number;          // pixels relative to 600px width canvas
  y: number;          // pixels relative to 800px height canvas
  width: number;
  height: number;
  rotation: number;   // degrees 0 - 360
  zIndex: number;
  opacity: number;    // 0 - 1
  locked?: boolean;
}

export interface TextElement extends BaseElement {
  type: 'text';
  content: string;
  fontFamily: FontFamily;
  fontSize: number;
  fontWeight: string | number;
  fontStyle: 'normal' | 'italic';
  color: string;
  textAlign: TextAlign;
  lineHeight: number;
  letterSpacing: number;
  backgroundColor?: string;
  padding?: number;
  borderRadius?: number;
}

export interface ImageElement extends BaseElement {
  type: 'image';
  url: string;
  caption?: string;
  objectFit: 'cover' | 'contain';
  borderRadius: number;
  borderWidth?: number;
  borderColor?: string;
  shadow?: boolean;
  isPlaceholder?: boolean;
  filter?: {
    brightness: number; // 0 - 200, default 100
    contrast: number;   // 0 - 200, default 100
    sepia: number;      // 0 - 100, default 0
    grayscale: number;  // 0 - 100, default 0
    blur: number;       // 0 - 10, default 0
  };
}

export type ShapeType = 
  | 'rectangle' 
  | 'rounded-rect' 
  | 'circle' 
  | 'star' 
  | 'heart' 
  | 'badge' 
  | 'washi-tape' 
  | 'speech-bubble'
  | 'arrow'
  | 'underline';

export interface ShapeElement extends BaseElement {
  type: 'shape';
  shapeType: ShapeType;
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  strokeStyle: 'solid' | 'dashed' | 'dotted';
  cornerRadius?: number;
}

export type StickerCategory = 'stickers' | 'tapes' | 'nature' | 'love' | 'arrows' | 'banners';

export interface StickerElement extends BaseElement {
  type: 'sticker';
  stickerKey: string;
  category: StickerCategory;
  primaryColor?: string;
  secondaryColor?: string;
}

export type FrameStyle = 
  | 'polaroid' 
  | 'filmstrip' 
  | 'gold-scallop' 
  | 'washi-pinned' 
  | 'minimal-white' 
  | 'vintage-postage';

export interface FrameElement extends BaseElement {
  type: 'frame';
  frameStyle: FrameStyle;
  imageUrl?: string;
  caption?: string;
  isPlaceholder?: boolean;
  tintColor?: string;
}

export type DiaryElement = TextElement | ImageElement | ShapeElement | StickerElement | FrameElement;

export type PatternType = 
  | 'none' 
  | 'lined' 
  | 'dotted' 
  | 'grid' 
  | 'kraft' 
  | 'watercolor' 
  | 'gingham' 
  | 'vintage-linen';

export interface PageBackground {
  type: 'color' | 'pattern' | 'image';
  color: string;
  pattern: PatternType;
  patternOpacity: number;
  patternColor?: string;
  imageUrl?: string;
}

export interface DiaryPage {
  id: string;
  pageNumber: number;
  title: string;
  background: PageBackground;
  elements: DiaryElement[];
}

export interface DiaryBook {
  id: string;
  title: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  pages: DiaryPage[];
  canvasSize: {
    width: number;
    height: number;
  };
}

export type TemplateElement =
  | Omit<TextElement, 'id'>
  | Omit<ImageElement, 'id'>
  | Omit<ShapeElement, 'id'>
  | Omit<StickerElement, 'id'>
  | Omit<FrameElement, 'id'>;

export interface TemplateDefinition {
  id: string;
  title: string;
  category: string;
  description: string;
  thumbnailBadge: string;
  background: PageBackground;
  elements: TemplateElement[];
}
