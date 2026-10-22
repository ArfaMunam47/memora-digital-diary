import React from 'react';
import { StickerElement } from '../../types/diary';

interface StickerRendererProps {
  element: StickerElement;
}

export const StickerRenderer: React.FC<StickerRendererProps> = ({ element }) => {
  const primary = element.primaryColor || '#F43F5E';
  const secondary = element.secondaryColor || '#FCD34D';

  switch (element.stickerKey) {
    case 'star-sparkle':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm select-none pointer-events-none">
          <path
            d="M50 5 Q52 40 85 50 Q52 60 50 95 Q48 60 15 50 Q48 40 50 5 Z"
            fill={primary}
            stroke="#ffffff"
            strokeWidth="2"
          />
          <circle cx="50" cy="50" r="4" fill="#ffffff" />
          <circle cx="82" cy="20" r="3" fill={secondary} />
          <circle cx="20" cy="78" r="3" fill={secondary} />
        </svg>
      );

    case 'star-handdrawn':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm select-none pointer-events-none">
          <polygon
            points="50,10 61,38 91,40 68,59 75,89 50,73 25,89 32,59 9,40 39,38"
            fill={primary}
            stroke="#333333"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <polygon
            points="48,16 57,38 82,40 63,56 68,81 48,68 28,81 34,56 16,40 40,38"
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeDasharray="4 2"
          />
        </svg>
      );

    case 'star-cluster':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm select-none pointer-events-none">
          <polygon points="50,15 58,35 80,38 64,52 69,74 50,62 31,74 36,52 20,38 42,35" fill={primary} />
          <polygon points="80,65 84,75 95,76 87,83 89,94 80,88 71,94 73,83 65,76 76,75" fill={secondary} />
          <polygon points="20,20 23,28 32,29 25,35 27,44 20,39 13,44 15,35 8,29 17,28" fill={secondary} />
        </svg>
      );

    case 'heart-sketch':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm select-none pointer-events-none">
          <path
            d="M50 82 C22 64 10 46 10 29 C10 16 20 8 32 8 C41 8 46 13 50 18 C54 13 59 8 68 8 C80 8 90 16 90 29 C90 46 78 64 50 82 Z"
            fill={primary}
            stroke="#ffffff"
            strokeWidth="3"
          />
          <path
            d="M32 18 C25 18 20 23 20 30"
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      );

    case 'heart-double':
      return (
        <svg viewBox="0 0 120 100" className="w-full h-full drop-shadow-sm select-none pointer-events-none">
          <path
            d="M75 75 C53 60 44 45 44 32 C44 21 52 14 62 14 C70 14 74 18 77 22 C80 18 84 14 92 14 C102 14 110 21 110 32 C110 45 100 60 75 75 Z"
            fill={secondary}
            stroke="#ffffff"
            strokeWidth="2"
          />
          <path
            d="M45 85 C23 70 14 55 14 42 C14 31 22 24 32 24 C40 24 44 28 47 32 C50 28 54 24 62 24 C72 24 80 31 80 42 C80 55 70 70 45 85 Z"
            fill={primary}
            stroke="#ffffff"
            strokeWidth="3"
          />
        </svg>
      );

    case 'flower-daisy':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm select-none pointer-events-none">
          <g transform="translate(50,50)">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
              <ellipse
                key={angle}
                cx="0"
                cy="-26"
                rx="10"
                ry="18"
                fill="#ffffff"
                stroke={primary}
                strokeWidth="2"
                transform={`rotate(${angle})`}
              />
            ))}
            <circle cx="0" cy="0" r="14" fill={secondary} stroke="#B45309" strokeWidth="2" />
          </g>
        </svg>
      );

    case 'flower-rose':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm select-none pointer-events-none">
          <circle cx="50" cy="50" r="38" fill={primary} opacity="0.9" />
          <path
            d="M32 40 C32 26 68 26 68 40 C68 55 45 60 45 70"
            fill="none"
            stroke="#ffffff"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M40 50 C55 42 60 62 48 68"
            fill="none"
            stroke="#ffffff"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <circle cx="50" cy="50" r="8" fill="#FDE047" />
        </svg>
      );

    case 'botanical-leaf':
      return (
        <svg viewBox="0 0 100 150" className="w-full h-full drop-shadow-sm select-none pointer-events-none">
          <path d="M50 140 Q52 70 50 10" stroke="#065F46" strokeWidth="3" fill="none" strokeLinecap="round" />
          {/* Leaves */}
          <path d="M50 110 C30 100 25 80 35 75 C45 75 48 95 50 110 Z" fill={primary} stroke="#065F46" strokeWidth="1.5" />
          <path d="M50 90 C70 80 75 60 65 55 C55 55 52 75 50 90 Z" fill={primary} stroke="#065F46" strokeWidth="1.5" />
          <path d="M50 60 C30 50 25 30 35 25 C45 25 48 45 50 60 Z" fill={primary} stroke="#065F46" strokeWidth="1.5" />
          <path d="M50 40 C70 30 75 10 65 5 C55 5 52 25 50 40 Z" fill={primary} stroke="#065F46" strokeWidth="1.5" />
        </svg>
      );

    case 'bow-cute':
      return (
        <svg viewBox="0 0 120 90" className="w-full h-full drop-shadow-sm select-none pointer-events-none">
          {/* Left loop */}
          <path d="M60 40 C40 10 10 15 10 38 C10 60 42 45 60 40 Z" fill={primary} stroke="#BE185D" strokeWidth="2.5" />
          {/* Right loop */}
          <path d="M60 40 C80 10 110 15 110 38 C110 60 78 45 60 40 Z" fill={primary} stroke="#BE185D" strokeWidth="2.5" />
          {/* Ribbons hanging */}
          <path d="M55 45 C45 65 30 80 20 85 L35 83 L40 70 L55 45 Z" fill={primary} stroke="#BE185D" strokeWidth="2" />
          <path d="M65 45 C75 65 90 80 100 85 L85 83 L80 70 L65 45 Z" fill={primary} stroke="#BE185D" strokeWidth="2" />
          {/* Knot */}
          <ellipse cx="60" cy="40" rx="9" ry="8" fill="#F472B6" stroke="#BE185D" strokeWidth="2.5" />
        </svg>
      );

    case 'ribbon-banner':
      return (
        <svg viewBox="0 0 180 60" className="w-full h-full drop-shadow-sm select-none pointer-events-none">
          <path d="M20 15 L160 15 L150 30 L160 45 L20 45 L30 30 Z" fill={primary} stroke="#9D174D" strokeWidth="2" />
          <line x1="38" y1="20" x2="142" y2="20" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="38" y1="40" x2="142" y2="40" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="3 3" />
        </svg>
      );

    case 'washi-rose':
      return (
        <svg viewBox="0 0 160 45" className="w-full h-full drop-shadow-sm select-none pointer-events-none opacity-90">
          <defs>
            <pattern id={`stripe-${element.id}`} width="16" height="16" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="16" stroke="#F43F5E" strokeWidth="5" opacity="0.4" />
            </pattern>
          </defs>
          {/* jagged edges washi tape */}
          <path
            d="M0 4 L4 0 L8 4 L12 0 L160 0 L156 4 L160 8 L156 12 L160 16 L156 20 L160 24 L156 28 L160 32 L156 36 L160 40 L156 45 L0 45 L4 40 L0 36 L4 32 L0 28 L4 24 L0 20 L4 16 L0 12 L4 8 Z"
            fill={primary}
          />
          <path
            d="M0 4 L4 0 L8 4 L12 0 L160 0 L156 4 L160 8 L156 12 L160 16 L156 20 L160 24 L156 28 L160 32 L156 36 L160 40 L156 45 L0 45 L4 40 L0 36 L4 32 L0 28 L4 24 L0 20 L4 16 L0 12 L4 8 Z"
            fill={`url(#stripe-${element.id})`}
          />
        </svg>
      );

    case 'washi-sage':
      return (
        <svg viewBox="0 0 160 45" className="w-full h-full drop-shadow-sm select-none pointer-events-none opacity-90">
          <path
            d="M2 0 L158 0 L160 5 L156 10 L160 15 L157 20 L160 25 L156 30 L160 35 L158 45 L2 45 L0 40 L4 35 L0 30 L4 25 L0 20 L4 15 L0 10 L4 5 Z"
            fill={primary}
          />
          <circle cx="30" cy="22" r="5" fill="#047857" opacity="0.4" />
          <circle cx="60" cy="22" r="5" fill="#047857" opacity="0.4" />
          <circle cx="90" cy="22" r="5" fill="#047857" opacity="0.4" />
          <circle cx="120" cy="22" r="5" fill="#047857" opacity="0.4" />
        </svg>
      );

    case 'washi-kraft':
      return (
        <svg viewBox="0 0 150 40" className="w-full h-full drop-shadow-sm select-none pointer-events-none opacity-95">
          <path
            d="M0 2 L4 0 L146 0 L150 4 L147 12 L150 20 L146 28 L150 36 L147 40 L0 40 L3 32 L0 24 L4 16 L0 8 Z"
            fill={primary}
            stroke="#92400E"
            strokeWidth="0.5"
          />
          <line x1="12" y1="20" x2="138" y2="20" stroke="#78350F" strokeWidth="1" strokeDasharray="6 4" opacity="0.3" />
        </svg>
      );

    case 'washi-grid':
      return (
        <svg viewBox="0 0 160 45" className="w-full h-full drop-shadow-sm select-none pointer-events-none opacity-90">
          <rect x="0" y="0" width="160" height="45" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1" />
          <line x1="0" y1="15" x2="160" y2="15" stroke="#94A3B8" strokeWidth="0.8" opacity="0.5" />
          <line x1="0" y1="30" x2="160" y2="30" stroke="#94A3B8" strokeWidth="0.8" opacity="0.5" />
          {[20, 40, 60, 80, 100, 120, 140].map((x) => (
            <line key={x} x1={x} y1="0" x2={x} y2="45" stroke="#94A3B8" strokeWidth="0.8" opacity="0.5" />
          ))}
        </svg>
      );

    case 'arrow-scribble':
      return (
        <svg viewBox="0 0 120 60" className="w-full h-full drop-shadow-sm select-none pointer-events-none">
          <path
            d="M15 45 C40 10 80 15 100 35"
            fill="none"
            stroke={primary}
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M85 32 L100 35 L96 20"
            fill="none"
            stroke={primary}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'arrow-pointer':
      return (
        <svg viewBox="0 0 120 50" className="w-full h-full drop-shadow-sm select-none pointer-events-none">
          <line x1="10" y1="25" x2="95" y2="25" stroke={primary} strokeWidth="4" strokeLinecap="round" />
          <polyline points="80,12 98,25 80,38" fill="none" stroke={primary} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case 'underline-swirl':
      return (
        <svg viewBox="0 0 140 30" className="w-full h-full select-none pointer-events-none">
          <path
            d="M10 18 C40 8 70 28 100 15 C115 8 128 18 135 15"
            fill="none"
            stroke={primary}
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'underline-zigzag':
      return (
        <svg viewBox="0 0 140 30" className="w-full h-full select-none pointer-events-none">
          <polyline
            points="5,15 15,22 25,12 35,22 45,12 55,22 65,12 75,22 85,12 95,22 105,12 115,22 125,12 135,22"
            fill="none"
            stroke={primary}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'speech-bubble-cute':
      return (
        <svg viewBox="0 0 120 90" className="w-full h-full drop-shadow-sm select-none pointer-events-none">
          <path
            d="M20 15 Q20 5 35 5 L85 5 Q100 5 100 15 L100 55 Q100 65 85 65 L45 65 L25 82 L30 65 L35 65 Q20 65 20 55 Z"
            fill={primary}
            stroke="#ffffff"
            strokeWidth="2.5"
          />
          <circle cx="45" cy="35" r="4" fill="#ffffff" />
          <circle cx="60" cy="35" r="4" fill="#ffffff" />
          <circle cx="75" cy="35" r="4" fill="#ffffff" />
        </svg>
      );

    case 'stamp-postage':
      return (
        <svg viewBox="0 0 90 110" className="w-full h-full drop-shadow-sm select-none pointer-events-none">
          <rect x="5" y="5" width="80" height="100" fill="#FFFDF8" stroke={primary} strokeWidth="1.5" strokeDasharray="3 3" />
          <rect x="12" y="12" width="66" height="86" fill={primary} opacity="0.15" />
          <circle cx="45" cy="55" r="22" fill="none" stroke={primary} strokeWidth="1.5" strokeDasharray="4 2" />
          <text x="45" y="52" textAnchor="middle" fontSize="10" fontWeight="bold" fill={primary} fontFamily="serif">AIR MAIL</text>
          <text x="45" y="65" textAnchor="middle" fontSize="9" fill={primary} fontFamily="monospace">POST 1928</text>
        </svg>
      );

    case 'badge-award':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm select-none pointer-events-none">
          <g transform="translate(50,50)">
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((rot) => (
              <circle key={rot} cx="0" cy="-35" r="7" fill={primary} transform={`rotate(${rot})`} />
            ))}
            <circle cx="0" cy="0" r="35" fill={primary} />
            <circle cx="0" cy="0" r="28" fill="#ffffff" />
            <text x="0" y="5" textAnchor="middle" fontSize="14" fontWeight="bold" fill={primary} fontFamily="sans-serif">★</text>
          </g>
        </svg>
      );

    default:
      return (
        <div className="w-full h-full flex items-center justify-center bg-rose-100 rounded text-rose-600 font-bold text-xs">
          ★
        </div>
      );
  }
};
