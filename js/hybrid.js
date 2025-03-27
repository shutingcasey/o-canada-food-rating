import { cosineSimilarity } from "./utils/cosine.js";
import { searchProducts } from "./search.js";

// 混合搜尋：關鍵字 + 語意
export function hybridSearch(data, embeddingsDict, query, queryEmbedding) {
  // 1. 關鍵字排名分數（名次越前面分數越高）
  const keywordResults = searchProducts(data, query);
  const keywordScores = {};
  keywordResults.forEach((item, index) => {
    keywordScores[item.id] = keywordResults.length - index; // e.g. 10, 9, 8...
  });

  // 2. 每筆資料的語意分數 + 混合分數
  const results = data
    .filter(item => item.id && embeddingsDict[item.id])
    .map(item => {
      const embedding = embeddingsDict[item.id];
      const sim = cosineSimilarity(queryEmbedding, embedding);
      const keywordScore = keywordScores[item.id] || 0;
      const combined = 0.3 * sim + 0.7 * keywordScore;

      return {
        item,
        combined,
      };
    });

  // 3. 依據綜合分數排序
  return results
    .sort((a, b) => b.combined - a.combined)
    .map(result => result.item);
}