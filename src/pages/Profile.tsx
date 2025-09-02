import React, { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import FeedItem from '../components/feed/FeedItem';
import ProjectItem from '../components/projects/ProjectItem';
import { findUserById, posts, users, User, Post } from '../data/dummyData';
import { useAccount } from '../contexts/AccountContext';
import { useNetwork } from '../contexts/NetworkContext';
import { getPromptsByCreator, Prompt } from '../data/dummyPrompts';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import PromptCard from '../components/marketplace/PromptCard';
import { Edit, Trash2, Users, Camera, Save, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import SubscriptionPlans from '../components/profile/SubscriptionPlans';
import Referrals from '../components/profile/Referrals';

const Profile = () => {
  const { userId } = useParams();
  const { currentUser } = useAccount();
  const [activeTab, setActiveTab] = useState<'posts' | 'projects' | 'subscription' | 'referrals'>('posts');
  const [displayCount, setDisplayCount] = useState(5);
  const [showNetworkDialog, setShowNetworkDialog] = useState<'followers' | 'following' | null>(null);
  const [promptToDelete, setPromptToDelete] = useState<Prompt | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedUsername, setEditedUsername] = useState('');
  const [editedBio, setEditedBio] = useState('');
  const [showUsernameError, setShowUsernameError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const profileUser: User = !userId || userId === currentUser.id ? currentUser : findUserById(userId, currentUser);
  const isCurrentUser = profileUser.id === currentUser.id;

  // Use global networking state
  const { networked, setNetworked } = useNetwork();

  // Reset activeTab if switching to a profile where 'subscription' is not valid
  React.useEffect(() => {
    if (!isCurrentUser && activeTab === 'subscription') {
      setActiveTab('posts');
    }
  }, [isCurrentUser, activeTab]);

  // For the "projects" tab, show all projects where the profile user is owner or collaborator
  const filteredPosts = posts.filter(post => {
    if (activeTab === 'posts') {
      return post.userId === profileUser.id && !post.isProject;
    }
    if (activeTab === 'projects') {
      if (!post.isProject) return false;
      const isOwner = post.userId === profileUser.id;
      const isCollaborator = Array.isArray(post.collaborators) && post.collaborators.includes(profileUser.id);
      return isOwner || isCollaborator;
    }
    return false;
  });

  // Get prompts created by this user
  const userPrompts = getPromptsByCreator(profileUser.id);

  // Determine what content to display based on active tab
  const displayItems = filteredPosts.slice(0, displayCount);

  const hasMore = displayCount < filteredPosts.length;

  const handleNetworkToggle = () => {
    if (profileUser.isFollowing) {
      toast.info(`Removed ${profileUser.name} from your network`);
    } else {
      setNetworked(profileUser.username, true);
      toast.success(`Added ${profileUser.name} to your network`);
    }
  };

  const handleTabChange = (tab: 'posts' | 'projects' | 'subscription' | 'referrals') => {
    setActiveTab(tab);
    setDisplayCount(5); // Reset display count when changing tabs
  };

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 5);
  };

  // Helper function to get networked users
  const getNetworkedUsers = (): User[] => {
    return users.filter(user => user.isFollowing || true);
  };

  // Helper function to get networking users (followers)
  const getNetworkingUsers = (): User[] => {
    // In a real app, this would be users who follow the profileUser
    return users.slice(0, 8); // Just use first 8 users as an example
  };

  // Handle prompt deletion
  const handleDeletePrompt = (prompt: Prompt) => {
    setPromptToDelete(prompt);
  };

  // Confirm prompt deletion
  const confirmDeletePrompt = () => {
    if (!promptToDelete) return;
    toast.success(`Prompt "${promptToDelete.title}" deleted`);
    setPromptToDelete(null);
    // In a real app, this would remove the prompt from the database
  };

  // Toggle profile edit mode
  const toggleEditMode = () => {
    if (isEditing) {
      setIsEditing(false);
    } else {
      setEditedName(profileUser.name);
      setEditedUsername(profileUser.username);
      setEditedBio(profileUser.bio);
      setIsEditing(true);
    }
  };

  // Check if username is taken
  const checkUsername = (username: string) => {
    if (username === profileUser.username) {
      setShowUsernameError(false);
      return false;
    }
    const isTaken = users.some(user =>
      user.id !== profileUser.id && user.username.toLowerCase() === username.toLowerCase()
    );
    setShowUsernameError(isTaken);
    return isTaken;
  };

  // Save profile changes
  const saveProfileChanges = () => {
    if (checkUsername(editedUsername)) {
      return;
    }
    if (!editedName.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    profileUser.name = editedName;
    profileUser.username = editedUsername;
    profileUser.bio = editedBio;
    setIsEditing(false);
    toast.success("Profile updated successfully");
  };

  // Trigger file input click
  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle profile picture change
  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        profileUser.avatar = reader.result;
        toast.success("Profile picture updated");
        setDisplayCount(displayCount);
      }
    };
    reader.readAsDataURL(file);
  };

  // Helper function to render marketplace items
  // (Removed: Marketplace tab and related logic)

  // Helper function to render post/project items
  const renderPostItems = () => {
    return filteredPosts.slice(0, displayCount).map((post: Post) => (
      post.isProject ? (
        <ProjectItem key={post.id} project={post} />
      ) : (
        <FeedItem key={post.id} post={post} />
      )
    ));
  };

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-4 overflow-x-hidden">
      {/* Profile header */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-sm border border-border/30 p-4 sm:p-6 mb-4 sm:mb-6 w-full max-w-full overflow-x-hidden">
        <div className="flex flex-col items-center sm:flex-row sm:items-start justify-between gap-4 w-full">
          {/* Avatar */}
          <div className="relative group flex-shrink-0 mb-2 sm:mb-0">
            {isEditing && (
              <div
                className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={triggerFileUpload}
              >
                <Camera className="w-6 h-6 text-white" />
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                />
              </div>
            )}
            <div className="relative w-20 h-20 mx-auto sm:mx-0">
              <img
                src={
                  profileUser.id === "agi_corp"
                    ? "https://static.vecteezy.com/system/resources/thumbnails/047/656/219/small_2x/abstract-logo-design-for-any-corporate-brand-business-company-vector.jpg"
                    : profileUser.avatar
                }
                alt={profileUser.name}
                className="avatar w-20 h-20 block"
                style={{ display: "block" }}
              />
            </div>
          </div>
          {/* Profile info */}
          <div className="flex-1 w-full flex flex-col items-center sm:items-start text-center sm:text-left">
            {isEditing ? (
              <div className="space-y-3 w-full max-w-xs sm:max-w-none">
                <div>
                  <Input
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="font-bold text-xl"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <div className="flex items-center space-x-1">
                    <span className="text-muted-foreground">@</span>
                    <Input
                      value={editedUsername}
                      onChange={(e) => {
                        setEditedUsername(e.target.value);
                        checkUsername(e.target.value);
                      }}
                      className=""
                      placeholder="username"
                    />
                  </div>
                  {showUsernameError && (
                    <p className="text-xs text-red-500 mt-1">
                      This username is already taken
                    </p>
                  )}
                </div>
                <div>
                  <Textarea
                    value={editedBio}
                    onChange={(e) => setEditedBio(e.target.value)}
                    className="min-h-[80px]"
                    placeholder="Write a short bio about yourself"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" onClick={saveProfileChanges} disabled={showUsernameError}>
                    <Save className="w-4 h-4 mr-1" />
                    Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={toggleEditMode}>
                    <X className="w-4 h-4 mr-1" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-center sm:justify-start space-x-2">
                  <h1 className="text-2xl font-bold text-foreground">{profileUser.name}</h1>
                  {isCurrentUser && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 rounded-full"
                      onClick={toggleEditMode}
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
                <p className="text-muted-foreground break-all">@{profileUser.username}</p>
                <p className="mt-2 text-foreground max-w-xs sm:max-w-lg">{profileUser.bio}</p>
              </>
            )}

            {!isEditing && (
              <div className="flex flex-wrap justify-center sm:justify-start items-center mt-3 gap-4 w-full">
                <button
                  onClick={() => setShowNetworkDialog('following')}
                  className="hover:text-primary transition-colors"
                >
                  <span className="font-semibold text-foreground">{profileUser.following}</span>
                  <span className="ml-1 text-muted-foreground">Networking</span>
                </button>
                <button
                  onClick={() => setShowNetworkDialog('followers')}
                  className="hover:text-primary transition-colors"
                >
                  <span className="font-semibold text-foreground">{profileUser.followers}</span>
                  <span className="ml-1 text-muted-foreground">Networked</span>
                </button>
              </div>
            )}
          </div>
          {/* Network button */}
          {!isCurrentUser && !isEditing && (
            <button
              onClick={handleNetworkToggle}
              className={`px-6 py-2 rounded-full font-semibold transition disabled:opacity-50
                bg-cyan-400/30 text-cyan-200 shadow-[0_0_8px_2px_rgba(34,211,238,0.5)] hover:bg-cyan-400/40
                ${
                  profileUser.isFollowing || networked[profileUser.username]
                    ? 'opacity-70 cursor-not-allowed'
                    : ''
                }
              `}
              style={{ textShadow: "0 0 6px #22d3ee" }}
              disabled={profileUser.isFollowing || networked[profileUser.username]}
            >
              {profileUser.isFollowing
                ? 'Networked'
                : networked[profileUser.username]
                  ? 'Networking'
                  : 'Network'}
            </button>
          )}
        </div>
        {/* Profile tabs */}
        <div className="flex flex-wrap justify-center sm:justify-start border-b border-border/30 mt-4 sm:mt-6 w-full">
          <button
            onClick={() => handleTabChange('posts')}
            className={`pb-3 px-4 text-sm font-medium relative ${
              activeTab === 'posts' ? 'text-white font-bold' : 'text-muted-foreground'
            }`}
            style={{ minWidth: 0, flex: '1 0 auto' }}
          >
            Posts
            {activeTab === 'posts' && (
              <div className="absolute bottom-0 left-0 right-0 h-px bg-[#22d3ee] shadow-[0_0_8px_2px_rgba(34,211,238,0.7)]" />
            )}
          </button>
          <button
            onClick={() => handleTabChange('projects')}
            className={`pb-3 px-4 text-sm font-medium relative ${
              activeTab === 'projects' ? 'text-white font-bold' : 'text-muted-foreground'
            }`}
            style={{ minWidth: 0, flex: '1 0 auto' }}
          >
            Projects
            {activeTab === 'projects' && (
              <div className="absolute bottom-0 left-0 right-0 h-px bg-[#22d3ee] shadow-[0_0_8px_2px_rgba(34,211,238,0.7)]" />
            )}
          </button>
          {/* Marketplace tab removed */}
          {isCurrentUser && (
            <>
              <button
                onClick={() => handleTabChange('subscription')}
                className={`pb-3 px-4 text-sm font-medium relative ${
                  activeTab === 'subscription' ? 'text-white font-bold' : 'text-muted-foreground'
                }`}
                style={{ minWidth: 0, flex: '1 0 auto' }}
              >
                Subscription
                {activeTab === 'subscription' && (
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-[#22d3ee] shadow-[0_0_8px_2px_rgba(34,211,238,0.7)]" />
                )}
              </button>
              <button
                onClick={() => handleTabChange('referrals')}
                className={`pb-3 px-4 text-sm font-medium relative ${
                  activeTab === 'referrals' ? 'text-white font-bold' : 'text-muted-foreground'
                }`}
                style={{ minWidth: 0, flex: '1 0 auto' }}
              >
                Referrals
                {activeTab === 'referrals' && (
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-[#22d3ee] shadow-[0_0_8px_2px_rgba(34,211,238,0.7)]" />
                )}
              </button>
            </>
          )}
        </div>
      </div>
      {/* Content feed (Posts/Projects/Marketplace) */}
      <div className="space-y-4">
        {activeTab === 'subscription' ? (
          <div className="py-6 sm:py-8">
            <SubscriptionPlans />
          </div>
        ) : activeTab === 'referrals' ? (
          <div className="py-6 sm:py-8">
            {isCurrentUser && <Referrals />}
          </div>
        ) : displayItems.length > 0 ? (
          renderPostItems()
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              {`No ${activeTab} to display`}
            </p>
          </div>
        )}

        {activeTab !== 'subscription' && hasMore && (
          <div className="flex justify-center my-4 sm:my-6">
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

      {/* Network dialog for followers/following */}
      <Dialog open={showNetworkDialog !== null} onOpenChange={() => setShowNetworkDialog(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              {showNetworkDialog === 'followers' ? 'Networked with ' : 'Networking with '}
              {profileUser.name}
            </DialogTitle>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Bio</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(showNetworkDialog === 'followers' ? getNetworkingUsers() : getNetworkedUsers()).map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="flex items-center space-x-3">
                      <img src={user.avatar} alt="" className="w-8 h-8 rounded-full" />
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">@{user.username}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm truncate max-w-[200px]">{user.bio}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.location.href = `/profile/${user.id}`}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>

      {/* Prompt delete confirmation dialog */}
      <Dialog open={promptToDelete !== null} onOpenChange={(open) => !open && setPromptToDelete(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Prompt</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{promptToDelete?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPromptToDelete(null)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDeletePrompt}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
