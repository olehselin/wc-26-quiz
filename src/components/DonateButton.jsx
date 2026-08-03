import { useTranslation } from "react-i18next";

export default function DonateButton({ className = "", variant = "default" }) {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language && i18n.language.startsWith("en");

  return (
    <a
      href="https://send.monobank.ua/jar/jQby2VySM"
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-white transition-all duration-300 cursor-pointer overflow-hidden ${
        variant === "compact"
          ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-md shadow-amber-500/20 hover:shadow-amber-500/35 hover:scale-105 active:scale-95 text-sm"
          : "bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:via-orange-600 hover:to-amber-700 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.03] active:scale-95"
      } ${className}`}
      aria-label={isEn ? "Buy developer a coffee via Monobank" : "Пригостити розробника кавою через Monobank"}
      title={t("ui.supportProject")}
    >
      <span className="absolute inset-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />

      <svg
        className="w-5 h-5 text-white transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110 flex-shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
        <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
        <path d="M6 2v2" className="animate-pulse" />
        <path d="M10 2v2" className="animate-pulse delay-100" />
        <path d="M14 2v2" className="animate-pulse delay-200" />
      </svg>

      <span className="relative z-10 tracking-wide font-medium">
        {isEn ? "Buy developer a coffee ☕" : "Пригостити розробника кавою"}
      </span>

      <svg
        className="w-4 h-4 text-white/80 transition-transform duration-300 group-hover:translate-x-1 flex-shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </svg>
    </a>
  );
}
