// src/components/ImageDisplay.jsx

import React, { useState } from "react";
import "./Loader.css"; // Import loader styles

const ImageDisplay = ({ imageUrl, isLoading, error, shape = "landscape", onImageLoad, onImageError }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
    if (onImageLoad) onImageLoad();
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(false);
    if (onImageError) onImageError();
  };

  const downloadImage = async () => {
    if (imageUrl) {
      try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ai-generated-image-${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } catch (error) {
        console.error('Error downloading image:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="image-display-container loading">
        <div className="loader-container">
          <div className="modern-loader"></div>
          <p className="loading-text">Creating your masterpiece...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="image-display-container error">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h3>Oops! Something went wrong</h3>
          <p className="error-message">{error}</p>
          <p className="error-hint">Please try again with a different prompt or check your connection.</p>
        </div>
      </div>
    );
  }

  if (imageUrl) {
    return (
      <div className="image-display-container success">
        <div className="image-wrapper">
          {!imageLoaded && !imageError && (
            <div className="image-loading">
              <div className="modern-loader small"></div>
            </div>
          )}
          <img
            src={imageUrl}
            alt="AI Generated Image"
            className={`generated-image ${shape} ${imageLoaded ? 'loaded' : ''}`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={{ display: imageError ? 'none' : 'block' }}
          />
          {imageError && (
            <div className="image-error">
              <p>Failed to load image</p>
            </div>
          )}
        </div>
        {imageLoaded && !imageError && (
          <div className="image-actions">
            <button className="download-btn" onClick={downloadImage}>
              📥 Download Image
            </button>
            <button className="share-btn" onClick={() => navigator.clipboard.writeText(imageUrl)}>
              🔗 Copy Link
            </button>
          </div>
        )}
      </div>
    );
  }

  // Initial placeholder
  return (
    <div className="image-display-container placeholder">
      <div className="placeholder-content">
        <div className="placeholder-icon">🎨</div>
        <h3>Ready to Create?</h3>
        <p>Your AI-generated masterpiece will appear here!</p>
        <div className="placeholder-features">
          <div className="feature">✨ High Quality</div>
          <div className="feature">⚡ Fast Generation</div>
          <div className="feature">🎯 Precise Results</div>
        </div>
      </div>
    </div>
  );
};

export default ImageDisplay;
