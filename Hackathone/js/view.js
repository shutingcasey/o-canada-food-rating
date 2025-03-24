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
export function renderCards(data, keywords = []) {
  const container = document.getElementById("productContainer");
  container.innerHTML = "";

  data.forEach((item) => {
    const card = document.createElement("div");
    card.className = "card";

    let levelText = "";
    if (item.rating >= 80) {
      levelText = "🍁🍁🍁 Very Canadian";
    } else if (item.rating >= 50) {
      levelText = "🍁🍁 Somewhat Canadian";
    } else {
      levelText = "🍁 Not Very Canadian";
    }

    card.innerHTML = `
      <img src="${item.productImage}" alt="${item.title}" />
      <h3>${item.title}</h3>

      <p><strong>Brand:</strong> ${item.brand || "Unknown"}</p>
      <p><strong>Category:</strong> ${item.category}</p>
      <p><strong>Country of Origin:</strong> ${item.country || "N/A"}</p>

      ${item.product_of_canada ? `<p><strong>Product of Canada:</strong> ✅ Product of Canada</p>` : ""}
      ${item.made_in_canada ? `<p><strong>Made in Canada:</strong> ✅ Made in Canada</p>` : ""}
      ${item.prepared_in_canada ? `<p><strong>Prepared in Canada:</strong> ✅ Prepared in Canada</p>` : ""}

      <p class="canadian-level">Rating: ${levelText}</p>

      <p class="canadian-score">
        🇨🇦 Canadian Score: ${item.rating || "N/A"}
      </p>
    `;


    // card.innerHTML = `
    //   <img src="${item.productImage}" alt="${item.title}" />
    //   <h3>${item.title}</h3>

    //   <p><strong>Brand:</strong> ${item.brand || "Unknown"}</p>
    //   <p><strong>Category:</strong> ${item.category}</p>
    //   <p><strong>Country:</strong> ${item.country || "N/A"}</p>

    //   <p><strong>Product of Canada:</strong> ${
    //     item.product_of_canada ? "✅ Product of Canada" : "❌ Not Canadian"
    //   }</p>
    //   <p><strong>Made in Canada:</strong> ${
    //     item.made_in_canada ? "✅ Made in Canada" : "❌ Not Canadian"
    //   }</p>
    //   <p><strong>Prepared in Canada:</strong> ${
    //     item.prepared_in_canada ? "✅ Prepared in Canada" : "❌ Not Canadian"
    //   }</p>

    //   <p class="canadian-level">
    //   Rating:${levelText}</p>
      
    //   <p class="canadian-score">
    //     🇨🇦 Canadian Score: ${item.rating || "N/A"}
    //   </p>
      
    // `;

    // 點擊卡片 → 開啟詳細 modal
    card.addEventListener("click", () => {
      const modal = document.getElementById("modal");
      const modalBody = document.getElementById("modalBody");

      let modalLevel = "";
      if (item.rating >= 80) {
        modalLevel = "🍁🍁🍁 Very Canadian";
      } else if (item.rating >= 50) {
        modalLevel = "🍁🍁 Somewhat Canadian";
      } else {
        modalLevel = "🍁 Not Very Canadian";
      }
      levelText = "🥇 Very Canadian";

      modalBody.innerHTML = `
        <h2>${item.title}</h2>
        <img src="${item.productImage}" alt="${item.title}" style="width:100%; max-height:200px; object-fit:contain;">
      
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
          ${item.made_in_ca_list ? `<div class="flag"><strong>Grocery List:</strong> ✅ Listed</div>` : ""}
          ${item.canadian_brand ? `<div class="flag"><strong>Canadian Brand:</strong> ✅ Yes</div>` : ""}
          <div class="flag"><strong>Non-Canadian Brand:</strong> ${item.non_canadian_brand ? "⚠️ Yes" : "✅ No"}</div>
        </div>
      
        <p class="modal-level"><strong>Rating:</strong> ${modalLevel}</p>
        <p class="modal-score">🇨🇦 <strong>Canadian Score:</strong> ${item.rating || "N/A"}/100</p>
        <p><small>Source: UFCW List、Made in Canada Guide</small></p>
    `;
    

      // modalBody.innerHTML = `
      //   <h2>${item.title}</h2>
      //   <img src="${item.productImage}" alt="${item.title}" style="width:100%; max-height:200px; object-fit:contain;">

      //   <div class="modal-info">
      //     <p><strong>Brand:</strong> ${item.brand || "Unknown"}</p>
      //     <p><strong>Category:</strong> ${item.category}</p>
      //     <p><strong>Country:</strong> ${item.country || "N/A"}</p>
      //     <p><strong>Description:</strong> ${item.description || "No description available."}</p>
      //   </div>

      //   <div class="modal-flags">
      //     <div class="flag"><strong>Product of Canada:</strong> ${item.product_of_canada ? "✅ Yes" : "❌ No"}</div>
      //     <div class="flag"><strong>Made in Canada:</strong> ${item.made_in_canada ? "✅ Yes" : "❌ No"}</div>
      //     <div class="flag"><strong>Prepared:</strong> ${item.prepared_in_canada ? "✅ Yes" : "❌ No"}</div>
      //     <div class="flag"><strong>UFCW Brand:</strong> ${item.ufcw_brand ? "✅ Listed" : "❌ No"}</div>
      //     <div class="flag"><strong>Grocery List:</strong> ${item.made_in_ca_list ? "✅ Listed" : "❌ No"}</div>
      //     <div class="flag"><strong>Non-Canadian Brand:</strong> ${item.non_canadian_brand ? "⚠️ Yes" : "✅ No"}</div>
      //     <div class="flag"><strong>Canadian Brand:</strong> ${item.canadian_brand ? "✅ Yes" : "❌ No"}</div>
      //   </div>
      //   <p class="modal-level"><strong>Rating:</strong>${modalLevel}</p>
      //   <p class="modal-score">🇨🇦 <strong>Canadian Score:</strong> ${item.rating || "N/A"}/100</p>
      //   <p><small>Source: UFCW List、Made in Canada Guide</small></p>
      // `;

      modal.classList.remove("hidden");
    });

    container.appendChild(card);
  });
}