const LABELS = ["A", "B", "C", "D"];

export default function QuestionCard({
  question,
  selectedAnswer,
  isAnswered,
  onAnswer,
  animKey,
}) {
  const { text, options, correctAnswerIndex, explanation } = question;

  const getOptionClasses = (index) => {
    const base =
      "w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all duration-300 cursor-pointer";

    if (!isAnswered) {
      return `${base} border-white/10 bg-white/5 hover:bg-white/10 hover:border-fifa-cyan/40 hover:scale-[1.02] active:scale-[0.98]`;
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
      "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 transition-colors duration-300";

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
    <div className="animate-fade-in-up glass-card p-6 md:p-8" key={animKey}>
      {/* Question text */}
      <h2 className="text-lg md:text-xl font-bold text-white mb-6 leading-relaxed">
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

      {/* Explanation block — correct answer */}
      {isAnswered && explanation && selectedAnswer === correctAnswerIndex && (
        <div className="animate-slide-down mt-5 overflow-hidden">
          <div className="flex items-start gap-3 p-4 rounded-xl border bg-fifa-green/8 border-fifa-green/20">
            <span className="text-xl shrink-0 mt-0.5">✅</span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-1 text-fifa-green">
                Правильно!
              </p>
              <p className="text-sm text-white/80 leading-relaxed">
                {explanation}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Wrong answer / timeout */}
      {isAnswered && selectedAnswer !== correctAnswerIndex && (
        <div className="animate-slide-down mt-5 overflow-hidden">
          <div className="flex items-center justify-center gap-3 p-4 rounded-xl border bg-fifa-red/8 border-fifa-red/20">
            <span className="text-xl shrink-0">
              {selectedAnswer === null ? "⏱️" : "❌"}
            </span>
            <p className={`text-sm font-bold uppercase tracking-wider ${
              selectedAnswer === null ? "text-fifa-gold" : "text-fifa-red"
            }`}>
              {selectedAnswer === null ? "Час вийшов!" : "Неправильно!"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
