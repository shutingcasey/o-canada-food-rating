import {
  loadData,
  getCategories,
  getBrands,
  filterData
} from "./model.js";

import {
  renderDropdown,
  renderCards,
  renderLoadingSkeleton
} from "./view.js";

import { searchProducts } from "./search.js";

let allData = [];

document.addEventListener("DOMContentLoaded", async () => {
  // 顯示 loading skeleton
  renderLoadingSkeleton();

  // 載入 JSON 資料
  allData = await loadData();

  // 初始化下拉選單
  renderDropdown("categoryFilter", getCategories(allData));
  renderDropdown("brandFilter", getBrands(allData));

  // 顯示所有商品
  renderCards(allData);

  // 監聽篩選下拉選單
  document.getElementById("categoryFilter").addEventListener("change", applyFilter);
  document.getElementById("brandFilter").addEventListener("change", applyFilter);

  // 監聽 Hybrid 搜尋按鈕
  document.getElementById("hybridSearchButton").addEventListener("click", () => {
    const keyword = document.getElementById("hybridSearchInput").value.trim();

    setTimeout(() => {
      if (keyword) {
        const results = searchProducts(allData, keyword);
        const keywords = keyword.toLowerCase().split(/\s+/);
        renderCards(results, keywords);
      } else {
        renderCards(allData);
      }
    }, 300); // 模擬延遲，讓效果更自然
  });

  // Modal 關閉邏輯
  document.getElementById("modalClose").addEventListener("click", () => {
    document.getElementById("modal").classList.add("hidden");
  });

  document.getElementById("modal").addEventListener("click", (e) => {
    if (e.target.id === "modal") {
      document.getElementById("modal").classList.add("hidden");
    }
  });
});

// 篩選器邏輯（只處理 category + brand，不處理 keyword）
function applyFilter() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  const selectedBrand = document.getElementById("brandFilter").value;

  const filtered = filterData(allData, selectedCategory, selectedBrand);
  renderCards(filtered);
}
