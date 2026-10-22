import React from 'react';
import { ShapeElement } from '../../types/diary';

interface ShapeRendererProps {
  element: ShapeElement;
}

export const ShapeRenderer: React.FC<ShapeRendererProps> = ({ element }) => {
  const { shapeType, fillColor, strokeColor, strokeWidth, strokeStyle } = element;

  const strokeDash = 
    strokeStyle === 'dashed' ? '8 4' : 
    strokeStyle === 'dotted' ? '3 3' : 
    undefined;

  switch (shapeType) {
    case 'rectangle':
      return (
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full select-none pointer-events-none">
          <rect
            x={strokeWidth}
            y={strokeWidth}
            width={100 - strokeWidth * 2}
            height={100 - strokeWidth * 2}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDash}
          />
        </svg>
      );

    case 'rounded-rect':
      return (
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full select-none pointer-events-none">
          <rect
            x={strokeWidth}
            y={strokeWidth}
            width={100 - strokeWidth * 2}
            height={100 - strokeWidth * 2}
            rx={element.cornerRadius || 16}
            ry={element.cornerRadius || 16}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDash}
          />
        </svg>
      );

    case 'circle':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full select-none pointer-events-none">
          <circle
            cx="50"
            cy="50"
            r={50 - strokeWidth}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDash}
          />
        </svg>
      );

    case 'heart':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full select-none pointer-events-none">
          <path
            d="M50 85 C20 65 5 45 5 26 C5 12 16 5 28 5 C38 5 45 10 50 16 C55 10 62 5 72 5 C84 5 95 12 95 26 C95 45 80 65 50 85 Z"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDash}
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'star':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full select-none pointer-events-none">
          <polygon
            points="50,5 64,36 98,39 72,61 80,95 50,77 20,95 28,61 2,39 36,36"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDash}
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'badge':
      return (
        <svg viewBox="0 0 140 70" preserveAspectRatio="none" className="w-full h-full select-none pointer-events-none">
          <path
            d="M10 5 L130 5 L120 35 L130 65 L10 65 L20 35 Z"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDash}
          />
        </svg>
      );

    case 'speech-bubble':
      return (
        <svg viewBox="0 0 120 90" preserveAspectRatio="none" className="w-full h-full select-none pointer-events-none">
          <path
            d="M15 10 Q15 5 25 5 L95 5 Q105 5 105 10 L105 55 Q105 60 95 60 L45 60 L25 80 L30 60 L25 60 Q15 60 15 55 Z"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDash}
          />
        </svg>
      );

    case 'washi-tape':
      return (
        <svg viewBox="0 0 150 40" preserveAspectRatio="none" className="w-full h-full select-none pointer-events-none opacity-90">
          <path
            d="M0 3 L4 0 L8 3 L12 0 L142 0 L146 3 L150 0 L147 10 L150 20 L146 30 L150 40 L146 37 L142 40 L8 40 L4 37 L0 40 L3 30 L0 20 L4 10 Z"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
        </svg>
      );

    case 'arrow':
      return (
        <svg viewBox="0 0 120 50" preserveAspectRatio="none" className="w-full h-full select-none pointer-events-none">
          <line
            x1="10"
            y1="25"
            x2="95"
            y2="25"
            stroke={strokeColor}
            strokeWidth={strokeWidth * 1.5 || 3}
            strokeDasharray={strokeDash}
          />
          <polygon
            points="90,12 110,25 90,38"
            fill={fillColor || strokeColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
        </svg>
      );

    case 'underline':
      return (
        <svg viewBox="0 0 120 20" preserveAspectRatio="none" className="w-full h-full select-none pointer-events-none">
          <path
            d="M5 12 Q35 4 65 14 T115 10"
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth * 1.5 || 3}
            strokeDasharray={strokeDash}
            strokeLinecap="round"
          />
        </svg>
      );

    default:
      return (
        <div
          className="w-full h-full"
          style={{
            backgroundColor: fillColor,
            border: `${strokeWidth}px ${strokeStyle} ${strokeColor}`
          }}
        />
      );
  }
};
