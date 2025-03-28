import { cosineSimilarity } from "./utils/cosine.js";
import { searchProducts } from "./search.js";

// 混合搜尋：關鍵字 + 語意
export function hybridSearch(data, embeddingsDict, query, queryEmbedding) {
  const keywordResults = searchProducts(data, query);
  const keywordScores = {};
  keywordResults.forEach((item, index) => {
    keywordScores[item.id] = keywordResults.length - index;
  });

  const results = data
    .filter(item => item.id && embeddingsDict[item.id])
    .map(item => {
      const embedding = embeddingsDict[item.id];
      const sim = cosineSimilarity(queryEmbedding, embedding);
      const keywordScore = keywordScores[item.id] || 0;
      const maxKeywordScore = Math.max(...Object.values(keywordScores));
      const normKeywordScore = keywordScore / maxKeywordScore;
      
      const combined = 0.7 * sim + 0.3 * normKeywordScore;      

      return {
        ...item,
        score: combined,
        similarity: sim,
      };
    });

  return results.sort((a, b) => b.score - a.score);
}
