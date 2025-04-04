function normalize(text) {
  return text.toLowerCase();
}

// Expanded to handle phrase-level synonyms
const synonymMap = {
  milk: ["dairy"],
  dairy: ["milk"],
  "locally produced dairy": ["milk", "canadian", "product_of_canada"]
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
  const normalizedQuery = normalize(query);

  // Check for full phrase matches first
  const phraseMatches = Object.keys(synonymMap).filter((phrase) =>
    normalizedQuery.includes(phrase)
  );

  const baseTerms = normalizedQuery.split(/\s+/);
  const allTerms = [...baseTerms, ...phraseMatches];
  const terms = expandTerms(allTerms);

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

      const isCanadianQuery = terms.includes("canada") || terms.includes("canadian") || terms.includes("product_of_canada");
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

  