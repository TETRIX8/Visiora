import React, { useState, useEffect, useRef } from "react";
import "./card-swipe.css";

const CardSwipe = ({
  images = [],
  autoplayDelay = 3000,
  slideShadows = true,
  showDots = true,
  showArrows = true,
  className = "",
  onImageClick,
  onSlideChange,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [wheelDebounce, setWheelDebounce] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const intervalRef = useRef(null);
  const containerRef = useRef(null);

  // Auto-play functionality
  useEffect(() => {
    if (isAutoplay && images.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const newIndex = prevIndex === images.length - 1 ? 0 : prevIndex + 1;
          if (onSlideChange) {
            onSlideChange(newIndex);
          }
          return newIndex;
        });
      }, autoplayDelay);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAutoplay, autoplayDelay, images.length, onSlideChange]);

  // Pause autoplay on hover
  const handleMouseEnter = () => setIsAutoplay(false);
  const handleMouseLeave = () => setIsAutoplay(true);

  // Navigation functions
  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    if (onSlideChange) {
      onSlideChange(newIndex);
    }
  };

  const goToNext = () => {
    const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    if (onSlideChange) {
      onSlideChange(newIndex);
    }
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
    if (onSlideChange) {
      onSlideChange(index);
    }
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  // Handle image click
  const handleImageClick = (index) => {
    if (onImageClick) {
      onImageClick(index);
    }
  };

  // Handle wheel events for mouse/trackpad swipe
  const handleWheel = (e) => {
    if (wheelDebounce || images.length <= 1) return;
    
    e.preventDefault();
    setWheelDebounce(true);
    
    // Add visual feedback class
    if (containerRef.current) {
      containerRef.current.classList.add('wheel-scrolling');
    }
    
    // Determine scroll direction
    const deltaY = e.deltaY;
    const deltaX = e.deltaX;
    
    // Use horizontal scroll if available (trackpad), otherwise vertical
    const delta = Math.abs(deltaX) > Math.abs(deltaY) ? deltaX : deltaY;
    
    if (delta > 0) {
      goToNext();
    } else if (delta < 0) {
      goToPrevious();
    }
    
    // Debounce wheel events to prevent too rapid scrolling
    setTimeout(() => {
      setWheelDebounce(false);
      // Remove visual feedback class
      if (containerRef.current) {
        containerRef.current.classList.remove('wheel-scrolling');
      }
    }, 300);
  };

  // Mouse drag handlers
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart(e.clientX);
    setIsAutoplay(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
  };

  const handleMouseUp = (e) => {
    if (!isDragging) return;
    
    const dragEnd = e.clientX;
    const distance = dragStart - dragEnd;
    const threshold = 50;
    
    if (Math.abs(distance) > threshold) {
      if (distance > 0) {
        goToNext();
      } else {
        goToPrevious();
      }
    }
    
    setIsDragging(false);
    setDragStart(0);
    setIsAutoplay(true);
  };

  const handleMouseLeaveContainer = () => {
    setIsDragging(false);
    setDragStart(0);
    setIsAutoplay(true);
  };

  if (!images || images.length === 0) {
    return (
      <div className={`card-swipe-container empty ${className}`}>
        <div className="empty-state">No images available</div>
      </div>
    );
  }

  return (
    <div
      className={`card-swipe-container ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeaveContainer}
      onWheel={handleWheel}
      ref={containerRef}
    >
      <div
        className="card-swipe-wrapper"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        {/* Navigation Arrows */}
        {showArrows && images.length > 1 && (
          <>
            <button
              className="swipe-arrow swipe-arrow-left"
              onClick={goToPrevious}
              aria-label="Previous image"
            >
              <i className="ri-arrow-left-line"></i>
            </button>
            <button
              className="swipe-arrow swipe-arrow-right"
              onClick={goToNext}
              aria-label="Next image"
            >
              <i className="ri-arrow-right-line"></i>
            </button>
          </>
        )}

        {/* Image Slider */}
        <div className="card-swipe-slider">
          <div
            className="card-swipe-track"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {images.map((image, index) => (
              <div
                key={index}
                className={`card-swipe-slide ${
                  index === currentIndex ? "active" : ""
                }`}
                onClick={() => handleImageClick(index)}
              >
                <img
                  src={image.src}
                  alt={image.alt || `Slide ${index + 1}`}
                  className="swipe-image"
                  draggable={false}
                />
                {slideShadows && <div className="slide-shadow"></div>}
              </div>
            ))}
          </div>
        </div>

        {/* Dots Indicator */}
        {showDots && images.length > 1 && (
          <div className="swipe-dots">
            {images.map((_, index) => (
              <button
                key={index}
                className={`swipe-dot ${
                  index === currentIndex ? "active" : ""
                }`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CardSwipe;
