import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { BlogPost, Comment } from './types';
import { INITIAL_POSTS } from './data/initialPosts';
import {
  auth,
  isUserAdmin,
  subscribeToPublishedPosts,
  savePostToFirestore,
  deletePostFromFirestore,
  updatePostLikesInFirestore,
  seedInitialPostsToFirestore,
} from './firebase';
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

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState<boolean>(false);
  const [isCloudSynced, setIsCloudSynced] = useState<boolean>(false);

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

  // 1. Track Firebase Auth state
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthReady(true);
    });
    return () => unsubscribeAuth();
  }, []);

  // 2. Subscribe to Firestore published posts once auth is ready
  useEffect(() => {
    if (!authReady) return;

    const unsubscribePosts = subscribeToPublishedPosts((cloudPosts) => {
      if (cloudPosts.length > 0) {
        setIsCloudSynced(true);
        // Merge initial posts that might not yet be in Firestore so the portal is always rich
        const cloudIds = new Set(cloudPosts.map((p) => p.id));
        const remainingInitial = INITIAL_POSTS.filter((ip) => !cloudIds.has(ip.id));
        const combined = [...cloudPosts, ...remainingInitial];
        setPosts(combined);
      } else {
        // If database is empty and admin is logged in, automatically seed initial posts
        if (currentUser && isUserAdmin(currentUser)) {
          seedInitialPostsToFirestore(INITIAL_POSTS).catch((err) => {
            console.warn('Auto-seed skipped:', err);
          });
        }
      }
    });

    return () => unsubscribePosts();
  }, [authReady, currentUser]);

  // Save posts to local cache as well
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(posts));
    } catch (e) {
      console.warn('Failed saving posts to localStorage', e);
    }
  }, [posts]);

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

  // Handle Likes (local + Firestore if signed in)
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
          const newLikes = Math.max(0, p.likes + delta);
          const updated = { ...p, likes: newLikes };
          if (selectedPost?.id === postId) {
            setSelectedPost(updated);
          }
          if (currentUser && isCloudSynced) {
            updatePostLikesInFirestore(postId, newLikes).catch(() => {});
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

  // Handle Local Fallback Comments
  const handleAddLocalComment = (postId: string, comment: Comment) => {
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

  // CMS Handlers (Firestore + local state)
  const handleSavePost = async (savedPost: BlogPost, isExisting: boolean) => {
    if (currentUser && isUserAdmin(currentUser)) {
      await savePostToFirestore(savedPost, isExisting);
      setIsCloudSynced(true);
    }

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

  const handleDeletePost = async (postId: string) => {
    if (currentUser && isUserAdmin(currentUser)) {
      await deletePostFromFirestore(postId);
    }
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    if (selectedPost?.id === postId) {
      setSelectedPost(null);
    }
  };

  const handleSeedCloudPosts = async (): Promise<number> => {
    const count = await seedInitialPostsToFirestore(INITIAL_POSTS);
    setIsCloudSynced(true);
    return count;
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
            currentUser={currentUser}
            onBack={() => {
              setSelectedPost(null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onLikePost={handleLikePost}
            isLiked={likedPostIds.has(selectedPost.id)}
            isBookmarked={bookmarkedPostIds.has(selectedPost.id)}
            onToggleBookmark={handleToggleBookmark}
            onAddLocalComment={handleAddLocalComment}
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

      {/* Built-in Cloud CMS & AI Studio Modal */}
      {cmsOpen && (
        <CmsStudio
          posts={posts}
          currentUser={currentUser}
          isCloudSynced={isCloudSynced}
          onSavePost={handleSavePost}
          onDeletePost={handleDeletePost}
          onSeedCloudPosts={handleSeedCloudPosts}
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
