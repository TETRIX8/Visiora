// src/components/examples/ExamplePromptGrid.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Copy, Sparkles } from 'lucide-react';
import { useSwipeable } from 'react-swipeable';

const ExamplePromptGrid = ({ onPromptSelect }) => {
  const categories = [
    {
      id: 'anime',
      title: 'Anime & Manga',
      emoji: '🎌',
      gradient: 'from-pink-500 to-red-500',
      images: [
        { 
          url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&crop=faces', 
          prompt: 'Beautiful anime girl with long flowing blue hair, glowing purple eyes, wearing a futuristic kimono, cherry blossoms falling, soft lighting, studio ghibli style, highly detailed' 
        },
        { 
          url: 'https://images.unsplash.com/photo-1534126416832-7d5ce6a9a79c?w=400&h=400&fit=crop', 
          prompt: 'Epic samurai warrior in traditional armor, katana sword gleaming, standing on mountain peak, dramatic sunset, anime art style, dynamic pose' 
        },
        { 
          url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&crop=center', 
          prompt: 'Magical girl transformation sequence, sparkles and light effects, flowing dress, pastel colors, manga style illustration' 
        },
        { 
          url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=400&fit=crop', 
          prompt: 'Dragon flying over ancient Japanese temple, cherry blossoms, misty mountains, anime landscape, vibrant colors' 
        }
      ]
    },
    {
      id: 'nature',
      title: 'Nature & Landscapes',
      emoji: '🌲',
      gradient: 'from-green-500 to-emerald-500',
      images: [
        { 
          url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop', 
          prompt: 'Majestic mountain peak covered in snow, golden hour lighting, misty clouds, epic landscape photography, ultra detailed, 8K resolution' 
        },
        { 
          url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop', 
          prompt: 'Enchanted forest with glowing mushrooms, fairy lights dancing between ancient trees, magical atmosphere, fantasy landscape' 
        },
        { 
          url: 'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=400&h=400&fit=crop', 
          prompt: 'Crystal clear mountain lake reflecting starry night sky, aurora borealis, peaceful serene landscape, long exposure photography' 
        },
        { 
          url: 'https://images.unsplash.com/photo-1464822759844-d150ad6e4977?w=400&h=400&fit=crop', 
          prompt: 'Tropical waterfall cascading into turquoise pool, lush vegetation, paradise setting, natural lighting' 
        }
      ]
    },
    {
      id: 'cyberpunk',
      title: 'Cyberpunk & Sci-Fi',
      emoji: '🤖',
      gradient: 'from-cyan-500 to-blue-500',
      images: [
        { 
          url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop', 
          prompt: 'Neon-lit cyberpunk alley at night, rain-soaked streets, holographic advertisements, futuristic cityscape, blade runner aesthetic' 
        },
        { 
          url: 'https://images.unsplash.com/photo-1551033406-611cf9a28f67?w=400&h=400&fit=crop', 
          prompt: 'Humanoid robot bartender in futuristic neon bar, chrome details, atmospheric lighting, cyberpunk style' 
        },
        { 
          url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop&crop=center', 
          prompt: 'Floating holographic interface with data streams, digital particles, sci-fi technology, blue and purple neon colors' 
        },
        { 
          url: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=400&fit=crop', 
          prompt: 'Massive space station orbiting Earth, detailed architecture, stars and nebula background, sci-fi concept art' 
        }
      ]
    },
    {
      id: 'fantasy',
      title: 'Fantasy & Magic',
      emoji: '🧙‍♂️',
      gradient: 'from-purple-500 to-indigo-500',
      images: [
        { 
          url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&crop=top', 
          prompt: 'Powerful wizard casting spell in ancient tower, magical energy swirling, glowing runes, fantasy art, dramatic lighting' 
        },
        { 
          url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=400&fit=crop', 
          prompt: 'Majestic dragon guarding treasure hoard in dark cave, gold coins, magical gems, epic fantasy scene' 
        },
        { 
          url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&crop=entropy', 
          prompt: 'Elven archer in moonlit enchanted forest, silver bow, flowing cloak, mystical atmosphere, fantasy portrait' 
        },
        { 
          url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop&crop=top', 
          prompt: 'Floating magical city in the clouds, castle spires, rainbow bridges, fantasy landscape, ethereal lighting' 
        }
      ]
    },
    {
      id: 'portrait',
      title: 'Portrait & People',
      emoji: '👤',
      gradient: 'from-orange-500 to-red-500',
      images: [
        { 
          url: 'https://images.unsplash.com/photo-1494790108755-2616c41e3552?w=400&h=400&fit=crop&crop=faces', 
          prompt: 'Professional business portrait, soft studio lighting, shallow depth of field, confident expression, high-end photography' 
        },
        { 
          url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=faces', 
          prompt: 'Vintage portrait in sepia tones, classic 1920s style, elegant clothing, artistic lighting, timeless beauty' 
        },
        { 
          url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=faces', 
          prompt: 'Artistic black and white portrait, dramatic shadows, emotional expression, fine art photography' 
        },
        { 
          url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=faces', 
          prompt: 'Cinematic portrait with dramatic lighting, chiaroscuro effect, professional headshot, moody atmosphere' 
        }
      ]
    },
    {
      id: 'abstract',
      title: 'Abstract & Artistic',
      emoji: '🎨',
      gradient: 'from-yellow-500 to-pink-500',
      images: [
        { 
          url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop', 
          prompt: 'Colorful fluid abstract composition, paint swirls, vibrant colors blending, artistic texture, modern art style' 
        },
        { 
          url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=400&fit=crop', 
          prompt: 'Geometric patterns in neon colors, mathematical precision, digital art, futuristic design, symmetrical composition' 
        },
        { 
          url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop&crop=entropy', 
          prompt: 'Dreamy watercolor landscape, soft pastels, flowing brushstrokes, impressionist style, ethereal atmosphere' 
        },
        { 
          url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop&crop=edges', 
          prompt: 'Digital glitch art aesthetic, corrupted pixels, cyberpunk colors, modern digital art, experimental style' 
        }
      ]
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-10 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-1/4 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-200/50 dark:bg-white/10 border border-slate-300/50 dark:border-white/20 backdrop-blur-md text-sm text-slate-700 dark:text-white/80 mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Get Inspired</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            Example Prompts
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">
            Discover amazing prompts across different categories. Click on any image to use its prompt and start creating.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {categories.map((category, index) => (
            <CategoryCard
              key={category.id}
              category={category}
              onPromptSelect={onPromptSelect}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const CategoryCard = ({ category, onPromptSelect, delay }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + newDirection;
      if (nextIndex >= category.images.length) return 0;
      if (nextIndex < 0) return category.images.length - 1;
      return nextIndex;
    });
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => paginate(1),
    onSwipedRight: () => paginate(-1),
    trackMouse: true,
    preventScrollOnSwipe: true
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="group relative bg-white/5 dark:bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-300 hover:scale-105"
      whileHover={{ y: -5 }}
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-300/30 dark:border-white/10">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${category.gradient} flex items-center justify-center text-xl shadow-lg`}>
            {category.emoji}
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-white">{category.title}</h3>
            <p className="text-xs text-slate-600 dark:text-white/60">{category.images.length} examples</p>
          </div>
        </div>
      </div>

      {/* Image Carousel */}
      <div className="relative h-56 overflow-hidden" {...swipeHandlers}>
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
              scale: { duration: 0.2 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);

              if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
              }
            }}
            className="absolute inset-0 cursor-pointer"
            onClick={() => onPromptSelect(category.images[currentIndex].prompt)}
          >
            <img
              src={category.images[currentIndex].url}
              alt={category.images[currentIndex].prompt}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            
            {/* Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-t ${category.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
            
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileHover={{ scale: 1, opacity: 1 }}
                className="text-center text-slate-800 dark:text-white p-4"
              >
                <Copy className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm font-medium">Click to use prompt</p>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            paginate(-1);
          }}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/70 hover:scale-110"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            paginate(1);
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/70 hover:scale-110"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Prompt Text & Controls */}
      <div className="p-4 space-y-3">
        <p className="text-sm text-gray-300 line-clamp-2 leading-relaxed min-h-[2.5rem]">
          "{category.images[currentIndex].prompt}"
        </p>
        
        {/* Indicators */}
        <div className="flex justify-center gap-1">
          {category.images.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? `bg-gradient-to-r ${category.gradient} w-6` 
                  : 'bg-white/30 hover:bg-white/50 w-2'
              }`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ExamplePromptGrid;