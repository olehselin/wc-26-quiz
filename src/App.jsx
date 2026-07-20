import { useState, useEffect, useCallback } from "react";
import StartScreen from "./components/StartScreen";
import QuizGame from "./components/QuizGame";
import ResultScreen from "./components/ResultScreen";
import { fetchQuestions } from "./firebase";

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
    (async () => {
      try {
        const firestoreQuestions = await fetchQuestions();
        if (!cancelled && firestoreQuestions.length >= QUESTIONS_PER_GAME) {
          setAllQuestions(firestoreQuestions);
        }
      } catch (err) {
        console.error("Failed to load questions from Firestore:", err.message);
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-fifa-gold/30 border-t-fifa-gold rounded-full animate-spin" />
          <p className="text-fifa-muted text-lg">Завантаження питань...</p>
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
