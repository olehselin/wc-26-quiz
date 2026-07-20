export default function ProgressIndicator({ total, current, answers }) {
  return (
    <div className="flex items-center gap-1.5 justify-center flex-wrap">
      {Array.from({ length: total }, (_, i) => {
        let dotClass = "w-3 h-3 rounded-full transition-all duration-300 ";

        if (i < answers.length) {
          // Already answered
          if (answers[i] === "correct") {
            dotClass += "bg-fifa-green shadow-[0_0_8px_rgba(0,230,118,0.4)]";
          } else {
            dotClass += "bg-fifa-red shadow-[0_0_8px_rgba(255,23,68,0.4)]";
          }
        } else if (i === current) {
          // Current question
          dotClass +=
            "bg-fifa-gold scale-125 shadow-[0_0_10px_rgba(245,197,24,0.5)] ring-2 ring-fifa-gold/30";
        } else {
          // Upcoming
          dotClass += "bg-white/15";
        }

        return <div key={i} className={dotClass} />;
      })}
    </div>
  );
}
