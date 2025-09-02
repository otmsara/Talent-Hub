
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Send } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { currentUser, users, posts } from '@/data/dummyData';
import { getPromptsByCreator } from '@/data/dummyPrompts';
import { toast } from 'sonner';
import PostEngagement from '../feed/PostEngagement';

// Create marketplace-specific posts based on real users and their prompts
const generateMarketplacePosts = () => {
  return users.slice(0, 5).map((user, index) => {
    const userPrompts = getPromptsByCreator(user.id);
    const hasPrompts = userPrompts.length > 0;
    const promptName = hasPrompts ? userPrompts[0].title : 'AI Content Generator';
    
    return {
      id: `mp${index}`,
      user: user,
      content: hasPrompts 
        ? `Just published my "${promptName}" prompt in the marketplace! It's helping me ${userPrompts[0].description.substring(0, 50)}... Check it out!`
        : `Just published my "Advanced ${['SEO', 'Content', 'Code', 'Marketing', 'Research'][index]} Generator" prompt in the marketplace! It's been really helpful for my projects.`,
      timestamp: ['Just now', '2 hours ago', '5 hours ago', '1 day ago', '3 days ago'][index],
      likes: Math.floor(Math.random() * 30) + 5,
      comments: Math.floor(Math.random() * 10),
      promptId: hasPrompts ? userPrompts[0].id : `prompt-${index}-123`,
      amplifiedCount: Math.floor(Math.random() * 5)
    };
  });
};

