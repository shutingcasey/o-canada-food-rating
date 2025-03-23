fetch("data.json")
  .then((res) => res.json())
  .then((data) => {
    const container = document.getElementById("productContainer");
    const filter = document.getElementById("categoryFilter");

    // 建立分類清單
    const categories = ["All", ...new Set(data.map((item) => item.category))];
    categories.forEach((cat) => {
      const opt = document.createElement("option");
      opt.value = cat;
      opt.textContent = cat;
      filter.appendChild(opt);
    });

    // 顯示卡片
    function render(products) {
      container.innerHTML = "";
      products.forEach((p) => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
          <img src="${p.productImage}" alt="${p.title}" />
          <h3>${p.title}</h3>
          <p><strong>Brand:</strong> ${p.brand || "Unknown"}</p>
          <p><strong>Category:</strong> ${p.category}</p>
          <p><strong>Country:</strong> ${p.country || "N/A"}</p>
          <p><strong>Canadian:</strong> ${
            p.product_of_canada
              ? "✅ Product of Canada"
              : p.made_in_canada
              ? "⚠️ Made in Canada"
              : p.prepared_in_canada
              ? "📦 Prepared in Canada"
              : "❌ Not Canadian"
          }</p>
        `;
        container.appendChild(card);
      });
    }

    // 初始顯示
    render(data);

    // 篩選功能
    filter.addEventListener("change", (e) => {
      const val = e.target.value;
      const filtered = val === "All" ? data : data.filter(d => d.category === val);
      render(filtered);
    });
  });
