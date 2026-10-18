
import express from "express";
import cors from "cors";
import { products } from "../src/data.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ name: "ShopSphere API", status: "running" });
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/products", (req, res) => {
  let result = [...products];
  const { search, category, sort } = req.query;

  if (search) {
    const query = String(search).toLowerCase();
    result = result.filter(product =>
      `${product.name} ${product.category}`
        .toLowerCase()
        .includes(query)
    );
  }

  if (category && category !== "All") {
    result = result.filter(
      product => product.category.toLowerCase() ===
        String(category).toLowerCase()
    );
  }

  if (sort === "price-low") {
    result.sort((a, b) => a.price - b.price);
  } else if (sort === "price-high") {
    result.sort((a, b) => b.price - a.price);
  } else if (sort === "rating") {
    result.sort((a, b) => b.rating - a.rating);
  }

  res.json({ count: result.length, products: result });
});

app.get("/api/products/:id", (req, res) => {
  const product = products.find(
    item => item.id === req.params.id ||
      String(item.id) === req.params.id.replace("p", "")
  );

  if (!product) {
    return res.status(404).json({ error: "Product not found." });
  }

  res.json(product);
});

app.listen(PORT, () => {
  console.log(`ShopSphere API running at http://localhost:${PORT}`);
});
