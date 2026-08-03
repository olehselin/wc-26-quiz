import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const currentLang = i18n.language && i18n.language.startsWith("en") ? "en" : "ua";

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div
      id="language-switcher"
      className="flex items-center gap-1 p-1 bg-black/40 border border-white/15 rounded-xl backdrop-blur-md shadow-md select-none"
    >
      <button
        type="button"
        onClick={() => changeLanguage("ua")}
        className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
          currentLang === "ua"
            ? "bg-gradient-to-r from-fifa-gold to-amber-500 text-fifa-navy shadow-sm scale-105"
            : "text-white/70 hover:text-white hover:bg-white/10"
        }`}
        title="Українська мова"
      >
        <span>🇺🇦</span>
        <span>UA</span>
      </button>

      <button
        type="button"
        onClick={() => changeLanguage("en")}
        className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
          currentLang === "en"
            ? "bg-gradient-to-r from-fifa-gold to-amber-500 text-fifa-navy shadow-sm scale-105"
            : "text-white/70 hover:text-white hover:bg-white/10"
        }`}
        title="English language"
      >
        <span>🇬🇧</span>
        <span>EN</span>
      </button>
    </div>
  );
}
