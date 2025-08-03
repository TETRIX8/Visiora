// src/components/tabs/ModernHistoryTab.jsx
import React, { useState, useEffect, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  History, 
  Download, 
  Trash2, 
  Copy, 
  Eye, 
  X,
  Calendar,
  Settings,
  AlertTriangle,
  Cloud
} from "lucide-react";
import { getUserGeneratedImages } from "../../api/imageService";
import { useAuthContext } from "../../contexts/AuthContext";
import GlassCard from "../ui/GlassCard";
import CustomButton from "../ui/CustomButton";
import ExamplePromptsGrid from "../examples/ExamplePromptsGrid";

import { cn } from "../../utils/cn";

const ModernHistoryTab = memo(({
  history,
  setInputPrompt,
  setActiveTab,
  handleDeleteHistoryItem,
  handleClearAllHistory,
}) => {
  const { user } = useAuthContext();
  const [selectedImage, setSelectedImage] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [cloudImages, setCloudImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeHistoryTab, setActiveHistoryTab] = useState('local');

  // Fetch cloud images when the component mounts or when user changes
  useEffect(() => {
    if (user && activeHistoryTab === 'cloud') {
      fetchCloudImages();
    }
  }, [user, activeHistoryTab]);

  const fetchCloudImages = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const images = await getUserGeneratedImages(user.uid);
      setCloudImages(images);
    } catch (error) {
      console.error('Error fetching cloud images:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageClick = (item) => {
    setSelectedImage(item);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const handleUsePrompt = (prompt) => {
    setInputPrompt(prompt);
    setActiveTab("generate");
  };

  const handleDownload = (imageUrl, prompt) => {
    if (imageUrl) {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `visiora-${prompt.slice(0, 30).replace(/[^a-z0-9]/gi, '_').toLowerCase()}-${Date.now()}.jpg`;
      link.click();
    }
  };

  // Format date from Firebase Timestamp or string
  const formatDate = (date) => {
    if (!date) return '';
    
    // If date is a string (from localStorage)
    if (typeof date === 'string') {
      try {
        return date;
      } catch {
        return date;
      }
    }
    
    // If date is a Date object (from Firestore)
    try {
      return date instanceof Date
        ? date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        : new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
    } catch {
      return "Unknown date";
    }
  };

  // Handle deleting a cloud image
  const handleDeleteCloudImage = async (image) => {
    if (!user) return;
    
    try {
      // Import the delete function dynamically to prevent circular dependencies
      const { deleteGeneratedImage } = await import('../../api/imageService');
      
      // Call the delete function with the required IDs using the flattened structure
      await deleteGeneratedImage(
        user.uid, 
        image.imageId
      );
      
      // Remove the deleted image from state
      setCloudImages(prev => prev.filter(img => img.imageId !== image.imageId));
      
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting cloud image:', error);
    }
  };

  // Get the right list of images based on activeHistoryTab
  const displayImages = activeHistoryTab === 'local' ? history : cloudImages;
  
  // Map cloud image to the format expected by the UI
  const processedImages = activeHistoryTab === 'cloud'
    ? cloudImages.map(img => ({
        id: img.imageId || img.id,
        imageId: img.imageId,
        prompt: img.prompt,
        imageUrl: img.imageURL, // Note: cloud images use imageURL (uppercase URL)
        timestamp: formatDate(img.createdAt),
        model: img.modelUsed,
        dimensions: `${img.width || 0}x${img.height || 0}`,
        path: img.path,
        isCloud: true
      }))
    : history;

  return (
    <div className="space-y-8">
      {/* Tab Header */}
      <GlassCard className="border-slate-300 dark:border-white/10 p-5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-purple-500" />
            <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
              Image History
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Toggle between local and cloud history */}
            {user && (
              <div className="bg-slate-100 dark:bg-slate-800 rounded-full p-1 flex">
                <button
                  className={cn(
                    "px-4 py-1 rounded-full text-sm font-medium transition-all",
                    activeHistoryTab === 'local'
                      ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white"
                  )}
                  onClick={() => setActiveHistoryTab('local')}
                >
                  Local
                </button>
                <button
                  className={cn(
                    "px-4 py-1 rounded-full text-sm font-medium transition-all flex items-center gap-1",
                    activeHistoryTab === 'cloud'
                      ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white"
                  )}
                  onClick={() => setActiveHistoryTab('cloud')}
                >
                  <Cloud size={14} />
                  Cloud
                </button>
              </div>
            )}

            {/* Clear all button */}
            {(activeHistoryTab === 'local' && history.length > 0) && (
              <CustomButton
                variant="destructive"
                size="sm"
                onClick={() => setShowDeleteConfirm('all')}
                icon={Trash2}
              >
                Clear All
              </CustomButton>
            )}
          </div>
        </div>
      </GlassCard>

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center my-12">
          <div className="space-y-4 text-center">
            <div className="w-10 h-10 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto" />
            <p className="text-slate-600 dark:text-slate-300">Loading your images...</p>
          </div>
        </div>
      )}

      {/* No history state */}
      {!isLoading && processedImages.length === 0 && (
        <div className="flex items-center justify-center min-h-[400px]">
          <GlassCard className="text-center max-w-md mx-auto">
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mx-auto">
                {activeHistoryTab === 'cloud' ? (
                  <Cloud className="w-8 h-8 text-purple-400" />
                ) : (
                  <History className="w-8 h-8 text-purple-400" />
                )}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">
                  {activeHistoryTab === 'cloud' 
                    ? "No Cloud Images" 
                    : "No History Yet"}
                </h3>
                <p className="text-slate-600 dark:text-white/60 leading-relaxed">
                  {activeHistoryTab === 'cloud'
                    ? "Images you generate while logged in will be saved to your cloud history."
                    : "Your generated images will appear here. Start creating to build your collection!"}
                </p>
              </div>
              <CustomButton
                onClick={() => setActiveTab("generate")}
                variant="primary"
              >
                Generate an Image
              </CustomButton>
            </div>
          </GlassCard>
        </div>
      )}

      {/* History grid */}
      {!isLoading && processedImages.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {processedImages.map((item) => (
            <GlassCard
                  className="overflow-hidden border-slate-300/80 dark:border-white/10 transition-all hover:shadow-md hover:-translate-y-0.5"
                >
              <div className="relative">
                <div className="aspect-video bg-slate-200 dark:bg-slate-800 overflow-hidden relative">
                  <img
                    src={item.imageUrl}
                    alt={item.prompt}
                    className="w-full h-full object-cover transition-transform hover:scale-105 cursor-pointer"
                    onClick={() => handleImageClick(item)}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/400x225?text=Image+Unavailable";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end justify-between p-3">
                    <div>
                      <CustomButton
                        variant="glass"
                        size="xs"
                        onClick={() => handleUsePrompt(item.prompt)}
                        icon={Copy}
                      >
                        Use Prompt
                      </CustomButton>
                    </div>
                    <div className="flex items-center gap-1">
                      <CustomButton
                        variant="glass"
                        size="icon-xs"
                        onClick={() => handleImageClick(item)}
                        className="rounded-full"
                      >
                        <Eye size={14} />
                      </CustomButton>
                      <CustomButton
                        variant="glass"
                        size="icon-xs"
                        onClick={() => handleDownload(item.imageUrl, item.prompt)}
                        className="rounded-full"
                      >
                        <Download size={14} />
                      </CustomButton>
                      <CustomButton
                        variant="glass"
                        size="icon-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDeleteConfirm(item.id);
                        }}
                        className="rounded-full text-red-400 hover:text-red-500"
                        disabled={activeHistoryTab === 'cloud' && !user}
                      >
                        <Trash2 size={14} />
                      </CustomButton>
                    </div>
                  </div>
                </div>

                <div className="p-3">
                  <div className="mb-1 flex items-center justify-between">
                    <div className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300">
                      {item.model || "flux"}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Calendar size={12} />
                      {item.timestamp}
                    </div>
                  </div>
                  <h3 className="text-sm font-medium line-clamp-2 text-slate-700 dark:text-white">
                    {item.prompt}
                  </h3>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}



      {/* Image Preview Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-w-5xl w-full bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white line-clamp-1">
                  {selectedImage.prompt}
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-2 md:p-4 flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-800">
                    <img
                      src={selectedImage.imageUrl}
                      alt={selectedImage.prompt}
                      className="w-full h-auto object-contain"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/800x450?text=Image+Unavailable";
                      }}
                    />
                  </div>
                </div>

                <div className="w-full md:w-64 space-y-4">
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Prompt
                      </h4>
                      <p className="text-sm text-slate-900 dark:text-white">
                        {selectedImage.prompt}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Model
                      </h4>
                      <p className="text-sm text-slate-900 dark:text-white">
                        {selectedImage.model || "Flux"}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Dimensions
                      </h4>
                      <p className="text-sm text-slate-900 dark:text-white">
                        {selectedImage.dimensions || "1024x1024"}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Generated on
                      </h4>
                      <p className="text-sm text-slate-900 dark:text-white">
                        {selectedImage.timestamp}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 pt-2">
                    <CustomButton
                      variant="primary"
                      size="sm"
                      onClick={() => handleUsePrompt(selectedImage.prompt)}
                      icon={Copy}
                    >
                      Use This Prompt
                    </CustomButton>
                    
                    <CustomButton
                      variant="secondary"
                      size="sm"
                      onClick={() => handleDownload(selectedImage.imageUrl, selectedImage.prompt)}
                      icon={Download}
                    >
                      Download
                    </CustomButton>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur"
            onClick={() => setShowDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-w-md w-full bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="h-6 w-6 text-red-500" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                  {showDeleteConfirm === 'all'
                    ? 'Clear All History'
                    : 'Delete This Image'}
                </h3>
                <p className="text-slate-500 dark:text-slate-300 mb-6">
                  {showDeleteConfirm === 'all'
                    ? 'Are you sure you want to clear your entire generation history? This action cannot be undone.'
                    : 'Are you sure you want to delete this image from your history? This action cannot be undone.'}
                </p>
                <div className="flex justify-center gap-3">
                  <CustomButton
                    variant="outline"
                    onClick={() => setShowDeleteConfirm(null)}
                  >
                    Cancel
                  </CustomButton>
                  <CustomButton
                    variant="destructive"
                    onClick={() => {
                      // Handle delete based on which tab is active
                      if (showDeleteConfirm === 'all') {
                        if (activeHistoryTab === 'local') {
                          handleClearAllHistory();
                        } else if (activeHistoryTab === 'cloud' && user) {
                          // Cloud delete not supported for bulk deletion
                          console.log('Bulk cloud deletion not supported');
                        }
                      } else {
                        // Find the image to delete
                        const imageToDelete = processedImages.find(img => img.id === showDeleteConfirm);
                        
                        if (imageToDelete) {
                          if (activeHistoryTab === 'local' || !imageToDelete.isCloud) {
                            // Handle local deletion
                            handleDeleteHistoryItem(showDeleteConfirm);
                          } else if (activeHistoryTab === 'cloud' && imageToDelete.isCloud) {
                            // Handle cloud deletion
                            handleDeleteCloudImage(imageToDelete);
                          }
                        }
                      }
                      setShowDeleteConfirm(null);
                    }}
                  >
                    Delete
                  </CustomButton>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

ModernHistoryTab.displayName = 'ModernHistoryTab';

export default ModernHistoryTab;
