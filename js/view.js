let currentPage = 1;
const ITEMS_PER_PAGE = 24;
let currentData = [];

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
export function renderLoadingSkeleton(count = 15) {
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
export function renderCards(data, keywords = [], reset = true) {
  const container = document.getElementById("productContainer");

  if (reset) {
    container.innerHTML = "";
    currentPage = 1;
    const endIndicator = document.getElementById("scroll-end");
    if (endIndicator) endIndicator.style.display = "none";
  }

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = currentPage * ITEMS_PER_PAGE;
  const pageItems = data.slice(startIndex, endIndex);

  if (pageItems.length === 0) {
    document.getElementById("scroll-end").style.display = "block";
    return;
  }

  const fragment = document.createDocumentFragment();

  pageItems.forEach((item) => {
    const card = document.createElement("div");
    card.className = "card";

    let levelText = item.rating >= 80
      ? "🍁🍁🍁 Very Canadian"
      : item.rating >= 50
      ? "🍁🍁 Somewhat Canadian"
      : "🍁 Not Very Canadian";

    const scoreBar = item.rating ? `
      <div style="background-color: #ddd; height: 20px; width: 100%; border-radius: 10px; overflow: hidden; margin: 8px 0;">
        <div style="height: 100%; width: ${item.rating}%; background-color: hsl(${120 - (item.rating * 1.2)}, 70%, 50%);"></div>
      </div>
    ` : "";

    card.innerHTML = `
      <img src="${item.productImage}" alt="${item.title}" loading="lazy" />
      <h3>${item.title}</h3>
      ${scoreBar}
      <p class="canadian-score" style="color: #d32f2f; font-size: 1.3rem; font-weight: bold;">🇨🇦 Canadian Score: ${item.rating || "N/A"}</p> 
      <p class="canadian-level" style="font-size: 1.1rem; font-weight: bold;">${levelText}</p>
      <p><strong>Brand:</strong> ${item.brand || "Unknown"}</p>
      <p><strong>Category:</strong> ${item.category}</p>
      <p><strong>Country of Origin:</strong> ${item.country || "N/A"}</p>
      ${item.product_of_canada ? `<p><strong>Product of Canada:</strong> ✅ Product of Canada</p>` : ""}
      ${item.made_in_canada ? `<p><strong>Made in Canada:</strong> ✅ Made in Canada</p>` : ""}
      ${item.prepared_in_canada ? `<p><strong>Prepared in Canada:</strong> ✅ Prepared in Canada</p>` : ""}
      ${typeof item.score === "number" ? `<p class="semantic-score"><small><strong>Semantic Score:</strong> ${item.score.toFixed(4)}</small></p>` : ""}
    `;

    card.addEventListener("click", () => {
      const modal = document.getElementById("modal");
      const modalBody = document.getElementById("modalBody");

      let modalLevel = item.rating >= 80
        ? "🍁🍁🍁 Very Canadian"
        : item.rating >= 50
        ? "🍁🍁 Somewhat Canadian"
        : "🍁 Not Very Canadian";

      const modalScoreBar = item.rating ? `
        <div style="background-color: #ddd; height: 20px; width: 100%; border-radius: 10px; overflow: hidden; margin: 8px 0;">
          <div style="height: 100%; width: ${item.rating}%; background-color: hsl(${120 - (item.rating * 1.2)}, 70%, 50%);"></div>
        </div>
      ` : "";

      modalBody.innerHTML = `
        <h2>${item.title}</h2>
        <img src="${item.productImage}" alt="${item.title}" style="width:100%; max-height:200px; object-fit:contain;">
        ${modalScoreBar}
        <p class="modal-score" style="color: #d32f2f;"><strong>Canadian Score:</strong> ${item.rating || "N/A"}/100</p>
        <p class="modal-level"><strong>${modalLevel}</strong></p>
        <div class="modal-info">
          <p><strong>Brand:</strong> ${item.brand || "Unknown"}</p>
          <p><strong>Category:</strong> ${item.category}</p>
          <p><strong>Country:</strong> ${item.country || "N/A"}</p>
          <p><strong>Description:</strong> ${item.description || "No description available."}</p>
        </div>
        <div class="modal-flags">
          ${item.product_of_canada ? `<div class="flag"><strong>Product of Canada:</strong> ✅ Yes</div>` : ""}
          ${item.made_in_canada ? `<div class="flag"><strong>Made in Canada:</strong> ✅ Yes</div>` : ""}
          ${item.prepared_in_canada ? `<div class="flag"><strong>Prepared in Canada:</strong> ✅ Yes</div>` : ""}
          ${item.ufcw_brand ? `<div class="flag"><strong>UFCW Brand:</strong> ✅ Listed</div>` : ""}
          ${item.canadian_brand ? `<div class="flag"><strong>Canadian Brand:</strong> ✅ Yes</div>` : ""}
          ${!item.canadian_brand ? `<div class="flag"><strong>Non-Canadian Brand:</strong> ${item.non_canadian_brand ? "⚠️ Yes" : "✅ No"}</div>` : ""}
        </div>
        ${typeof item.score === "number" ? `<p class="modal-semantic-score"><small><strong>Semantic Score:</strong> ${item.score.toFixed(4)}</small></p>` : ""}
        <p><small>Source: UFCW List、Made in Canada Guide</small></p>
      `;

      modal.classList.remove("hidden");
    });

    fragment.appendChild(card);
  });

  container.appendChild(fragment);

  let scrollState = document.getElementById("loadMoreState");
  if (!scrollState) {
    scrollState = document.createElement("div");
    scrollState.id = "loadMoreState";
    scrollState.style.display = "none";
    document.body.appendChild(scrollState);
  }
  scrollState.dataset.fullData = JSON.stringify(data);
  scrollState.dataset.keywords = JSON.stringify(keywords);
}

export function loadMoreCards() {
  const state = document.getElementById("loadMoreState");
  if (!state) return;

  currentPage++;

  const data = JSON.parse(state.dataset.fullData || "[]");
  const keywords = JSON.parse(state.dataset.keywords || "[]");

  console.log("Loading page:", currentPage, "Items:", data.length);

  renderCards(data, keywords, false);
}
