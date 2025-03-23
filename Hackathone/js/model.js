export async function loadData() {
  const res = await fetch("data/data.json");
  const data = await res.json();
  return data;
}

export function getCategories(data) {
  return ["All", ...new Set(data.map((item) => item.category).filter(Boolean))];
}

export function getBrands(data) {
  return ["All", ...new Set(data.map((item) => item.brand || "Unknown"))];
}

export function filterData(data, selectedCategory, selectedBrand) {
  return data.filter((item) => {
    const matchCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    const matchBrand =
      selectedBrand === "All" ||
      (item.brand || "Unknown") === selectedBrand;
    return matchCategory && matchBrand;
  });
}
