import React from 'react';

// Hand-drawn oval highlight around "Get Placed."
export const OvalHighlightDoodle: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 220 70"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`absolute pointer-events-none ${className}`}
  >
    <path
      d="M 15 35 C 12 18, 55 8, 115 8 C 175 8, 208 18, 205 36 C 202 54, 155 62, 100 62 C 45 62, 8 52, 16 30 C 20 20, 52 11, 98 9"
      stroke="#7C3AED"
      strokeWidth="2.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.9"
    />
  </svg>
);

// Curved arrow pointing to "Let's get you Placement Ready!"
export const HeaderCurvedArrowDoodle: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 80 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`pointer-events-none ${className}`}
  >
    <path
      d="M 10 38 Q 28 8, 62 14"
      stroke="#1E1B4B"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M 52 8 L 64 14 L 56 22"
      stroke="#1E1B4B"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Curved arrow in sidebar pointing from sticky note to student profile
export const SidebarCurvedArrowDoodle: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 40 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`pointer-events-none ${className}`}
  >
    <path
      d="M 28 4 Q 10 16, 12 36"
      stroke="#6B7280"
      strokeWidth="1.8"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M 6 28 L 12 38 L 20 30"
      stroke="#6B7280"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Hand-drawn notepad doodle in Today's Plan
export const NotepadDoodle: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 48 56"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`pointer-events-none ${className}`}
  >
    {/* Page base */}
    <rect x="4" y="6" width="36" height="44" rx="4" stroke="#1F2937" strokeWidth="2" fill="#FFFFFF" />
    {/* Spiral binding rings at top */}
    <circle cx="12" cy="6" r="2" fill="#1F2937" />
    <circle cx="22" cy="6" r="2" fill="#1F2937" />
    <circle cx="32" cy="6" r="2" fill="#1F2937" />
    {/* Page lines */}
    <line x1="10" y1="18" x2="32" y2="18" stroke="#374151" strokeWidth="2" strokeLinecap="round" />
    <line x1="10" y1="26" x2="30" y2="26" stroke="#374151" strokeWidth="2" strokeLinecap="round" />
    <line x1="10" y1="34" x2="26" y2="34" stroke="#374151" strokeWidth="2" strokeLinecap="round" />
    <line x1="10" y1="42" x2="22" y2="42" stroke="#374151" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// Curved arrow in Upcoming tasks
export const TasksCurvedArrowDoodle: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 50 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`pointer-events-none ${className}`}
  >
    <path
      d="M 38 42 C 44 26, 35 12, 14 10"
      stroke="#374151"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M 22 4 L 12 10 L 20 18"
      stroke="#374151"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Hand-drawn trend graph doodle in motivational card
export const TrendGraphDoodle: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 60 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`pointer-events-none ${className}`}
  >
    {/* Axis lines */}
    <path d="M 6 42 L 54 42" stroke="#1F2937" strokeWidth="2" strokeLinecap="round" />
    <path d="M 6 42 L 6 8" stroke="#1F2937" strokeWidth="2" strokeLinecap="round" />
    {/* Trend line going up */}
    <path
      d="M 12 36 L 22 28 L 32 32 L 48 12"
      stroke="#1F2937"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Arrowhead */}
    <path
      d="M 40 12 L 49 11 L 47 20"
      stroke="#1F2937"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Star sparkle */}
    <path
      d="M 46 4 L 47 7 L 50 8 L 47 9 L 46 12 L 45 9 L 42 8 L 45 7 Z"
      fill="#F59E0B"
    />
  </svg>
);

// Graduation cap doodle
export const GraduationCapDoodle: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 60 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`pointer-events-none ${className}`}
  >
    {/* Cap top diamond */}
    <path
      d="M 30 6 L 54 18 L 30 30 L 6 18 Z"
      fill="#4338CA"
      stroke="#1E1B4B"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    {/* Cap skull cap under */}
    <path
      d="M 18 24 L 18 36 C 18 42, 42 42, 42 36 L 42 24"
      fill="#312E81"
      stroke="#1E1B4B"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    {/* Tassel */}
    <path
      d="M 46 22 L 48 34"
      stroke="#F59E0B"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    <circle cx="48" cy="36" r="2.5" fill="#F59E0B" />
  </svg>
);

