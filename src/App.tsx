
import { useEffect, useState, type FormEvent } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  NavLink,
  useParams,
  useNavigate
} from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Search,
  Sparkles,
  Layers3,
  Download,
  Home,
  Compass,
  ShoppingBag,
  UserRound,
  ShieldCheck,
  Mail,
  MessageCircle,
  Send
} from "lucide-react";
import AdminPanel from "./AdminPanel";
import { getProducts, type Product } from "./products";

function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="logo">
          ANSU<span>CREATE.</span>
        </Link>

        <nav className="nav-links">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/explore">Explore</NavLink>
          <NavLink to="/shop">Shop</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </nav>

        <div className="header-actions">
          <Link to="/admin" className="header-admin">
            <ShieldCheck size={15} />
            Admin
          </Link>

          <Link to="/shop" className="header-shop">
            Shop Now <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>
    </header>
  );
}

function BottomNavigation() {
  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      <NavLink to="/" end>
        <Home size={21} />
        <span>Home</span>
      </NavLink>

      <NavLink to="/explore">
        <Compass size={21} />
        <span>Explore</span>
      </NavLink>

      <NavLink to="/shop">
        <ShoppingBag size={21} />
        <span>Shop</span>
      </NavLink>

      <NavLink to="/profile">
        <UserRound size={21} />
        <span>Profile</span>
      </NavLink>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div>
          <Link to="/" className="logo">
            ANSU<span>CREATE.</span>
          </Link>
          <p>Ideas into Products.</p>
        </div>

        <div className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/explore">Explore</Link>
          <Link to="/shop">Shop</Link>
          <Link to="/about">About</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/admin">Admin</Link>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} ANSU CREATE</span>
        <span>Made with ideas. Built with purpose.</span>
      </div>
    </footer>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Link to={`/product/${product.id}`} className="product-card">
      <div className="product-image">
        {product.image ? (
          <img src={product.image} alt={product.title} />
        ) : (
          <div className="product-placeholder">A.</div>
        )}

        {product.featured && (
          <span className="featured-label">FEATURED</span>
        )}

        <span className="product-arrow">
          <ArrowUpRight size={19} />
        </span>
      </div>

      <div className="product-card-info">
        <span className="product-category">{product.category}</span>
        <h3>{product.title}</h3>

        <div className="product-card-bottom">
          <span className="product-price">₹{product.price}</span>
          <span className="view-product">
            View Product <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </Link>
  );
}

