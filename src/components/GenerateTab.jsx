// src/components/GenerateTab.jsx

import React from "react";
import ImageDisplay from "./ImageDisplay";
import "./GenerateTab.css";

const GenerateTab = ({
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
  examplePrompts,
  handleGenerateClick,
  handleImageLoadComplete,
  handleImageLoadError,
  handleExampleClick,
  handleConfusedClick,
  handleGenerateRandomPrompt,
  isGeneratingRandom,
}) => {
  return (
    <div className="generate-tab">
      <div className="generate-content">
        <div className="left-panel">
          <div className="prompt-section">
            <div className="section-header">
              <span className="section-icon">✨</span>
              <h3>Describe your image</h3>
              <div className="header-buttons">
                <button
                  className="random-btn"
                  onClick={handleConfusedClick}
                  title="Get quick random prompt"
                >
                  <span className="random-icon">⚡</span>
                  Quick
                </button>
                <button
                  className="ai-random-btn"
                  onClick={() => handleGenerateRandomPrompt()}
                  disabled={isGeneratingRandom}
                  title="Generate AI-powered creative prompt"
                >
                  {isGeneratingRandom ? (
                    <>
                      <div className="loading-spinner"></div>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <span className="ai-icon">🤖</span>
                      AI Random
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="prompt-input-container">
              <textarea
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                placeholder="A majestic dragon flying over a medieval castle at sunset..."
                className="prompt-textarea"
                rows={4}
              />
            </div>

            <div className="ai-categories-section">
              <label>🎨 AI Random Categories:</label>
              <div className="category-buttons">
                <button
                  className="category-btn"
                  onClick={() =>
                    handleGenerateRandomPrompt("portrait photography")
                  }
                  disabled={isGeneratingRandom}
                >
                  Portrait
                </button>
                <button
                  className="category-btn"
                  onClick={() =>
                    handleGenerateRandomPrompt("landscape photography")
                  }
                  disabled={isGeneratingRandom}
                >
                  Landscape
                </button>
                <button
                  className="category-btn"
                  onClick={() => handleGenerateRandomPrompt("fantasy artwork")}
                  disabled={isGeneratingRandom}
                >
                  Fantasy
                </button>
                <button
                  className="category-btn"
                  onClick={() => handleGenerateRandomPrompt("sci-fi scenes")}
                  disabled={isGeneratingRandom}
                >
                  Sci-Fi
                </button>
                <button
                  className="category-btn"
                  onClick={() => handleGenerateRandomPrompt("anime characters")}
                  disabled={isGeneratingRandom}
                >
                  Anime
                </button>
                <button
                  className="category-btn"
                  onClick={() => handleGenerateRandomPrompt("")}
                  disabled={isGeneratingRandom}
                >
                  Surprise Me!
                </button>
              </div>
            </div>
          </div>

          <div className="controls-section">
            <div className="control-group">
              <label>🤖 AI Model</label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="model-select"
              >
                {models.map((model) => (
                  <option key={model.value} value={model.value}>
                    {model.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="control-group">
              <label>📐 Dimensions</label>
              <select
                value={selectedShape}
                onChange={(e) => setSelectedShape(e.target.value)}
                className="shape-select"
              >
                {Object.entries(shapes).map(([key, shape]) => (
                  <option key={key} value={key}>
                    {shape.label}
                  </option>
                ))}
              </select>
            </div>

            {selectedShape === "manual" && (
              <div className="manual-dimensions">
                <div className="dimension-input">
                  <label>Width</label>
                  <input
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    min="256"
                    max="2048"
                    step="64"
                  />
                </div>
                <div className="dimension-input">
                  <label>Height</label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    min="256"
                    max="2048"
                    step="64"
                  />
                </div>
              </div>
            )}

            <div className="control-group">
              <label>🎲 Seed (Optional)</label>
              <input
                type="text"
                value={seed}
                onChange={(e) => setSeed(e.target.value)}
                placeholder="Random seed"
                className="seed-input"
              />
              <small>Use same seed for reproducible results</small>
            </div>

            <div className="control-group">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={removeWatermark}
                  onChange={(e) => setRemoveWatermark(e.target.checked)}
                />
                <span className="checkmark"></span>
                Remove watermark
              </label>
            </div>
          </div>

          <button
            onClick={handleGenerateClick}
            disabled={isLoading || !inputPrompt.trim()}
            className="generate-btn"
          >
            {isLoading ? (
              <>
                <div className="loading-spinner"></div>
                <span>Generating... {Math.round(progress)}%</span>
              </>
            ) : (
              <>
                <span className="generate-icon">✨</span>
                Generate Image
              </>
            )}
          </button>
        </div>

        <div className="right-panel">
          <div className="image-display-section">
            <div className="section-header">
              <span className="section-icon">🖼️</span>
              <h3>Generated Image</h3>
            </div>

            <div className="image-container">
              {imageUrl ? (
                <ImageDisplay
                  imageUrl={imageUrl}
                  isLoading={isLoading}
                  imageLoaded={imageLoaded}
                  error={error}
                  onLoadComplete={handleImageLoadComplete}
                  onLoadError={handleImageLoadError}
                />
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">✨</div>
                  <h4>Ready to Create</h4>
                  <p>
                    Enter a prompt and click generate to create your first AI
                    image
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateTab;
