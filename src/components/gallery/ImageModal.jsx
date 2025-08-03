import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Trash2, Copy, Calendar, Hash } from 'lucide-react';
import CustomButton from '../ui/CustomButton';
import { deleteGeneratedImage } from '../../api/imageServiceV2';
import { useAuthContext } from '../../contexts/AuthContextV2';

const ImageModal = ({ image, isOpen, onClose, onDelete }) => {
  const { user } = useAuthContext();
  
  const handleDownload = () => {
    if (image?.imageURL) {
      const link = document.createElement('a');
      link.href = image.imageURL;
      link.download = `visiora-${image.prompt?.slice(0, 30).replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'image'}-${Date.now()}.jpg`;
      link.click();
    }
  };
  
  const handleDelete = async () => {
    if (!user || !image) return;
    
    try {
      await deleteGeneratedImage(user.uid, image.imageId);
      onDelete(image.imageId);
      onClose();
    } catch (error) {
      console.error('Error deleting image:', error);
      // Handle error (show toast, etc)
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown date';
    
    try {
      return timestamp instanceof Date 
        ? timestamp.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        : 'Unknown date';
    } catch (e) {
      return 'Invalid date';
    }
  };
  
  if (!image) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 10 }}
            className="relative max-w-4xl w-full bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-2xl mx-auto border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white line-clamp-1">
                {image.prompt || "Untitled Image"}
              </h3>
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-2 md:p-6 flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <div className="rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center">
                  <img
                    src={image.imageURL}
                    alt={image.prompt || "AI Generated Image"}
                    className="w-full h-auto object-contain max-h-[70vh]"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/800x450?text=Image+Unavailable";
                    }}
                  />
                </div>
              </div>

              <div className="w-full md:w-72 space-y-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Prompt
                    </h4>
                    <p className="text-sm text-slate-900 dark:text-white">
                      {image.prompt || "No prompt available"}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Model
                    </h4>
                    <p className="text-sm text-slate-900 dark:text-white">
                      {image.modelUsed || "Unknown model"}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Dimensions
                    </h4>
                    <p className="text-sm text-slate-900 dark:text-white">
                      {image.width}×{image.height || "Unknown dimensions"}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Seed
                    </h4>
                    <div className="flex items-center gap-1">
                      <Hash size={14} className="text-slate-500 dark:text-slate-400" />
                      <p className="text-sm text-slate-900 dark:text-white font-mono">
                        {image.seed || "Random seed"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Generated on
                    </h4>
                    <div className="flex items-center gap-1">
                      <Calendar size={14} className="text-slate-500 dark:text-slate-400" />
                      <p className="text-sm text-slate-900 dark:text-white">
                        {formatDate(image.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <CustomButton
                    variant="primary"
                    size="sm"
                    onClick={handleDownload}
                    icon={Download}
                  >
                    Download Image
                  </CustomButton>
                  
                  <CustomButton
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(image.prompt || "");
                    }}
                    icon={Copy}
                  >
                    Copy Prompt
                  </CustomButton>
                  
                  <CustomButton
                    variant="destructive"
                    size="sm"
                    onClick={handleDelete}
                    icon={Trash2}
                    disabled={!user}
                  >
                    Delete Image
                  </CustomButton>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ImageModal;
