import React from 'react';

interface FooterProps {
  onSelectTab: (tab: string) => void;
  onOpenCms: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab, onOpenCms }) => {
  return (
    <footer className="border-t border-neutral-800/80 bg-neutral-950 py-12 text-xs text-neutral-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <div className="text-lg font-bold text-white tracking-tight">
              WebKat<span className="text-cyan-400">.si</span>
            </div>
            <p className="mt-2 text-xs text-neutral-400 max-w-sm">
              Slovenski gaming & developer hub. Sveže novice o videoigrah ter sodobna izdelava spletnih strani z najvišjo stopnjo hitrosti in SEO optimizacije.
            </p>
            <p className="mt-3 text-[11px] text-neutral-500 font-mono">
              WebKat, spletne storitve · Prelska 23, 3320 Velenje, SI
            </p>
          </div>

          <div className="flex flex-wrap gap-8">
            <div>
              <p className="font-semibold text-white uppercase text-[11px] tracking-wider mb-3">Navigacija</p>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => onSelectTab('domov')} className="hover:text-white transition-colors">
                    Domov
                  </button>
                </li>
                <li>
                  <button onClick={() => onSelectTab('blog')} className="hover:text-white transition-colors">
                    Gaming Novice & Blog
                  </button>
                </li>
                <li>
                  <button onClick={() => onSelectTab('storitve')} className="hover:text-white transition-colors">
                    Spletni Razvoj
                  </button>
                </li>
                <li>
                  <button onClick={() => onSelectTab('kalkulator')} className="hover:text-white transition-colors">
                    Cenik & Hitrost
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-semibold text-white uppercase text-[11px] tracking-wider mb-3">Za Avtorje</p>
              <ul className="space-y-2">
                <li>
                  <button onClick={onOpenCms} className="hover:text-cyan-400 transition-colors">
                    CMS Uredništvo & AI
                  </button>
                </li>
                <li>
                  <a href="#blog-section" className="hover:text-white transition-colors">
                    Arhiv novic
                  </a>
                </li>
                <li>
                  <button onClick={() => onSelectTab('kontakt')} className="hover:text-white transition-colors">
                    Prijavi novico
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-semibold text-white uppercase text-[11px] tracking-wider mb-3">Kontakt</p>
              <ul className="space-y-2">
                <li>
                  <a href="mailto:info@webkat.si" className="hover:text-white transition-colors">
                    info@webkat.si
                  </a>
                </li>
                <li>
                  <a href="tel:+38631396710" className="hover:text-white transition-colors">
                    031 396 710
                  </a>
                </li>
                <li>
                  <span className="text-neutral-500">Velenje, Slovenija</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-neutral-900 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <p>© {new Date().getFullYear()} WebKat.si. Vse pravice pridržane.</p>
          <div className="flex items-center gap-4">
            <span>Core Web Vitals 100/100</span>
            <span>·</span>
            <span>React 19 & Tailwind</span>
            <span>·</span>
            <span>SEO Pripravljeno</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
