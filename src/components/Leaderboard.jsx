import { useState, useEffect } from "react";
import { fetchLeaderboard } from "../firebase";

function formatDateTime(playedAt) {
  if (!playedAt) return "—";
  let date;
  if (typeof playedAt.toDate === "function") {
    date = playedAt.toDate();
  } else if (playedAt.seconds !== undefined) {
    date = new Date(playedAt.seconds * 1000);
  } else if (playedAt instanceof Date) {
    date = playedAt;
  } else if (typeof playedAt === "string" || typeof playedAt === "number") {
    date = new Date(playedAt);
  } else {
    return "—";
  }

  if (isNaN(date.getTime())) return "—";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}.${month}.${year} ${hours}:${minutes}`;
}

export default function Leaderboard({ currentScore, currentTime, refreshKey }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const data = await fetchLeaderboard(10);
        if (!cancelled) setEntries(data);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  const getMedalEmoji = (index) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return `${index + 1}`;
  };

  return (
    <div className="glass-card p-4 sm:p-6 animate-fade-in">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        🏆 Рейтингова таблиця
        <span className="text-xs text-fifa-muted font-normal">ТОП-10</span>
      </h3>

      {loading ? (
        <div className="inline-loader">
          <span className="inline-loader-ball">⚽</span>
          <span className="inline-loader-text">Завантаження рейтингу…</span>
        </div>
      ) : error || entries.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-fifa-muted text-sm">
            {error
              ? "Не вдалося завантажити рейтинг. Перевірте Firebase конфігурацію."
              : "Рейтинг порожній. Будьте першим! 🎯"}
          </p>
          {currentScore !== undefined && (
            <div className="mt-4 glass-card p-3 inline-block">
              <p className="text-xs text-fifa-muted">Ваш результат:</p>
              <p className="text-lg font-bold text-fifa-gold">
                {currentScore} правильних • {currentTime}с
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {/* Table Header */}
          <div className="grid grid-cols-[24px_1fr_90px_50px_40px] sm:grid-cols-[36px_1fr_135px_70px_55px] gap-1 sm:gap-2 px-2 sm:px-3 py-2 text-[11px] sm:text-xs text-fifa-muted font-semibold uppercase tracking-wider items-center">
            <span>#</span>
            <span>Гравець</span>
            <span className="text-center sm:text-left">Дата та час</span>
            <span className="text-right">Рахунок</span>
            <span className="text-right">Час</span>
          </div>

          {/* Entries */}
          {entries.map((entry, index) => (
            <div
              key={entry.id}
              className={`grid grid-cols-[24px_1fr_90px_50px_40px] sm:grid-cols-[36px_1fr_135px_70px_55px] gap-1 sm:gap-2 items-center px-2 sm:px-3 py-3 rounded-xl transition-all duration-200 ${
                index < 3
                  ? "bg-fifa-gold/5 border border-fifa-gold/10"
                  : "hover:bg-white/5"
              }`}
            >
              <span className="text-sm sm:text-base font-bold">
                {getMedalEmoji(index)}
              </span>
              <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                {entry.photoURL ? (
                  <img
                    src={entry.photoURL}
                    alt=""
                    className="w-5 h-5 sm:w-7 sm:h-7 rounded-full border border-white/20 shrink-0"
                  />
                ) : (
                  <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-fifa-purple/30 flex items-center justify-center text-[10px] sm:text-xs font-bold shrink-0">
                    {entry.displayName?.[0] || "?"}
                  </div>
                )}
                <span className="text-xs sm:text-sm font-medium text-white truncate">
                  {entry.displayName || "Анонім"}
                </span>
              </div>
              <span className="text-center sm:text-left text-[10px] sm:text-xs text-fifa-muted whitespace-nowrap">
                {formatDateTime(entry.playedAt)}
              </span>
              <span className="text-right text-xs sm:text-sm font-bold text-fifa-gold">
                {entry.score}/10
              </span>
              <span className="text-right text-[11px] sm:text-xs text-fifa-muted">
                {entry.totalTime}с
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
