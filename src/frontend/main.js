import { translateToEmojis, translateToWords } from './emojiMapper.js';
import { translateWithApi } from './apiClient.js';

// State
let isEmojiToWords = false;
const MAX_CHARACTERS = 40;

// DOM Elements
const leftText = document.getElementById('leftText');
const rightText = document.getElementById('rightText');
const leftLabel = document.getElementById('leftLabel');
const rightLabel = document.getElementById('rightLabel');
const leftCopy = document.getElementById('leftCopy');
const rightCopy = document.getElementById('rightCopy');
const leftCount = document.getElementById('leftCount');
const rightCount = document.getElementById('rightCount');
const swapBtn = document.getElementById('swapBtn');
const translateBtn = document.getElementById('translateBtn');
const toast = document.getElementById('toast');

let loadingTimer = null;

function startLoading() {
  translateBtn.disabled = true;
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
  rightText.classList.remove('loading');
  if (loadingTimer) {
    clearInterval(loadingTimer);
    loadingTimer = null;
  }
}

// Translation function (tries API first, then falls back)
async function handleTranslate(text) {
  if (!text.trim()) {
    rightText.value = '';
    updateCharCount(rightText, rightCount);
    updateCopyButton(rightText, rightCopy);
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
  stopLoading();
  updateCopyButton(rightText, rightCopy);
  updateCharCount(rightText, rightCount);
}

// Swap function
function handleSwap() {
  isEmojiToWords = !isEmojiToWords;
  
  // Swap text and enforce character limit on the input side
  const temp = leftText.value;
  const rightValue = rightText.value;
  
  // Truncate the text that will become the new input if it exceeds limit
  leftText.value = truncateToLimit(rightValue);
  rightText.value = ''; // Clear output when swapping
  
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
  updateCharCount(leftText, leftCount);
  updateCopyButton(leftText, leftCopy);
  updateCopyButton(rightText, rightCopy);
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
function showToast(message) {
  toast.textContent = message;
  toast.classList.remove('hidden');
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.classList.add('hidden');
    }, 300);
  }, 2000);
}

// Update character count
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
}

// Update copy button visibility
function updateCopyButton(textarea, button) {
  if (textarea.value.trim()) {
    button.classList.remove('hidden');
  } else {
    button.classList.add('hidden');
  }
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
  
  // Enforce character limit using emoji-aware counting
  if (countCharacters(inputValue) > MAX_CHARACTERS) {
    e.target.value = truncateToLimit(inputValue);
    // Move cursor to end after truncation
    const truncatedLength = e.target.value.length;
    e.target.setSelectionRange(truncatedLength, truncatedLength);
  }
  
  // Clear output when input changes
  rightText.value = '';
  updateCopyButton(rightText, rightCopy);
  
  updateCharCount(leftText, leftCount);
  updateCopyButton(leftText, leftCopy);
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