function ProductGrid({
  products,
  limit
}: {
  products: Product[];
  limit?: number;
}) {
  const visible = limit ? products.slice(0, limit) : products;

  if (!visible.length) {
    return (
      <div className="empty-products">
        <Sparkles size={30} />
        <h3>Something new is coming.</h3>
        <p>Our collection is being prepared. Check back soon.</p>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {visible.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

function HomePage({ products }: { products: Product[] }) {
  const featured = products.filter((p) => p.featured);

  return (
    <>
      <section className="home-hero">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="eyebrow-dot" />
            A WORLD OF DIGITAL CREATIONS
          </div>

          <h1>
            Ideas deserve
            <br />
            to become <span>real.</span>
          </h1>

          <p>
            Discover thoughtfully created digital products,
            useful apps and resources made to inspire your next step.
          </p>

          <div className="hero-buttons">
            <Link to="/shop" className="primary-button">
              Explore the shop <ArrowUpRight size={17} />
            </Link>
            <Link to="/about" className="secondary-button">
              Our story
            </Link>
          </div>

          <div className="hero-note">
            <Sparkles size={15} />
            Independent digital creations.
          </div>
        </div>

        <div className="hero-visual">
          <div className="visual-glow" />
          <div className="visual-orbit orbit-one" />
          <div className="visual-orbit orbit-two" />

          <div className="visual-card">
            <div className="visual-card-top">
              <span>ANSU CREATE</span>
              <Sparkles size={17} />
            </div>

            <div className="visual-letter">A.</div>

            <div className="visual-card-bottom">
              <span>IDEAS INTO PRODUCTS.</span>
              <span>EST. 2026</span>
            </div>
          </div>

          <div className="floating-tag tag-one">Digital ideas ✦</div>
          <div className="floating-tag tag-two">Made to create.</div>
        </div>
      </section>

      <section className="intro-strip">
        <span>DESIGNED WITH PURPOSE</span>
        <span>✳</span>
        <span>MADE FOR EVERYDAY</span>
        <span>✳</span>
        <span>IDEAS INTO PRODUCTS</span>
      </section>

      <section className="content-section">
        <div className="section-top">
          <div>
            <span className="section-kicker">HANDPICKED FOR YOU</span>
            <h2>Featured creations<span>.</span></h2>
            <p>A closer look at some of our latest digital products.</p>
          </div>

          <Link to="/shop" className="text-link">
            View all products <ArrowUpRight size={16} />
          </Link>
        </div>

        <ProductGrid
          products={featured.length ? featured : products}
          limit={3}
        />
      </section>

      <section className="discover-banner">
        <div>
          <span className="section-kicker">YOUR NEXT DISCOVERY</span>
          <h2>Find something<br />worth creating with.</h2>
          <p>Explore the collection and discover your next useful tool.</p>

          <Link to="/explore" className="primary-button">
            Start exploring <ArrowRight size={16} />
          </Link>
        </div>

        <div className="banner-symbol">A.</div>
      </section>
    </>
  );
}

function ExplorePage({ products }: { products: Product[] }) {
  const categories = Array.from(
    new Set(products.map((p) => p.category))
  );

  return (
    <main className="page-container">
      <div className="page-heading">
        <span className="section-kicker">DISCOVER SOMETHING NEW</span>
        <h1>Explore<span>.</span></h1>
        <p>Ideas, tools and creations for curious minds.</p>
      </div>

      <div className="explore-category-grid">
        {categories.map((category) => (
          <Link
            key={category}
            to={`/shop?category=${encodeURIComponent(category)}`}
            className="explore-category"
          >
            <div className="category-symbol">
              <Layers3 size={23} />
            </div>

            <div>
              <h3>{category}</h3>
              <p>
                Explore collection <ArrowRight size={14} />
              </p>
            </div>

            <ArrowUpRight className="category-arrow" size={20} />
          </Link>
        ))}
      </div>

      <div className="section-top explore-products-heading">
        <div>
          <span className="section-kicker">THE COLLECTION</span>
          <h2>Latest creations<span>.</span></h2>
        </div>

        <Link to="/shop" className="text-link">
          Visit shop <ArrowRight size={15} />
        </Link>
      </div>

      <ProductGrid products={products} limit={3} />
    </main>
  );
}

function ShopPage({ products }: { products: Product[] }) {
  const params = new URLSearchParams(window.location.search);
  const initialCategory = params.get("category") || "All";

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(initialCategory);

  const categories = [
    "All",
    ...Array.from(new Set(products.map((p) => p.category)))
  ];

  const filtered = products.filter((product) => {
    const matchesSearch =
      product.title.toLowerCase().includes(search.toLowerCase()) ||
      product.description.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || product.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <main className="page-container">
      <div className="page-heading">
        <span className="section-kicker">THE ANSU CREATE STORE</span>
        <h1>Shop<span>.</span></h1>
        <p>Browse our collection of digital products and useful creations.</p>
      </div>

      <div className="shop-toolbar">
        <div className="shop-search">
          <Search size={17} />
          <input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <span className="result-count">
          {filtered.length} PRODUCTS
        </span>
      </div>

      <div className="shop-categories">
        {categories.map((item) => (
          <button
            key={item}
            className={category === item ? "selected" : ""}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <ProductGrid products={filtered} />
    </main>
  );
}

function ProductPage({ products }: { products: Product[] }) {
  const { id } = useParams();
  const product = products.find((item) => item.id === id);
  const navigate = useNavigate();

  if (!product) {
    return (
      <main className="page-container not-found">
        <h1>Product not found.</h1>
        <p>This product may have been removed or is unavailable.</p>
        <Link to="/shop" className="primary-button">
          Back to shop
        </Link>
      </main>
    );
  }

  return (
    <main className="page-container product-detail">
      <button className="back-link" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="product-detail-grid">
        <div className="detail-image">
          {product.image ? (
            <img src={product.image} alt={product.title} />
          ) : (
            <div className="product-placeholder">A.</div>
          )}
        </div>

        <div className="detail-copy">
          <span className="section-kicker">{product.category}</span>
          <h1>{product.title}</h1>
          <div className="detail-price">₹{product.price}</div>
          <p>{product.description}</p>

          {product.downloadUrl ? (
            <a
              className="primary-button"
              href={product.downloadUrl}
              target="_blank"
              rel="noreferrer"
            >
              <Download size={17} />
              Get product <ArrowUpRight size={16} />
            </a>
          ) : (
            <button className="primary-button disabled-button" disabled>
              Coming soon
            </button>
          )}

          <div className="detail-note">
            <Sparkles size={16} />
            A digital creation from ANSU CREATE.
          </div>
        </div>
      </div>
    </main>
  );
}

function ProfilePage() {
  return (
    <main className="page-container profile-page">
      <div className="page-heading">
        <span className="section-kicker">YOUR ANSU CREATE ACCOUNT</span>
        <h1>My Profile<span>.</span></h1>
        <p>
          Your personal space for account details and digital purchases.
        </p>
      </div>

      <section className="profile-card">
        <div className="profile-icon">
          <UserRound size={34} />
        </div>

        <span className="section-kicker">CUSTOMER ACCOUNT</span>
        <h2>Welcome to ANSU CREATE.</h2>
        <p>
          Customer account features, order history and purchased
          downloads will be available here.
        </p>

        <Link to="/shop" className="primary-button">
          Explore products <ArrowRight size={16} />
        </Link>

        <p className="profile-help">
          Need help? <Link to="/contact">Contact support</Link>
        </p>
      </section>
    </main>
  );
}

function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const subject = encodeURIComponent("ANSU CREATE Support Request");
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    );

    window.location.href =
      `mailto:officialanexz@gmail.com?subject=${subject}&body=${body}`;
  }

  return (
    <main className="page-container contact-page">
      <div className="page-heading">
        <span className="section-kicker">WE'RE HERE TO HELP</span>
        <h1>Contact<span>.</span></h1>
        <p>
          Have a question, need support, or want to share an idea?
          We'd love to hear from you.
        </p>
      </div>

      <div className="contact-grid">
        <section className="contact-info">
          <span className="section-kicker">GET IN TOUCH</span>
          <h2>Let's talk about<br />your next idea.</h2>
          <p>
            For product questions, support or general enquiries,
            contact us through email.
          </p>

          <a
            href="mailto:officialanexz@gmail.com"
            className="contact-email"
          >
            <span className="contact-icon">
              <Mail size={20} />
            </span>
            <span>
              <small>EMAIL SUPPORT</small>
              <strong>officialanexz@gmail.com</strong>
            </span>
            <ArrowUpRight size={18} />
          </a>

          <div className="contact-note">
            <MessageCircle size={19} />
            <p>We appreciate your feedback and suggestions.</p>
          </div>
        </section>

        <form className="contact-form" onSubmit={handleSubmit}>
          <h2>Send us a message.</h2>

          <label htmlFor="contact-name">Your name</label>
          <input
            id="contact-name"
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label htmlFor="contact-email">Email address</label>
          <input
            id="contact-email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="contact-message">Message</label>
          <textarea
            id="contact-message"
            placeholder="How can we help you?"
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />

          <button type="submit" className="primary-button">
            Prepare message <Send size={16} />
          </button>

          <p className="contact-form-note">
            This opens your email app with your message pre-filled.
          </p>
        </form>
      </div>

      <section className="contact-faq">
        <span className="section-kicker">NEED HELP?</span>
        <h2>Frequently asked questions.</h2>

        <div className="faq-item">
          <h3>How can I get a product?</h3>
          <p>Visit the Shop page, select a product and follow its available instructions.</p>
        </div>

        <div className="faq-item">
          <h3>Where can I ask for product support?</h3>
          <p>Send your question using the contact form or email support directly.</p>
        </div>

        <div className="faq-item">
          <h3>Can I suggest a new product?</h3>
          <p>Yes. Share your idea with us through the contact form.</p>
        </div>
      </section>
    </main>
  );
}

function AboutPage() {
  return (
    <main className="page-container about-page">
      <div className="page-heading">
        <span className="section-kicker">A LITTLE ABOUT US</span>
        <h1>Ideas into<br /><span>Products.</span></h1>
        <p>We believe good ideas deserve to become something useful.</p>
      </div>

      <div className="about-story">
        <div className="about-monogram">A.</div>

        <div>
          <span className="section-kicker">OUR PURPOSE</span>
          <h2>Creating with curiosity.<br />Building with purpose.</h2>

          <p>
            ANSU CREATE is an independent digital brand focused on
            apps, digital resources and useful products. We want to
            turn simple ideas into practical creations that make
            everyday experiences better.
          </p>

          <p>
            Every product starts with one thought: how can we make
            something useful, simple and meaningful?
          </p>
        </div>
      </div>

      <div className="about-values">
        <div>
          <span>01</span>
          <h3>Keep it simple.</h3>
          <p>Useful experiences without unnecessary complexity.</p>
        </div>

        <div>
          <span>02</span>
          <h3>Think creatively.</h3>
          <p>Explore ideas and turn them into real creations.</p>
        </div>

        <div>
          <span>03</span>
          <h3>Build with purpose.</h3>
          <p>Make products that offer genuine value.</p>
        </div>
      </div>

      <div className="about-cta">
        <h2>Discover what we create.</h2>
        <Link to="/shop" className="primary-button">
          Explore the shop <ArrowRight size={16} />
        </Link>
      </div>
    </main>
  );
}

function AdminRoute() {
  return <AdminPanel />;
}

function NotFoundPage() {
  return (
    <main className="page-container not-found">
      <h1>Page not found.</h1>
      <Link to="/" className="primary-button">Go home</Link>
    </main>
  );
}

function Site() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch((error) => console.error("Products loading failed:", error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Header />

      {loading ? (
        <div className="loading-screen">Loading ANSU CREATE...</div>
      ) : (
        <Routes>
          <Route path="/" element={<HomePage products={products} />} />
          <Route path="/explore" element={<ExplorePage products={products} />} />
          <Route path="/shop" element={<ShopPage products={products} />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/contact" element={<ContactPage />} />
        
