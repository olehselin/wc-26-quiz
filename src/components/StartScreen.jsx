export default function StartScreen({ onStart, questionCount }) {
  return (
    <div className="animate-fade-in-up w-full max-w-xl mx-auto flex flex-col items-center gap-8">
      {/* Logo / Icon */}
      <div className="relative">
        <div className="text-8xl animate-float select-none">⚽</div>
        <div className="absolute -inset-4 bg-fifa-gold/10 rounded-full blur-2xl -z-10" />
      </div>

      {/* Title */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-fifa-gold via-fifa-cyan to-fifa-teal bg-clip-text text-transparent">
          FIFA World Cup 2026
        </h1>
        <p className="text-xl md:text-2xl font-semibold text-white/90">
          Квіз-Вікторина
        </p>
        <p className="text-fifa-muted text-sm md:text-base max-w-md mx-auto leading-relaxed">
          Перевір свої знання про найбільший футбольний турнір у світі! 🇺🇸 🇲🇽 🇨🇦
        </p>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-3 gap-3 w-full max-w-sm">
        <div className="glass-card p-3 text-center">
          <div className="text-2xl font-bold text-fifa-gold">{questionCount || 10}</div>
          <div className="text-xs text-fifa-muted mt-1">Питань</div>
        </div>
        <div className="glass-card p-3 text-center">
          <div className="text-2xl font-bold text-fifa-cyan">15с</div>
          <div className="text-xs text-fifa-muted mt-1">На відповідь</div>
        </div>
        <div className="glass-card p-3 text-center">
          <div className="text-2xl font-bold text-fifa-teal">4</div>
          <div className="text-xs text-fifa-muted mt-1">Варіанти</div>
        </div>
      </div>

      {/* Start Button */}
      <button
        onClick={onStart}
        className="group relative px-10 py-4 bg-gradient-to-r from-fifa-gold to-amber-500 text-fifa-navy font-bold text-lg rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(245,197,24,0.4)] active:scale-95 cursor-pointer"
      >
        <span className="relative z-10 flex items-center gap-2">
          🏆 Почати гру
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-fifa-gold rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </button>

      {/* Subtitle */}
      <p className="text-fifa-muted text-xs text-center">
        • Можна ділитися результатом • Результати зберігаються онлайн, для цього
        всього лише потрібно увійти в акаунт Google • Розроблено з ❤️ для
        фанатів футболу
      </p>
    </div>
  );
}
