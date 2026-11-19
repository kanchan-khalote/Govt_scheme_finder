import Chunk from '../models/Chunk.js';
import { embedText } from './embedder.js';

export const retrieveChunks = async (question, { limit = 5, schemeSlug } = {}) => {
  const queryVector = await embedText(question);

  const vectorSearch = {
    index: 'chunk_vector_index',
    path: 'embedding',
    queryVector,
    numCandidates: 50,
    limit,
  };
  if (schemeSlug) vectorSearch.filter = { schemeSlug };

  return Chunk.aggregate([
    { $vectorSearch: vectorSearch },
    {
      $project: {
        _id: 0,
        schemeSlug: 1,
        schemeName: 1,
        sectionTitle: 1,
        text: 1,
        sourceUrl: 1,
        lastChecked: 1,
        score: { $meta: 'vectorSearchScore' },
      },
    },
  ]);
};