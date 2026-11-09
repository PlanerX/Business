import { useEffect, useState, type FormEvent } from "react";
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
import { auth } from "./firebase";

function AuthLayout({
  title,
  subtitle,
  children
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <main className="page-container">
      <div className="page-heading">
        <span className="section-kicker">ANSU CREATE ACCOUNT</span>
        <h1>{title}<span>.</span></h1>
        <p>{subtitle}</p>
      </div>

      <section className="contact-form auth-form">
        {children}
      </section>
    </main>
  );
}

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
    <AuthLayout title="Welcome back" subtitle="Login to your account.">
      <form onSubmit={handleSubmit}>
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

        <p className="contact-form-note">
          <Link to="/forgot-password">Forgot password?</Link>
        </p>

        <button className="primary-button" type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="contact-form-note">
        Don't have an account? <Link to="/register">Create account</Link>
      </p>
    </AuthLayout>
  );
}

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
      setError("Account creation failed. Check your details or try another email.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="Create account" subtitle="Join the ANSU CREATE community.">
      <form onSubmit={handleSubmit}>
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

        <button className="primary-button" type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="contact-form-note">
        Already registered? <Link to="/login">Login</Link>
      </p>
    </AuthLayout>
  );
}

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
      setMessage("If an account exists for this email, a reset link will be sent.");
    } catch {
      setError("Unable to send reset email. Please check the email address.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="Reset password" subtitle="Get a password reset link by email.">
      <form onSubmit={handleSubmit}>
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

        <button className="primary-button" type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send reset link"}
        </button>
      </form>

      <p className="contact-form-note">
        <Link to="/login">Back to login</Link>
      </p>
    </AuthLayout>
  );
}

export function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setChecking(false);
    });

    return unsubscribe;
  }, []);

  async function handleLogout() {
    await signOut(auth);
    navigate("/");
  }

  if (checking) {
    return <div className="loading-screen">Loading profile...</div>;
  }

  if (!user) {
    return (
      <main className="page-container profile-page">
        <div className="page-heading">
          <span className="section-kicker">YOUR ANSU CREATE ACCOUNT</span>
          <h1>My Profile<span>.</span></h1>
          <p>Login or create an account to access your customer profile.</p>
        </div>

        <section className="profile-card">
          <h2>Welcome to ANSU CREATE.</h2>
          <p>Your personal space starts here.</p>

          <Link to="/login" className="primary-button">Login</Link>
          <Link to="/register" className="secondary-button">Create account</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="page-container profile-page">
      <div className="page-heading">
        <span className="section-kicker">YOUR ANSU CREATE ACCOUNT</span>
        <h1>My Profile<span>.</span></h1>
      </div>

      <section className="profile-card">
        <div className="profile-icon">A.</div>
        <span className="section-kicker">CUSTOMER ACCOUNT</span>
        <h2>{user.displayName || "Customer"}</h2>
        <p>{user.email}</p>

        <p className="profile-help">
          Order history and purchased downloads will be added in a later step.
        </p>

        <button className="primary-button" onClick={handleLogout}>
          Logout
        </button>
      </section>
    </main>
  );
}