// Hand-drawn expressive underline doodle for headings
export const HandDrawnUnderlineDoodle: React.FC<{ className?: string; color?: string }> = ({
  className = '',
  color = '#8057F5'
}) => (
  <svg
    viewBox="0 0 240 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`pointer-events-none ${className}`}
  >
    <path
      d="M 4 14 C 45 6, 120 18, 236 8"
      stroke={color}
      strokeWidth="3.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.85"
    />
    <path
      d="M 18 20 C 65 15, 140 22, 218 16"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      opacity="0.6"
    />
  </svg>
);

// Hand-drawn 4-point doodle star
export const HandDrawnStarDoodle: React.FC<{ className?: string; color?: string }> = ({
  className = '',
  color = '#F59E0B'
}) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`pointer-events-none ${className}`}
  >
    <path
      d="M 16 2 C 16 10, 22 16, 30 16 C 22 16, 16 22, 16 30 C 16 22, 10 16, 2 16 C 10 16, 16 10, 16 2 Z"
      fill={color}
    />
  </svg>
);

// Washi Tape strip for sticky notes (Figma craft style)
export const StickyNoteTape: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div
    className={`absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-amber-100/80 dark:bg-amber-900/40 border-t border-b border-amber-200/60 dark:border-amber-700/50 backdrop-blur-xs transform -rotate-2 pointer-events-none shadow-xs rounded-[2px] ${className}`}
  >
    <div className="absolute inset-y-0 left-0 w-1 border-r border-dashed border-amber-300/60" />
    <div className="absolute inset-y-0 right-0 w-1 border-l border-dashed border-amber-300/60" />
  </div>
);

// Figma Multiplayer Cursor Badge
export const FigmaCursorBadge: React.FC<{
  name: string;
  color?: string;
  className?: string;
}> = ({ name, color = '#8057F5', className = '' }) => (
  <div className={`inline-flex items-center space-x-1.5 pointer-events-none select-none ${className}`}>
    <svg width="14" height="18" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M 1 1 L 6 16 L 8.5 10 L 13.5 8 Z"
        fill={color}
        stroke="#FFFFFF"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
    <span
      className="text-[10px] font-bold px-2 py-0.5 rounded-md text-white shadow-xs whitespace-nowrap"
      style={{ backgroundColor: color }}
    >
      {name}
    </span>
  </div>
);

