
const API_URL = import.meta.env.VITE_API_URL || "/api";

export async function getProducts() {
  const response = await fetch(`${API_URL}/products`);

  if (!response.ok) {
    throw new Error("Failed to load products from the server.");
  }

  const data = await response.json();
  return data.products;
}

export async function getProductById(id) {
  const response = await fetch(`${API_URL}/products/${id}`);

  if (!response.ok) {
    throw new Error("Product not found.");
  }

  return response.json();
}
