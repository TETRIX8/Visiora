import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { Eye } from 'lucide-react';
import { cn } from '../../utils/cn';

const ImageCard = ({ image, onImageClick, className }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div 
      className={cn(
        "break-inside-avoid mb-4 rounded-xl overflow-hidden relative group",
        className
      )}
    >
      <div className="relative">
        <LazyLoadImage
          src={image.imageURL}
          alt={image.prompt || "AI Generated Image"}
          effect="blur"
          threshold={200}
          className={cn(
            "w-full h-auto object-contain transition-transform duration-300 ease-in-out group-hover:scale-105"
          )}
          afterLoad={handleImageLoad}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://via.placeholder.com/400x400?text=Image+Unavailable";
          }}
        />
        {/* Loading skeleton */}
        {!isLoaded && (
          <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 animate-pulse" />
        )}
        {/* Eye icon overlay on hover, matching history tab */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-end p-3">
          <div className="flex items-center gap-1">
            <button
              className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full flex items-center justify-center transition-all"
              onClick={() => onImageClick(image)}
              title="View details"
            >
              <Eye size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCard;
