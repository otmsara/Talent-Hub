
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

interface CustomAvatarProps {
  userId: string;
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  link?: boolean;
}

const CustomAvatar: React.FC<CustomAvatarProps> = ({
  userId,
  src,
  alt,
  size = 'md',
  className,
  link = true
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-14 h-14'
  };
  
  const avatarImage = (
    <img 
      src={src} 
      alt={alt} 
      className={cn(
        "avatar transition-all duration-200",
        sizeClasses[size],
        link && "hover:opacity-90",
        className
      )}
    />
  );
  
  if (link) {
    return (
      <Link to={`/profile/${userId}`}>
        {avatarImage}
      </Link>
    );
  }
  
  return avatarImage;
};

export default CustomAvatar;
