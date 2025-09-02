import React, { useState } from 'react';
import { MessageSquare, ThumbsUp, ThumbsDown, Share2, Flag } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';
import { currentUser } from '../../data/dummyData';

interface PostEngagementProps {
  postId?: string;
  agrees: number;
  disagrees: number;
  comments: number;
  amplifiedBy: string[];
  amplifiedCount?: number;
  commentsCount?: number;
  isProject?: boolean;
  hasCommented?: boolean;
  hasAgreed?: boolean;
  hasDisagreed?: boolean;
  hasAmplified?: boolean;
  onAgree?: (agree: boolean) => void;
  onDisagree?: (disagree: boolean) => void;
  onCommentClick?: () => void;
  onAmplify?: (text?: string) => void;
  onReport?: () => void;
  collaborators?: string[];
  onCollaborateToggle?: (collaborating: boolean) => void;
}

const PostEngagement: React.FC<PostEngagementProps> = ({
  postId,
  agrees = 0,
  disagrees = 0,
  comments = 0,
  amplifiedBy = [],
  amplifiedCount,
  commentsCount,
  isProject = false,
  hasCommented = false,
  hasAgreed = false,
  hasDisagreed = false,
  hasAmplified = false,
  onAgree,
  onDisagree,
  onCommentClick,
  onAmplify,
  onReport,
  collaborators = [],
  onCollaborateToggle
}) => {
  const [isAmplifyDialogOpen, setIsAmplifyDialogOpen] = useState(false);
  const [amplifyText, setAmplifyText] = useState('');
  const [localAgreed, setLocalAgreed] = useState(hasAgreed || false);
  const [localDisagreed, setLocalDisagreed] = useState(hasDisagreed || false);
  const [localAgrees, setLocalAgrees] = useState(agrees);
  const [localDisagrees, setLocalDisagrees] = useState(disagrees);

  const handleAgree = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!localAgreed) {
      setLocalAgreed(true);
      setLocalDisagreed(false);
      setLocalAgrees(localAgrees + 1);
      if (localDisagreed) setLocalDisagrees(localDisagrees - 1);
      if (onAgree) onAgree(true);
      if (onDisagree) onDisagree(false);
    } else {
      setLocalAgreed(false);
      setLocalAgrees(localAgrees - 1);
      if (onAgree) onAgree(false);
    }
  };

  const handleDisagree = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!localDisagreed) {
      setLocalDisagreed(true);
      setLocalAgreed(false);
      setLocalDisagrees(localDisagrees + 1);
      if (localAgreed) setLocalAgrees(localAgrees - 1);
      if (onDisagree) onDisagree(true);
      if (onAgree) onAgree(false);
    } else {
      setLocalDisagreed(false);
      setLocalDisagrees(localDisagrees - 1);
      if (onDisagree) onDisagree(false);
    }
  };

  const handleAmplify = () => {
    if (!onAmplify) {
      toast.info("Amplify function not available");
      return;
    }
    setIsAmplifyDialogOpen(true);
  };

  const handleSimpleAmplify = () => {
    if (onAmplify) {
      onAmplify();
      setIsAmplifyDialogOpen(false);
      toast.success("Post amplified successfully!");
    }
  };

  const handleAmplifyWithComment = () => {
    if (onAmplify) {
      onAmplify(amplifyText);
      setAmplifyText('');
      setIsAmplifyDialogOpen(false);
      toast.success("Post amplified with your comment!");
    }
  };

  const handleReport = () => {
    if (onReport) {
      onReport();
    } else {
      toast.info("Content reported to moderators");
    }
  };

  const handleCollaborate = () => {
    if (onCollaborateToggle) {
      const isCurrentlyCollaborating = Array.isArray(collaborators) && collaborators.includes(currentUser.id);
      onCollaborateToggle(!isCurrentlyCollaborating);
    }
  };

  const displayCommentCount = commentsCount !== undefined ? commentsCount : comments;
  const displayAmplifyCount = amplifiedCount !== undefined 
    ? amplifiedCount 
    : (Array.isArray(amplifiedBy) ? amplifiedBy.length : 0);
  const userHasAmplified = hasAmplified || (Array.isArray(amplifiedBy) && amplifiedBy.includes(currentUser.id));
  const isCollaborating = Array.isArray(collaborators) && collaborators.includes(currentUser.id);

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <button
            onClick={e => {
              e.stopPropagation();
              if (onCommentClick) onCommentClick();
            }}
            className={`flex items-center text-sm space-x-1.5 ${
              hasCommented ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <MessageSquare className="w-[18px] h-[18px]" />
            <span>{displayCommentCount}</span>
          </button>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleAgree}
              className={`flex items-center text-sm space-x-1.5 px-2 py-1 rounded-md transition
                ${localAgreed
                  ? 'text-[#3BCDDA] bg-[#3BCDDA]/20 shadow-[0_0_8px_2px_rgba(59,205,218,0.3)]'
                  : 'text-muted-foreground hover:text-[#3BCDDA] hover:bg-[#3BCDDA]/10'
                }`}
              aria-pressed={localAgreed}
              type="button"
              style={localAgreed ? { boxShadow: '0 0 8px 2px rgba(59,205,218,0.3)' } : {}}
            >
              <ThumbsUp className={`w-[18px] h-[18px] ${localAgreed ? 'fill-[#3BCDDA]' : ''}`} />
              <span>{localAgrees}</span>
            </button>
            <button
              onClick={handleDisagree}
              className={`flex items-center text-sm space-x-1.5 px-2 py-1 rounded-md transition
                ${localDisagreed
                  ? 'text-[#b388ff] bg-[#b388ff]/20 shadow-[0_0_8px_2px_rgba(179,136,255,0.3)]'
                  : 'text-muted-foreground hover:text-[#b388ff] hover:bg-[#b388ff]/10'
                }`}
              aria-pressed={localDisagreed}
              type="button"
              style={localDisagreed ? { boxShadow: '0 0 8px 2px rgba(179,136,255,0.3)' } : {}}
            >
              <ThumbsDown className={`w-[18px] h-[18px] ${localDisagreed ? 'fill-[#b388ff]' : ''}`} />
              <span>{localDisagrees}</span>
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          {isProject && onCollaborateToggle && (
            <button
              onClick={handleCollaborate}
              className={`text-sm px-2 py-1 mr-2 rounded-md ${
                isCollaborating 
                  ? 'bg-primary/20 text-primary' 
                  : 'bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              {isCollaborating ? 'Collaborating' : 'Collaborate'}
            </button>
          )}
          <button
            onClick={handleAmplify}
            className={`flex items-center text-sm space-x-1.5 ${
              userHasAmplified ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Share2 className="w-[18px] h-[18px]" />
            <span>{displayAmplifyCount > 0 ? displayAmplifyCount : ''}</span>
          </button>
          <button
            onClick={handleReport}
            className="p-1.5 text-muted-foreground hover:text-foreground"
          >
            <Flag className="w-[16px] h-[16px]" />
          </button>
        </div>
      </div>
      <Dialog open={isAmplifyDialogOpen} onOpenChange={setIsAmplifyDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Amplify this post</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Add your thoughts (optional)"
              value={amplifyText}
              onChange={(e) => setAmplifyText(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>
          <DialogFooter className="flex-col space-y-2 sm:space-y-0 sm:flex-row sm:justify-between">
            <Button variant="outline" onClick={handleSimpleAmplify}>
              Just Amplify
            </Button>
            <Button onClick={handleAmplifyWithComment}>
              Amplify with Comment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PostEngagement;
