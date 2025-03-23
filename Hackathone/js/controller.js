import {
  loadData,
  getCategories,
  getBrands,
  filterData
} from "./model.js";

import {
  renderDropdown,
  renderCards
} from "./view.js";

import { searchProducts } from "./search.js"; // 引入 Hybrid Search 函式

let allData = [];

document.addEventListener("DOMContentLoaded", async () => {
  // 讀取所有資料
  allData = await loadData();

  // 初始化下拉選單
  renderDropdown("categoryFilter", getCategories(allData));
  renderDropdown("brandFilter", getBrands(allData));

  // 預設顯示全部商品
  renderCards(allData);

  // Category / Brand 篩選功能（原本的）
  document.getElementById("categoryFilter").addEventListener("change", applyFilter);
  document.getElementById("brandFilter").addEventListener("change", applyFilter);

  // Hybrid Search 搜尋欄位（新的）
  document.getElementById("hybridSearchButton").addEventListener("click", () => {
    const keyword = document.getElementById("hybridSearchInput").value.trim();
    if (keyword) {
      const results = searchProducts(allData, keyword);
      renderCards(results);
    } else {
      renderCards(allData); // 空白就顯示全部
    }
  });
});

// 篩選處理函式（只處理 Category 和 Brand）
function applyFilter() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  const selectedBrand = document.getElementById("brandFilter").value;

  const filtered = filterData(allData, selectedCategory, selectedBrand);
  renderCards(filtered);
}
