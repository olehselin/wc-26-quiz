import { useState, useEffect, useRef } from "react";
import { auth, signInWithGoogle } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

/**
 * Persistent auth status badge — shows login state at all times.
 * Logged in: avatar + name + sign-out option.
 * Not logged in: subtle indicator with sign-in button.
 */
export default function AuthBadge() {
  const [user, setUser] = useState(auth.currentUser);
  const [menuOpen, setMenuOpen] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return unsub;
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  const handleSignIn = async () => {
    setSigningIn(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      if (err.code !== "auth/popup-closed-by-user") {
        console.error("Sign-in error:", err);
      }
    } finally {
      setSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    setMenuOpen(false);
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Sign-out error:", err);
    }
  };

  // ── Not logged in ──
  if (!user) {
    return (
      <button
        id="auth-badge-signin"
        className="auth-badge auth-badge--guest"
        onClick={handleSignIn}
        disabled={signingIn}
        title="Увійти через Google"
      >
        {signingIn ? (
          <div className="auth-badge__spinner" />
        ) : (
          <svg className="auth-badge__google-icon" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        )}
        <span className="auth-badge__label">Увійти</span>
      </button>
    );
  }

  // ── Logged in ──
  return (
    <div className="auth-badge-wrapper" ref={menuRef}>
      <button
        id="auth-badge-user"
        className="auth-badge auth-badge--user"
        onClick={() => setMenuOpen((v) => !v)}
        title={user.displayName || "Профіль"}
      >
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt=""
            className="auth-badge__avatar"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="auth-badge__avatar-placeholder">
            {(user.displayName || "?")[0]}
          </div>
        )}
        <span className="auth-badge__name">
          {user.displayName || "Гравець"}
        </span>
        <svg
          className={`auth-badge__chevron ${menuOpen ? "auth-badge__chevron--open" : ""}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {menuOpen && (
        <div className="auth-badge__dropdown animate-scale-in">
          <div className="auth-badge__dropdown-header">
            <span className="auth-badge__dropdown-email">
              {user.email || "—"}
            </span>
            <span className="auth-badge__dropdown-status">
              ✅ Ви увійшли
            </span>
          </div>
          <button
            className="auth-badge__dropdown-btn"
            onClick={handleSignOut}
          >
            🚪 Вийти з акаунту
          </button>
        </div>
      )}
    </div>
  );
}
