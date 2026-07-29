import { useState, useEffect, useMemo, useCallback } from "react";
import Leaderboard from "./Leaderboard";
import ShareButton from "./ShareButton";
import GoogleSignIn from "./GoogleSignIn";

/**
 * Градація результатів (Бал -> Збірна, Опис, Прапор Емоджі, CDN Прапор, Код країни)
 */
export const RESULT_GRADATION = {
  10: {
    team: "Збірна Іспанії",
    description: (<><strong>У цьому квізі ти — збірна Іспанії!</strong> Тікі-така, контроль м'яча, контроль питань — у тебе все під абсолютним контролем. Ти чемпіон, і будь-який суперник може лише аплодувати стоячи!</>),
    flag: "🇪🇸",
    flagUrl: "https://flagcdn.com/w160/es.png",
    code: "ES",
  },
  9: {
    team: "Збірна Аргентини",
    description: (<><strong>У цьому квізі ти — збірна Аргентини!</strong> Ти граєш на рівні Мессі — геніально, елегантно, майже бездоганно. Одна помилочка? Та це просто щоб інші не плакали від заздрощів!</>),
    flag: "🇦🇷",
    flagUrl: "https://flagcdn.com/w160/ar.png",
    code: "AR",
  },
  8: {
    team: "Збірна Англії",
    description: (<><strong>У цьому квізі ти — збірна Англії!</strong> Потужний результат — як Гаррі Кейн у штрафному! Ти ось-ось візьмеш свій трофей, але "it's almost coming home" — бо до ідеалу не вистачило зовсім трішки.</>),
    flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    flagUrl: "https://flagcdn.com/w160/gb-eng.png",
    code: "GB-ENG",
  },
  7: {
    team: "Збірна Франції",
    description: (<><strong>У цьому квізі ти — збірна Франції!</strong> Талант? Безмежний. Зірковий склад? Очевидно. Але іноді навіть Мбаппе промахується — тож не засмучуйся, адже ти все ще у топовій лізі!</>),
    flag: "🇫🇷",
    flagUrl: "https://flagcdn.com/w160/fr.png",
    code: "FR",
  },
  6: {
    team: "Збірна Норвегії",
    description: (<><strong>У цьому квізі ти — збірна Норвегії!</strong> У тебе є свій Холанд — потужний і нестримний, але одного суперзнання замало, треба підтягнути решту команди. Ще трохи тренувань — і ти будеш грати у фіналах!</>),
    flag: "🇳🇴",
    flagUrl: "https://flagcdn.com/w160/no.png",
    code: "NO",
  },
  5: {
    team: "Збірна Марокко",
    description: (<><strong>У цьому квізі ти — збірна Марокко!</strong> Золота середина з африканським характером! Ти здатен на сенсацію і можеш здивувати будь-кого — але стабільності поки бракує. Атласький лев ще гарчатиме!</>),
    flag: "🇲🇦",
    flagUrl: "https://flagcdn.com/w160/ma.png",
    code: "MA",
  },
  4: {
    team: "Збірна Бельгії",
    description: (<><strong>У цьому квізі ти — збірна Бельгії!</strong> "Золоте покоління", що вічно обіцяє більше, ніж дає. Потенціал величезний, але десь між питаннями ти розгубив свою магію. Класичне "наступного разу точно!"</>),
    flag: "🇧🇪",
    flagUrl: "https://flagcdn.com/w160/be.png",
    code: "BE",
  },
  3: {
    team: "Збірна Канади",
    description: (<><strong>У цьому квізі ти — збірна Канади!</strong> Ентузіазму — хоч відбавляй, досвіду — ну, скажімо так, є куди рости. Ти тільки починаєш свій шлях на великій арені, тож не здавайся — кленовий лист ще заграє яскраво!</>),
    flag: "🇨🇦",
    flagUrl: "https://flagcdn.com/w160/ca.png",
    code: "CA",
  },
  2: {
    team: "Збірна Мексики",
    description: (<><strong>У цьому квізі ти — збірна Мексики!</strong> Оле-оле, друже! Пристрасті й емоцій на трибунах більше, ніж голів на полі. Ти яскраво вболіваєш, але відповіді поки не хочуть залітати в сітку. Quinto partido — наступного разу!</>),
    flag: "🇲🇽",
    flagUrl: "https://flagcdn.com/w160/mx.png",
    code: "MX",
  },
  1: {
    team: "Збірна США",
    description: (<><strong>У цьому квізі ти — збірна США!</strong> Ти називаєш це "soccer" і щиро вважаєш, що офсайд — це щось із бейсболу. Але гей, ти хоча б прийшов на гру! Тепер час загуглити правила і повернутися сильнішим!</>),
    flag: "🇺🇸",
    flagUrl: "https://flagcdn.com/w160/us.png",
    code: "US",
  },
  0: {
    team: "Збірна України",
    description: (<><strong>У цьому квізі ти — збірна України!</strong> На жаль, на це футбольне свято ти не потрапив — як і збірна на ЧС-2026. Але українці ніколи не здаються! Тренуйся, вчи матчастину і повертайся з revenge-режимом!</>),
    flag: "🇺🇦",
    flagUrl: "https://flagcdn.com/w160/ua.png",
    code: "UA",
  },
};

/**
 * Компонент якісного відображення прапора збірної
 */
function FlagDisplay({ flagUrl, flagEmoji, teamName }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="relative group">
      <div className="w-24 h-20 sm:w-32 sm:h-24 rounded-2xl bg-gradient-to-br from-white/20 to-white/5 border-2 border-fifa-gold/60 p-1 shadow-2xl backdrop-blur-md hover:scale-105 transition-all duration-300 flex items-center justify-center overflow-hidden">
        {!imgError && flagUrl ? (
          <img
            src={flagUrl}
            alt={`Прапор ${teamName}`}
            onError={() => setImgError(true)}
            crossOrigin="anonymous"
            className="w-full h-full object-cover rounded-xl shadow-md"
          />
        ) : (
          <span
            className="text-5xl sm:text-6xl select-none"
            role="img"
            aria-label={teamName}
          >
            {flagEmoji}
          </span>
        )}
      </div>
    </div>
  );
}

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

