const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const isHTTPS = window.location.protocol === 'https:';

export const API_ENDPOINT = (() => {
  if (isDevelopment) {
    return 'http://emoji-speech-translator.saichaparala.com/translate';
  } else if (isHTTPS) {
    // Using CORS proxy for HTTPS frontend
    return 'https://cors-anywhere.herokuapp.com/http://emoji-speech-translator.saichaparala.com/translate';
  } else {
    return 'http://emoji-speech-translator.saichaparala.com/translate';
  }
})();

export const REQUEST_TIMEOUT_MS = 10000; // 10 seconds

// You can tweak these values for different environments.
// For example, set API_ENDPOINT to a local server during development.g