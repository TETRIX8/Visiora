import React, { useState } from "react";
import CardSwipe from "./card-swipe";
import "./category-cards.css";

// Import images
// Anime images
import anime1 from "../../assets/example_images/Anime/1.jpg";
import anime2 from "../../assets/example_images/Anime/2.jpg";
import anime3 from "../../assets/example_images/Anime/3.jpg";
import anime4 from "../../assets/example_images/Anime/4.jpg";

// Nature images
import nature1 from "../../assets/example_images/Nature/1.jpg";
import nature2 from "../../assets/example_images/Nature/2.jpg";
import nature3 from "../../assets/example_images/Nature/3.jpg";
import nature4 from "../../assets/example_images/Nature/4.jpg";

// Space images
import space1 from "../../assets/example_images/Space/1.jpg";
import space2 from "../../assets/example_images/Space/2.jpg";
import space3 from "../../assets/example_images/Space/3.jpg";
import space4 from "../../assets/example_images/Space/4.jpg";

// Streets images
import streets1 from "../../assets/example_images/Streets/1.jpg";
import streets2 from "../../assets/example_images/Streets/2.jpg";
import streets3 from "../../assets/example_images/Streets/3.jpg";
import streets4 from "../../assets/example_images/Streets/4.jpg";

// Ghibli-Pixar images
import ghibli1 from "../../assets/example_images/Ghibli-Pixar/1.jpg";
import ghibli2 from "../../assets/example_images/Ghibli-Pixar/2.jpg";
import ghibli3 from "../../assets/example_images/Ghibli-Pixar/3.jpg";
import ghibli4 from "../../assets/example_images/Ghibli-Pixar/4.jpg";

// Miscellaneous images
import misc1 from "../../assets/example_images/Misc/1.jpg";
import misc2 from "../../assets/example_images/Misc/2.jpg";
import misc3 from "../../assets/example_images/Misc/3.jpg";
import misc4 from "../../assets/example_images/Misc/4.jpg";

