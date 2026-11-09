
import { useEffect, useState, type FormEvent, type ReactNode } from "react";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
  signOut,
  updateProfile,
  type User
} from "firebase/auth";

import { Link, useNavigate } from "react-router-dom";

import {
  UserRound,
  Mail,
  ShieldCheck,
  ShoppingBag,
  Download,
  LockKeyhole,
  Headphones,
  ArrowRight,
  LogOut,
  Sparkles,
  LayoutDashboard,
  Package,
  CircleUserRound,
  CheckCircle2
} from "lucide-react";

import { auth } from "./firebase";

/* AUTH LAYOUT */

function AuthLayout({
  title,
  subtitle,
  children
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <main className="page-container auth-page">
      <div className="auth-heading">
        <span className="section-kicker">ANSU CREATE ACCOUNT</span>
        <h1>{title}<span>.</span></h1>
        <p>{subtitle}</p>
      </div>

      <section className="auth-panel">
        {children}
      </section>
    </main>
  );
}

/* LOGIN */

export function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/profile");
    } catch {
      setError("Login failed. Please check your email and password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Login to your ANSU CREATE account."
    >
      <form onSubmit={handleSubmit} className="modern-auth-form">
        <label>Email address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
        />

        {error && <p className="auth-error">{error}</p>}

        <div className="auth-forgot">
          <Link to="/forgot-password">Forgot password?</Link>
        </div>

        <button
          className="primary-button auth-submit"
          type="submit"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login to account"}
          {!loading && <ArrowRight size={17} />}
        </button>
      </form>

      <div className="auth-bottom-note">
        Don't have an account? <Link to="/register">Create account</Link>
      </div>
    </AuthLayout>
  );
}

/* REGISTER */

export function RegisterPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(result.user, {
        displayName: name
      });

      navigate("/profile");
    } catch {
      setError(
        "Account creation failed. Check your details or try another email."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Create account"
      subtitle="Join the ANSU CREATE community."
    >
      <form onSubmit={handleSubmit} className="modern-auth-form">
        <label>Your name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          required
        />

        <label>Email address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />

        <label>Create password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Minimum 6 characters"
          minLength={6}
          required
        />

        {error && <p className="auth-error">{error}</p>}

        <button
          className="primary-button auth-submit"
          type="submit"
          disabled={loading}
        >
          {loading ? "Creating account..." : "Create my account"}
          {!loading && <ArrowRight size={17} />}
        </button>
      </form>

      <div className="auth-bottom-note">
        Already registered? <Link to="/login">Login</Link>
      </div>
    </AuthLayout>
  );
}

/* FORGOT PASSWORD */

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);

      setMessage(
        "If an account exists for this email, a reset link will be sent."
      );
    } catch {
      setError("Unable to send reset email. Please check the email address.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Reset password"
      subtitle="Get a password reset link by email."
    >
      <form onSubmit={handleSubmit} className="modern-auth-form">
        <label>Email address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your registered email"
          required
        />

        {message && <p className="auth-success">{message}</p>}
        {error && <p className="auth-error">{error}</p>}

        <button
          className="primary-button auth-submit"
          type="submit"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send reset link"}
          {!loading && <ArrowRight size={17} />}
        </button>
      </form>

      <div className="auth-bottom-note">
        <Link to="/login">Back to login</Link>
      </div>
    </AuthLayout>
  );
}

/* PROFILE DASHBOARD */

