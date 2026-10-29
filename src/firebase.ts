import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  getDocFromServer,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  serverTimestamp,
  getDocs,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { BlogPost, Comment, BlogCategory } from './types';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export const ADMIN_EMAIL = 'srdicziga@gmail.com';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Validate connection to Firestore on boot
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
testConnection();

// Sanitization helpers matching firebase-blueprint.json & firestore.rules
export function sanitizeId(raw: string): string {
  const cleaned = raw.replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 128);
  return cleaned.length > 0 ? cleaned : 'id_' + Date.now();
}

export function sanitizeSlug(raw: string): string {
  const cleaned = raw
    .toLowerCase()
    .replace(/č/g, 'c')
    .replace(/š/g, 's')
    .replace(/ž/g, 'z')
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 160);
  return cleaned.length > 0 ? cleaned : 'clanek-' + Date.now();
}

export async function loginWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

export function isUserAdmin(user: User | null): boolean {
  if (!user) return false;
  return Boolean(user.emailVerified && user.email?.toLowerCase() === ADMIN_EMAIL);
}

// Subscribe to published posts in Firestore
export function subscribeToPublishedPosts(
  onPostsUpdate: (posts: BlogPost[]) => void,
  onErrorCallback?: (err: Error) => void
) {
  const postsPath = 'posts';
  const q = query(collection(db, postsPath), where('status', '==', 'published'));

  return onSnapshot(
    q,
    (snapshot) => {
      const loaded: BlogPost[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        loaded.push({
          id: data.id || docSnap.id,
          slug: data.slug || docSnap.id,
          title: data.title || '',
          summary: data.summary || '',
          content: data.content || '',
          category: (data.category as BlogCategory) || 'gaming',
          categoryLabel: data.categoryLabel || 'Gaming Novice',
          readTime: data.readTime || '4 min branja',
          publishedAt: data.publishedAt || 'Danes',
          author: data.author || 'Žiga Srdič',
          authorRole: data.authorRole || 'WebKat Glavni Urednik & Razvijalec',
          authorId: data.authorId,
          tags: Array.isArray(data.tags) ? data.tags : [],
          likes: typeof data.likes === 'number' ? data.likes : 0,
          views: typeof data.views === 'number' ? data.views : 0,
          coverTheme: data.coverTheme || 'vice',
          status: data.status || 'published',
        });
      });
      onPostsUpdate(loaded);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, postsPath);
      } catch (handledErr) {
        if (onErrorCallback && handledErr instanceof Error) {
          onErrorCallback(handledErr);
        }
      }
    }
  );
}

