// src/components/HistoryTab.jsx

import React, { useState } from "react";
import { Trash2, Play, Eye, Download, X } from "lucide-react";
import "./HistoryTab.css";

const HistoryTab = ({
  history,
  setInputPrompt,
  setActiveTab,
  handleDeleteHistoryItem,
  handleClearAllHistory,
}) => {
  const [selectedImage, setSelectedImage] = useState(null);

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

  const downloadImage = async (imageUrl, filename) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename || "visiora-image.png";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading image:", error);
      alert("Failed to download image. Please try again.");
    }
  };

  if (history.length === 0) {
    return (
      <div className="history-tab">
        <div className="empty-history">
          <div className="empty-icon">🕐</div>
          <h3>No Generation History</h3>
          <p>
            Your generated images will appear here. Start creating to build your
            history!
          </p>
          <button
            onClick={() => setActiveTab("generate")}
            className="start-generating-btn"
          >
            <span className="generate-icon">✨</span>
            Start Generating
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="history-tab">
      <div className="history-header">
        <div className="section-header">
          <span className="section-icon">🕐</span>
          <h3>Generation History</h3>
          <span className="history-count">{history.length} total images</span>
          {history.length > 0 && (
            <button
              className="clear-all-btn"
              onClick={() => {
                if (
                  window.confirm(
                    "Are you sure you want to delete all history? This action cannot be undone."
                  )
                ) {
                  handleClearAllHistory();
                }
              }}
            >
              🗑️ Clear All
            </button>
          )}
        </div>
      </div>

      <div className="history-grid">
        {history.map((item) => (
          <div key={item.id} className="history-item">
            <div
              className="history-image"
              onClick={() => handleImageClick(item)}
            >
              <img
                src={item.imageUrl}
                alt="Generated"
                loading="lazy"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.parentElement.innerHTML = `
                    <div class="image-error">
                      <span>⚠️</span>
                      <p>Failed to load</p>
                    </div>
                  `;
                }}
              />
            </div>

            <div className="history-details">
              <p className="history-prompt">
                {item.prompt.length > 100
                  ? `${item.prompt.substring(0, 100)}...`
                  : item.prompt}
              </p>

              <div className="history-meta">
                <span className="model-badge">
                  {item.model || "Flux (Best Quality)"}
                </span>
                <span className="dimensions">
                  {item.dimensions || "1344x768"}
                </span>
              </div>

              <div className="history-timestamp">{item.timestamp}</div>

              <div className="history-actions">
                <button
                  onClick={() => handleUsePrompt(item.prompt)}
                  className="try-prompt-btn action-btn use-prompt-btn"
                  title="Use this prompt"
                >
                  <Play size={14} />
                  Use Prompt
                </button>
                <button
                  onClick={() => handleImageClick(item)}
                  className="try-prompt-btn action-btn view-btn"
                  title="View full image"
                >
                  <Eye size={14} />
                  View
                </button>
                <button
                  onClick={() =>
                    downloadImage(item.imageUrl, `visiora-${item.id}.png`)
                  }
                  className="try-prompt-btn action-btn download-btn"
                  title="Download image"
                >
                  <Download size={14} />
                  Download
                </button>
                <button
                  onClick={(e) => {
                    if (
                      window.confirm(
                        "Are you sure you want to delete this image?"
                      )
                    ) {
                      handleDeleteHistoryItem(item.id, e);
                    }
                  }}
                  className="try-prompt-btn action-btn delete-btn"
                  title="Delete image"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedImage && (
        <div className="image-modal glass-backdrop" onClick={handleCloseModal}>
          <div className="modal-content glass-effect" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={handleCloseModal}>
              <X size={20} />
            </button>

            <div className="modal-image">
              <img src={selectedImage.imageUrl} alt="Generated" />
            </div>

            <div className="modal-details">
              <h4>Image Details</h4>

              <div className="detail-group">
                <label>Prompt:</label>
                <p>{selectedImage.prompt}</p>
              </div>

              <div className="detail-row">
                <div className="detail-group">
                  <label>Model:</label>
                  <p>{selectedImage.model || "Flux (Best Quality)"}</p>
                </div>
                <div className="detail-group">
                  <label>Dimensions:</label>
                  <p>{selectedImage.dimensions || "1344x768"}</p>
                </div>
              </div>

              <div className="detail-group">
                <label>Generated:</label>
                <p>{selectedImage.timestamp}</p>
              </div>

              <div className="modal-actions">
                <button
                  onClick={() => {
                    handleUsePrompt(selectedImage.prompt);
                    handleCloseModal();
                  }}
                  className="use-prompt-btn-modal"
                >
                  Use This Prompt
                </button>
                <button
                  onClick={() =>
                    downloadImage(
                      selectedImage.imageUrl,
                      `visiora-${selectedImage.id}.png`
                    )
                  }
                  className="download-btn-modal"
                >
                  Download Image
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryTab;
