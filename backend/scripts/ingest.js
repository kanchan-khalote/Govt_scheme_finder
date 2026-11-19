import 'dotenv/config';
import fs from 'fs';
import mongoose from 'mongoose';
import Scheme from '../src/models/Scheme.js';
import Chunk from '../src/models/Chunk.js';
import { chunkScheme } from '../src/rag/chunker.js';
import { embedText } from '../src/rag/embedder.js';


const file = new URL('../data/schemes.json', import.meta.url);
const schemes = JSON.parse(fs.readFileSync(file, 'utf-8'));

try {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected');

  for (const scheme of schemes) {
    console.log(`\n${scheme.name}`);

    const chunks = chunkScheme(scheme);
    const docs = [];
    for (const chunk of chunks) {
      const embedding = await embedText(chunk.text);
      docs.push({ ...chunk, embedding });
      console.log(`  embedded: ${chunk.sectionTitle} #${chunk.chunkIndex}`);
    }

    await Scheme.findOneAndUpdate({ slug: scheme.slug }, scheme, { upsert: true });
    await Chunk.deleteMany({ schemeSlug: scheme.slug });
    await Chunk.insertMany(docs);
    console.log(`  saved ${docs.length} chunks`);
  }

  console.log('\nIngest complete');
} catch (err) {
  console.error('Ingest failed:', err.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}