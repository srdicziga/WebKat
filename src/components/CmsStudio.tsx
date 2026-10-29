import React, { useState } from 'react';
import { User } from 'firebase/auth';
import { BlogPost, BlogCategory } from '../types';
import {
  ADMIN_EMAIL,
  isUserAdmin,
  loginWithGoogle,
  logoutUser,
  sanitizeSlug,
} from '../firebase';
import {
  Sparkles,
  Plus,
  Trash2,
  Edit3,
  Download,
  RotateCcw,
  Globe,
  Eye,
  LogIn,
  LogOut,
  Database,
  CheckCircle2,
  AlertCircle,
  GitBranch,
  Copy,
  Check,
} from 'lucide-react';

interface CmsStudioProps {
  posts: BlogPost[];
  currentUser: User | null;
  isCloudSynced: boolean;
  onSavePost: (post: BlogPost, isExisting: boolean) => Promise<void>;
  onDeletePost: (postId: string) => Promise<void>;
  onSeedCloudPosts: () => Promise<number>;
  onClose: () => void;
}

export const CmsStudio: React.FC<CmsStudioProps> = ({
  posts,
  currentUser,
  isCloudSynced,
  onSavePost,
  onDeletePost,
  onSeedCloudPosts,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'editor' | 'list' | 'seoPreview' | 'deploy'>('editor');
  const [editingPostId, setEditingPostId] = useState<string | null>(null);

  // Form fields matching firebase-blueprint.json limits
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<BlogCategory>('gaming');
  const [readTime, setReadTime] = useState('4 min branja');
  const [tagsInput, setTagsInput] = useState('Gaming, Novice, WebKat');
  const [coverTheme, setCoverTheme] = useState<'vice' | 'tactical' | 'speed' | 'code'>('vice');

  // AI & status state
  const [aiTopic, setAiTopic] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [copiedCmd, setCopiedCmd] = useState(false);

  const isAdmin = isUserAdmin(currentUser);

  const showToast = (msg: string, isErr = false) => {
    if (isErr) {
      setErrorMessage(msg);
      setStatusMessage('');
    } else {
      setStatusMessage(msg);
      setErrorMessage('');
    }
    setTimeout(() => {
      setStatusMessage('');
      setErrorMessage('');
    }, 4500);
  };

  const handleGoogleLogin = async () => {
    try {
      const user = await loginWithGoogle();
      if (isUserAdmin(user)) {
        showToast(`Dobrodošli, ${user.displayName || user.email}! Povezani ste s Firebase bazo.`);
      } else {
        showToast(
          `Prijavljeni ste kot ${user.email}. Skrbniške pravice za objavo ima ${ADMIN_EMAIL}.`,
          true
        );
      }
    } catch (err: any) {
      showToast(err?.message || 'Prijava z Google računom ni uspela.', true);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    showToast('Uspešno ste se odjavili.');
  };

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
    const trimmed = val.slice(0, 200);
    setTitle(trimmed);
    if (!editingPostId) {
      setSlug(sanitizeSlug(trimmed));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim().length < 3) {
      showToast('Naslov članka mora vsebovati vsaj 3 znake.', true);
      return;
    }
    if (content.trim().length < 10) {
      showToast('Vsebina članka mora vsebovati vsaj 10 znakov.', true);
      return;
    }

    const parsedTags = tagsInput
      .split(',')
      .map((t) => t.trim().slice(0, 50))
      .filter(Boolean)
      .slice(0, 10);

    const categoryLabels: Record<BlogCategory, string> = {
      gaming: 'Gaming Novice',
      webdev: 'Spletni Razvoj',
      seo: 'SEO & Marketing',
      hardware: 'Strojna Oprema',
    };

    const existingPost = editingPostId ? posts.find((p) => p.id === editingPostId) : undefined;

    const postToSave: BlogPost = {
      id: editingPostId || 'post_' + Date.now(),
      slug: sanitizeSlug(slug || title),
      title: title.trim().slice(0, 200),
      summary: (summary.trim() || title.trim()).slice(0, 500),
      content: content.trim().slice(0, 50000),
      category,
      categoryLabel: categoryLabels[category],
      readTime: (readTime.trim() || '4 min branja').slice(0, 40),
      publishedAt: existingPost?.publishedAt || 'Danes, ' + new Date().toLocaleDateString('sl-SI'),
      author: 'Žiga Srdič',
      authorRole: 'WebKat Glavni Urednik & Razvijalec',
      authorId: currentUser?.uid,
      tags: parsedTags.length > 0 ? parsedTags : ['WebKat', 'Novice'],
      likes: existingPost ? existingPost.likes : 1,
      views: existingPost ? existingPost.views : 25,
      coverTheme,
      status: 'published',
      comments: existingPost?.comments || [],
    };

    setSaving(true);
    try {
      await onSavePost(postToSave, Boolean(editingPostId));
      showToast(
        isAdmin
          ? 'Članek je bil uspešno shranjen v Firebase Firestore bazo v živo!'
          : 'Članek je shranjen lokalno (za zapis v Firebase se prijavite kot skrbnik).'
      );
      setActiveTab('list');
    } catch (err: any) {
      showToast(err?.message || 'Napaka pri shranjevanju v Firebase bazo.', true);
    } finally {
      setSaving(false);
    }
  };

  // AI Outline Generation
  const handleAiGenerateOutline = async () => {
    const topicToUse = aiTopic.trim() || title.trim();
    if (!topicToUse) {
      showToast('Prosimo, vnesite temo za AI asistenta.', true);
      return;
    }

    setAiLoading(true);
    setStatusMessage('AI analizira temo in pripravlja strukturo...');

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
        if (!title) handleTitleChange(topicToUse);
        if (data.outline) setContent(String(data.outline).slice(0, 50000));
        if (data.suggestedTags) setTagsInput(data.suggestedTags.slice(0, 10).join(', '));
        if (data.metaDescription) setSummary(String(data.metaDescription).slice(0, 500));
        showToast('Osnutek je uspešno pripravljen!');
      } else {
        showToast('Uporabljen je privzeti pametni predlog.');
      }
    } catch (err) {
      setContent(
        `## Uvod v temo: ${topicToUse}\n\nPredstavljamo svež pregled ključnih novosti.\n\n### Glavne točke:\n- Tehnološki vpliv in zahteve\n- Primerjava z obstoječimi rešitvami\n- Pričakovanja v letu 2026\n\n> Ključni povzetek za bralce portala WebKat.`
      );
      showToast('Osnutek ustvarjen z lokalnim predlogom.');
    } finally {
      setAiLoading(false);
    }
  };

  // AI SEO Optimizer
  const handleAiOptimizeSeo = async () => {
    if (!title) {
      showToast('Najprej vnesite naslov članka.', true);
      return;
    }

    setAiLoading(true);
    setStatusMessage('Optimiziram SEO meta oznake za Google...');

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
        if (data.metaDescription) setSummary(String(data.metaDescription).slice(0, 500));
        if (data.suggestedSlug) setSlug(sanitizeSlug(data.suggestedSlug));
        if (data.keywords) setTagsInput(data.keywords.slice(0, 10).join(', '));
        showToast('SEO meta podatki so optimizirani!');
      }
    } catch (err) {
      setSummary(
        `Preberite vse podrobnosti o temi ${title}: strokovna analiza, tehnične specifikacije in praktični nasveti na portalu WebKat.`.slice(
          0,
          500
        )
      );
      showToast('SEO opis posodobljen.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleSeedCloud = async () => {
    setSaving(true);
    try {
      const count = await onSeedCloudPosts();
      showToast(
        count > 0
          ? `V Firebase bazo je bilo uspešno naloženih ${count} začetnih člankov!`
          : 'Vsi začetni članki so že shranjeni v Firebase bazi.'
      );
    } catch (err: any) {
      showToast(err?.message || 'Napaka pri sinhronizaciji z bazo.', true);
    } finally {
      setSaving(false);
    }
  };

  // Export articles as JSON
  const handleExportJson = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(posts, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `webkat_blog_backup_${new Date().toISOString().slice(0, 10)}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/95 backdrop-blur-xl p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl">
        {/* Header of CMS */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-xs">
              CMS
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                WebKat Cloud CMS & AI Studio
              </h2>
              <p className="text-xs text-neutral-400">
                Firebase Firestore baza v živo · Avtomatiziran SEO · GitHub sinhronizacija
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Firebase Auth Button */}
            {currentUser ? (
              <div className="flex items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-1.5 text-xs">
                <Database className={`w-3.5 h-3.5 ${isAdmin ? 'text-emerald-400' : 'text-amber-400'}`} />
                <span className="text-neutral-200 font-medium truncate max-w-[160px]">
                  {currentUser.email}
                </span>
                <button
                  onClick={handleLogout}
                  title="Odjava"
                  className="ml-1 text-neutral-400 hover:text-white transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleGoogleLogin}
                className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-950/40 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-900/50 transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Skrbniška Google Prijava ({ADMIN_EMAIL})</span>
              </button>
            )}

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
              <span>JSON Kopija</span>
            </button>

            <button
              onClick={onClose}
              className="rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-1.5 text-xs font-medium text-neutral-400 hover:text-white"
            >
              Zapri
            </button>
          </div>
        </div>

        {/* Cloud Connection Banner */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800 bg-neutral-950/70 px-6 py-2.5 text-xs">
          <div className="flex items-center gap-2 text-neutral-300">
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span>
              Status baze:{' '}
              <strong className="text-white">
                {isCloudSynced
                  ? 'Firebase Firestore aktiven (v živo)'
                  : 'Povezan s Firebase (začetni članki pripravljeni za sinhronizacijo)'}
              </strong>
            </span>
          </div>

          {isAdmin && (
            <button
              onClick={handleSeedCloud}
              disabled={saving}
              className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:underline disabled:opacity-50"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Sinhroniziraj začetne članke v Firebase</span>
            </button>
          )}
        </div>

        {/* Tab switcher */}
        <div className="flex flex-wrap items-center border-b border-neutral-800 px-6 bg-neutral-950/40 text-xs">
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
            Vsi Članki v Bazi ({posts.length})
          </button>

          <button
            onClick={() => setActiveTab('seoPreview')}
            className={`py-3 px-4 font-semibold border-b-2 transition-colors ${
              activeTab === 'seoPreview'
                ? 'border-cyan-400 text-white'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            Google SEO & Social Predogled
          </button>

          <button
            onClick={() => setActiveTab('deploy')}
            className={`py-3 px-4 font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'deploy'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>GitHub & cPanel Gostovanje</span>
          </button>
        </div>

        {/* Status / Error Toasts */}
        {statusMessage && (
          <div className="mx-6 mt-4 flex items-center gap-2 rounded-lg bg-cyan-950/60 border border-cyan-800/40 p-3 text-xs text-cyan-300">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-cyan-400" />
            <span>{statusMessage}</span>
          </div>
        )}
        {errorMessage && (
          <div className="mx-6 mt-4 flex items-center gap-2 rounded-lg bg-red-950/60 border border-red-800/40 p-3 text-xs text-red-300">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* CONTENT TABS */}
        <div className="p-6">
          {activeTab === 'editor' && (
            <div className="space-y-6">
              {!isAdmin && (
                <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="text-xs text-amber-200">
                    <strong>Opomba:</strong> Za neposredno objavljanje v oblačno bazo Firebase se prijavite s skrbniškim računom <strong>{ADMIN_EMAIL}</strong>.
                  </div>
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-3.5 py-2 text-xs font-bold text-neutral-950 hover:bg-amber-400 shrink-0 transition-colors"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Prijava z Google računom</span>
                  </button>
                </div>
              )}

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
                    placeholder="Vpišite temo npr. 'Prihaja The Witcher 4 napovednik' ali 'Zakaj izbrati hitro spletno stran'..."
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
                      Naslov Članka (3–200 znakov)
                    </label>
                    <input
                      type="text"
                      required
                      minLength={3}
                      maxLength={200}
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
                      maxLength={160}
                      value={slug}
                      onChange={(e) => setSlug(sanitizeSlug(e.target.value))}
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
                      maxLength={40}
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
                    Kratek povzetek / Meta Opis za Google (5–500 znakov)
                    <span className="ml-2 font-normal text-neutral-500 font-mono">
                      ({summary.length} znakov - optimalno 120–160)
                    </span>
                  </label>
                  <textarea
                    rows={2}
                    maxLength={500}
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
                      minLength={10}
                      maxLength={50000}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="## Naslov poglavja&#10;&#10;Besedilo članka...&#10;&#10;- Točka 1&#10;- Točka 2&#10;&#10;> Poudarjen citat..."
                      className="w-full rounded-lg border border-neutral-800 bg-neutral-950 p-3 text-xs text-white font-mono leading-relaxed focus:border-cyan-500 focus:outline-none"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Oznake / Tagi (ločeni z vejico, največ 10 oznak)
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
                    disabled={saving}
                    className="rounded-lg bg-cyan-500 px-5 py-2 text-xs font-bold text-neutral-950 hover:bg-cyan-400 disabled:opacity-50 transition-colors"
                  >
                    {saving
                      ? 'Shranjujem v bazo...'
                      : editingPostId
                      ? 'Posodobi Članek v Bazi'
                      : 'Objavi Članek v Živo'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'list' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
                <span>Skupaj objavljenih novic in vodnikov: {posts.length}</span>
                {isAdmin && (
                  <button
                    onClick={handleSeedCloud}
                    disabled={saving}
                    className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:underline"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Polni začetne članke v Firebase</span>
                  </button>
                )}
              </div>

              <div className="divide-y divide-neutral-800 rounded-xl border border-neutral-800 bg-neutral-950/60 overflow-hidden">
                {posts.map((p) => (
                  <div
                    key={p.id}
                    className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-neutral-900/40 transition-colors"
                  >
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

                      {confirmDeleteId === p.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={async () => {
                              setConfirmDeleteId(null);
                              await onDeletePost(p.id);
                              showToast('Članek je bil izbrisan.');
                            }}
                            className="rounded-lg bg-red-600 px-2.5 py-1.5 text-xs font-bold text-white hover:bg-red-500"
                          >
                            Potrdi izbris
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="rounded-lg border border-neutral-700 px-2 py-1.5 text-xs text-neutral-300"
                          >
                            Prekliči
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDeleteId(p.id)}
                          className="inline-flex items-center gap-1 rounded-lg border border-red-900/40 bg-red-950/30 px-3 py-1.5 text-xs text-red-300 hover:bg-red-900/50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Izbriši</span>
                        </button>
                      )}
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

                <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-5 max-w-2xl font-sans">
                  <div className="flex items-center gap-2 text-xs text-neutral-400">
                    <span className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-400 text-[10px] flex items-center justify-center font-bold">
                      W
                    </span>
                    <span>webkat.si</span>
                    <span>›</span>
                    <span className="font-mono text-neutral-500">{slug || 'naslov-clanka'}</span>
                  </div>
                  <h4 className="mt-1 text-base font-semibold text-blue-400 hover:underline cursor-pointer">
                    {title || 'Naslov vašega članka | WebKat Gaming & Spletni Razvoj'}
                  </h4>
                  <p className="mt-1 text-xs text-neutral-300 leading-relaxed">
                    {summary ||
                      'Vnesite kratek povzetek članka, ki bo privabil bralce iz iskalnika Google. Tukaj bo viden vaš privlačen meta opis.'}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white mb-1">
                  Social Share Card Predogled (X / Twitter, LinkedIn, Facebook)
                </h3>
                <p className="text-xs text-neutral-400 mb-4">
                  Vizualna kartica, ki se generira ob deljenju povezave na družbenih omrežjih.
                </p>

                <div className="rounded-xl border border-neutral-800 bg-neutral-950 overflow-hidden max-w-md">
                  <div className="h-44 bg-gradient-to-r from-purple-950 via-slate-900 to-cyan-950 flex items-center justify-center border-b border-neutral-800">
                    <span className="font-bold text-cyan-300 text-sm tracking-wider">
                      WEBKAT MAGAZINE
                    </span>
                  </div>
                  <div className="p-4">
                    <p className="text-[11px] text-neutral-500 uppercase font-mono">WEBKAT.SI</p>
                    <p className="text-xs font-bold text-white mt-1 line-clamp-1">
                      {title || 'Naslov Članka'}
                    </p>
                    <p className="text-[11px] text-neutral-400 mt-1 line-clamp-2">
                      {summary || 'Kratek opis članka za družbena omrežja.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'deploy' && (
            <div className="space-y-6 text-xs text-neutral-300 leading-relaxed">
              <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-5">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Database className="w-4 h-4 text-cyan-400" />
                  <span>1. Vaša Firebase Firestore baza je že povezana!</span>
                </h3>
                <p className="mt-2 text-neutral-300">
                  Projekt je povezan z vašo oblačno bazo (<code className="text-cyan-300 font-mono">sanguine-transit-t5v9p</code>).
                  Ko ste prijavljeni z e-naslovom <strong>{ADMIN_EMAIL}</strong>, vsak nov članek, ki ga objavite v tem CMS-ju,
                  postane takoj viden vsem obiskovalcem na <code className="text-cyan-300 font-mono">webkat.si</code> – brez ponovnega nalaganja datotek na cPanel!
                </p>
              </div>

              <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-5 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-purple-400" />
                  <span>2. Kako izvoziti kodo na GitHub in vaše gostovanje (Možnost 3)</span>
                </h3>

                <ol className="list-decimal ml-5 space-y-2.5 text-neutral-300">
                  <li>
                    <strong>Povezava z GitHubom:</strong> V zgornji vrstici vmesnika Google AI Studio kliknite na ikono <strong>GitHub (Export / Sync to GitHub)</strong> in ustvarite repozitorij (npr. <code className="font-mono text-white">webkat-portal</code>).
                  </li>
                  <li>
                    <strong>Avtentikacija za vašo domeno:</strong> V <a href="https://console.firebase.google.com/project/sanguine-transit-t5v9p/authentication/settings" target="_blank" rel="noreferrer" className="text-cyan-400 underline">Firebase Console → Authentication → Settings → Authorized domains</a> dodajte svojo domeno <code className="font-mono text-white">webkat.si</code>, da bo Google prijava delovala tudi na vaši domeni.
                  </li>
                  <li>
                    <strong>Prenos na cPanel (public_html):</strong> Na svojem računalniku ali v cPanelu zaženite spodnji ukaz za gradnjo produkcijske mape <code className="font-mono text-white">dist/</code> in njeno vsebino naložite v <code className="font-mono text-white">public_html</code>:
                  </li>
                </ol>

                <div className="flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-3 font-mono text-xs text-cyan-300">
                  <span>npm install && npm run build</span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText('npm install && npm run build');
                      setCopiedCmd(true);
                      setTimeout(() => setCopiedCmd(false), 2000);
                    }}
                    className="inline-flex items-center gap-1 text-neutral-400 hover:text-white"
                  >
                    {copiedCmd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCmd ? 'Kopirano' : 'Kopiraj'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
