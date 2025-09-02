/**
 * Robust comment storage utility for syncing comments across feed and post pages.
 * Always uses String(postId) for localStorage key.
 */

export function getCommentsForPost(postId: string | number): any[] {
  const key = `post_comments_${String(postId)}`;
  try {
    let saved = localStorage.getItem(key);
    // If not found, try to migrate from a similar key (number <-> string)
    if (!saved) {
      const allKeys = listAllCommentKeys();
      // Try to find a key that matches except for type
      const altKey = allKeys.find(k => {
        const suffix = k.replace('post_comments_', '');
        return suffix == postId && k !== key;
      });
      if (altKey) {
        saved = localStorage.getItem(altKey);
        // Migrate to the correct key
        if (saved) {
          localStorage.setItem(key, saved);
          localStorage.removeItem(altKey);
        }
      }
    }
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed.map(c => ({
          ...c,
          createdAt: c.createdAt ? new Date(c.createdAt) : new Date()
        }));
      }
    }
  } catch {}
  return [];
  // Never fall back to post.comments or dummyData
}

// List all comment keys in localStorage for debugging
export function listAllCommentKeys(): string[] {
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith('post_comments_')) {
      keys.push(k);
    }
  }
  return keys;
}

export function setCommentsForPost(postId: string | number, comments: any[]) {
  const key = `post_comments_${String(postId)}`;
  try {
    localStorage.setItem(key, JSON.stringify(comments));
    window.dispatchEvent(new Event('comments-updated'));
  } catch {}
}
