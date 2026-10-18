
import { useEffect, useState } from "react";
import { Link, Route, Routes, useParams } from "react-router-dom";
import { getProducts } from "./api.js";
import "./style.css";

const imageUrl = (image) =>
  image?.startsWith("http")
    ? image
    : `https://images.unsplash.com/${image}?auto=format&fit=crop&w=700&q=80`;

function Header({ cartCount }) {
  return (
    <header className="header">
      <Link to="/" className="logo">shop<span>sphere.</span></Link>
      <nav>
        <Link to="/">Discover</Link>
        <a href="/#products">Shop all</a>
        <Link to="/cart" className="cart-link">Bag ({cartCount})</Link>
      </nav>
    </header>
  );
}

function Home({ products, loading, error, addToCart }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("featured");

  const categories = [
    "All",
    ...new Set(products.map((product) => product.category))
  ];

  const filtered = products
    .filter((product) =>
      category === "All" || product.category === category
    )
    .filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === "low") return a.price - b.price;
      if (sort === "high") return b.price - a.price;
      if (sort === "rating") return b.rating - a.rating;
      return a.id - b.id;
    });

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">THE EVERYDAY EDIT · 2026</p>
          <h1>Find things<br />you'll <em>love.</em></h1>
          <p className="hero-text">
            Thoughtfully selected essentials for your everyday life.
            Discover something special.
          </p>
          <a href="#products" className="primary-button">
            Explore collection ↗
          </a>
        </div>
        <div className="hero-art">
          <img
            src={imageUrl("photo-1490312278390-ab64016e0aa9")}
            alt="Lifestyle collection"
          />
          <div className="hero-note">GOOD THINGS, WELL CHOSEN.</div>
        </div>
      </section>

      <main className="catalog" id="products">
        <div className="section-heading">
          <div>
            <p className="eyebrow">OUR COLLECTION</p>
            <h2>Made for your everyday.</h2>
          </div>
          <span className="product-count">
            {loading ? "Loading..." : `${filtered.length} products`}
          </span>
        </div>

        {error && <p className="empty">{error}</p>}

        <div className="toolbar">
          <input
            aria-label="Search products"
            placeholder="Search products..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <div className="category-list">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={category === item ? "category active" : "category"}
              >
                {item}
              </button>
            ))}
          </div>

          <select
            aria-label="Sort products"
            value={sort}
            onChange={(event) => setSort(event.target.value)}
          >
            <option value="featured">Featured</option>
            <option value="low">Price: low to high</option>
            <option value="high">Price: high to low</option>
            <option value="rating">Top rated</option>
          </select>
        </div>

        {loading ? (
          <p className="empty">Loading products from ShopSphere API...</p>
        ) : (
          <div className="product-grid">
            {filtered.map((product) => (
              <article className="product-card" key={product.id}>
                <Link
                  to={`/product/${product.id}`}
                  className="product-image"
                >
                  <img
                    src={imageUrl(product.image)}
                    alt={product.name}
                    loading="lazy"
                  />
                  <span className="rating">★ {product.rating}</span>
                </Link>

                <p className="product-category">{product.category}</p>

                <Link
                  to={`/product/${product.id}`}
                  className="product-name"
                >
                  {product.name}
                </Link>

                <div className="product-bottom">
                  <strong>
                    ₹{product.price.toLocaleString("en-IN")}
                  </strong>
                  <button
                    className="add-button"
                    onClick={() => addToCart(product)}
                  >
                    + Add
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <p className="empty">No matching products found.</p>
        )}
      </main>
    </>
  );
}

function ProductDetail({ products, loading, addToCart }) {
  const { id } = useParams();
  const product = products.find((item) => String(item.id) === id);

  if (loading) {
    return <main className="empty-page"><h2>Loading product...</h2></main>;
  }

  if (!product) {
    return (
      <main className="empty-page">
        <h2>Product not found</h2>
        <Link to="/">Back to shop</Link>
      </main>
    );
  }

  return (
    <main className="detail-page">
      <img src={imageUrl(product.image)} alt={product.name} />
      <div>
        <p className="eyebrow">{product.category}</p>
        <h1>{product.name}</h1>
        <p className="detail-rating">★ {product.rating} / 5</p>
        <h2>₹{product.price.toLocaleString("en-IN")}</h2>
        <p className="hero-text">
          A thoughtfully selected everyday essential, designed to bring
          style and practicality into your routine.
        </p>
        <button
          className="primary-button"
          onClick={() => addToCart(product)}
        >
          Add to bag
        </button>
        <p><Link to="/">← Continue shopping</Link></p>
      </div>
    </main>
  );
}

function Cart({ cart, changeQuantity, removeItem }) {
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <main className="cart-page">
      <p className="eyebrow">YOUR SELECTION</p>
      <h1>Your shopping bag.</h1>

      {cart.length === 0 ? (
        <div className="empty">
          <p>Your bag is waiting for something lovely.</p>
          <Link className="primary-button" to="/">Explore products</Link>
        </div>
      ) : (
        <>
          {cart.map((item) => (
            <div className="cart-item" key={item.id}>
              <img src={imageUrl(item.image)} alt={item.name} />

              <div className="cart-info">
                <h3>{item.name}</h3>
                <p>₹{item.price.toLocaleString("en-IN")}</p>

                <div className="quantity">
                  <button
                    onClick={() => changeQuantity(item.id, -1)}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => changeQuantity(item.id, 1)}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                  <button
                    className="remove"
                    onClick={() => removeItem(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>

              <strong>
                ₹{(item.price * item.quantity).toLocaleString("en-IN")}
              </strong>
            </div>
          ))}

          <div className="cart-total">
            <span>Subtotal</span>
            <strong>₹{total.toLocaleString("en-IN")}</strong>
          </div>

          <button
            className="primary-button"
            onClick={() =>
              alert("Demo checkout only — no real payment is processed.")
            }
          >
            Continue to checkout ↗
          </button>

          <p className="fine-print">
            Demo storefront. Checkout does not process real payments.
          </p>
        </>
      )}
    </main>
  );
}

export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("shopsphere-cart") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    getProducts()
      .then((data) => {
        setProducts(data);
        setError("");
      })
      .catch((err) => {
        console.error("Product API error:", err);
        setError(
          "Unable to load products. Check that the backend server is running."
        );
      })
      .finally(() => setLoading(false));
  }, []);

  const saveCart = (nextCart) => {
    setCart(nextCart);
    localStorage.setItem("shopsphere-cart", JSON.stringify(nextCart));
  };

  const addToCart = (product) => {
    const existing = cart.find((item) => item.id === product.id);

    saveCart(
      existing
        ? cart.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [...cart, { ...product, quantity: 1 }]
    );
  };

  const changeQuantity = (id, amount) => {
    saveCart(
      cart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + amount }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id) =>
    saveCart(cart.filter((item) => item.id !== id));

  const cartCount = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <div className="app-shell">
      <Header cartCount={cartCount} />

      <Routes>
        <Route
          path="/"
          element={
            <Home
              products={products}
              loading={loading}
              error={error}
              addToCart={addToCart}
            />
          }
        />

        <Route
          path="/product/:id"
          element={
            <ProductDetail
              products={products}
              loading={loading}
              addToCart={addToCart}
            />
          }
        />

        <Route
          path="/cart"
          element={
            <Cart
              cart={cart}
              changeQuantity={changeQuantity}
              removeItem={removeItem}
            />
          }
        />

        <Route
          path="*"
          element={
            <main className="empty-page">
              <h2>Page not found</h2>
              <Link to="/">Back to shop</Link>
            </main>
          }
        />
      </Routes>

      <footer className="footer">
        <Link to="/" className="logo">shop<span>sphere.</span></Link>
        <p>Thoughtfully selected, made for everyday.</p>
        <small>© 2026 ShopSphere · Demo storefront</small>
      </footer>
    </div>
  );
}
