// src/components/EnhanceTab.jsx

import React, { useState } from "react";
import { Sparkles, Wand2, X } from "lucide-react";
import "./EnhanceTab.css";

const EnhanceTab = ({
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
      description:
        "High-detail character portraits, movie scenes, dramatic shots",
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

    const enhancedPrompt = `${inputPrompt.trim()}, ${selectedStyles.join(
      ", "
    )}`;
    setInputPrompt(enhancedPrompt);

    // Show the styles applied popup
    setShowStylesAppliedPopup(true);
    setTimeout(() => {
      setShowStylesAppliedPopup(false);
    }, 2000); // Hide after 2 seconds
  };

  const clearStyles = () => {
    setSelectedStyles([]);
  };

  return (
    <div className="enhance-tab">
      <div className="enhance-content">
        <div className="prompt-enhancer-section">
          <div className="section-header">
            <span className="section-icon">🔮</span>
            <h3>Prompt Enhancer</h3>
          </div>

          <div className="current-prompt">
            <label>Current Prompt:</label>
            <textarea
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="Enter your base prompt here..."
              className="prompt-textarea"
              rows={3}
            />
          </div>

          <div className="ai-enhance-section">
            <button
              onClick={handleEnhancePrompt}
              disabled={isEnhancing || !inputPrompt.trim()}
              className="try-prompt-btn ai-enhance-btn"
            >
              {isEnhancing ? (
                <>
                  <div className="loading-spinner"></div>
                  <span>Enhancing with AI...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Enhance Prompt
                </>
              )}
            </button>
            <p className="enhance-description">
              Use AI to automatically enhance your prompt with better details,
              lighting, and artistic elements
            </p>
          </div>
        </div>

        <div className="presets-section">
          <div className="section-header">
            <span className="section-icon">🎨</span>
            <h3>Style Presets</h3>
          </div>

          <div className="presets-grid">
            {enhancePresets.map((preset) => (
              <div
                key={preset.id}
                className="preset-card"
                onClick={() => applyPreset(preset)}
              >
                <div className="preset-header">
                  <h4>{preset.title}</h4>
                </div>
                <p className="preset-description">{preset.description}</p>
                <div className="preset-styles">
                  {preset.styles.slice(0, 3).map((style, index) => (
                    <span key={index} className="preset-style-tag">
                      {style}
                    </span>
                  ))}
                  {preset.styles.length > 3 && (
                    <span className="more-styles">
                      +{preset.styles.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="manual-enhancement-section">
          <div className="section-header">
            <span className="section-icon">🛠️</span>
            <h3>Manual Enhancement</h3>
            <div className="style-controls">
              <button onClick={clearStyles} className="try-prompt-btn clear-btn">
                <X size={14} />
                Clear All
              </button>
              <button
                onClick={enhanceWithStyles}
                disabled={selectedStyles.length === 0 || !inputPrompt.trim()}
                className="try-prompt-btn apply-styles-btn"
              >
                <Wand2 size={14} />
                Apply Styles ({selectedStyles.length})
              </button>
            </div>
          </div>

          <div className="style-categories">
            {styleCategories.map((category) => (
              <div key={category.title} className="style-category">
                <h4>{category.title}</h4>
                <div className="style-tags">
                  {category.styles.map((style) => (
                    <button
                      key={style}
                      onClick={() => toggleStyle(style)}
                      className={`style-tag ${
                        selectedStyles.includes(style) ? "selected" : ""
                      }`}
                    >
                      + {style}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {selectedStyles.length > 0 && (
            <div className="selected-styles-preview">
              <h4>Selected Styles ({selectedStyles.length}):</h4>
              <div className="selected-styles">
                {selectedStyles.map((style) => (
                  <span key={style} className="selected-style-tag">
                    {style}
                    <button
                      onClick={() => toggleStyle(style)}
                      className="remove-style"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Styles Applied Popup */}
      {showStylesAppliedPopup && (
        <div className="styles-applied-popup">
          <div className="popup-content">
            <span className="popup-icon">✅</span>
            <span className="popup-text">Styles Applied!</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhanceTab;
