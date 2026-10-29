import React from 'react';

interface ThemeCoverProps {
  theme: string;
  category: string;
  className?: string;
  heightClass?: string;
}

export const ThemeCover: React.FC<ThemeCoverProps> = ({
  theme,
  category,
  className = '',
  heightClass = 'h-52',
}) => {
  // Resilient themed visual SVG containers adhering to zero-broken-image policy
  switch (theme) {
    case 'vice':
      return (
        <div className={`relative w-full ${heightClass} overflow-hidden rounded-xl bg-gradient-to-br from-purple-950 via-slate-900 to-pink-950 flex items-center justify-center border border-purple-800/30 ${className}`}>
          {/* Subtle grid and palm silhouette */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ec4899_1px,transparent_1px)] [background-size:16px_16px]"></div>
          <svg className="w-24 h-24 text-pink-400/40 relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 0 0 9-9 9 9 0 0 0-9-9 9 9 0 0 0-9 9 9 9 0 0 0 9 9z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18" />
            <path strokeLinecap="round" strokeLinejoin="round" d="m7 7 10 10" />
            <path strokeLinecap="round" strokeLinejoin="round" d="m17 7-10 10" />
          </svg>
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] text-pink-300/80 font-mono">
            <span>LEONIDA / VICE CITY</span>
            <span>NEXT-GEN ENGINE</span>
          </div>
        </div>
      );

    case 'tactical':
      return (
        <div className={`relative w-full ${heightClass} overflow-hidden rounded-xl bg-gradient-to-br from-neutral-900 via-stone-900 to-amber-950 flex items-center justify-center border border-amber-900/30 ${className}`}>
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:20px_20px]"></div>
          <svg className="w-24 h-24 text-amber-500/40 relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5" />
            <circle cx="12" cy="9" r="3" />
          </svg>
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] text-amber-400/80 font-mono">
            <span>TACTICAL ENGINE 2.0</span>
            <span>SIMULATION DESTRUCTION</span>
          </div>
        </div>
      );

    case 'speed':
      return (
        <div className={`relative w-full ${heightClass} overflow-hidden rounded-xl bg-gradient-to-br from-emerald-950 via-slate-900 to-cyan-950 flex items-center justify-center border border-cyan-800/30 ${className}`}>
          <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#06b6d4_1px,transparent_1px),linear-gradient(to_bottom,#06b6d4_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
          <svg className="w-24 h-24 text-cyan-400/40 relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
          </svg>
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] text-cyan-300/80 font-mono">
            <span>CORE WEB VITALS: 100/100</span>
            <span>SUB-SECOND TTFB</span>
          </div>
        </div>
      );

    case 'code':
    default:
      return (
        <div className={`relative w-full ${heightClass} overflow-hidden rounded-xl bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 flex items-center justify-center border border-blue-800/30 ${className}`}>
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]"></div>
          <svg className="w-24 h-24 text-blue-400/40 relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
          </svg>
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] text-blue-300/80 font-mono">
            <span>REACT 19 / TYPESCRIPT</span>
            <span>SEO STRUCTURED DATA</span>
          </div>
        </div>
      );
  }
};
