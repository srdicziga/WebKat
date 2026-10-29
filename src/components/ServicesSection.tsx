import React, { useState } from 'react';
import { SERVICE_PACKAGES } from '../data/initialPosts';
import {
  Zap,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Cpu,
  BarChart2,
  Gauge,
  Sliders,
} from 'lucide-react';

interface ServicesSectionProps {
  onSelectServiceForInquiry: (serviceName: string, estimatedPrice: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onSelectServiceForInquiry,
}) => {
  // Speed simulator comparison state
  const [activeStack, setActiveStack] = useState<'webkat' | 'legacy'>('webkat');

  // Interactive Price Calculator state
  const [projectType, setProjectType] = useState<'basic' | 'shop' | 'portal' | 'custom'>('basic');
  const [includeBlogCms, setIncludeBlogCms] = useState(true);
  const [includeSeoPro, setIncludeSeoPro] = useState(true);
  const [includeMultiLang, setIncludeMultiLang] = useState(false);
  const [includePayments, setIncludePayments] = useState(false);

  // Price calculations
  const calculateTotal = () => {
    let base = 490;
    let days = 7;
    let typeName = 'Predstavitvena spletna stran';

    if (projectType === 'shop') {
      base = 990;
      days = 16;
      typeName = 'Spletna trgovina';
    } else if (projectType === 'portal') {
      base = 1290;
      days = 21;
      typeName = 'Gaming / Novičarski portal z blogom';
    } else if (projectType === 'custom') {
      base = 1690;
      days = 30;
      typeName = 'Spletna aplikacija po meri';
    }

    if (includeBlogCms && projectType !== 'portal') base += 250;
    if (includeSeoPro) base += 190;
    if (includeMultiLang) {
      base += 200;
      days += 4;
    }
    if (includePayments && projectType !== 'shop') {
      base += 290;
      days += 5;
    }

    return { total: base, days, typeName };
  };

  const calculated = calculateTotal();

  return (
    <section id="services-section" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      {/* Editorial Header */}
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
          Storitve & Izdelava Spletnih Strani
        </p>
        <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl text-balance">
          Sodobne spletne rešitve, ustvarjene za hitrost in rezultate
        </h2>
        <p className="mt-4 text-base text-neutral-300 leading-relaxed text-balance">
          Vsako spletno stran razvijemo z najsodobnejšo arhitekturo brez odvečnega balasta. Rezultat je vrhunska uporabniška izkušnja, takojšnje odpiranje strani ter prva mesta na iskalnikih.
        </p>
      </div>

      {/* Services Grid (Numbered Editorial Style) */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        {SERVICE_PACKAGES.map((pkg) => (
          <div
            key={pkg.id}
            className="relative flex flex-col justify-between rounded-2xl border border-neutral-800/80 bg-neutral-900/40 p-6 sm:p-8 hover:border-neutral-700 transition-all"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-cyan-400 tracking-wider">
                  {pkg.index}. STORITEV
                </span>
                {pkg.badge && (
                  <span className="text-[11px] font-semibold text-cyan-300 bg-cyan-950/60 border border-cyan-800/40 px-2.5 py-0.5 rounded-md">
                    {pkg.badge}
                  </span>
                )}
              </div>

              <h3 className="mt-3 text-xl font-bold text-white">{pkg.title}</h3>
              <p className="mt-1 text-xs text-neutral-400">{pkg.tagline}</p>
              <p className="mt-4 text-xs leading-relaxed text-neutral-300">{pkg.description}</p>

              {/* Feature points */}
              <ul className="mt-6 space-y-2.5 border-t border-neutral-800/80 pt-6">
                {pkg.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-neutral-300">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-cyan-400 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Card footer with price & CTA */}
            <div className="mt-8 border-t border-neutral-800/80 pt-6 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-neutral-500 block">Cena paketa:</span>
                <span className="text-lg font-mono font-bold text-white">{pkg.startingPrice}</span>
              </div>

              <button
                onClick={() => onSelectServiceForInquiry(pkg.title, pkg.startingPrice)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 px-3.5 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-500 hover:text-neutral-950 transition-colors"
              >
                <span>Izberi Ta Paket</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Speed Comparison: WebKat Architecture vs. Bloated Legacy */}
      <div className="mt-20 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 sm:p-10">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
            Primerjava Tehnologije
          </p>
          <h3 className="mt-2 text-2xl font-bold text-white">
            Zakaj WebKat tehnologija deluje do 5x hitreje?
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-neutral-300">
            Preverite razliko med klasičnimi preobremenjenimi sistemi in našo sodobno optimizirano kodo.
          </p>
        </div>

        {/* Toggle switch */}
        <div className="mt-6 inline-flex rounded-lg border border-neutral-800 bg-neutral-950 p-1">
          <button
            onClick={() => setActiveStack('webkat')}
            className={`rounded-md px-4 py-2 text-xs font-semibold transition-colors ${
              activeStack === 'webkat'
                ? 'bg-cyan-500 text-neutral-950'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            WebKat Sodobna Arhitektura (React + Tailwind)
          </button>
          <button
            onClick={() => setActiveStack('legacy')}
            className={`rounded-md px-4 py-2 text-xs font-semibold transition-colors ${
              activeStack === 'legacy'
                ? 'bg-neutral-800 text-white'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Klasične Stranice s 35+ Vtičniki
          </button>
        </div>

        {/* Dynamic Metric Comparison Card */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl border border-neutral-800 bg-neutral-950/80 p-5">
            <div className="flex items-center justify-between text-xs text-neutral-400">
              <span>Google PageSpeed</span>
              <Gauge className="w-4 h-4 text-cyan-400" />
            </div>
            <p className={`mt-2 font-mono text-3xl font-extrabold tabular-nums ${
              activeStack === 'webkat' ? 'text-emerald-400' : 'text-red-400'
            }`}>
              {activeStack === 'webkat' ? '100 / 100' : '38 / 100'}
            </p>
            <p className="mt-1 text-[11px] text-neutral-500">
              {activeStack === 'webkat'
                ? 'Popoln rezultat za mobilno in namizno uvrstitev'
                : 'Google kaznuje počasne strani z nižjim rangom'}
            </p>
          </div>

          <div className="rounded-xl border border-neutral-800 bg-neutral-950/80 p-5">
            <div className="flex items-center justify-between text-xs text-neutral-400">
              <span>Čas do prvega izrisa (FCP / LCP)</span>
              <Zap className="w-4 h-4 text-cyan-400" />
            </div>
            <p className={`mt-2 font-mono text-3xl font-extrabold tabular-nums ${
              activeStack === 'webkat' ? 'text-emerald-400' : 'text-amber-400'
            }`}>
              {activeStack === 'webkat' ? '0.4 sekunde' : '4.6 sekunde'}
            </p>
            <p className="mt-1 text-[11px] text-neutral-500">
              {activeStack === 'webkat'
                ? 'Bralec takoj vidi vsebino brez čakanja'
                : '53% mobilnih obiskovalcev zapusti stran po 3s'}
            </p>
          </div>

          <div className="rounded-xl border border-neutral-800 bg-neutral-950/80 p-5">
            <div className="flex items-center justify-between text-xs text-neutral-400">
              <span>Velikost podatkov</span>
              <Cpu className="w-4 h-4 text-cyan-400" />
            </div>
            <p className={`mt-2 font-mono text-3xl font-extrabold tabular-nums ${
              activeStack === 'webkat' ? 'text-emerald-400' : 'text-red-400'
            }`}>
              {activeStack === 'webkat' ? '~ 180 KB' : '6.4 MB'}
            </p>
            <p className="mt-1 text-[11px] text-neutral-500">
              {activeStack === 'webkat'
                ? 'Brez nepotrebnih skript in bloatware vtičnikov'
                : 'Desetine skript, ki upočasnjujejo brskalnik'}
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Project Cost & Feature Calculator */}
      <div id="calculator-anchor" className="mt-20 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 sm:p-10">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
            Kalkulator Spletnega Projekta
          </p>
          <h3 className="mt-2 text-2xl font-bold text-white">
            Izračunajte okvirno investicijo v vašo novo spletno stran
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-neutral-300">
            Izberite želene komponente in pridobite takojšnjo pregledno oceno stroškov ter časovnega okvira.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Options */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <label className="text-xs font-bold text-neutral-300 uppercase tracking-wide block mb-3">
                1. Vrsta spletnega projekta:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'basic', label: 'Predstavitvena Stran', desc: 'Za podjetja, obrtnike, storitve' },
                  { id: 'shop', label: 'Spletna Trgovina', desc: 'Prodaja izdelkov, košarica, kartice' },
                  { id: 'portal', label: 'Gaming Portal & Blog', desc: 'Članki, novice, avtorji, komentarji' },
                  { id: 'custom', label: 'Aplikacija po meri', desc: 'Zahtevnejša podatkovna baza & API' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setProjectType(opt.id as any)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      projectType === opt.id
                        ? 'border-cyan-500 bg-cyan-950/20 text-white'
                        : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    <p className="text-xs font-bold text-white">{opt.label}</p>
                    <p className="text-[11px] text-neutral-400 mt-1">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-300 uppercase tracking-wide block mb-3">
                2. Dodatne funkcije & moduli:
              </label>
              <div className="space-y-2">
                <label className="flex items-center justify-between p-3 rounded-xl border border-neutral-800 bg-neutral-950 cursor-pointer hover:border-neutral-700">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={includeBlogCms}
                      onChange={(e) => setIncludeBlogCms(e.target.checked)}
                      className="rounded border-neutral-700 text-cyan-500 focus:ring-0"
                    />
                    <div>
                      <p className="text-xs font-semibold text-white">Vgrajen Blog & CMS Studio z AI pisalcem</p>
                      <p className="text-[11px] text-neutral-400">Preprosto dodajanje novic in avtomatiziran SEO</p>
                    </div>
                  </div>
                  <span className="font-mono text-xs text-neutral-300">+250 €</span>
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl border border-neutral-800 bg-neutral-950 cursor-pointer hover:border-neutral-700">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={includeSeoPro}
                      onChange={(e) => setIncludeSeoPro(e.target.checked)}
                      className="rounded border-neutral-700 text-cyan-500 focus:ring-0"
                    />
                    <div>
                      <p className="text-xs font-semibold text-white">Napredni SEO Paket & Schema.org</p>
                      <p className="text-[11px] text-neutral-400">Google Profil, lokalni SEO in ključne besede</p>
                    </div>
                  </div>
                  <span className="font-mono text-xs text-neutral-300">+190 €</span>
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl border border-neutral-800 bg-neutral-950 cursor-pointer hover:border-neutral-700">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={includeMultiLang}
                      onChange={(e) => setIncludeMultiLang(e.target.checked)}
                      className="rounded border-neutral-700 text-cyan-500 focus:ring-0"
                    />
                    <div>
                      <p className="text-xs font-semibold text-white">Večjezičnost (SLO / ENG / DEU)</p>
                      <p className="text-[11px] text-neutral-400">Prilagoditev za tuje trge in večjezični SEO</p>
                    </div>
                  </div>
                  <span className="font-mono text-xs text-neutral-300">+200 €</span>
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl border border-neutral-800 bg-neutral-950 cursor-pointer hover:border-neutral-700">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={includePayments}
                      onChange={(e) => setIncludePayments(e.target.checked)}
                      className="rounded border-neutral-700 text-cyan-500 focus:ring-0"
                    />
                    <div>
                      <p className="text-xs font-semibold text-white">Integracija Plačilnih Sistemov (Kartice, Flik)</p>
                      <p className="text-[11px] text-neutral-400">Varno spletno procesiranje naročil in plačil</p>
                    </div>
                  </div>
                  <span className="font-mono text-xs text-neutral-300">+290 €</span>
                </label>
              </div>
            </div>
          </div>

          {/* Result Card */}
          <div className="rounded-2xl border border-neutral-700 bg-neutral-950 p-6 flex flex-col justify-between">
            <div>
              <p className="text-xs uppercase font-mono tracking-wider text-cyan-400">
                Vaš Izračun
              </p>
              <h4 className="mt-2 text-lg font-bold text-white">
                {calculated.typeName}
              </h4>

              <div className="mt-6 border-t border-neutral-800 pt-4">
                <span className="text-xs text-neutral-400">Predvidena investicija:</span>
                <p className="mt-1 font-mono text-4xl font-extrabold tabular-nums text-cyan-300">
                  od {calculated.total} €
                </p>
                <p className="text-[11px] text-neutral-500 mt-1">Cena je brez skritih stroškov ali mesečnih naročnin na vtičnike.</p>
              </div>

              <div className="mt-6 flex items-center gap-2 text-xs text-neutral-300">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>Ocenjen čas izdelave: <strong>{calculated.days} delovnih dni</strong></span>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-neutral-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Vključena 1-letna tehnična garancija</span>
              </div>
            </div>

            <button
              onClick={() =>
                onSelectServiceForInquiry(
                  `${calculated.typeName} (Izračun kalkulatorja)`,
                  `cca. ${calculated.total} €`
                )
              }
              className="mt-8 w-full rounded-xl bg-cyan-500 py-3 text-center text-xs font-bold text-neutral-950 hover:bg-cyan-400 transition-colors"
            >
              Oddaj Neobvezujoče Povpraševanje
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
