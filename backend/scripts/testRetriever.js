import 'dotenv/config';
import mongoose from 'mongoose';
import { retrieveChunks } from '../src/rag/retriever.js';

const questions = [
  'Ladli Behna yojana ke liye kaun se documents chahiye?',
  'Free ilaj 5 lakh tak kaun si scheme deti hai?',
  'Construction worker ke liye health scheme',
  'Cricket world cup kisne jeeta?',
];

try {
  await mongoose.connect(process.env.MONGO_URI);

  for (const q of questions) {
    console.log('\nSawal:', q);
    const results = await retrieveChunks(q, { limit: 3 });
    results.forEach((r) =>
      console.log(r.score.toFixed(3), '|', r.schemeName, '|', r.sectionTitle)
    );
  }
} catch (err) {
  console.error('Error:', err.message);
} finally {
  await mongoose.disconnect();
}