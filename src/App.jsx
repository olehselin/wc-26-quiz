import { useState, useEffect, useCallback, useRef } from "react";
import StartScreen from "./components/StartScreen";
import QuizGame from "./components/QuizGame";
import ResultScreen from "./components/ResultScreen";
import AuthBadge from "./components/AuthBadge";
import { fetchQuestions } from "./firebase";
import localQuestions from "./questions";

const MUSIC_SRC = "/fifa-theme.mp3";

/**
 * Fisher-Yates shuffle
 */
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const QUESTIONS_PER_GAME = 10;

export default function App() {
  const [screen, setScreen] = useState("start"); // "start" | "playing" | "result"
  const [allQuestions, setAllQuestions] = useState([]);
  const [gameQuestions, setGameQuestions] = useState([]);
  const [score, setScore] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef(null);
  const mutedRef = useRef(false);

  // Background music — plays on loop from first load
  useEffect(() => {
    const audio = new Audio(MUSIC_SRC);
    audio.loop = true;
    audio.volume = 0.3;
    audioRef.current = audio;

    // Try to autoplay immediately
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay blocked — start on first user interaction
        const startMusic = () => {
          audio.play().catch(() => {});
          document.removeEventListener("click", startMusic);
          document.removeEventListener("touchstart", startMusic);
          document.removeEventListener("keydown", startMusic);
        };
        document.addEventListener("click", startMusic, { once: false });
        document.addEventListener("touchstart", startMusic, { once: false });
        document.addEventListener("keydown", startMusic, { once: false });
      });
    }

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  // Load questions: try Firestore first, fallback to local pool
  useEffect(() => {
    let cancelled = false;
    const minDelay = new Promise((r) => setTimeout(r, 3000));
    (async () => {
      try {
        const [firestoreQuestions] = await Promise.all([fetchQuestions(), minDelay]);
        if (!cancelled) {
          if (firestoreQuestions.length >= QUESTIONS_PER_GAME) {
            setAllQuestions(firestoreQuestions);
          } else {
            console.warn("Not enough Firestore questions, using local pool.");
            setAllQuestions(localQuestions);
          }
        }
      } catch (err) {
        console.error("Failed to load questions from Firestore:", err.message);
        await minDelay;
        if (!cancelled) {
          console.info("Using local question pool as fallback.");
          setAllQuestions(localQuestions);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const toggleMusic = useCallback(() => {
    setMuted((prev) => {
      const next = !prev;
      mutedRef.current = next;
      if (audioRef.current) {
        if (next) {
          audioRef.current.pause();
        } else {
          audioRef.current.play().catch(() => {});
        }
      }
      return next;
    });
  }, []);

  const startGame = useCallback(() => {
    const shuffled = shuffleArray(allQuestions).slice(0, QUESTIONS_PER_GAME);
    setGameQuestions(shuffled);
    setScore(0);
    setTotalTime(0);
    setScreen("playing");

    // Restart music from the iconic moment (6s)
    if (audioRef.current && !mutedRef.current) {
      audioRef.current.currentTime = 6;
      audioRef.current.play().catch(() => {});
    }
  }, [allQuestions]);

  const handleGameEnd = useCallback((finalScore, finalTime) => {
    setScore(finalScore);
    setTotalTime(finalTime);
    setScreen("result");

    // Restart music from the iconic moment (6s)
    if (audioRef.current && !mutedRef.current) {
      audioRef.current.currentTime = 6;
      audioRef.current.play().catch(() => {});
    }
  }, []);

  const playAgain = useCallback(() => {
    startGame();
  }, [startGame]);

  const goHome = useCallback(() => {
    setScreen("start");
  }, []);

  const musicToggleBtn = (
    <button
      id="music-toggle"
      className="music-toggle-btn"
      onClick={toggleMusic}
      aria-label={muted ? "Увімкнути музику" : "Вимкнути музику"}
      title={muted ? "Увімкнути музику" : "Вимкнути музику"}
    >
      {muted ? "🔇" : "🔊"}
    </button>
  );

  if (loading) {
    return (
      <div className="loading-screen">
        {musicToggleBtn}
        <AuthBadge />
        <div className="flex flex-col items-center">
          <div className="loading-ball">⚽</div>
          <div className="loading-ball-shadow" />
        </div>
        <p className="loading-text">Готуємо питання для тебе…</p>
        <div className="loading-dots">
          <div className="loading-dot" />
          <div className="loading-dot" />
          <div className="loading-dot" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-8">
      {musicToggleBtn}
      <AuthBadge />
      {screen === "start" && (
        <StartScreen onStart={startGame} questionCount={allQuestions.length} />
      )}
      {screen === "playing" && (
        <QuizGame
          questions={gameQuestions}
          onGameEnd={handleGameEnd}
        />
      )}
      {screen === "result" && (
        <ResultScreen
          score={score}
          totalTime={totalTime}
          totalQuestions={QUESTIONS_PER_GAME}
          onPlayAgain={playAgain}
          onGoHome={goHome}
        />
      )}
    </div>
  );
}
