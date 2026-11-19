 import 'dotenv/config';
 import { GoogleGenAI } from '@google/genai';

 const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

 const response = await ai.models.embedContent({
    model: process.env.GEMINI_EMBED_MODEL,
    contents: 'PM-KISAN scheme kisano ko 6000 rupaye saalana deti hai',
    config: { outputDimensionality: Number(process.env.GEMINI_EMBED_DIM)}
 });

 const vector = response.embeddings[0].values;
 console.log('Vector length:', vector.length);
 console.log('First 5 numbers:', vector.slice(0, 5));