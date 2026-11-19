import mongoose from "mongoose";

const chunkSchema = new mongoose.Schema({
    schemeSlug: { type: String, required: true, index: true },
    schemeName: String,
    sectionTitle: String,
    chunkIndex: Number,
    text: { type: String, required: true },
    sourceUrl: String,
    lastChecked: String,
    embedding: {type: [Number], required: true }, 
});

export default mongoose.model('Chunk', chunkSchema);