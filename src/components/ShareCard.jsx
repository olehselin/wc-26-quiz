import { useState, useEffect } from "react";
import { RESULT_GRADATION } from "./ResultScreen";

/**
 * Логіка форматування часу проходження:
 * - Менше 60 секунд: виводить у форматі з десятими (наприклад, 45.0 с)
 * - 60 секунд і більше: конвертує у хвилини та секунди без десятих (наприклад, 1 хв 12 с)
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
 * Вбудований фолбек градації результатів для Stories
 */
const DEFAULT_GRADATION = {
  10: {
    team: "Збірна Іспанії",
    punchline: "Абсолютний чемпіон! 🏆",
    shareDescription: "У цьому квізі я — збірна Іспанії! Тікі-така, контроль м'яча, контроль питань — у мене все під абсолютним контролем. Я чемпіон, і будь-який суперник може лише аплодувати стоячи!",
    flag: "🇪🇸",
    flagUrl: "https://flagcdn.com/w160/es.png",
    code: "ES",
  },
  9: {
    team: "Збірна Аргентини",
    punchline: "Легенда футболу! ⭐",
    shareDescription: "У цьому квізі я — збірна Аргентини! Я граю на рівні Мессі — геніально, елегантно, майже бездоганно. Одна помилочка? Та це просто щоб інші не плакали від заздрощів!",
    flag: "🇦🇷",
    flagUrl: "https://flagcdn.com/w160/ar.png",
    code: "AR",
  },
  8: {
    team: "Збірна Англії",
    punchline: "Бронзовий призер! 🥉",
    shareDescription: "У цьому квізі я — збірна Англії! Потужний результат — як Гаррі Кейн у штрафному! Я ось-ось візьму свій трофей, але \"it's almost coming home\" — бо до ідеалу не вистачило зовсім трішки.",
    flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    flagUrl: "https://flagcdn.com/w160/gb-eng.png",
    code: "GB-ENG",
  },
  7: {
    team: "Збірна Франції",
    punchline: "Топ-ліга! 🔥",
    shareDescription: "У цьому квізі я — збірна Франції! Талант? Безмежний. Зірковий склад? Очевидно. Але іноді навіть Мбаппе промахується — але я все ще у топовій лізі!",
    flag: "🇫🇷",
    flagUrl: "https://flagcdn.com/w160/fr.png",
    code: "FR",
  },
  6: {
    team: "Збірна Норвегії",
    punchline: "Потужний гравець! 💪",
    shareDescription: "У цьому квізі я — збірна Норвегії! У мене є свій Холанд — потужний і нестримний, але одного суперзнання замало, треба підтягнути решту команди. Ще трохи тренувань — і я буду грати у фіналах!",
    flag: "🇳🇴",
    flagUrl: "https://flagcdn.com/w160/no.png",
    code: "NO",
  },
  5: {
    team: "Збірна Марокко",
    punchline: "Атласький лев! 🦁",
    shareDescription: "У цьому квізі я — збірна Марокко! Золота середина з африканським характером! Я здатен на сенсацію і можу здивувати будь-кого — але стабільності поки бракує. Атласький лев ще гарчатиме!",
    flag: "🇲🇦",
    flagUrl: "https://flagcdn.com/w160/ma.png",
    code: "MA",
  },
  4: {
    team: "Збірна Бельгії",
    punchline: "Генератор потенціалу! ✨",
    shareDescription: "У цьому квізі я — збірна Бельгії! \"Золоте покоління\", що вічно обіцяє більше, ніж дає. Потенціал величезний, але десь між питаннями я розгубив свою магію. Класичне \"наступного разу точно!\"",
    flag: "🇧🇪",
    flagUrl: "https://flagcdn.com/w160/be.png",
    code: "BE",
  },
  3: {
    team: "Збірна Канади",
    punchline: "Перспективний старт! ⚽",
    shareDescription: "У цьому квізі я — збірна Канади! Ентузіазму — хоч відбавляй, досвіду — ну, скажімо так, є куди рости. Я тільки починаю свій шлях на великій арені, тож кленовий лист ще заграє яскраво!",
    flag: "🇨🇦",
    flagUrl: "https://flagcdn.com/w160/ca.png",
    code: "CA",
  },
  2: {
    team: "Збірна Мексики",
    punchline: "Палкий вболівальник! 🎉",
    shareDescription: "У цьому квізі я — збірна Мексики! Оле-оле! Пристрасті й емоцій на трибунах більше, ніж голів на полі. Я яскраво вболіваю, але відповіді поки не хочуть залітати в сітку. Quinto partido — наступного разу!",
    flag: "🇲🇽",
    flagUrl: "https://flagcdn.com/w160/mx.png",
    code: "MX",
  },
  1: {
    team: "Збірна США",
    punchline: "Новачок турніру! 🎯",
    shareDescription: "У цьому квізі я — збірна США! Я називаю це \"soccer\" і щиро вважаю, що офсайд — це щось із бейсболу. Але гей, я хоча б прийшов на гру! Тепер час загуглити правила і повернутися сильнішим!",
    flag: "🇺🇸",
    flagUrl: "https://flagcdn.com/w160/us.png",
    code: "US",
  },
  0: {
    team: "Збірна України",
    punchline: "Головне — участь! 💙💛",
    shareDescription: "У цьому квізі я — збірна України! На жаль, на це футбольне свято я не потрапив — як і збірна на ЧС-2026. Але українці ніколи не здаються! Вчу матчастину і повернуся з revenge-режимом!",
    flag: "🇺🇦",
    flagUrl: "https://flagcdn.com/w160/ua.png",
    code: "UA",
  },
};

