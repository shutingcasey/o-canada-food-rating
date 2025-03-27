from sentence_transformers import SentenceTransformer
from tqdm import tqdm
import json
import os

# === 1. 載入模型 ===
print("🚀 Loading embedding model...")
model = SentenceTransformer("all-MiniLM-L6-v2")

# === 2. 載入原始資料 ===
data_path = "data/data.json"
if not os.path.exists(data_path):
    raise FileNotFoundError(f"❌ Cannot find file: {data_path}")

print("📄 Loading product data...")
with open(data_path, "r", encoding="utf-8") as f:
    products = json.load(f)

# === 3. 產生要轉換的文字欄位 ===
texts = [
    f"{item.get('title', '')} {item.get('brand', '')} {item.get('category', '')} {item.get('description', '')}".strip()
    for item in products
]

# === 4. 建立 Embeddings with Progress Bar ===
print("🔢 Generating embeddings...")
embeddings = []
for text in tqdm(texts, desc="Encoding", ncols=80):
    emb = model.encode(text)
    embeddings.append(emb.tolist())

# === 5. 儲存到 JSON 檔 ===
output_path = "data/embeddings.json"
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(embeddings, f)

print(f"✅ Embeddings saved to: {output_path}")
