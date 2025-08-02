// src/components/tabs/ModernHistoryTab.jsx
import React, { useState, memo } from "react";
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
  AlertTriangle
} from "lucide-react";
import GlassCard from "../ui/GlassCard";
import CustomButton from "../ui/CustomButton";
import ExamplePromptsGrid from "../examples/ExamplePromptsGrid";
import { SocialLinksDemo } from "../ui/SocialLinksDemo";
import { cn } from "../../utils/cn";

const ModernHistoryTab = memo(({
  history,
  setInputPrompt,
  setActiveTab,
  handleDeleteHistoryItem,
  handleClearAllHistory,
}) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const handleImageClick = (historyItem) => {
    setSelectedImage(historyItem);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const handleUsePrompt = (prompt) => {
    setInputPrompt(prompt);
    setActiveTab("generate");
  };

  const handleDownload = (imageUrl, prompt) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `visiora-${prompt.slice(0, 30).replace(/[^a-z0-9]/gi, '_').toLowerCase()}-${Date.now()}.jpg`;
    link.click();
  };

  const handleDeleteClick = (itemId, event) => {
    event.stopPropagation();
    setShowDeleteConfirm(itemId);
  };

  const confirmDelete = (itemId, event) => {
    handleDeleteHistoryItem(itemId, event);
    setShowDeleteConfirm(null);
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  if (history.length === 0) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <GlassCard className="text-center max-w-md mx-auto">
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mx-auto">
                <History className="w-8 h-8 text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">No History Yet</h3>
                <p className="text-slate-600 dark:text-white/60 leading-relaxed">
                  Your generated images will appear here. Start creating to build your collection!
                </p>
              </div>
              <CustomButton
                onClick={() => setActiveTab("generate")}
                variant="primary"
                className="mt-4"
              >
                Start Creating
              </CustomButton>
            </div>
          </GlassCard>
        </div>
        
        {/* Example Prompts Grid - Full Width */}
        <ExamplePromptsGrid onPromptSelect={handleUsePrompt} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <GlassCard className="border-slate-300 dark:border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <History className="w-5 h-5 text-slate-600 dark:text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-800 dark:text-white">Your Creations</h3>
              <p className="text-sm text-slate-600 dark:text-white/60">{history.length} images in your collection</p>
            </div>
          </div>
          
          {history.length > 0 && (
            <CustomButton
              variant="ghost"
              size="sm"
              onClick={handleClearAllHistory}
              icon={Trash2}
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
            >
              Clear All
            </CustomButton>
          )}
        </div>
      </GlassCard>

      {/* History Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {history.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              transition={{ 
                duration: 0.3, 
                delay: index * 0.05,
                type: "spring",
                stiffness: 300,
                damping: 25
              }}
              className="group"
            >
              <GlassCard hover={false} className="overflow-hidden p-0 border-slate-300 dark:border-white/10">
                <div className="relative">
                  {/* Image */}
                  <div 
                    className="relative aspect-[4/3.7] cursor-pointer overflow-hidden"
                    onClick={() => handleImageClick(item)}
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.prompt}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      loading="lazy"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ opacity: 1, scale: 1 }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      >
                        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                          <Eye className="w-6 h-6 text-slate-800 dark:text-white" />
                        </div>
                      </motion.div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-3">
                    {/* Prompt */}
                    <p className="text-sm text-slate-700 dark:text-white/80 line-clamp-2 leading-relaxed">
                      {item.prompt}
                    </p>

                    {/* Metadata */}
                    <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-white/50">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(item.timestamp)}</span>
                      <span>•</span>
                      <Settings className="w-3 h-3" />
                      <span>{item.model}</span>
                      {item.dimensions && (
                        <>
                          <span>•</span>
                          <span>{item.dimensions}</span>
                        </>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <CustomButton
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUsePrompt(item.prompt)}
                        icon={Copy}
                        className="flex-1 text-xs"
                      >
                        Use Prompt
                      </CustomButton>
                      <CustomButton
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownload(item.imageUrl, item.prompt)}
                        icon={Download}
                        className="text-xs"
                      />
                      <CustomButton
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handleDeleteClick(item.id, e)}
                        icon={Trash2}
                        className="text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      />
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative max-w-4xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <GlassCard className="overflow-hidden">
                {/* Close Button */}
                <button
                  onClick={handleCloseModal}
                  className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-slate-800 dark:text-white hover:bg-black/70 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Image */}
                <div className="relative">
                  <img
                    src={selectedImage.imageUrl}
                    alt={selectedImage.prompt}
                    className="w-full h-auto max-h-[60vh] object-contain"
                  />
                </div>

                {/* Details */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">Prompt</h3>
                    <p className="text-slate-700 dark:text-white/80 leading-relaxed">{selectedImage.prompt}</p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="space-y-1">
                      <span className="text-slate-600 dark:text-white/50">Created</span>
                      <p className="text-slate-700 dark:text-white/80">{formatDate(selectedImage.timestamp)}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-slate-600 dark:text-white/50">Model</span>
                      <p className="text-slate-700 dark:text-white/80">{selectedImage.model}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-slate-600 dark:text-white/50">Aspect</span>
                      <p className="text-slate-700 dark:text-white/80">{selectedImage.shape}</p>
                    </div>
                    {selectedImage.dimensions && (
                      <div className="space-y-1">
                        <span className="text-slate-600 dark:text-white/50">Size</span>
                        <p className="text-slate-700 dark:text-white/80">{selectedImage.dimensions}</p>
                      </div>
                    )}
                  </div>

                  {/* Modal Actions */}
                  <div className="flex gap-3 pt-4 border-t border-white/10">
                    <CustomButton
                      onClick={() => {
                        handleUsePrompt(selectedImage.prompt);
                        handleCloseModal();
                      }}
                      variant="primary"
                      icon={Copy}
                      className="flex-1"
                    >
                      Use This Prompt
                    </CustomButton>
                    <CustomButton
                      onClick={() => handleDownload(selectedImage.imageUrl, selectedImage.prompt)}
                      variant="secondary"
                      icon={Download}
                    >
                      Download
                    </CustomButton>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowDeleteConfirm(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <GlassCard>
                <div className="text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mx-auto">
                    <AlertTriangle className="w-6 h-6 text-red-400" />
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">Delete Image?</h3>
                    <p className="text-slate-600 dark:text-white/60">
                      This action cannot be undone. The image will be permanently removed from your history.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <CustomButton
                      variant="ghost"
                      onClick={() => setShowDeleteConfirm(null)}
                      className="flex-1"
                    >
                      Cancel
                    </CustomButton>
                    <CustomButton
                      variant="primary"
                      onClick={(e) => confirmDelete(showDeleteConfirm, e)}
                      className="flex-1 bg-red-600 hover:bg-red-700"
                    >
                      Delete
                    </CustomButton>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Example Prompts Grid - Full Width */}
      <ExamplePromptsGrid onPromptSelect={setInputPrompt} />
      
      {/* Social Links Section */}
      <SocialLinksDemo />
    </div>
  );
});

ModernHistoryTab.displayName = 'ModernHistoryTab';

export default ModernHistoryTab;