/**
 * ShareCard Component - Instagram Stories Format (9:16, 1080x1920px)
 * Гарантовано відсутні накладання тексту!
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
  const clampedScore = Math.max(0, Math.round(score || 0));
  const gradation = RESULT_GRADATION || DEFAULT_GRADATION;
  
  // Розрахунок індексу для градації (0..10)
  const ratio = totalQuestions > 0 ? clampedScore / totalQuestions : 0;
  const lookupKey = Math.max(0, Math.min(10, Math.round(ratio * 10)));
  
  const resultData = externalResultData || gradation[lookupKey] || DEFAULT_GRADATION[lookupKey];
  const defaultFallback = DEFAULT_GRADATION[lookupKey] || DEFAULT_GRADATION[0];

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

  const formattedTimeStr = formatTime(totalTime);
  const punchline = resultData?.punchline || resultData?.status || defaultFallback?.punchline || "Бронзовий призер!";
  const teamTitle = (resultData?.team || defaultFallback?.team || "ЗБІРНА АНГЛІЇ").toUpperCase();
  const cardDescription = resultData?.shareDescription || resultData?.rawDescription || defaultFallback?.shareDescription || "";

  return (
    <div
      ref={cardRef}
      className={`w-[1080px] h-[1920px] relative overflow-hidden flex flex-col items-center justify-between pt-40 pb-24 px-16 select-none font-sans text-white ${className}`}
      style={{
        width: "1080px",
        height: "1920px",
        boxSizing: "border-box",
        background: "radial-gradient(circle at 50% 30%, #1e299b 0%, #111742 55%, #070a1e 100%)",
        backgroundColor: "#070a1e",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-around",
        paddingTop: "80px",
        paddingBottom: "130px",
        paddingLeft: "64px",
        paddingRight: "64px",
        fontFamily: "'Inter', 'Montserrat', system-ui, -apple-system, sans-serif",
        color: "#ffffff",
        userSelect: "none",
        ...style,
      }}
    >
      {/* Декоративні фонові світлові плями */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[750px] h-[750px] rounded-full opacity-30 blur-[120px] pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(245, 197, 24, 0.4) 0%, rgba(30, 41, 155, 0.1) 70%, transparent 100%)",
        }}
      />

      {/* 1. Верхній брендінг */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <span
          className="text-2xl font-black tracking-[0.3em] uppercase drop-shadow text-amber-400"
          style={{
            fontSize: "40px",
            fontWeight: "900",
            letterSpacing: "0.25em",
            color: "#f5c518",
            textTransform: "uppercase",
          }}
        >
          WORLD CUP 2026 QUIZ
        </span>
      </div>

      {/* 2. Центральна Glassmorphism Картка */}
      <div
        className="w-full max-w-[920px] relative z-10 overflow-hidden bg-white/[0.06] backdrop-blur-2xl border border-white/15 rounded-[48px] shadow-[0_32px_80px_rgba(0,0,0,0.6)] flex flex-col items-center justify-center text-center"
        style={{
          width: "100%",
          maxWidth: "920px",
          backgroundColor: "rgba(255, 255, 255, 0.06)",
          backdropFilter: "blur(40px)",
          WebkitBackdropFilter: "blur(40px)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          borderRadius: "48px",
          boxShadow: "0 32px 80px rgba(0, 0, 0, 0.6)",
          padding: "48px 40px",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          boxSizing: "border-box",
        }}
      >
        {/* Вступний текстовий контекст */}
        <div
          className="text-xl font-extrabold tracking-widest text-white/80 uppercase"
          style={{
            fontSize: "22px",
            fontWeight: "800",
            letterSpacing: "0.15em",
            color: "rgba(255, 255, 255, 0.8)",
            textTransform: "uppercase",
            margin: "0 0 0 0",
          }}
        >
          ⚽ Я проходжу квіз — моя збірна:
        </div>

        {/* Прапор з рівними відступами зверху та знизу */}
        <div className="relative select-none" style={{ margin: "20px 0 20px 0" }}>
          <div
            className="w-48 h-32 rounded-3xl p-1.5 bg-gradient-to-b from-amber-400/80 via-white/30 to-amber-400/60 border border-amber-300/80 shadow-2xl overflow-hidden flex items-center justify-center bg-[#0c102b]"
            style={{
              width: "192px",
              height: "128px",
              borderRadius: "24px",
              padding: "5px",
              background: "linear-gradient(180deg, rgba(245, 197, 24, 0.8) 0%, rgba(255, 255, 255, 0.3) 50%, rgba(245, 197, 24, 0.6) 100%)",
              border: "1px solid rgba(245, 197, 24, 0.8)",
              boxShadow: "0 16px 36px rgba(0, 0, 0, 0.5)",
            }}
          >
            <div
              className="w-full h-full rounded-2xl overflow-hidden relative flex items-center justify-center bg-[#0c102b]"
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "18px",
                overflow: "hidden",
                backgroundColor: "#0c102b",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {!imgError && (flagSrc || resultData?.flagUrl) ? (
                <img
                  src={flagSrc || resultData.flagUrl}
                  alt={`Прапор ${teamTitle}`}
                  onError={() => setImgError(true)}
                  crossOrigin="anonymous"
                  className="w-full h-full object-cover rounded-2xl"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <span className="text-[90px] leading-none select-none" role="img" aria-label={teamTitle} style={{ fontSize: "90px" }}>
                  {resultData?.flag || defaultFallback?.flag || "⚽"}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Назва збірної */}
        <h1
          className="text-5xl font-black tracking-wider uppercase drop-shadow-md text-[#fde047]"
          style={{
            fontSize: "46px",
            fontWeight: "900",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: "#fde047",
            margin: "0 0 10px 0",
            textShadow: "0 4px 24px rgba(253, 224, 71, 0.35)",
          }}
        >
          {teamTitle}
        </h1>

        {/* Статус / Punchline */}
        <div
          className="text-2xl font-extrabold text-[#34d399] tracking-wide uppercase drop-shadow"
          style={{
            fontSize: "26px",
            fontWeight: "800",
            color: "#34d399",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            margin: "0 0 20px 0",
          }}
        >
          {punchline}
        </div>

        {/* Опис результату від першої особи */}
        {cardDescription && (
          <div
            style={{
              fontSize: "22px",
              fontWeight: "500",
              lineHeight: "1.45",
              color: "rgba(255, 255, 255, 0.9)",
              backgroundColor: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              borderRadius: "20px",
              padding: "16px 24px",
              margin: "0 auto 6px auto",
              maxWidth: "800px",
              textAlign: "center",
              boxSizing: "border-box",
            }}
          >
            {cardDescription}
          </div>
        )}

        {/* Золотиста роздільна лінія */}
        <div
          className="w-48 h-0.5 bg-gradient-to-r from-transparent via-amber-400/60 to-transparent"
          style={{
            width: "200px",
            height: "2px",
            background: "linear-gradient(90deg, transparent, rgba(245, 197, 24, 0.6), transparent)",
            margin: "0 auto 4px auto",
          }}
        />

        {/* Блок результату (Рахунок + Чітко відокремлений підпис) */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 0 10px 0",
          }}
        >
          {/* Величезний рахунок */}
          <div
            style={{
              fontSize: "120px",
              fontWeight: "900",
              color: "#ffffff",
              lineHeight: "1.1",
              letterSpacing: "-0.02em",
              textShadow: "0 12px 40px rgba(0,0,0,0.6)",
              margin: 0,
            }}
          >
            {clampedScore}/{totalQuestions}
          </div>
        </div>

        {/* Блок часу */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "12px",
            padding: "14px 36px",
            borderRadius: "9999px",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            fontSize: "26px",
            fontWeight: "700",
            color: "#67e8f9",
            margin: "0 0 28px 0",
          }}
        >
          <span>⏱ за {formattedTimeStr}</span>
        </div>

        {/* Call to Action Banner ("Беру участь також!") */}
        <div
          style={{
            width: "100%",
            fontSize: "24px",
            fontWeight: "800",
            color: "#ffffff",
            padding: "16px 24px",
            borderRadius: "20px",
            background: "linear-gradient(90deg, rgba(245, 197, 24, 0.2) 0%, rgba(245, 197, 24, 0.35) 50%, rgba(245, 197, 24, 0.2) 100%)",
            border: "1px solid rgba(245, 197, 24, 0.5)",
            letterSpacing: "0.03em",
            boxSizing: "border-box",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
            textAlign: "center",
          }}
        >
          🔥 Беру участь також! 👉 <span style={{ color: "#fde047", textDecoration: "underline" }}>wc-26-quiz.vercel.app</span>
        </div>
      </div>

      {/* 3. Нижній колонтитул (Відзнака розробника & Instagram) */}
      <div
        className="relative z-10 flex flex-col items-center gap-2 text-center"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
          marginBottom: "50px",
        }}
      >
        {/* Посилання на квіз */}
        <div
          className="text-xl font-bold tracking-[0.25em] text-white/50 uppercase"
          style={{
            fontSize: "28px",
            fontWeight: "700",
            letterSpacing: "0.2em",
            color: "rgba(255, 255, 255, 0.5)",
            textTransform: "uppercase",
          }}
        >
          wc-26-quiz.vercel.app
        </div>

        {/* Відзнака розробника з Instagram ніком */}
        <div
          className="flex items-center justify-center gap-4 text-lg text-white/70 tracking-wider font-medium"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "14px",
            fontSize: "24px",
            color: "rgba(255, 255, 255, 0.7)",
            fontWeight: "500",
            letterSpacing: "0.04em",
          }}
        >
          <span>Розробник: <strong>Олег Селін</strong></span>
          <span style={{ color: "rgba(255, 255, 255, 0.3)" }}>•</span>
          <div className="flex items-center gap-2" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" style={{ color: "#f5c518" }}>
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
            <span style={{ color: "#ffffff", fontWeight: "700" }}>@olevenni</span>
          </div>
        </div>
      </div>
    </div>
  );
}
