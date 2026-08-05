import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { onAuthStateChanged } from "firebase/auth";
import { signInWithGoogle, saveHighScore, auth } from "../firebase";

export default function GoogleSignIn({ score, totalTime, onSaved }) {
  const { t, i18n } = useTranslation();
  const [status, setStatus] = useState("idle"); // "idle" | "saving" | "saved" | "error"
  const [saveResult, setSaveResult] = useState(null); // "first" | "record" | "no_update"
  const autoSaveAttempted = useRef(false);
  const isEn = i18n.language && i18n.language.startsWith("en");

  // Keep refs to latest score/totalTime so the async callback always uses
  // up-to-date values even if the component re-renders before saving.
  const scoreRef = useRef(score);
  const timeRef = useRef(totalTime);
  const isEnRef = useRef(isEn);
  useEffect(() => { scoreRef.current = score; }, [score]);
  useEffect(() => { timeRef.current = totalTime; }, [totalTime]);
  useEffect(() => { isEnRef.current = isEn; }, [isEn]);

  const performSave = useCallback(async (user) => {
    setStatus("saving");
    try {
      const resultType = await saveHighScore({
        userId: user.uid,
        displayName: user.displayName || (isEnRef.current ? "Player" : "Гравець"),
        photoURL: user.photoURL || "",
        score: scoreRef.current,
        totalTime: timeRef.current,
      });

      setSaveResult(resultType);
      setStatus("saved");
      if (onSaved) onSaved();
    } catch (err) {
      console.error("Error saving score:", err);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  }, [onSaved]);

  // Subscribe to auth state so we catch the case where Firebase restores
  // an existing session asynchronously (auth.currentUser is null on mount).
  useEffect(() => {
    if (autoSaveAttempted.current) return;

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && !autoSaveAttempted.current) {
        autoSaveAttempted.current = true;
        unsubscribe(); // stop listening after first successful user
        performSave(user);
      }
    });

    // If after a short delay there's still no user, unsubscribe to avoid
    // triggering auto-save if the user signs in later manually.
    const timeout = setTimeout(() => {
      unsubscribe();
    }, 5000);

    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
  }, [performSave]);

  const handleSignInAndSave = async () => {
    try {
      const result = await signInWithGoogle();
      await performSave(result.user);
    } catch (err) {
      console.error("Error signing in:", err);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  if (status === "saving") {
    return (
      <div className="flex-1 py-3.5 px-6 glass-card text-fifa-green font-bold flex items-center justify-center gap-2.5 rounded-xl border border-fifa-green/40 shadow-lg shadow-fifa-green/10">
        <div className="w-4 h-4 border-2 border-fifa-green/30 border-t-fifa-green rounded-full animate-spin" />
        {t("ui.savingScore")}
      </div>
    );
  }

  if (status === "saved") {
    if (saveResult === "first") {
      return (
        <div className="flex-1 py-3.5 px-6 glass-card text-fifa-green font-bold flex items-center justify-center gap-2 rounded-xl border border-fifa-green/30 text-center shadow-lg shadow-fifa-green/10">
          ✅ {isEn ? "Your result was saved to the leaderboard!" : "Ваш результат успішно збережено в таблиці лідерів!"}
        </div>
      );
    }

    if (saveResult === "record") {
      return (
        <div className="flex-1 py-3.5 px-6 glass-card font-bold flex items-center justify-center gap-2 rounded-xl border border-fifa-gold/40 text-center text-fifa-gold animate-pulse-glow shadow-lg shadow-fifa-gold/15">
          🎉 {isEn ? "Congratulations! New personal best record!" : "Вітаємо! Це ваш новий особистий рекорд!"}
        </div>
      );
    }

    return (
      <div className="flex-1 py-3.5 px-6 glass-card text-fifa-muted font-bold flex items-center justify-center gap-2 rounded-xl border border-white/10 text-center">
        ℹ️ {isEn ? "You didn't break your personal record. Your best score remains on the leaderboard!" : "Ви не побили свій попередній рекорд. У таблиці лідерів залишається ваш найкращий результат!"}
      </div>
    );
  }

  return (
    <button
      onClick={handleSignInAndSave}
      disabled={status === "saving"}
      className="relative group overflow-hidden flex-1 py-3.5 px-6 rounded-xl font-montserrat font-extrabold text-base text-fifa-navy bg-gradient-to-r from-fifa-green via-emerald-400 to-fifa-teal hover:from-fifa-green hover:to-fifa-teal shadow-[0_0_20px_rgba(0,230,118,0.35)] hover:shadow-[0_0_30px_rgba(0,230,118,0.55)] border-2 border-fifa-green/60 hover:border-fifa-green hover:scale-[1.02] active:scale-95 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {/* Shimmer sweep effect */}
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />

      {status === "error" ? (
        <span className="relative z-10 flex items-center gap-2 text-red-900 font-bold">
          {isEn ? "❌ Error. Try again" : "❌ Помилка. Спробуйте ще раз"}
        </span>
      ) : (
        <span className="relative z-10 flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-md p-1 group-hover:scale-110 transition-transform duration-200">
            <svg className="w-4 h-4" viewBox="0 0 24 24">
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
          </div>
          <span className="tracking-wide">{t("ui.saveScore")}</span>
        </span>
      )}
    </button>
  );
}
