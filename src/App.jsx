import { useState, useCallback } from "react";
import StartScreen from "./components/StartScreen";
import QuizGame from "./components/QuizGame";
import ResultScreen from "./components/ResultScreen";
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
  const [allQuestions] = useState(localQuestions);
  const [gameQuestions, setGameQuestions] = useState([]);
  const [score, setScore] = useState(0);
  const [totalTime, setTotalTime] = useState(0);

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




  return (
    <div className="w-full flex flex-col items-center my-auto px-4 py-8">
      {screen === "start" && (
        <StartScreen onStart={startGame} questionCount={QUESTIONS_PER_GAME} />
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
