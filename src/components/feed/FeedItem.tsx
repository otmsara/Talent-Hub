import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PostHeader from './PostHeader';
import PostContent from './PostContent';
import ProjectMeta from './ProjectMeta';
import PostEngagement from './PostEngagement';
import CommentsSection from './CommentsSection';
import { Post, findUserById, Comment, currentUser } from '../../data/dummyData';
import CommentForm from '../comments/CommentForm';
import { toast } from 'sonner';
import { getCommentsForPost, setCommentsForPost } from '../../data/commentStorage';

interface FeedItemProps {
  post: Post;
  onPostUpdated?: () => void;
  disableCardClick?: boolean;
}

const FeedItem: React.FC<FeedItemProps> = ({ post, onPostUpdated, disableCardClick }) => {
  const [expanded, setExpanded] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);

  // Hydrate comments robustly from shared utility
  const [postComments, setPostComments] = useState<Comment[]>(() => {
    const comments = getCommentsForPost(String(post.id));
    // Debug log for syncing issues
    console.log('[FeedItem] post.id:', String(post.id), 'comments:', comments);
    return comments;
  });

  // Sync comments with localStorage and other components
  useEffect(() => {
    const syncComments = () => {
      const comments = getCommentsForPost(String(post.id));
      // Debug log for syncing issues
      console.log('[FeedItem] SYNC post.id:', String(post.id), 'comments:', comments);
      setPostComments(comments);
    };
    window.addEventListener('storage', syncComments);
    window.addEventListener('comments-updated', syncComments);
    return () => {
      window.removeEventListener('storage', syncComments);
      window.removeEventListener('comments-updated', syncComments);
    };
  }, [String(post.id)]);
  const [collaborators, setCollaborators] = useState<string[]>(post.collaborators || []);

  // Persist agree/disagree state per post in localStorage
  const [agreed, setAgreed] = useState(() => {
    const saved = localStorage.getItem(`post_agreed_${post.id}`);
    return saved === "true";
  });
  const [disagreed, setDisagreed] = useState(() => {
    const saved = localStorage.getItem(`post_disagreed_${post.id}`);
    return saved === "true";
  });

  const handleAgreePersist = (value: boolean) => {
    setAgreed(value);
    localStorage.setItem(`post_agreed_${post.id}`, value ? "true" : "false");
    if (value) {
      setDisagreed(false);
      localStorage.setItem(`post_disagreed_${post.id}`, "false");
    }
  };
  const handleDisagreePersist = (value: boolean) => {
    setDisagreed(value);
    localStorage.setItem(`post_disagreed_${post.id}`, value ? "true" : "false");
    if (value) {
      setAgreed(false);
      localStorage.setItem(`post_agreed_${post.id}`, "false");
    }
  };
  
  const user = findUserById(post.userId);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const handleCommentToggle = () => {
    setIsCommenting(!isCommenting);
  };

  const handleCommentSubmit = (commentText: string) => {
    const newComment: Comment = {
      id: `c${Date.now()}`,
      userId: currentUser.id,
      text: commentText,
      createdAt: new Date(),
      agrees: 0,
      user: currentUser,
    };

    const updatedComments = [newComment, ...postComments];
    setPostComments(updatedComments);
    setCommentsForPost(post.id, updatedComments);
    setIsCommenting(false);

    if (onPostUpdated) {
      onPostUpdated();
    }
  };

  const handleReplySubmit = (text: string, parentId: string) => {
    const newReply: Comment = {
      id: `c${Date.now()}-${parentId}`,
      userId: currentUser.id,
      text: text,
      createdAt: new Date(),
      agrees: 0,
      user: currentUser,
      parentId: parentId
    };

    const updatedComments = [...postComments];

    const addReplyToComment = (comments: Comment[], parentId: string, newReply: Comment) => {
      for (let i = 0; i < comments.length; i++) {
        if (comments[i].id === parentId) {
          if (!comments[i].replies) {
            comments[i].replies = [];
          }
          comments[i].replies = [newReply, ...comments[i].replies];
          return true;
        }

        if (comments[i].replies && comments[i].replies.length > 0) {
          const found = addReplyToComment(comments[i].replies, parentId, newReply);
          if (found) return true;
        }
      }
      return false;
    };

    addReplyToComment(updatedComments, parentId, newReply);
    setPostComments(updatedComments);
    setCommentsForPost(post.id, updatedComments);

    if (onPostUpdated) {
      onPostUpdated();
    }
  };
  
  const handleCollaborateToggle = (collaborating: boolean) => {
    if (collaborating) {
      if (!collaborators.includes(currentUser.id)) {
        const newCollaborators = [...collaborators, currentUser.id];
        setCollaborators(newCollaborators);
        post.collaborators = newCollaborators;
      }
    } else {
      const newCollaborators = collaborators.filter(id => id !== currentUser.id);
      setCollaborators(newCollaborators);
      post.collaborators = newCollaborators;
    }
    
    if (onPostUpdated) {
      onPostUpdated();
    }
  };

  const handleAmplify = (text?: string) => {
    // Check if user has already amplified this post
    const userHasAmplified = post.amplifiedBy ? post.amplifiedBy.includes(currentUser.id) : false;
    
    if (!userHasAmplified) {
      // Add user to amplifiedBy array
      const newAmplifiedBy = post.amplifiedBy ? [...post.amplifiedBy, currentUser.id] : [currentUser.id];
      post.amplifiedBy = newAmplifiedBy;
      
      // Provide feedback to the user
      toast.success(text ? 'Post amplified with your comment!' : 'Post amplified!');
    } else {
      // Remove user from amplifiedBy array
      post.amplifiedBy = post.amplifiedBy.filter(id => id !== currentUser.id);
      
      // Provide feedback to the user
      toast.success('Post amplification removed');
    }
    
    // Call onPostUpdated to refresh the UI
    if (onPostUpdated) {
      onPostUpdated();
    }
  };

