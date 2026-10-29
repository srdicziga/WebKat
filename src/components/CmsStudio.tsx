import React, { useState } from 'react';
import { BlogPost, BlogCategory } from '../types';
import {
  Sparkles,
  Plus,
  Trash2,
  Edit3,
  Download,
  Upload,
  RotateCcw,
  Search,
  CheckCircle2,
  Globe,
  Sliders,
  Eye,
  FileText,
} from 'lucide-react';

interface CmsStudioProps {
  posts: BlogPost[];
  onSavePost: (post: BlogPost) => void;
  onDeletePost: (postId: string) => void;
  onResetPosts: () => void;
  onClose: () => void;
}

export const CmsStudio: React.FC<CmsStudioProps> = ({
  posts,
  onSavePost,
  onDeletePost,
  onResetPosts,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'editor' | 'list' | 'seoPreview'>('editor');
  const [editingPostId, setEditingPostId] = useState<string | null>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<BlogCategory>('gaming');
  const [readTime, setReadTime] = useState('4 min branja');
  const [tagsInput, setTagsInput] = useState('Gaming, Novice, WebKat');
  const [coverTheme, setCoverTheme] = useState<'vice' | 'tactical' | 'speed' | 'code'>('vice');

  // AI state
  const [aiTopic, setAiTopic] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiStatusMessage, setAiStatusMessage] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const startNewPost = () => {
    setEditingPostId(null);
    setTitle('');
    setSlug('');
    setSummary('');
    setContent('');
    setCategory('gaming');
    setReadTime('4 min branja');
    setTagsInput('Gaming, Novice, WebKat');
    setCoverTheme('vice');
    setActiveTab('editor');
  };

  const loadPostForEdit = (post: BlogPost) => {
    setEditingPostId(post.id);
    setTitle(post.title);
    setSlug(post.slug);
    setSummary(post.summary);
    setContent(post.content);
    setCategory(post.category);
    setReadTime(post.readTime);
    setTagsInput(post.tags.join(', '));
    setCoverTheme(post.coverTheme as any);
    setActiveTab('editor');
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingPostId) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/č/g, 'c')
        .replace(/š/g, 's')
        .replace(/ž/g, 'z')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setSlug(generatedSlug);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const parsedTags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const categoryLabels: Record<BlogCategory, string> = {
      gaming: 'Gaming Novice',
      webdev: 'Spletni Razvoj',
      seo: 'SEO & Marketing',
      hardware: 'Strojna Oprema',
    };

    const postToSave: BlogPost = {
      id: editingPostId || 'post_' + Date.now(),
      slug: slug || 'clanek-' + Date.now(),
      title,
      summary: summary || title,
      content: content || 'Vsebina članka v pripravi...',
      category,
      categoryLabel: categoryLabels[category],
      readTime,
      publishedAt: 'Danes, ' + new Date().toLocaleDateString('sl-SI'),
      author: 'Žiga Srdič',
      authorRole: 'WebKat Glavni Urednik & Razvijalec',
      tags: parsedTags.length > 0 ? parsedTags : ['WebKat', 'Novice'],
      likes: editingPostId ? posts.find((p) => p.id === editingPostId)?.likes || 0 : 1,
      views: editingPostId ? posts.find((p) => p.id === editingPostId)?.views || 10 : 25,
      coverTheme,
      comments: editingPostId ? posts.find((p) => p.id === editingPostId)?.comments || [] : [],
    };

    onSavePost(postToSave);
    setAiStatusMessage('Članek je bil uspešno shranjen in objavljen!');
    setTimeout(() => setAiStatusMessage(''), 3000);
    setActiveTab('list');
  };

  // AI Outline Generation
  const handleAiGenerateOutline = async () => {
    const topicToUse = aiTopic.trim() || title.trim();
    if (!topicToUse) {
      alert('Prosimo, vnesite temo za AI asistenta.');
      return;
    }

    setAiLoading(true);
    setAiStatusMessage('AI analizira temo in pripravlja strukturo...');

    try {
      const res = await fetch('/api/ai/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_outline',
          topic: topicToUse,
          category,
        }),
      });

      const data = await res.json();
      if (data.success) {
        if (!title) setTitle(topicToUse);
        if (data.outline) setContent(data.outline);
        if (data.suggestedTags) setTagsInput(data.suggestedTags.join(', '));
        if (data.metaDescription) setSummary(data.metaDescription);
        setAiStatusMessage('Osnutek je uspešno pripravljen!');
      } else {
        setAiStatusMessage('Uporabljen je privzeti pametni predlog.');
      }
    } catch (err) {
      console.error(err);
      // Client-side fallback outline
      setContent(
        `## Uvod v temo: ${topicToUse}\n\nPredstavljamo svež pregled ključnih novosti.\n\n### Glavne točke:\n- Tehnološki vpliv in zahteve\n- Primerjava z obstoječimi rešitvami\n- Pričakovanja v letu 2026\n\n> Ključni povzetek za bralce portala WebKat.`
      );
      setAiStatusMessage('Osnutek ustvarjen z lokalnim predlogom.');
    } finally {
      setAiLoading(false);
      setTimeout(() => setAiStatusMessage(''), 3500);
    }
  };

  // AI SEO Optimizer
  const handleAiOptimizeSeo = async () => {
    if (!title) {
      alert('Najprej vnesite naslov članka.');
      return;
    }

    setAiLoading(true);
    setAiStatusMessage('Optimiziram SEO meta oznake za Google...');

    try {
      const res = await fetch('/api/ai/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'optimize_seo',
          topic: title,
          currentContent: content,
        }),
      });

      const data = await res.json();
      if (data.success) {
        if (data.metaDescription) setSummary(data.metaDescription);
        if (data.suggestedSlug) setSlug(data.suggestedSlug);
        if (data.keywords) setTagsInput(data.keywords.join(', '));
        setAiStatusMessage('SEO meta podatki so optimizirani!');
      }
    } catch (err) {
      console.error(err);
      setSummary(
        `Preberite vse podrobnosti o temi ${title}: strokovna analiza, tehnične specifikacije in praktični nasveti na portalu WebKat.`
      );
      setAiStatusMessage('SEO opis posodobljen.');
    } finally {
      setAiLoading(false);
      setTimeout(() => setAiStatusMessage(''), 3500);
    }
  };

  // Export articles as JSON
  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(posts, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `webkat_blog_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/95 backdrop-blur-xl p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl">
        {/* Header of CMS */}
        <div className="flex flex-wrap items-center justify-between border-b border-neutral-800 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-xs">
              CMS
            </div>
            <div>
              <h2 className="text-base font-bold text-white">WebKat Editorial Studio & AI Copilot</h2>
              <p className="text-xs text-neutral-400">Upravljanje novic, avtomatiziran SEO in AI generiranje vsebin</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={startNewPost}
              className="inline-flex items-center gap-1 rounded-lg bg-cyan-500 px-3 py-1.5 text-xs font-semibold text-neutral-950 hover:bg-cyan-400 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nov Članek</span>
            </button>

            <button
              onClick={handleExportJson}
              title="Prenesi varnostno kopijo vseh člankov (JSON)"
              className="inline-flex items-center gap-1 rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-1.5 text-xs text-neutral-300 hover:text-white transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Izvozi JSON</span>
            </button>

            <button
              onClick={onClose}
              className="rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-1.5 text-xs font-medium text-neutral-400 hover:text-white"
            >
              Zapri (ESC)
            </button>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center border-b border-neutral-800 px-6 bg-neutral-950/40 text-xs">
          <button
            onClick={() => setActiveTab('editor')}
            className={`py-3 px-4 font-semibold border-b-2 transition-colors ${
              activeTab === 'editor'
                ? 'border-cyan-400 text-white'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            {editingPostId ? 'Uredi Izbran Članek' : 'Ustvari Nov Članek'}
          </button>

          <button
            onClick={() => setActiveTab('list')}
            className={`py-3 px-4 font-semibold border-b-2 transition-colors ${
              activeTab === 'list'
                ? 'border-cyan-400 text-white'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            Vsi Objavljeni Članki ({posts.length})
          </button>

          <button
            onClick={() => setActiveTab('seoPreview')}
            className={`py-3 px-4 font-semibold border-b-2 transition-colors ${
              activeTab === 'seoPreview'
                ? 'border-cyan-400 text-white'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            Google SEO & Social Card Predogled
          </button>
        </div>

        {/* Status Toast */}
        {aiStatusMessage && (
          <div className="mx-6 mt-4 flex items-center gap-2 rounded-lg bg-cyan-950/60 border border-cyan-800/40 p-3 text-xs text-cyan-300">
            <Sparkles className="w-4 h-4 shrink-0 text-cyan-400" />
            <span>{aiStatusMessage}</span>
          </div>
        )}

        {/* CONTENT TABS */}
        <div className="p-6">
          {activeTab === 'editor' && (
            <div className="space-y-6">
              {/* AI Copilot Bar */}
              <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-cyan-400">
                    <Sparkles className="w-4 h-4" />
                    AI Asistent za slovenske vsebine & SEO
                  </span>
                  <span className="text-[11px] text-neutral-400">Powered by Gemini & WebKat Core</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 mt-2">
                  <input
                    type="text"
                    placeholder="Vpišite temo npr. 'Prihaja Cyberpunk 2 nova napoved' ali 'Zakaj je TypeScript obvezen'..."
                    value={aiTopic}
                    onChange={(e) => setAiTopic(e.target.value)}
                    className="flex-1 rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-cyan-500 focus:outline-none"
                  />

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={aiLoading}
                      onClick={handleAiGenerateOutline}
                      className="inline-flex items-center gap-1 rounded-lg bg-cyan-500 px-3 py-2 text-xs font-semibold text-neutral-950 hover:bg-cyan-400 disabled:opacity-50 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{aiLoading ? 'Generiram...' : 'Ustvari Osnutek'}</span>
                    </button>

                    <button
                      type="button"
                      disabled={aiLoading || !title}
                      onClick={handleAiOptimizeSeo}
                      className="inline-flex items-center gap-1 rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-xs font-medium text-white hover:bg-neutral-700 disabled:opacity-40 transition-colors"
                    >
                      <Globe className="w-3.5 h-3.5 text-cyan-400" />
                      <span>SEO Optimizator</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Naslov Članka
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="npr. Grand Theft Auto VI: Vse podrobnosti o mestu Vice City..."
                      className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      URL Slug (Čist spletni naslov)
                    </label>
                    <input
                      type="text"
                      required
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="npr. gta-6-vice-city-novosti"
                      className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-white font-mono focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">Kategorija</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as BlogCategory)}
                      className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                    >
                      <option value="gaming">Gaming Novice</option>
                      <option value="webdev">Spletni Razvoj</option>
                      <option value="seo">SEO & Marketing</option>
                      <option value="hardware">Strojna Oprema</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">Čas branja</label>
                    <input
                      type="text"
                      value={readTime}
                      onChange={(e) => setReadTime(e.target.value)}
                      className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">Vizualna tema naslovnice</label>
                    <select
                      value={coverTheme}
                      onChange={(e) => setCoverTheme(e.target.value as any)}
                      className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                    >
                      <option value="vice">Vice City & Neon (Vijolična / Roza)</option>
                      <option value="tactical">Taktika & Bojišče (Jantarna / Zlata)</option>
                      <option value="speed">Hitrost & Performance (Smaragdna / Cyan)</option>
                      <option value="code">Koda & Razvoj (Modra / Indigo)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Kratek povzetek (Meta Opis za Google)
                    <span className="ml-2 font-normal text-neutral-500 font-mono">
                      ({summary.length} znakov - optimalno 120–160)
                    </span>
                  </label>
                  <textarea
                    rows={2}
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="Kratek in privlačen povzetek za iskalnik Google in socialne kartice..."
                    className="w-full rounded-lg border border-neutral-800 bg-neutral-950 p-3 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-neutral-300">
                      Celotna Vsebina Članka (Podprt Markdown: ## Podnaslov, -, &gt; citat)
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPreview(!showPreview)}
                      className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{showPreview ? 'Uredi kodo' : 'Predogled'}</span>
                    </button>
                  </div>

                  {showPreview ? (
                    <div className="w-full rounded-lg border border-neutral-800 bg-neutral-950 p-4 text-xs text-neutral-200 min-h-[220px] whitespace-pre-wrap">
                      {content || 'Prazna vsebina...'}
                    </div>
                  ) : (
                    <textarea
                      rows={10}
                      required
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="## Naslov poglavja&#10;&#10;Besedilo članka...&#10;&#10;- Točka 1&#10;- Točka 2&#10;&#10;> Poudarjen citat..."
                      className="w-full rounded-lg border border-neutral-800 bg-neutral-950 p-3 text-xs text-white font-mono leading-relaxed focus:border-cyan-500 focus:outline-none"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Oznake / Tagi (ločeni z vejico)
                  </label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="GTA 6, Vice City, Rockstar, PC Gaming"
                    className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
                  {editingPostId && (
                    <button
                      type="button"
                      onClick={startNewPost}
                      className="rounded-lg border border-neutral-800 px-4 py-2 text-xs font-medium text-neutral-400 hover:text-white"
                    >
                      Prekliči urejanje
                    </button>
                  )}
                  <button
                    type="submit"
                    className="rounded-lg bg-cyan-500 px-5 py-2 text-xs font-bold text-neutral-950 hover:bg-cyan-400 transition-colors"
                  >
                    {editingPostId ? 'Posodobi Članek' : 'Objavi Članek na Spletni Strani'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'list' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
                <span>Skupaj objavljenih novic in vodnikov: {posts.length}</span>
                <button
                  onClick={onResetPosts}
                  className="inline-flex items-center gap-1 text-xs text-amber-400 hover:underline"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Ponastavi na začetne članke</span>
                </button>
              </div>

              <div className="divide-y divide-neutral-800 rounded-xl border border-neutral-800 bg-neutral-950/60 overflow-hidden">
                {posts.map((p) => (
                  <div key={p.id} className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-neutral-900/40 transition-colors">
                    <div className="max-w-xl">
                      <div className="flex items-center gap-2 text-[11px] text-neutral-500">
                        <span className="text-cyan-400 font-medium">{p.categoryLabel}</span>
                        <span>·</span>
                        <span>{p.publishedAt}</span>
                        <span>·</span>
                        <span className="font-mono">{p.likes} všečkov</span>
                      </div>
                      <h4 className="mt-1 text-sm font-bold text-white line-clamp-1">{p.title}</h4>
                      <p className="text-xs text-neutral-400 font-mono mt-0.5">/{p.slug}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => loadPostForEdit(p)}
                        className="inline-flex items-center gap-1 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs text-neutral-200 hover:text-white hover:border-neutral-700"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Uredi</span>
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Ali res želite izbrisati članek "${p.title}"?`)) {
                            onDeletePost(p.id);
                          }
                        }}
                        className="inline-flex items-center gap-1 rounded-lg border border-red-900/40 bg-red-950/30 px-3 py-1.5 text-xs text-red-300 hover:bg-red-900/50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Izbriši</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'seoPreview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-white mb-1">
                  Google Search Snippet Predogled
                </h3>
                <p className="text-xs text-neutral-400 mb-4">
                  Tako bo vaš trenutni ali izbrani članek izgledal med zadetki na iskalniku Google.
                </p>

                {/* Google Snippet Card */}
                <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-5 max-w-2xl font-sans">
                  <div className="flex items-center gap-2 text-xs text-neutral-400">
                    <span className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-400 text-[10px] flex items-center justify-center font-bold">W</span>
                    <span>webkat.si</span>
                    <span>›</span>
                    <span className="font-mono text-neutral-500">{slug || 'naslov-clanka'}</span>
                  </div>
                  <h4 className="mt-1 text-base font-semibold text-blue-400 hover:underline cursor-pointer">
                    {title || 'Naslov vašega članka | WebKat Gaming & Spletni Razvoj'}
                  </h4>
                  <p className="mt-1 text-xs text-neutral-300 leading-relaxed">
                    {summary || 'Vnesite kratek povzetek članka, ki bo privabil bralce iz iskalnika Google. Tukaj bo viden vaš privlačen meta opis.'}
                  </p>
                </div>
              </div>

              {/* Twitter / Social Card Preview */}
              <div>
                <h3 className="text-sm font-bold text-white mb-1">
                  Social Share Card Predogled (X / Twitter, LinkedIn, Facebook)
                </h3>
                <p className="text-xs text-neutral-400 mb-4">
                  Vizualna kartica, ki se generira ob deljenju povezave na družbenih omrežjih.
                </p>

                <div className="rounded-xl border border-neutral-800 bg-neutral-950 overflow-hidden max-w-md">
                  <div className="h-44 bg-gradient-to-r from-purple-950 via-slate-900 to-cyan-950 flex items-center justify-center border-b border-neutral-800">
                    <span className="font-bold text-cyan-300 text-sm tracking-wider">WEBKAT MAGAZINE</span>
                  </div>
                  <div className="p-4">
                    <p className="text-[11px] text-neutral-500 uppercase font-mono">WEBKAT.SI</p>
                    <p className="text-xs font-bold text-white mt-1 line-clamp-1">{title || 'Naslov Članka'}</p>
                    <p className="text-[11px] text-neutral-400 mt-1 line-clamp-2">{summary || 'Kratek opis članka za družbena omrežja.'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
