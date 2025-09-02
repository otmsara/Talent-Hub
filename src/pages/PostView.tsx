import React from "react";
import { useParams, Link } from "react-router-dom";
import { posts, findUserById, currentUser } from "../data/dummyData";
import PostHeader from "../components/feed/PostHeader";
import PostContent from "../components/feed/PostContent";
import ProjectMeta from "../components/feed/ProjectMeta";
import PostEngagement from "../components/feed/PostEngagement";
import CommentsSection from "../components/feed/CommentsSection";
import CommentForm from "../components/comments/CommentForm";
import ProjectItem from "../components/projects/ProjectItem";
import { getCommentsForPost, setCommentsForPost, listAllCommentKeys } from "../data/commentStorage";

const PostView = () => {
  const { postId } = useParams();
  const post = posts.find((p) => String(p.id) === String(postId));
  const user = post ? findUserById(post.userId) : null;

  // Hydrate comments robustly from shared utility
  const [postComments, setPostComments] = React.useState(() => {
    const comments = getCommentsForPost(String(post?.id));
    // Debug log for syncing issues
    console.log('[PostView] post.id:', String(post?.id), 'comments:', comments);
    if ((!comments || comments.length === 0) && post?.id) {
      const allKeys = listAllCommentKeys();
      console.warn('[PostView] No comments found for post.id:', String(post?.id), 'All comment keys in localStorage:', allKeys);
    }
    return comments;
  });

  // Sync comments with localStorage and other components
  React.useEffect(() => {
    const syncComments = () => {
      const comments = getCommentsForPost(String(post?.id));
      // Debug log for syncing issues
      console.log('[PostView] SYNC post.id:', String(post?.id), 'comments:', comments);
      if ((!comments || comments.length === 0) && post?.id) {
        const allKeys = listAllCommentKeys();
        console.warn('[PostView] SYNC: No comments found for post.id:', String(post?.id), 'All comment keys in localStorage:', allKeys);
      }
      setPostComments(comments);
    };
    window.addEventListener('storage', syncComments);
    window.addEventListener('comments-updated', syncComments);

    // Always re-hydrate comments from localStorage on mount and when postId changes
    syncComments();

    return () => {
      window.removeEventListener('storage', syncComments);
      window.removeEventListener('comments-updated', syncComments);
    };
  }, [String(post?.id)]);
  const [expanded, setExpanded] = React.useState(true);
  const [isCommenting, setIsCommenting] = React.useState(postComments.length === 0);

  // (Removed effect that depended on post.comments; syncing is now only via localStorage and events)

  if (!post) {
    return (
      <div className="max-w-2xl mx-auto py-10 px-4">
        <div className="bg-white/5 border border-border rounded-2xl p-8 text-center text-muted-foreground shadow">
          Post not found.
        </div>
      </div>
    );
  }

  const handleCommentToggle = () => setIsCommenting((v) => !v);

  // Show comment box open by default if no comments
  React.useEffect(() => {
    if (postComments.length === 0) setIsCommenting(true);
  }, [postComments.length]);

  const handleCommentSubmit = (commentText: string) => {
    const newComment = {
      id: `c${Date.now()}`,
      userId: currentUser.id,
      text: commentText,
      createdAt: new Date(),
      agrees: 0,
      user: currentUser,
    };
    const updatedComments = [newComment, ...postComments];
    setPostComments(updatedComments);
    setCommentsForPost(String(post.id), updatedComments);
    setIsCommenting(false);
  };

  const handleReplySubmit = (text: string, parentId: string) => {
    const newReply = {
      id: `c${Date.now()}-${parentId}`,
      userId: currentUser.id,
      text,
      createdAt: new Date(),
      agrees: 0,
      user: currentUser,
      parentId,
    };
    const updatedComments = [...postComments];
    const addReplyToComment = (comments, parentId, newReply) => {
      for (let i = 0; i < comments.length; i++) {
        if (comments[i].id === parentId) {
          if (!comments[i].replies) comments[i].replies = [];
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
    setCommentsForPost(String(post.id), updatedComments);
  };

  // Use ProjectItem for project posts to ensure exact duplication of feed card and contributions card
  if (post.isProject) {
    return (
      <div className="max-w-2xl mx-auto py-10 px-4">
        <ProjectItem project={post} disableCardClick={true} />
        <div className="mt-4">
          <Link to="/" className="text-cyan-300 underline text-sm">
            ← Back to Feed
          </Link>
        </div>
      </div>
    );
  }

  // Render normal post view for non-project posts
  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <div
        className="post-card glass-panel animate-slide-in hover:bg-cyan-400/5 transition cursor-pointer"
        tabIndex={0}
      >
        <div className="mb-4">
          <PostHeader user={user} createdAt={post.createdAt} />
        </div>
        {post.name && (
          <div className="mb-2 flex items-center gap-2">
            <span className="text-xl font-bold text-cyan-200 hover:underline">
              {post.name}
            </span>
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
          collaborators={post.collaborators || []}
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
            onAmplify={() => {}}
            collaborators={post.collaborators || []}
            onCollaborateToggle={() => {}}
            hasAmplified={post.amplifiedBy ? post.amplifiedBy.includes(currentUser.id) : false}
            hasAgreed={(() => {
              const saved = localStorage.getItem(`post_agreed_${post.id}`);
              return saved === "true";
            })()}
            hasDisagreed={(() => {
              const saved = localStorage.getItem(`post_disagreed_${post.id}`);
              return saved === "true";
            })()}
            onAgree={(value: boolean) => {
              localStorage.setItem(`post_agreed_${post.id}`, value ? "true" : "false");
              if (value) {
                localStorage.setItem(`post_disagreed_${post.id}`, "false");
              }
            }}
            onDisagree={(value: boolean) => {
              localStorage.setItem(`post_disagreed_${post.id}`, value ? "true" : "false");
              if (value) {
                localStorage.setItem(`post_agreed_${post.id}`, "false");
              }
            }}
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
          toggleExpand={() => setExpanded(!expanded)}
          comments={postComments}
          postId={post.id}
          onReplySubmit={handleReplySubmit}
        />
      </div>
      <div className="mt-4">
        <Link to="/" className="text-cyan-300 underline text-sm">
          ← Back to Feed
        </Link>
      </div>
    </div>
  );
};

export default PostView;
