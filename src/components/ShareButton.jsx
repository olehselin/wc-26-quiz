import { useState, useRef, useCallback, useEffect } from "react";
import html2canvas from "html2canvas";
import ShareCard from "./ShareCard";
import ShareResultCard from "./ShareResultCard";
import { RESULT_GRADATION, formatTime } from "./ResultScreen";

/* ─── SVG Icons ─── */
const IconInstagram = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);

const IconThreads = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M12.186 24h-.007C5.965 24 2.3 20.105 2.3 14.735v-.57C2.3 8.388 5.947 4.5 12.18 4.5c3.235 0 5.727 1.058 7.408 3.145l-2.36 2.36c-1.174-1.381-2.903-2.085-5.133-2.085-3.925 0-6.247 2.727-6.247 6.815v.58c0 4.2 2.322 6.765 6.247 6.765 2.37 0 4.098-.783 5.15-2.33.74-1.09 1.15-2.545 1.216-4.33h-5.24v-3.1h8.72v1.17c0 7.18-3.794 10.51-9.755 10.51z" />
  </svg>
);

const IconLink = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

const IconDownload = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const IconClose = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const IconShare = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);



/* ─── Main ShareButton Component ─── */
export default function ShareButton({ score, totalTime, totalQuestions, resultData: externalResultData }) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [toast, setToast] = useState(null);
  const cardRef = useRef(null);

  const ratio = totalQuestions > 0 ? (score || 0) / totalQuestions : 0;
  const lookupKey = Math.max(0, Math.min(10, Math.round(ratio * 10)));
  const team = externalResultData?.team || RESULT_GRADATION?.[lookupKey]?.team || "Збірна України";
  const flag = externalResultData?.flag || RESULT_GRADATION?.[lookupKey]?.flag || "⚽";
  const formattedTimeStr = formatTime(totalTime);

  const shareUrl = "https://wc-26-quiz.web.app";
  const shareText = `Моя збірна: ${flag} ${team}!\nЯ відповів правильно на ${score} з ${totalQuestions} питань у квізі до ЧС-2026 за ${formattedTimeStr}!\n\nА ти зможеш краще? Спробуй тут:\n${shareUrl}`;

  const showToast = useCallback((message) => {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  }, []);

  /* Generate image blob from the result card */
  const generateImage = useCallback(async () => {
    if (!cardRef.current) return null;
    setGenerating(true);
    try {
      const images = cardRef.current.querySelectorAll("img");
      await Promise.all(
        Array.from(images).map(
          (img) =>
            new Promise((resolve) => {
              if (img.complete && img.naturalWidth !== 0) resolve();
              else {
                img.onload = resolve;
                img.onerror = resolve;
              }
            })
        )
      );

      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#070a1e",
        logging: false,
        width: 1080,
        height: 1920,
        windowWidth: 1080,
        windowHeight: 1920,
      });

      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          setGenerating(false);
          resolve(blob);
        }, "image/png");
      });
    } catch (err) {
      console.error("Failed to generate image:", err);
      setGenerating(false);
      return null;
    }
  }, []);

  /* Save image to device (ONLY here image downloading happens) */
  const handleSaveImage = useCallback(async () => {
    const blob = await generateImage();
    if (!blob) {
      showToast("❌ Не вдалося створити зображення");
      return;
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `wc2026-quiz-result.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast("✅ Зображення збережено!");
  }, [generateImage, showToast]);

  /* Copy link */
  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareText);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = shareText;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    showToast("✅ Посилання скопійовано!");
    setTimeout(() => setCopied(false), 2500);
  }, [shareText, showToast]);

  /* Share to Instagram */
  const handleInstagram = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareText);
    } catch {
      // fallback
    }
    showToast("📸 Текст скопійовано! Відкриваємо Instagram...");
    setTimeout(() => {
      window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer");
    }, 350);
  }, [shareText, showToast]);

  /* Share to Threads */
  const handleThreads = useCallback(() => {
    const text = encodeURIComponent(shareText);
    window.open(`https://www.threads.net/intent/post?text=${text}`, "_blank", "noopener,noreferrer");
  }, [shareText]);

  const isMobile = typeof navigator !== "undefined" && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  return (
    <>
      {/* Main trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex-1 py-3.5 px-6 bg-gradient-to-r from-fifa-gold via-amber-400 to-amber-500 text-fifa-navy font-bold rounded-xl flex items-center justify-center gap-2.5 hover:scale-[1.02] hover:brightness-110 active:scale-95 transition-all duration-200 cursor-pointer shadow-lg shadow-fifa-gold/20 border border-amber-300/50"
      >
        <IconShare />
        <span>Поділитися результатом</span>
      </button>

      {/* Share Modal Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[999999] flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/75 backdrop-blur-md"
            style={{ animation: "fade-in 0.2s ease-out" }}
          />

          {/* Modal content */}
          <div
            className="relative w-full max-w-sm sm:max-w-md mx-auto rounded-2xl overflow-hidden shadow-2xl z-10"
            style={{
              background: "linear-gradient(170deg, #141a3a 0%, #0d1230 100%)",
              border: "1px solid rgba(255,255,255,0.18)",
              animation: "fade-in-up 0.25s ease-out",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white">Поділитися результатом</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-white/60 hover:text-white cursor-pointer"
              >
                <IconClose />
              </button>
            </div>

            {/* Social & Utility buttons */}
            <div className="px-4 py-3.5 space-y-3">
              <div className={`grid ${isMobile ? "grid-cols-2" : "grid-cols-1"} gap-2.5`}>
                {/* Instagram (Mobile only) */}
                {isMobile && (
                  <button
                    onClick={handleInstagram}
                    disabled={generating}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-95 cursor-pointer disabled:opacity-50"
                    style={{
                      background: "linear-gradient(135deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%)",
                    }}
                  >
                    <IconInstagram />
                    <span className="text-xs font-bold text-white">Instagram</span>
                  </button>
                )}

                {/* Threads */}
                <button
                  onClick={handleThreads}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-black hover:bg-neutral-900 border border-white/15 transition-all duration-200 hover:scale-[1.02] active:scale-95 cursor-pointer text-white"
                >
                  <IconThreads />
                  <span className="text-xs font-bold">Threads</span>
                </button>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3 my-2">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-[11px] text-white/40 font-medium">або</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              {/* Utility buttons */}
              <div className="flex gap-2.5">
                <button
                  onClick={handleCopyLink}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs sm:text-sm transition-all duration-200 active:scale-95 cursor-pointer border border-white/10"
                >
                  <IconLink />
                  {copied ? "Скопійовано!" : "Копіювати"}
                </button>
                <button
                  onClick={handleSaveImage}
                  disabled={generating}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs sm:text-sm transition-all duration-200 active:scale-95 cursor-pointer disabled:opacity-50 border border-white/10"
                >
                  <IconDownload />
                  {generating ? "Генерація..." : "Зберегти картку"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast notification */}
      {toast && (
        <div
          className="fixed top-8 left-1/2 -translate-x-1/2 z-[99999] px-6 py-3.5 rounded-2xl text-sm sm:text-base font-bold text-white shadow-2xl flex items-center gap-3 border border-amber-400/50"
          style={{
            background: "linear-gradient(135deg, #1e299b 0%, #111742 100%)",
            boxShadow: "0 10px 40px rgba(0,0,0,0.8), 0 0 20px rgba(245, 197, 24, 0.3)",
            animation: "fade-in-up 0.25s ease-out",
          }}
        >
          {toast}
        </div>
      )}

      {/* Offscreen Result Card for image generation */}
      <div
        style={{
          position: "fixed",
          left: "-9999px",
          top: "0px",
          width: "1080px",
          height: "1920px",
          overflow: "hidden",
          pointerEvents: "none",
          zIndex: -9999,
          opacity: 1,
        }}
      >
        <ShareCard
          score={score}
          totalQuestions={totalQuestions}
          totalTime={totalTime}
          cardRef={cardRef}
        />
      </div>
    </>
  );
}
