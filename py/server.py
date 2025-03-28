from flask import Flask, request, jsonify
from flask_cors import CORS
from sentence_transformers import SentenceTransformer
import os

app = Flask(__name__)
CORS(app)  # 允許跨域，讓前端可以訪問此 API

# 載入語意模型
model = SentenceTransformer("all-MiniLM-L6-v2")

@app.route("/embedding", methods=["POST"])
def generate_embedding():
    data = request.get_json()
    query = data.get("query", "")

    if not query:
        return jsonify({"error": "Missing query"}), 400

    embedding = model.encode(query).tolist()
    return jsonify({"embedding": embedding})

if __name__ == "__main__":
    app.run(debug=True)  # 預設跑在 localhost:5000
