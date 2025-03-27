import json

# 1. 載入商品資料
with open("data/data.json", "r", encoding="utf-8") as f:
    products = json.load(f)

# 2. 載入 embedding 向量
with open("data/embeddings.json", "r", encoding="utf-8") as f:
    embeddings = json.load(f)

# 3. 檢查資料筆數是否一致
if len(products) != len(embeddings):
    raise ValueError(f"❌ 商品數量（{len(products)}）與 embeddings 數量（{len(embeddings)}）不一致！")

# 4. 將每個 embedding 加到對應商品上
for i, product in enumerate(products):
    product["embedding"] = embeddings[i]

# 5. 儲存合併後的資料
with open("data/data_with_embeddings.json", "w", encoding="utf-8") as f:
    json.dump(products, f, ensure_ascii=False, indent=2)

print("✅ 合併完成！輸出為 data/data_with_embeddings.json")
