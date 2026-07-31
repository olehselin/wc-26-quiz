import { useState, useCallback } from "react";

/* ─── Threads SVG Icon (official logotype path) ─── */
const ThreadsIcon = () => (
  <svg
    viewBox="0 0 192 192"
    width="20"
    height="20"
    fill="currentColor"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M141.537 88.988a66.667 66.667 0 0 0-2.518-1.143c-1.482-27.307-16.403-42.94-41.457-43.1h-.34c-14.986 0-27.449 6.396-35.12 18.036l13.779 9.452c5.73-8.695 14.724-10.548 21.348-10.548h.229c8.249.053 14.474 2.452 18.503 7.129 2.932 3.405 4.893 8.111 5.864 14.05-7.314-1.243-15.224-1.626-23.68-1.14-23.82 1.371-39.134 15.264-38.105 34.568.522 9.792 5.4 18.216 13.735 23.719 7.047 4.652 16.124 6.927 25.557 6.412 12.458-.683 22.231-5.436 29.05-14.127 5.177-6.6 8.452-15.153 9.898-25.93 5.937 3.583 10.337 8.298 12.767 13.966 4.132 9.635 4.373 25.468-8.546 38.376-11.319 11.308-24.925 16.2-45.488 16.351-22.809-.169-40.06-7.483-51.275-21.742C28.185 127.907 22.865 108.88 22.677 84c.188-24.88 5.508-43.907 15.806-56.564C49.698 13.677 66.949 6.363 89.758 6.194c22.975.17 40.526 7.51 52.171 21.818 5.71 7.04 10.015 15.88 12.833 26.218l16.147-4.308c-3.44-12.671-8.853-23.606-16.219-32.668C139.764 1.817 118.944-6.716 89.893-6.5h-.111C60.778-6.716 39.766 1.792 25.887 17.516 13.637 31.48 7.189 51.38 7.001 84c.188 32.62 6.636 52.52 18.886 66.484C39.766 166.208 60.778 174.716 89.782 174.5h.111c25.395-.188 43.276-6.832 58.001-21.546 19.313-19.302 18.721-43.487 12.366-58.348-4.492-10.474-13.105-19.01-18.723-23.618Z" />
    <path d="M96.948 105.512c-5.317.305-10.847-2.082-11.122-7.234-.195-3.657 2.314-7.54 12.82-8.16 11.212-.645 16.394.344 16.394.344-.002 2.01-.04 3.815-.12 5.327-.641 12.204-8.596 19.44-17.972 19.723Z" />
  </svg>
);

/* ─── Checkmark icon for "done" state ─── */
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
 * ThreadsShareButton
 *
 * Props:
 *  - resultText  {string}        Текст для поширення (напр. "Я набрав 8/10...")
 *  - projectUrl  {string}        Посилання на проєкт
 *  - imageFile   {File|Blob|null} Згенерована картинка результату (з canvas/html2canvas)
 *  - className   {string}        Додаткові Tailwind-класи
 *
 * Логіка:
 *  1. navigator.canShare({ files }) → true (мобільний):
 *       Викликає navigator.share({ text, url, files }).
 *       Системне меню дозволить обрати Threads, картинка прикріпиться.
 *  2. Інакше (десктоп / браузер без file-sharing):
 *       Відкриває Threads Web Intent у новій вкладці з закодованим текстом.
 *  3. AbortError (скасував) → тихий no-op.
 *  4. Будь-яка інша помилка → логується, додаток не падає.
 */
export default function ThreadsShareButton({
  resultText = "Я проходжу квіз про ЧС-2026! А ти зможеш краще?",
  projectUrl = "https://wc-26-quiz.vercel.app/",
  imageFile = null,
  className = "",
}) {
  const [status, setStatus] = useState("idle"); // "idle" | "sharing" | "done"

  const handleShare = useCallback(async () => {
    if (status === "sharing") return;

    const fullText = `${resultText}\n${projectUrl}`;

    /* Нормалізуємо Blob → File, якщо потрібно */
    const normalizedFile =
      imageFile instanceof File
        ? imageFile
        : imageFile instanceof Blob
        ? new File([imageFile], "result.png", { type: "image/png" })
        : null;

    /* Перевіряємо підтримку Web Share API з файлами */
    const supportsFileShare =
      typeof navigator !== "undefined" &&
      typeof navigator.share === "function" &&
      typeof navigator.canShare === "function" &&
      normalizedFile !== null &&
      navigator.canShare({ files: [normalizedFile] });

    if (supportsFileShare) {
      /* ── Шлях 1: Мобільний — Web Share API з файлом ── */
      try {
        setStatus("sharing");
        await navigator.share({
          text: fullText,
          url: projectUrl,
          files: [normalizedFile],
        });
        setStatus("done");
        setTimeout(() => setStatus("idle"), 2500);
      } catch (err) {
        setStatus("idle");
        if (err.name === "AbortError") return; // Користувач скасував — нормально
        console.error("[ThreadsShareButton] navigator.share error:", err);
      }
      return;
    }

    /* ── Шлях 2: Fallback — Threads Web Intent (десктоп) ── */
    const encodedText = encodeURIComponent(fullText);
    const threadsIntentUrl = `https://www.threads.net/intent/post?text=${encodedText}`;
    window.open(threadsIntentUrl, "_blank", "noopener,noreferrer");

    setStatus("done");
    setTimeout(() => setStatus("idle"), 2500);
  }, [status, resultText, projectUrl, imageFile]);

  const isSharing = status === "sharing";
  const isDone = status === "done";

  return (
    <button
      id="share-threads-btn"
      onClick={handleShare}
      disabled={isSharing}
      aria-label={
        isDone
          ? "Поширення виконано"
          : isSharing
          ? "Відкриваємо…"
          : "Поділитися в Threads"
      }
      className={[
        /* Layout */
        "relative flex items-center justify-center gap-2.5",
        "w-full sm:w-auto px-6 py-3",
        /* Shape */
        "rounded-xl",
        /* Threads brand: deep black */
        "bg-neutral-900 text-white",
        /* Typography */
        "font-semibold text-sm sm:text-base tracking-wide select-none",
        /* Hover / active */
        "hover:scale-105 hover:bg-neutral-800 hover:shadow-lg hover:shadow-black/50",
        "active:scale-95",
        /* Transitions */
        "transition-all duration-300 ease-out",
        /* Border accent */
        "ring-1 ring-white/10",
        /* Overflow for shimmer */
        "overflow-hidden",
        /* Disabled */
        "cursor-pointer disabled:cursor-not-allowed disabled:opacity-60",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Subtle shimmer on hover */}
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
      />

      {/* Icon */}
      <span className="relative z-10 flex-shrink-0">
        {isDone ? <CheckIcon /> : <ThreadsIcon />}
      </span>

      {/* Label */}
      <span className="relative z-10 whitespace-nowrap">
        {isDone
          ? "Поширено! ✓"
          : isSharing
          ? "Відкриваємо…"
          : "Поділитися в Threads"}
      </span>
    </button>
  );
}
