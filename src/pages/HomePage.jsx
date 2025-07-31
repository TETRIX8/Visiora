// src/pages/HomePage.jsx

import React, { useState, useEffect } from "react";
import ImageDisplay from "../components/ImageDisplay";

// Import logo
import logo from "../assets/logo/logo.jpg";

// Import example images - using fallback for corrupted files
import example1 from "../assets/example_images/1.jpg";
import example2 from "../assets/example_images/2.jpg";
import example3 from "../assets/example_images/3.jpg";
import example4 from "../assets/example_images/4.jpg";
import example5 from "../assets/example_images/5.jpg";
import example6 from "../assets/example_images/6.jpg";

const HomePage = () => {
  // State for the text area input
  const [inputPrompt, setInputPrompt] = useState("");

  // State for the generated image URL
  const [imageUrl, setImageUrl] = useState(null);

  // State to track loading manually
  const [isLoading, setIsLoading] = useState(false);

  // State for image loading status
  const [imageLoaded, setImageLoaded] = useState(false);

  // State for errors
  const [error, setError] = useState(null);

  // Mode selection (merged basic and advanced)
  const [mode, setMode] = useState("basic");

  // Unified options for both modes
  const [selectedModel, setSelectedModel] = useState("flux");
  const [selectedShape, setSelectedShape] = useState("landscape");
  const [seed, setSeed] = useState("");
  const [removeWatermark, setRemoveWatermark] = useState(false);
  const [width, setWidth] = useState(1024);
  const [height, setHeight] = useState(1024);

  // Theme state - load from localStorage or default to dark
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("visiora-theme");
    return savedTheme ? JSON.parse(savedTheme) : true;
  });

  // Progress state
  const [progress, setProgress] = useState(0);

  // History state
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // Enhance prompt state
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancedPrompt, setEnhancedPrompt] = useState("");

  // Load history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("visiora-history");
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        setHistory(parsedHistory);
      } catch (error) {
        console.error("Error loading history from localStorage:", error);
        localStorage.removeItem("visiora-history"); // Clear corrupted data
      }
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem("visiora-history", JSON.stringify(history));
    }
  }, [history]);

  // Save theme to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("visiora-theme", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute(
      "data-theme",
      isDarkMode ? "dark" : "light"
    );
  }, [isDarkMode]);

  const shapes = {
    landscape: { width: 1344, height: 768, label: "Landscape (16:9)" },
    portrait: { width: 768, height: 1344, label: "Portrait (9:16)" },
    square: { width: 1024, height: 1024, label: "Square (1:1)" },
    wide: { width: 1536, height: 640, label: "Wide (21:9)" },
    story: { width: 576, height: 1024, label: "Story (9:16)" },
    manual: { width: 1024, height: 1024, label: "Manual" },
  };

  const models = [
    { value: "flux", label: "Flux (Best Quality)" },
    { value: "turbo", label: "Turbo (Fastest)" },
    { value: "kontext", label: "Kontext (Artistic)" },
  ];

  const examplePrompts = [
    {
      prompt:
        "anime style, dark fantasy warrior standing under a stormy sky, glowing purple katana emitting energy, black cloak fluttering in the wind, ruins in the background, red moon partially visible through clouds, electric particles, dramatic shading, vibrant colors, epic angle, cinematic detail",
      image: example1,
      title: "🖤 [Anime Style] Dark-Themed Katana Warrior",
    },
    {
      prompt:
        "a hyper-realistic cyberpunk street at midnight, neon signs glowing in pink and teal, rain-soaked pavement reflecting lights, steam rising from manholes, lone figure in trench coat walking away from camera, atmospheric perspective, shallow depth of field, cinematic Blade Runner vibe",
      image: example2,
      title: "🌃 [Realistic Concept] Neon Street at Midnight",
    },
    {
      prompt:
        "realistic mountain range glowing under early morning sun, golden light touching the snowy peaks, fog swirling through the valleys, deep blue and orange sky, flock of birds flying, peaceful but powerful atmosphere, cinematic frame, hyper-detail",
      image: example3,
      title: "🏔️ [Cinematic] Mystical Mountain Range at Sunrise",
    },
    {
      prompt:
        "a lush green forest with tall ancient trees, moss-covered rocks, soft rays of sunlight piercing through the thick canopy, a small clear stream running beside, butterflies fluttering, ambient mist, hyper-realistic and serene, nature core aesthetic",
      image: example4,
      title: "🌿 [Nature Concept] Enchanted Green Forest",
    },
    {
      prompt:
        "desolate battlefield at twilight, burning wreckage scattered around, broken swords and helmets buried in mud, black smoke rising in the distance, orange glow of dying fire reflecting in pools of blood, dramatic clouds above, realistic war-torn atmosphere",
      image: example5,
      title: "🔥 [Dark Concept] Post-War Battlefield Aftermath",
    },
    {
      prompt:
        "a futuristic rooftop garden overlooking a glowing sci-fi city, metal railings, hovering drones in the sky, vertical neon billboards on surrounding buildings, a figure sitting on edge with headphones, soft evening light, warm orange against cool steel tones, imaginative concept art",
      image: example6,
      title: "⚙️ [Creative Style] Rooftop with Industrial Sci-Fi Skyline",
    },
  ];

  const getRandomPrompt = () => {
    const randomIndex = Math.floor(Math.random() * examplePrompts.length);
    return examplePrompts[randomIndex].prompt;
  };

  const simulateProgress = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + Math.random() * 15;
      });
    }, 300);
    return interval;
  };

  const handleGenerateClick = async () => {
    if (!inputPrompt.trim()) {
      alert("Please enter a prompt!");
      return;
    }

    setIsLoading(true);
    setError(null);
    setImageLoaded(false);

    const progressInterval = simulateProgress();

    try {
      // Use Pollinations API directly
      const encodedPrompt = encodeURIComponent(inputPrompt.trim());

      // Determine dimensions based on shape selection
      let finalWidth, finalHeight;

      if (selectedShape === "manual") {
        finalWidth = width;
        finalHeight = height;
      } else {
        const shapeRatio = shapes[selectedShape];
        finalWidth = shapeRatio.width;
        finalHeight = shapeRatio.height;
      }

      // Determine seed
      const finalSeed = seed ? seed : Math.floor(Math.random() * 1000);

      // Build API URL
      let apiUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${finalWidth}&height=${finalHeight}&model=${selectedModel}&enhance=true&seed=${finalSeed}`;

      if (removeWatermark) {
        apiUrl += "&nologo=true";
      }

      console.log("API URL:", apiUrl);

      // Set the image URL
      setImageUrl(apiUrl);
      setProgress(100);

      // Add to history as soon as image is generated
      const historyItem = {
        id: Date.now(),
        prompt: inputPrompt.trim(),
        imageUrl: apiUrl,
        timestamp: new Date().toLocaleString(),
        model: selectedModel,
        shape: selectedShape,
        dimensions: `${finalWidth}x${finalHeight}`,
      };
      setHistory((prev) => [historyItem, ...prev.slice(0, 9)]); // Keep last 10 items

      // Clean up progress interval
      clearInterval(progressInterval);

      // Add a timeout to prevent indefinite loading
      const timeoutId = setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 8000); // 8 second timeout

      // Store timeout ID to clear it if image loads successfully
      window.imageLoadTimeout = timeoutId;
    } catch (err) {
      console.error("Error generating image:", err);
      setError(err.message);
      setIsLoading(false);
      setImageLoaded(false);
      setProgress(0);
      clearInterval(progressInterval);
    }
  };

  // Handle image load completion
  const handleImageLoadComplete = () => {
    setImageLoaded(true);
    setIsLoading(false);
    setProgress(0);
    // Clear the timeout since image loaded successfully
    if (window.imageLoadTimeout) {
      clearTimeout(window.imageLoadTimeout);
      window.imageLoadTimeout = null;
    }
  };

  // Handle image load error
  const handleImageLoadError = () => {
    setError("Failed to load the generated image");
    setIsLoading(false);
    setImageLoaded(false);
    setProgress(0);
    // Clear the timeout since we're handling the error
    if (window.imageLoadTimeout) {
      clearTimeout(window.imageLoadTimeout);
      window.imageLoadTimeout = null;
    }
  };

  // Handle example prompt click
  const handleExampleClick = (examplePrompt) => {
    setInputPrompt(examplePrompt);
  };

  // Handle confused button click
  const handleConfusedClick = () => {
    const randomPrompt = getRandomPrompt();
    setInputPrompt(randomPrompt);
  };

  // Handle enhance prompt
  const handleEnhancePrompt = async () => {
    if (!inputPrompt.trim()) {
      alert("Please enter a prompt first!");
      return;
    }

    setIsEnhancing(true);
    try {
      // Generate random seed for variation
      const seed = Math.floor(Math.random() * 1000000);

      // Prompt engineer instructions
      const system =
        "You are a professional prompt engineer for generative AI images. Given a user’s base idea, elaborate and enhance the prompt by preserving the original subject and context, adding vivid artistic details, improving clarity, storytelling, and immersion, including realistic textures, dynamic lighting, depth, and color harmony, specifying atmosphere and composition style, and ensuring final output is suitable for 8K ultra-high-resolution rendering. Output only the enhanced prompt as plain text.";

      // Try the main API first with new format
      let url = `https://text.pollinations.ai/${encodeURIComponent(
        system + ": " + inputPrompt.trim()
      )}`;

      let response = await fetch(url);
      let responseText = "";
      let enhancedText = "";

      // Check if response is ok
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      responseText = await response.text();

      // Check if response is HTML (error page)
      if (
        responseText.trim().toLowerCase().startsWith("<!doctype") ||
        responseText.trim().toLowerCase().startsWith("<html")
      ) {
        // Try alternative approach with simpler format
        console.log("Main API returned HTML, trying alternative approach...");
        url = `https://text.pollinations.ai/${encodeURIComponent(
          "Enhance this image prompt with more details, lighting, and artistic elements: " +
            inputPrompt.trim()
        )}`;

        response = await fetch(url);
        if (!response.ok) {
          throw new Error(
            `Alternative API also failed! status: ${response.status}`
          );
        }
        responseText = await response.text();

        // Check again for HTML
        if (
          responseText.trim().toLowerCase().startsWith("<!doctype") ||
          responseText.trim().toLowerCase().startsWith("<html")
        ) {
          throw new Error("Both API endpoints returned HTML error pages");
        }
      }

      // Try to parse as JSON, if it fails, use the text directly
      try {
        const data = JSON.parse(responseText);
        enhancedText =
          data.response || data.text || data.content || responseText;
      } catch (jsonError) {
        // If it's not JSON, check if it's a valid text response
        if (
          responseText &&
          responseText.trim().length > 10 &&
          !responseText.includes("<html") &&
          !responseText.includes("<!DOCTYPE")
        ) {
          enhancedText = responseText.trim();
        } else {
          throw new Error("Invalid response format received from API");
        }
      }

      if (
        enhancedText &&
        enhancedText.trim() &&
        enhancedText.length > inputPrompt.length / 2
      ) {
        setEnhancedPrompt(enhancedText);
        setInputPrompt(enhancedText); // Update the main prompt with enhanced version
      } else {
        throw new Error("Enhanced prompt is too short or invalid");
      }
    } catch (error) {
      console.error("Error enhancing prompt:", error);

      // Try a simple local enhancement as fallback
      try {
        const localEnhanced = enhancePromptLocally(inputPrompt.trim());
        if (localEnhanced && localEnhanced !== inputPrompt.trim()) {
          setEnhancedPrompt(localEnhanced);
          setInputPrompt(localEnhanced);
          alert(
            "API unavailable, used basic enhancement instead. Try generating!"
          );
          return;
        }
      } catch (localError) {
        console.error("Local enhancement also failed:", localError);
      }

      // Provide more specific error messages
      let errorMessage = "Error enhancing prompt: ";
      if (error.message.includes("HTML error page")) {
        errorMessage +=
          "The AI service is temporarily unavailable. Please try again later.";
      } else if (error.message.includes("Invalid response format")) {
        errorMessage +=
          "Received invalid response from AI service. Please try again.";
      } else if (error.message.includes("too short")) {
        errorMessage +=
          "The enhanced prompt was not satisfactory. Please try rephrasing your prompt.";
      } else if (error.message.includes("Both API endpoints")) {
        errorMessage +=
          "AI enhancement service is currently down. Please try again later.";
      } else {
        errorMessage += error.message;
      }

      alert(errorMessage);
    } finally {
      setIsEnhancing(false);
    }
  };

  // Simple local enhancement fallback
  const enhancePromptLocally = (prompt) => {
    if (!prompt || prompt.length < 5) return prompt;

    const enhancementPhrases = [
      "highly detailed",
      "professional photography",
      "cinematic lighting",
      "8k resolution",
      "vibrant colors",
      "sharp focus",
      "artistic composition",
      "dramatic shadows",
      "photorealistic",
      "studio quality",
    ];

    // Add some enhancement phrases if they're not already present
    let enhanced = prompt;
    const lowerPrompt = prompt.toLowerCase();

    if (!lowerPrompt.includes("detailed")) {
      enhanced += ", highly detailed";
    }
    if (
      !lowerPrompt.includes("cinematic") &&
      !lowerPrompt.includes("lighting")
    ) {
      enhanced += ", cinematic lighting";
    }
    if (
      !lowerPrompt.includes("quality") &&
      !lowerPrompt.includes("professional")
    ) {
      enhanced += ", professional quality";
    }

    return enhanced;
  };

  // Handle history item click
  const handleHistoryItemClick = (historyItem) => {
    setInputPrompt(historyItem.prompt);
    setImageUrl(historyItem.imageUrl);
    setShowHistory(false);
  };

  // Handle delete history item
  const handleDeleteHistoryItem = (itemId, event) => {
    event.stopPropagation(); // Prevent triggering the item click
    const updatedHistory = history.filter((item) => item.id !== itemId);
    setHistory(updatedHistory);

    // Update localStorage - if empty, remove the key
    if (updatedHistory.length === 0) {
      localStorage.removeItem("visiora-history");
    } else {
      localStorage.setItem("visiora-history", JSON.stringify(updatedHistory));
    }
  };

  // Handle clear all history
  const handleClearAllHistory = () => {
    setHistory([]);
    localStorage.removeItem("visiora-history");
    setShowHistory(false);
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <img src={logo} alt="Visiora" className="logo-image" />
            <span className="logo-text">Visiora</span>
          </div>
          <button
            className="theme-toggle"
            onClick={() => setIsDarkMode(!isDarkMode)}
            aria-label="Toggle theme"
          >
            {isDarkMode ? "☀️" : "🌙"}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h2 className="hero-title">Create Stunning Images with AI</h2>
          <p className="hero-subtitle">
            Where Every Image Radiates an Aura of Imagination
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="main-content">
        <div className="container">
          {/* Input Section */}
          <div className="input-section">
            <div className="prompt-area">
              <label htmlFor="prompt" className="label">
                Describe your image
              </label>
              <textarea
                id="prompt"
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                placeholder="e.g., A majestic dragon soaring through a cloudy sunset sky, digital art style"
                rows="4"
                className="prompt-input"
              />
            </div>

            {/* Enhance Prompt and Confused Buttons */}
            <div className="confused-section">
              <button
                className="enhance-btn"
                onClick={handleEnhancePrompt}
                disabled={isEnhancing || !inputPrompt.trim()}
                title="Enhance your prompt with AI"
              >
                {isEnhancing ? (
                  <>
                    <div className="spinner"></div>
                    Enhancing...
                  </>
                ) : (
                  <>✨ Enhance Prompt</>
                )}
              </button>

              <button
                className="confused-btn"
                onClick={handleConfusedClick}
                title="Get a random creative prompt"
              >
                🤔 Confused?
              </button>
            </div>

            {/* Options Grid */}
            <div className="options-grid">
              <div className="option-group">
                <label className="label">Choose Shape</label>
                <div className="shape-selector">
                  {Object.entries(shapes).map(([key, shape]) => (
                    <button
                      key={key}
                      className={`shape-btn ${
                        selectedShape === key ? "active" : ""
                      }`}
                      onClick={() => setSelectedShape(key)}
                      title={shape.label}
                    >
                      <div className={`shape-preview shape-${key}`}></div>
                      <span>{shape.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="option-group">
                <label className="label">AI Model</label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="select-input"
                >
                  {models.map((model) => (
                    <option key={model.value} value={model.value}>
                      {model.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="option-group">
                <label className="label">Seed (optional)</label>
                <input
                  type="text"
                  value={seed}
                  onChange={(e) => setSeed(e.target.value)}
                  placeholder="Random if empty"
                  className="text-input"
                />
              </div>

              {/* Manual dimensions inputs - only show when Manual is selected */}
              {selectedShape === "manual" && (
                <>
                  <div className="option-group">
                    <label className="label">Width</label>
                    <input
                      type="number"
                      value={width}
                      onChange={(e) =>
                        setWidth(parseInt(e.target.value) || 1024)
                      }
                      min="256"
                      max="2048"
                      step="64"
                      className="number-input"
                    />
                  </div>

                  <div className="option-group">
                    <label className="label">Height</label>
                    <input
                      type="number"
                      value={height}
                      onChange={(e) =>
                        setHeight(parseInt(e.target.value) || 1024)
                      }
                      min="256"
                      max="2048"
                      step="64"
                      className="number-input"
                    />
                  </div>
                </>
              )}

              <div className="option-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={removeWatermark}
                    onChange={(e) => setRemoveWatermark(e.target.checked)}
                    className="checkbox-input"
                  />
                  <span className="checkmark"></span>
                  Remove Watermark
                </label>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerateClick}
              disabled={isLoading || !inputPrompt.trim()}
              className="generate-btn"
            >
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  Generating... {Math.round(progress)}%
                </>
              ) : (
                <>✨ Generate Image</>
              )}
            </button>

            {/* Progress Bar */}
            {isLoading && (
              <div className="progress-container">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* History Section - Moved below generate button */}
            {history.length > 0 && (
              <div className="history-section-bottom">
                <button
                  className="history-btn"
                  onClick={() => setShowHistory(!showHistory)}
                  title="View generation history"
                >
                  📜 History ({history.length})
                </button>

                {showHistory && (
                  <div className="history-dropdown">
                    <div className="history-header">
                      <h4>Recent Generations</h4>
                      <div className="history-actions">
                        <button
                          className="clear-all-btn"
                          onClick={handleClearAllHistory}
                          title="Clear all history"
                        >
                          🗑️ Clear All
                        </button>
                        <button
                          className="close-history"
                          onClick={() => setShowHistory(false)}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                    <div className="history-list">
                      {history.map((item) => (
                        <div
                          key={item.id}
                          className="history-item"
                          onClick={() => handleHistoryItemClick(item)}
                        >
                          <div className="history-image">
                            <img src={item.imageUrl} alt="Generated" />
                          </div>
                          <div className="history-content">
                            <p className="history-prompt">"{item.prompt}"</p>
                            <div className="history-meta">
                              <span>{item.model}</span>
                              <span>{item.dimensions}</span>
                              <span>{item.timestamp}</span>
                            </div>
                          </div>
                          <button
                            className="delete-history-btn"
                            onClick={(e) => handleDeleteHistoryItem(item.id, e)}
                            title="Delete from history"
                          >
                            🗑️
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Image Display */}
          <div className="result-section">
            {!imageUrl && isLoading ? (
              // No image exists - show default loader
              <div className="image-container">
                <ImageDisplay
                  imageUrl={null}
                  isLoading={isLoading}
                  error={error}
                  shape={selectedShape}
                  onImageLoad={handleImageLoadComplete}
                  onImageError={handleImageLoadError}
                  showInternalLoader={true}
                />
              </div>
            ) : (
              // Image exists or no loading - show with potential blur
              <>
                <div
                  className={`image-container ${
                    isLoading && imageUrl ? "loading-blur" : ""
                  }`}
                >
                  <ImageDisplay
                    imageUrl={imageUrl}
                    isLoading={false}
                    error={error}
                    shape={selectedShape}
                    onImageLoad={handleImageLoadComplete}
                    onImageError={handleImageLoadError}
                    showInternalLoader={false}
                  />
                </div>
                {isLoading && imageUrl && (
                  <div className="loading-overlay">
                    <div className="loading-content">
                      <div className="spinner"></div>
                      <p>Generating... {Math.round(progress)}%</p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {/* Example Prompts */}
      <section className="examples">
        <div className="container">
          <h3 className="section-title">✨ Example Prompts</h3>
          <p className="section-subtitle">
            Click on any example to try it out!
          </p>
          <div className="examples-grid">
            {examplePrompts.map((example, index) => (
              <div
                key={index}
                className="example-card"
                onClick={() => handleExampleClick(example.prompt)}
              >
                <div className="example-image">
                  <img
                    src={example.image}
                    alt="Example generated image"
                    loading="lazy"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextElementSibling.style.display = "flex";
                    }}
                  />
                  <div
                    className="image-error-placeholder"
                    style={{ display: "none" }}
                  >
                    <span>🎨</span>
                    <p>Image Preview</p>
                  </div>
                  <div className="example-overlay">
                    <span className="try-prompt">✨ Try This Prompt</span>
                  </div>
                </div>
                <div className="example-content">
                  <h4 className="example-title">{example.title}</h4>
                  <p className="example-prompt">"{example.prompt}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="brand-info">
                <h3>🎨 Visiora</h3>
                <p>Where Every Image Radiates an Aura of Imagination</p>
                <p className="tagline">
                  Transform your ideas into stunning visuals with advanced AI
                  technology
                </p>
              </div>
            </div>

            <div className="footer-features">
              <div className="feature-grid">
                <div className="feature-item">
                  <div className="feature-icon">🤖</div>
                  <h4>Advanced AI Models</h4>
                  <p>State-of-the-art Flux, Turbo, and Kontext models</p>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">📐</div>
                  <h4>Flexible Dimensions</h4>
                  <p>Custom sizing for any creative project</p>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">🎯</div>
                  <h4>Precision Control</h4>
                  <p>Reproducible results with seed management</p>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">⭐</div>
                  <h4>Professional Quality</h4>
                  <p>High-resolution, commercial-grade output</p>
                </div>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-links">
              <div className="creator-info">
                <p>
                  © 2025 Visiora • Made by <strong>Arjun</strong>
                </p>
              </div>
              <div className="tech-info">
                <p>Powered by Pollinations AI • Built with React</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