export function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setChecking(false);
    });

    return unsubscribe;
  }, []);

  async function handleLogout() {
    try {
      await signOut(auth);
      navigate("/");
    } catch {
      setError("Unable to logout. Please try again.");
    }
  }

  async function handlePasswordReset() {
    if (!user?.email) return;

    setNotice("");
    setError("");
    setResetLoading(true);

    try {
      await sendPasswordResetEmail(auth, user.email);
      setNotice("Password reset instructions have been sent to your email.");
    } catch {
      setError("Unable to send password reset email.");
    } finally {
      setResetLoading(false);
    }
  }

  if (checking) {
    return (
      <div className="loading-screen">
        Loading your account...
      </div>
    );
  }

  /* LOGGED OUT */

  if (!user) {
    return (
      <main className="page-container account-page">
        <div className="account-welcome">
          <div className="account-welcome-icon">
            <CircleUserRound size={42} />
          </div>

          <span className="section-kicker">YOUR DIGITAL SPACE</span>

          <h1>Welcome to<br /><span>your account.</span></h1>

          <p>
            Login to manage your account and explore your
            ANSU CREATE experience.
          </p>

          <div className="account-welcome-actions">
            <Link to="/login" className="primary-button">
              Login <ArrowRight size={17} />
            </Link>

            <Link to="/register" className="secondary-button">
              Create account
            </Link>
          </div>
        </div>

        <div className="account-benefits">
          <div>
            <ShieldCheck size={23} />
            <h3>Your account</h3>
            <p>Manage your personal details.</p>
          </div>

          <div>
            <Download size={23} />
            <h3>Your downloads</h3>
            <p>Access your digital products.</p>
          </div>

          <div>
            <Headphones size={23} />
            <h3>Support</h3>
            <p>Get help when you need it.</p>
          </div>
        </div>
      </main>
    );
  }

  const displayName = user.displayName || "Customer";
  const firstLetter = displayName.charAt(0).toUpperCase();

  return (
    <main className="page-container account-page">

      {/* DASHBOARD HEADING */}

      <div className="account-page-heading">
        <div>
          <span className="section-kicker">ANSU CREATE CUSTOMER AREA</span>
          <h1>My Account<span>.</span></h1>
          <p>Manage your profile and digital experience.</p>
        </div>

        <div className="account-status">
          <span className="account-status-dot" />
          Active account
        </div>
      </div>

      {/* PROFILE HEADER */}

      <section className="account-hero-card">
        <div className="account-avatar">
          {firstLetter}
        </div>

        <div className="account-user-info">
          <span className="account-small-label">WELCOME BACK</span>
          <h2>{displayName}</h2>

          <p>
            <Mail size={15} />
            {user.email}
          </p>

          <span className="account-member-badge">
            <CheckCircle2 size={14} />
            ANSU CREATE Member
          </span>
        </div>

        <div className="account-hero-symbol">A.</div>
      </section>

      {notice && (
        <div className="account-notice">
          <CheckCircle2 size={17} />
          {notice}
        </div>
      )}

      {error && (
        <div className="auth-error account-error">
          {error}
        </div>
      )}

      {/* DASHBOARD NAVIGATION */}

      <div className="account-dashboard-layout">

        <aside className="account-sidebar">
          <span className="account-sidebar-title">MY ACCOUNT</span>

          <button
            className={activeTab === "overview" ? "account-nav-item active" : "account-nav-item"}
            onClick={() => setActiveTab("overview")}
          >
            <LayoutDashboard size={18} />
            Overview
          </button>

          <button
            className={activeTab === "personal" ? "account-nav-item active" : "account-nav-item"}
            onClick={() => setActiveTab("personal")}
          >
            <UserRound size={18} />
            Personal details
          </button>

          <button
            className={activeTab === "orders" ? "account-nav-item active" : "account-nav-item"}
            onClick={() => setActiveTab("orders")}
          >
            <ShoppingBag size={18} />
            My orders
          </button>

          <button
            className={activeTab === "downloads" ? "account-nav-item active" : "account-nav-item"}
            onClick={() => setActiveTab("downloads")}
          >
            <Download size={18} />
            My downloads
          </button>

          <div className="account-sidebar-divider" />

          <span className="account-sidebar-title">PREFERENCES</span>

          <button
            className={activeTab === "security" ? "account-nav-item active" : "account-nav-item"}
            onClick={() => setActiveTab("security")}
          >
            <LockKeyhole size={18} />
            Security
          </button>

          <Link to="/contact" className="account-nav-item account-support-link">
            <Headphones size={18} />
            Help & support
          </Link>

          <button
            className="account-nav-item account-logout"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            Logout
          </button>
        </aside>

        {/* MAIN CONTENT */}

        <section className="account-main-content">

          {activeTab === "overview" && (
            <>
              <div className="account-content-heading">
                <div>
                  <span className="section-kicker">YOUR DASHBOARD</span>
                  <h2>Account overview</h2>
                  <p>Everything about your account in one place.</p>
                </div>
              </div>

              <div className="account-stats-grid">
                <div className="account-stat-card">
                  <div className="account-stat-icon">
                    <ShoppingBag size={21} />
                  </div>
                  <span>MY ORDERS</span>
                  <strong>0</strong>
                  <small>Orders placed</small>
                </div>

                <div className="account-stat-card">
                  <div className="account-stat-icon">
                    <Download size={21} />
                  </div>
                  <span>MY DOWNLOADS</span>
                  <strong>0</strong>
                  <small>Available downloads</small>
                </div>
              </div>

              <div className="account-section-card">
                <div className="account-card-heading">
                  <div>
                    <h3>Personal information</h3>
                    <p>Your registered account details.</p>
                  </div>

                  <UserRound size={21} />
                </div>

                <div className="account-info-row">
                  <span>Full name</span>
                  <strong>{displayName}</strong>
                </div>

                <div className="account-info-row">
                  <span>Email address</span>
                  <strong>{user.email}</strong>
                </div>

                <div className="account-info-row">
                  <span>Email status</span>
                  <strong>
                    {user.emailVerified ? "Verified" : "Not verified"}
                  </strong>
                </div>
              </div>

              <div className="account-shop-banner">
                <div>
                  <Sparkles size={21} />
                  <h3>Discover something useful.</h3>
                  <p>Explore apps, e-books and digital creations.</p>

                  <Link to="/shop">
                    Explore shop <ArrowRight size={15} />
                  </Link>
                </div>

                <div className="account-shop-symbol">A.</div>
              </div>
            </>
          )}

          {activeTab === "personal" && (
            <>
              <div className="account-content-heading">
                <div>
                  <span className="section-kicker">YOUR DETAILS</span>
                  <h2>Personal information</h2>
                  <p>Your account information registered with us.</p>
                </div>
              </div>

              <div className="account-section-card">
                <div className="account-profile-detail-avatar">
                  {firstLetter}
                </div>

                <div className="account-info-row">
                  <span>Full name</span>
                  <strong>{displayName}</strong>
                </div>

                <div className="account-info-row">
                  <span>Email address</span>
                  <strong>{user.email}</strong>
                </div>

                <div className="account-info-row">
                  <span>Account provider</span>
                  <strong>Email & Password</strong>
                </div>

                <p className="account-muted-note">
                  Profile editing will be available in a future update.
                </p>
              </div>
            </>
          )}

          {activeTab === "orders" && (
            <>
              <div className="account-content-heading">
                <div>
                  <span className="section-kicker">PURCHASE HISTORY</span>
                  <h2>My orders</h2>
                  <p>View your purchases and order information.</p>
                </div>
              </div>

              <div className="account-empty-state">
                <div className="account-empty-icon">
                  <Package size={31} />
                </div>

                <h3>No orders yet</h3>

                <p>
                  Your completed purchases will appear here
                  when the order system is available.
                </p>

                <Link to="/shop" className="primary-button">
                  Explore products <ArrowRight size={16} />
                </Link>
              </div>
            </>
          )}

          {activeTab === "downloads" && (
            <>
              <div className="account-content-heading">
                <div>
                  <span className="section-kicker">YOUR DIGITAL LIBRARY</span>
                  <h2>My downloads</h2>
                  <p>Access your purchased digital products.</p>
                </div>
              </div>

              <div className="account-empty-state">
                <div className="account-empty-icon">
                  <Download size={31} />
                </div>

                <h3>Your library is waiting</h3>

                <p>
                  Purchased apps, e-books and digital downloads
                  will appear here once secure purchase delivery
                  is implemented.
                </p>

                <Link to="/shop" className="primary-button">
                  Browse shop <ArrowRight size={16} />
                </Link>
              </div>
            </>
          )}

          {activeTab === "security" && (
            <>
              <div className="account-content-heading">
                <div>
                  <span className="section-kicker">ACCOUNT PROTECTION</span>
                  <h2>Security</h2>
                  <p>Manage your account access and password.</p>
                </div>
              </div>

              <div className="account-section-card">
                <div className="account-security-row">
                  <div className="account-security-icon">
                    <LockKeyhole size={21} />
                  </div>

                  <div>
                    <h3>Password</h3>
                    <p>Receive a secure password reset link by email.</p>
                  </div>
                </div>

                <button
                  className="primary-button account-reset-button"
                  onClick={handlePasswordReset}
                  disabled={resetLoading}
                >
                  {resetLoading ? "Sending..." : "Reset password"}
                  <ArrowRight size={16} />
                </button>

                <div className="account-info-row">
                  <span>Signed in with</span>
                  <strong>Email & Password</strong>
                </div>
              </div>
            </>
          )}

        </section>
      </div>

      {/* BOTTOM SUPPORT */}

      <div className="account-bottom-support">
        <div>
          <Headphones size={22} />
          <div>
            <h3>Need a little help?</h3>
            <p>Our support page is here for your questions.</p>
          </div>
        </div>

        <Link to="/contact">
          Contact support <ArrowRight size={15} />
        </Link>
      </div>

      <div className="account-logout-mobile">
        <button onClick={handleLogout}>
          <LogOut size={17} /> Logout from account
        </button>
      </div>

    </main>
  );
}
