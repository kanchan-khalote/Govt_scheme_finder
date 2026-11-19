import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const models = [
  process.env.GEMINI_CHAT_MODEL,
  process.env.GEMINI_CHAT_FALLBACK_MODEL,
].filter(Boolean);

async function generateWithRetry(prompt) {
  for (const model of models) {
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const res = await ai.models.generateContent({ model, contents: prompt });
        return { model, text: res.text };
      } catch (err) {
        const busy = err.status === 503 || err.status === 429;
        console.log(`Model ${model}, try ${attempt} failed (${err.status})`);
        if (!busy) throw err;
        await sleep(2000 * attempt);
      }
    }
  }
  throw new Error('All models are busy right now, try again later');
}

const result = await generateWithRetry('Ek line mein batao: PM-KISAN kya hai?');
console.log('Model used:', result.model);
console.log('Answer:', result.text);