// API service for pollination-related functionality
// Note: This project uses @pollinations/react hook for image generation
// This file can be used for additional API calls if needed in the future

/**
 * Utility function to validate image URLs
 * @param {string} url - The image URL to validate
 * @returns {boolean} - Whether the URL is valid
 */
export const isValidImageUrl = (url) => {
  try {
    new URL(url);
    return url.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i) !== null;
  } catch {
    return false;
  }
};

/**
 * Utility function to download generated images
 * @param {string} imageUrl - The image URL to download
 * @param {string} filename - The filename for the download
 */
export const downloadImage = async (
  imageUrl,
  filename = "generated-image.png"
) => {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error("Error downloading image:", error);
    throw error;
  }
};
