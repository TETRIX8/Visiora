import { useState, useEffect } from 'react';
import { getUserGeneratedImages } from '../api/imageServiceV2';
import { useAuthContext } from '../contexts/AuthContextV2';

/**
 * Custom hook to fetch and manage user generated images
 * @param {number} limit - Maximum number of images to fetch
 * @returns {object} - Images data and state
 */
export const useUserImages = (limit = 50) => {
  const { user } = useAuthContext();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchImages = async () => {
    if (!user) {
      setImages([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const fetchedImages = await getUserGeneratedImages(user.uid, limit);
      setImages(fetchedImages);
    } catch (err) {
      console.error('Error fetching images:', err);
      setError('Failed to load your images. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Refresh images after deletion
  const refreshAfterDelete = (deletedImageId) => {
    setImages(prevImages => prevImages.filter(img => img.imageId !== deletedImageId));
  };

  // Fetch images when component mounts or user changes
  useEffect(() => {
    fetchImages();
  }, [user]);

  return {
    images,
    loading,
    error,
    refresh: fetchImages,
    refreshAfterDelete
  };
};
