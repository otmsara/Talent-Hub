import React, { useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';

interface PostContentProps {
  text: string;
  images?: string[];
  video?: string;
  link?: string;
}

const PostContent: React.FC<PostContentProps> = ({ text, images, video, link }) => {
  const [showAllImages, setShowAllImages] = useState(false);
  const [thumbnail, setThumbnail] = useState<string | null>(null);

  const maxInitialImages = 1;
  const hasMultipleImages = images && images.length > 1;

  const displayImages = showAllImages || !hasMultipleImages
    ? images || []
    : images?.slice(0, maxInitialImages) || [];

  // Fetch og:image thumbnail for the link
  useEffect(() => {
    if (!link) {
      setThumbnail(null);
      return;
    }
    setThumbnail(null);
    // Try opengraph.io first, fallback to jsonlink.io
    fetch(`https://opengraph.io/api/1.1/site/${encodeURIComponent(link)}?app_id=demo`)
      .then(res => res.json())
      .then(data => {
        if (data && data.hybridGraph && data.hybridGraph.image) {
          setThumbnail(data.hybridGraph.image);
        } else {
          fetch(`https://jsonlink.io/api/extract?url=${encodeURIComponent(link)}`)
            .then(res2 => res2.json())
            .then(data2 => {
              if (data2.images && data2.images.length > 0) {
                setThumbnail(data2.images[0]);
              } else {
                setThumbnail(null);
              }
            })
            .catch(() => setThumbnail(null));
        }
      })
      .catch(() => {
        fetch(`https://jsonlink.io/api/extract?url=${encodeURIComponent(link)}`)
          .then(res2 => res2.json())
          .then(data2 => {
            if (data2.images && data2.images.length > 0) {
              setThumbnail(data2.images[0]);
            } else {
              setThumbnail(null);
            }
          })
          .catch(() => setThumbnail(null));
      });
  }, [link]);

  return (
    <div className="mb-4">
      <p className="mb-3 text-foreground whitespace-pre-line">{text}</p>

      {displayImages.length > 0 && (
        <div className="mt-3 mb-3 space-y-2">
          {displayImages.map((image, idx) => (
            <img
              key={idx}
              src={image}
              alt={`Post image ${idx + 1}`}
              className="rounded-lg w-full object-cover max-h-96 transition-all duration-300 hover:shadow-md"
            />
          ))}

          {hasMultipleImages && !showAllImages && (
            <button
              onClick={() => setShowAllImages(true)}
              className="w-full py-2 text-sm text-primary hover:bg-primary/5 rounded-lg transition-colors"
            >
              Show {images!.length - maxInitialImages} more {images!.length - maxInitialImages === 1 ? 'image' : 'images'}
            </button>
          )}
        </div>
      )}

      {video && (
        <div className="mt-3 rounded-lg overflow-hidden bg-black/5 h-64 flex items-center justify-center">
          <div className="text-muted-foreground">
            <span className="block text-sm">Video Preview</span>
            <span className="text-xs">(Video functionality coming soon)</span>
          </div>
        </div>
      )}

      {link && (
        <div className="mt-3">
          {thumbnail && (
            <a href={link} target="_blank" rel="noopener noreferrer">
              <img
                src={thumbnail}
                alt="Link thumbnail"
                className="rounded-lg w-full object-cover max-h-60 mb-2 border border-border"
                style={{ background: "#eee" }}
              />
            </a>
          )}
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 border border-border rounded-lg hover:bg-secondary/20 transition-colors"
          >
            <div className="flex items-center text-primary">
              <ExternalLink className="w-4 h-4 mr-2" />
              <span className="text-sm truncate">{link}</span>
            </div>
          </a>
        </div>
      )}
    </div>
  );
};

export default PostContent;
