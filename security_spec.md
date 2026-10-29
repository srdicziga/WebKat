# Security Specification (`security_spec.md`)

## 1. Data Invariants

1. **Default-Deny Catch-All**: No path in Firestore is accessible unless explicitly matched and authorized.
2. **Verified Identity**: All write operations (`create`, `update`, `delete`) require an authenticated user (`request.auth != null`) with a verified email (`request.auth.token.email_verified == true`).
3. **Admin Integrity**: Admin privileges require either existence of `/admins/$(request.auth.uid)` or the bootstrapped owner email (`srdicziga@gmail.com`) with `request.auth.token.email_verified == true`.
4. **Post Ownership & Publication State**:
   - Only admins can create, edit full content, or delete `/posts/{postId}` documents.
   - `authorId` must strictly equal `request.auth.uid` on creation and remain immutable on update.
   - `createdAt` must equal `request.time` on creation and remain immutable on update; `updatedAt` must equal `request.time`.
   - Terminal State Lock: Once a post reaches `status == 'archived'`, non-admin users cannot update it.
   - Non-admin verified users may only increment or decrement `likes` by 1 (`affectedKeys().hasOnly(['likes', 'updatedAt'])`) on `published` posts while satisfying full `isValidPost(incoming())` validation.
5. **Relational Master Gate on Comments (`/posts/{postId}/comments/{commentId}`)**:
   - A comment can only be created, updated, or read (single-doc) if the parent `/posts/{postId}` exists and its `status == 'published'`.
   - `authorId` must equal `request.auth.uid` on creation and is immutable.
   - `postId` must match the path `{postId}` and is immutable.
   - List queries on `/posts/{postId}/comments` must filter by `resource.data.status == 'visible'` without `get()` calls inside `allow list`.

---

## 2. The "Dirty Dozen" Adversarial Payloads

1. **Unverified Admin Email Spoof**: Attempting to create a post with `email == 'srdicziga@gmail.com'` when `email_verified == false`.
2. **Shadow Field Injection on Post Create**: Sending a valid `BlogPost` payload plus an undeclared field `{"isFeaturedHack": true}`.
3. **Author Identity Spoofing on Comment Create**: Creating a comment where `authorId` is set to another user's UID (`"victim_uid"`).
4. **Path Variable Poisoning (1.5KB Document ID)**: Creating `/posts/{postId}` with a 1500-character or non-alphanumeric ID (`"post/../../hack"`).
5. **Oversized Content Denial-of-Wallet**: Sending a `BlogPost` where `content.size() > 50000` or `title.size() > 200`.
6. **Unbounded Tag Array Attack**: Sending `tags` with 25 items (`tags.size() > 10`) or non-string first element (`tags: [12345]`).
7. **Unauthorized Full Post Edit by Regular User**: A non-admin user attempting to modify `title` or `content` on `/posts/{postId}`.
8. **Arbitrary Like Jump Attack**: A non-admin user attempting to set `likes: existing().likes + 1000` in a single update.
9. **Value Poisoning on Whitelisted Update Key**: A non-admin user updating only `['likes', 'updatedAt']` but setting `likes: "one_million"` (string instead of int).
10. **Immortal Field Mutation (`createdAt` / `authorId`)**: Updating a comment or post while altering `createdAt` or `authorId`.
11. **Orphaned / Archived Parent Comment Write**: Creating a comment under `/posts/{postId}/comments/{commentId}` when `/posts/{postId}` does not exist or has `status == 'archived'`.
12. **Unfiltered List Scraping on Draft/Archived Posts**: Executing a `list` query on `/posts` without filtering `status == 'published'` as a non-admin user.