// Create or update a BlogPost in Firestore (strictly adhering to schema & rules)
export async function savePostToFirestore(post: BlogPost, isExisting: boolean): Promise<void> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('Za shranjevanje članka v bazo se morate najprej prijaviti.');
  }

  const validId = sanitizeId(post.id);
  const validSlug = sanitizeSlug(post.slug || post.title);
  const validTags = (post.tags || [])
    .map((t) => String(t).trim().slice(0, 50))
    .filter((t) => t.length >= 1)
    .slice(0, 10);

  const postPath = `posts/${validId}`;
  const postRef = doc(db, 'posts', validId);

  const validCategory: BlogCategory = ['gaming', 'webdev', 'seo', 'hardware'].includes(post.category)
    ? post.category
    : 'gaming';

  const validTheme = ['vice', 'tactical', 'cyber', 'speed', 'code', 'hardware'].includes(
    post.coverTheme
  )
    ? post.coverTheme
    : 'vice';

  try {
    if (isExisting) {
      await updateDoc(postRef, {
        slug: validSlug,
        title: post.title.trim().slice(0, 200).padEnd(3, '.'),
        summary: (post.summary || post.title).trim().slice(0, 500).padEnd(5, '.'),
        content: post.content.trim().slice(0, 50000).padEnd(10, '.'),
        category: validCategory,
        categoryLabel: (post.categoryLabel || 'Gaming Novice').slice(0, 50),
        readTime: (post.readTime || '4 min branja').slice(0, 40),
        publishedAt: (post.publishedAt || 'Danes').slice(0, 60),
        author: (post.author || 'Žiga Srdič').slice(0, 100),
        authorRole: (post.authorRole || 'WebKat Glavni Urednik & Razvijalec').slice(0, 120),
        tags: validTags.length > 0 ? validTags : ['WebKat'],
        likes: Math.max(0, Math.floor(post.likes || 0)),
        views: Math.max(0, Math.floor(post.views || 0)),
        coverTheme: validTheme,
        status: 'published',
        updatedAt: serverTimestamp(),
      });
    } else {
      await setDoc(postRef, {
        id: validId,
        slug: validSlug,
        title: post.title.trim().slice(0, 200).padEnd(3, '.'),
        summary: (post.summary || post.title).trim().slice(0, 500).padEnd(5, '.'),
        content: post.content.trim().slice(0, 50000).padEnd(10, '.'),
        category: validCategory,
        categoryLabel: (post.categoryLabel || 'Gaming Novice').slice(0, 50),
        readTime: (post.readTime || '4 min branja').slice(0, 40),
        publishedAt: (post.publishedAt || 'Danes').slice(0, 60),
        author: (post.author || 'Žiga Srdič').slice(0, 100),
        authorRole: (post.authorRole || 'WebKat Glavni Urednik & Razvijalec').slice(0, 120),
        authorId: user.uid,
        tags: validTags.length > 0 ? validTags : ['WebKat'],
        likes: Math.max(0, Math.floor(post.likes || 0)),
        views: Math.max(0, Math.floor(post.views || 0)),
        coverTheme: validTheme,
        status: 'published',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(
      error,
      isExisting ? OperationType.UPDATE : OperationType.CREATE,
      postPath
    );
  }
}

export async function deletePostFromFirestore(postId: string): Promise<void> {
  const validId = sanitizeId(postId);
  const postPath = `posts/${validId}`;
  try {
    await deleteDoc(doc(db, 'posts', validId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, postPath);
  }
}

export async function updatePostLikesInFirestore(postId: string, newLikes: number): Promise<void> {
  if (!auth.currentUser) return;
  const validId = sanitizeId(postId);
  const postPath = `posts/${validId}`;
  try {
    await updateDoc(doc(db, 'posts', validId), {
      likes: Math.max(0, Math.floor(newLikes)),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, postPath);
  }
}

// Subscribe to comments subcollection for a specific post
export function subscribeToPostComments(
  postId: string,
  onCommentsUpdate: (comments: Comment[]) => void
) {
  const validPostId = sanitizeId(postId);
  const commentsPath = `posts/${validPostId}/comments`;
  const q = query(collection(db, 'posts', validPostId, 'comments'), where('status', '==', 'visible'));

  return onSnapshot(
    q,
    (snapshot) => {
      const list: Comment[] = [];
      snapshot.forEach((docSnap) => {
        const d = docSnap.data();
        list.push({
          id: d.id || docSnap.id,
          author: d.author || 'Bralec',
          avatarSeed: d.avatarSeed || 'bralec',
          content: d.content || '',
          createdAt: d.createdAt?.toDate
            ? d.createdAt.toDate().toLocaleDateString('sl-SI', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              })
            : 'Pravkar',
        });
      });
      onCommentsUpdate(list);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, commentsPath);
      } catch (e) {
        // Logged via handleFirestoreError
      }
    }
  );
}

// Add a comment to `/posts/{postId}/comments/{commentId}`
export async function addCommentToFirestore(
  postId: string,
  authorName: string,
  contentText: string
): Promise<void> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('Za objavo komentarja v živo se prijavite z Google računom.');
  }

  const validPostId = sanitizeId(postId);
  const commentId = sanitizeId('comm_' + Date.now());
  const commentPath = `posts/${validPostId}/comments/${commentId}`;
  const cleanAuthor = (authorName.trim() || user.displayName || 'Bralec').slice(0, 80);
  const cleanContent = contentText.trim().slice(0, 2000);

  try {
    await setDoc(doc(db, 'posts', validPostId, 'comments', commentId), {
      id: commentId,
      postId: validPostId,
      author: cleanAuthor,
      authorId: user.uid,
      avatarSeed: cleanAuthor.toLowerCase().slice(0, 80),
      content: cleanContent,
      status: 'visible',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, commentPath);
  }
}

// Seed initial posts into Firestore if admin clicks sync or when database is empty
export async function seedInitialPostsToFirestore(initialPosts: BlogPost[]): Promise<number> {
  const user = auth.currentUser;
  if (!user || !isUserAdmin(user)) {
    throw new Error('Samo skrbnik (srdicziga@gmail.com) lahko sinhronizira začetne članke v bazo.');
  }

  let count = 0;
  const existingSnap = await getDocs(
    query(collection(db, 'posts'), where('status', '==', 'published'))
  );
  const existingIds = new Set<string>();
  existingSnap.forEach((d) => existingIds.add(d.id));

  for (const post of initialPosts) {
    const validId = sanitizeId(post.id);
    if (!existingIds.has(validId)) {
      await savePostToFirestore(post, false);
      count++;
    }
  }
  return count;
}
