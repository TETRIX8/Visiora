import React from 'react';
import ImageGallery from '../components/gallery/ImageGallery';
import { useAuthContext } from '../contexts/AuthContextV2';
import GlassCard from '../components/ui/GlassCard';
import { User, LogIn } from 'lucide-react';
import CustomButton from '../components/ui/CustomButton';

const GalleryPage = () => {
  const { user } = useAuthContext();

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <GlassCard className="p-8 text-center max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-purple-400" />
          </div>
          <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">
            Sign In Required
          </h2>
          <p className="text-slate-600 dark:text-white/60 leading-relaxed mb-4">
            Please sign in to view your personal AI image gallery. Your creations are waiting!
          </p>
          <CustomButton
            variant="primary"
            icon={LogIn}
            onClick={() => {
              // Open authentication modal
              document.dispatchEvent(new CustomEvent('open-auth-modal'));
            }}
          >
            Sign In
          </CustomButton>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ImageGallery />
    </div>
  );
};

export default GalleryPage;
