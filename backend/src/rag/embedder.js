import { GoogleGenAI } from '@google/genai';

let client;
const getClient = () => {
  if (!client) client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  return client;
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export const embedText = async (text) => {
  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      const res = await getClient().models.embedContent({
        model: process.env.GEMINI_EMBED_MODEL,
        contents: text,
        config: { outputDimensionality: Number(process.env.GEMINI_EMBED_DIM) },
      });
      return res.embeddings[0].values;
    } catch (err) {
      const retryable = err.status === 503 || err.status === 429;
      if (!retryable || attempt === 5) throw err;
      console.log(`  embed retry ${attempt} (${err.status})`);
      await sleep(3000 * attempt);
    }
  }
};