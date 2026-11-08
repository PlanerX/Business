
import { useState } from "react";
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  ArrowRight,
  Sparkles,
  BookOpen,
  Smartphone,
  LayoutTemplate,
  ShieldCheck,
  Plus,
  Lock,
  Package
} from "lucide-react";

type Product = {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  oldPrice?: number;
  coverUrl: string;
  downloadUrl: string;
  featured?: boolean;
};

const starterProducts: Product[] = [
  {
    id: 1,
    title: "Digital Creator Guide",
    description: "A beginner-friendly guide to digital creation.",
    category: "E-book",
    price: 99,
    oldPrice: 149,
    coverUrl: "",
    downloadUrl: "",
    featured: true
  },
  {
    id: 2,
    title: "Productivity Planner",
    description: "Organize your goals and daily tasks.",
    category: "Template",
    price: 49,
    coverUrl: "",
    downloadUrl: ""
  },
  {
    id: 3,
    title: "Labs AI",
    description: "Explore an AI-powered productivity experience.",
    category: "App / APK",
    price: 0,
    coverUrl: "",
    downloadUrl: "",
    featured: true
  }
];

const categories = ["All", "E-book", "App / APK", "Template", "Other"];

export default function App() {
  const [products, setProducts] = useState<Product[]>(starterProducts);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<Product[]>([]);
  const [adminOpen, setAdminOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "E-book",
    price: "0",
    oldPrice: "",
    coverUrl: "",
    downloadUrl: ""
  });

  const filtered = products.filter((product) => {
    const matchesCategory =
      category === "All" || product.category === category;
    const matchesSearch =
      product.title.toLowerCase().includes(search.toLowerCase()) ||
      product.description.toLowerCase().includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  function saveProduct() {
    if (!form.title.trim()) {
      alert("Please enter a product name.");
      return;
    }

    const product: Product = {
      id: editing?.id ?? Date.now(),
      title: form.title,
      description: form.description,
      category: form.category,
      price: Number(form.price) || 0,
      oldPrice: Number(form.oldPrice) || undefined,
      coverUrl: form.coverUrl,
      downloadUrl: form.downloadUrl
    };

    if (editing) {
      setProducts((old) =>
        old.map((item) => item.id === editing.id ? product : item)
      );
    } else {
      setProducts((old) => [...old, product]);
    }

    setEditing(null);
    setForm({
      title: "",
      description: "",
      category: "E-book",
      price: "0",
      oldPrice: "",
      coverUrl: "",
      downloadUrl: ""
    });
  }

  function editProduct(product: Product) {
    setEditing(product);
    setForm({
      title: product.title,
      description: product.description,
      category: product.category,
      price: String(product.price),
      oldPrice: String(product.oldPrice ?? ""),
      coverUrl: product.coverUrl,
      downloadUrl: product.downloadUrl
    });
  }

  function deleteProduct(id: number) {
    if (confirm("Delete this product?")) {
      setProducts((old) => old.filter((item) => item.id !== id));
    }
  }

  function checkout() {
    if (!cart.length) return;
    alert(
      "Your cart is ready. Online payment and secure delivery will be connected after backend setup."
    );
  }

  return (
    <div className="app">
      <header className="navbar">
        <a className="brand" href="#">
          ANSU<span>CREATE.</span>
        </a>

        <nav className={mobileMenu ? "nav-links active" : "nav-links"}>
          <a href="#home" onClick={() => setMobileMenu(false)}>Home</a>
          <a href="#products" onClick={() => setMobileMenu(false)}>Products</a>
          <a href="#about" onClick={() => setMobileMenu(false)}>About</a>
        </nav>

        <div className="nav-actions">
          <button className="icon-btn" onClick={() => setCart([])} title="Clear cart">
            <ShoppingBag size={19} />
            <span>{cart.length}</span>
          </button>
          <button className="menu-btn" onClick={() => setMobileMenu(!mobileMenu)}>
            {mobileMenu ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-content">
            <div className="eyebrow">
              <Sparkles size={15} /> DIGITAL PRODUCTS, MADE SIMPLE
            </div>

            <h1>
              Ideas into
              <span> Products.</span>
            </h1>

            <p>
              Discover useful digital products, creative tools,
              apps and resources designed to help you do more.
            </p>

            <a href="#products" className="primary-btn">
              Explore products <ArrowRight size={17} />
            </a>

            <div className="hero-note">
              <ShieldCheck size={16} /> Digital products. Simple experience.
            </div>
          </div>

          <div className="hero-art">
            <div className="art-card card-one">
              <BookOpen size={28} />
              <strong>E-books</strong>
              <small>Learn something new</small>
            </div>
            <div className="art-card card-two">
              <Smartphone size={28} />
              <strong>Apps & Tools</strong>
              <small>Ideas made useful</small>
            </div>
            <div className="art-card card-three">
              <LayoutTemplate size={28} />
              <strong>Templates</strong>
              <small>Create with ease</small>
            </div>
            <div className="art-orb"></div>
          </div>
        </section>

        <section className="trust-strip">
          <div><Sparkles size={17} /> Curated digital products</div>
          <div><ShieldCheck size={17} /> Simple shopping experience</div>
          <div><Package size={17} /> Digital-first collection</div>
        </section>

        <section className="products-section" id="products">
          <div className="section-heading">
            <div>
              <span className="eyebrow">THE COLLECTION</span>
              <h2>Explore our products.</h2>
              <p>Find something useful for your next idea.</p>
            </div>
            <span className="product-count">{filtered.length} products</span>
          </div>

          <div className="product-tools">
            <div className="search-box">
              <Search size={18} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
              />
            </div>

            <div className="filters">
              {categories.map((item) => (
                <button
                  key={item}
                  className={category === item ? "filter active" : "filter"}
                  onClick={() => setCategory(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="product-grid">
            {filtered.map((product) => (
              <article className="product-card" key={product.id}>
                <div className="product-image">
                  {product.coverUrl ? (
                    <img src={product.coverUrl} alt={product.title} />
                  ) : (
                    <div className="placeholder-art">
                      {product.category === "E-book" ? (
                        <BookOpen size={43} />
                      ) : product.category === "App / APK" ? (
                        <Smartphone size={43} />
                      ) : (
                        <LayoutTemplate size={43} />
                      )}
                    </div>
                  )}
                  {product.featured && <span className="featured-tag">FEATURED</span>}
                </div>

                <div className="product-info">
                  <span className="product-category">{product.category}</span>
                  <h3>{product.title}</h3>
                  <p>{product.description}</p>

                  <div className="product-bottom">
                    <div className="price">
                      <strong>{product.price === 0 ? "Free" : `₹${product.price}`}</strong>
                      {product.oldPrice && (
                        <del>₹{product.oldPrice}</del>
                      )}
                    </div>
                    <button
                      className="add-btn"
                      onClick={() => setCart((old) => [...old, product])}
                    >
                      Add <Plus size={15} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="empty">
              <Package size={35} />
              <h3>No products found</h3>
              <p>Try another search or category.</p>
            </div>
          )}
        </section>

        <section className="about-section" id="about">
          <div className="about-icon"><Sparkles size={27} /></div>
          <span className="eyebrow">OUR IDEA</span>
          <h2>Small ideas.<br />Useful products.</h2>
          <p>
            ANSU CREATE is a digital product space built around
            creativity, technology and useful ideas.
          </p>
        </section>
      </main>

      <footer className="footer">
        <a className="brand" href="#">ANSU<span>CREATE.</span></a>
        <p>Ideas into Products.</p>
        <small>© {new Date().getFullYear()} ANSU CREATE. All rights reserved.</small>
      </footer>

      <div className="cart-panel">
        <div>
          <strong><ShoppingBag size={17} /> Your cart ({cart.length})</strong>
          <span>
            Total: ₹{cart.reduce((sum, item) => sum + item.price, 0)}
          </span>
        </div>
        <button onClick={checkout} disabled={!cart.length}>
          Continue <ArrowRight size={16} />
        </button>
      </div>

      <button className="admin-trigger" onClick={() => setAdminOpen(!adminOpen)}>
        <Lock size={15} /> Admin
      </button>

      {adminOpen && (
        <div className="admin-overlay">
          <div className="admin-panel">
            <div className="admin-header">
              <div>
                <span className="eyebrow">STORE MANAGEMENT</span>
                <h2>Admin dashboard</h2>
              </div>
              <button className="icon-btn" onClick={() => setAdminOpen(false)}>
                <X />
              </button>
            </div>

            <div className="admin-stats">
              <div><strong>{products.length}</strong><span>Total products</span></div>
              <div><strong>{products.filter(p => p.price === 0).length}</strong><span>Free products</span></div>
            </div>

            <div className="admin-form">
              <h3>{editing ? "Edit product" : "Add a product"}</h3>

              <label>Product name</label>
              <input
                value={form.title}
                onChange={(e) => setForm({...form, title: e.target.value})}
                placeholder="Enter product name"
              />

              <label>Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({...form, description: e.target.value})}
                placeholder="Describe your product"
              />

              <label>Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({...form, category: e.target.value})}
              >
                {categories.filter(c => c !== "All").map(c => (
                  <option key={c}>{c}</option>
                ))}
              </select>

              <div className="form-row">
                <div>
                  <label>Price (₹)</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({...form, price: e.target.value})}
                  />
                </div>
                <div>
                  <label>Old price (₹)</label>
                  <input
                    type="number"
                    value={form.oldPrice}
                    onChange={(e) => setForm({...form, oldPrice: e.target.value})}
                  />
                </div>
              </div>

              <label>Cover image URL</label>
              <input
                value={form.coverUrl}
                onChange={(e) => setForm({...form, coverUrl: e.target.value})}
                placeholder="https://..."
              />

              <label>Download URL</label>
              <input
                value={form.downloadUrl}
                onChange={(e) => setForm({...form, downloadUrl: e.target.value})}
                placeholder="https://..."
              />

              <button className="primary-btn full" onClick={saveProduct}>
                {editing ? "Save changes" : "Add product"} <Plus size={17} />
              </button>

              {editing && (
                <button className="cancel-btn" onClick={() => {
                  setEditing(null);
                  setForm({
                    title: "",
                    description: "",
                    category: "E-book",
                    price: "0",
                    oldPrice: "",
                    coverUrl: "",
                    downloadUrl: ""
                  });
                }}>
                  Cancel editing
                </button>
              )}
            </div>

            <div className="admin-list">
              <h3>Manage products</h3>
              {products.map((product) => (
                <div className="admin-product" key={product.id}>
                  <div>
                    <strong>{product.title}</strong>
                    <small>{product.category} · ₹{product.price}</small>
                  </div>
                  <div className="admin-actions">
                    <button onClick={() => editProduct(product)}>Edit</button>
                    <button onClick={() => deleteProduct(product.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
            <p className="admin-warning">
              Demo dashboard: changes are stored only in this browser session.
              Secure admin login and cloud storage are not connected yet.
            </p>
          </div>
        </div>
      )}
    </div>
  );
                      }
