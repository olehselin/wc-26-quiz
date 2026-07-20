import { useState } from "react";

export default function ShareButton({ score, totalTime, totalQuestions }) {
  const [copied, setCopied] = useState(false);

  const shareText = `⚽ Я відповів правильно на ${score} з ${totalQuestions} питань у квізі до ЧС-2026 за ${totalTime} секунд! 🏆\n\nА ти зможеш краще? Спробуй тут:`;
  const shareUrl = window.location.href;

  const handleShare = async () => {
    // Try Web Share API first
    if (navigator.share) {
      try {
        await navigator.share({
          title: "FIFA World Cup 2026 Quiz",
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch (err) {
        // User cancelled or API failed — fallback below
        if (err.name === "AbortError") return;
      }
    }

    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Last resort
      const textArea = document.createElement("textarea");
      textArea.value = `${shareText}\n${shareUrl}`;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex-1 py-3 px-6 glass-card text-white font-semibold flex items-center justify-center gap-2 hover:bg-white/10 hover:scale-[1.02] active:scale-95 transition-all duration-200 cursor-pointer"
    >
      {copied ? (
        <>
          <span>✅</span> Скопійовано!
        </>
      ) : (
        <>
          <span>📤</span> Поділитися результатом
        </>
      )}
    </button>
  );
}
