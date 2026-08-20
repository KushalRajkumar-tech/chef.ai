import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const rawKey = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : '';
const isLiveAIReady = Boolean(rawKey && rawKey.length > 10 && !rawKey.includes('your_api_key'));

let aiClient = null;
if (isLiveAIReady) {
  try {
    aiClient = new GoogleGenAI({ apiKey: rawKey });
    console.log('✨ [Chef.ai Config] GEMINI_API_KEY detected. Operating in LIVE AI mode.');
  } catch (err) {
    console.error('⚠️ [Chef.ai Config] Error initializing Gemini client, falling back to mock mode:', err.message);
  }
} else {
  console.log('🍲 [Chef.ai Config] Operating in MOCK mode (realistic culinary datasets & smart rules).');
}

export const GEMINI_MODEL = 'gemini-2.5-flash';
export { isLiveAIReady, aiClient };
