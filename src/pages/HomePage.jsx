// src/pages/HomePage.jsx

import React, { useState, useEffect } from "react";
import ImageDisplay from "../components/ImageDisplay";
import TabNavigation from "../components/TabNavigation";
import GenerateTab from "../components/GenerateTab";
import EnhanceTab from "../components/EnhanceTab";
import HistoryTab from "../components/HistoryTab";
import TypewriterEffect from "../components/TypewriterEffect";
import ThemeToggleButton from "../components/ui/theme-toggle-button";
import SocialLinks from "../components/SocialLinks";
import { TextScroll } from "../components/ui/text-scroll";
import { generateRandomPrompt } from "../api/pollinationService";

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

  // Active tab state
  const [activeTab, setActiveTab] = useState("generate");

  // Enhance prompt state
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancedPrompt, setEnhancedPrompt] = useState("");

  // Random prompt generation state
  const [isGeneratingRandom, setIsGeneratingRandom] = useState(false);

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
    
    // Also apply to document root for Tailwind dark mode
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Handle theme change
  const handleThemeChange = (newIsDarkMode) => {
    setIsDarkMode(newIsDarkMode);
  };

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

  // Handle AI-powered random prompt generation
  const handleGenerateRandomPrompt = async (category = "") => {
    setIsGeneratingRandom(true);
    try {
      const randomPrompt = await generateRandomPrompt(category);
      setInputPrompt(randomPrompt);
    } catch (error) {
      console.error("Error generating random prompt:", error);
      // Fall back to local random prompt
      const fallbackPrompt = getRandomPrompt();
      setInputPrompt(fallbackPrompt);
    } finally {
      setIsGeneratingRandom(false);
    }
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
        "You are a professional prompt engineer for generative AI images. Given a users base idea, elaborate and enhance the prompt by preserving the original subject and context, adding vivid artistic details, improving clarity, storytelling, and immersion, including realistic textures, dynamic lighting, depth, and color harmony, specifying atmosphere and composition style, and ensuring final output is suitable for 8K ultra-high-resolution rendering. Output only the enhanced prompt as plain text.";

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
        enhancedText.trim().length > 15 && // Minimum reasonable length
        enhancedText.trim() !== inputPrompt.trim() // Must be different from original
      ) {
        setEnhancedPrompt(enhancedText);
        setInputPrompt(enhancedText); // Update the main prompt with enhanced version
      } else {
        // If enhancement is same as original or too short, try local enhancement
        console.log(
          "API enhancement not satisfactory, trying local enhancement..."
        );
        const localEnhanced = enhancePromptLocally(inputPrompt.trim());
        if (localEnhanced && localEnhanced !== inputPrompt.trim()) {
          setEnhancedPrompt(localEnhanced);
          setInputPrompt(localEnhanced);
        } else {
          throw new Error("Unable to enhance the prompt effectively");
        }
      }
    } catch (error) {
      console.error("Error enhancing prompt:", error);

      // Try a simple local enhancement as fallback if not already attempted
      if (!error.message.includes("Unable to enhance")) {
        try {
          const localEnhanced = enhancePromptLocally(inputPrompt.trim());
          if (localEnhanced && localEnhanced !== inputPrompt.trim()) {
            setEnhancedPrompt(localEnhanced);
            setInputPrompt(localEnhanced);
            alert(
              "AI enhancement failed, applied basic improvements instead. Try generating!"
            );
            return;
          }
        } catch (localError) {
          console.error("Local enhancement also failed:", localError);
        }
      }

      // Provide more specific error messages
      let errorMessage = "Error enhancing prompt: ";
      if (
        error.message.includes("HTML error page") ||
        error.message.includes("Both API endpoints")
      ) {
        errorMessage +=
          "AI service is temporarily unavailable. Please try a shorter or simpler prompt.";
      } else if (error.message.includes("Invalid response format")) {
        errorMessage +=
          "Received invalid response. Please try rephrasing your prompt.";
      } else if (error.message.includes("Unable to enhance")) {
        errorMessage +=
          "Your prompt may already be well-detailed. Try generating as-is or rephrase it.";
      } else if (error.message.includes("HTTP error")) {
        errorMessage +=
          "Connection issue with AI service. Please try again in a moment.";
      } else {
        errorMessage += "Please try again with a different prompt.";
      }

      alert(errorMessage);
    } finally {
      setIsEnhancing(false);
    }
  };

  // Simple local enhancement fallback
  const enhancePromptLocally = (prompt) => {
    if (!prompt || prompt.length < 3) return prompt;

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

    // Only add if the prompt doesn't already have these elements
    if (!lowerPrompt.includes("detailed") && !lowerPrompt.includes("detail")) {
      enhanced += ", highly detailed";
    }
    if (
      !lowerPrompt.includes("cinematic") &&
      !lowerPrompt.includes("lighting") &&
      !lowerPrompt.includes("light")
    ) {
      enhanced += ", cinematic lighting";
    }
    if (
      !lowerPrompt.includes("quality") &&
      !lowerPrompt.includes("professional") &&
      !lowerPrompt.includes("8k") &&
      !lowerPrompt.includes("resolution")
    ) {
      enhanced += ", professional quality";
    }
    if (
      !lowerPrompt.includes("composition") &&
      !lowerPrompt.includes("artistic")
    ) {
      enhanced += ", artistic composition";
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
          <ThemeToggleButton 
            isDarkMode={isDarkMode}
            onThemeChange={handleThemeChange}
          />
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h2 className="hero-title">Create Stunning Images with AI</h2>
          <p className="hero-subtitle">
            <TypewriterEffect />
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="main-content">
        <div className="container">
          {/* Tab Navigation */}
          <TabNavigation
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            historyCount={history.length}
          />

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === "generate" && (
              <GenerateTab
                key="generate"
                inputPrompt={inputPrompt}
                setInputPrompt={setInputPrompt}
                imageUrl={imageUrl}
                isLoading={isLoading}
                imageLoaded={imageLoaded}
                error={error}
                progress={progress}
                selectedModel={selectedModel}
                setSelectedModel={setSelectedModel}
                selectedShape={selectedShape}
                setSelectedShape={setSelectedShape}
                seed={seed}
                setSeed={setSeed}
                removeWatermark={removeWatermark}
                setRemoveWatermark={setRemoveWatermark}
                width={width}
                height={height}
                setWidth={setWidth}
                setHeight={setHeight}
                shapes={shapes}
                models={models}
                examplePrompts={examplePrompts}
                handleGenerateClick={handleGenerateClick}
                handleImageLoadComplete={handleImageLoadComplete}
                handleImageLoadError={handleImageLoadError}
                handleExampleClick={handleExampleClick}
                handleConfusedClick={handleConfusedClick}
                handleGenerateRandomPrompt={handleGenerateRandomPrompt}
                isGeneratingRandom={isGeneratingRandom}
              />
            )}

            {activeTab === "enhance" && (
              <EnhanceTab
                key="enhance"
                inputPrompt={inputPrompt}
                setInputPrompt={setInputPrompt}
                isEnhancing={isEnhancing}
                handleEnhancePrompt={handleEnhancePrompt}
              />
            )}

            {activeTab === "history" && (
              <HistoryTab
                key="history"
                history={history}
                setInputPrompt={setInputPrompt}
                setActiveTab={setActiveTab}
                handleDeleteHistoryItem={handleDeleteHistoryItem}
                handleClearAllHistory={handleClearAllHistory}
              />
            )}
          </div>
        </div>
      </main>

      {/* Text Scroll Section */}
      <section className="text-scroll-section py-20">
        <div className="w-full">
          <div className="text-black dark:text-white">
            <TextScroll
              className="font-display text-center text-4xl font-semibold tracking-tighter md:text-7xl md:leading-[5rem] w-full [&>*>*>span]:!text-current [&_span]:!text-current"
              text="Generate • Enhance • Transform • Create • Inspire • "
              default_velocity={2}
            />
          </div>
        </div>
      </section>

      {/* Contact Me Section - Just above footer */}
      <section className="contact-section">
        <div className="container">
          <SocialLinks />
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
