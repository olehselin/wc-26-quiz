import { useState, useEffect, useMemo } from "react";
import { RESULT_GRADATION } from "./ResultScreen";

/**
 * Логіка форматування часу проходження:
 * - Менше 60 секунд: виводить у форматі з десятими (наприклад, 45.0 с)
 * - 60 секунд і більше: конвертує у хвилини та секунди без десятих (наприклад, 1 хв 12 с)
 * 
 * @param {number} seconds - Час у секундах
 * @returns {string} Відформатований рядок часу
 */
export function formatTime(seconds) {
  if (seconds == null || isNaN(seconds) || seconds <= 0) return "0.0 с";
  const num = Number(seconds);
  if (num < 60) {
    const rounded = Math.round(num * 10) / 10;
    return `${rounded.toFixed(1)} с`;
  }
  const mins = Math.floor(num / 60);
  const secs = Math.floor(num % 60);
  return `${mins} хв ${secs} с`;
}

/**
 * Вбудований фолбек градації результатів (ідентичний до ResultScreen.jsx)
 */
const DEFAULT_GRADATION = {
  10: {
    team: "Збірна Іспанії",
    description: "У цьому квізі ти — збірна Іспанії! Тікі-така, контроль м'яча, контроль питань — у тебе все під абсолютним контролем. Ти чемпіон, і будь-який суперник може лише аплодувати стоячи!",
    flag: "🇪🇸",
    flagUrl: "https://flagcdn.com/w160/es.png",
    code: "ES",
  },
  9: {
    team: "Збірна Аргентини",
    description: "У цьому квізі ти — збірна Аргентини! Ти граєш на рівні Мессі — геніально, елегантно, майже бездоганно. Одна помилочка? Та це просто щоб інші не плакали від заздрощів!",
    flag: "🇦🇷",
    flagUrl: "https://flagcdn.com/w160/ar.png",
    code: "AR",
  },
  8: {
    team: "Збірна Англії",
    description: "У цьому квізі ти — збірна Англії! Потужний результат — як Гаррі Кейн у штрафному! Ти ось-ось візьмеш свій трофей, але \"it's almost coming home\" — бо до ідеалу не вистачило зовсім трішки.",
    flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    flagUrl: "https://flagcdn.com/w160/gb-eng.png",
    code: "GB-ENG",
  },
  7: {
    team: "Збірна Франції",
    description: "У цьому квізі ти — збірна Франції! Талант? Безмежний. Зірковий склад? Очевидно. Але іноді навіть Мбаппе промахується — тож не засмучуйся, адже ти все ще у топовій лізі!",
    flag: "🇫🇷",
    flagUrl: "https://flagcdn.com/w160/fr.png",
    code: "FR",
  },
  6: {
    team: "Збірна Норвегії",
    description: "У цьому квізі ти — збірна Норвегії! У тебе є свій Холанд — потужний і нестримний, але одного суперзнання замало, треба підтягнути решту команди. Ще трохи тренувань — і ти будеш грати у фіналах!",
    flag: "🇳🇴",
    flagUrl: "https://flagcdn.com/w160/no.png",
    code: "NO",
  },
  5: {
    team: "Збірна Марокко",
    description: "У цьому квізі ти — збірна Марокко! Золота середина з африканським характером! Ти здатен на сенсацію і можеш здивувати будь-кого — але стабільності поки бракує. Атласький лев ще гарчатиме!",
    flag: "🇲🇦",
    flagUrl: "https://flagcdn.com/w160/ma.png",
    code: "MA",
  },
  4: {
    team: "Збірна Бельгії",
    description: "У цьому квізі ти — збірна Бельгії! \"Золоте покоління\", що вічно обіцяє більше, ніж дає. Потенціал величезний, але десь між питаннями ти розгубив свою магію. Класичне \"наступного разу точно!\"",
    flag: "🇧🇪",
    flagUrl: "https://flagcdn.com/w160/be.png",
    code: "BE",
  },
  3: {
    team: "Збірна Канади",
    description: "У цьому квізі ти — збірна Канади! Ентузіазму — хоч відбавляй, досвіду — ну, скажімо так, є куди рости. Ти тільки починаєш свій шлях на великій арені, тож не здавайся — кленовий лист ще заграє яскраво!",
    flag: "🇨🇦",
    flagUrl: "https://flagcdn.com/w160/ca.png",
    code: "CA",
  },
  2: {
    team: "Збірна Мексики",
    description: "У цьому квізі ти — збірна Мексики! Оле-оле, друже! Пристрасті й емоцій на трибунах більше, ніж голів на полі. Ти яскраво вболіваєш, але відповіді поки не хочуть залітати в сітку. Quinto partido — наступного разу!",
    flag: "🇲🇽",
    flagUrl: "https://flagcdn.com/w160/mx.png",
    code: "MX",
  },
  1: {
    team: "Збірна США",
    description: "У цьому квізі ти — збірна США! Ти називаєш це \"soccer\" і щиро вважаєш, що офсайд — це щось із бейсболу. Але гей, ти хоча б прийшов на гру! Тепер час загуглити правила і повернутися сильнішим!",
    flag: "🇺🇸",
    flagUrl: "https://flagcdn.com/w160/us.png",
    code: "US",
  },
  0: {
    team: "Збірна України",
    description: "У цьому квізі ти — збірна України! На жаль, на це футбольне свято ти не потрапив — як і збірна на ЧС-2026. Але українці ніколи не здаються! Тренуйся, вчи матчастину і повертайся з revenge-режимом!",
    flag: "🇺🇦",
    flagUrl: "https://flagcdn.com/w160/ua.png",
    code: "UA",
  },
};

