/**
 * Home Page
 *
 * The main page for authenticated users.
 * Displays user profile information including name, email, and avatar.
 */

import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import UserCard from "@/components/UserCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import "@/styles/Home.css";

export function Home() {
  const { user, isLoading, signOut, getUserProfile } = useAuth();

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="home home--loading">
        <LoadingSpinner message="Loading your profile..." />
      </div>
    );
  }

  // Redirect unauthenticated users to landing
  if (!user) {
    return <Navigate to="/" replace />;
  }

  const profile = getUserProfile();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <main className="home">
      {/* Background decorations */}
      <div className="home__bg-gradient" aria-hidden="true" />
      <div className="home__bg-orbs" aria-hidden="true">
        <div className="home__orb home__orb--1" />
        <div className="home__orb home__orb--2" />
        <div className="home__orb home__orb--3" />
      </div>

      {/* Navigation header */}
      <header className="home__header">
        <div className="home__logo">
          <svg viewBox="0 0 100 100" aria-hidden="true">
            <defs>
              <linearGradient
                id="home-logo-gradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="45" fill="url(#home-logo-gradient)" />
            <path
              d="M30 50 L45 65 L70 35"
              stroke="white"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
          <span className="home__logo-text">SSO App</span>
        </div>

        <button
          id="btn-signout"
          type="button"
          className="home__signout-btn"
          onClick={handleSignOut}
          aria-label="Sign out of your account"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"
            />
          </svg>
          <span>Sign Out</span>
        </button>
      </header>

      {/* Main content */}
      <div className="home__content">
        <section className="home__welcome" aria-labelledby="welcome-heading">
          <h1 id="welcome-heading" className="home__title">
            Welcome back
            {profile?.fullName && (
              <span className="home__name">
                , {profile.fullName.split(" ")[0]}
              </span>
            )}
            ! 👋
          </h1>
          <p className="home__subtitle">
            You're successfully signed in. Here's your profile information.
          </p>
        </section>

        {/* User profile card */}
        {profile && <UserCard profile={profile} />}

        {/* Quick actions */}
        <section className="home__actions" aria-labelledby="actions-heading">
          <h2 id="actions-heading" className="visually-hidden">
            Quick Actions
          </h2>
          <div className="home__actions-grid">
            <button type="button" className="home__action-card" disabled>
              <div className="home__action-icon">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"
                  />
                </svg>
              </div>
              <span className="home__action-title">Settings</span>
              <span className="home__action-badge">Coming Soon</span>
            </button>

            <button type="button" className="home__action-card" disabled>
              <div className="home__action-icon">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"
                  />
                </svg>
              </div>
              <span className="home__action-title">Security</span>
              <span className="home__action-badge">Coming Soon</span>
            </button>

            <button type="button" className="home__action-card" disabled>
              <div className="home__action-icon">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"
                  />
                </svg>
              </div>
              <span className="home__action-title">Activity</span>
              <span className="home__action-badge">Coming Soon</span>
            </button>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="home__footer">
        <p>
          Secure authentication powered by{" "}
          <a
            href="https://supabase.com"
            target="_blank"
            rel="noopener noreferrer"
            className="home__link"
          >
            Supabase
          </a>
        </p>
      </footer>
    </main>
  );
}

export default Home;
