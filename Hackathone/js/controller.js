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

let allData = [];

document.addEventListener("DOMContentLoaded", async () => {
  // 讀取資料
  allData = await loadData();

  // 取得分類與品牌列表
  const categories = getCategories(allData);
  const brands = getBrands(allData);

  // 渲染下拉選單
  renderDropdown("categoryFilter", categories);
  renderDropdown("brandFilter", brands);

  // 初次渲染全部卡片
  renderCards(allData);

  // 綁定事件（篩選）
  document
    .getElementById("categoryFilter")
    .addEventListener("change", applyFilter);

  document
    .getElementById("brandFilter")
    .addEventListener("change", applyFilter);
});

// 根據兩個篩選器值篩選資料
function applyFilter() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  const selectedBrand = document.getElementById("brandFilter").value;

  const filtered = filterData(allData, selectedCategory, selectedBrand);
  renderCards(filtered);
}
