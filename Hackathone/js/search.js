// 搜尋欄位用的簡單詞彙同義詞
const synonymMap = {
    "ice cream": ["frozen dessert", "milk snack"],
    "juice": ["drink", "beverage"],
    "snack": ["chips", "cookies", "candy"],
    "organic": ["natural"],
    "canadian": ["made in canada", "product of canada"]
  };
  
  function normalize(text) {
    return text.toLowerCase();
  }
  
  function expandQuery(query) {
    const baseWords = normalize(query).split(/\s+/);
    let expanded = new Set(baseWords);
    baseWords.forEach((word) => {
      if (synonymMap[word]) {
        synonymMap[word].forEach((alt) => expanded.add(alt));
      }
    });
    return Array.from(expanded);
  }
  
  export function searchProducts(data, query) {
    const terms = expandQuery(query);
    return data.filter((item) => {
      const fields = [
        item.title || "",
        item.brand || "",
        item.category || "",
        item.description || ""
      ].map(normalize).join(" ");
  
      return terms.some((term) => fields.includes(term));
    });
  }
  