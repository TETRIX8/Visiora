import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import MemoizedBackground from './components/layout/MemoizedBackground';

// Import console helpers for debugging
import './api/consoleHelpers';
// Import migration service for database structure updates
import './api/migrationService';
// Import secure request helpers

import { setupSecureConsole  } from './utils/secureRequestHelper.js';


// Setup secure console to hide sensitive URLs (e.g., API_URL, pollinations.ai)
setupSecureConsole();


createRoot(document.getElementById("root")).render(
  <>
    <MemoizedBackground />
    <StrictMode>
      <App />
    </StrictMode>
  </>
);
