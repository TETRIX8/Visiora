/**
 * Utility for making secure requests that don't expose URLs in the console
 */

// Original console methods
const originalFetch = window.fetch;
const originalXHR = window.XMLHttpRequest;
const originalConsoleLog = console.log;
const originalConsoleError = console.error;
const originalConsoleDebug = console.debug;
const originalConsoleWarn = console.warn;
const originalConsoleInfo = console.info;

/**
 * Make a secure fetch request that doesn't show up in console
 * @param {string|Request} url - The URL or Request object to fetch
 * @param {Object} options - Fetch options
 * @returns {Promise} - The fetch promise
 */
async function secureFetch(url, options = {}) {
  try {
    let obfuscatedUrl;
    let isSensitiveUrl = false;
    
    // Handle both string URLs and Request objects (used by Firebase)
    if (typeof url === 'string') {
      // Check if this is a sensitive URL we want to hide completely
      isSensitiveUrl = /api|key|token|secret|auth|password|credential|firebase|firestore|pollinations/i.test(url);
      
      // Don't log the actual URL if it's a string
      obfuscatedUrl = url.replace(/https?:\/\/([^\/]+)\/.*/, 'https://$1/****');
    } else if (url instanceof Request) {
      try {
        // Handle Request objects (used by Firebase)
        if (url.url) {
          isSensitiveUrl = /api|key|token|secret|auth|password|credential|firebase|firestore|pollinations/i.test(url.url);
          obfuscatedUrl = url.url.replace(/https?:\/\/([^\/]+)\/.*/, 'https://$1/****');
        } else {
          obfuscatedUrl = 'Firebase request';
        }
      } catch (err) {
        // If we can't access url property, just label it as Firebase request
        obfuscatedUrl = 'Firebase request';
      }
    } else {
      // For any other type of request
      obfuscatedUrl = 'Internal request';
    }
    
    // Make the request without logging
    const response = await originalFetch(url, options);
    
    // Don't log sensitive request details
    if (process.env.NODE_ENV === 'development' && !isSensitiveUrl) {
      // Use silent logging that doesn't show in console
      // console.log(`Request completed with status: ${response.status}`);
    }
    
    return response;
  } catch (error) {
    // Only log generic errors, not sensitive ones
    if (process.env.NODE_ENV === 'development') {
      // Sanitize the error before logging
      const sanitizedError = sanitizeError(error);
      console.error('Error making request:', sanitizedError.message);
    }
    throw error;
  }
}

/**
 * Setup secure console that prevents logging of sensitive URLs
 */
