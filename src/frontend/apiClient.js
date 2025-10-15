import { API_ENDPOINT, REQUEST_TIMEOUT_MS } from './config.js';

export async function translateWithApi(mode, text) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(new Error('timeout')), REQUEST_TIMEOUT_MS);

  try {
    const res = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mode, text }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();

    if (!data || typeof data !== 'object' || typeof data.emoji !== 'string' || typeof data.speech !== 'string') {
      throw new Error('Invalid response shape');
    }

    return data;
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}