import React, { useRef, useState, useEffect, useCallback } from 'react';
import { DiaryElement, DiaryPage } from '../../types/diary';
import { TextRenderer } from '../elements/TextRenderer';
import { ImageRenderer } from '../elements/ImageRenderer';
import { ShapeRenderer } from '../elements/ShapeRenderer';
import { StickerRenderer } from '../elements/StickerRenderer';
import { FrameRenderer } from '../elements/FrameRenderer';
import { RotateCw, Lock, Trash2, Copy, ArrowUp, ArrowDown } from 'lucide-react';

interface DiaryCanvasProps {
  page: DiaryPage;
  facingPage?: DiaryPage | null;
  spreadMode?: boolean;
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (id: string, updates: Partial<DiaryElement>, recordHistory?: boolean) => void;
  onDeleteElement: (id: string) => void;
  onDuplicateElement: (id: string) => void;
  onReorderElement: (id: string, action: 'front' | 'back' | 'forward' | 'backward') => void;
  onRequestImageUpload?: (elementId: string) => void;
  zoom: number;
}

type DragMode = 'move' | 'resize' | 'rotate' | null;
type ResizeHandle = 'nw' | 'ne' | 'se' | 'sw' | 'n' | 'e' | 's' | 'w';

export const DiaryCanvas: React.FC<DiaryCanvasProps> = ({
  page,
  facingPage,
  spreadMode,
  selectedElementId,
  onSelectElement,
  onUpdateElement,
  onDeleteElement,
  onDuplicateElement,
  onReorderElement,
  onRequestImageUpload,
  zoom,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);

  // Dragging / Resizing / Rotating State
  const [dragMode, setDragMode] = useState<DragMode>(null);
  const [activeHandle, setActiveHandle] = useState<ResizeHandle | null>(null);
  const [dragStart, setDragStart] = useState<{
    pointerX: number;
    pointerY: number;
    elementX: number;
    elementY: number;
    elementW: number;
    elementH: number;
    rotation: number;
    centerX: number;
    centerY: number;
  } | null>(null);

  const selectedElement = page.elements.find((el) => el.id === selectedElementId);

  // Convert client pointer coordinates into 600x780 canvas space
  const getCanvasCoords = useCallback((clientX: number, clientY: number) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    const scale = rect.width / 600;
    return {
      x: (clientX - rect.left) / scale,
      y: (clientY - rect.top) / scale,
    };
  }, []);

  // Pointer Down on Element (Start Move)
  const handleElementPointerDown = (e: React.PointerEvent, element: DiaryElement) => {
    e.stopPropagation();
    onSelectElement(element.id);

    const coords = getCanvasCoords(e.clientX, e.clientY);
    setDragMode('move');
    setDragStart({
      pointerX: coords.x,
      pointerY: coords.y,
      elementX: element.x,
      elementY: element.y,
      elementW: element.width,
      elementH: element.height,
      rotation: element.rotation || 0,
      centerX: element.x + element.width / 2,
      centerY: element.y + element.height / 2,
    });
  };

  // Pointer Down on Resize Handle
  const handleResizePointerDown = (e: React.PointerEvent, handle: ResizeHandle) => {
    e.stopPropagation();
    if (!selectedElement) return;

    const coords = getCanvasCoords(e.clientX, e.clientY);
    setDragMode('resize');
    setActiveHandle(handle);
    setDragStart({
      pointerX: coords.x,
      pointerY: coords.y,
      elementX: selectedElement.x,
      elementY: selectedElement.y,
      elementW: selectedElement.width,
      elementH: selectedElement.height,
      rotation: selectedElement.rotation || 0,
      centerX: selectedElement.x + selectedElement.width / 2,
      centerY: selectedElement.y + selectedElement.height / 2,
    });
  };

  // Pointer Down on Rotation Knob
  const handleRotatePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    if (!selectedElement || !canvasRef.current) return;

    const coords = getCanvasCoords(e.clientX, e.clientY);
    const centerX = selectedElement.x + selectedElement.width / 2;
    const centerY = selectedElement.y + selectedElement.height / 2;

    setDragMode('rotate');
    setDragStart({
      pointerX: coords.x,
      pointerY: coords.y,
      elementX: selectedElement.x,
      elementY: selectedElement.y,
      elementW: selectedElement.width,
      elementH: selectedElement.height,
      rotation: selectedElement.rotation || 0,
      centerX,
      centerY,
    });
  };

  // Global Pointer Move & Up handlers during drag
  useEffect(() => {
    if (!dragMode || !dragStart || !selectedElement) return;

    const handlePointerMove = (e: PointerEvent) => {
      const coords = getCanvasCoords(e.clientX, e.clientY);

      if (dragMode === 'move') {
        const dx = coords.x - dragStart.pointerX;
        const dy = coords.y - dragStart.pointerY;
        const newX = Math.round(dragStart.elementX + dx);
        const newY = Math.round(dragStart.elementY + dy);

        onUpdateElement(
          selectedElement.id,
          {
            x: Math.max(-100, Math.min(650, newX)),
            y: Math.max(-100, Math.min(850, newY)),
          },
          false // do not pollute undo history on every mouse tick
        );
      } else if (dragMode === 'resize' && activeHandle) {
        const dx = coords.x - dragStart.pointerX;
        const dy = coords.y - dragStart.pointerY;

        let newX = dragStart.elementX;
        let newY = dragStart.elementY;
        let newW = dragStart.elementW;
        let newH = dragStart.elementH;

        const MIN_SIZE = 24;

        if (activeHandle.includes('e')) {
          newW = Math.max(MIN_SIZE, dragStart.elementW + dx);
        }
        if (activeHandle.includes('s')) {
          newH = Math.max(MIN_SIZE, dragStart.elementH + dy);
        }
        if (activeHandle.includes('w')) {
          const potentialW = dragStart.elementW - dx;
          if (potentialW >= MIN_SIZE) {
            newW = potentialW;
            newX = dragStart.elementX + dx;
          }
        }
        if (activeHandle.includes('n')) {
          const potentialH = dragStart.elementH - dy;
          if (potentialH >= MIN_SIZE) {
            newH = potentialH;
            newY = dragStart.elementY + dy;
          }
        }

        onUpdateElement(
          selectedElement.id,
          {
            x: Math.round(newX),
            y: Math.round(newY),
            width: Math.round(newW),
            height: Math.round(newH),
          },
          false
        );
      } else if (dragMode === 'rotate') {
        const currentAngleRad = Math.atan2(
          coords.y - dragStart.centerY,
          coords.x - dragStart.centerX
        );
        let degrees = Math.round((currentAngleRad * 180) / Math.PI) + 90;
        if (degrees < 0) degrees += 360;
        degrees = degrees % 360;

        // Snapping helper: snap to 0, 45, 90, 180, 270 if within 4 degrees
        const snapAngles = [0, 45, 90, 135, 180, 225, 270, 315, 360];
        for (const snap of snapAngles) {
          if (Math.abs(degrees - snap) <= 4) {
            degrees = snap === 360 ? 0 : snap;
            break;
          }
        }

        onUpdateElement(
          selectedElement.id,
          {
            rotation: degrees,
          },
          false
        );
      }
    };

    const handlePointerUp = () => {
      // Record undo step when drag finishes
      if (selectedElement) {
        onUpdateElement(
          selectedElement.id,
          {
            x: selectedElement.x,
            y: selectedElement.y,
            width: selectedElement.width,
            height: selectedElement.height,
            rotation: selectedElement.rotation,
          },
          true
        );
      }
      setDragMode(null);
      setActiveHandle(null);
      setDragStart(null);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [
    dragMode,
    dragStart,
    selectedElement,
    activeHandle,
    getCanvasCoords,
    onUpdateElement,
  ]);

  // Keyboard navigation & deletion
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedElementId) return;

      // Ignore if user is editing inside an input/textarea
      const targetTag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (targetTag === 'input' || targetTag === 'textarea') return;

      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        onDeleteElement(selectedElementId);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const delta = e.shiftKey ? 10 : 1;
        if (selectedElement) {
          onUpdateElement(selectedElementId, { y: selectedElement.y - delta });
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        const delta = e.shiftKey ? 10 : 1;
        if (selectedElement) {
          onUpdateElement(selectedElementId, { y: selectedElement.y + delta });
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const delta = e.shiftKey ? 10 : 1;
        if (selectedElement) {
          onUpdateElement(selectedElementId, { x: selectedElement.x - delta });
        }
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        const delta = e.shiftKey ? 10 : 1;
        if (selectedElement) {
          onUpdateElement(selectedElementId, { x: selectedElement.x + delta });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElementId, selectedElement, onDeleteElement, onUpdateElement]);

  // Background pattern class
  const getPatternClass = (pattern: string) => {
    switch (pattern) {
      case 'lined':
        return 'paper-lined text-slate-300';
      case 'dotted':
        return 'paper-dotted text-amber-700/30';
      case 'grid':
        return 'paper-grid text-slate-300/60';
      case 'gingham':
        return 'paper-gingham text-rose-300/30';
      case 'kraft':
        return 'paper-kraft';
      case 'vintage-linen':
        return 'paper-linen';
      default:
        return '';
    }
  };

  const renderElementContent = (element: DiaryElement, isSelected: boolean) => {
    switch (element.type) {
      case 'text':
        return (
          <TextRenderer
            element={element}
            isSelected={isSelected}
            onUpdateContent={(content) => onUpdateElement(element.id, { content })}
          />
        );
      case 'image':
        return (
          <ImageRenderer
            element={element}
            onUploadClick={() => onRequestImageUpload?.(element.id)}
          />
        );
      case 'shape':
        return <ShapeRenderer element={element} />;
      case 'sticker':
        return <StickerRenderer element={element} />;
      case 'frame':
        return (
          <FrameRenderer
            element={element}
            isSelected={isSelected}
            onReplaceImage={() => onRequestImageUpload?.(element.id)}
            onCaptionChange={(caption) => onUpdateElement(element.id, { caption })}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative flex items-center justify-center p-4 md:p-8 select-none">
      {/* Canvas Paper Container */}
      <div
        ref={canvasRef}
        onClick={() => onSelectElement(null)}
        style={{
          width: '600px',
          height: '780px',
          transform: `scale(${zoom})`,
          transformOrigin: 'top center',
          backgroundColor: page.background.color || '#FFFDF9',
        }}
        className={`relative shrink-0 shadow-2xl rounded-sm transition-transform duration-75 overflow-hidden border border-stone-200/80 ${getPatternClass(
          page.background.pattern
        )}`}
      >
        {/* Paper texture overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: page.background.patternOpacity ?? 0.15,
            color: page.background.patternColor,
          }}
        />

        {/* Subtle diary binding spine line on left edge */}
        <div className="absolute top-0 bottom-0 left-0 w-3 bg-gradient-to-r from-stone-400/20 via-stone-300/10 to-transparent pointer-events-none" />

        {/* Page elements */}
        {page.elements
          .slice()
          .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0))
          .map((element) => {
            const isSelected = element.id === selectedElementId;

            return (
              <div
                key={element.id}
                onPointerDown={(e) => handleElementPointerDown(e, element)}
                className={`absolute transition-shadow duration-150 ${
                  isSelected ? 'cursor-move' : 'cursor-pointer hover:ring-1 hover:ring-amber-400/60'
                }`}
                style={{
                  left: `${element.x}px`,
                  top: `${element.y}px`,
                  width: `${element.width}px`,
                  height: `${element.height}px`,
                  transform: `rotate(${element.rotation || 0}deg)`,
                  transformOrigin: 'center center',
                  zIndex: element.zIndex || 1,
                  opacity: element.opacity ?? 1,
                }}
              >
                {/* Element Inner Render */}
                <div className="w-full h-full relative">
                  {renderElementContent(element, isSelected)}
                </div>

                {/* Selection & Transform Bounding Box */}
                {isSelected && (
                  <div className="absolute -inset-1 border-2 border-amber-500 rounded-xs pointer-events-none shadow-xs">
                    {/* Rotation stem & knob */}
                    <div
                      onPointerDown={handleRotatePointerDown}
                      className="absolute -top-7 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white border-2 border-amber-500 flex items-center justify-center cursor-grab active:cursor-grabbing pointer-events-auto shadow-sm hover:scale-110 transition-transform"
                      title="Drag to rotate element"
                    >
                      <RotateCw className="w-3.5 h-3.5 text-amber-600" />
                    </div>
                    {/* Visual rotation connector line */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-0.5 h-2 bg-amber-500" />

                    {/* Quick Floating Action Pill above element */}
                    <div className="absolute -top-12 right-0 flex items-center gap-1 bg-slate-900/90 backdrop-blur-xs text-white px-2 py-1 rounded-md text-xs shadow-lg pointer-events-auto whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onReorderElement(element.id, 'forward');
                        }}
                        title="Bring Forward"
                        className="p-1 hover:bg-slate-700 rounded transition-colors"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onReorderElement(element.id, 'backward');
                        }}
                        title="Send Backward"
                        className="p-1 hover:bg-slate-700 rounded transition-colors"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDuplicateElement(element.id);
                        }}
                        title="Duplicate"
                        className="p-1 hover:bg-slate-700 rounded transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteElement(element.id);
                        }}
                        title="Delete (Backspace/Del)"
                        className="p-1 hover:bg-rose-600 text-rose-300 hover:text-white rounded transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Corner Resize Handles */}
                    <div
                      onPointerDown={(e) => handleResizePointerDown(e, 'nw')}
                      className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 bg-white border-2 border-amber-500 rounded-full cursor-nwse-resize pointer-events-auto hover:scale-125 transition-transform"
                    />
                    <div
                      onPointerDown={(e) => handleResizePointerDown(e, 'ne')}
                      className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-white border-2 border-amber-500 rounded-full cursor-nesw-resize pointer-events-auto hover:scale-125 transition-transform"
                    />
                    <div
                      onPointerDown={(e) => handleResizePointerDown(e, 'se')}
                      className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 bg-white border-2 border-amber-500 rounded-full cursor-nwse-resize pointer-events-auto hover:scale-125 transition-transform"
                    />
                    <div
                      onPointerDown={(e) => handleResizePointerDown(e, 'sw')}
                      className="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 bg-white border-2 border-amber-500 rounded-full cursor-nesw-resize pointer-events-auto hover:scale-125 transition-transform"
                    />

                    {/* Edge Resize Handles */}
                    <div
                      onPointerDown={(e) => handleResizePointerDown(e, 'n')}
                      className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-2 bg-white border border-amber-500 rounded-xs cursor-ns-resize pointer-events-auto"
                    />
                    <div
                      onPointerDown={(e) => handleResizePointerDown(e, 's')}
                      className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-2 bg-white border border-amber-500 rounded-xs cursor-ns-resize pointer-events-auto"
                    />
                    <div
                      onPointerDown={(e) => handleResizePointerDown(e, 'w')}
                      className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-2 h-3 bg-white border border-amber-500 rounded-xs cursor-ew-resize pointer-events-auto"
                    />
                    <div
                      onPointerDown={(e) => handleResizePointerDown(e, 'e')}
                      className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-2 h-3 bg-white border border-amber-500 rounded-xs cursor-ew-resize pointer-events-auto"
                    />
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};
