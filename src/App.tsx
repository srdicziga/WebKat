import React, { useState, useEffect } from 'react';
import { BlogPost, Comment } from './types';
import { INITIAL_POSTS } from './data/initialPosts';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { BlogFeed } from './components/BlogFeed';
import { ArticleView } from './components/ArticleView';
import { ServicesSection } from './components/ServicesSection';
import { ContactSection } from './components/ContactSection';
import { CmsStudio } from './components/CmsStudio';
import { Footer } from './components/Footer';

const STORAGE_KEY_POSTS = 'webkat_posts_v1';
const STORAGE_KEY_LIKES = 'webkat_liked_ids_v1';
const STORAGE_KEY_BOOKMARKS = 'webkat_bookmarked_ids_v1';

export default function App() {
  // Load posts from localStorage or initialize with INITIAL_POSTS
  const [posts, setPosts] = useState<BlogPost[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_POSTS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Error reading posts from storage:', e);
    }
    return INITIAL_POSTS;
  });

  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [currentTab, setCurrentTab] = useState<string>('domov');
  const [cmsOpen, setCmsOpen] = useState<boolean>(false);

  // Liked & bookmarked tracking
  const [likedPostIds, setLikedPostIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LIKES);
      if (saved) return new Set(JSON.parse(saved));
    } catch (e) {}
    return new Set<string>();
  });

  const [bookmarkedPostIds, setBookmarkedPostIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BOOKMARKS);
      if (saved) return new Set(JSON.parse(saved));
    } catch (e) {}
    return new Set<string>();
  });

  // Pre-fill state for contact inquiries from calculator or service packages
  const [inquiryPrefill, setInquiryPrefill] = useState({
    service: '',
    budget: '',
  });

  // Save posts to storage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(posts));
    } catch (e) {
      console.warn('Failed saving posts to localStorage', e);
    }
  }, [posts]);

  // Save likes and bookmarks
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LIKES, JSON.stringify(Array.from(likedPostIds)));
    } catch (e) {}
  }, [likedPostIds]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_BOOKMARKS, JSON.stringify(Array.from(bookmarkedPostIds)));
    } catch (e) {}
  }, [bookmarkedPostIds]);

  // Handle Likes
  const handleLikePost = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const isCurrentlyLiked = likedPostIds.has(postId);

    setLikedPostIds((prev) => {
      const next = new Set(prev);
      if (isCurrentlyLiked) {
        next.delete(postId);
      } else {
        next.add(postId);
      }
      return next;
    });

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const delta = isCurrentlyLiked ? -1 : 1;
          const updated = { ...p, likes: Math.max(0, p.likes + delta) };
          if (selectedPost?.id === postId) {
            setSelectedPost(updated);
          }
          return updated;
        }
        return p;
      })
    );
  };

  // Handle Bookmarks
  const handleToggleBookmark = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarkedPostIds((prev) => {
      const next = new Set(prev);
      if (next.has(postId)) {
        next.delete(postId);
      } else {
        next.add(postId);
      }
      return next;
    });
  };

  // Handle Comments
  const handleAddComment = (postId: string, comment: Comment) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const existingComments = p.comments || [];
          const updated = {
            ...p,
            comments: [comment, ...existingComments],
          };
          if (selectedPost?.id === postId) {
            setSelectedPost(updated);
          }
          return updated;
        }
        return p;
      })
    );
  };

  // CMS Handlers
  const handleSavePost = (savedPost: BlogPost) => {
    setPosts((prev) => {
      const exists = prev.some((p) => p.id === savedPost.id);
      if (exists) {
        return prev.map((p) => (p.id === savedPost.id ? savedPost : p));
      }
      return [savedPost, ...prev];
    });
    if (selectedPost?.id === savedPost.id) {
      setSelectedPost(savedPost);
    }
  };

  const handleDeletePost = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    if (selectedPost?.id === postId) {
      setSelectedPost(null);
    }
  };

  const handleResetPosts = () => {
    setPosts(INITIAL_POSTS);
    localStorage.removeItem(STORAGE_KEY_POSTS);
  };

  // Tab and navigation handling
  const handleSelectTab = (tab: string) => {
    setSelectedPost(null);
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectServiceForInquiry = (serviceName: string, estimatedPrice: string) => {
    setInquiryPrefill({
      service: serviceName,
      budget: estimatedPrice,
    });
    setSelectedPost(null);
    setCurrentTab('kontakt');
    // Scroll down to contact
    setTimeout(() => {
      const el = document.getElementById('contact-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-neutral-100 selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* Top Bar Contract Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        cmsOpen={cmsOpen}
        onToggleCms={() => setCmsOpen(!cmsOpen)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {selectedPost ? (
          <ArticleView
            post={selectedPost}
            onBack={() => {
              setSelectedPost(null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onLikePost={handleLikePost}
            isLiked={likedPostIds.has(selectedPost.id)}
            isBookmarked={bookmarkedPostIds.has(selectedPost.id)}
            onToggleBookmark={handleToggleBookmark}
            onAddComment={handleAddComment}
            allPosts={posts}
            onSelectRelated={(related) => setSelectedPost(related)}
          />
        ) : (
          <>
            {currentTab === 'domov' && (
              <>
                <Hero
                  onExploreBlog={() => {
                    const el = document.getElementById('blog-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  onExploreServices={() => {
                    const el = document.getElementById('services-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  onOpenCms={() => setCmsOpen(true)}
                />
                <BlogFeed
                  posts={posts}
                  onSelectPost={(post) => {
                    setSelectedPost(post);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onLikePost={handleLikePost}
                  likedPostIds={likedPostIds}
                  bookmarkedPostIds={bookmarkedPostIds}
                  onToggleBookmark={handleToggleBookmark}
                />
                <ServicesSection
                  onSelectServiceForInquiry={handleSelectServiceForInquiry}
                />
                <ContactSection
                  prefilledService={inquiryPrefill.service}
                  prefilledBudget={inquiryPrefill.budget}
                />
              </>
            )}

            {currentTab === 'blog' && (
              <div className="pt-8">
                <BlogFeed
                  posts={posts}
                  onSelectPost={(post) => {
                    setSelectedPost(post);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onLikePost={handleLikePost}
                  likedPostIds={likedPostIds}
                  bookmarkedPostIds={bookmarkedPostIds}
                  onToggleBookmark={handleToggleBookmark}
                />
              </div>
            )}

            {currentTab === 'storitve' && (
              <div className="pt-8">
                <ServicesSection
                  onSelectServiceForInquiry={handleSelectServiceForInquiry}
                />
              </div>
            )}

            {currentTab === 'kalkulator' && (
              <div className="pt-8">
                <ServicesSection
                  onSelectServiceForInquiry={handleSelectServiceForInquiry}
                />
              </div>
            )}

            {currentTab === 'kontakt' && (
              <div className="pt-8">
                <ContactSection
                  prefilledService={inquiryPrefill.service}
                  prefilledBudget={inquiryPrefill.budget}
                />
              </div>
            )}
          </>
        )}
      </main>

      {/* Built-in CMS & AI Studio Modal */}
      {cmsOpen && (
        <CmsStudio
          posts={posts}
          onSavePost={handleSavePost}
          onDeletePost={handleDeletePost}
          onResetPosts={handleResetPosts}
          onClose={() => setCmsOpen(false)}
        />
      )}

      {/* Footer */}
      <Footer
        onSelectTab={handleSelectTab}
        onOpenCms={() => setCmsOpen(true)}
      />
    </div>
  );
}