const DiscussionFeed = () => {
  const [initialPosts] = useState(generateMarketplacePosts());
  const [allPosts, setAllPosts] = useState([...initialPosts]);
  const [newPost, setNewPost] = useState('');
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [commentInputs, setCommentInputs] = useState<{[key: string]: string}>({});
  const [showComments, setShowComments] = useState<{[key: string]: boolean}>({});
  const [amplifiedPosts, setAmplifiedPosts] = useState<string[]>([]);

  // Add the marketplace posts to the global posts array on component mount
  useEffect(() => {
    // This adds the marketplace-specific posts to the user's profile feed
    // In a real app, this would be done through a database
    const marketplacePosts = initialPosts.map(post => ({
      id: post.id,
      userId: post.user.id,
      text: post.content,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 1000000000)),
      agrees: post.likes,
      disagrees: 0,
      amplifiedBy: [],
      comments: [],
      isMarketplacePost: true,
      promptId: post.promptId
    }));
    
    // Only add these posts once to avoid duplicates
    marketplacePosts.forEach(post => {
      if (!posts.some(p => p.id === post.id)) {
        posts.push(post);
      }
    });
  }, [initialPosts]);

  const handleLike = (postId: string) => {
    if (likedPosts.includes(postId)) {
      setLikedPosts(likedPosts.filter(id => id !== postId));
      setAllPosts(allPosts.map(post => 
        post.id === postId ? { ...post, likes: post.likes - 1 } : post
      ));
    } else {
      setLikedPosts([...likedPosts, postId]);
      setAllPosts(allPosts.map(post => 
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      ));
    }
  };

  const handleCommentToggle = (postId: string) => {
    setShowComments({
      ...showComments,
      [postId]: !showComments[postId]
    });
  };

  const handleCommentChange = (postId: string, value: string) => {
    setCommentInputs({
      ...commentInputs,
      [postId]: value
    });
  };

  const handleCommentSubmit = (postId: string) => {
    const comment = commentInputs[postId];
    if (!comment || comment.trim() === '') return;

    // Add comment to the post
    setAllPosts(allPosts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: post.comments + 1
        };
      }
      return post;
    }));

    // Add comment to the global posts array
    const postInGlobal = posts.find(p => p.id === postId);
    if (postInGlobal && !postInGlobal.comments) {
      postInGlobal.comments = [];
    }
    if (postInGlobal) {
      postInGlobal.comments.push({
        id: `c${Date.now()}`,
        userId: currentUser.id,
        text: comment,
        createdAt: new Date(),
        agrees: 0,
        user: currentUser
      });
    }

    // Clear comment input
    setCommentInputs({
      ...commentInputs,
      [postId]: ''
    });

    toast.success('Comment added');
  };

  const handleAmplify = (postId: string, text?: string) => {
    // Add the post to the amplified posts
    if (!amplifiedPosts.includes(postId)) {
      setAmplifiedPosts([...amplifiedPosts, postId]);
      
      // Update the amplifiedBy array in the global posts array
      const postInGlobal = posts.find(p => p.id === postId);
      if (postInGlobal) {
        if (!postInGlobal.amplifiedBy) {
          postInGlobal.amplifiedBy = [];
        }
        
        if (!postInGlobal.amplifiedBy.includes(currentUser.id)) {
          postInGlobal.amplifiedBy.push(currentUser.id);
        }
      }
      
      // Update local state
      setAllPosts(allPosts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            amplifiedCount: post.amplifiedCount ? post.amplifiedCount + 1 : 1
          };
        }
        return post;
      }));
      
      toast.success(text ? 'Post amplified with comment' : 'Post amplified');
    } else {
      // Remove from amplified posts
      setAmplifiedPosts(amplifiedPosts.filter(id => id !== postId));
      
      // Update the amplifiedBy array in the global posts array
      const postInGlobal = posts.find(p => p.id === postId);
      if (postInGlobal && postInGlobal.amplifiedBy) {
        postInGlobal.amplifiedBy = postInGlobal.amplifiedBy.filter(id => id !== currentUser.id);
      }
      
      // Update local state
      setAllPosts(allPosts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            amplifiedCount: (post.amplifiedCount || 1) - 1
          };
        }
        return post;
      }));
      
      toast.success('Post amplification removed');
    }
  };

  const handleShare = (postId: string) => {
    toast.success('Post link copied to clipboard!');
  };

  const handlePostSubmit = () => {
    if (!newPost.trim()) return;
    
    const newPostObj = {
      id: `mp${Date.now()}`,
      user: currentUser,
      content: newPost,
      timestamp: 'Just now',
      likes: 0,
      comments: 0,
      promptId: '',
      amplifiedCount: 0
    };
    
    // Add to local state
    setAllPosts([newPostObj, ...allPosts]);
    
    // Add to global posts
    const globalPost = {
      id: newPostObj.id,
      userId: currentUser.id,
      text: newPost,
      createdAt: new Date(),
      agrees: 0,
      disagrees: 0,
      amplifiedBy: [],
      comments: [],
      isMarketplacePost: true
    };
    
    posts.unshift(globalPost);
    
    setNewPost('');
    toast.success('Post published to the community feed!');
  };

  const handleReport = (postId: string) => {
    toast.success('Post reported to moderators');
  };

  return (
    <Card className="bg-secondary/10 border-border/40 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-xl">
          <MessageSquare className="h-5 w-5 text-primary" />
          Community Discussion
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex gap-3 mb-3">
            <Avatar>
              <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
              <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea 
                placeholder="Share your prompt success story or ask the community..." 
                className="mb-2 resize-none"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
              />
              <div className="flex justify-end">
                <Button onClick={handlePostSubmit} size="sm">
                  <Send className="h-4 w-4 mr-2" />
                  Post
                </Button>
              </div>
            </div>
          </div>
          <Separator className="my-4" />
        </div>

        <div className="space-y-6">
          {allPosts.map((post) => (
            <div key={post.id} className="pb-4 border-b border-border/30 last:border-0 last:pb-0">
              <div className="flex gap-3">
                <Link to={`/profile/${post.user.id}`}>
                  <Avatar>
                    <AvatarImage src={post.user.avatar} alt={post.user.name} />
                    <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Link>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <Link to={`/profile/${post.user.id}`} className="font-medium hover:underline">
                        {post.user.name}
                      </Link>
                      <p className="text-xs text-muted-foreground">{post.timestamp}</p>
                    </div>
                    {post.promptId && (
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                        Marketplace Prompt
                      </Badge>
                    )}
                  </div>
                  
                  <p className="mt-2 text-sm">{post.content}</p>
                  
                  <div className="mt-3">
                    <PostEngagement
                      postId={post.id}
                      agrees={post.likes}
                      disagrees={0}
                      comments={post.comments || 0}
                      amplifiedBy={[]}
                      amplifiedCount={post.amplifiedCount || 0}
                      hasAgreed={likedPosts.includes(post.id)}
                      hasAmplified={amplifiedPosts.includes(post.id)}
                      onAgree={() => handleLike(post.id)}
                      onCommentClick={() => handleCommentToggle(post.id)}
                      onAmplify={(text) => handleAmplify(post.id, text)}
                      onReport={() => handleReport(post.id)}
                    />
                  </div>
                  
                  {showComments[post.id] && (
                    <div className="mt-3 pl-2 border-l-2 border-border/30">
                      <div className="flex gap-2 mt-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                          <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <Textarea 
                            placeholder="Write a comment..." 
                            className="min-h-[60px] text-sm resize-none"
                            value={commentInputs[post.id] || ''}
                            onChange={(e) => handleCommentChange(post.id, e.target.value)}
                          />
                          <div className="flex justify-end mt-1">
                            <Button 
                              size="sm" 
                              variant="secondary"
                              className="h-7 text-xs"
                              onClick={() => handleCommentSubmit(post.id)}
                              disabled={!commentInputs[post.id] || commentInputs[post.id].trim() === ''}
                            >
                              Comment
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Display existing comments if any */}
                      {posts.find(p => p.id === post.id)?.comments?.map((comment, i) => (
                        <div key={comment.id || i} className="flex gap-2 mt-3">
                          <Link to={`/profile/${comment.userId}`}>
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={comment.user?.avatar} alt={comment.user?.name} />
                              <AvatarFallback>{comment.user?.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                          </Link>
                          <div className="flex-1 bg-secondary/10 p-2 rounded-md">
                            <Link to={`/profile/${comment.userId}`} className="text-xs font-medium hover:underline">
                              {comment.user?.name}
                            </Link>
                            <p className="text-xs mt-1">{comment.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DiscussionFeed;
