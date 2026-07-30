import { useState, useEffect, useMemo, useCallback } from "react";
import Leaderboard from "./Leaderboard";
import ShareButton from "./ShareButton";
import GoogleSignIn from "./GoogleSignIn";
import DonateButton from "./DonateButton";

/**
 * Допоміжна функція форматування часу проходження:
 * - Менше 60 секунд: у форматі з десятими (наприклад, 50.6 с)
 * - 60 секунд або більше: у хвилини та секунди без десятих (наприклад, 1 хв 12 с)
 */
export function formatTime(seconds) {
  if (seconds == null || isNaN(seconds) || seconds <= 0) return "0.0 с";
  const num = Number(seconds);
  if (num < 60) {
    const rounded = Math.round(num * 10) / 10;
    return `${rounded.toFixed(1)} с`;
  }
  const mins = Math.floor(num / 60);
  const secs = Math.floor(num % 60);
  return `${mins} хв ${secs} с`;
}

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
 * Компонент якісного та чистого відображення прапора збірної (без рамки FUT картки)
 */
function FlagDisplay({ flagUrl, flagEmoji, teamName }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="relative group my-2 select-none">
      {/* М'яке світіння прапора */}
      <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-fifa-gold/30 via-fifa-blue/20 to-fifa-cyan/30 opacity-50 blur-xl group-hover:opacity-80 transition-all duration-300 pointer-events-none" />

      {/* Рамка прапора з легким бліком та внутрішньою тінню */}
      <div className="relative w-32 h-22 sm:w-40 sm:h-28 rounded-2xl p-1 bg-gradient-to-b from-fifa-gold/60 via-white/20 to-fifa-gold/40 border border-fifa-gold/70 shadow-2xl backdrop-blur-md hover:scale-105 transition-all duration-300 overflow-hidden">
        <div className="w-full h-full rounded-xl overflow-hidden relative shadow-inner">
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
              className="text-5xl sm:text-6xl flex items-center justify-center h-full select-none"
              role="img"
              aria-label={teamName}
            >
              {flagEmoji}
            </span>
          )}
          {/* Легкий внутрішній блік та inner shadow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none" />
          <div className="absolute inset-0 shadow-[inset_0_0_12px_rgba(0,0,0,0.35)] rounded-xl pointer-events-none" />
        </div>
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
 * Екран завантаження перед показом результату
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
      <div className="relative">
        <div className="result-spinner-ball">⚽</div>
        <div className="result-spinner-shadow" />
      </div>

      <p className="text-white/80 text-base sm:text-lg font-semibold tracking-wide text-center min-h-[1.75rem] transition-opacity duration-300">
        {messages[msgIndex]}
      </p>

      <div className="w-full max-w-xs">
        <div className="h-2 bg-white/10 rounded-full overflow-hidden border border-white/5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-fifa-gold via-amber-400 to-fifa-green transition-none"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

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

  const resultData = useMemo(() => {
    const clampedScore = Math.max(0, Math.min(10, Math.round(score || 0)));
    return RESULT_GRADATION[clampedScore] || RESULT_GRADATION[0];
  }, [score]);

  const percentage = Math.round(((score || 0) / totalQuestions) * 100);

  const handleScoreSaved = useCallback(() => {
    setLeaderboardKey((k) => k + 1);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading && score >= 6) {
      setShowConfetti(true);
      const t = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(t);
    }
  }, [loading, score]);

  const getScoreColor = () => {
    if (score >= 8) return "text-fifa-green";
    if (score >= 6) return "text-fifa-gold";
    if (score >= 4) return "text-fifa-cyan";
    return "text-fifa-red";
  };

  if (loading) {
    return <ResultSpinner />;
  }

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-6 animate-fade-in-up relative z-10">
      {showConfetti && <Confetti />}

      {shareToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl bg-gradient-to-r from-fifa-blue to-fifa-navy text-white text-sm font-semibold border border-white/20 shadow-2xl animate-fade-in">
          {shareToast}
        </div>
      )}

      {/* Картка результату у стилі Glassmorphism */}
      <div className="glass-card p-6 sm:p-8 text-center space-y-6 animate-pulse-glow relative overflow-hidden bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl">
        {/* Відображення прапора країни та інформації про збірну (без рамки FUT) */}
        <div className="flex flex-col items-center justify-center gap-2 relative z-10">
          <p className="text-fifa-gold text-xs sm:text-sm font-extrabold tracking-widest uppercase font-montserrat">
            FIFA World Cup 2026 Quiz
          </p>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wide font-montserrat mt-1">
            {resultData.team}
          </h2>

          <FlagDisplay
            flagUrl={resultData.flagUrl}
            flagEmoji={resultData.flag}
            teamName={resultData.team}
          />
        </div>

        {/* Опис результату з м'якою скляною підкладкою */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 text-sm sm:text-base text-gray-200 leading-relaxed font-normal shadow-inner backdrop-blur-md relative z-10">
          {resultData.description}
        </div>

        {/* Спортивний дашборд показників: Елегантна типографіка з Montserrat */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-2 relative z-10">
          {/* Картка рахунку */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 shadow-lg backdrop-blur-md flex flex-col items-center justify-center relative overflow-hidden group hover:border-white/20 transition-all">
            <div className="text-xs uppercase font-bold tracking-wider text-fifa-muted mb-1 flex items-center gap-1.5">
              <span>🎯</span> Правильних відповідей
            </div>
            <div className="flex items-baseline gap-1">
              <span className={`text-4xl sm:text-5xl font-bold font-montserrat tracking-tight ${getScoreColor()}`}>
                {score}
              </span>
              <span className="text-xl sm:text-2xl font-semibold text-white/40 font-montserrat">
                /{totalQuestions}
              </span>
            </div>
          </div>

          {/* Картка часу з логікою formatTime */}
          {totalTime > 0 && (
            <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 shadow-lg backdrop-blur-md flex flex-col items-center justify-center relative overflow-hidden group hover:border-white/20 transition-all">
              <div className="text-xs uppercase font-bold tracking-wider text-fifa-muted mb-1 flex items-center gap-1.5">
                <span>⏱️</span> Загальний час
              </div>
              <div className="text-3xl sm:text-4xl font-bold font-montserrat tracking-tight text-fifa-cyan">
                {formatTime(totalTime)}
              </div>
            </div>
          )}
        </div>

        {/* Шкала прогресу (відсоток) */}
        <div className="w-full max-w-xs mx-auto relative z-10">
          <div className="flex justify-between text-xs text-fifa-muted mb-1.5 font-medium">
            <span>Точність відповідей</span>
            <span className="font-montserrat font-bold text-white/80">{percentage}%</span>
          </div>
          <div className="h-3 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/10 shadow-inner">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${
                percentage >= 60
                  ? "from-fifa-green to-fifa-teal"
                  : "from-fifa-gold to-amber-500"
              } transition-all duration-1000 ease-out shadow-sm`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Основний блок дій */}
      <div className="flex flex-col sm:flex-row gap-3">
        <ShareButton
          score={score}
          totalTime={totalTime}
          totalQuestions={totalQuestions}
        />

        {onPlayAgain && (
          <button
            onClick={onPlayAgain}
            className="flex-1 py-3.5 px-6 glass-card text-white font-semibold rounded-xl flex items-center justify-center gap-2.5 hover:bg-white/15 hover:border-white/30 hover:scale-[1.02] active:scale-95 transition-all duration-200 cursor-pointer shadow-md border border-white/20"
          >
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21.5 2v6h-6M2.5 22v-6h6" />
              <path d="M2 11.5a10 10 0 0 1 18.8-4.3L21.5 8M2.5 16l1.2 0.8A10 10 0 0 0 22 12.5" />
            </svg>
            <span>Спробувати ще раз</span>
          </button>
        )}
      </div>

      {/* Кнопка підтримки проєкта (Monobank) */}
      <div className="w-full flex justify-center py-1">
        <DonateButton className="w-full sm:w-auto" />
      </div>

      {/* Блок авторизації та навігації */}
      <div className="flex flex-col sm:flex-row gap-3">
        <GoogleSignIn
          score={score}
          totalTime={totalTime}
          onSaved={handleScoreSaved}
        />
        {onGoHome && (
          <button
            onClick={onGoHome}
            className="py-3 px-6 glass-card text-white/80 font-semibold rounded-xl flex items-center justify-center gap-2 hover:text-white hover:bg-white/10 hover:border-white/30 transition-all duration-200 cursor-pointer border border-white/10"
          >
            <span>🏠</span>
            <span>На головну</span>
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
