import React from 'react';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  cmsOpen: boolean;
  onToggleCms: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  cmsOpen,
  onToggleCms,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800/80 bg-neutral-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => {
            if (cmsOpen) onToggleCms();
            onSelectTab('domov');
          }}
          className="text-xl font-bold tracking-tight text-white whitespace-nowrap shrink-0 hover:text-cyan-400 transition-colors"
        >
          WebKat<span className="text-cyan-400">.si</span>
        </button>

        {/* Zone 2: 4–5 single-line clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-neutral-300">
          <button
            onClick={() => {
              if (cmsOpen) onToggleCms();
              onSelectTab('domov');
            }}
            className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 ${
              currentTab === 'domov' && !cmsOpen
                ? 'text-white border-b-2 border-cyan-400 font-semibold'
                : 'hover:text-white'
            }`}
          >
            Domov
          </button>

          <button
            onClick={() => {
              if (cmsOpen) onToggleCms();
              onSelectTab('blog');
            }}
            className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 ${
              currentTab === 'blog' && !cmsOpen
                ? 'text-white border-b-2 border-cyan-400 font-semibold'
                : 'hover:text-white'
            }`}
          >
            Gaming & Novice
          </button>

          <button
            onClick={() => {
              if (cmsOpen) onToggleCms();
              onSelectTab('storitve');
            }}
            className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 ${
              currentTab === 'storitve' && !cmsOpen
                ? 'text-white border-b-2 border-cyan-400 font-semibold'
                : 'hover:text-white'
            }`}
          >
            Spletni Razvoj
          </button>

          <button
            onClick={() => {
              if (cmsOpen) onToggleCms();
              onSelectTab('kalkulator');
            }}
            className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 ${
              currentTab === 'kalkulator' && !cmsOpen
                ? 'text-white border-b-2 border-cyan-400 font-semibold'
                : 'hover:text-white'
            }`}
          >
            Cene & Hitrost
          </button>

          <button
            onClick={() => {
              if (cmsOpen) onToggleCms();
              onSelectTab('kontakt');
            }}
            className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 ${
              currentTab === 'kontakt' && !cmsOpen
                ? 'text-white border-b-2 border-cyan-400 font-semibold'
                : 'hover:text-white'
            }`}
          >
            Kontakt
          </button>
        </nav>

        {/* Zone 3: Exactly 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onToggleCms}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              cmsOpen
                ? 'bg-neutral-800 text-white hover:bg-neutral-700 border border-neutral-700'
                : 'bg-cyan-500 text-neutral-950 hover:bg-cyan-400'
            }`}
          >
            {cmsOpen ? 'Zapri CMS Urejevalnik' : 'CMS Studio & AI'}
          </button>
        </div>
      </div>
    </header>
  );
};
