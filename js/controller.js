import {
  loadData,
  getCategories,
  getBrands,
  filterData
} from "./model.js";

import {
  renderDropdown,
  renderCards,
  renderLoadingSkeleton,
  loadMoreCards
} from "./view.js";

import { searchProducts } from "./search.js";
import { semanticSearchEmbeddingsOnly } from "./semantic_search.js";
import { hybridSearch } from "./hybrid.js";
import { cosineSimilarity } from "./utils/cosine.js";

window.loadMoreCards = loadMoreCards;

function getEmbeddingsDict(data) {
  const dict = {};
  data.forEach((item) => {
    if (item.embedding) {
      dict[item.id] = item.embedding;
    }
  });
  return dict;
}

let allData = [];
let currentData = [];

document.addEventListener("DOMContentLoaded", async () => {
  renderLoadingSkeleton();
  allData = await loadData();
  allData.forEach(item => {
    item.id = item.productId;
  });

  renderDropdown("categoryFilter", getCategories(allData));
  renderDropdown("brandFilter", getBrands(allData));

  renderCards(allData, [], true);

  document.getElementById("categoryFilter").addEventListener("change", applyFilter);
  document.getElementById("brandFilter").addEventListener("change", applyFilter);

  document.getElementById("hybridSearchInput").addEventListener("keydown", async (event) => {
    if (event.key === "Enter") {
      await handleSearch();
    }
  });

  document.getElementById("hybridSearchButton").addEventListener("click", handleSearch);

  const modalClose = document.getElementById("modalClose");
  if (modalClose) {
    modalClose.addEventListener("click", () => {
      document.getElementById("modal").classList.add("hidden");
    });
  }

  document.getElementById("modal").addEventListener("click", (e) => {
    if (e.target.id === "modal") {
      document.getElementById("modal").classList.add("hidden");
    }
  });
});

window.addEventListener("scroll", () => {
  const nearBottom =
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 300;

  const state = document.getElementById("loadMoreState");
  if (nearBottom && state) {
    loadMoreCards();
  }
});

// 搜尋邏輯統一化
async function handleSearch() {
  const keyword = document.getElementById("hybridSearchInput").value.trim();
  const searchMode = document.getElementById("searchMode").value;

  renderLoadingSkeleton();

  setTimeout(async () => {
    if (keyword) {
      const keywords = keyword.toLowerCase().split(/\s+/);

      if (searchMode === "semantic") {
        const { queryEmbedding } = await semanticSearchEmbeddingsOnly(allData, keyword);
        console.log("🔍 Query embedding:", queryEmbedding);

        const results = allData
          .filter(item => item.embedding)
          .map(item => ({
            ...item,
            score: cosineSimilarity(queryEmbedding, item.embedding)
          }))
          .sort((a, b) => b.score - a.score);

        console.log("🧠 Semantic Search Results:", results);
        currentData = results;
        renderCards(currentData, [], true);

      } else if (searchMode === "hybrid") {
        const { queryEmbedding } = await semanticSearchEmbeddingsOnly(allData, keyword);
        console.log("🔍 Query embedding:", queryEmbedding);

        const embeddingsDict = getEmbeddingsDict(allData);
        console.log("🧠 Embeddings Dict Sample:", Object.entries(embeddingsDict).slice(0, 3));

        const results = allData
          .filter(item => item.embedding && embeddingsDict[item.id])
          .map(item => {
            const sim = cosineSimilarity(queryEmbedding, embeddingsDict[item.id]);
            const normalizedRating = (item.rating || 0) / 100;
            const hybridScore = 0.5 * sim + 0.5 * normalizedRating;
            return {
              ...item,
              score: hybridScore
            };
          })
          .sort((a, b) => b.score - a.score);

        console.log("🤖 Hybrid Search Results (Sorted by Hybrid Score):", results);
        currentData = results;
        renderCards(currentData, keywords, true);

      } else {
        const results = searchProducts(allData, keyword);
        console.log("🔎 Keyword Search Results:", results);
        currentData = results;
        renderCards(currentData, keywords, true);
      }
    } else {
      currentData = allData;
      renderCards(currentData, [], true);
    }
  }, 400);
}

function applyFilter() {
  const categoryEl = document.getElementById("categoryFilter");
  const brandEl = document.getElementById("brandFilter");

  let selectedCategory = categoryEl.value;
  let selectedBrand = brandEl.value;

  if (categoryEl.selectedIndex > 0 && brandEl.selectedIndex === 0) {
    selectedBrand = "All";
  }
  if (brandEl.selectedIndex > 0 && categoryEl.selectedIndex === 0) {
    selectedCategory = "All";
  }

  const filtered = filterData(allData, selectedCategory, selectedBrand);
  const sorted = filtered.sort((a, b) => {
    const categoryCompare = (a.category || "").localeCompare(b.category || "");
    if (categoryCompare !== 0) return categoryCompare;
    return (b.rating || 0) - (a.rating || 0);
  });

  currentData = sorted;
  renderCards(currentData, [], true);
}
