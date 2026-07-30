import { useState, useCallback } from "react";

/* ─── Instagram SVG Icon ─── */
const InstagramIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);

/* ─── Checkmark icon for "copied" state ─── */
const CheckIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

/**
 * ShareInstagramButton
 *
 * Props:
 *  - title       {string}   Title for Web Share API
 *  - text        {string}   Body text for Web Share API
 *  - url         {string}   URL to share (defaults to current page)
 *  - imageFile   {File|null} Optional PNG/JPG File to share as files[]
 *                            (e.g. a generated result card image for Stories).
 *                            Only used if navigator.canShare({ files }) returns true.
 *  - className   {string}   Extra Tailwind classes (e.g. to override width)
 *
 * Behaviour:
 *  1. navigator.share() available  →  opens system share sheet (mobile).
 *     If imageFile is passed and canShare supports files, includes it for Stories.
 *  2. navigator.share() unavailable  →  copies URL to clipboard + shows feedback.
 *  3. User cancels share sheet (AbortError)  →  silent no-op.
 *  4. Any other error  →  caught and logged, app never crashes.
 */
export default function ShareInstagramButton({
  title = "FIFA World Cup 2026 Quiz",
  text = "Перевір свої знання про ЧС-2026! Зіграй прямо зараз:",
  url = window.location.href,
  imageFile = null,
  className = "",
}) {
  const [status, setStatus] = useState("idle"); // "idle" | "copied" | "sharing"

  const handleShare = useCallback(async () => {
    /* ── Path 1: Web Share API is available ── */
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        setStatus("sharing");

        const shareData = { title, text, url };

        // Attach file for Instagram Stories if browser supports it
        if (imageFile instanceof File) {
          const withFile = { ...shareData, files: [imageFile] };
          if (navigator.canShare && navigator.canShare(withFile)) {
            shareData.files = [imageFile];
          }
        }

        await navigator.share(shareData);
        setStatus("idle");
      } catch (err) {
        setStatus("idle");
        // User closed/cancelled the sheet — ignore silently
        if (err.name === "AbortError") return;
        // Unexpected error — log but don't crash the app
        console.error("[ShareInstagramButton] navigator.share error:", err);
      }
      return;
    }

    /* ── Path 2: Fallback — copy URL to clipboard ── */
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Legacy fallback for browsers without Clipboard API
      const ta = document.createElement("textarea");
      ta.value = url;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }

    setStatus("copied");
    setTimeout(() => setStatus("idle"), 2500);
  }, [title, text, url, imageFile]);

  const isCopied = status === "copied";
  const isSharing = status === "sharing";

  return (
    <button
      id="share-instagram-btn"
      onClick={handleShare}
      disabled={isSharing}
      aria-label={isCopied ? "Посилання скопійовано" : "Поділитися в Instagram"}
      className={[
        "relative flex items-center justify-center gap-2.5",
        "w-full sm:w-auto px-6 py-3.5",
        "rounded-2xl",
        "bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888]",
        "text-white font-semibold text-sm sm:text-base tracking-wide select-none",
        "hover:scale-105 hover:shadow-lg hover:shadow-pink-600/40",
        "active:scale-95",
        "transition-all duration-200 ease-out",
        "cursor-pointer disabled:cursor-not-allowed disabled:opacity-60",
        "ring-1 ring-white/20 overflow-hidden",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Shimmer overlay on hover */}
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-tr from-white/15 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none"
      />

      {/* Icon */}
      <span className="relative z-10 flex-shrink-0 transition-transform duration-150">
        {isCopied ? <CheckIcon /> : <InstagramIcon />}
      </span>

      {/* Label */}
      <span className="relative z-10 whitespace-nowrap">
        {isCopied
          ? "Посилання скопійовано!"
          : isSharing
          ? "Відкриваємо…"
          : "Поділитися в Instagram"}
      </span>
    </button>
  );
}
