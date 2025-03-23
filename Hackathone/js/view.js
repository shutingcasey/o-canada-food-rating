// 通用下拉選單渲染（支援灰色 placeholder）
export function renderDropdown(selectId, options) {
  const select = document.getElementById(selectId);
  select.innerHTML = "";

  // Placeholder 標籤
  const label = selectId === "categoryFilter" ? "Category" : "Brand";
  const placeholder = document.createElement("option");
  placeholder.textContent = label;
  placeholder.value = "";
  placeholder.disabled = true;
  placeholder.selected = true;
  placeholder.hidden = true;
  select.appendChild(placeholder);

  // 真正選項
  options.forEach((opt) => {
    const option = document.createElement("option");
    option.value = opt;
    option.textContent = opt;
    select.appendChild(option);
  });
}

// 商品卡片渲染
export function renderCards(data) {
  const container = document.getElementById("productContainer");
  container.innerHTML = ""; // 清除舊資料

  data.forEach((item) => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${item.productImage}" alt="${item.title}" />
      <h3>${item.title}</h3>

      <p><strong>Brand:</strong> ${item.brand || "Unknown"}</p>
      <p><strong>Category:</strong> ${item.category}</p>
      <p><strong>Country:</strong> ${item.country || "N/A"}</p>

      <p><strong>Product of Canada:</strong> ${
        item.product_of_canada ? "✅ Product of Canada" : "❌ Not Canadian"
      }</p>
      <p><strong>Made in Canada:</strong> ${
        item.made_in_canada ? "✅ Made in Canada" : "❌ Not Canadian"
      }</p>
      <p><strong>Prepared in Canada:</strong> ${
        item.prepared_in_canada
          ? "✅ Prepared in Canada"
          : "❌ Not Canadian"
      }</p>
    `;

    container.appendChild(card);
  });
}
