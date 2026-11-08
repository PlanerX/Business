import { useEffect, useState } from "react";
import AdminPanel from "./AdminPanel";
import { getProducts, type Product } from "./products";

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminOpen, setAdminOpen] = useState(false);
  const [cart, setCart] = useState<Product[]>([]);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  async function loadProducts() {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Product loading error:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadProducts();
  }, []);

  const categories = [
    "All",
    "E-book",
    "App / APK",
    "Template",
    "Other"
  ];

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      category === "All" || product.category === category;

    const matchesSearch =
      product.title.toLowerCase().includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  if (adminOpen) {
    return (
      <div>
        <button
          onClick={() => setAdminOpen(false)}
          style={{
            margin: 15,
            padding: 12,
            borderRadius: 10,
            border: "1px solid #ddd",
            background: "white"
          }}
        >
          ← Back to Store
        </button>
        <AdminPanel />
      </div>
    );
  }

  return (
    <main style={{ fontFamily: "Arial, sans-serif", color: "#171321" }}>
      <nav style={styles.nav}>
        <strong>ANSU<span style={{ color: "#7955df" }}>CREATE.</span></strong>

        <div style={{ display: "flex", gap: 18 }}>
          <a href="#home">Home</a>
          <a href="#products">Products</a>
          <a href="#about">About</a>
          <button
            onClick={() => setAdminOpen(true)}
            style={styles.adminButton}
          >
            Admin
          </button>
        </div>
      </nav>

      <section id="home" style={styles.hero}>
        <p style={{ color: "#7955df", fontWeight: 700 }}>
          ✦ DIGITAL PRODUCTS, MADE SIMPLE
        </p>

        <h1>
          Ideas into
          <br />
          <span style={{ color: "#7955df" }}>Products.</span>
        </h1>

        <p>
          Discover useful digital products, creative tools, apps
          and resources designed to help you do more.
        </p>

        <a href="#products" style={styles.primaryButton}>
          Explore products →
        </a>
      </section>

      <section id="products" style={styles.collection}>
        <p style={{ color: "#7955df", fontWeight: 700 }}>
          THE COLLECTION
        </p>

        <h2>Explore our products.</h2>
        <p>Find something useful for your next idea.</p>

        <input
          style={styles.search}
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div style={styles.categories}>
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              style={{
                ...styles.category,
                background: category === item ? "#eee8ff" : "white"
              }}
            >
              {item}
            </button>
          ))}
        </div>

        {loading ? (
          <p>Loading products...</p>
        ) : (
          <div style={styles.grid}>
            {filteredProducts.map((product) => (
              <article key={product.id} style={styles.product}>
                <div style={styles.productImage}>
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover"
                      }}
                    />
                  ) : (
                    <span>✦</span>
                  )}
                </div>

                <div style={{ padding: 16 }}>
                  <small>{product.category}</small>
                  <h3>{product.title}</h3>
                  <p>{product.description}</p>

                  <strong>
                    {product.price === 0 ? "Free" : `₹${product.price}`}
                  </strong>

                  <button
                    style={styles.addButton}
                    onClick={() => setCart([...cart, product])}
                  >
                    Add +
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <p>No products found. Add products from Admin Dashboard.</p>
        )}
      </section>

      <section id="about" style={styles.about}>
        <h2>Ideas into Products.</h2>
        <p>Useful digital products. Simple experience.</p>
      </section>

      <footer style={styles.footer}>
        © 2026 ANSU CREATE. All rights reserved.
      </footer>

      <div style={styles.cart}>
        <strong>Your cart ({cart.length})</strong>
        <span>
          Total: ₹{cart.reduce((sum, item) => sum + item.price, 0)}
        </span>
        <button
          style={styles.primaryButton}
          onClick={() =>
            alert("Checkout is not connected yet.")
          }
        >
          Continue →
        </button>
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  nav: {
    padding: "18px 5%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #eee",
    flexWrap: "wrap",
    gap: 15
  },
  hero: {
    padding: "100px 8%",
    background: "#faf9ff",
    minHeight: 320
  },
  collection: {
    padding: "65px 8%",
    minHeight: 450
  },
  search: {
    width: "100%",
    maxWidth: 450,
    padding: 15,
    border: "1px solid #ddd",
    borderRadius: 10,
    marginTop: 20
  },
  categories: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    margin: "18px 0 30px"
  },
  category: {
    border: "1px solid #eee",
    borderRadius: 20,
    padding: "9px 15px"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 20
  },
  product: {
    border: "1px solid #eee",
    borderRadius: 15,
    overflow: "hidden"
  },
  productImage: {
    height: 160,
    background: "#e9e2ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 45,
    color: "#7955df"
  },
  addButton: {
    float: "right",
    border: 0,
    background: "#eee8ff",
    color: "#6845c8",
    padding: "9px 14px",
    borderRadius: 8
  },
  primaryButton: {
    display: "inline-block",
    background: "#7955df",
    color: "white",
    padding: "13px 20px",
    borderRadius: 9,
    textDecoration: "none",
    border: 0
  },
  adminButton: {
    border: 0,
    background: "#eee8ff",
    padding: "9px 14px",
    borderRadius: 8
  },
  about: {
    padding: 60,
    textAlign: "center",
    background: "#f8f6ff"
  },
  footer: {
    padding: 30,
    textAlign: "center"
  },
  cart: {
    position: "sticky",
    bottom: 0,
    background: "white",
    padding: 15,
    borderTop: "1px solid #eee",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap"
  }
};
