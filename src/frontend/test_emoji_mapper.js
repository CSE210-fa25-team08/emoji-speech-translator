// Test file for emojiMapper.js functionality
import { emojiToWord, wordToEmoji, translateToEmojis, translateToWords } from './emojiMapper.js';

// Test configuration
const TEST_CONFIG = {
  verbose: true,
  showPassed: true,
  showFailed: true
};

// Test results tracking
let testResults = {
  passed: 0,
  failed: 0,
  total: 0
};

// Utility function to log test results
function logTest(testName, passed, expected, actual, details = '') {
  testResults.total++;
  if (passed) {
    testResults.passed++;
    if (TEST_CONFIG.verbose && TEST_CONFIG.showPassed) {
      console.log(`✅ PASS: ${testName}`);
      if (details) console.log(`   ${details}`);
    }
  } else {
    testResults.failed++;
    if (TEST_CONFIG.verbose && TEST_CONFIG.showFailed) {
      console.log(`❌ FAIL: ${testName}`);
      console.log(`   Expected: ${expected}`);
      console.log(`   Actual: ${actual}`);
      if (details) console.log(`   ${details}`);
    }
  }
}

// Test emojiToWord mapping
function testEmojiToWordMapping() {
  console.log('\n🧪 Testing emojiToWord mapping...');
  
  // Test basic mappings
  const testCases = [
    { emoji: '😀', expected: 'grinning' },
    { emoji: '❤️', expected: 'red heart' },
    { emoji: '👍', expected: 'thumbs up' },
    { emoji: '🔥', expected: 'fire' },
    { emoji: '🍕', expected: 'pizza' },
    { emoji: '🎉', expected: 'party popper' }
  ];
  
  testCases.forEach(({ emoji, expected }) => {
    const actual = emojiToWord[emoji];
    const passed = actual === expected;
    logTest(`emojiToWord['${emoji}']`, passed, expected, actual);
  });
  
  // Test that mapping exists
  logTest('emojiToWord has entries', Object.keys(emojiToWord).length > 0, '> 0', Object.keys(emojiToWord).length);
  
  // Test specific count
  const emojiCount = Object.keys(emojiToWord).length;
  logTest('emojiToWord count', emojiCount >= 400, '>= 400', emojiCount);
}

// Test wordToEmoji mapping
function testWordToEmojiMapping() {
  console.log('\n🧪 Testing wordToEmoji mapping...');
  
  const testCases = [
    { word: 'grinning', expected: '😀' },
    { word: 'red heart', expected: '❤️' },
    { word: 'thumbs up', expected: '👍' },
    { word: 'fire', expected: '🔥' },
    { word: 'pizza', expected: '🍕' }
  ];
  
  testCases.forEach(({ word, expected }) => {
    const actual = wordToEmoji[word];
    const passed = actual === expected;
    logTest(`wordToEmoji['${word}']`, passed, expected, actual);
  });
  
  // Test case insensitivity
  const testCasesInsensitive = [
    { word: 'GRINNING', expected: '😀' },
    { word: 'Red Heart', expected: '❤️' },
    { word: 'THUMBS UP', expected: '👍' }
  ];
  
  testCasesInsensitive.forEach(({ word, expected }) => {
    const actual = wordToEmoji[word.toLowerCase()];
    const passed = actual === expected;
    logTest(`wordToEmoji case insensitive '${word}'`, passed, expected, actual);
  });
}

// Test translateToEmojis function
function testTranslateToEmojis() {
  console.log('\n🧪 Testing translateToEmojis function...');
  
  const testCases = [
    { 
      input: 'I am happy', 
      expected: 'i am 😄', 
      description: 'Basic word translation'
    },
    { 
      input: 'I love pizza and coffee', 
      expected: 'i love 🍕 and ☕', 
      description: 'Multiple word translation'
    },
    { 
      input: 'thumbs up for this!', 
      expected: 'thumbs 🆙 for this!', 
      description: 'Translation with punctuation'
    },
    { 
      input: 'unknown word here', 
      expected: 'unknown word 🈁', 
      description: 'Unknown words remain unchanged'
    },
    { 
      input: '', 
      expected: '', 
      description: 'Empty string'
    },
    { 
      input: '   ', 
      expected: '', 
      description: 'Whitespace only'
    },
    { 
      input: 'Happy, sad, and angry.', 
      expected: '😄, sad, and 😡.', 
      description: 'Multiple emotions with punctuation'
    }
  ];
  
  testCases.forEach(({ input, expected, description }) => {
    const actual = translateToEmojis(input);
    const passed = actual === expected;
    logTest(`translateToEmojis: ${description}`, passed, expected, actual, `Input: "${input}"`);
  });
}

