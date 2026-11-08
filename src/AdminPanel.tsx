import { useEffect, useState } from "react";
import type { User } from "firebase/auth";

import {
  adminLogin,
  adminLogout,
  checkAuth,
  isAdmin
} from "./auth";

import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  type Product
} from "./products";

const emptyForm = {
  title: "",
  category: "App / APK",
  description: "",
  price: "0",
  oldPrice: "",
  image: "",
  downloadUrl: "",
  featured: false
};

export default function AdminPanel() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function loadProducts() {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch {
      setMessage("Products load nahi hue. Firebase rules check karo.");
    }
  }

  useEffect(() => {
    const unsubscribe = checkAuth((nextUser) => {
      if (nextUser && isAdmin(nextUser)) {
        setUser(nextUser);
      } else {
        setUser(null);

        if (nextUser) {
          void adminLogout();
          setMessage("Access denied: Admin only.");
        }
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (user) {
      void loadProducts();
    }
  }, [user]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    try {
      const loggedInUser = await adminLogin(email, password);

      if (!isAdmin(loggedInUser)) {
        await adminLogout();
        setMessage("Ye account authorized admin nahi hai.");
      }
    } catch {
      setMessage("Login failed. Email aur password check karo.");
    }
  }

  function startEdit(product: Product) {
    setEditingId(product.id || null);

    setForm({
      title: product.title,
      category: product.category,
      description: product.description,
      price: String(product.price),
      oldPrice: product.oldPrice ? String(product.oldPrice) : "",
      image: product.image || "",
      downloadUrl: product.downloadUrl || "",
      featured: product.featured
    });
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    if (!form.title.trim()) {
      setMessage("Product title required hai.");
      return;
    }

    const productData: Product = {
      title: form.title.trim(),
      category: form.category,
      description: form.description.trim(),
      price: Number(form.price),
      oldPrice: form.oldPrice ? Number(form.oldPrice) : undefined,
      image: form.image.trim(),
      downloadUrl: form.downloadUrl.trim(),
      featured: form.featured
    };

    if (
      !Number.isFinite(productData.price) ||
      productData.price < 0 ||
      (productData.oldPrice !== undefined &&
        (!Number.isFinite(productData.oldPrice) ||
          productData.oldPrice < 0))
    ) {
      setMessage("Valid price enter karo.");
      return;
    }

    try {
      if (editingId) {
        await updateProduct(editingId, productData);
        setMessage("Product updated successfully!");
      } else {
        await addProduct(productData);
        setMessage("Product added successfully!");
      }

      setForm(emptyForm);
      setEditingId(null);
      await loadProducts();
    } catch {
      setMessage("Save failed. Firebase configuration aur rules check karo.");
    }
  }

  async function handleDelete(id?: string) {
    if (!id) return;

    if (!window.confirm("Kya tum ye product delete karna chahte ho?")) {
      return;
    }

    try {
      await deleteProduct(id);
      setMessage("Product deleted!");
      await loadProducts();
    } catch {
      setMessage("Delete failed.");
    }
  }

  async function handleLogout() {
    await adminLogout();
    setForm(emptyForm);
    setEditingId(null);
  }

  if (loading) {
    return <div style={{ padding: 24 }}>Loading admin...</div>;
  }

  if (!user || !isAdmin(user)) {
    return (
      <div style={styles.page}>
        <form onSubmit={handleLogin} style={styles.card}>
          <h2>ANSU CREATE Admin</h2>
          <p>Sign in to manage your digital products.</p>

          <input
            style={styles.input}
            type="email"
            placeholder="Admin email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button style={styles.button} type="submit">
            Login
          </button>

          {message && <p>{message}</p>}
        </form>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.dashboard}>
        <header style={styles.header}>
          <div>
            <h2>Admin Dashboard</h2>
            <p>Manage your ANSU CREATE products.</p>
          </div>

          <button style={styles.secondary} onClick={handleLogout}>
            Logout
          </button>
        </header>

        <form onSubmit={handleSave} style={styles.card}>
          <h3>{editingId ? "Edit Product" : "Add New Product"}</h3>

          <input
            style={styles.input}
            placeholder="Product title"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
            required
          />

          <select
            style={styles.input}
            value={form.category}
            onChange={(e) =>
              setForm({ ...form, category: e.target.value })
            }
          >
            <option>App / APK</option>
            <option>E-book</option>
            <option>Template</option>
            <option>Other</option>
          </select>

          <textarea
            style={styles.input}
            placeholder="Product description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          <input
            style={styles.input}
            type="number"
            min="0"
            placeholder="Price"
            value={form.price}
            onChange={(e) =>
              setForm({ ...form, price: e.target.value })
            }
            required
          />

          <input
            style={styles.input}
            type="number"
            min="0"
            placeholder="Old price (optional)"
            value={form.oldPrice}
            onChange={(e) =>
              setForm({ ...form, oldPrice: e.target.value })
            }
          />

          <input
            style={styles.input}
            type="url"
            placeholder="Product image URL (optional)"
            value={form.image}
            onChange={(e) =>
              setForm({ ...form, image: e.target.value })
            }
          />

          <input
            style={styles.input}
            type="url"
            placeholder="Download URL (optional)"
            value={form.downloadUrl}
            onChange={(e) =>
              setForm({ ...form, downloadUrl: e.target.value })
            }
          />

          <label style={styles.label}>
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) =>
                setForm({ ...form, featured: e.target.checked })
              }
            />
            Featured product
          </label>

          <button style={styles.button} type="submit">
            {editingId ? "Update Product" : "Add Product"}
          </button>

          {editingId && (
            <button
              type="button"
              style={styles.secondary}
              onClick={() => {
                setForm(emptyForm);
                setEditingId(null);
              }}
            >
              Cancel Edit
            </button>
          )}

          {message && <p>{message}</p>}
        </form>

        <section style={styles.card}>
          <h3>Products ({products.length})</h3>

          {products.map((product) => (
            <div key={product.id} style={styles.product}>
              <div>
                <strong>{product.title}</strong>
                <p>{product.category} · ₹{product.price}</p>
              </div>

              <div style={styles.actions}>
                <button
                  style={styles.secondary}
                  onClick={() => startEdit(product)}
                >
                  Edit
                </button>

                <button
                  style={styles.danger}
                  onClick={() => handleDelete(product.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {products.length === 0 && <p>No products added yet.</p>}
        </section>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#f7f6fc",
    padding: "24px 16px",
    boxSizing: "border-box"
  },
  dashboard: {
    maxWidth: 850,
    margin: "0 auto",
    display: "grid",
    gap: 20
  },
  card: {
    background: "#fff",
    padding: 22,
    borderRadius: 16,
    display: "grid",
    gap: 14,
    boxShadow: "0 4px 20px rgba(0,0,0,0.04)"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12
  },
  input: {
    width: "100%",
    padding: 13,
    border: "1px solid #e5e2ee",
    borderRadius: 9,
    fontSize: 14,
    boxSizing: "border-box",
    background: "#fff"
  },
  button: {
    background: "#7653df",
    color: "#fff",
    padding: 13,
    border: 0,
    borderRadius: 9,
    fontWeight: 600
  },
  secondary: {
    background: "#eee9fc",
    color: "#6746c8",
    padding: "10px 14px",
    border: 0,
    borderRadius: 8
  },
  danger: {
    background: "#feecec",
    color: "#c62828",
    padding: "10px 14px",
    border: 0,
    borderRadius: 8
  },
  label: {
    display: "flex",
    alignItems: "center",
    gap: 8
  },
  product: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    padding: "14px 0",
    borderBottom: "1px solid #eee"
  },
  actions: {
    display: "flex",
    gap: 8
  }
};
