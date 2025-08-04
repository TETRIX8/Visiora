import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import MemoizedBackground from './components/layout/MemoizedBackground';

import { setupSecureConsole  } from './utils/secureRequestHelper.js';
import './utils/productionCheck.js';

// Setup secure console to hide sensitive URLs (e.g., API_URL, pollinations.ai)
setupSecureConsole();


createRoot(document.getElementById("root")).render(
  <>
    <MemoizedBackground key="persistent-background" />
    <StrictMode>
      <App />
    </StrictMode>
  </>
);
