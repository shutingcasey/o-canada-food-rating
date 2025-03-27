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
  loadMoreCards  // ✅ 加上這個！
} from "./view.js";

window.loadMoreCards = loadMoreCards;

import { 
  searchProducts 
} from "./search.js";

let allData = [];
let currentData = [];

document.addEventListener("DOMContentLoaded", async () => {
  // 顯示 loading skeleton
  renderLoadingSkeleton();

  // 載入 JSON 資料
  allData = await loadData();

  // 初始化下拉選單
  renderDropdown("categoryFilter", getCategories(allData));
  renderDropdown("brandFilter", getBrands(allData));

  // 顯示所有商品
  renderCards(allData, [], true);

  // 監聽篩選下拉選單
  document.getElementById("categoryFilter").addEventListener("change", applyFilter);
  document.getElementById("brandFilter").addEventListener("change", applyFilter);

  // 監聽 Enter 鍵觸發搜尋
  document.getElementById("hybridSearchInput").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      const keyword = event.target.value.trim();

      renderLoadingSkeleton();

      setTimeout(() => {
        if (keyword) {
          const results = searchProducts(allData, keyword);
          const keywords = keyword.toLowerCase().split(/\s+/);
          currentData = results;
          renderCards(currentData, keywords, true);     
        } else {
          currentData = allData;
          renderCards(currentData, [], true);       
        }
      }, 4000);
    }
  });

  // 監聽 Hybrid 搜尋按鈕
  document.getElementById("hybridSearchButton").addEventListener("click", () => {
    const keyword = document.getElementById("hybridSearchInput").value.trim();

    // Step 1：先顯示假卡片
    renderLoadingSkeleton();

    // Step 2：延遲再進行搜尋與渲染
    setTimeout(() => {
      if (keyword) {
        const results = searchProducts(allData, keyword);
        const keywords = keyword.toLowerCase().split(/\s+/);
        currentData = results;
        renderCards(currentData, keywords, true);        
      } else {
        currentData = allData;
        renderCards(currentData, [], true);        
      }
    }, 4000); 
  });

  // 產品Detail  關閉邏輯-關閉按鈕
  document.getElementById("modalClose").addEventListener("click", () => {
    document.getElementById("modal").classList.add("hidden");
  });

  // 產品Detail 關閉邏輯-點擊背景區域
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


// 篩選器邏輯
function applyFilter() {
  const categoryEl = document.getElementById("categoryFilter");
  const brandEl = document.getElementById("brandFilter");

  let selectedCategory = categoryEl.value;
  let selectedBrand = brandEl.value;

  // Default fallback to "All" if one is untouched
  if (categoryEl.selectedIndex > 0 && brandEl.selectedIndex === 0) {
    selectedBrand = "All";
  }
  if (brandEl.selectedIndex > 0 && categoryEl.selectedIndex === 0) {
    selectedCategory = "All";
  }

  // Filter based on selected category & brand
  const filtered = filterData(allData, selectedCategory, selectedBrand);

  // Sort by category A–Z, then by Canadian Score (high → low)
  const sorted = filtered.sort((a, b) => {
    const categoryCompare = (a.category || "").localeCompare(b.category || "");
    if (categoryCompare !== 0) return categoryCompare;

    return (b.rating || 0) - (a.rating || 0);
  });

  currentData = sorted;
  renderCards(currentData, [], true);  
}


