#!/usr/bin/env node

// Node.js test runner for emojiMapper.js
import { runAllTests } from './test_emoji_mapper.js';

console.log('🚀 Starting Emoji Mapper Test Suite (Node.js)');
console.log('=' .repeat(50));

// Run all tests
const results = runAllTests();

// Exit with appropriate code
process.exit(results.failed > 0 ? 1 : 0);
