import React from 'react';
import { ArrowRight, Sparkles, Zap, ShieldCheck, Terminal } from 'lucide-react';

interface HeroProps {
  onExploreBlog: () => void;
  onExploreServices: () => void;
  onOpenCms: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreBlog,
  onExploreServices,
  onOpenCms,
}) => {
  return (
    <section className="relative overflow-hidden border-b border-neutral-800/80 bg-neutral-950 py-16 sm:py-24">
      {/* Subtle ambient gradient mesh */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-cyan-500/10 via-purple-500/5 to-transparent blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold tracking-wider text-cyan-400 uppercase">
            WebKat.si · Gaming Magazin & Spletni Razvoj
          </p>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl text-balance leading-tight">
            Kjer se srečata strast do iger in bliskovit spletni razvoj
          </h1>

          <p className="mt-6 text-base sm:text-lg text-neutral-300 leading-relaxed text-balance">
            Najnovejše analize iz sveta videoiger (GTA VI, EA Sports FC 26, Battlefield 6) ter izdelava sodobnih spletnih strani nove generacije s 100/100 hitrostjo nalaganja, naprednim SEO in enostavnim vzdrževanjem.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={onExploreBlog}
              className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-3 text-sm font-semibold text-neutral-950 transition-colors hover:bg-orange-400"
            >
              <span>Preberi Novice & Blog</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onExploreServices}
              className="inline-flex items-center gap-2 rounded-lg border border-neutral-700 bg-neutral-900 px-5 py-3 text-sm font-semibold text-neutral-100 transition-colors hover:bg-neutral-800"
            >
              <span>Izdelava Spletne Strani</span>
            </button>

            <button
              onClick={onOpenCms}
              className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-cyan-400 transition-colors py-2 px-3"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Odpri Urejevalnik Vsebin (CMS)</span>
            </button>
          </div>
        </div>

        {/* 4-Item Proof Strip (Claim-to-Proof Adjacency) */}
        <div className="mt-16 grid grid-cols-2 gap-4 border-t border-neutral-800 pt-8 sm:grid-cols-4 lg:gap-8">
          <div className="rounded-xl border border-neutral-800/80 bg-neutral-900/40 p-4">
            <div className="flex items-center gap-2 text-cyan-400">
              <Zap className="w-4 h-4" />
              <span className="font-mono text-xl font-bold tabular-nums text-white">100/100</span>
            </div>
            <p className="mt-1 text-xs text-neutral-400">Google PageSpeed indeks hitrosti</p>
          </div>

          <div className="rounded-xl border border-neutral-800/80 bg-neutral-900/40 p-4">
            <div className="flex items-center gap-2 text-emerald-400">
              <Sparkles className="w-4 h-4" />
              <span className="font-mono text-xl font-bold tabular-nums text-white">&lt; 0.8s</span>
            </div>
            <p className="mt-1 text-xs text-neutral-400">Povprečen čas odpiranja strani</p>
          </div>

          <div className="rounded-xl border border-neutral-800/80 bg-neutral-900/40 p-4">
            <div className="flex items-center gap-2 text-purple-400">
              <ShieldCheck className="w-4 h-4" />
              <span className="font-mono text-xl font-bold tabular-nums text-white">100% SEO</span>
            </div>
            <p className="mt-1 text-xs text-neutral-400">Strukturirani podatki & optimizacija</p>
          </div>

          <div className="rounded-xl border border-neutral-800/80 bg-neutral-900/40 p-4">
            <div className="flex items-center gap-2 text-amber-400">
              <span className="font-mono text-xl font-bold tabular-nums text-white">Velenje, SI</span>
            </div>
            <p className="mt-1 text-xs text-neutral-400">Slovenska ekipa & zanesljiva podpora</p>
          </div>
        </div>
      </div>
    </section>
  );
};
