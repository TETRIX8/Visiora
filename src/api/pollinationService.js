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

/**
 * Generate a random creative prompt using Pollination AI
 * @param {string} category - Optional category like 'portrait', 'landscape', 'fantasy', etc.
 * @returns {Promise<string>} - The generated random prompt
 */
export const generateRandomPrompt = async (category = "") => {
  try {
    const promptCategories = [
      "portrait photography",
      "landscape photography",
      "fantasy artwork",
      "sci-fi scenes",
      "anime",
      "architectural photography",
      "abstract art",
      "nature photography",
      "urban street photography",
      "digital art",
    ];

    const selectedCategory =
      category ||
      promptCategories[Math.floor(Math.random() * promptCategories.length)];

    const system = `You are an expert prompt engineer. Your task is to generate a unique, creative, and visually descriptive image prompt for the category: ${selectedCategory}. Vary the subject, setting, and artistic elements every time. The prompt must include vivid details about:
- Subject appearance or action
- Environment and background
- Lighting and shadows
- Composition and camera angle
- Mood or emotion
- Style (e.g., digital art, anime, realism, surreal, etc.)
The output should be coherent, AI-friendly, and formatted as a single sentence without any quotes or explanations.`;

    const seed = Math.floor(Math.random() * 10000) + 1;

    let url = `https://text.pollinations.ai/${encodeURIComponent(
      system
    )}?seed=${seed}`;

    let response = await fetch(url);
    let responseText = await response.text();

    // If response is HTML error page, fallback
    if (
      responseText.toLowerCase().startsWith("<!doctype") ||
      responseText.toLowerCase().startsWith("<html")
    ) {
      url = `https://text.pollinations.ai/${encodeURIComponent(
        `Create a random creative image prompt for ${selectedCategory} with detailed visual elements`
      )}`;
      response = await fetch(url);
      responseText = await response.text();

      if (
        responseText.toLowerCase().startsWith("<!doctype") ||
        responseText.toLowerCase().startsWith("<html")
      ) {
        return getLocalRandomPrompt(selectedCategory); // ultimate fallback
      }
    }

    // Try to parse JSON if returned
    try {
      const parsed = JSON.parse(responseText);
      const generated = parsed.response || parsed.text || parsed.content;
      if (generated && generated.trim().length > 20) return generated.trim();
    } catch {
      if (
        responseText &&
        responseText.trim().length > 20 &&
        !responseText.includes("<html")
      ) {
        return responseText.trim(); // plain text fallback
      }
    }

    return getLocalRandomPrompt(selectedCategory); // last fallback
  } catch (err) {
    console.error("Prompt generation error:", err);
    return getLocalRandomPrompt(category); // final fallback
  }
};


/**
 * Local fallback function for generating random prompts
 * @param {string} category - The category for the prompt
 * @returns {string} - A locally generated random prompt
 */
const getLocalRandomPrompt = (category) => {
  const localPrompts = {
    "portrait photography": [
      "Professional headshot of a confident businesswoman with warm lighting, shallow depth of field, studio backdrop",
      "Artistic portrait of an elderly man with weathered hands, dramatic side lighting, black and white photography",
      "Close-up portrait of a young artist with paint-stained fingers, natural window light, creative studio setting",
      "Environmental portrait of a chef in a busy kitchen, warm ambient lighting, candid moment captured",
    ],
    "landscape photography": [
      "Majestic mountain range at sunrise with golden hour lighting, misty valleys, dramatic cloud formations",
      "Serene lake reflection with autumn foliage, mirror-like water surface, soft morning light",
      "Dramatic seascape with crashing waves against rocky cliffs, stormy sky, long exposure technique",
      "Desert landscape with sand dunes and star-filled night sky, milky way visible, moon illumination",
    ],
    "fantasy artwork": [
      "Mystical forest with glowing mushrooms and fairy lights, ethereal atmosphere, magical creatures hidden in shadows",
      "Ancient dragon perched on crystal cave entrance, epic scale, dramatic lighting, treasure scattered below",
      "Floating islands connected by rainbow bridges, waterfalls cascading into clouds, fantastical architecture",
      "Enchanted library with books floating in air, magical glowing orbs, wizard studying ancient scrolls",
    ],
    "sci-fi scenes": [
      "Futuristic cityscape with flying cars and neon lights, cyberpunk aesthetic, rainy night atmosphere",
      "Space station orbiting alien planet with multiple moons, cosmic nebula in background, sleek architecture",
      "Robot companion in post-apocalyptic wasteland, overgrown ruins, dramatic sunset lighting",
      "Underwater research facility with bioluminescent sea creatures, glass domes, blue-green lighting",
    ],
    "anime characters": [
      "Determined anime warrior with flowing cape on mountain peak, dynamic wind effects, sunset backdrop",
      "Cute anime schoolgirl with magical powers, cherry blossom petals floating, soft pink lighting",
      "Mysterious anime ninja in bamboo forest, moonlight filtering through leaves, action pose",
      "Cheerful anime chef in colorful kitchen, steam rising from delicious food, warm lighting",
    ],
  };

  const fallbackPrompts = [
    "Beautiful artistic composition with dramatic lighting and vibrant colors, highly detailed, professional quality",
    "Stunning visual scene with perfect composition, golden hour lighting, cinematic atmosphere",
    "Creative artistic masterpiece with rich textures and dynamic lighting, award-winning photography",
    "Breathtaking scene with amazing details, soft lighting, dreamy atmosphere, professional artistry",
  ];

  const categoryPrompts = localPrompts[category] || fallbackPrompts;
  return categoryPrompts[Math.floor(Math.random() * categoryPrompts.length)];
};
