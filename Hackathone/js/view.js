// 通用下拉選單渲染（支援灰色 placeholder）
export function renderDropdown(selectId, options) {
  const select = document.getElementById(selectId);
  select.innerHTML = "";

  const label = selectId === "categoryFilter" ? "Category" : "Brand";
  const placeholder = document.createElement("option");
  placeholder.textContent = label;
  placeholder.value = "";
  placeholder.disabled = true;
  placeholder.selected = true;
  placeholder.hidden = true;
  select.appendChild(placeholder);

  options.forEach((opt) => {
    const option = document.createElement("option");
    option.value = opt;
    option.textContent = opt;
    select.appendChild(option);
  });
}

// 顯示 Loading Skeleton 效果（假卡片）
export function renderLoadingSkeleton(count = 10) {
  const container = document.getElementById("productContainer");
  container.innerHTML = "";

  for (let i = 0; i < count; i++) {
    const skeleton = document.createElement("div");
    skeleton.className = "card skeleton-card";
    skeleton.innerHTML = `
      <div class="skeleton-image"></div>
      <div class="skeleton-line short"></div>
      <div class="skeleton-line"></div>
      <div class="skeleton-line"></div>
      <div class="skeleton-line"></div>
    `;
    container.appendChild(skeleton);
  }
}

// 商品卡片渲染（支援搜尋關鍵字高亮整張卡片＋點擊顯示詳情）
export function renderCards(data, keywords = []) {
  const container = document.getElementById("productContainer");
  container.innerHTML = "";

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
        item.prepared_in_canada ? "✅ Prepared in Canada" : "❌ Not Canadian"
      }</p>

      <p class="canadian-score">
        🇨🇦 Canadian Score: ${item.rating || "N/A"}/100
      </p>
    `;

    // 點擊卡片 → 開啟詳細 modal
    card.addEventListener("click", () => {
      const modal = document.getElementById("modal");
      const modalBody = document.getElementById("modalBody");

      modalBody.innerHTML = `
        <h2>${item.title}</h2>
        <img src="${item.productImage}" alt="${item.title}" style="width:100%; max-height:200px; object-fit:contain;">
        <p><strong>Brand:</strong> ${item.brand || "Unknown"}</p>
        <p><strong>Category:</strong> ${item.category}</p>
        <p><strong>Country:</strong> ${item.country || "N/A"}</p>
        <p><strong>Description:</strong> ${item.description || "No description available."}</p>
        <p><strong>🇨🇦 Product of Canada:</strong> ${item.product_of_canada ? "✅ Yes" : "❌ No"}</p>
        <p><strong>Made in Canada:</strong> ${item.made_in_canada ? "✅ Yes" : "❌ No"}</p>
        <p><strong>Prepared in Canada:</strong> ${item.prepared_in_canada ? "✅ Yes" : "❌ No"}</p>
        <p><strong>UFCW Brand:</strong> ${item.ufcw_brand ? "✅ Listed" : "❌ Not Listed"}</p>
        <p><strong>Made in Canada Grocery List:</strong> ${item.made_in_ca_list ? "✅ Listed" : "❌ Not Listed"}</p>
        <p><strong>Non-Canadian Brand:</strong> ${item.non_canadian_brand ? "✅ Yes" : "❌ No"}</p>
        <p><strong>Canadian Brand:</strong> ${item.canadian_brand ? "✅ Yes" : "❌ No"}</p>
        <p class="modal-score">🇨🇦 Canadian Score: ${item.rating || "N/A"}/100</p>

        <p><small>Source: UFCW List、Made in Canada Guide</small></p>
      `;

      modal.classList.remove("hidden");
    });

    container.appendChild(card);
  });
}
