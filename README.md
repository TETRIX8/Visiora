# 🎨 Visiora - AI Image Generation Tool

![Visiora Banner](./src/assets/logo/logo.jpg)

**Where Every Image Radiates an Aura of Imagination**

Transform your ideas into stunning visuals with advanced AI technology. Visiora is a modern, intuitive image generation platform that harnesses the power of cutting-edge AI models to bring your creative visions to life.

## 🌟 Live Demo

**🚀 [Try Visiora Live](https://visiora-img.netlify.app/)**

## ✨ Features

### 🎯 **Core Functionality**

- **AI-Powered Image Generation**: Create stunning images from text descriptions
- **Multiple AI Models**: Choose from Flux (Best Quality), Turbo (Fastest), and Kontext (Artistic)
- **Smart Prompt Enhancement**: AI-powered prompt improvement with professional styling
- **Random Prompt Generation**: AI-generated creative prompts by category
- **Flexible Dimensions**: Multiple aspect ratios and custom sizing options

### 🎨 **User Experience**

- **Three-Tab Interface**: Generate, Enhance, and History sections
- **Animated Typewriter Effect**: Dynamic tagline with rotating messages
- **Example Prompts**: Pre-built prompts with preview images
- **Real-time Progress**: Visual feedback during image generation
- **Responsive Design**: Optimized for desktop and mobile devices

### 🛠️ **Advanced Features**

- **Generation History**: Keep track of all your created images (350x250 preview)
- **History Management**: Delete individual items or clear all with confirmation
- **Prompt Copying**: Easy copy-to-clipboard functionality
- **Image Download**: Save generated images directly to your device
- **Seed Control**: Reproducible results with custom seed values
- **Style Presets**: Quick apply professional enhancement styles
- **Manual Style Enhancement**: Custom style selection with live preview

### 🎭 **Style Categories**

- **Cinematic/Realistic**: Movie-quality visuals with dramatic lighting
- **Aesthetic/Minimalist**: Clean, social media-ready compositions
- **Anime/Manga**: Japanese animation-inspired artwork
- **Fantasy/Mythical**: Magical worlds and fantastical creatures
- **Cartoon/Pixar**: Fun, vibrant, family-friendly styles

### 🤖 **AI Prompt Generation**

- **Portrait Photography**: Professional headshots and character portraits
- **Landscape Photography**: Scenic views and nature compositions
- **Fantasy Artwork**: Magical and mythical scene generation
- **Sci-Fi Scenes**: Futuristic and cyberpunk environments
- **Anime Characters**: Japanese animation style character creation
- **Surprise Me**: Random creative prompts across all categories

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Kandariarjun07/Visiora-an-image-generation-tool.git
   cd Visiora-an-image-generation-tool
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in your terminal)

### Build for Production

```bash
npm run build
# or
yarn build
```

## 🎮 How to Use

### 1. **Generate Tab**

- Enter your creative prompt in the text area
- Choose your preferred AI model (Flux, Turbo, or Kontext)
- Select dimensions (Landscape, Portrait, Square, Wide, Story, or Manual)
- Click "Generate Image" and watch your vision come to life
- Use "Quick Random" for instant local prompts or "AI Random" for creative AI-generated prompts

### 2. **Enhance Tab**

- Enter your base prompt
- Use "⚡ Enhance Prompt" for AI-powered improvements
- Apply style presets for quick professional enhancement
- Manually select individual style elements
- Get instant "✅ Styles Applied!" feedback

### 3. **History Tab**

- View all your generated images (350x250 preview)
- Click "🔄 Use Prompt" to reuse any prompt
- "📋 Copy" to copy prompts to clipboard
- "📥 Download" to save images
- "🗑️ Delete" individual items or "🗑️ Clear All" with confirmation

## 🔧 Technical Stack

### Frontend

- **React 18**: Modern React with hooks and functional components
- **Vite**: Lightning-fast build tool and development server
- **CSS3**: Custom styling with CSS variables and animations
- **JavaScript ES6+**: Modern JavaScript features

### APIs & Services

- **Pollinations AI**: Image generation and text enhancement
- **Netlify**: Hosting and deployment platform

### Key Features Implementation

- **LocalStorage**: Persistent history and theme preferences
- **CSS Animations**: Smooth transitions and typewriter effects
- **Responsive Design**: Mobile-first approach with flexible layouts
- **Error Handling**: Graceful fallbacks and user feedback