/**
 * ShareCard Component
 * 1:1 Точна копія картки з прев'ю головного екрана ResultScreen.jsx з розширеним простором для тексту.
 */
export default function ShareCard({
  score = 0,
  totalQuestions = 10,
  totalTime = 0,
  resultData: externalResultData,
  cardRef,
  style = {},
  className = "",
}) {
  const clampedScore = Math.max(0, Math.min(10, Math.round(score || 0)));
  const gradation = RESULT_GRADATION || DEFAULT_GRADATION;
  const resultData = externalResultData || gradation[clampedScore] || DEFAULT_GRADATION[clampedScore];

  const [imgError, setImgError] = useState(false);
  const [flagSrc, setFlagSrc] = useState(resultData?.flagUrl);

  // Конвертуємо прапор у Base64 Data URL для 100% надійного html2canvas
  useEffect(() => {
    let isMounted = true;
    if (resultData?.flagUrl) {
      setImgError(false);
      setFlagSrc(resultData.flagUrl);
      fetch(resultData.flagUrl, { mode: "cors" })
        .then((res) => res.blob())
        .then((blob) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            if (isMounted && reader.result) {
              setFlagSrc(reader.result);
            }
          };
          reader.readAsDataURL(blob);
        })
        .catch(() => {});
    }
    return () => {
      isMounted = false;
    };
  }, [resultData?.flagUrl]);

  const percentage = Math.round((clampedScore / totalQuestions) * 100);
  const displayPercentage = Math.max(percentage, 2);
  const formattedTimeStr = formatTime(totalTime);

  const scoreColorClass = useMemo(() => {
    if (clampedScore >= 8) return "text-[#00e676]";
    if (clampedScore >= 6) return "text-[#f5c518]";
    if (clampedScore >= 4) return "text-[#26c6da]";
    return "text-[#ff1744]";
  }, [clampedScore]);

  const scoreColorHex = useMemo(() => {
    if (clampedScore >= 8) return "#00e676";
    if (clampedScore >= 6) return "#f5c518";
    if (clampedScore >= 4) return "#26c6da";
    return "#ff1744";
  }, [clampedScore]);

  return (
    <div
      ref={cardRef}
      className={`w-[600px] h-[960px] relative overflow-hidden flex items-center justify-center p-6 select-none font-sans text-white ${className}`}
      style={{
        width: "600px",
        height: "960px",
        boxSizing: "border-box",
        background: "radial-gradient(circle at 50% 25%, #1a237e 0%, #111742 50%, #0a0f2c 100%)",
        backgroundColor: "#0a0f2c",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "28px",
        fontFamily: "'Inter', 'Montserrat', system-ui, -apple-system, sans-serif",
        color: "#ffffff",
        userSelect: "none",
        ...style,
      }}
    >
      {/* Картка результату у стилі Glassmorphism */}
      <div
        className="w-full max-w-[540px] glass-card p-7 text-center relative overflow-hidden bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl flex flex-col justify-between"
        style={{
          width: "100%",
          maxWidth: "540px",
          height: "100%",
          backgroundColor: "rgba(255, 255, 255, 0.04)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "24px",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.5)",
          padding: "32px 26px",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          boxSizing: "border-box",
          position: "relative",
        }}
      >
        {/* 1. Відображення заголовка та прапора країни */}
        <div className="flex flex-col items-center justify-center gap-1 relative z-10 flex-shrink-0" style={{ flexShrink: 0 }}>
          <p
            className="text-[#f5c518] text-xs font-extrabold tracking-widest uppercase"
            style={{
              color: "#f5c518",
              fontSize: "12px",
              fontWeight: "800",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            FIFA World Cup 2026 Quiz
          </p>

          <h2
            className="text-2xl sm:text-3xl font-black text-white tracking-wide mt-0.5"
            style={{
              fontSize: "26px",
              fontWeight: "900",
              color: "#ffffff",
              letterSpacing: "0.025em",
              margin: "2px 0 4px 0",
            }}
          >
            {resultData?.team || "Збірна України"}
          </h2>

          {/* Рамка Прапора */}
          <div className="relative group my-1 select-none flex-shrink-0" style={{ flexShrink: 0 }}>
            {/* М'яке світіння прапора */}
            <div
              style={{
                position: "absolute",
                inset: "-8px",
                borderRadius: "24px",
                background: "radial-gradient(circle, rgba(245, 197, 24, 0.3) 0%, rgba(26, 35, 126, 0.2) 60%, transparent 80%)",
                filter: "blur(12px)",
                pointerEvents: "none",
              }}
            />

            {/* Рамка прапора */}
            <div
              style={{
                position: "relative",
                width: "135px",
                height: "88px",
                borderRadius: "16px",
                padding: "3px",
                background: "linear-gradient(180deg, rgba(245, 197, 24, 0.6) 0%, rgba(255, 255, 255, 0.2) 50%, rgba(245, 197, 24, 0.4) 100%)",
                border: "1px solid rgba(245, 197, 24, 0.7)",
                boxShadow: "0 10px 24px rgba(0, 0, 0, 0.5)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "12px",
                  overflow: "hidden",
                  position: "relative",
                  boxShadow: "inset 0 0 10px rgba(0,0,0,0.4)",
                  backgroundColor: "#0c102b",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {!imgError && (flagSrc || resultData?.flagUrl) ? (
                  <img
                    src={flagSrc || resultData.flagUrl}
                    alt={`Прапор ${resultData?.team}`}
                    onError={() => setImgError(true)}
                    crossOrigin="anonymous"
                    style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "12px" }}
                  />
                ) : (
                  <span style={{ fontSize: "40px" }} role="img" aria-label={resultData?.team}>
                    {resultData?.flag || "⚽"}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 2. Золотисто-скляне обрамлення для опису з ВЕЛИКИМ запасом простору (padding 20px 22px) */}
        <div
          className="relative z-10 my-2 flex-shrink-0"
          style={{
            position: "relative",
            flexShrink: 0,
            width: "100%",
            boxSizing: "border-box",
            padding: "22px 24px",
            minHeight: "120px",
            background: "linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)",
            border: "1px solid rgba(245, 197, 24, 0.35)",
            borderRadius: "18px",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.15)",
            textAlign: "center",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {/* Декоративна золотиста лінія-акцент нагорі */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "20%",
              right: "20%",
              height: "2px",
              background: "linear-gradient(90deg, transparent, #f5c518, transparent)",
            }}
          />

          <div
            style={{
              fontSize: "13px",
              color: "#e2e8f0",
              lineHeight: "1.5",
              wordBreak: "break-word",
              overflowWrap: "break-word",
            }}
          >
            {resultData?.description || DEFAULT_GRADATION[clampedScore]?.description}
          </div>
        </div>

        {/* 3. Дашборд показників: Рахунок та Час */}
        <div
          className="grid grid-cols-2 gap-3 relative z-10 my-1 flex-shrink-0"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
            width: "100%",
            flexShrink: 0,
          }}
        >
          {/* Блок Рахунку */}
          <div
            style={{
              padding: "16px 14px",
              borderRadius: "16px",
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              boxShadow: "0 4px 14px rgba(0, 0, 0, 0.2)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                textTransform: "uppercase",
                fontWeight: "700",
                letterSpacing: "0.08em",
                color: "#8892b0",
                marginBottom: "4px",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <span>🎯</span> Правильних відповідей
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "2px" }}>
              <span
                className={`text-4xl font-bold tracking-tight ${scoreColorClass}`}
                style={{
                  fontSize: "36px",
                  fontWeight: "700",
                  color: scoreColorHex,
                  lineHeight: "1.1",
                }}
              >
                {clampedScore}
              </span>
              <span
                style={{
                  fontSize: "20px",
                  fontWeight: "600",
                  color: "rgba(255, 255, 255, 0.4)",
                }}
              >
                /{totalQuestions}
              </span>
            </div>
          </div>

          {/* Блок Часу */}
          <div
            style={{
              padding: "16px 14px",
              borderRadius: "16px",
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              boxShadow: "0 4px 14px rgba(0, 0, 0, 0.2)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                textTransform: "uppercase",
                fontWeight: "700",
                letterSpacing: "0.08em",
                color: "#8892b0",
                marginBottom: "4px",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <span>⏱️</span> Загальний час
            </div>
            <div
              style={{
                fontSize: formattedTimeStr.length > 8 ? "24px" : "28px",
                fontWeight: "700",
                color: "#26c6da",
                lineHeight: "1.1",
                whiteSpace: "nowrap",
              }}
            >
              {formattedTimeStr}
            </div>
          </div>
        </div>

        {/* 4. Шкала прогресу точності */}
        <div style={{ width: "100%", maxWidth: "280px", margin: "0 auto", position: "relative", zIndex: 10, flexShrink: 0 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "11px",
              color: "#8892b0",
              marginBottom: "4px",
              fontWeight: "500",
            }}
          >
            <span>Точність відповідей</span>
            <span style={{ fontWeight: "700", color: "rgba(255, 255, 255, 0.85)" }}>{percentage}%</span>
          </div>
          <div
            style={{
              height: "12px",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              borderRadius: "9999px",
              overflow: "hidden",
              padding: "2px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                width: `${displayPercentage}%`,
                height: "100%",
                borderRadius: "9999px",
                background:
                  percentage >= 60
                    ? "linear-gradient(90deg, #00e676 0%, #00bfa5 100%)"
                    : "linear-gradient(90deg, #f5c518 0%, #ff8f00 100%)",
              }}
            />
          </div>
        </div>

        {/* 5. Footer Водяний Знак */}
        <div
          style={{
            paddingTop: "2px",
            textAlign: "center",
            fontSize: "12px",
            color: "rgba(255, 255, 255, 0.4)",
            fontWeight: "600",
            letterSpacing: "0.08em",
            position: "relative",
            zIndex: 10,
            flexShrink: 0,
          }}
        >
          wc-26-quiz.web.app
        </div>
      </div>
    </div>
  );
}
