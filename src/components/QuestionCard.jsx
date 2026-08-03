import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

const LABELS = ["A", "B", "C", "D"];

export default function QuestionCard({
  question,
  selectedAnswer,
  isAnswered,
  onAnswer,
  onNextQuestion,
  isLastQuestion,
  animKey,
}) {
  const { t, i18n } = useTranslation();
  const { text, options, correctAnswerIndex, explanation } = question;
  const nextBtnRef = useRef(null);
  const isEn = i18n.language && i18n.language.startsWith("en");

  useEffect(() => {
    if (isAnswered) {
      if (nextBtnRef.current) {
        nextBtnRef.current.focus({ preventScroll: true });
        const rect = nextBtnRef.current.getBoundingClientRect();
        if (rect.bottom > window.innerHeight) {
          nextBtnRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      }
    }
  }, [isAnswered]);

  useEffect(() => {
    if (window.scrollY > 40) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [animKey]);

  const getOptionClasses = (index) => {
    const base =
      "w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer";

    if (!isAnswered) {
      return `${base} border-white/10 bg-white/5 hover:bg-white/10 hover:border-fifa-cyan/40 hover:scale-[1.01] active:scale-[0.99]`;
    }

    if (index === correctAnswerIndex && selectedAnswer === correctAnswerIndex) {
      return `${base} border-fifa-green/60 bg-fifa-green/15 shadow-[0_0_20px_rgba(0,230,118,0.15)]`;
    }

    if (index === selectedAnswer && index !== correctAnswerIndex) {
      return `${base} border-fifa-red/60 bg-fifa-red/15 shadow-[0_0_20px_rgba(255,23,68,0.15)]`;
    }

    return `${base} border-white/5 bg-white/3 opacity-50`;
  };

  const getLabelClasses = (index) => {
    const base =
      "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 transition-colors duration-200";

    if (!isAnswered) {
      return `${base} bg-white/10 text-white/70`;
    }

    if (index === correctAnswerIndex && selectedAnswer === correctAnswerIndex) {
      return `${base} bg-fifa-green/30 text-fifa-green`;
    }

    if (index === selectedAnswer && index !== correctAnswerIndex) {
      return `${base} bg-fifa-red/30 text-fifa-red`;
    }

    return `${base} bg-white/5 text-white/30`;
  };

  return (
    <div className="animate-fade-in glass-card p-5 sm:p-7 md:p-8" key={animKey}>
      {/* Question text */}
      <h2 className="text-base sm:text-lg md:text-xl font-bold text-white mb-5 leading-relaxed">
        {text}
      </h2>

      {/* Options */}
      <div className="flex flex-col gap-3">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswer(index)}
            disabled={isAnswered}
            className={getOptionClasses(index)}
          >
            <span className={getLabelClasses(index)}>{LABELS[index]}</span>
            <span className="text-sm md:text-base font-medium">{option}</span>
            {isAnswered && index === correctAnswerIndex && selectedAnswer === correctAnswerIndex && (
              <span className="ml-auto text-fifa-green text-lg">✓</span>
            )}
            {isAnswered &&
              index === selectedAnswer &&
              index !== correctAnswerIndex && (
                <span className="ml-auto text-fifa-red text-lg">✗</span>
              )}
          </button>
        ))}
      </div>

      {/* Feedback banner */}
      {isAnswered && (
        <div className="animate-slide-down mt-4 overflow-hidden">
          {selectedAnswer === correctAnswerIndex ? (
            <div className="flex items-center justify-center gap-2 p-3 rounded-lg border bg-fifa-green/10 border-fifa-green/25 text-fifa-green font-bold text-sm uppercase tracking-wider">
              <span className="text-lg">✅</span>
              <span>{isEn ? "Correct!" : "Правильно!"}</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 p-3 rounded-lg border bg-fifa-red/10 border-fifa-red/25 text-fifa-red font-bold text-sm uppercase tracking-wider">
              <span className="text-lg">{selectedAnswer === null ? "⏱️" : "❌"}</span>
              <span className={selectedAnswer === null ? "text-fifa-gold" : "text-fifa-red"}>
                {selectedAnswer === null
                  ? (isEn ? "Time's up!" : "Час вийшов!")
                  : (isEn ? "Incorrect!" : "Неправильно!")}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Explanation block — displayed after user clicks any answer option (selectedAnswer !== null) */}
      {selectedAnswer !== null && explanation && (
        <div className="animate-slide-down mt-4 overflow-hidden">
          <div className="flex items-start gap-3 p-4 rounded-lg border bg-white/10 border-white/15 text-white/90">
            <span className="text-xl shrink-0 mt-0.5" role="img" aria-label="explanation">💡</span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-1 text-fifa-gold">
                {isEn ? "Explanation" : "Пояснення"}
              </p>
              <p className="text-sm text-white/80 leading-relaxed">
                {explanation}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Next Question / Continue Button */}
      {isAnswered && (
        <button
          ref={nextBtnRef}
          id="next-question-btn"
          onClick={onNextQuestion}
          className="bg-gradient-to-r from-fifa-cyan via-fifa-blue to-fifa-purple text-white font-bold py-3.5 px-6 rounded-xl w-full mt-6 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-[0_0_25px_rgba(38,198,218,0.35)] hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 animate-slide-down border border-fifa-cyan/30 focus:outline-none focus:ring-2 focus:ring-fifa-gold/70"
        >
          <span>{isLastQuestion ? t("ui.seeResults") : t("ui.nextQuestion")}</span>
          <span>➔</span>
        </button>
      )}
    </div>
  );
}