// Make the entire card clickable, but allow agree/disagree without triggering navigation
  return (
    <div
      className="post-card glass-panel animate-slide-in hover:bg-cyan-400/5 transition"
      tabIndex={0}
      onClick={
        disableCardClick
          ? undefined
          : (e => {
              // Only navigate if the click is not on the engagement zone
              const engagementZone = (e.target as HTMLElement).closest('.post-engagement-zone');
              if (!engagementZone) {
                window.location.href = `/post/${post.id}`;
              }
            })
      }
    >
      <div className="mb-4">
        <PostHeader user={user} createdAt={post.createdAt} />
      </div>
      
      {post.name && (
        <div className="mb-2 flex items-center gap-2">
          <span className="text-xl font-bold text-cyan-200 hover:underline">
            {post.name}
          </span>
          {post.isProject && (
            <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-cyan-400/20 text-cyan-200 shadow-[0_0_8px_2px_rgba(34,211,238,0.2)]">
              Project
            </span>
          )}
        </div>
      )}

      <PostContent 
        text={post.text} 
        images={post.images} 
        video={post.video} 
        link={post.link} 
      />
      
      <ProjectMeta 
        isProject={!!post.isProject} 
        collaborators={collaborators || []}
      />

      <div className="post-engagement-zone">
        <PostEngagement 
          postId={post.id} 
          agrees={post.agrees || 0} 
          disagrees={post.disagrees || 0} 
          comments={postComments.length} 
          amplifiedBy={post.amplifiedBy || []} 
          amplifiedCount={post.amplifiedBy ? post.amplifiedBy.length : 0}
          commentsCount={postComments.length}
          isProject={!!post.isProject}
          onCommentClick={handleCommentToggle}
          onAmplify={handleAmplify}
          collaborators={collaborators || []}
          onCollaborateToggle={handleCollaborateToggle}
          hasAmplified={post.amplifiedBy ? post.amplifiedBy.includes(currentUser.id) : false}
          hasAgreed={agreed}
          hasDisagreed={disagreed}
          onAgree={handleAgreePersist}
          onDisagree={handleDisagreePersist}
        />
      </div>
      
      {isCommenting && (
        <CommentForm 
          postId={post.id}
          onCommentSubmit={handleCommentSubmit}
        />
      )}
      
      <CommentsSection 
        expanded={expanded}
        toggleExpand={toggleExpand}
        comments={postComments}
        postId={post.id}
        onReplySubmit={handleReplySubmit}
      />
    </div>
  );
};

export default FeedItem;
