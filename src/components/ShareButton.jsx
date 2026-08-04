import { useState, useRef, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import html2canvas from "html2canvas";
import ShareCard from "./ShareCard";
import { formatTime, getGradationResult } from "./ResultScreen";

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
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [toast, setToast] = useState(null);
  const cardRef = useRef(null);
  const firstModalBtnRef = useRef(null);

  const currentResult = externalResultData || getGradationResult(score, t);
  const team = currentResult?.team || "Team";
  const flag = currentResult?.flag || "⚽";
  const shareDescription = currentResult?.shareDescription || "";
  const formattedTimeStr = formatTime(totalTime, t);

  const shareUrl = "https://wc-26-quiz.vercel.app/";
  const shareText = t("shareTextTemplate", {
    flag,
    team,
    description: shareDescription,
    score,
    total: totalQuestions,
    time: formattedTimeStr,
    url: shareUrl,
  });

  const showToast = useCallback((message) => {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  }, []);

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

  const handleSaveImage = useCallback(async () => {
    const blob = await generateImage();
    if (!blob) {
      showToast(t("ui.shareModal.failedImage"));
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
    showToast(t("ui.shareModal.saveSuccess"));
  }, [generateImage, showToast, t]);

  const handleInstagram = useCallback(async () => {
    await handleSaveImage();
    showToast(t("ui.shareModal.instagramTip"));
  }, [handleSaveImage, showToast, t]);

  const handleThreads = useCallback(async () => {
    const encodedText = encodeURIComponent(shareText);
    window.open(`https://www.threads.net/intent/post?text=${encodedText}`, "_blank");
  }, [shareText]);

  const hasNativeShare = typeof navigator !== "undefined" && !!navigator.share;

  const handleNativeShare = useCallback(async () => {
    if (!hasNativeShare) return;
    try {
      await navigator.share({
        title: "FIFA World Cup 2026 Quiz",
        text: shareText,
        url: shareUrl,
      });
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("Native share error:", err);
      }
    }
  }, [hasNativeShare, shareText]);

  useEffect(() => {
    if (isOpen && firstModalBtnRef.current) {
      firstModalBtnRef.current.focus();
    }
  }, [isOpen]);

  return (
    <>
      <button
        id="share-result-btn"
        onClick={() => setIsOpen(true)}
        className="flex-1 py-3.5 px-6 bg-gradient-to-r from-fifa-gold to-amber-500 text-fifa-navy font-bold rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-[0_0_30px_rgba(245,197,24,0.4)] border border-amber-300/40"
      >
        <IconShare />
        <span>{t("ui.shareResult")}</span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
            onClick={() => setIsOpen(false)}
          />

          <div
            className="relative w-full max-w-sm sm:max-w-md mx-auto rounded-2xl overflow-hidden shadow-2xl z-10 pointer-events-auto animate-scale-in"
            style={{
              background: "linear-gradient(170deg, #141a3a 0%, #0d1230 100%)",
              border: "1px solid rgba(255,255,255,0.18)",
            }}
          >
            <div className="relative flex items-center justify-center px-4 py-3.5 border-b border-white/10">
              <h3 className="text-base font-bold text-white text-center">
                {t("ui.shareModal.title")}
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="absolute right-3.5 w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-white/60 hover:text-white cursor-pointer"
                title={t("ui.shareModal.close")}
              >
                <IconClose />
              </button>
            </div>

            <div className="px-4 py-4 space-y-3">
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  ref={firstModalBtnRef}
                  onClick={handleInstagram}
                  disabled={generating}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-95 cursor-pointer disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-fifa-gold"
                  style={{
                    background: "linear-gradient(135deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%)",
                  }}
                >
                  <IconInstagram />
                  <span className="text-xs font-bold text-white">Instagram</span>
                </button>

                <button
                  onClick={handleThreads}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-black hover:bg-neutral-900 border border-white/15 transition-all duration-200 hover:scale-[1.02] active:scale-95 cursor-pointer text-white"
                >
                  <IconThreads />
                  <span className="text-xs font-bold">Threads</span>
                </button>
              </div>

              {hasNativeShare && (
                <button
                  onClick={handleNativeShare}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-fifa-cyan/20 to-fifa-blue/30 hover:from-fifa-cyan/30 hover:to-fifa-blue/40 border border-fifa-cyan/40 text-fifa-cyan font-bold text-xs transition-all duration-200 active:scale-95 cursor-pointer"
                >
                  <IconShare />
                  <span>{t("ui.shareModal.title")}</span>
                </button>
              )}

              <button
                onClick={handleSaveImage}
                disabled={generating}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs sm:text-sm transition-all duration-200 active:scale-95 cursor-pointer disabled:opacity-50 border border-white/10"
              >
                <IconDownload />
                {generating ? t("ui.savingScore") : t("ui.shareModal.saveImage")}
              </button>
            </div>
          </div>
        </div>
      )}

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
          resultData={currentResult}
          cardRef={cardRef}
        />
      </div>
    </>
  );
}