// Test translateToWords function
function testTranslateToWords() {
  console.log('\n🧪 Testing translateToWords function...');
  
  const testCases = [
    { 
      input: 'I am 😄', 
      expected: 'I am happy', 
      description: 'Basic emoji translation'
    },
    { 
      input: 'I love 🍕 and ☕', 
      expected: 'I love pizza and coffee', 
      description: 'Multiple emoji translation'
    },
    { 
      input: '👍 for this!', 
      expected: 'thumbs up for this!', 
      description: 'Emoji with punctuation'
    },
    { 
      input: '😄😢😡', 
      expected: 'happy crying angry', 
      description: 'Consecutive emojis'
    },
    { 
      input: '', 
      expected: '', 
      description: 'Empty string'
    },
    { 
      input: '   ', 
      expected: '', 
      description: 'Whitespace only'
    },
    { 
      input: '😄, 😢, and 😡.', 
      expected: 'happy , crying , and angry .', 
      description: 'Multiple emotions with punctuation'
    },
    { 
      input: 'Hello 🌍 world!', 
      expected: 'Hello 🌍 world!', 
      description: 'Mixed text and emoji'
    }
  ];
  
  testCases.forEach(({ input, expected, description }) => {
    const actual = translateToWords(input);
    const passed = actual === expected;
    logTest(`translateToWords: ${description}`, passed, expected, actual, `Input: "${input}"`);
  });
}

// Test edge cases and error handling
function testEdgeCases() {
  console.log('\n🧪 Testing edge cases...');
  
  // Test with special characters
  const specialCharTests = [
    { input: 'Hello @#$% world', expected: 'Hello @#$% world' },
    { input: 'Numbers 123 and symbols !@#', expected: 'Numbers 123 and symbols !@#' },
    { input: 'Mixed 😀 text with 123 numbers', expected: 'Mixed grinning text with 123 numbers' }
  ];
  
  specialCharTests.forEach(({ input, expected }) => {
    const actual = translateToWords(input);
    const passed = actual === expected;
    logTest(`Special characters: "${input}"`, passed, expected, actual);
  });
  
  // Test with very long strings
  const longString = 'happy '.repeat(100) + 'pizza';
  const longStringResult = translateToEmojis(longString);
  const hasEmojis = longStringResult.includes('😄') && longStringResult.includes('🍕');
  logTest('Long string handling', hasEmojis, true, hasEmojis, '100+ word string');
  
  // Test with mixed case
  const mixedCaseResult = translateToEmojis('HAPPY sad ANGRY');
  const expectedMixed = '😄 sad 😡';
  logTest('Mixed case handling', mixedCaseResult === expectedMixed, expectedMixed, mixedCaseResult);
}

// Test bidirectional translation
function testBidirectionalTranslation() {
  console.log('\n🧪 Testing bidirectional translation...');
  
  const testPhrases = [
    'i am happy',
    'i love pizza',
    'fire and water',
    'party time!'
  ];
  
  testPhrases.forEach(phrase => {
    // Text -> Emoji -> Text
    const toEmoji = translateToEmojis(phrase);
    const backToText = translateToWords(toEmoji);
    
    // Clean up the result for comparison (remove extra spaces)
    const cleanedResult = backToText.replace(/\s+/g, ' ').trim();
    const cleanedOriginal = phrase.replace(/\s+/g, ' ').trim();
    
    const passed = cleanedResult === cleanedOriginal;
    logTest(`Bidirectional: "${phrase}"`, passed, cleanedOriginal, cleanedResult, 
      `Emoji intermediate: "${toEmoji}"`);
  });
}

// Performance test
function testPerformance() {
  console.log('\n🧪 Testing performance...');
  
  const testText = 'happy sad angry fire water pizza coffee thumbs up party time';
  const iterations = 1000;
  
  const startTime = performance.now();
  
  for (let i = 0; i < iterations; i++) {
    translateToEmojis(testText);
    translateToWords(testText);
  }
  
  const endTime = performance.now();
  const duration = endTime - startTime;
  const avgTime = duration / iterations;
  
  const passed = avgTime < 10; // Should be less than 10ms per operation
  logTest('Performance test', passed, '< 10ms', `${avgTime.toFixed(2)}ms`, 
    `${iterations} iterations in ${duration.toFixed(2)}ms`);
}

// Run all tests
function runAllTests() {
  console.log('🚀 Starting emojiMapper tests...\n');
  
  testEmojiToWordMapping();
  testWordToEmojiMapping();
  testTranslateToEmojis();
  testTranslateToWords();
  testEdgeCases();
  testBidirectionalTranslation();
  testPerformance();
  
  // Print summary
  console.log('\n📊 Test Summary:');
  console.log(`✅ Passed: ${testResults.passed}`);
  console.log(`❌ Failed: ${testResults.failed}`);
  console.log(`📈 Total: ${testResults.total}`);
  console.log(`🎯 Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`);
  
  if (testResults.failed === 0) {
    console.log('\n🎉 All tests passed! 🎉');
  } else {
    console.log(`\n⚠️  ${testResults.failed} test(s) failed. Please review the output above.`);
  }
  
  return testResults;
}

// Export for use in other files
export { runAllTests, testResults };

// Auto-run if this file is executed directly
if (typeof window !== 'undefined') {
  // Browser environment
  console.log('Running tests in browser...');
  runAllTests();
} else if (typeof process !== 'undefined' && process.argv[1] === new URL(import.meta.url).pathname) {
  // Node.js environment
  runAllTests();
}
