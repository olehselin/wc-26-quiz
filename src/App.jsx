import { useState, useEffect, useCallback } from "react";
import StartScreen from "./components/StartScreen";
import QuizGame from "./components/QuizGame";
import ResultScreen from "./components/ResultScreen";
import { fetchQuestions } from "./firebase";
import localQuestions from "./questions";

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

  const startGame = useCallback(() => {
    const shuffled = shuffleArray(allQuestions).slice(0, QUESTIONS_PER_GAME);
    setGameQuestions(shuffled);
    setScore(0);
    setTotalTime(0);
    setScreen("playing");
  }, [allQuestions]);

  const handleGameEnd = useCallback((finalScore, finalTime) => {
    setScore(finalScore);
    setTotalTime(finalTime);
    setScreen("result");
  }, []);

  const playAgain = useCallback(() => {
    startGame();
  }, [startGame]);

  const goHome = useCallback(() => {
    setScreen("start");
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
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
