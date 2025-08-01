// src/App.jsx
import React, { useState, useEffect, Suspense, lazy, useCallback, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import { generateRandomPrompt } from "./api/pollinationService";
import useTheme from "./hooks/useTheme";
import useLocalStorage from "./hooks/useLocalStorage";

// Layout Components
import AnimatedBackground from "./components/layout/AnimatedBackground";
import Header from "./components/layout/Header";
import Hero from "./components/layout/Hero";
import Footer from "./components/layout/Footer";

// Tab Components
import ModernTabNavigation from "./components/tabs/ModernTabNavigation";
import ModernGenerateTab from "./components/tabs/ModernGenerateTab";

// Lazy load less critical components for better performance
const ModernEnhanceTab = lazy(() => import("./components/tabs/ModernEnhanceTab"));
const ModernHistoryTab = lazy(() => import("./components/tabs/ModernHistoryTab"));

// Loading component with better styling
const TabLoader = React.memo(() => (
  <div className="flex items-center justify-center h-64">
    <div className="space-y-4 text-center">
      <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto" />
      <p className="text-white/60 text-sm">Loading...</p>
    </div>
  </div>
));

TabLoader.displayName = 'TabLoader';

function App() {
  // State management with better initial values
  const [inputPrompt, setInputPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState("generate");

  // Generation settings
  const [selectedModel, setSelectedModel] = useState("flux");
  const [selectedShape, setSelectedShape] = useState("landscape");
  const [seed, setSeed] = useState("");
  const [removeWatermark, setRemoveWatermark] = useState(false);
  const [width, setWidth] = useState(1024);
  const [height, setHeight] = useState(1024);

  // Enhancement state
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isGeneratingRandom, setIsGeneratingRandom] = useState(false);

  // Theme management
  const { isDarkMode, setTheme } = useTheme();

  // Use custom localStorage hook for better performance
  const [history, setHistory, clearHistory] = useLocalStorage("visiora-history", []);

  // Memoized configuration objects for better performance
  const shapes = useMemo(() => ({
    landscape: { width: 1344, height: 768, label: "Landscape (16:9)" },
    portrait: { width: 768, height: 1344, label: "Portrait (9:16)" },
    square: { width: 1024, height: 1024, label: "Square (1:1)" },
    wide: { width: 1536, height: 640, label: "Wide (21:9)" },
    story: { width: 576, height: 1024, label: "Story (9:16)" },
    manual: { width: 1024, height: 1024, label: "Manual" },
  }), []);

  const models = useMemo(() => ([
    { value: "flux", label: "Flux (Best Quality)" },
    { value: "turbo", label: "Turbo (Fastest)" },
    { value: "kontext", label: "Kontext (Artistic)" },
  ]), []);

  // Memoized progress simulation
  const simulateProgress = useCallback(() => {
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
  }, []);

  // Optimized image generation handler
  const handleGenerateClick = useCallback(async () => {
    if (!inputPrompt.trim()) {
      alert("Please enter a prompt!");
      return;
    }

    setIsLoading(true);
    setError(null);
    setImageLoaded(false);

    const progressInterval = simulateProgress();

    try {
      const encodedPrompt = encodeURIComponent(inputPrompt.trim());

      // Determine dimensions
      let finalWidth, finalHeight;
      if (selectedShape === "manual") {
        finalWidth = width;
        finalHeight = height;
      } else {
        const shapeRatio = shapes[selectedShape];
        finalWidth = shapeRatio.width;
        finalHeight = shapeRatio.height;
      }

      const finalSeed = seed || Math.floor(Math.random() * 1000);

      // Build API URL
      let apiUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${finalWidth}&height=${finalHeight}&model=${selectedModel}&enhance=true&seed=${finalSeed}`;

      if (removeWatermark) {
        apiUrl += "&nologo=true";
      }

      console.log("API URL:", apiUrl);

      setImageUrl(apiUrl);
      setProgress(100);

      // Add to history
      const historyItem = {
        id: Date.now(),
        prompt: inputPrompt.trim(),
        imageUrl: apiUrl,
        timestamp: new Date().toLocaleString(),
        model: selectedModel,
        shape: selectedShape,
        dimensions: `${finalWidth}x${finalHeight}`,
      };
      setHistory((prev) => [historyItem, ...prev.slice(0, 9)]);

      clearInterval(progressInterval);

      // Timeout fallback
      const timeoutId = setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 8000);

      window.imageLoadTimeout = timeoutId;
    } catch (err) {
      console.error("Error generating image:", err);
      setError(err.message);
      setIsLoading(false);
      setImageLoaded(false);
      setProgress(0);
      clearInterval(progressInterval);
    }
  }, [inputPrompt, selectedModel, selectedShape, seed, removeWatermark, width, height, shapes, simulateProgress, setHistory]);

  // Optimized image load handlers
  const handleImageLoadComplete = useCallback(() => {
    setImageLoaded(true);
    setIsLoading(false);
    setProgress(0);
    if (window.imageLoadTimeout) {
      clearTimeout(window.imageLoadTimeout);
      window.imageLoadTimeout = null;
    }
  }, []);

  const handleImageLoadError = useCallback(() => {
    setError("Failed to load the generated image");
    setIsLoading(false);
    setImageLoaded(false);
    setProgress(0);
    if (window.imageLoadTimeout) {
      clearTimeout(window.imageLoadTimeout);
      window.imageLoadTimeout = null;
    }
  }, []);

  // Optimized random prompt handlers
  const handleConfusedClick = useCallback(() => {
    const examplePrompts = [
      "A majestic dragon soaring through storm clouds, lightning illuminating its scales, cinematic lighting, ultra detailed",
      "A futuristic cyberpunk city at night, neon lights reflecting in rain-soaked streets, atmospheric fog, hyper realistic",
      "An enchanted forest with glowing mushrooms, fairy lights dancing between ancient trees, magical atmosphere, fantasy art",
      "A space station orbiting a distant planet, stars twinkling in the background, sci-fi concept art, highly detailed",
      "A cozy coffee shop in autumn, warm lighting, people reading books, rain on windows, peaceful atmosphere"
    ];
    const randomPrompt = examplePrompts[Math.floor(Math.random() * examplePrompts.length)];
    setInputPrompt(randomPrompt);
  }, []);

  const handleGenerateRandomPrompt = useCallback(async (category = "") => {
    setIsGeneratingRandom(true);
    try {
      const randomPrompt = await generateRandomPrompt(category);
      setInputPrompt(randomPrompt);
    } catch (error) {
      console.error("Error generating random prompt:", error);
      handleConfusedClick(); // Fallback to local random
    } finally {
      setIsGeneratingRandom(false);
    }
  }, [handleConfusedClick]);

  // Enhanced prompt handler with better error handling
  const handleEnhancePrompt = useCallback(async () => {
    if (!inputPrompt.trim()) {
      alert("Please enter a prompt first!");
      return;
    }

    setIsEnhancing(true);
    try {
      const system = "You are a professional prompt engineer for generative AI images. Given a users base idea, elaborate and enhance the prompt by preserving the original subject and context, adding vivid artistic details, improving clarity, storytelling, and immersion, including realistic textures, dynamic lighting, depth, and color harmony, specifying atmosphere and composition style, and ensuring final output is suitable for 8K ultra-high-resolution rendering. Output only the enhanced prompt as plain text.";
      
      let url = `https://text.pollinations.ai/${encodeURIComponent(system + ": " + inputPrompt.trim())}`;
      
      let response = await fetch(url);
      let responseText = await response.text();
      
      if (!response.ok || responseText.trim().toLowerCase().startsWith("<!doctype")) {
        throw new Error("Enhancement service unavailable");
      }

      // Parse response
      let enhancedText = "";
      try {
        const data = JSON.parse(responseText);
        enhancedText = data.response || data.text || data.content || responseText;
      } catch {
        enhancedText = responseText.trim();
      }

      if (enhancedText && enhancedText.length > 15 && enhancedText !== inputPrompt.trim()) {
        setInputPrompt(enhancedText);
      } else {
        throw new Error("Unable to enhance prompt");
      }
    } catch (error) {
      console.error("Error enhancing prompt:", error);
      alert("Enhancement failed. Please try again with a different prompt.");
    } finally {
      setIsEnhancing(false);
    }
  }, [inputPrompt]);

  // Optimized history handlers
  const handleHistoryItemClick = useCallback((historyItem) => {
    setInputPrompt(historyItem.prompt);
    setImageUrl(historyItem.imageUrl);
    setActiveTab("generate");
  }, []);

  const handleDeleteHistoryItem = useCallback((itemId, event) => {
    event?.stopPropagation();
    setHistory(prev => prev.filter((item) => item.id !== itemId));
  }, [setHistory]);

  const handleClearAllHistory = useCallback(() => {
    clearHistory();
  }, [clearHistory]);

  // Memoized tab content renderer for better performance
  const renderTabContent = useMemo(() => {
    switch (activeTab) {
      case "generate":
        return (
          <ModernGenerateTab
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
            handleGenerateClick={handleGenerateClick}
            handleImageLoadComplete={handleImageLoadComplete}
            handleImageLoadError={handleImageLoadError}
            handleConfusedClick={handleConfusedClick}
            handleGenerateRandomPrompt={handleGenerateRandomPrompt}
            isGeneratingRandom={isGeneratingRandom}
          />
        );
      case "enhance":
        return (
          <Suspense fallback={<TabLoader />}>
            <ModernEnhanceTab
              inputPrompt={inputPrompt}
              setInputPrompt={setInputPrompt}
              isEnhancing={isEnhancing}
              handleEnhancePrompt={handleEnhancePrompt}
            />
          </Suspense>
        );
      case "history":
        return (
          <Suspense fallback={<TabLoader />}>
            <ModernHistoryTab
              history={history}
              setInputPrompt={setInputPrompt}
              setActiveTab={setActiveTab}
              handleDeleteHistoryItem={handleDeleteHistoryItem}
              handleClearAllHistory={handleClearAllHistory}
            />
          </Suspense>
        );
      default:
        return null;
    }
  }, [
    activeTab, inputPrompt, imageUrl, isLoading, imageLoaded, error, progress,
    selectedModel, selectedShape, seed, removeWatermark, width, height,
    shapes, models, history, isEnhancing, isGeneratingRandom,
    handleGenerateClick, handleImageLoadComplete, handleImageLoadError,
    handleConfusedClick, handleGenerateRandomPrompt, handleEnhancePrompt,
    handleDeleteHistoryItem, handleClearAllHistory
  ]);

  return (
    <div className="min-h-screen bg-slate-900 text-white font-display">
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Header */}
      <Header isDarkMode={isDarkMode} onThemeChange={setTheme} />

      {/* Hero Section */}
      <Hero />

      {/* Main Content */}
      <main className="relative z-10 pb-20">
        <div className="container mx-auto px-6">
          {/* Tab Navigation */}
          <div className="flex justify-center mb-12">
            <ModernTabNavigation
              activeTab={activeTab}
              onTabChange={setActiveTab}
              historyCount={history.length}
            />
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <div key={activeTab} className="w-full">
              {renderTabContent}
            </div>
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default React.memo(App);