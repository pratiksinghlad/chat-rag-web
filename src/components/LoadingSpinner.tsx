/**
 * Loading Spinner Component
 *
 * Displays animated loading indicator with optional loading message.
 */

import "@/styles/LoadingSpinner.css";

interface LoadingSpinnerProps {
  /** Optional message to display below spinner */
  message?: string;
  /** Size variant */
  size?: "small" | "medium" | "large";
}

export function LoadingSpinner({
  message = "Loading...",
  size = "medium",
}: LoadingSpinnerProps) {
  return (
    <div className="loading-spinner-container" role="status" aria-live="polite">
      <div className={`loading-spinner loading-spinner--${size}`}>
        <div className="loading-spinner__ring"></div>
        <div className="loading-spinner__ring"></div>
        <div className="loading-spinner__ring"></div>
      </div>
      {message && <p className="loading-spinner__message">{message}</p>}
      <span className="visually-hidden">Loading, please wait</span>
    </div>
  );
}

export default LoadingSpinner;
