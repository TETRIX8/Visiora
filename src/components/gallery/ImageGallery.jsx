import React, { useState } from 'react';
import Masonry from 'react-masonry-css';
import { Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { Search, ImageIcon, Loader } from 'lucide-react';
import { useUserImages } from '../../hooks/useUserImages';
import ImageCard from './ImageCard';
import ImageModal from './ImageModal';
import ImageGallerySkeleton from './ImageGallerySkeleton';
import GlassCard from '../ui/GlassCard';
import '../tabs/masonry.css';

const ImageGallery = () => {
  const { images, loading, error, refreshAfterDelete } = useUserImages(100);
  const [selectedImage, setSelectedImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter images based on search query
  const filteredImages = images.filter(img => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const prompt = (img.prompt || '').toLowerCase();
    const model = (img.modelUsed || '').toLowerCase();
    
    return prompt.includes(query) || model.includes(query);
  });
  
  const handleImageClick = (image) => {
    setSelectedImage(image);
  };
  
  const handleCloseModal = () => {
    setSelectedImage(null);
  };
  
  // Masonry breakpoints - matching history section
  // Match history tab breakpoints for consistent image width
  const breakpointColumns = {
    default: 3,
    1280: 3,
    1024: 2,
    768: 2,
    640: 1
  };
  
  // Animation variants for staggered appearance
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="space-y-6">
      {/* Gallery Header */}
      <GlassCard className="border-slate-300 dark:border-white/10 p-5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-purple-500" />
            <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
              Your Gallery
            </h2>
          </div>
          
          {/* Search Bar */}
          <div className="relative w-full md:w-auto md:min-w-[300px]">
            <input
              type="text"
              placeholder="Search by prompt or model..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 pl-10 pr-4 rounded-full border border-slate-300/50 dark:border-white/10 bg-slate-100/50 dark:bg-white/5 text-slate-800 dark:text-white placeholder-slate-500 dark:placeholder-white/50 backdrop-blur-md transition-all duration-200 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 outline-none"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-white/50" />
          </div>
        </div>
      </GlassCard>
      
      {/* Loading State */}
      {loading && (
        <div>
          <div className="flex justify-center mb-4">
            <div className="text-slate-600 dark:text-slate-300 flex items-center gap-2">
              <span className="w-5 h-5 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
              Loading your gallery...
            </div>
          </div>
          <ImageGallerySkeleton count={12} />
        </div>
      )}
      
      {/* Error State */}
      {error && !loading && (
        <GlassCard className="p-8 text-center">
          <div className="text-red-500 mb-2 flex items-center justify-center">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">Failed to Load Images</h3>
          <p className="text-slate-600 dark:text-white/60 mb-4">{error}</p>
        </GlassCard>
      )}
      
      {/* Empty State */}
      {!loading && !error && images.length === 0 && (
        <GlassCard className="p-8 text-center max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mx-auto mb-4">
            <ImageIcon className="w-8 h-8 text-purple-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">
            Your Gallery is Empty
          </h3>
          <p className="text-slate-600 dark:text-white/60 leading-relaxed">
            Start generating AI images to build your personal collection. Your creations will appear here.
          </p>
        </GlassCard>
      )}
      
      {/* Empty Search Results */}
      {!loading && !error && images.length > 0 && filteredImages.length === 0 && (
        <GlassCard className="p-8 text-center max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-purple-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">
            No Matching Images
          </h3>
          <p className="text-slate-600 dark:text-white/60 leading-relaxed">
            No images match your search for "{searchQuery}". Try different keywords or clear the search.
          </p>
        </GlassCard>
      )}
      
      {/* Masonry Gallery */}
      {!loading && !error && filteredImages.length > 0 && (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="overflow-hidden"
        >
          <Masonry
            breakpointCols={breakpointColumns}
            className="masonry-grid"
            columnClassName="masonry-grid-column"
          >
            {filteredImages.map((image) => (
              <motion.div 
                key={image.imageId} 
                variants={itemVariants}
                className="masonry-item"
              >
                <div className="break-inside-avoid rounded-xl overflow-hidden relative group">
                  <div className="relative">
                    <img
                      src={image.imageURL}
                      alt={image.prompt || "AI Generated Image"}
                      className="w-full h-auto object-contain transition-transform duration-300 ease-in-out group-hover:scale-105"
                      onClick={() => handleImageClick(image)}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/400x400?text=Image+Unavailable";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-end p-3">
                      <div className="flex items-center gap-1">
                        <button
                          className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full flex items-center justify-center transition-all"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleImageClick(image);
                          }}
                          title="View details"
                        >
                          <Eye size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </Masonry>
        </motion.div>
      )}
      
      {/* Image Modal */}
      <ImageModal
        image={selectedImage}
        isOpen={!!selectedImage}
        onClose={handleCloseModal}
        onDelete={refreshAfterDelete}
      />
    </div>
  );
};

export default ImageGallery;
