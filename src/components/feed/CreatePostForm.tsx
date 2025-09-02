
import React, { useState, ChangeEvent, useRef } from 'react';
import { Image, Link, Video, X, Loader2, Play, Users } from 'lucide-react';
import { toast } from 'sonner';
import { useAccount } from '../../contexts/AccountContext';
import { nanoid } from 'nanoid';
import { Badge } from '../ui/badge';

interface CreatePostFormProps {
  isProject?: boolean;
  onPostCreated?: () => void;
}

const CreatePostForm: React.FC<CreatePostFormProps> = ({ 
  isProject = false,
  onPostCreated
}) => {
  const { currentUser } = useAccount();
  const [projectName, setProjectName] = useState('');
  const [text, setText] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [link, setLink] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [showVideoInput, setShowVideoInput] = useState(false);
  const [showContributorInput, setShowContributorInput] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [contributorInput, setContributorInput] = useState('');
  const [contributorsNeeded, setContributorsNeeded] = useState<string[]>(['Open Contribution']);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  
  const isButtonDisabled =
    (isProject
      ? projectName.trim() === '' || text.trim() === ''
      : text.trim() === '') &&
    images.length === 0 &&
    videos.length === 0;
  
  const handleProjectNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setProjectName(e.target.value);
  };

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };
  
  const handleAddImage = () => {
    // In a real app, this would open a file picker
    // For demo purposes, we'll add a random image
    const randomId = Math.floor(Math.random() * 1000);
    const newImage = `https://picsum.photos/seed/${randomId}/600/400`;
    setImages([...images, newImage]);
    toast.success("Image added");
  };
  
  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };
  
  const handleToggleLinkInput = () => {
    setShowLinkInput(!showLinkInput);
  };
  
  const handleLinkChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLink(e.target.value);
  };
  
  const handleToggleVideoInput = () => {
    setShowVideoInput(!showVideoInput);
  };
  
  const handleVideoUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    setVideoUrl(e.target.value);
  };
  
  const handleToggleContributorInput = () => {
    setShowContributorInput(!showContributorInput);
  };
  
  const handleContributorInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setContributorInput(e.target.value);
  };
  
  const handleAddContributor = () => {
    if (!contributorInput.trim()) {
      toast.error("Please enter a contributor type");
      return;
    }
    
    // Remove the default "Open Contribution" if it's there and we're adding specific roles
    const updatedContributors = [...contributorsNeeded];
    if (updatedContributors.length === 1 && updatedContributors[0] === 'Open Contribution') {
      updatedContributors.pop();
    }
    
    // Add the new contributor type if it doesn't already exist
    if (!updatedContributors.includes(contributorInput.trim())) {
      updatedContributors.push(contributorInput.trim());
      setContributorsNeeded(updatedContributors);
      setContributorInput('');
      toast.success(`Added ${contributorInput.trim()} to needed contributors`);
    } else {
      toast.info("This contributor type is already added");
    }
  };
  
  const handleRemoveContributor = (contributor: string) => {
    const updatedContributors = contributorsNeeded.filter(c => c !== contributor);
    
    // If we're removing the last specific contributor, add back the default
    if (updatedContributors.length === 0) {
      updatedContributors.push('Open Contribution');
    }
    
    setContributorsNeeded(updatedContributors);
  };
  
  const handleResetToOpenContribution = () => {
    setContributorsNeeded(['Open Contribution']);
    toast.success("Reset to open contribution");
  };
  
  const handleAddVideo = () => {
    if (!videoUrl) {
      toast.error("Please enter a video URL");
      return;
    }
    
    // Simple validation to check if it's a video URL
    const isValidVideoUrl = videoUrl.match(/\.(mp4|webm|ogg)$/i) || 
                            videoUrl.includes('youtube.com') || 
                            videoUrl.includes('youtu.be') || 
                            videoUrl.includes('vimeo.com');
    
    if (!isValidVideoUrl) {
      toast.error("Please enter a valid video URL (MP4, YouTube, Vimeo)");
      return;
    }
    
    // For demo purposes, we'll use a sample video URL if it's not a direct video file
    const processedUrl = videoUrl.match(/\.(mp4|webm|ogg)$/i) 
      ? videoUrl 
      : 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
    
    setVideos([...videos, processedUrl]);
    setVideoUrl('');
    toast.success("Video added");
  };
  
  const handleRemoveVideo = (index: number) => {
    const newVideos = [...videos];
    newVideos.splice(index, 1);
    setVideos(newVideos);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isButtonDisabled) return;
    
    setIsSubmitting(true);
    
    // Create a new post and add it to the posts array
    const newPost = {
      id: `p${nanoid(6)}`,
      userId: currentUser.id,
      name: isProject ? projectName.trim() : undefined,
      text: text,
      images: images.length > 0 ? [...images] : undefined,
      videos: videos.length > 0 ? [...videos] : undefined,
      link: link || undefined,
      createdAt: new Date(),
      agrees: 0,
      disagrees: 0,
      amplifiedBy: [],
      comments: [],
      isProject: isProject,
      collaborators: isProject ? [currentUser.id] : undefined,
      contributorsNeeded: isProject ? [...contributorsNeeded] : undefined
    };
    
    // Add the new post to the global posts array
    import('../../data/dummyData').then(({ posts }) => {
      posts.unshift(newPost);
      
      setTimeout(() => {
        toast.success(isProject ? "Project created" : "Post created");
        setProjectName('');
        setText('');
        setImages([]);
        setVideos([]);
        setLink('');
        setShowLinkInput(false);
        setShowVideoInput(false);
        setShowContributorInput(false);
        setContributorsNeeded(['Open Contribution']);
        setIsSubmitting(false);
        
        if (onPostCreated) {
          onPostCreated();
        }
      }, 500);
    });
  };

  return (
    <div className="post-card">
      <form onSubmit={handleSubmit}>
        <div className="flex items-start mb-4">
          <img src={currentUser.avatar} alt={currentUser.name} className="avatar w-10 h-10" />
          <div className="ml-3 flex-1">
            <textarea
              className="w-full p-2 rounded-xl bg-secondary/30 text-foreground resize-none border-none focus:ring-1 focus:ring-primary/20 focus:outline-none transition-all min-h-[80px]"
              placeholder={isProject ? "What project are you working on?" : "What's happening?"}
              value={text}
              onChange={handleTextChange}
              disabled={isSubmitting}
            />
            
            {/* Project Name input for projects */}
            {isProject && (
              <div className="mt-3">
                <label className="block text-sm font-medium mb-1 text-foreground" htmlFor="project-name">
                  Project Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="project-name"
                  type="text"
                  className="w-full p-2 rounded-xl bg-secondary/30 text-foreground border-none focus:ring-1 focus:ring-primary/20 focus:outline-none transition-all text-base mb-3"
                  placeholder="Enter project name"
                  value={projectName}
                  onChange={handleProjectNameChange}
                  disabled={isSubmitting}
                  required
                />
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium">Contributors Needed</h3>
                  {contributorsNeeded.length > 0 && contributorsNeeded[0] !== 'Open Contribution' && null}
                </div>
                
                <div className="flex flex-wrap gap-2 mb-2">
                  {contributorsNeeded.map((contributor) => (
                    <Badge 
                      key={contributor}
                      variant="secondary"
                      className="flex items-center gap-1 px-2 py-1"
                    >
                      {contributor}
                      <button
                        type="button"
                        onClick={() => handleRemoveContributor(contributor)}
                        className="ml-1 hover:text-destructive focus:outline-none"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                
                {showContributorInput ? (
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="e.g., Frontend Developer"
                      className="flex-grow p-2 rounded-xl bg-secondary/30 text-foreground border-none focus:ring-1 focus:ring-primary/20 focus:outline-none transition-all text-sm"
                      value={contributorInput}
                      onChange={handleContributorInputChange}
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      onClick={handleAddContributor}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-colors"
                      disabled={isSubmitting}
                    >
                      Add
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleToggleContributorInput}
                    className="text-sm text-primary hover:underline flex items-center"
                  >
                    <Users className="w-4 h-4 mr-1" />
                    Add specific contributor type
                  </button>
                )}
              </div>
            )}
            
            {/* Image previews */}
            {images.length > 0 && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                {images.map((image, index) => (
                  <div key={index} className="relative rounded-lg overflow-hidden group">
                    <img 
                      src={image} 
                      alt={`Upload ${index + 1}`} 
                      className="w-full h-32 object-cover" 
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {/* Video previews */}
            {videos.length > 0 && (
              <div className="mt-3 grid grid-cols-1 gap-2">
                {videos.map((video, index) => (
                  <div key={index} className="relative rounded-lg overflow-hidden group bg-black/10">
                    <video 
                      ref={videoPreviewRef}
                      src={video}
                      className="w-full h-48 object-contain"
                      controls
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveVideo(index)}
                      className="absolute top-1 right-1 bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {/* Video input */}
            {showVideoInput && (
              <div className="mt-3 space-y-2">
                <div className="flex space-x-2">
                  <input
                    type="url"
                    placeholder="Enter video URL (MP4, YouTube, Vimeo)"
                    className="flex-grow p-2 rounded-xl bg-secondary/30 text-foreground border-none focus:ring-1 focus:ring-primary/20 focus:outline-none transition-all text-sm"
                    value={videoUrl}
                    onChange={handleVideoUrlChange}
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={handleAddVideo}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-colors"
                    disabled={isSubmitting}
                  >
                    Add
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  For demo purposes, a sample video will be used regardless of the URL entered.
                </p>
              </div>
            )}
            
            {/* Link input */}
            {showLinkInput && (
              <div className="mt-3">
                <input
                  type="url"
                  placeholder="Enter URL"
                  className="w-full p-2 rounded-xl bg-secondary/30 text-foreground border-none focus:ring-1 focus:ring-primary/20 focus:outline-none transition-all"
                  value={link}
                  onChange={handleLinkChange}
                  disabled={isSubmitting}
                />
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex space-x-1">
            <button
              type="button"
              onClick={handleAddImage}
              className="icon-button text-muted-foreground"
              disabled={isSubmitting}
            >
              <Image className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleToggleVideoInput}
              className={`icon-button ${showVideoInput ? 'text-primary' : 'text-muted-foreground'}`}
              disabled={isSubmitting}
            >
              <Video className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleToggleLinkInput}
              className={`icon-button ${showLinkInput ? 'text-primary' : 'text-muted-foreground'}`}
              disabled={isSubmitting}
            >
              <Link className="w-5 h-5" />
            </button>
          </div>
          
          <button
            type="submit"
            className={`px-6 py-2 rounded-full font-semibold transition disabled:opacity-50
              bg-cyan-400/30 text-cyan-200 shadow-[0_0_8px_2px_rgba(34,211,238,0.5)] hover:bg-cyan-400/40`}
            style={{ textShadow: "0 0 6px #22d3ee" }}
            disabled={isButtonDisabled || isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {isProject ? 'Creating...' : 'Posting...'}
              </span>
            ) : (
              isProject ? 'Create Project' : 'Post'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePostForm;