/**
 * Спінер / екран завантаження перед показом результату
 */
function ResultSpinner() {
  const messages = useMemo(
    () => [
      "Аналізуємо твою гру...",
      "Підраховуємо голи...",
      "Порівнюємо зі збірними...",
      "Визначаємо твій рівень...",
    ],
    []
  );

  const [msgIndex, setMsgIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % messages.length);
    }, 750);
    return () => clearInterval(interval);
  }, [messages.length]);

  useEffect(() => {
    const start = Date.now();
    const duration = 3000;
    let raf;
    const tick = () => {
      const elapsed = Date.now() - start;
      setProgress(Math.min((elapsed / duration) * 100, 100));
      if (elapsed < duration) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center gap-6 py-20 animate-fade-in">
      {/* Пульсуючий м'яч */}
      <div className="relative">
        <div className="result-spinner-ball">⚽</div>
        <div className="result-spinner-shadow" />
      </div>

      {/* Повідомлення */}
      <p className="text-white/80 text-base sm:text-lg font-semibold tracking-wide text-center min-h-[1.75rem] transition-opacity duration-300">
        {messages[msgIndex]}
      </p>

      {/* Прогрес-бар */}
      <div className="w-full max-w-xs">
        <div className="h-2 bg-white/10 rounded-full overflow-hidden border border-white/5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-fifa-gold via-amber-400 to-fifa-green transition-none"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Анімовані крапки */}
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="result-spinner-dot"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  );
}

