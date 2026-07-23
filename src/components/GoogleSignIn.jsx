import { useState, useEffect, useRef } from "react";
import { signInWithGoogle, saveHighScore, auth } from "../firebase";

export default function GoogleSignIn({ score, totalTime, onSaved }) {
  const [status, setStatus] = useState("idle"); // "idle" | "saving" | "saved" | "error"
  const [saveResult, setSaveResult] = useState(null); // "first" | "record" | "no_update"
  const autoSaveAttempted = useRef(false);

  // Core save logic — reused by both auto-save and manual button
  const performSave = async (user) => {
    setStatus("saving");
    try {
      const resultType = await saveHighScore({
        userId: user.uid,
        displayName: user.displayName || "Гравець",
        photoURL: user.photoURL || "",
        score,
        totalTime,
      });

      setSaveResult(resultType);
      setStatus("saved");
      if (onSaved) onSaved();
    } catch (err) {
      console.error("Error saving score:", err);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  // Auto-save if user is already signed in
  useEffect(() => {
    if (autoSaveAttempted.current) return;
    const user = auth.currentUser;
    if (user) {
      autoSaveAttempted.current = true;
      performSave(user);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Manual sign-in + save for users who are not logged in
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

  // --- Render: saving state ---
  if (status === "saving") {
    return (
      <div className="flex-1 py-3 px-6 glass-card text-white/70 font-semibold flex items-center justify-center gap-2">
        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        Збереження...
      </div>
    );
  }

  // --- Render: saved state with scenario messages ---
  if (status === "saved") {
    // Scenario A: First game
    if (saveResult === "first") {
      return (
        <div className="flex-1 py-3 px-6 glass-card text-fifa-green font-semibold flex items-center justify-center gap-2 border border-fifa-green/20 text-center">
          ✅ Ваш результат успішно збережено в таблиці лідерів!
        </div>
      );
    }

    // Scenario B: New personal record
    if (saveResult === "record") {
      return (
        <div className="flex-1 py-3 px-6 glass-card font-semibold flex items-center justify-center gap-2 border border-fifa-gold/30 text-center text-fifa-gold animate-pulse-glow">
          🎉 Вітаємо! Це ваш новий особистий рекорд. Дані в таблиці лідерів оновлено!
        </div>
      );
    }

    // Scenario C: No improvement
    return (
      <div className="flex-1 py-3 px-6 glass-card text-fifa-muted font-semibold flex items-center justify-center gap-2 border border-white/10 text-center">
        ℹ️ Ви не побили свій попередній рекорд. У таблиці лідерів залишається ваш найкращий результат!
      </div>
    );
  }

  // --- Render: not logged in — show sign-in button ---
  return (
    <button
      onClick={handleSignInAndSave}
      disabled={status === "saving"}
      className="flex-1 py-3 px-6 glass-card text-white font-semibold flex items-center justify-center gap-2 hover:bg-white/10 hover:scale-[1.02] active:scale-95 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {status === "error" ? (
        <>❌ Помилка. Спробуйте ще раз</>
      ) : (
        <>
          <svg className="w-5 h-5" viewBox="0 0 24 24">
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
          Зберегти в рейтинг
        </>
      )}
    </button>
  );
}