function setupSecureConsole() {
  // Make sure we don't run this multiple times
  if (window._secureConsoleSetup) {
    return;
  }
  window._secureConsoleSetup = true;
  
  // Override console methods to filter sensitive data
  console.log = function(...args) {
    // Check if this is a Firebase internal log or API URL we want to suppress
    if (args.some(arg => 
      (typeof arg === 'string' && 
       (arg.includes('firebase') || 
        arg.includes('firestore') || 
        arg.includes('User document') || 
        arg.includes('credits') || 
        arg.includes('Fetching credits') ||
        arg.includes('User logged in') ||
        arg.includes('User ID') ||
        arg.includes('pollinations.ai') ||
        arg.includes('API_URL') ||
        arg.includes('api.') ||
        arg.includes('API URL'))))) {
      // For sensitive logs, don't output to console
      return;
    }
    
    const filteredArgs = args.map(arg => {
      if (typeof arg === 'string') {
        // Hide pollinations.ai URLs completely
        if (arg.includes('pollinations.ai') || arg.includes('image.pollinations.ai')) {
          return arg.replace(/https?:\/\/[^\s"']*pollinations\.ai[^\s"']*/gi, '[IMAGE API URL HIDDEN]');
        }
        // Obfuscate any other sensitive URLs in strings
        return arg.replace(/(https?:\/\/[^\s"']*)(api|key|token|secret|auth|password|credential|firebase|firestore)/gi, '$1****');
      }
      return arg;
    });
    originalConsoleLog.apply(console, filteredArgs);
  };

  console.error = function(...args) {
    // Check if this is a Firebase internal error or API URL we want to suppress
    if (args.some(arg => 
      (typeof arg === 'string' && 
       (arg.includes('firebase') || 
        arg.includes('firestore') || 
        arg.includes('WebChannelConnection') || 
        arg.includes('url.replace') ||
        arg.includes('Error making request') ||
        arg.includes('pollinations.ai') ||
        arg.includes('API_URL') ||
        arg.includes('api.') ||
        arg.includes('API URL'))))) {
      // For sensitive errors, suppress them completely
      return;
    }
    
    const filteredArgs = args.map(arg => {
      if (typeof arg === 'string') {
        // Hide pollinations.ai URLs completely
        if (arg.includes('pollinations.ai') || arg.includes('image.pollinations.ai')) {
          return arg.replace(/https?:\/\/[^\s"']*pollinations\.ai[^\s"']*/gi, '[IMAGE API URL HIDDEN]');
        }
        // Obfuscate any other sensitive URLs in strings
        return arg.replace(/(https?:\/\/[^\s"']*)(api|key|token|secret|auth|password|credential|firebase|firestore)/gi, '$1****');
      }
      return arg;
    });
    originalConsoleError.apply(console, filteredArgs);
  };
  
  // Override debug console to catch API URLs that might be logged there
  console.debug = function(...args) {
    // Check if this is a sensitive URL we want to suppress
    if (args.some(arg => 
      (typeof arg === 'string' && 
       (arg.includes('pollinations.ai') || 
        arg.includes('API_URL') || 
        arg.includes('api.') ||
        arg.includes('API URL'))))) {
      // For sensitive debug logs, suppress them completely
      return;
    }
    
    const filteredArgs = args.map(arg => {
      if (typeof arg === 'string') {
        // Hide pollinations.ai URLs completely
        if (arg.includes('pollinations.ai') || arg.includes('image.pollinations.ai')) {
          return arg.replace(/https?:\/\/[^\s"']*pollinations\.ai[^\s"']*/gi, '[IMAGE API URL HIDDEN]');
        }
        // Obfuscate any other sensitive URLs in strings
        return arg.replace(/(https?:\/\/[^\s"']*)(api|key|token|secret|auth|password|credential|firebase|firestore)/gi, '$1****');
      }
      return arg;
    });
    originalConsoleDebug.apply(console, filteredArgs);
  };

  // Override fetch to prevent URL logging in dev tools
  window.fetch = function(url, options) {
    // Skip our wrapper for Firebase internal requests to avoid conflicts
    if ((typeof url === 'object' && url instanceof Request) || 
        (typeof url === 'string' && url.includes('firestore'))) {
      // Use original fetch for Firebase to avoid errors
      return originalFetch(url, options);
    }
    return secureFetch(url, options);
  };

  // Override XMLHttpRequest to prevent URL logging
  window.XMLHttpRequest = class extends originalXHR {
    open(method, url, ...rest) {
      // Store original URL but don't log it
      this._secureUrl = url;
      
      try {
        // Only try to obfuscate if it's a string URL
        if (typeof url === 'string') {
          // Skip Firebase internal requests
          if (url.includes('firestore') || url.includes('firebase')) {
            // For Firebase URLs, just proceed normally
          } else {
            // For other URLs, obfuscate for any debug logging
            const obfuscatedUrl = url.replace(/https?:\/\/([^\/]+)\/.*/, 'https://$1/****');
          }
        }
      } catch (err) {
        // Silently continue if there's an error with URL manipulation
      }
      
      // Always call the original method
      super.open(method, url, ...rest);
    }
  };
};

/**
 * Remove secure console overrides
 */
function restoreOriginalConsole() {
  console.log = originalConsoleLog;
  console.error = originalConsoleError;
  console.debug = originalConsoleDebug;
  console.warn = originalConsoleWarn;
  console.info = originalConsoleInfo;
  window.fetch = originalFetch;
  window.XMLHttpRequest = originalXHR;
}

/**
 * Helper to sanitize URLs in error messages
 * @param {Error} error - The error to sanitize
 * @returns {Error} - Sanitized error
 */
function sanitizeError(error) {
  if (error && error.message) {
    // Hide pollinations.ai URLs completely
    if (error.message.includes('pollinations.ai') || error.message.includes('image.pollinations.ai')) {
      error.message = error.message.replace(/https?:\/\/[^\s"']*pollinations\.ai[^\s"']*/gi, '[IMAGE API URL HIDDEN]');
    } else {
      error.message = error.message.replace(
        /(https?:\/\/[^\s"']*)(api|key|token|secret|auth|password|credential)[^\s"']*/gi, 
        '$1****'
      );
    }
  }
  return error;
}

// Export all functions
// export default setupSecureConsole;
export {
  setupSecureConsole,
  secureFetch,
  restoreOriginalConsole,
  sanitizeError
}
