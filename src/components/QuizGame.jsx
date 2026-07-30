import { useState, useCallback, useRef, useEffect } from "react";
import QuestionCard from "./QuestionCard";
import TimerBar from "./TimerBar";
import ProgressIndicator from "./ProgressIndicator";

const TIME_PER_QUESTION = 15; // seconds
const DELAY_CORRECT      = 4500; // ms — short explanation
const DELAY_CORRECT_LONG = 6000; // ms — long explanation
const DELAY_WRONG        = 2000; // ms — wrong / timeout
const LONG_EXPLANATION   = 80;   // chars threshold

export default function QuizGame({ questions, onGameEnd, onGoHome }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [answers, setAnswers] = useState([]); // track correct/incorrect/timeout
  const [animKey, setAnimKey] = useState(0);

  const totalTimeRef = useRef(0);
  const timerRef = useRef(null);
  const delayRef = useRef(null);

  const currentQuestion = questions[currentIndex];

  // Timer logic
  useEffect(() => {
    if (isAnswered) return;

    setTimeLeft(TIME_PER_QUESTION);
    const start = Date.now();

    timerRef.current = setInterval(() => {
      const elapsed = (Date.now() - start) / 1000;
      const remaining = Math.max(0, TIME_PER_QUESTION - elapsed);
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(timerRef.current);
        handleTimeout();
      }
    }, 50);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, isAnswered]);

  const handleTimeout = useCallback(() => {
    if (isAnswered) return;
    setIsAnswered(true);
    setSelectedAnswer(null);
    totalTimeRef.current += TIME_PER_QUESTION;
    setAnswers((prev) => [...prev, "timeout"]);
  }, [isAnswered]);

  // Handle answer selection
  const handleAnswer = useCallback(
    (index) => {
      if (isAnswered) return;
      if (timerRef.current) clearInterval(timerRef.current);

      setIsAnswered(true);
      setSelectedAnswer(index);

      const timeSpent = TIME_PER_QUESTION - timeLeft;
      totalTimeRef.current += timeSpent;

      const isCorrect = index === currentQuestion.correctAnswerIndex;
      if (isCorrect) {
        setScore((prev) => prev + 1);
        setAnswers((prev) => [...prev, "correct"]);
      } else {
        setAnswers((prev) => [...prev, "incorrect"]);
      }
    },
    [isAnswered, timeLeft, currentQuestion]
  );

  // Actually move to next question after delay
  useEffect(() => {
    if (!isAnswered) return;

    const wasCorrect =
      selectedAnswer !== null &&
      selectedAnswer === currentQuestion?.correctAnswerIndex;
    const isLong =
      currentQuestion?.explanation &&
      currentQuestion.explanation.length >= LONG_EXPLANATION;
    const delay = wasCorrect
      ? (isLong ? DELAY_CORRECT_LONG : DELAY_CORRECT)
      : DELAY_WRONG;

    delayRef.current = setTimeout(() => {
      const nextIndex = currentIndex + 1;
      if (nextIndex >= questions.length) {
        onGameEnd(score, Math.round(totalTimeRef.current * 10) / 10);
      } else {
        setCurrentIndex(nextIndex);
        setSelectedAnswer(null);
        setIsAnswered(false);
        setAnimKey((k) => k + 1);
      }
    }, delay);

    return () => {
      if (delayRef.current) clearTimeout(delayRef.current);
    };
  }, [isAnswered, currentIndex, questions.length, onGameEnd, score]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (delayRef.current) clearTimeout(delayRef.current);
    };
  }, []);

  if (!currentQuestion) return null;

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-5 animate-fade-in" key={`game-${animKey}`}>
      {/* Header: home button + stats readout */}
      <div className="flex items-center justify-between gap-2">
        <button
          id="quiz-home-btn"
          onClick={onGoHome}
          className="px-3.5 py-2 glass-card text-white/90 hover:text-white text-xs sm:text-sm font-semibold rounded-xl border border-white/20 hover:bg-white/20 hover:border-white/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
          title="Завершити квіз та повернутися на головну"
        >
          <span>🏠</span>
          <span>На головну</span>
        </button>

        <div className="flex items-center gap-3 text-xs sm:text-sm font-medium bg-black/25 px-3.5 py-2 rounded-xl border border-white/5 backdrop-blur-sm select-none">
          <div>
            <span className="text-fifa-muted">Питання:</span>{" "}
            <span className="text-white font-bold">
              {currentIndex + 1}/{questions.length}
            </span>
          </div>
          <div className="w-px h-3.5 bg-white/20" />
          <div>
            <span className="text-fifa-muted">Рахунок:</span>{" "}
            <span className="text-fifa-gold font-bold">{score}</span>
          </div>
        </div>
      </div>

      {/* Timer Bar */}
      <TimerBar
        timeLeft={timeLeft}
        maxTime={TIME_PER_QUESTION}
        isAnswered={isAnswered}
      />

      {/* Progress dots */}
      <ProgressIndicator
        total={questions.length}
        current={currentIndex}
        answers={answers}
      />

      {/* Question Card */}
      <QuestionCard
        question={currentQuestion}
        selectedAnswer={selectedAnswer}
        isAnswered={isAnswered}
        onAnswer={handleAnswer}
        animKey={animKey}
      />
    </div>
  );
}
