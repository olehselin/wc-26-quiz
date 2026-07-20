export default function TimerBar({ timeLeft, maxTime, isAnswered }) {
  const percentage = (timeLeft / maxTime) * 100;

  // Color transitions: green -> yellow -> red
  const getBarColor = () => {
    if (percentage > 50) return "from-fifa-green to-fifa-teal";
    if (percentage > 25) return "from-yellow-400 to-amber-500";
    return "from-fifa-red to-red-600";
  };

  const getGlowColor = () => {
    if (percentage > 50) return "shadow-[0_0_12px_rgba(0,230,118,0.3)]";
    if (percentage > 25) return "shadow-[0_0_12px_rgba(245,197,24,0.3)]";
    return "shadow-[0_0_12px_rgba(255,23,68,0.4)]";
  };

  return (
    <div className="w-full">
      {/* Timer container */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-3 rounded-full bg-white/5 overflow-hidden border border-white/5">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${getBarColor()} ${getGlowColor()} transition-all duration-100 ease-linear`}
            style={{
              width: isAnswered ? `${percentage}%` : `${percentage}%`,
            }}
          />
        </div>
        <div
          className={`text-sm font-bold min-w-[40px] text-right tabular-nums ${
            percentage <= 25
              ? "text-fifa-red animate-pulse"
              : percentage <= 50
              ? "text-yellow-400"
              : "text-fifa-green"
          }`}
        >
          {Math.ceil(timeLeft)}с
        </div>
      </div>
    </div>
  );
}
