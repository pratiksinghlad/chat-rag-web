/**
 * Landing Page
 *
 * The main entry point for unauthenticated users.
 * Displays OAuth sign-in buttons for Microsoft, Google, and GitHub.
 */

import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import OAuthButton from "@/components/OAuthButton";
import LoadingSpinner from "@/components/LoadingSpinner";
import type { OAuthProvider } from "@/types/auth";
import "@/styles/Landing.css";

export function Landing() {
  const { user, isLoading, error, signInWithOAuth } = useAuth();
  const [signingIn, setSigningIn] = useState<OAuthProvider | null>(null);

  // Redirect authenticated users to home
  if (user && !isLoading) {
    return <Navigate to="/home" replace />;
  }

  // Show loading state while checking auth
  if (isLoading && !signingIn) {
    return (
      <div className="landing landing--loading">
        <LoadingSpinner message="Checking authentication..." />
      </div>
    );
  }

  const handleSignIn = async (provider: OAuthProvider) => {
    setSigningIn(provider);
    await signInWithOAuth(provider);
    // Note: The page will redirect, so we don't need to reset state
  };

  return (
    <main className="landing">
      {/* Background decorations */}
      <div className="landing__bg-gradient" aria-hidden="true" />
      <div className="landing__bg-pattern" aria-hidden="true" />

      <div className="landing__content">
        {/* Logo and branding */}
        <header className="landing__header">
          <div className="landing__logo">
            <svg viewBox="0 0 100 100" aria-hidden="true">
              <defs>
                <linearGradient
                  id="logo-gradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
              <circle cx="50" cy="50" r="45" fill="url(#logo-gradient)" />
              <path
                d="M30 50 L45 65 L70 35"
                stroke="white"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
            <h1 className="landing__title">SSO App</h1>
          </div>
          <p className="landing__tagline">
            Secure single sign-on with your favorite providers
          </p>
        </header>

        {/* Sign-in card */}
        <section className="landing__card" aria-labelledby="signin-heading">
          <h2 id="signin-heading" className="landing__card-title">
            Welcome Back
          </h2>
          <p className="landing__card-subtitle">
            Choose your preferred sign-in method to continue
          </p>

          {/* Error display */}
          {error && (
            <div className="landing__error" role="alert">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
                />
              </svg>
              <span>{error.message}</span>
            </div>
          )}

          {/* OAuth buttons */}
          <div className="landing__buttons">
            <OAuthButton
              provider="google"
              onClick={() => handleSignIn("google")}
              isLoading={signingIn === "google"}
              disabled={signingIn !== null}
            />
            <OAuthButton
              provider="github"
              onClick={() => handleSignIn("github")}
              isLoading={signingIn === "github"}
              disabled={signingIn !== null}
            />
            <OAuthButton
              provider="azure"
              onClick={() => handleSignIn("azure")}
              isLoading={signingIn === "azure"}
              disabled={signingIn !== null}
            />
          </div>

          {/* Privacy note */}
          <p className="landing__privacy">
            By signing in, you agree to our{" "}
            <a href="#terms" className="landing__link">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#privacy" className="landing__link">
              Privacy Policy
            </a>
          </p>
        </section>

        {/* Features section */}
        <section
          className="landing__features"
          aria-labelledby="features-heading"
        >
          <h2 id="features-heading" className="visually-hidden">
            Key Features
          </h2>
          <div className="landing__feature">
            <div className="landing__feature-icon">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"
                />
              </svg>
            </div>
            <h3 className="landing__feature-title">Secure</h3>
            <p className="landing__feature-text">
              Enterprise-grade security with OAuth 2.0
            </p>
          </div>
          <div className="landing__feature">
            <div className="landing__feature-icon">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                />
              </svg>
            </div>
            <h3 className="landing__feature-title">Simple</h3>
            <p className="landing__feature-text">
              One click sign-in with your existing accounts
            </p>
          </div>
          <div className="landing__feature">
            <div className="landing__feature-icon">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"
                />
              </svg>
            </div>
            <h3 className="landing__feature-title">Universal</h3>
            <p className="landing__feature-text">
              Works with Google, Microsoft, and GitHub
            </p>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="landing__footer">
        <p>
          Powered by{" "}
          <a
            href="https://supabase.com"
            target="_blank"
            rel="noopener noreferrer"
            className="landing__link"
          >
            Supabase
          </a>
        </p>
      </footer>
    </main>
  );
}

export default Landing;
