import React, { useState, useEffect } from 'react';
import { BlogPost, Comment } from '../types';
import { ThemeCover } from './ThemeCover';
import {
  ArrowLeft,
  Heart,
  Share2,
  Check,
  MessageSquare,
  Bookmark,
  BookmarkCheck,
  Send,
  Sparkles,
} from 'lucide-react';

interface ArticleViewProps {
  post: BlogPost;
  onBack: () => void;
  onLikePost: (postId: string, e: React.MouseEvent) => void;
  isLiked: boolean;
  isBookmarked: boolean;
  onToggleBookmark: (postId: string, e: React.MouseEvent) => void;
  onAddComment: (postId: string, comment: Comment) => void;
  allPosts: BlogPost[];
  onSelectRelated: (post: BlogPost) => void;
}

export const ArticleView: React.FC<ArticleViewProps> = ({
  post,
  onBack,
  onLikePost,
  isLiked,
  isBookmarked,
  onToggleBookmark,
  onAddComment,
  allPosts,
  onSelectRelated,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [newAuthor, setNewAuthor] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  const [commentSuccess, setCommentSuccess] = useState(false);

  // Sync window title for SEO
  useEffect(() => {
    const originalTitle = document.title;
    document.title = `${post.title} | WebKat Magazin`;
    return () => {
      document.title = originalTitle;
    };
  }, [post.title]);

  // Track reading progress
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (windowHeight > 0) {
        const progress = (totalScroll / windowHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, progress)));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(`${post.title} - na @WebKat`);
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const comment: Comment = {
      id: 'c_' + Date.now(),
      author: newAuthor.trim() || 'Gostujoči Bralec',
      avatarSeed: (newAuthor.trim() || 'gost').toLowerCase(),
      content: newCommentText.trim(),
      createdAt: 'Pravkar',
    };

    onAddComment(post.id, comment);
    setNewCommentText('');
    setCommentSuccess(true);
    setTimeout(() => setCommentSuccess(false), 3000);
  };

  // Related posts in same category or others
  const relatedPosts = allPosts
    .filter((p) => p.id !== post.id)
    .slice(0, 3);

  // Render markdown-like sections simply
  const renderFormattedContent = (rawText: string) => {
    const lines = rawText.split('\n');
    return lines.map((line, idx) => {
      if (line.startsWith('## ')) {
        return (
          <h2 key={idx} className="mt-8 mb-4 text-2xl font-bold tracking-tight text-white">
            {line.replace('## ', '')}
          </h2>
        );
      }
      if (line.startsWith('### ')) {
        return (
          <h3 key={idx} className="mt-6 mb-3 text-lg font-semibold text-neutral-100">
            {line.replace('### ', '')}
          </h3>
        );
      }
      if (line.startsWith('> ')) {
        return (
          <blockquote
            key={idx}
            className="my-6 rounded-r-lg border-l-2 border-cyan-400 bg-neutral-900/60 p-4 text-sm italic text-neutral-200"
          >
            {line.replace('> ', '')}
          </blockquote>
        );
      }
      if (line.startsWith('- ')) {
        return (
          <li key={idx} className="ml-5 list-disc text-sm text-neutral-300 leading-relaxed my-1">
            {line.replace('- ', '')}
          </li>
        );
      }
      if (/^\d+\.\s/.test(line)) {
        return (
          <li key={idx} className="ml-5 list-decimal text-sm text-neutral-300 leading-relaxed my-1">
            {line.replace(/^\d+\.\s/, '')}
          </li>
        );
      }
      if (!line.trim()) {
        return <div key={idx} className="h-3" />;
      }
      return (
        <p key={idx} className="text-base text-neutral-300 leading-relaxed my-3">
          {line}
        </p>
      );
    });
  };

  return (
    <article className="min-h-screen pb-24">
      {/* Pinned Reading Progress Bar */}
      <div className="fixed top-16 left-0 right-0 z-30 h-1 bg-neutral-800">
        <div
          className="h-full bg-cyan-400 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="mx-auto max-w-4xl px-4 pt-8 sm:px-6 lg:px-8">
        {/* Back navigation */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Nazaj na vse novice & članke</span>
        </button>

        {/* Article Header */}
        <div className="mt-6">
          {/* Zero-pill metadata */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-400">
            <span className="font-semibold text-cyan-400">{post.categoryLabel}</span>
            <span aria-hidden="true">·</span>
            <span>{post.readTime}</span>
            <span aria-hidden="true">·</span>
            <span>Objavljeno {post.publishedAt}</span>
          </div>

          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl text-balance">
            {post.title}
          </h1>

          <p className="mt-4 text-base sm:text-lg text-neutral-300 leading-relaxed">
            {post.summary}
          </p>

          {/* Author and Action bar */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-y border-neutral-800 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-600 to-purple-600 flex items-center justify-center font-bold text-white text-sm">
                ŽS
              </div>
              <div>
                <p className="text-xs font-semibold text-white">{post.author}</p>
                <p className="text-[11px] text-neutral-400">{post.authorRole}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={(e) => onLikePost(post.id, e)}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                  isLiked
                    ? 'border-pink-500/50 bg-pink-950/40 text-pink-300'
                    : 'border-neutral-800 bg-neutral-900 text-neutral-300 hover:border-neutral-700'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current text-pink-500' : ''}`} />
                <span className="font-mono tabular-nums">{post.likes} všečkov</span>
              </button>

              <button
                onClick={(e) => onToggleBookmark(post.id, e)}
                className={`inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                  isBookmarked
                    ? 'border-cyan-500/50 bg-cyan-950/40 text-cyan-300'
                    : 'border-neutral-800 bg-neutral-900 text-neutral-300 hover:border-neutral-700'
                }`}
              >
                {isBookmarked ? (
                  <BookmarkCheck className="w-3.5 h-3.5 text-cyan-400 fill-current" />
                ) : (
                  <Bookmark className="w-3.5 h-3.5" />
                )}
                <span>{isBookmarked ? 'Shranjeno' : 'Shrani'}</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs font-medium text-neutral-300 hover:border-neutral-700 transition-colors"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Povezava kopirana!' : 'Deli'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Featured Visual Banner */}
        <div className="mt-8">
          <ThemeCover theme={post.coverTheme} category={post.category} heightClass="h-72 sm:h-96" />
        </div>

        {/* Main Content Body */}
        <div className="mt-8 text-neutral-200">
          {renderFormattedContent(post.content)}
        </div>

        {/* Tags list */}
        <div className="mt-10 pt-6 border-t border-neutral-800">
          <p className="text-xs font-medium text-neutral-400 mb-2">Oznake / Teme:</p>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs text-neutral-400 hover:text-cyan-400 cursor-pointer font-mono"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Reader Comments Section */}
        <section className="mt-14 border-t border-neutral-800 pt-8">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-cyan-400" />
              <span>Komentarji bralcev ({(post.comments || []).length})</span>
            </h3>
          </div>

          {/* New Comment Form */}
          <form onSubmit={handleSubmitComment} className="mt-6 rounded-xl border border-neutral-800 bg-neutral-900/50 p-4">
            <h4 className="text-xs font-semibold text-neutral-300 mb-3">Dodaj svoj komentar ali vprašanje</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <input
                type="text"
                placeholder="Vaše ime ali vzdevek"
                value={newAuthor}
                onChange={(e) => setNewAuthor(e.target.value)}
                className="rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <textarea
              rows={3}
              placeholder="Napišite vaše mnenje o igri ali razvoju..."
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              className="w-full rounded-lg border border-neutral-800 bg-neutral-950 p-3 text-xs text-white placeholder-neutral-500 focus:border-cyan-500 focus:outline-none"
            />
            <div className="mt-3 flex items-center justify-between">
              {commentSuccess && (
                <span className="text-xs text-emerald-400">Vaš komentar je bil uspešno objavljen!</span>
              )}
              {!commentSuccess && <span />}
              <button
                type="submit"
                disabled={!newCommentText.trim()}
                className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-500 px-4 py-2 text-xs font-semibold text-neutral-950 hover:bg-cyan-400 disabled:opacity-50 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Objavi komentar</span>
              </button>
            </div>
          </form>

          {/* Comment List */}
          <div className="mt-6 space-y-3">
            {(post.comments || []).length === 0 ? (
              <p className="text-xs text-neutral-500 italic py-2">
                Bodi prvi, ki bo komentiral to novico!
              </p>
            ) : (
              (post.comments || []).map((comm) => (
                <div key={comm.id} className="rounded-xl border border-neutral-800/80 bg-neutral-900/30 p-4">
                  <div className="flex items-center justify-between text-xs text-neutral-400">
                    <span className="font-semibold text-white">{comm.author}</span>
                    <span>{comm.createdAt}</span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-neutral-300">
                    {comm.content}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Related Articles */}
        <section className="mt-16 border-t border-neutral-800 pt-8">
          <h3 className="text-lg font-bold text-white mb-6">Morda vas zanima tudi</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedPosts.map((related) => (
              <div
                key={related.id}
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  onSelectRelated(related);
                }}
                className="group rounded-xl border border-neutral-800 bg-neutral-900/40 p-4 hover:border-neutral-700 transition-all cursor-pointer"
              >
                <ThemeCover theme={related.coverTheme} category={related.category} heightClass="h-28" />
                <p className="mt-3 text-xs font-semibold text-white group-hover:text-cyan-400 transition-colors line-clamp-2">
                  {related.title}
                </p>
                <p className="mt-1 text-[11px] text-neutral-400">{related.readTime}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </article>
  );
};
