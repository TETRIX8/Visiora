// src/components/tabs/ModernGenerateTab.jsx
import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Wand2, 
  Bot, 
  Zap, 
  Download, 
  Settings,
  Image as ImageIcon,
  Shuffle
} from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { cn } from '../../utils/cn';

const ModernGenerateTab = memo(({
  inputPrompt,
  setInputPrompt,
  imageUrl,
  isLoading,
  imageLoaded,
  error,
  progress,
  selectedModel,
  setSelectedModel,
  selectedShape,
  setSelectedShape,
  seed,
  setSeed,
  removeWatermark,
  setRemoveWatermark,
  width,
  height,
  setWidth,
  setHeight,
  shapes,
  models,
  handleGenerateClick,
  handleImageLoadComplete,
  handleImageLoadError,
  handleConfusedClick,
  handleGenerateRandomPrompt,
  isGeneratingRandom,
}) => {
  const categories = [
    { id: 'portrait', label: 'Portrait', icon: '👤' },
    { id: 'landscape', label: 'Landscape', icon: '🏔️' },
    { id: 'fantasy', label: 'Fantasy', icon: '🧙' },
    { id: 'scifi', label: 'Sci-Fi', icon: '🚀' },
    { id: 'anime', label: 'Anime', icon: '🎌' },
    { id: 'surprise', label: 'Surprise', icon: '🎲' }
  ];

  const handleDownload = () => {
    if (imageUrl) {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `visiora-${Date.now()}.jpg`;
      link.click();
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Left Panel - Controls */}
      <div className="space-y-6">
        {/* Prompt Section */}
        <GlassCard>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-semibold text-white">Describe Your Vision</h3>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleConfusedClick}
                  icon={Zap}
                  className="text-xs"
                >
                  Quick
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleGenerateRandomPrompt()}
                  disabled={isGeneratingRandom}
                  icon={isGeneratingRandom ? null : Bot}
                  loading={isGeneratingRandom}
                  className="text-xs"
                >
                  AI Random
                </Button>
              </div>
            </div>

            <motion.textarea
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="A majestic dragon soaring through storm clouds, lightning illuminating its scales, cinematic lighting, ultra detailed..."
              className="w-full h-32 resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/50 backdrop-blur-md transition-all duration-200 focus:border-purple-500/50 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              whileFocus={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            />

            {/* Category Buttons */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">🎨 Quick Categories:</label>
              <div className="grid grid-cols-3 gap-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const categoryMapping = {
                        portrait: 'portrait photography',
                        landscape: 'landscape photography',
                        fantasy: 'fantasy artwork',
                        scifi: 'sci-fi scenes',
                        anime: 'anime characters',
                        surprise: ''
                      };
                      handleGenerateRandomPrompt(categoryMapping[category.id]);
                    }}
                    disabled={isGeneratingRandom}
                    className="flex items-center gap-2 text-xs"
                  >
                    <span>{category.icon}</span>
                    {category.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Advanced Settings */}
        <GlassCard>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">Generation Settings</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Model Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/80">AI Model</label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white backdrop-blur-md transition-all duration-200 focus:border-purple-500/50 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                >
                  {models.map((model) => (
                    <option key={model.value} value={model.value} className="bg-slate-800">
                      {model.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dimensions */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/80">Dimensions</label>
                <select
                  value={selectedShape}
                  onChange={(e) => setSelectedShape(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white backdrop-blur-md transition-all duration-200 focus:border-purple-500/50 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                >
                  {Object.entries(shapes).map(([key, shape]) => (
                    <option key={key} value={key} className="bg-slate-800">
                      {shape.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Manual Dimensions */}
            <AnimatePresence>
              {selectedShape === 'manual' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-2 gap-4"
                >
                  <Input
                    type="number"
                    label="Width"
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    min="256"
                    max="2048"
                    step="64"
                  />
                  <Input
                    type="number"
                    label="Height"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    min="256"
                    max="2048"
                    step="64"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Seed and Options */}
            <div className="space-y-4">
              <Input
                label="Seed (Optional)"
                value={seed}
                onChange={(e) => setSeed(e.target.value)}
                placeholder="Random seed for reproducible results"
              />

              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={removeWatermark}
                    onChange={(e) => setRemoveWatermark(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={cn(
                    "w-5 h-5 rounded border-2 transition-all duration-200",
                    removeWatermark 
                      ? "bg-purple-500 border-purple-500" 
                      : "border-white/30 bg-transparent hover:border-white/50"
                  )}>
                    {removeWatermark && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex items-center justify-center h-full"
                      >
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </motion.div>
                    )}
                  </div>
                </div>
                <span className="text-sm text-white/80">Remove watermark</span>
              </label>
            </div>
          </div>
        </GlassCard>

        {/* Generate Button */}
        <Button
          onClick={handleGenerateClick}
          disabled={isLoading || !inputPrompt.trim()}
          loading={isLoading}
          size="lg"
          className="w-full"
          icon={isLoading ? null : Sparkles}
        >
          {isLoading ? `Generating... ${Math.round(progress)}%` : 'Generate Image'}
        </Button>
      </div>

      {/* Right Panel - Image Display */}
      <div className="space-y-6">
        <GlassCard className="h-fit">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-semibold text-white">Generated Image</h3>
              </div>
              {imageUrl && imageLoaded && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDownload}
                  icon={Download}
                >
                  Download
                </Button>
              )}
            </div>

            <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-white/5 border border-white/10">
              <AnimatePresence mode="wait">
                {imageUrl ? (
                  <motion.div
                    key={imageUrl}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.5 }}
                    className="relative w-full h-full"
                  >
                    <img
                      src={imageUrl}
                      alt="Generated"
                      className="w-full h-full object-cover"
                      onLoad={handleImageLoadComplete}
                      onError={handleImageLoadError}
                    />
                    
                    {/* Loading Overlay */}
                    <AnimatePresence>
                      {isLoading && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center"
                        >
                          <div className="text-center space-y-4">
                            <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto" />
                            <div className="space-y-2">
                              <p className="text-white text-sm">Generating your image...</p>
                              <div className="w-48 h-2 bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${progress}%` }}
                                  transition={{ duration: 0.3 }}
                                />
                              </div>
                              <p className="text-white/60 text-xs">{Math.round(progress)}% complete</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-center h-full text-center"
                  >
                    <div className="space-y-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mx-auto">
                        <Sparkles className="w-8 h-8 text-purple-400" />
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-white/90 mb-2">Ready to Create</h4>
                        <p className="text-sm text-white/60 max-w-xs">
                          Enter a prompt and click generate to create your first AI image
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error State */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="absolute inset-0 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-center"
                  >
                    <div className="text-center p-6">
                      <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-3">
                        <span className="text-red-400 text-xl">⚠️</span>
                      </div>
                      <p className="text-red-400 text-sm">{error}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
});

ModernGenerateTab.displayName = 'ModernGenerateTab';

export default ModernGenerateTab;