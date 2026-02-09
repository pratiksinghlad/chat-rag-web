/**
 * User Card Component
 *
 * Displays authenticated user's profile information including:
 * - Avatar (with fallback)
 * - Full name
 * - Email
 * - Authentication provider
 */

import type { UserProfile } from "@/types/auth";
import "@/styles/UserCard.css";

interface UserCardProps {
  /** User's profile data */
  profile: UserProfile;
}

/**
 * Get initials from a name for avatar fallback
 */
function getInitials(name: string | null): string {
  if (!name) return "?";

  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

/**
 * Get provider display name
 */
function getProviderDisplayName(provider: string | null): string {
  const providerNames: Record<string, string> = {
    google: "Google",
    github: "GitHub",
    azure: "Microsoft",
  };
  return provider ? providerNames[provider] || provider : "Unknown";
}

export function UserCard({ profile }: UserCardProps) {
  const initials = getInitials(profile.fullName || profile.email);

  return (
    <article className="user-card" aria-label="User profile information">
      <div className="user-card__header">
        <div className="user-card__avatar-container">
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={`${profile.fullName || "User"}'s profile picture`}
              className="user-card__avatar"
              referrerPolicy="no-referrer"
              onError={(e) => {
                // Fallback to initials on image load error
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                target.nextElementSibling?.classList.remove(
                  "user-card__avatar-fallback--hidden",
                );
              }}
            />
          ) : null}
          <div
            className={`user-card__avatar-fallback ${
              profile.avatarUrl ? "user-card__avatar-fallback--hidden" : ""
            }`}
            aria-hidden={!!profile.avatarUrl}
          >
            {initials}
          </div>
        </div>

        <div className="user-card__verified-badge" title="Verified account">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="10" fill="currentColor" />
            <path
              d="M8 12l2.5 2.5L16 9"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      <div className="user-card__info">
        <h2 className="user-card__name" id="user-name">
          {profile.fullName || "Name not provided"}
        </h2>

        <p className="user-card__email" id="user-email">
          <svg
            className="user-card__icon"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              fill="currentColor"
              d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
            />
          </svg>
          <span>{profile.email || "Email not provided"}</span>
        </p>

        <div className="user-card__provider">
          <span className="user-card__provider-label">Signed in with</span>
          <span className="user-card__provider-badge">
            {getProviderDisplayName(profile.provider)}
          </span>
        </div>
      </div>

      <div className="user-card__meta">
        {profile.createdAt && (
          <p className="user-card__meta-item">
            <span className="user-card__meta-label">Member since</span>
            <span className="user-card__meta-value">
              {new Date(profile.createdAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </p>
        )}
        {profile.lastSignInAt && (
          <p className="user-card__meta-item">
            <span className="user-card__meta-label">Last sign in</span>
            <span className="user-card__meta-value">
              {new Date(profile.lastSignInAt).toLocaleString(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </span>
          </p>
        )}
      </div>
    </article>
  );
}

export default UserCard;
