'use strict';

const http = require('http');
const { URL } = require('url');

const endpoint = 'http://emoji-speech-translator.saichaparala.com/translate';
const url = new URL(endpoint);

const payload = JSON.stringify({
  mode: 'emoji-to-speech',
  text: '💀',
});

const options = {
  hostname: url.hostname,
  port: url.port || 80,
  path: url.pathname,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload),
  },
};

const req = http.request(options, (res) => {
  let data = '';
  console.log('Status:', res.statusCode);
  console.log('Headers:', res.headers);
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log('Body (JSON):', json);
    } catch (e) {
      console.log('Body (text):', data);
    }
  });
});

req.on('error', (err) => {
  console.error('Request Error:', err);
});

req.write(payload);
req.end();