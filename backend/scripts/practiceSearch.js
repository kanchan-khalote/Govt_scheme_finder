import 'dotenv/config';
import { GoogleGenAI, ModelStage } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY});
const config = {outputDimensionality: Number(process.env.GEMINI_EMBED_DIM)}

const docs = [
     'Monsoon mein baarish zyada hoti hai aur nadiyon ka paani badh jata hai.',
  'Cricket team mein gyarah khiladi hote hain.',
  'Laptop mein RAM aur processor hote hain jo uski speed tay karte hain.',
  'Dal chawal ek simple ghar ka khana hai.',
  'Kisan fasal ugane ke liye kheti karte hain.',
];
const query = 'Baarish ka mausam kab hota hai?';
const embedOne = async (text) => {
  const res = await ai.models.embedContent({
    model: process.env.GEMINI_EMBED_MODEL,
    contents: text,
    config,
  });
  return res.embeddings[0].values;
};
const cosine = (a, b) =>{
    let dot = 0, na = 0, nb = 0;
    for(let i = 0; i < a.length; i++){
        dot += a[i] * b[i];
        na += a[i] * a[i];
        nb += b[i] * b[i];
    }
    return dot / (Math.sqrt(na) * Math.sqrt(nb));
};
const docVectors = [];
for (const d of docs) {
  docVectors.push(await embedOne(d));
}
const queryVector = await embedOne(query);

console.log('docs:', docs.length, 'vectors:', docVectors.length);

 const ranked =  docs 
 .map((text, i) => ({text, score: cosine(queryVector, docVectors[i])}))
 .sort((a, b) => b.score -a.score);

console.log('Sawaal:', query,'\n');
ranked.forEach((r) => console.log(r.score.toFixed(3), '-', r.text));
