export async function semanticSearchEmbeddingsOnly(data, query) {
    try {
      const response = await fetch("http://localhost:5000/embedding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ query })
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch embedding from server.");
      }
  
      const result = await response.json();
      return { queryEmbedding: result.embedding };
    } catch (error) {
      console.error("❌ Embedding fetch error:", error);
      return { queryEmbedding: [] }; // 回傳空陣列避免系統崩潰
    }
}