function normalize(text) {
  return text.toLowerCase();
}

const synonymMap = {
  milk: ["dairy"],
  dairy: ["milk"]
};

function expandTerms(terms) {
  const expanded = new Set();
  terms.forEach((term) => {
    expanded.add(term);
    if (synonymMap[term]) {
      synonymMap[term].forEach((syn) => expanded.add(syn));
    }
  });
  return Array.from(expanded);
}

export function searchProducts(data, query) {
  const baseTerms = normalize(query).split(/\s+/);
  const terms = expandTerms(baseTerms);

  return data
    .map((item) => {
      const fields = [
        item.title || "",
        item.brand || "",
        item.category || "",
        item.description || ""
      ].map(normalize).join(" ");

      const titleMatch = terms.some((term) =>
        (item.title || "").toLowerCase().includes(term)
      );

      const textMatch = terms.some((term) => fields.includes(term));

      const isCanadianQuery = baseTerms.includes("canada") || baseTerms.includes("canadian");
      const canadianMatch = isCanadianQuery && item.product_of_canada === true;

      const matched = textMatch || canadianMatch;

      return matched
        ? { item, titleMatch, rating: item.rating || 0 }
        : null;
    })
    .filter(Boolean)
    .sort((a, b) => {
      if (b.titleMatch !== a.titleMatch) return b.titleMatch - a.titleMatch;
      return b.rating - a.rating;
    })
    .map((entry) => entry.item);
}



// // 搜尋欄位用的簡單詞彙同義詞
// const synonymMap = {
//     "ice cream": ["frozen dessert", "milk snack"],
//     "juice": ["drink", "beverage"],
//     "snack": ["chips", "cookies", "candy"],
//     "organic": ["natural"],
//     "canadian": ["made in canada", "product of canada"]
//   };
  
//   function normalize(text) {
//     return text.toLowerCase();
//   }
  
//   function expandQuery(query) {
//     const baseWords = normalize(query).split(/\s+/);
//     let expanded = new Set(baseWords);
//     baseWords.forEach((word) => {
//       if (synonymMap[word]) {
//         synonymMap[word].forEach((alt) => expanded.add(alt));
//       }
//     });
//     return Array.from(expanded);
//   }
  
//   export function searchProducts(data, query) {
//     const terms = expandQuery(query);
//     return data.filter((item) => {
//       const fields = [
//         item.title || "",
//         item.brand || "",
//         item.category || "",
//         item.description || ""
//       ].map(normalize).join(" ");
  
//       return terms.some((term) => fields.includes(term));
//     });
//   }
  