
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, FileText, Code, Image as ImageIcon, Video as VideoIcon, FileUp } from 'lucide-react';
import { Post, findUserById, formatRelativeTime, Contribution } from '../../data/dummyData';
import FeedItem from '../feed/FeedItem';
import { toast } from 'sonner';

interface ProjectItemProps {
  project: Post;
  disableCardClick?: boolean;
}

const ProjectItem: React.FC<ProjectItemProps> = ({ project, disableCardClick }) => {
  // If there are no contributions, render as a normal FeedItem
  if (!project.contributions || project.contributions.length === 0) {
    return <FeedItem post={project} disableCardClick={disableCardClick} />;
  }
  
  const [contributionsExpanded, setContributionsExpanded] = useState(false);
  const [showContributeForm, setShowContributeForm] = useState(false);
  const [contributionType, setContributionType] = useState<Contribution['type']>('text');
  const [contributionContent, setContributionContent] = useState('');
  
  const toggleContributions = () => {
    setContributionsExpanded(!contributionsExpanded);
  };
  
  const toggleContributeForm = () => {
    setShowContributeForm(!showContributeForm);
  };
  
  const handleSubmitContribution = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contributionContent.trim()) {
      toast.error("Contribution content is required");
      return;
    }
    
    // Simulate adding a contribution
    toast.success("Contribution submitted successfully!");
    setShowContributeForm(false);
    setContributionContent('');
  };
  
  return (
    <div className="post-card">
      {/* Render the base post as a normal FeedItem */}
      <FeedItem post={project} disableCardClick={disableCardClick} />
      
      {/* Contributions section */}
      <div className="mt-6 pt-4 pb-6 border-t border-border">
        <div 
          className="flex items-center justify-between cursor-pointer" 
          onClick={toggleContributions}
        >
          <div className="flex items-center">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/30 text-accent-foreground mr-2">
              <span className="mr-1">✦</span> Contributions
            </span>
            <span className="text-sm text-muted-foreground">
              {project.contributions.length} {project.contributions.length === 1 ? 'contribution' : 'contributions'}
            </span>
          </div>
          {contributionsExpanded ? 
            <ChevronUp className="w-4 h-4 text-muted-foreground" /> : 
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          }
        </div>
        
        {contributionsExpanded && (
          <div className="mt-4 space-y-4">
            {project.contributions.map((contribution) => {
              const user = findUserById(contribution.userId);
              
              let contentPreview;
              let icon;
              
              switch (contribution.type) {
                case 'pdf':
                  icon = <FileText className="w-4 h-4 text-red-500" />;
                  contentPreview = (
                    <a 
                      href={contribution.content} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center"
                    >
                      {icon}
                      <span className="ml-1">View PDF document</span>
                    </a>
                  );
                  break;
                case 'code':
                  icon = <Code className="w-4 h-4 text-green-500" />;
                  contentPreview = (
                    <a 
                      href={contribution.content} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center"
                    >
                      {icon}
                      <span className="ml-1">View code repository</span>
                    </a>
                  );
                  break;
                case 'image':
                  icon = <ImageIcon className="w-4 h-4 text-blue-500" />;
                  contentPreview = (
                    <div className="mt-2">
                      <img 
                        src={contribution.content} 
                        alt="Contribution" 
                        className="rounded-lg max-h-40 object-cover"
                      />
                    </div>
                  );
                  break;
                case 'video':
                  icon = <VideoIcon className="w-4 h-4 text-purple-500" />;
                  contentPreview = (
                    <div className="mt-2 bg-black/5 h-32 rounded-lg flex items-center justify-center">
                      <span className="text-sm text-muted-foreground">Video preview</span>
                    </div>
                  );
                  break;
                case 'text':
                default:
                  icon = <FileText className="w-4 h-4 text-gray-500" />;
                  contentPreview = (
                    <div className="mt-2 p-3 bg-secondary/30 rounded-lg text-sm">
                      {contribution.content}
                    </div>
                  );
              }
              
              return (
                <div key={contribution.id} className="p-3 bg-background border border-border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Link to={`/profile/${user.id}`}>
                        <img src={user.avatar} alt={user.name} className="avatar w-6 h-6" />
                      </Link>
                      <div className="ml-2">
                        <Link to={`/profile/${user.id}`} className="text-sm font-medium hover:underline">
                          {user.name}
                        </Link>
                        <div className="text-xs text-muted-foreground">
                          {formatRelativeTime(contribution.createdAt)}
                        </div>
                      </div>
                    </div>
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-muted-foreground">
                      {contribution.type}
                    </span>
                  </div>
                  <div className="mt-2">
                    {contentPreview}
                  </div>
                </div>
              );
            })}
            
            {!showContributeForm ? (
              <button 
                onClick={toggleContributeForm}
                className="w-full py-2 mt-2 button-secondary flex items-center justify-center"
              >
                <FileUp className="w-4 h-4 mr-2" />
                <span>Add Contribution</span>
              </button>
            ) : (
              <form onSubmit={handleSubmitContribution} className="p-3 bg-background border border-border rounded-lg">
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">Contribution Type</label>
                  <select 
                    value={contributionType}
                    onChange={(e) => setContributionType(e.target.value as Contribution['type'])}
                    className="w-full p-2 rounded-lg bg-secondary/30 text-foreground border-none focus:ring-1 focus:ring-primary/20 focus:outline-none"
                  >
                    <option value="text">Text</option>
                    <option value="image">Image</option>
                    <option value="code">Code</option>
                    <option value="pdf">PDF</option>
                    <option value="video">Video</option>
                  </select>
                </div>
                
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">Content</label>
                  {contributionType === 'text' ? (
                    <textarea 
                      value={contributionContent}
                      onChange={(e) => setContributionContent(e.target.value)}
                      className="w-full p-2 rounded-lg bg-secondary/30 text-foreground resize-none border-none focus:ring-1 focus:ring-primary/20 focus:outline-none min-h-[100px]"
                      placeholder="Enter your contribution text..."
                    />
                  ) : (
                    <input 
                      type="text"
                      value={contributionContent}
                      onChange={(e) => setContributionContent(e.target.value)}
                      className="w-full p-2 rounded-lg bg-secondary/30 text-foreground border-none focus:ring-1 focus:ring-primary/20 focus:outline-none"
                      placeholder={
                        contributionType === 'image' ? "Enter image URL..." :
                        contributionType === 'code' ? "Enter repository URL..." :
                        contributionType === 'pdf' ? "Enter PDF URL..." :
                        "Enter URL..."
                      }
                    />
                  )}
                </div>
                
                <div className="flex justify-end space-x-2">
                  <button 
                    type="button" 
                    onClick={toggleContributeForm}
                    className="px-3 py-1 text-sm text-muted-foreground hover:text-foreground"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="button-primary"
                  >
                    Submit
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectItem;
