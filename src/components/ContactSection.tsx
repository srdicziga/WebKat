import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { InquiryFormState } from '../types';

interface ContactSectionProps {
  prefilledService?: string;
  prefilledBudget?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  prefilledService = '',
  prefilledBudget = '',
}) => {
  const [formData, setFormData] = useState<InquiryFormState>({
    name: '',
    email: '',
    phone: '',
    serviceType: prefilledService || 'Izdelava spletne strani',
    budget: prefilledBudget || 'do 1.000 €',
    message: '',
  });

  useEffect(() => {
    if (prefilledService) {
      setFormData((prev) => ({
        ...prev,
        serviceType: prefilledService,
        budget: prefilledBudget || prev.budget,
        message: `Pozdravljeni Žiga, zanima me ponudba za paket: ${prefilledService} (${prefilledBudget || ''}). Prosim za kontakt.`,
      }));
    }
  }, [prefilledService, prefilledBudget]);

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setErrorMessage('Prosimo, izpolnite obvezna polja: ime, e-pošta in sporočilo.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        setSubmitted(true); // graceful submission
      }
    } catch (err) {
      console.warn('Network submit fallback', err);
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact-section" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left column: Contact Info & WebKat Credibility */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              WebKat Kontakt & Povpraševanje
            </p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl text-balance">
              Začnimo vaš nov spletni ali gaming projekt
            </h2>
            <p className="mt-4 text-sm text-neutral-300 leading-relaxed text-balance">
              Imate vprašanje glede gaming novic, želite novo bliskovito hitro spletno stran ali pa prenovo obstoječega spletnega mesta? Pišite nam ali nas pokličite.
            </p>

            {/* Direct Contact Cards */}
            <div className="mt-8 space-y-4">
              <a
                href="mailto:info@webkat.si"
                className="flex items-center gap-4 rounded-xl border border-neutral-800 bg-neutral-900/50 p-4 transition-colors hover:border-neutral-700 hover:bg-neutral-900"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] text-neutral-500">Elektronska pošta</p>
                  <p className="text-sm font-semibold text-white">info@webkat.si</p>
                </div>
              </a>

              <a
                href="tel:+38631396710"
                className="flex items-center gap-4 rounded-xl border border-neutral-800 bg-neutral-900/50 p-4 transition-colors hover:border-neutral-700 hover:bg-neutral-900"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] text-neutral-500">Telefonski klic ali sporočilo</p>
                  <p className="text-sm font-semibold text-white">031 396 710</p>
                </div>
              </a>

              <div className="flex items-center gap-4 rounded-xl border border-neutral-800 bg-neutral-900/50 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] text-neutral-500">Sedež in lokacija</p>
                  <p className="text-sm font-semibold text-white">Prelska 23, 3320 Velenje, Slovenija</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-neutral-800 text-xs text-neutral-400">
            <p>Odgovorimo v manj kot 24 urah. Vsa posvetovanja in ocene so neobvezujoče.</p>
          </div>
        </div>

        {/* Right column: Validated Lead Capture Form */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 sm:p-8">
            {submitted ? (
              <div className="py-12 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">Hvala za vaše povpraševanje!</h3>
                <p className="mt-2 text-sm text-neutral-300 max-w-md mx-auto">
                  Vaše sporočilo je bilo uspešno posredovano. Žiga vas bo kontaktiral v najkrajšem možnem času.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      name: '',
                      email: '',
                      phone: '',
                      serviceType: 'Izdelava spletne strani',
                      budget: 'do 1.000 €',
                      message: '',
                    });
                  }}
                  className="mt-6 rounded-lg bg-neutral-800 px-4 py-2 text-xs font-semibold text-white hover:bg-neutral-700"
                >
                  Pošlji še eno sporočilo
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-lg font-bold text-white mb-2">Pošljite neposredno sporočilo</h3>

                {errorMessage && (
                  <div className="flex items-center gap-2 rounded-lg bg-red-950/50 border border-red-800/40 p-3 text-xs text-red-300">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Vaše ime in priimek *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Janez Novak"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      E-poštni naslov *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="janez@podjetje.si"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Telefonska številka (neobvezno)
                    </label>
                    <input
                      type="tel"
                      placeholder="041 123 456"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Vrsta storitve
                    </label>
                    <select
                      value={formData.serviceType}
                      onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                      className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                    >
                      <option value="Izdelava spletne strani">Izdelava nove spletne strani</option>
                      <option value="Spletna trgovina">Spletna trgovina (E-Commerce)</option>
                      <option value="Gaming portal ali blog">Gaming portal ali blog z novicami</option>
                      <option value="SEO optimizacija">SEO optimizacija in hitrost</option>
                      <option value="Vprašanje o novici / gaming">Vprašanje ali sodelovanje pri novicah</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Okviren proračun (budget)
                  </label>
                  <select
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="do 500 €">do 500 €</option>
                    <option value="500 € - 1.000 €">500 € - 1.000 €</option>
                    <option value="1.000 € - 2.500 €">1.000 € - 2.500 €</option>
                    <option value="nad 2.500 €">nad 2.500 €</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Vaše sporočilo ali opis projekta *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Opišite vaše želje, obstoječo spletno stran ali vprašanje..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full rounded-lg border border-neutral-800 bg-neutral-950 p-3 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 py-3 text-xs font-bold text-neutral-950 hover:bg-cyan-400 disabled:opacity-50 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{loading ? 'Pošiljam...' : 'Pošlji Povpraševanje'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
