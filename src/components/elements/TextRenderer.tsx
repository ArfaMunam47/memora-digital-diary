import React, { useState, useEffect, useRef } from 'react';
import { TextElement } from '../../types/diary';

interface TextRendererProps {
  element: TextElement;
  onUpdateContent?: (content: string) => void;
  isSelected?: boolean;
}

export const TextRenderer: React.FC<TextRendererProps> = ({
  element,
  onUpdateContent,
  isSelected
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(element.content);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setEditValue(element.content);
  }, [element.content]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    if (editValue !== element.content && onUpdateContent) {
      onUpdateContent(editValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // If Escape, discard or save
    if (e.key === 'Escape') {
      setIsEditing(false);
      if (onUpdateContent) onUpdateContent(editValue);
    }
    // Allow enter for multiline text
  };

  const fontStyleObj: React.CSSProperties = {
    fontFamily: element.fontFamily || 'Caveat',
    fontSize: `${element.fontSize}px`,
    fontWeight: element.fontWeight || 'normal',
    fontStyle: element.fontStyle || 'normal',
    color: element.color || '#1e293b',
    textAlign: element.textAlign || 'left',
    lineHeight: element.lineHeight || 1.3,
    letterSpacing: `${element.letterSpacing || 0}px`,
    backgroundColor: element.backgroundColor || 'transparent',
    padding: element.padding ? `${element.padding}px` : '4px',
    borderRadius: element.borderRadius ? `${element.borderRadius}px` : undefined,
  };

  if (isEditing) {
    return (
      <textarea
        ref={textareaRef}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="w-full h-full resize-none border-none outline-none ring-2 ring-amber-500 rounded bg-white/90 shadow-sm"
        style={fontStyleObj}
      />
    );
  }

  return (
    <div
      onDoubleClick={(e) => {
        e.stopPropagation();
        setIsEditing(true);
      }}
      className="w-full h-full select-none cursor-text whitespace-pre-wrap break-words overflow-hidden"
      style={fontStyleObj}
      title="Double-click to edit text"
    >
      {element.content || 'Click to type...'}
    </div>
  );
};
