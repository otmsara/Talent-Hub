
import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { findUserById } from '../../data/dummyData';
import { Badge } from '../ui/badge';
import { Users } from 'lucide-react';

interface ProjectMetaProps {
  isProject: boolean;
  collaborators: string[];
  contributorsNeeded?: string[];
}

const ProjectMeta: React.FC<ProjectMetaProps> = ({ 
  isProject, 
  collaborators,
  contributorsNeeded = ['Open Contribution']
}) => {
  if (!isProject) return null;
  
  return (
    <div className="mb-3">
      
      {collaborators && collaborators.length > 0 && (
        <div className="mt-2 flex items-center">
          <span className="text-xs text-muted-foreground mr-2">Collaborators:</span>
          <div className="flex -space-x-2">
            {collaborators.map(userId => (
              <Link key={userId} to={`/profile/${userId}`}>
                <Avatar className="w-6 h-6 border-2 border-white">
                  <AvatarImage src={findUserById(userId).avatar} alt={findUserById(userId).name} />
                  <AvatarFallback>{findUserById(userId).name.charAt(0)}</AvatarFallback>
                </Avatar>
              </Link>
            ))}
          </div>
        </div>
      )}
      
      {contributorsNeeded && contributorsNeeded.length > 0 && (
        <div className="mt-2">
          <div className="flex items-center mb-1">
            <Users className="w-3 h-3 text-muted-foreground mr-1" />
            <span className="text-xs text-muted-foreground">Looking for:</span>
          </div>
          <div className="flex flex-wrap gap-1 mt-1">
            {contributorsNeeded.map(contributor => (
              <Badge key={contributor} variant="outline" className="text-xs py-0">
                {contributor}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectMeta;
