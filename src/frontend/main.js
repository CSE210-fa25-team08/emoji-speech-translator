import { translateToEmojis, translateToWords } from './emojiMapper.js';
import { translateWithApi } from './apiClient.js';

// State
let isEmojiToWords = false;
const MAX_CHARACTERS = 40;
const AUTOTRANSLATE_TIMER = 4000;
const Positions = {
  LEFT: 'left',
  RIGHT: 'right'
};

// DOM Elements
const leftText = document.getElementById('leftText');
const rightText = document.getElementById('rightText');
const leftLabel = document.getElementById('leftLabel');
const rightLabel = document.getElementById('rightLabel');
const leftCopy = document.getElementById('leftCopy');
const rightCopy = document.getElementById('rightCopy');
const leftCount = document.getElementById('leftCount');
const swapBtn = document.getElementById('swapBtn');
const translateBtn = document.getElementById('translateBtn');
const toast = document.getElementById('toast');


function updateTextBox(position, clear) {
  /** 
   * Updates the specified text box's character count and visibility of the copy button.
   * If clear is set to true, will clear the text value of the box
   * :param: position: specifies which box should be updated
   * :param: clear: boolean, whether the textbox's value should be cleared
  */
  if (position == Positions.RIGHT) {
    if (clear) {
      rightText.value = '';
    }
    if (rightText.value.trim()){
      rightCopy.classList.remove('hidden');
    }
    else{
      rightCopy.classList.add('hidden')
    }
  }
  else if (position == Positions.LEFT) {
    if (clear) {
      leftText.value = '';
    }
    if (updateCharCount(leftText, leftCount) > 0){
      leftCopy.classList.remove('hidden');
    }
    else{
      leftCopy.classList.add('hidden')
    }
  }
  else{
    console.error("Tried to update text box in nonexistant postition: " + position)
  }
}

let loadingTimer = null;
let translateTimeoutId = 0;
let lastTranslationRequest = "";

function startLoading() {
  translateBtn.disabled = true;
  swapBtn.disabled = true;
  rightText.classList.add('loading');
  rightText.value = 'Translating';
  let i = 0;
  loadingTimer = setInterval(() => {
    i = (i + 1) % 4; 
    rightText.value = 'Translating' + '.'.repeat(i);
  }, 350);
}

function stopLoading() {
  translateBtn.disabled = false;
  swapBtn.disabled = false;
  rightText.classList.remove('loading');
  if (loadingTimer) {
    clearInterval(loadingTimer);
    loadingTimer = null;
  }
}

// Translation function (tries API first, then falls back)
async function handleTranslate(text) {
  // if this translation request is a duplicate, do not translate
  if (text.trim() == lastTranslationRequest.trim()){
    return;
  }

  lastTranslationRequest = text;

  // When the input is only white space, we do not want to attempt to translate and default to an empty result
  if (!text.trim()) {
    updateTextBox(Positions.RIGHT, true)
    return;
  }

  const mode = isEmojiToWords ? 'emoji-to-speech' : 'speech-to-emoji';
  startLoading();

  try {
    const result = await translateWithApi(mode, text);
    rightText.value = isEmojiToWords ? result.speech : result.emoji;
  } catch (err) {
    // Fallback to hardcoded mapping logic on error/timeout
    const translated = isEmojiToWords 
      ? translateToWords(text)
      : translateToEmojis(text);
    rightText.value = translated;
  }

  updateTextBox(Positions.RIGHT, false)
  stopLoading();
}

// Swap function
function handleSwap() {
  isEmojiToWords = !isEmojiToWords;
  lastTranslationRequest = ""; //clear the last request when we switch modes; don't ignore duplicates between modes
  
  // Truncate the text that will become the new input if it exceeds limit
  leftText.value = truncateToLimit(rightText.value);
  
  // Update labels
  if (isEmojiToWords) {
    leftLabel.textContent = '😊 Emojis';
    rightLabel.textContent = '📝 Words';
    leftText.placeholder = 'Enter emojis here...';
  } else {
    leftLabel.textContent = '📝 Words';
    rightLabel.textContent = '😊 Emojis';
    leftText.placeholder = 'Type words here...';
  }
  
  // Update char counts and copy buttons
  updateTextBox(Positions.RIGHT, true) // Clear output when swapping
  updateTextBox(Positions.LEFT, false)

  translateBtn.disabled = !leftText.value.trim();
}