## 📁 Project Structure

```
src/
├── api/
│   └── pollinationService.js    # API integration for AI services
├── assets/
│   ├── example_images/          # Sample prompt images
│   └── logo/                    # Brand assets
├── components/
│   ├── EnhanceTab.jsx          # Prompt enhancement interface
│   ├── EnhanceTab.css          # Enhancement styling
│   ├── GenerateTab.jsx         # Main generation interface
│   ├── GenerateTab.css         # Generation styling
│   ├── HistoryTab.jsx          # History management
│   ├── HistoryTab.css          # History styling
│   ├── ImageDisplay.jsx        # Image display component
│   ├── TabNavigation.jsx       # Tab switching interface
│   ├── TabNavigation.css       # Navigation styling
│   ├── TypewriterEffect.jsx    # Animated text component
│   └── TypewriterEffect.css    # Typewriter animations
├── pages/
│   └── HomePage.jsx            # Main application page
├── App.jsx                     # Root component
├── App.css                     # Global styles
├── main.jsx                    # Application entry point
└── index.css                   # Base styles
```

## 🎨 Features in Detail

### AI Models

- **Flux**: Best quality, photorealistic results with fine details
- **Turbo**: Fastest generation for quick iterations
- **Kontext**: Artistic style with creative interpretations

### Dimension Options

- **Landscape (16:9)**: 1344x768 - Perfect for wallpapers and presentations
- **Portrait (9:16)**: 768x1344 - Ideal for mobile wallpapers and posters
- **Square (1:1)**: 1024x1024 - Great for social media posts
- **Wide (21:9)**: 1536x640 - Cinematic ultra-wide format
- **Story (9:16)**: 576x1024 - Optimized for social media stories
- **Manual**: Custom dimensions up to your needs

### Style Enhancement Categories

- **Quality**: Ultra high resolution, professional photography, 8K, highly detailed
- **Lighting**: Golden hour, dramatic lighting, soft lighting, cinematic lighting
- **Style**: Photorealistic, hyperrealistic, artistic, award-winning
- **Camera**: Portrait, wide angle, close-up, macro, telephoto
- **Mood**: Ethereal, dramatic, serene, mysterious, vibrant

## 🌈 Theme Support

Visiora supports both light and dark themes with automatic persistence:

- **Dark Theme**: Professional, eye-friendly default
- **Light Theme**: Clean, bright alternative
- **Auto-Save**: Theme preference saved to localStorage

## 📱 Responsive Design

- **Desktop**: Full-featured experience with side-by-side layouts
- **Tablet**: Optimized touch interface with responsive grids
- **Mobile**: Streamlined interface with touch-friendly controls

## 🔒 Privacy & Data

- **No Account Required**: Start creating immediately
- **Local Storage**: History saved locally on your device
- **No Personal Data**: We don't collect or store personal information
- **Secure API**: All communications encrypted via HTTPS

## 🛠️ Development

### Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint checks
```

### Environment Setup

The project uses Vite for development with hot module replacement (HMR) for instant updates during development.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Guidelines

1. Follow the existing code style
2. Add comments for complex functionality
3. Test your changes thoroughly
4. Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Arjun Kandari**

- GitHub: [@Kandariarjun07](https://github.com/Kandariarjun07)
- Project: [Visiora](https://visiora-img.netlify.app/)

## 🙏 Acknowledgments

- **Pollinations AI** for providing the image generation API
- **React Team** for the amazing framework
- **Vite** for the lightning-fast build tool
- **Netlify** for seamless deployment and hosting

## 📈 Roadmap

### Upcoming Features

- [ ] User accounts and cloud history sync
- [ ] Advanced style mixing and blending
- [ ] Batch image generation
- [ ] Social sharing integration
- [ ] API rate limiting and usage tracking
- [ ] Advanced prompt templates
- [ ] Image-to-image generation
- [ ] Community gallery

### Performance Improvements

- [ ] Image lazy loading optimization
- [ ] Progressive Web App (PWA) support
- [ ] Offline mode capabilities
- [ ] Enhanced caching strategies

---

**🎨 Start creating amazing AI-generated images today with [Visiora](https://visiora-img.netlify.app/)!**

_"Turn imagination into vivid AI visuals."_
