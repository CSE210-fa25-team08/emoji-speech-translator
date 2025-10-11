import { translateToEmojis, translateToWords } from './emojiMapper.js';

// State
let isEmojiToWords = false;

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
const toast = document.getElementById('toast');

// Translation function
function handleTranslate(text) {
  if (!text.trim()) {
    rightText.value = '';
    updateCharCount(rightText, rightCount);
    updateCopyButton(rightText, rightCopy);
    return;
  }

  const translated = isEmojiToWords 
    ? translateToWords(text)
    : translateToEmojis(text);
  
  rightText.value = translated;
  updateCharCount(rightText, rightCount);
  updateCopyButton(rightText, rightCopy);
}

// Swap function
function handleSwap() {
  isEmojiToWords = !isEmojiToWords;
  
  // Swap text
  const temp = leftText.value;
  leftText.value = rightText.value;
  rightText.value = temp;
  
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
  updateCharCount(rightText, rightCount);
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
  const length = textarea.value.length;
  countElement.textContent = `${length} character${length !== 1 ? 's' : ''}`;
}

// Update copy button visibility
function updateCopyButton(textarea, button) {
  if (textarea.value.trim()) {
    button.classList.remove('hidden');
  } else {
    button.classList.add('hidden');
  }
}


// Event listeners
leftText.addEventListener('input', (e) => {
  handleTranslate(e.target.value);
  updateCharCount(leftText, leftCount);
  updateCopyButton(leftText, leftCopy);
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
updateCharCount(rightText, rightCount);
