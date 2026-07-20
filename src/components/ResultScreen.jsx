import { useState, useEffect, useMemo } from "react";
import Leaderboard from "./Leaderboard";
import ShareButton from "./ShareButton";
import GoogleSignIn from "./GoogleSignIn";

function Confetti() {
  const pieces = useMemo(() => {
    const colors = ["#f5c518", "#00e676", "#26c6da", "#ff4081", "#7c4dff", "#fff"];
    return Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: `${Math.random() * 2}s`,
      duration: `${2 + Math.random() * 3}s`,
      size: `${6 + Math.random() * 8}px`,
      rotation: Math.random() > 0.5 ? "rotate(45deg)" : "rotate(0deg)",
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: p.left,
            backgroundColor: p.color,
            animationDelay: p.delay,
            "--fall-duration": p.duration,
            width: p.size,
            height: p.size,
            transform: p.rotation,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
          }}
        />
      ))}
    </div>
  );
}

export default function ResultScreen({
  score,
  totalTime,
  totalQuestions,
  onPlayAgain,
  onGoHome,
}) {
  const [showConfetti, setShowConfetti] = useState(false);
  const percentage = Math.round((score / totalQuestions) * 100);

  useEffect(() => {
    if (percentage >= 60) {
      setShowConfetti(true);
      const t = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(t);
    }
  }, [percentage]);

  const getEmoji = () => {
    if (percentage === 100) return "🏆";
    if (percentage >= 80) return "🥇";
    if (percentage >= 60) return "🥈";
    if (percentage >= 40) return "🥉";
    return "💪";
  };

  const getMessage = () => {
    if (percentage === 100) return "Ідеально! Ти справжній експерт!";
    if (percentage >= 80) return "Чудовий результат! Ти знаєш футбол!";
    if (percentage >= 60) return "Добре! Є простір для зростання!";
    if (percentage >= 40) return "Непогано! Спробуй ще раз!";
    return "Не здавайся! Спробуй ще!";
  };

  const getScoreColor = () => {
    if (percentage >= 80) return "text-fifa-green";
    if (percentage >= 60) return "text-fifa-gold";
    if (percentage >= 40) return "text-fifa-cyan";
    return "text-fifa-red";
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-6 animate-fade-in-up">
      {showConfetti && <Confetti />}

      {/* Result Card */}
      <div className="glass-card p-8 text-center space-y-6 animate-pulse-glow">
        <div className="text-6xl animate-bounce-in">{getEmoji()}</div>

        <div>
          <h2 className="text-2xl md:text-3xl font-black text-white mb-2">
            {getMessage()}
          </h2>
          <p className="text-fifa-muted">FIFA World Cup 2026 Квіз</p>
        </div>

        {/* Score display */}
        <div className="flex items-center justify-center gap-8">
          <div className="text-center">
            <div className={`text-5xl font-black ${getScoreColor()}`}>
              {score}
              <span className="text-2xl text-fifa-muted font-normal">
                /{totalQuestions}
              </span>
            </div>
            <div className="text-sm text-fifa-muted mt-1">Правильних</div>
          </div>
          <div className="w-px h-16 bg-white/10" />
          <div className="text-center">
            <div className="text-5xl font-black text-fifa-cyan">
              {totalTime}
              <span className="text-2xl text-fifa-muted font-normal">с</span>
            </div>
            <div className="text-sm text-fifa-muted mt-1">Загальний час</div>
          </div>
        </div>

        {/* Percentage bar */}
        <div className="w-full max-w-xs mx-auto">
          <div className="flex justify-between text-xs text-fifa-muted mb-1">
            <span>Результат</span>
            <span>{percentage}%</span>
          </div>
          <div className="h-3 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${
                percentage >= 60
                  ? "from-fifa-green to-fifa-teal"
                  : "from-fifa-gold to-amber-500"
              } transition-all duration-1000 ease-out`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <ShareButton score={score} totalTime={totalTime} totalQuestions={totalQuestions} />
        <GoogleSignIn score={score} totalTime={totalTime} />
      </div>

      <div className="flex gap-3">
        <button
          onClick={onPlayAgain}
          className="flex-1 py-3 px-6 bg-gradient-to-r from-fifa-gold to-amber-500 text-fifa-navy font-bold rounded-xl hover:scale-[1.02] active:scale-95 transition-all duration-200 cursor-pointer"
        >
          🔄 Грати ще раз
        </button>
        <button
          onClick={onGoHome}
          className="py-3 px-6 glass-card text-white/80 font-semibold hover:text-white hover:bg-white/10 transition-all duration-200 cursor-pointer"
        >
          🏠 На головну
        </button>
      </div>

      {/* Leaderboard */}
      <Leaderboard currentScore={score} currentTime={totalTime} />
    </div>
  );
}
