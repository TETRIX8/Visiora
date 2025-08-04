# 🎨 Visiora - AI Image Generator

> **Transform your imagination into stunning visuals with the power of AI**

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge)](https://visiora-img.netlify.app/)
[![React](https://img.shields.io/badge/React-18.3.1-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-10.14.1-orange?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.14-blue?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)

## ✨ Features

### 🎯 **Core Functionality**
- **AI Image Generation** - Create stunning images from text prompts
- **Multiple Models** - Choose from various AI models for different styles
- **Custom Dimensions** - Generate images in different aspect ratios
- **Prompt Enhancement** - AI-powered prompt improvement
- **Random Prompts** - Get inspired with AI-generated prompts

### 🔐 **Authentication & User Management**
- **Email/Password Authentication** - Secure user accounts
- **Google Sign-In** - Quick social authentication
- **Email Verification** - Required for account security
- **Credits System** - Free and paid credits management
- **User Profiles** - Personalized user experience

### 📱 **User Experience**
- **Responsive Design** - Perfect on mobile and desktop
- **Dark/Light Mode** - Adaptive theme system
- **Image Gallery** - Save and manage your creations
- **History Tracking** - Keep track of your generations
- **Download Images** - Save your creations locally

### 🎨 **Advanced Features**
- **Watermark Removal** - Clean, professional images
- **Seed Control** - Reproducible image generation
- **Progress Tracking** - Real-time generation progress
- **Error Handling** - Graceful error management
- **Offline Support** - Works without internet for basic features

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Firebase account (for authentication and database)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Kandariarjun07/Visiora.git
   cd Visiora
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a new Firebase project
   - Enable Authentication (Email/Password and Google)
   - Create a Firestore database
   - Copy your Firebase config to `src/lib/firebase.js`

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:5173
   ```

## 🏗️ Tech Stack

### **Frontend**
- **React 18** - Modern React with hooks and concurrent features
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **Lucide React** - Beautiful, customizable icons

### **Backend & Services**
- **Firebase Auth** - User authentication and management
- **Firestore** - NoSQL database for user data and images
- **Pollinations AI** - AI image generation API
- **Netlify** - Hosting and deployment platform

### **State Management**
- **React Context** - Global state management
- **Local Storage** - Persistent client-side storage
- **Custom Hooks** - Reusable stateful logic

## 📁 Project Structure

```
Visiora/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── auth/           # Authentication components
│   │   ├── layout/         # Layout components
│   │   ├── tabs/           # Tab-based navigation
│   │   └── ui/             # Generic UI components
│   ├── contexts/           # React Context providers
│   ├── hooks/              # Custom React hooks
│   ├── api/                # API service functions
│   ├── lib/                # Third-party library configs
│   ├── utils/              # Utility functions
│   └── pages/              # Page components
├── public/                 # Static assets
└── netlify.toml           # Netlify deployment config
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Firebase Setup
1. **Authentication**: Enable Email/Password and Google providers
2. **Firestore**: Create database with the following collections:
   - `users` - User profiles and credits
   - `otp_verifications` - Email verification (if using OTP)

## 🚀 Deployment

### Netlify (Recommended)
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard
5. Deploy!

### Manual Deployment
```bash
npm run build
# Upload dist/ folder to your hosting provider
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Pollinations AI](https://pollinations.ai/) for the amazing AI image generation API
- [Firebase](https://firebase.google.com/) for authentication and database services
- [Tailwind CSS](https://tailwindcss.com/) for the beautiful styling system
- [Framer Motion](https://www.framer.com/motion/) for smooth animations

## 📞 Support

- **Live Demo**: [visiora-img.netlify.app](https://visiora-img.netlify.app/)
- **Issues**: [GitHub Issues](https://github.com/Kandariarjun07/Visiora/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Kandariarjun07/Visiora/discussions)

---

<div align="center">
  <b>Made with ❤️ by <a href="https://github.com/Kandariarjun07">Arjun Singh Kandari</a></b><br>
  <a href="https://visiora-img.netlify.app/" target="_blank">🚀 Start Creating Now →</a>
</div>