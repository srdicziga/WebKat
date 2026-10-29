import React, { useState, useMemo } from 'react';
import { BlogPost, BlogCategory } from '../types';
import { ThemeCover } from './ThemeCover';
import { Search, Heart, Clock, ArrowUpRight, Bookmark, BookmarkCheck } from 'lucide-react';

interface BlogFeedProps {
  posts: BlogPost[];
  onSelectPost: (post: BlogPost) => void;
  onLikePost: (postId: string, e: React.MouseEvent) => void;
  likedPostIds: Set<string>;
  bookmarkedPostIds: Set<string>;
  onToggleBookmark: (postId: string, e: React.MouseEvent) => void;
}

export const BlogFeed: React.FC<BlogFeedProps> = ({
  posts,
  onSelectPost,
  onLikePost,
  likedPostIds,
  bookmarkedPostIds,
  onToggleBookmark,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'readTime'>('newest');

  const filteredPosts = useMemo(() => {
    return posts
      .filter((post) => {
        const matchesCategory =
          selectedCategory === 'all' || post.category === selectedCategory;
        const matchesSearch =
          searchQuery.trim() === '' ||
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          );
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'popular') {
          return b.likes - a.likes;
        }
        if (sortBy === 'readTime') {
          const aTime = parseInt(a.readTime, 10) || 5;
          const bTime = parseInt(b.readTime, 10) || 5;
          return aTime - bTime;
        }
        // default newest
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      });
  }, [posts, selectedCategory, searchQuery, sortBy]);

  const categories: { key: string; label: string }[] = [
    { key: 'all', label: 'Vse Novice' },
    { key: 'gaming', label: 'Gaming Novice' },
    { key: 'webdev', label: 'Spletni Razvoj' },
    { key: 'seo', label: 'SEO & Marketing' },
  ];

  return (
    <section id="blog-section" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
            WebKat Magazin & Baza Znanja
          </p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Zadnje novice, analize in vodniki
          </h2>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Išči po novicah, igrah ali temah..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 rounded-lg border border-neutral-800 bg-neutral-900 py-1.5 pl-9 pr-3 text-xs text-white placeholder-neutral-500 focus:border-cyan-500 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-neutral-500 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs text-neutral-300 focus:border-cyan-500 focus:outline-none"
          >
            <option value="newest">Najnovejše</option>
            <option value="popular">Najbolj priljubljeno</option>
            <option value="readTime">Krajši čas branja</option>
          </select>
        </div>
      </div>

      {/* Category Filter Tabs - Interactive buttons adhering to Section 1.A */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              selectedCategory === cat.key
                ? 'bg-cyan-500 text-neutral-950 font-semibold'
                : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-800 hover:text-white border border-neutral-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Post count status */}
      <div className="mt-4 flex items-center justify-between text-xs text-neutral-400">
        <span>Prikazujem {filteredPosts.length} od {posts.length} člankov</span>
        {bookmarkedPostIds.size > 0 && (
          <span className="text-cyan-400">Shranjenih člankov za branje: {bookmarkedPostIds.size}</span>
        )}
      </div>

      {/* Articles Grid */}
      {filteredPosts.length === 0 ? (
        <div className="mt-12 rounded-xl border border-neutral-800 bg-neutral-900/50 p-12 text-center">
          <p className="text-base text-neutral-300">Ni najdenih člankov za vaš iskalni niz.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="mt-4 text-xs font-semibold text-cyan-400 hover:underline"
          >
            Ponastavi filtre
          </button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => {
            const isLiked = likedPostIds.has(post.id);
            const isBookmarked = bookmarkedPostIds.has(post.id);

            return (
              <article
                key={post.id}
                onClick={() => onSelectPost(post)}
                className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-neutral-800/80 bg-neutral-900/60 p-5 transition-all duration-200 hover:border-neutral-700 hover:bg-neutral-900 cursor-pointer"
              >
                <div>
                  {/* Theme Cover */}
                  <ThemeCover theme={post.coverTheme} category={post.category} heightClass="h-44" />

                  {/* Clean unboxed metadata with typographic separators (Rule 1.A) */}
                  <div className="mt-4 flex items-center gap-2 text-xs text-neutral-400">
                    <span className="font-medium text-cyan-400">{post.categoryLabel}</span>
                    <span aria-hidden="true">·</span>
                    <span>{post.readTime}</span>
                    <span aria-hidden="true">·</span>
                    <span>{post.publishedAt}</span>
                  </div>

                  {/* Title without orphan words */}
                  <h3 className="mt-2 text-lg font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2 text-balance">
                    {post.title}
                  </h3>

                  {/* Summary */}
                  <p className="mt-2 text-xs leading-relaxed text-neutral-300 line-clamp-3">
                    {post.summary}
                  </p>
                </div>

                {/* Footer of Card */}
                <div className="mt-5 border-t border-neutral-800/80 pt-4 flex items-center justify-between text-xs text-neutral-400">
                  <div className="flex items-center gap-3">
                    {/* Like button */}
                    <button
                      onClick={(e) => onLikePost(post.id, e)}
                      title="Všečkaj članek"
                      className={`inline-flex items-center gap-1.5 transition-colors ${
                        isLiked ? 'text-pink-400 font-semibold' : 'hover:text-white'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current text-pink-500' : ''}`} />
                      <span className="font-mono tabular-nums">{post.likes}</span>
                    </button>

                    {/* Bookmark */}
                    <button
                      onClick={(e) => onToggleBookmark(post.id, e)}
                      title={isBookmarked ? 'Odstrani iz shranjenih' : 'Shrani za kasnejše branje'}
                      className={`inline-flex items-center transition-colors ${
                        isBookmarked ? 'text-cyan-400' : 'hover:text-white'
                      }`}
                    >
                      {isBookmarked ? (
                        <BookmarkCheck className="w-3.5 h-3.5 text-cyan-400 fill-current" />
                      ) : (
                        <Bookmark className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  <span className="inline-flex items-center gap-1 font-medium text-cyan-400 group-hover:underline">
                    <span>Preberi celotno</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};
