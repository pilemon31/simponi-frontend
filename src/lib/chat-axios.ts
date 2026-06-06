import axios from 'axios';

/**
 * Chatbot runs on a SEPARATE backend (default port 8000), independent from
 * the main API. This instance is intentionally isolated and must NOT reuse
 * the shared `@/lib/axios` config so it never affects existing features.
 *
 * - Dev: requests go through the `/chatbot-api` vite proxy (avoids CORS).
 * - Prod: set `VITE_CHAT_API_BASE_URL` to the chatbot base URL.
 */
const CHAT_API_BASE_URL =
  import.meta.env.VITE_CHAT_API_BASE_URL ||
  (import.meta.env.DEV ? '/chatbot-api' : 'http://127.0.0.1:8000/api');

const chatAxios = axios.create({
  baseURL: `${CHAT_API_BASE_URL}/v1`,
});

export default chatAxios;