const CategoryCards = ({ onPromptSelect }) => {
  const [currentPrompts, setCurrentPrompts] = useState({});

  const categories = [
    {
      id: "anime",
      title: "Anime",
      emoji: "🎌",
      images: [
        { src: anime1, alt: "Anime Style 1" },
        { src: anime2, alt: "Anime Style 2" },
        { src: anime3, alt: "Anime Style 3" },
        { src: anime4, alt: "Anime Style 4" },
      ],
      prompts: [
        "Anime-style pirate girl with wind-swept coat standing on the bow of a ship soaring over giant waves, colorful sky with drifting clouds and soaring seagulls, steampunk-inspired goggles on her head, treasure map in one hand, confident smirk on her face, uniquely designed crew flag fluttering behind, stylized ship with fantastical elements like rotating propellers and wooden dragon carvings, vivid cel-shaded coloring, dynamic angle, 4K anime cinematic quality",
        "Epic anime-style samurai duel on a misty mountain cliff at sunset, fiery sky in the background, cherry blossom petals flying, both warriors with torn haori and glowing swords, high-speed motion lines, cinematic composition, rich traditional Japanese color palette, 8K stylized anime painting",
        "Anime-style cozy indoor scene of a girl sitting by the window sipping tea, raindrops on the glass, soft ambient light, bookshelf in the background, cat sleeping nearby, warm color tones, gentle expression, aesthetic Ghibli-style art, ultra-detailed, 4K resolution",
        "Anime-style magical girl in a ruined city, glowing magical circle beneath her feet, shattered buildings in the background, floating embers, scarred face and broken wand, duality of innocence and power, dark clouds above, cinematic angle, moody lighting, stylized in detailed anime art",
      ],
    },
    {
      id: "nature",
      title: "Nature",
      emoji: "🌿",
      images: [
        { src: nature1, alt: "Nature 1" },
        { src: nature2, alt: "Nature 2" },
        { src: nature3, alt: "Nature 3" },
        { src: nature4, alt: "Nature 4" },
      ],
      prompts: [
        "A serene forest with dew-covered grass, golden morning sunlight piercing through tall trees, photorealistic textures, soft mist, birds in flight, 8K natural scenery",
        "Massive floating islands covered with lush green forests and cascading waterfalls, connected by glowing vines, warm sky tones, fantasy artwork, painterly style, high detail",
        "A moody cinematic scene of storm clouds rolling over a rugged mountain valley, with lightning strikes and wind-blown trees, epic lighting, dramatic realism, 4K scene composition",
        "A peaceful Japanese Zen garden with white gravel patterns, bonsai trees, a small wooden bridge over a koi pond, minimalist art style with soft pastel tones and clean aesthetic",
      ],
    },
    {
      id: "space",
      title: "Space",
      emoji: "🚀",
      images: [
        { src: space1, alt: "Space 1" },
        { src: space2, alt: "Space 2" },
        { src: space3, alt: "Space 3" },
        { src: space4, alt: "Space 4" },
      ],
      prompts: [
        "A lone astronaut standing under a violet sky, strange glowing rocks surrounding them, twin moons in the background, detailed sci-fi concept art, cinematic lighting",
        "Looking out from a futuristic space station window at a massive spiral galaxy, glowing star systems, 3D rendered, high contrast and clarity, sci-fi ambience",
        "A surreal floating garden in space, with plants growing in zero gravity, stars shimmering all around, painterly fantasy style, dreamlike and vibrant, concept design aesthetic",
        "A spacecraft being pulled into a wormhole, intense color distortion, glowing particles, bending light physics, ultra-detailed visualization in science-illustration style",
      ],
    },
    {
      id: "streets",
      title: "Streets",
      emoji: "🏙️",
      images: [
        { src: streets1, alt: "Streets 1" },
        { src: streets2, alt: "Streets 2" },
        { src: streets3, alt: "Streets 3" },
        { src: streets4, alt: "Streets 4" },
      ],
      prompts: [
        "A neon-lit street with holographic ads, flying cars above, people in glowing techwear, reflections on wet asphalt, Blade Runner vibes, ultra-detailed cyberpunk concept art",
        "Old cobblestone street in Paris during rain, people with umbrellas, warm shop lights reflecting off wet pavement, photorealistic lighting, cozy and cinematic mood",
        "Busy street in 1980s Manhattan, yellow cabs, neon signs, vintage billboards, grainy photo style, rich in retro detail",
        "A quiet urban alley lit by a golden sunset, long shadows, dust particles in the air, strong depth and lighting, DSLR photography look, cinematic framing",
      ],
    },
    {
      id: "ghibli",
      title: "Ghibli/Pixar",
      emoji: "🎥",
      images: [
        { src: ghibli1, alt: "Ghibli 1" },
        { src: ghibli2, alt: "Ghibli 2" },
        { src: ghibli3, alt: "Ghibli 3" },
        { src: ghibli4, alt: "Ghibli 4" },
      ],
      prompts: [
        "A cozy rural village with windmills, green hills, and warm sunlight, stylized painterly textures, whimsical Ghibli charm, clouds drifting in a blue sky, animated vibe",
        "A cute, round robot with expressive digital eyes, rolling through a futuristic lab, 3D Pixar-style rendering, bright color palette, stylized metallic textures",
        "A magical bakery floating on a cloud, smoke puffing from its chimney, flying pastries around, pastel color scheme, Ghibli-Pixar fusion, fantasy 3D cartoon look",
        "A young explorer sailing a colorful boat across calm cartoon oceans, stylized waves and sky, expressive character design, Pixar short-film quality",
      ],
    },
    
    {
      id: "misc",
      title: "Misc",
      emoji: "✨",
      images: [
        { src: misc1, alt: "Misc 1" },
        { src: misc2, alt: "Misc 2" },
        { src: misc3, alt: "Misc 3" },
        { src: misc4, alt: "Misc 4" },
      ],
      prompts: [
        "Abstract digital art with flowing geometric patterns, gradient colors from blue to purple, modern minimalist design, geometric shapes and lines, clean aesthetic",
        "Retro synthwave aesthetic with neon grids, purple and pink gradients, vintage 80s vibes, glowing geometric shapes, nostalgic digital art style",
        "Watercolor painting of floating paper boats on calm water, soft pastel colors, dreamy atmosphere, artistic brush strokes, peaceful mood",
        "Surreal landscape with floating islands and impossible architecture, dreamlike quality, vibrant colors, fantasy art style, imaginative composition",
      ],
    },
  ];

  const handleCardClick = (category, imageIndex) => {
    if (onPromptSelect) {
      onPromptSelect(category.prompts[imageIndex]);
    }
  };

  const handleImageChange = (categoryId, imageIndex) => {
    setCurrentPrompts((prev) => ({
      ...prev,
      [categoryId]: imageIndex,
    }));
  };

  const getCurrentPrompt = (category) => {
    const currentIndex = currentPrompts[category.id] || 0;
    return category.prompts[currentIndex];
  };

  const truncatePrompt = (prompt, maxLength = 120) => {
    if (prompt.length <= maxLength) return prompt;
    return prompt.substring(0, maxLength) + "...";
  };

  return (
    <div className="category-cards-container">
      <div className="category-cards-header">
        <span className="section-icon">✨</span>
        <h3>Example Prompts</h3>
      </div>

      <div className="category-cards-grid">
        {categories.map((category) => (
          <div key={category.id} className="category-card">
            <div className="category-card-header">
              <span className="category-emoji">{category.emoji}</span>
              <h4 className="category-title">{category.title}</h4>
            </div>

            <div className="category-card-swipe">
              <CardSwipe
                images={category.images}
                autoplayDelay={4000 + categories.indexOf(category) * 500}
                slideShadows={true}
                showDots={true}
                showArrows={true}
                className="category-swipe"
                onImageClick={(imageIndex) =>
                  handleCardClick(category, imageIndex)
                }
                onSlideChange={(imageIndex) =>
                  handleImageChange(category.id, imageIndex)
                }
              />
            </div>

            <div className="category-prompt-section">
              <div className="current-prompt">
                <p className="prompt-text">
                  "{truncatePrompt(getCurrentPrompt(category))}"
                </p>
                <button
                  className="try-prompt-btn"
                  onClick={() =>
                    handleCardClick(category, currentPrompts[category.id] || 0)
                  }
                >
                  ✨ Try This Prompt
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryCards;