// Curved arrow doodle pointing right or down
export const DynamicCurvedArrowDoodle: React.FC<{
  className?: string;
  color?: string;
  direction?: 'right' | 'down';
}> = ({ className = '', color = '#4A4D68', direction = 'right' }) => (
  <svg
    viewBox="0 0 60 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`pointer-events-none ${className}`}
  >
    {direction === 'right' ? (
      <>
        <path
          d="M 6 28 C 22 10, 42 12, 54 22"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 44 26 L 55 23 L 50 14"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    ) : (
      <>
        <path
          d="M 12 4 C 18 20, 32 30, 48 34"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 38 36 L 49 35 L 46 25"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    )}
  </svg>
);

// Beautiful SVG Laptop Illustration with Floating Pastel Tags matching the Figma board
export const LaptopHeroIllustration: React.FC = () => {
  return (
    <div className="relative w-full max-w-[340px] md:max-w-[420px] h-[240px] md:h-[280px] flex items-center justify-center select-none">
      {/* Floating Tag: Better Skills (Sky Blue) */}
      <div className="absolute -top-1 left-4 md:left-8 z-20 animate-bounce duration-1000">
        <div className="px-3.5 py-1.5 rounded-full bg-[#E0F2FE] border border-[#BAE6FD] text-[#0369A1] text-xs font-bold shadow-sm whitespace-nowrap transform -rotate-3 hover:rotate-0 transition-transform cursor-default flex items-center space-x-1">
          <span>✨</span>
          <span>Better Skills</span>
        </div>
      </div>

      {/* Floating Tag: More Opportunities (Mint Green) */}
      <div className="absolute top-28 -left-2 md:left-2 z-20">
        <div className="px-3 py-1.5 rounded-full bg-[#DCFCE7] border border-[#BBF7D0] text-[#15803D] text-xs font-bold shadow-sm whitespace-nowrap transform -rotate-2 hover:rotate-0 transition-transform cursor-default flex items-center space-x-1">
          <span>🎯</span>
          <span>More Opportunities</span>
        </div>
      </div>

      {/* Floating Tag: Higher Success Rate (Coral Pink) */}
      <div className="absolute top-24 -right-2 md:right-4 z-20">
        <div className="px-3.5 py-1.5 rounded-full bg-[#FFE4E6] border border-[#FECDD3] text-[#BE123C] text-xs font-bold shadow-sm whitespace-nowrap transform rotate-3 hover:rotate-0 transition-transform cursor-default flex items-center space-x-1">
          <span>🚀</span>
          <span>Higher Success Rate</span>
        </div>
      </div>

      {/* Floating Graduation Cap Doodle */}
      <div className="absolute top-2 right-12 md:right-16 z-20 transform rotate-12 hover:scale-110 transition-transform">
        <GraduationCapDoodle className="w-12 h-12" />
      </div>

      {/* Little Doodle Sparkles / Rays */}
      <div className="absolute top-16 left-24 text-slate-800 dark:text-slate-300 font-bold text-xs select-none pointer-events-none">
        \ | /
      </div>
      <div className="absolute bottom-8 right-16 text-amber-500 font-bold text-sm select-none pointer-events-none">
        ✦
      </div>
      <div className="absolute top-8 left-48 text-indigo-400 font-bold text-xs select-none pointer-events-none">
        ★
      </div>

      {/* The Central Laptop Vector */}
      <div className="relative z-10 w-[240px] sm:w-[280px] md:w-[320px] flex flex-col items-center">
        {/* Screen Bezel */}
        <div className="w-[220px] sm:w-[260px] md:w-[290px] h-[135px] sm:h-[160px] md:h-[175px] bg-[#1E2433] rounded-t-2xl p-2 sm:p-2.5 shadow-xl border-2 border-[#2D3748] relative flex flex-col">
          {/* Webcam dot */}
          <div className="w-1.5 h-1.5 bg-slate-500 rounded-full mx-auto mb-1 opacity-70" />

          {/* Screen Content */}
          <div className="flex-1 bg-gradient-to-b from-[#F8FAFC] to-[#EFF6FF] rounded-lg border border-slate-300/80 p-3 sm:p-4 flex flex-col items-center justify-center relative overflow-hidden shadow-inner">
            {/* Top Browser Dots */}
            <div className="absolute top-2 left-2.5 flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </div>

            {/* Screen Banner: GOOD JOBS + Smiley */}
            <div className="flex flex-col items-center space-y-1">
              <div className="text-[13px] sm:text-base font-black tracking-wider text-slate-900 uppercase">
                Good Jobs
              </div>
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#FEF08A] border-2 border-slate-800 flex items-center justify-center shadow-xs">
                {/* Friendly Smile Face */}
                <svg viewBox="0 0 32 32" className="w-6 h-6 fill-none stroke-slate-900" strokeWidth="2.5">
                  <circle cx="10" cy="12" r="1.5" fill="#1E293B" />
                  <circle cx="22" cy="12" r="1.5" fill="#1E293B" />
                  <path d="M 8 18 Q 16 26, 24 18" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Laptop Base / Keyboard */}
        <div className="w-[250px] sm:w-[295px] md:w-[335px] h-[16px] sm:h-[18px] bg-[#334155] rounded-b-xl border-t border-slate-600 shadow-2xl relative flex items-center justify-center">
          {/* Trackpad notch */}
          <div className="w-16 sm:w-20 h-1.5 bg-slate-500/70 rounded-full" />
        </div>
        {/* Laptop Table Shadow */}
        <div className="w-[230px] sm:w-[270px] md:w-[310px] h-3 bg-slate-900/10 rounded-full blur-md -mt-1" />
      </div>
    </div>
  );
};
