import React, { useState, useEffect } from 'react';
import CreatePostForm from '../components/feed/CreatePostForm';
import FeedItem from '../components/feed/FeedItem';
import ProjectItem from '../components/projects/ProjectItem';
import { generateFeed } from '../data/dummyData';
import { Button } from '../components/ui/button';
import { useFeedType } from '../components/feed/FeedTypeContext';

// Top-level error boundary for the entire module
let fatalError: string | null = null;
let initialFeed: any[] = [];
let initialFeedType: any = null;

try {
  // Emergency fix: clear all corrupted post_comments_* keys from localStorage
  try {
    Object.keys(localStorage)
      .filter(k => k.startsWith('post_comments_'))
      .forEach(k => localStorage.removeItem(k));
  } catch {}

  initialFeed = generateFeed();
} catch (e: any) {
  fatalError = 'Error in generateFeed: ' + (e?.message || String(e));
}

const Index = () => {
  if (fatalError) {
    return (
      <div className="p-8 text-center text-destructive bg-destructive/10 border border-destructive/30 rounded">
        <h2 className="text-lg font-bold mb-2">Feed Error</h2>
        <pre className="text-sm whitespace-pre-wrap">{fatalError}</pre>
        <p className="mt-4 text-muted-foreground">Check the browser console for more details.</p>
      </div>
    );
  }

  let feedType, setFeedType;
  try {
    ({ feedType } = useFeedType());
  } catch (e: any) {
    return (
      <div className="p-8 text-center text-destructive bg-destructive/10 border border-destructive/30 rounded">
        <h2 className="text-lg font-bold mb-2">Feed Error</h2>
        <pre className="text-sm whitespace-pre-wrap">Error in useFeedType: {e?.message || String(e)}</pre>
        <p className="mt-4 text-muted-foreground">Check the browser console for more details.</p>
      </div>
    );
  }

  const [feed, setFeed] = useState(initialFeed);
  const [displayCount, setDisplayCount] = useState(5);

  useEffect(() => {
    setDisplayCount(5); // Reset display count when feedType changes
  }, [feedType]);

  const filteredFeed = Array.isArray(feed)
    ? feed.filter(post => {
        if (feedType === 'all') return true;
        if (feedType === 'posts') return !post.isProject && !post.isAggregator;
        if (feedType === 'projects') return post.isProject;
        if (feedType === 'aggregators') return post.isAggregator;
        return true;
      })
    : [];

  const displayedFeed = filteredFeed.slice(0, displayCount);
  const hasMore = displayedFeed.length < filteredFeed.length;

  const handlePostCreated = () => {
    try {
      setFeed(generateFeed());
    } catch (e: any) {
      setFeed([]);
      fatalError = 'Error in generateFeed: ' + (e?.message || String(e));
    }
  };

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 5);
  };

  // Show create form only for posts and projects, not for aggregators
  const showCreateForm = feedType === 'all' || feedType === 'posts' || feedType === 'projects';

  // ErrorBoundary for individual feed items
  const SafeFeedItem = ({ post, onPostUpdated }: any) => {
    try {
      if (post.isProject) {
        return <ProjectItem key={post.id} project={post} />;
      } else {
        return <FeedItem key={post.id} post={post} onPostUpdated={onPostUpdated} />;
      }
    } catch (e) {
      // Optionally clear corrupted localStorage for this post
      try {
        localStorage.removeItem(`post_comments_${post.id}`);
      } catch {}
      return (
        <div key={post.id} className="bg-destructive/10 border border-destructive/30 rounded p-4 text-destructive">
          Error rendering post {post.id}. The post data may be corrupted.
        </div>
      );
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-2 sm:px-0 overflow-x-hidden">
      {/* Create post form - only show for non-aggregator feeds */}
      {showCreateForm && (
        <CreatePostForm 
          isProject={feedType === 'projects'} 
          onPostCreated={handlePostCreated} 
        />
      )}

      {/* Clean, robust feed rendering */}
      <div className="mt-6 flex flex-col space-y-6">
        {displayedFeed.length > 0 ? (
          displayedFeed.map((post) =>
            <SafeFeedItem key={post.id} post={post} onPostUpdated={handlePostCreated} />
          )
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No {feedType} to display</p>
          </div>
        )}
      </div>

      {hasMore && (
        <div className="flex justify-center my-6">
          <Button 
            onClick={handleLoadMore}
            variant="secondary"
            className="w-full max-w-xs"
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  );
};

export default Index;
