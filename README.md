
<div align="center">
  <img src="public/assets/logo/logo.jpg" alt="Visiora Logo" width="120" />
  <h1>Visiora 🖼️✨</h1>
  <p><b>AI-Powered Image Generation & Gallery Platform</b></p>
  <a href="https://visiora-img.netlify.app/" target="_blank">
    <img src="https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge" alt="Live Demo" />
  </a>
  <br><br>
</div>

---

## 🚀 Overview
Visiora is a modern web app for AI-generated image gallery, history, and project management. Built with React, Firebase, and Vite for blazing-fast performance and a beautiful UI.

## 🎯 Features
- 🔒 Secure API requests (URLs and keys hidden in console)
- 🖼️ Gallery & History tabs with Masonry layout
- 👁️ Eye icon overlay for image details
- ✨ Smooth scale-on-hover for images
- 🔑 User authentication & profile
- 📁 Project & image management
- 🔥 Firebase integration

## 🛡️ Security
- Sensitive URLs, API keys, and tokens are obfuscated in logs
- `secureRequestHelper.js` handles fetch/XHR/console suppression
- Service account keys and backups are excluded from deployment

## 🌐 Deployment
- Deploy using Netlify ([see config](netlify.toml))
- **Do NOT upload:**
  - `service-account-key.json`
  - Any `.bak`, `.key`, `.env`, `.log`, `.old` files
  - `backup_unused_files/`
- Only keep this `README.md` for documentation

## 📁 File Structure
```
Visiora/
├── src/                  # Main app code
├── public/               # Static assets
├── scripts/              # Utility scripts
├── backup_unused_files/  # Old/unused files (do not deploy)
```

## ⚡ Getting Started
```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Deploy to Netlify
```

## 🙌 Credits
- Built by [Kandariarjun07](https://github.com/Kandariarjun07)
- Uses [Lucide React](https://lucide.dev/) for icons
- Uses [Framer Motion](https://www.framer.com/motion/) for animations

## 📜 License
MIT

---

<div align="center">
  <b>Made with ❤️ for creators, dreamers, and visionaries.</b><br>
  <a href="https://visiora-img.netlify.app/" target="_blank">Start Creating Now →</a>
</div>
