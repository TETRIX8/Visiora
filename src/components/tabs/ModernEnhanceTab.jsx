// src/components/tabs/ModernEnhanceTab.jsx
import React, { useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Wand2, X, Zap, Stars } from "lucide-react";
import GlassCard from "../ui/GlassCard";
import Button from "../ui/Button";
import ExamplePromptsGrid from "../examples/ExamplePromptsGrid";
import { cn } from "../../utils/cn";

const ModernEnhanceTab = memo(({
  inputPrompt,
  setInputPrompt,
  isEnhancing,
  handleEnhancePrompt,
}) => {
  const [selectedStyles, setSelectedStyles] = useState([]);
  const [showStylesAppliedPopup, setShowStylesAppliedPopup] = useState(false);

  const styleCategories = [
    {
      title: "Quality",
      icon: "💎",
      styles: [
        "ultra high resolution",
        "professional photography",
        "8K",
        "highly detailed",
        "sharp focus",
        "masterpiece",
      ],
    },
    {
      title: "Lighting",
      icon: "💡",
      styles: [
        "golden hour",
        "dramatic lighting",
        "soft lighting",
        "studio lighting",
        "volumetric lighting",
        "cinematic lighting",
      ],
    },
    {
      title: "Style",
      icon: "🎨",
      styles: [
        "photorealistic",
        "hyperrealistic",
        "artistic",
        "professional",
        "award winning",
        "trending on artstation",
      ],
    },
    {
      title: "Camera",
      icon: "📸",
      styles: [
        "portrait",
        "wide angle",
        "close-up",
        "macro",
        "telephoto",
        "fisheye",
      ],
    },
    {
      title: "Mood",
      icon: "🌈",
      styles: [
        "ethereal",
        "dramatic",
        "serene",
        "mysterious",
        "vibrant",
        "moody",
      ],
    },
  ];

  const enhancePresets = [
    {
      id: "cinematic",
      title: "🔮 Cinematic / Realistic",
      description: "High-detail character portraits, movie scenes, dramatic shots",
      gradient: "from-purple-500 to-pink-500",
      styles: [
        "8k ultra quality",
        "photorealistic details",
        "volumetric lighting",
        "cinematic shadows",
        "high dynamic range",
        "unreal engine render",
      ],
    },
    {
      id: "aesthetic",
      title: "🎨 Aesthetic / Minimalist",
      description: "Social media aesthetics, wallpapers, lifestyle shots",
      gradient: "from-pink-500 to-rose-500",
      styles: [
        "aesthetic composition",
        "soft pastel tones",
        "minimal lighting",
        "depth of field blur",
        "dreamy textures",
        "bokeh background",
      ],
    },
    {
      id: "anime",
      title: "🌀 Anime / Manga Inspired",
      description: "Anime portraits, fight scenes, cute characters",
      gradient: "from-cyan-500 to-blue-500",
      styles: [
        "anime style shading",
        "manga outline",
        "glowing eyes",
        "dynamic pose",
        "japanese cityscape",
        "cel-shaded color palette",
      ],
    },
    {
      id: "fantasy",
      title: "🧚 Fantasy / Mythical",
      description: "Magical worlds, elves, RPGs, godly characters",
      gradient: "from-emerald-500 to-teal-500",
      styles: [
        "epic fantasy lighting",
        "mythical creatures",
        "divine aura",
        "glowing runes",
        "ancient ruins",
        "floating islands",
      ],
    },
    {
      id: "cartoon",
      title: "🎭 Cartoon / Pixar Style",
      description: "Fun, vibrant, kid-friendly, storytelling scenes",
      gradient: "from-orange-500 to-yellow-500",
      styles: [
        "pixar animation style",
        "smooth plastic texture",
        "big expressive eyes",
        "vivid color palette",
        "storybook lighting",
        "soft character design",
      ],
    },
  ];

  const toggleStyle = (style) => {
    setSelectedStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]
    );
  };

  const applyPreset = (preset) => {
    setSelectedStyles(preset.styles);
  };

  const enhanceWithStyles = () => {
    if (!inputPrompt.trim()) {
      alert("Please enter a prompt first!");
      return;
    }

    const enhancedPrompt = `${inputPrompt.trim()}, ${selectedStyles.join(", ")}`;
    setInputPrompt(enhancedPrompt);

    setShowStylesAppliedPopup(true);
    setTimeout(() => {
      setShowStylesAppliedPopup(false);
    }, 2000);
  };

  const clearStyles = () => {
    setSelectedStyles([]);
  };

  return (
    <div className="space-y-8">
      {/* AI Prompt Enhancement */}
      <GlassCard className="border-slate-300 dark:border-white/10">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-slate-600 dark:text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-800 dark:text-white">AI Prompt Enhancer</h3>
              <p className="text-sm text-slate-600 dark:text-white/60">Transform your ideas into detailed prompts</p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-white/80">Current Prompt:</label>
            <motion.textarea
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="Enter your base idea... (e.g., 'a dragon in a forest')"
              className="w-full h-32 resize-none rounded-xl border border-slate-300/50 dark:border-white/10 bg-slate-100/50 dark:bg-white/5 px-4 py-3 text-slate-800 dark:text-white placeholder-slate-500 dark:placeholder-white/50 backdrop-blur-md transition-all duration-200 focus:border-purple-500/50 focus:bg-slate-200/50 dark:focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              whileFocus={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            />

            <Button
              onClick={handleEnhancePrompt}
              disabled={isEnhancing || !inputPrompt.trim()}
              loading={isEnhancing}
              size="lg"
              icon={isEnhancing ? null : Stars}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {isEnhancing ? "Enhancing with AI..." : "✨ Enhance Prompt with AI"}
            </Button>

            <p className="text-xs text-slate-600 dark:text-white/60 text-center">
              Our AI will add professional details, lighting, and artistic elements to your prompt
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Style Presets */}
      <GlassCard className="border-slate-300 dark:border-white/10">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
              <Wand2 className="w-5 h-5 text-slate-600 dark:text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-800 dark:text-white">Style Presets</h3>
              <p className="text-sm text-slate-600 dark:text-white/60">Quick apply professional enhancement styles</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {enhancePresets.map((preset) => (
              <motion.div
                key={preset.id}
                className="relative group cursor-pointer"
                onClick={() => applyPreset(preset)}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <div className="relative p-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:bg-white/10">
                  <div className={cn(
                    "absolute inset-0 rounded-xl bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300",
                    `bg-gradient-to-br ${preset.gradient}`
                  )} />
                  
                  <div className="relative z-10 space-y-3">
                    <h4 className="font-semibold text-slate-800 dark:text-white text-sm">{preset.title}</h4>
                    <p className="text-xs text-slate-600 dark:text-white/60 leading-relaxed">{preset.description}</p>
                    
                    <div className="flex flex-wrap gap-1">
                      {preset.styles.slice(0, 3).map((style, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs bg-slate-200/50 dark:bg-white/10 text-slate-700 dark:text-white/70 rounded-md"
                        >
                          {style}
                        </span>
                      ))}
                      {preset.styles.length > 3 && (
                        <span className="px-2 py-1 text-xs bg-purple-500/20 text-purple-300 rounded-md">
                          +{preset.styles.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Manual Style Selection */}
      <GlassCard className="border-slate-300 dark:border-white/10">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <Zap className="w-5 h-5 text-slate-600 dark:text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-white">Manual Enhancement</h3>
                <p className="text-sm text-slate-600 dark:text-white/60">Pick individual styles to customize your prompt</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearStyles}
                icon={X}
                disabled={selectedStyles.length === 0}
              >
                Clear All
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={enhanceWithStyles}
                disabled={selectedStyles.length === 0 || !inputPrompt.trim()}
                icon={Wand2}
                className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-600/30 hover:to-pink-600/30"
              >
                Apply ({selectedStyles.length})
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            {styleCategories.map((category) => (
              <div key={category.title} className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{category.icon}</span>
                  <h4 className="font-semibold text-slate-800 dark:text-white">{category.title}</h4>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {category.styles.map((style) => (
                    <motion.button
                      key={style}
                      onClick={() => toggleStyle(style)}
                      className={cn(
                        "px-3 py-2 text-sm rounded-lg border transition-all duration-200",
                        selectedStyles.includes(style)
                          ? "bg-purple-500/20 border-purple-500/50 text-purple-300"
                          : "bg-slate-200/50 dark:bg-white/5 border-slate-300/50 dark:border-white/10 text-slate-700 dark:text-white/70 hover:bg-slate-300/50 dark:hover:bg-white/10 hover:border-slate-400/50 dark:hover:border-white/20 hover:text-slate-800 dark:hover:text-white"
                      )}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      {selectedStyles.includes(style) ? "✓ " : "+ "}{style}
                    </motion.button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Selected Styles Preview */}
          <AnimatePresence>
            {selectedStyles.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-3 pt-4 border-t border-white/10"
              >
                <h4 className="font-semibold text-slate-800 dark:text-white">Selected Styles ({selectedStyles.length}):</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedStyles.map((style) => (
                    <motion.span
                      key={style}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 border border-purple-500/30 text-purple-300 rounded-lg text-sm"
                    >
                      {style}
                      <button
                        onClick={() => toggleStyle(style)}
                        className="hover:text-red-400 transition-colors"
                      >
                        ×
                      </button>
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </GlassCard>

      {/* Styles Applied Popup */}
      <AnimatePresence>
        {showStylesAppliedPopup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            className="fixed bottom-8 right-8 z-50"
          >
            <div className="flex items-center gap-3 px-6 py-4 bg-green-500/20 border border-green-500/30 backdrop-blur-md rounded-xl text-green-300">
              <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                <span className="text-slate-800 dark:text-white text-sm">✓</span>
              </div>
              <span className="font-medium">Styles Applied Successfully!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Example Prompts Grid - Full Width */}
      <ExamplePromptsGrid onPromptSelect={setInputPrompt} />
    </div>
  );
});

ModernEnhanceTab.displayName = 'ModernEnhanceTab';

export default ModernEnhanceTab;