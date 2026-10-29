/**
 * Firestore Security Rules Test Suite (Dirty Dozen Verification)
 * Verifies that all 12 adversarial payloads in security_spec.md return PERMISSION_DENIED.
 */

export interface SecurityTestCase {
  id: number;
  name: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  path: string;
  auth: { uid: string; email: string; email_verified: boolean } | null;
  payload?: Record<string, unknown>;
  expectedResult: 'PERMISSION_DENIED';
}

export const DIRTY_DOZEN_TESTS: SecurityTestCase[] = [
  {
    id: 1,
    name: 'Unverified Admin Email Spoof',
    operation: 'create',
    path: '/posts/post_1',
    auth: { uid: 'spoof_uid', email: 'srdicziga@gmail.com', email_verified: false },
    payload: { id: 'post_1', title: 'Spoofed Post' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 2,
    name: 'Shadow Field Injection on Post Create',
    operation: 'create',
    path: '/posts/post_1',
    auth: { uid: 'admin_uid', email: 'srdicziga@gmail.com', email_verified: true },
    payload: { id: 'post_1', isFeaturedHack: true },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 3,
    name: 'Author Identity Spoofing on Comment Create',
    operation: 'create',
    path: '/posts/post_1/comments/comm_1',
    auth: { uid: 'attacker_uid', email: 'user@example.com', email_verified: true },
    payload: { id: 'comm_1', postId: 'post_1', authorId: 'victim_uid', content: 'Spoofed' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 4,
    name: 'Path Variable Poisoning',
    operation: 'create',
    path: '/posts/invalid$id!with@symbols',
    auth: { uid: 'admin_uid', email: 'srdicziga@gmail.com', email_verified: true },
    payload: { id: 'invalid$id!with@symbols' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 5,
    name: 'Oversized Title Denial-of-Wallet',
    operation: 'create',
    path: '/posts/post_oversized',
    auth: { uid: 'admin_uid', email: 'srdicziga@gmail.com', email_verified: true },
    payload: { id: 'post_oversized', title: 'A'.repeat(500) },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 6,
    name: 'Unbounded Tag Array Attack',
    operation: 'create',
    path: '/posts/post_tags',
    auth: { uid: 'admin_uid', email: 'srdicziga@gmail.com', email_verified: true },
    payload: { id: 'post_tags', tags: new Array(25).fill('tag') },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 7,
    name: 'Unauthorized Full Post Edit by Regular User',
    operation: 'update',
    path: '/posts/post_1',
    auth: { uid: 'regular_uid', email: 'reader@example.com', email_verified: true },
    payload: { title: 'Hacked Headline' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 8,
    name: 'Arbitrary Like Jump Attack',
    operation: 'update',
    path: '/posts/post_1',
    auth: { uid: 'regular_uid', email: 'reader@example.com', email_verified: true },
    payload: { likes: 999999 },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 9,
    name: 'Value Poisoning on Whitelisted Update Key',
    operation: 'update',
    path: '/posts/post_1',
    auth: { uid: 'regular_uid', email: 'reader@example.com', email_verified: true },
    payload: { likes: 'invalid_string_likes' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 10,
    name: 'Immortal Field Mutation (createdAt)',
    operation: 'update',
    path: '/posts/post_1/comments/comm_1',
    auth: { uid: 'commenter_uid', email: 'reader@example.com', email_verified: true },
    payload: { content: 'Updated', createdAt: '1999-01-01T00:00:00Z' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 11,
    name: 'Orphaned or Archived Parent Comment Write',
    operation: 'create',
    path: '/posts/archived_post/comments/comm_1',
    auth: { uid: 'commenter_uid', email: 'reader@example.com', email_verified: true },
    payload: { id: 'comm_1', postId: 'archived_post', authorId: 'commenter_uid', content: 'Hello' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 12,
    name: 'Unfiltered List Query on Archived Posts',
    operation: 'list',
    path: '/posts',
    auth: null,
    expectedResult: 'PERMISSION_DENIED',
  },
];
