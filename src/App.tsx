
import { useEffect, useState } from "react";
import AdminPanel from "./AdminPanel";
import { getProducts, type Product } from "./products";

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [adminOpen, setAdminOpen] = useState(false);

  async function loadProducts() {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Products loading failed:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  const categories = [
    "All",
    ...Array.from(new Set(products.map((p) => p.category)))
  ];

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || p.category === category;

    return matchesSearch && matchesCategory;
  });

  if (adminOpen) {
    return (
      <div>
        <button
          onClick={() => setAdminOpen(false)}
          style={backButton}
        >
          ← Back to Store
        </button>
        <AdminPanel />
      </div>
    );
  }

  return (
    <main>
      <nav className="navbar">
        <a className="brand" href="#">
          ANSU<span>CREATE.</span>
        </a>

        <div className="nav-links">
          <a href="#products">Explore</a>
          <a href="#about">About</a>
          <button
            className="admin-button"
            onClick={() => setAdminOpen(true)}
          >
            Admin Login
          </button>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-content">
          <div className="eyebrow">
            <span className="dot" />
            DIGITAL PRODUCTS · BUILT WITH IDEAS
          </div>

          <h1>
            Ideas into
            <br />
            <span>Products.</span>
          </h1>

          <p>
            Discover useful apps, digital tools and resources
            designed to make your everyday life better.
          </p>

          <a className="hero-cta" href="#products">
            Explore Products <span>↗</span>
          </a>
        </div>

        <div className="hero-art">
          <div className="art-card card-back">CREATE.</div>
          <div className="art-card card-front">
            <div className="art-icon">A.</div>
            <div className="art-caption">YOUR NEXT IDEA</div>
            <div className="art-line" />
            <div className="art-small">MAKE IT REAL.</div>
          </div>
          <div className="art-orbit" />
        </div>
      </section>

      <section className="trust-strip">
        <span>INDEPENDENTLY CREATED</span>
        <span>✦</span>
        <span>DIGITAL FIRST</span>
        <span>✦</span>
        <span>MADE FOR YOU</span>
      </section>

      <section className="products-section" id="products">
        <div className="section-heading">
          <div>
            <div className="eyebrow">THE COLLECTION</div>
            <h2>Explore our products<span>.</span></h2>
            <p>Find something useful for your next big idea.</p>
          </div>
          <div className="product-count">
            {products.length} PRODUCTS
          </div>
        </div>

        <div className="filters">
          <input
            type="search"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="category-list">
            {categories.map((item) => (
              <button
                key={item}
                className={category === item ? "active" : ""}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="empty-state">Loading products...</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">✳</div>
            <h3>No products found</h3>
            <p>New creations will appear here soon.</p>
          </div>
        ) : (
          <div className="product-grid">
            {filtered.map((product) => (
              <article className="product-card" key={product.id}>
                <div className="product-image">
                  {product.image ? (
                    <img src={product.image} alt={product.title} />
                  ) : (
                    <div className="image-placeholder">A.</div>
                  )}
                  {product.featured && (
                    <span className="featured">FEATURED</span>
                  )}
                </div>

                <div className="product-info">
                  <span className="product-category">
                    {product.category}
                  </span>
                  <h3>{product.title}</h3>
                  <p>{product.description}</p>

                  <div className="product-bottom">
                    <div className="price">
                      ₹{product.price}
                      {product.oldPrice && (
                        <del>₹{product.oldPrice}</del>
                      )}
                    </div>

                    {product.downloadUrl ? (
                      <a
                        className="product-action"
                        href={product.downloadUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Get Product ↗
                      </a>
                    ) : (
                      <span className="product-action unavailable">
                        Coming Soon
                      </span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="about-section" id="about">
        <div className="about-mark">A.</div>
        <div>
          <div className="eyebrow">ABOUT ANSU CREATE</div>
          <h2>Small ideas.<br />Meaningful creations.</h2>
          <p>
            ANSU CREATE is an independent digital brand focused
            on creating useful apps, resources and digital products.
            Our goal is simple: turn ideas into something real.
          </p>
        </div>
      </section>

      <footer>
        <a className="brand" href="#">ANSU<span>CREATE.</span></a>
        <p>Ideas into Products.</p>
        <small>© {new Date().getFullYear()} ANSU CREATE. All rights reserved.</small>
      </footer>
    </main>
  );
}

const backButton: React.CSSProperties = {
  margin: 16,
  padding: "10px 18px",
  border: "1px solid #ddd",
  borderRadius: 10,
  background: "white",
  cursor: "pointer"
};