// Copy to clipboard
async function handleCopy(text) {
  try {
    await navigator.clipboard.writeText(text);
    showToast('Copied to clipboard!');
  } catch {
    showToast('Failed to copy');
  }
}

// Show toast notification
let toastTimeout = null;
function showToast(message) {
  toast.textContent = message;
  toast.classList.remove('hidden');
  toast.classList.add('show');

  if (toastTimeout) {
    clearTimeout(toastTimeout);
    toastTimeout = null;
  }

  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.classList.add('hidden');
    }, 300);
    toastTimeout = null;
  }, 2000);
}

// Apply a brief shake animation
let lastShake = 0;
function triggerShake(target) {
  // Respect user preference for reduced motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const now = Date.now();
  // Avoid continuous shaking
  if (now - lastShake < 600) return;
  lastShake = now;

  target.classList.add('shake');
  setTimeout(() => target.classList.remove('shake'), 500);
}

// Update character count
// Returns the number of characters
function updateCharCount(textarea, countElement) {
  const length = countCharacters(textarea.value);
  const isAtLimit = length >= MAX_CHARACTERS;
  countElement.textContent = `${length}/${MAX_CHARACTERS} character${length !== 1 ? 's' : ''}`;
  
  // Add visual feedback for character limit
  if (isAtLimit) {
    countElement.style.color = '#ef4444'; // red
  } else if (length > MAX_CHARACTERS * 0.9) {
    countElement.style.color = '#f59e0b'; // amber
  } else {
    countElement.style.color = ''; // default
  }
  return length;
}

// Count characters properly handling emojis as single characters
function countCharacters(text) {
  // Use Array.from to properly handle Unicode characters including emojis
  return Array.from(text).length;
}

// Truncate text to character limit while respecting emoji boundaries
function truncateToLimit(text) {
  const charCount = countCharacters(text);
  if (charCount <= MAX_CHARACTERS) {
    return text;
  }
  
  // Convert to array of characters (properly handling emojis)
  const chars = Array.from(text);
  return chars.slice(0, MAX_CHARACTERS).join('');
}


// Event listeners
leftText.addEventListener('input', (e) => {
  const inputValue = e.target.value;

  // if the user stops typing for 4 seconds, attempt to translate
  clearTimeout(translateTimeoutId); // clears the last scheduled translate
  translateTimeoutId = setTimeout(() => {
      console.log("Testing... this is the timeout");
      void handleTranslate(leftText.value);
    }, AUTOTRANSLATE_TIMER);
  
  
  // Enforce character limit using emoji-aware counting
  if (countCharacters(inputValue) > MAX_CHARACTERS) {
    e.target.value = truncateToLimit(inputValue);
    // Move cursor to end after truncation
    const truncatedLength = e.target.value.length;
    e.target.setSelectionRange(truncatedLength, truncatedLength);
    // Visual signals
    triggerShake(e.target);
    showToast('Reached character limit');
  }
  
  updateTextBox(Positions.RIGHT, false);
  updateTextBox(Positions.LEFT, false)

  translateBtn.disabled = !inputValue.trim();
});

translateBtn.addEventListener('click', () => {
  // Fire and forget; UI updates when the promise resolves
  void handleTranslate(leftText.value);
});

swapBtn.addEventListener('click', handleSwap);

leftCopy.addEventListener('click', () => {
  handleCopy(leftText.value);
});

rightCopy.addEventListener('click', () => {
  handleCopy(rightText.value);
});

// Initialize
updateCharCount(leftText, leftCount);
translateBtn.disabled = true;