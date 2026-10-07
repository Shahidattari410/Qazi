import React from 'react';

interface EmblemProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

export const Emblem: React.FC<EmblemProps> = ({ size = 64, className = '', showText = false }) => {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 hover:rotate-3"
      >
        <defs>
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#DFBA4E" />
            <stop offset="50%" stopColor="#FFF2B2" />
            <stop offset="100%" stopColor="#B38918" />
          </linearGradient>

          <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#087443" />
            <stop offset="100%" stopColor="#044125" />
          </linearGradient>

          <linearGradient id="royalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#243B80" />
            <stop offset="100%" stopColor="#142149" />
          </linearGradient>

          <filter id="shadowFilter" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Outer 16-point geometric Islamic star rosette ring */}
        <circle cx="80" cy="80" r="76" stroke="url(#goldGrad)" strokeWidth="2.5" />
        <circle cx="80" cy="80" r="71" stroke="#087443" strokeWidth="1" strokeDasharray="3 3" />

        {/* Deep Emerald Background with subtle inner shadow */}
        <circle cx="80" cy="80" r="68" fill="url(#emeraldGrad)" filter="url(#shadowFilter)" />

        {/* Decorative inner circular gold bead ring */}
        <circle cx="80" cy="80" r="62" stroke="url(#goldGrad)" strokeWidth="1.5" />

        {/* Mihrab / Islamic Arch shape */}
        <path
          d="M 46 118 L 46 72 C 46 54 60 40 80 34 C 100 40 114 54 114 72 L 114 118 Z"
          fill="url(#royalGrad)"
          stroke="url(#goldGrad)"
          strokeWidth="1.5"
        />

        {/* Inner Arch Accent */}
        <path
          d="M 52 118 L 52 74 C 52 60 64 48 80 43 C 96 48 108 60 108 74 L 108 118 Z"
          fill="#18221D"
          opacity="0.3"
        />

        {/* Open Book of Law & Nikah Record */}
        <path
          d="M 80 84 C 73 80 62 81 53 85 L 53 109 C 62 105 73 104 80 108 C 87 104 98 105 107 109 L 107 85 C 98 81 87 80 80 84 Z"
          fill="#FFFDF5"
          stroke="url(#goldGrad)"
          strokeWidth="1.5"
        />
        {/* Book spine line */}
        <line x1="80" y1="84" x2="80" y2="108" stroke="#087443" strokeWidth="1.5" />
        {/* Book text markings */}
        <line x1="58" y1="91" x2="74" y2="90" stroke="#243B80" strokeWidth="1" strokeLinecap="round" />
        <line x1="58" y1="96" x2="74" y2="95" stroke="#243B80" strokeWidth="1" strokeLinecap="round" />
        <line x1="58" y1="101" x2="71" y2="100" stroke="#243B80" strokeWidth="1" strokeLinecap="round" />

        <line x1="86" y1="90" x2="102" y2="91" stroke="#243B80" strokeWidth="1" strokeLinecap="round" />
        <line x1="86" y1="95" x2="102" y2="96" stroke="#243B80" strokeWidth="1" strokeLinecap="round" />
        <line x1="89" y1="100" x2="102" y2="101" stroke="#243B80" strokeWidth="1" strokeLinecap="round" />

        {/* Islamic Crescent & 8-point Star at apex */}
        <path
          d="M 77 48 C 74 50 74 54 76 56 C 78 58 82 58 84 56 C 81 56 79 53 79 50 C 79 49 78 48 77 48 Z"
          fill="url(#goldGrad)"
        />
        <circle cx="83" cy="49" r="1.5" fill="url(#goldGrad)" />

        {/* Scales of Justice balance symbol behind the book arch */}
        <path
          d="M 70 65 L 90 65 M 80 60 L 80 72"
          stroke="url(#goldGrad)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path d="M 67 68 L 73 68 L 70 73 Z" fill="url(#goldGrad)" />
        <path d="M 87 68 L 93 68 L 90 73 Z" fill="url(#goldGrad)" />

        {/* Lower Seal Ribbon with gold trim */}
        <path
          d="M 40 120 Q 80 128 120 120 L 115 132 Q 80 140 45 132 Z"
          fill="url(#goldGrad)"
          stroke="#947012"
          strokeWidth="0.8"
        />
        {/* Seal Stars */}
        <polygon points="80,127 82,130 85,130 83,132 84,135 80,133 76,135 77,132 75,130 78,130" fill="#087443" />
      </svg>

      {showText && (
        <div className="flex flex-col text-right">
          <span className="font-header-urdu font-bold text-sm md:text-base leading-tight text-emerald-950">
            مولانا قاضی حافظ محمد شاہد عطاری مدنی
          </span>
          <span className="text-[11px] font-semibold text-emerald-700 tracking-wide font-header-urdu leading-tight">
            نکاح خواں (رجسٹرار) · دار القضاء و ریکارڈ کونسل
          </span>
        </div>
      )}
    </div>
  );
};