export default function ResultScreen({
  score = 0,
  totalTime = 0,
  totalQuestions = 10,
  onPlayAgain,
  onGoHome,
}) {
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [leaderboardKey, setLeaderboardKey] = useState(0);
  const [shareToast, setShareToast] = useState(null);

  // Знаходимо об'єкт збірної за балом score (від 0 до 10)
  const resultData = useMemo(() => {
    const clampedScore = Math.max(0, Math.min(10, Math.round(score || 0)));
    return RESULT_GRADATION[clampedScore] || RESULT_GRADATION[0];
  }, [score]);

  const percentage = Math.round(((score || 0) / totalQuestions) * 100);

  const handleScoreSaved = useCallback(() => {
    setLeaderboardKey((k) => k + 1);
  }, []);

  // Затримка 3 секунди перед показом результату
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Конфетті запускаються тільки після завершення спінера
  useEffect(() => {
    if (!loading && score >= 6) {
      setShowConfetti(true);
      const t = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(t);
    }
  }, [loading, score]);

  // Функція для шерингу через Web Share API (navigator.share) з фолбеком на буфер обміну
  const handleShare = useCallback(async () => {
    const shareText = `Я набрав ${score} балів у квізі до ЧС-2026! Мій рівень — ${resultData.team}. А ти зможеш краще?`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Квіз до ЧС-2026",
          text: shareText,
          url: window.location.href,
        });
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Помилка Web Share API:", err);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareText);
        setShareToast("Текст результату скопійовано!");
        setTimeout(() => setShareToast(null), 3000);
      } catch (err) {
        console.error("Не вдалося скопіювати:", err);
      }
    }
  }, [score, resultData.team]);

  const getScoreColor = () => {
    if (score >= 8) return "text-fifa-green";
    if (score >= 6) return "text-fifa-gold";
    if (score >= 4) return "text-fifa-cyan";
    return "text-fifa-red";
  };

  // Поки йде завантаження — показуємо спінер
  if (loading) {
    return <ResultSpinner />;
  }

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-6 animate-fade-in-up">
      {showConfetti && <Confetti />}

      {/* Toast сповіщення для фолбеку шерингу */}
      {shareToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl bg-gradient-to-r from-fifa-blue to-fifa-navy text-white text-sm font-semibold border border-white/20 shadow-2xl animate-fade-in">
          {shareToast}
        </div>
      )}

      {/* Картка результату */}
      <div className="glass-card p-6 sm:p-8 text-center space-y-6 animate-pulse-glow relative overflow-hidden">
        {/* Відображення прапора країни та інформації про збірну */}
        <div className="flex flex-col items-center justify-center gap-3">
          <FlagDisplay
            flagUrl={resultData.flagUrl}
            flagEmoji={resultData.flag}
            teamName={resultData.team}
          />

          <div className="mt-2">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wide">
              {resultData.team}
            </h2>
            <p className="text-fifa-muted text-xs sm:text-sm font-medium mt-1">
              FIFA World Cup 2026 Квіз
            </p>
          </div>
        </div>

        {/* Опис результату */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 text-sm sm:text-base text-gray-200 leading-relaxed font-normal shadow-inner">
          {resultData.description}
        </div>

        {/* Відображення балів та часу */}
        <div className="flex items-center justify-center gap-6 sm:gap-10 py-2">
          <div className="text-center">
            <div className={`text-4xl sm:text-5xl font-black ${getScoreColor()}`}>
              {score}
              <span className="text-xl sm:text-2xl text-fifa-muted font-normal">
                /{totalQuestions}
              </span>
            </div>
            <div className="text-xs sm:text-sm text-fifa-muted mt-1 font-medium">
              Правильних відповідей
            </div>
          </div>

          {totalTime > 0 && (
            <>
              <div className="w-px h-14 bg-white/10" />
              <div className="text-center">
                <div className="text-4xl sm:text-5xl font-black text-fifa-cyan">
                  {totalTime}
                  <span className="text-xl sm:text-2xl text-fifa-muted font-normal">
                    с
                  </span>
                </div>
                <div className="text-xs sm:text-sm text-fifa-muted mt-1 font-medium">
                  Загальний час
                </div>
              </div>
            </>
          )}
        </div>

        {/* Шкала прогресу (відсоток) */}
        <div className="w-full max-w-xs mx-auto">
          <div className="flex justify-between text-xs text-fifa-muted mb-1 font-medium">
            <span>Точність відповідей</span>
            <span>{percentage}%</span>
          </div>
          <div className="h-3 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/5">
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

      {/* Кнопка Web Share API та додаткові елементи інтерактиву */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleShare}
          className="flex-1 py-3.5 px-6 glass-card text-white font-semibold flex items-center justify-center gap-2 hover:bg-white/15 hover:scale-[1.02] active:scale-95 transition-all duration-200 cursor-pointer shadow-lg border border-fifa-gold/30"
        >
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
          <span>Поділитися результатом</span>
        </button>

        <ShareButton
          score={score}
          totalTime={totalTime}
          totalQuestions={totalQuestions}
        />
        <GoogleSignIn
          score={score}
          totalTime={totalTime}
          onSaved={handleScoreSaved}
        />
      </div>

      {/* Навігаційні кнопки */}
      <div className="flex gap-3">
        {onPlayAgain && (
          <button
            onClick={onPlayAgain}
            className="flex-1 py-3 px-6 bg-gradient-to-r from-fifa-gold to-amber-500 text-fifa-navy font-bold rounded-xl hover:scale-[1.02] active:scale-95 transition-all duration-200 cursor-pointer shadow-md"
          >
            🔄 Грати ще раз
          </button>
        )}
        {onGoHome && (
          <button
            onClick={onGoHome}
            className="py-3 px-6 glass-card text-white/80 font-semibold hover:text-white hover:bg-white/10 transition-all duration-200 cursor-pointer"
          >
            🏠 На головну
          </button>
        )}
      </div>

      {/* Таблиця лідерів */}
      <Leaderboard
        currentScore={score}
        currentTime={totalTime}
        refreshKey={leaderboardKey}
      />
    </div>
  );
}




