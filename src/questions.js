/**
 * Local question pool — same structure as Firestore documents.
 * Includes both Ukrainian (default) and English translations for bilingual support.
 */

const localQuestions = [
  // ─── Країни-господарі та стадіони ───
  {
    id: "q1",
    text: "Які країни спільно приймали Чемпіонат світу 2026 року?",
    textEn: "Which host countries jointly held the 2026 FIFA World Cup?",
    options: [
      "США, Канада, Мексика",
      "Аргентина, Уругвай, Парагвай",
      "Іспанія, Португалія, Марокко",
      "Німеччина, Франція, Італія",
    ],
    optionsEn: [
      "USA, Canada, Mexico",
      "Argentina, Uruguay, Paraguay",
      "Spain, Portugal, Morocco",
      "Germany, France, Italy",
    ],
    correctAnswerIndex: 0,
    explanation:
      "Правильна відповідь А, оскільки ЧС-2026 вперше в історії прийняли три північноамериканські країни.",
    explanationEn:
      "Option A is correct as WC 2026 was jointly hosted by three North American nations for the first time in history.",
  },
  {
    id: "q2",
    text: "Скільки міст-господарів приймали матчі ЧС-2026?",
    textEn: "How many host cities held matches at WC 2026?",
    options: ["12", "16", "20", "24"],
    optionsEn: ["12", "16", "20", "24"],
    correctAnswerIndex: 1,
    explanation:
      "Турнір приймали 16 міст (11 у США, 3 у Мексиці, 2 у Канаді).",
    explanationEn:
      "The tournament was hosted across 16 cities (11 in the USA, 3 in Mexico, 2 in Canada).",
  },
  {
    id: "q3",
    text: "Яка з країн-господарів приймала Чемпіонат світу вже втретє?",
    textEn: "Which of the host nations hosted the World Cup for the third time?",
    options: ["США", "Канада", "Мексика", "Жодна з перелічених"],
    optionsEn: ["USA", "Canada", "Mexico", "None of these"],
    correctAnswerIndex: 2,
    explanation:
      "Мексика приймала турнір у 1970, 1986 та 2026 роках, ставши першою країною з таким досягненням.",
    explanationEn:
      "Mexico hosted in 1970, 1986, and 2026, becoming the first nation to host three World Cups.",
  },
  {
    id: "q4",
    text: "На якому стадіоні відбувся матч-відкриття ЧС-2026?",
    textEn: "Which stadium hosted the opening match of WC 2026?",
    options: [
      "Естадіо Астека (Мехіко)",
      "Метлайф-стедіум (Нью-Джерсі)",
      "Бі-Сі Плейс (Ванкувер)",
      "СоФай Стедіум (Лос-Анджелес)",
    ],
    optionsEn: [
      "Estadio Azteca (Mexico City)",
      "MetLife Stadium (New Jersey)",
      "BC Place (Vancouver)",
      "SoFi Stadium (Los Angeles)",
    ],
    correctAnswerIndex: 0,
    explanation:
      "Турнір стартував 11 червня на легендарному «Естадіо Астека».",
    explanationEn:
      "The tournament kicked off on June 11 at the legendary Estadio Azteca.",
  },
  {
    id: "q5",
    text: "Який стадіон ЧС-2026 розташований найвище над рівнем моря (понад 2200 метрів)?",
    textEn: "Which WC 2026 stadium is located highest above sea level (over 2,200 meters)?",
    options: [
      "Естадіо Акрон (Гвадалахара)",
      "Естадіо Астека (Мехіко)",
      "Майл Гай (Денвер)",
      "Мерседес-Бенц Стедіум (Атланта)",
    ],
    optionsEn: [
      "Estadio Akron (Guadalajara)",
      "Estadio Azteca (Mexico City)",
      "Mile High (Denver)",
      "Mercedes-Benz Stadium (Atlanta)",
    ],
    correctAnswerIndex: 1,
    explanation:
      "«Естадіо Астека» знаходиться на висоті 2200 метрів над рівнем моря.",
    explanationEn:
      "Estadio Azteca sits at 2,200 meters above sea level, posing altitude challenges.",
  },
  {
    id: "q6",
    text: "Скільки матчів турніру загалом прийняли США?",
    textEn: "How many total tournament matches were played in the USA?",
    options: ["50", "64", "78", "104"],
    optionsEn: ["50", "64", "78", "104"],
    correctAnswerIndex: 2,
    explanation:
      "Левову частку турніру (78 матчів) зіграли у США. Канада та Мексика прийняли по 13 ігор.",
    explanationEn:
      "The United States hosted 78 matches, while Canada and Mexico hosted 13 matches each.",
  },
  {
    id: "q7",
    text: "Скільки міст Канади брали участь у проведення ЧС-2026?",
    textEn: "How many Canadian cities participated in hosting WC 2026?",
    options: ["2", "3", "4", "Канада не приймала матчі"],
    optionsEn: ["2", "3", "4", "Canada didn't host matches"],
    correctAnswerIndex: 0,
    explanation:
      "Матчі приймали лише два канадські міста — Торонто та Ванкувер.",
    explanationEn:
      "Matches were hosted in two Canadian cities: Toronto and Vancouver.",
  },
  {
    id: "q8",
    text: "На якому стадіоні було зіграно фінальний матч ЧС-2026?",
    textEn: "Which stadium hosted the final match of WC 2026?",
    options: [
      "Лусаїл Айконік",
      "Естадіо Астека",
      "Метлайф-стедіум (Нью-Йорк / Нью-Джерсі)",
      "Вемблі",
    ],
    optionsEn: [
      "Lusail Iconic",
      "Estadio Azteca",
      "MetLife Stadium (New York / New Jersey)",
      "Wembley",
    ],
    correctAnswerIndex: 2,
    explanation:
      "Фінал 19 липня відбувся на стадіоні Метлайф у Нью-Джерсі.",
    explanationEn:
      "The grand final took place on July 19 at MetLife Stadium in New Jersey.",
  },
  {
    id: "q9",
    text: "Скільки днів тривав Чемпіонат світу 2026 року, ставши найдовшим в історії?",
    textEn: "How many days did WC 2026 last, making it the longest World Cup in history?",
    options: ["28 днів", "32 дні", "39 днів", "45 днів"],
    optionsEn: ["28 days", "32 days", "39 days", "45 days"],
    correctAnswerIndex: 2,
    explanation:
      "Турнір тривав рівно 39 днів (з 11 червня до 19 липня) через збільшення кількості команд.",
    explanationEn:
      "The tournament ran for 39 days (June 11 to July 19) due to team expansion.",
  },
  {
    id: "q10",
    text: "У якому місті було зіграно матч за третє місце?",
    textEn: "In which city was the third-place match played?",
    options: ["Маямі", "Лос-Анджелес", "Даллас", "Нью-Йорк"],
    optionsEn: ["Miami", "Los Angeles", "Dallas", "New York"],
    correctAnswerIndex: 0,
    explanation:
      "Втішний фінал за третє місце пройшов у Маямі.",
    explanationEn:
      "The third-place play-off match was held in Miami.",
  },

  // ─── Новий формат та правила ───
  {
    id: "q11",
    text: "Яка рекордна кількість збірних взяла участь у ЧС-2026?",
    textEn: "What record number of national teams participated in WC 2026?",
    options: ["32", "40", "48", "64"],
    optionsEn: ["32", "40", "48", "64"],
    correctAnswerIndex: 2,
    explanation:
      "ФІФА вперше в історії збільшила кількість учасників до 48 команд.",
    explanationEn:
      "FIFA expanded the tournament to 48 national teams for the first time in history.",
  },
  {
    id: "q12",
    text: "Скільки всього матчів було зіграно на ЧС-2026?",
    textEn: "How many total matches were played at WC 2026?",
    options: ["64", "80", "96", "104"],
    optionsEn: ["64", "80", "96", "104"],
    correctAnswerIndex: 3,
    explanation:
      "Через розширення турніру було зіграно рекордні 104 матчі.",
    explanationEn:
      "A total of 104 matches were played due to the expanded format.",
  },
  {
    id: "q13",
    text: "На скільки груп були поділені команди на першому етапі турніру?",
    textEn: "How many groups were teams divided into in the first stage?",
    options: [
      "8 груп по 6 команд",
      "12 груп по 4 команди",
      "16 груп по 3 команди",
      "4 групи по 12 команд",
    ],
    optionsEn: [
      "8 groups of 6 teams",
      "12 groups of 4 teams",
      "16 groups of 3 teams",
      "4 groups of 12 teams",
    ],
    correctAnswerIndex: 1,
    explanation:
      "ФІФА затвердила класичний формат із 4 командами, але збільшила кількість груп до 12.",
    explanationEn:
      "FIFA approved 12 groups of 4 teams each for the group stage.",
  },
  {
    id: "q14",
    text: "Які команди виходили до стадії плей-оф (1/16 фіналу) з групового етапу?",
    textEn: "Which teams advanced to the knockout stage (Round of 32) from the group stage?",
    options: [
      "Лише переможці груп",
      "По дві найкращі команди з кожної групи",
      "По дві найкращі команди + 8 найкращих збірних, що посіли треті місця",
      "По три команди з кожної групи",
    ],
    optionsEn: [
      "Group winners only",
      "Top 2 teams from each group",
      "Top 2 teams + 8 best 3rd-place teams",
      "Top 3 teams from each group",
    ],
    correctAnswerIndex: 2,
    explanation:
      "Далі проходили 24 команди з 1-2 місць та 8 найкращих третіх місць.",
    explanationEn:
      "Top 2 teams from each group plus the 8 best 3rd-placed teams formed the 32-team grid.",
  },
  {
    id: "q15",
    text: "З якої стадії розпочинався раунд плей-оф на ЧС-2026?",
    textEn: "From which round did the knockout stage begin at WC 2026?",
    options: [
      "1/32 фіналу",
      "1/16 фіналу",
      "1/8 фіналу",
      "Чвертьфінал",
    ],
    optionsEn: [
      "Round of 64",
      "Round of 32",
      "Round of 16",
      "Quarter-finals",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Через збільшення команд додався новий раунд — 1/16 фіналу (round of 32).",
    explanationEn:
      "An extra round — Round of 32 — was introduced due to the expanded team format.",
  },
  {
    id: "q16",
    text: "Яка збірних була чинним чемпіоном світу перед стартом турніру?",
    textEn: "Which team was the reigning World Champion before the tournament started?",
    options: ["Франція", "Іспанія", "Аргентина", "Бразилія"],
    optionsEn: ["France", "Spain", "Argentina", "Brazil"],
    correctAnswerIndex: 2,
    explanation:
      "Аргентина захищала титул, здобутий у 2022 році в Катарі.",
    explanationEn:
      "Argentina entered as defending champions after winning Qatar 2022.",
  },
  {
    id: "q17",
    text: "Скільки збірних кваліфікувалися на ЧС-2026 через міжконтинентальний плей-оф у березні 2026 року?",
    textEn: "How many teams qualified via the intercontinental play-offs in March 2026?",
    options: ["2", "4", "6", "8"],
    optionsEn: ["2", "4", "6", "8"],
    correctAnswerIndex: 2,
    explanation:
      "Останні 6 путівок було розіграно у додатковому весняному турнірі.",
    explanationEn:
      "The final 6 qualification spots were decided in a spring tournament.",
  },
  {
    id: "q18",
    text: "Яка країна вперше у своїй історії брала участь у турнірі не проходячи кваліфікацію, а на правах господаря?",
    textEn: "Which country participated in the tournament directly as host for the first time?",
    options: [
      "Канада",
      "Мексика",
      "США",
      "Жодна, всі грали відбір",
    ],
    optionsEn: [
      "Canada",
      "Mexico",
      "USA",
      "None, all played qualifiers",
    ],
    correctAnswerIndex: 0,
    explanation:
      "Канада вперше стала господарем ЧС і кваліфікувалася автоматично.",
    explanationEn:
      "Canada co-hosted for the first time and qualified automatically.",
  },
  {
    id: "q19",
    text: "Скільки загалом голів було забито на ЧС-2026?",
    textEn: "How many total goals were scored at WC 2026?",
    options: ["172", "205", "250", "308"],
    optionsEn: ["172", "205", "250", "308"],
    correctAnswerIndex: 3,
    explanation:
      "На турнірі було забито рекордні 308 голів.",
    explanationEn:
      "A tournament-record 308 goals were scored in total.",
  },
  {
    id: "q20",
    text: "Якою була середня результативність турніру (голів за матч)?",
    textEn: "What was the average goal scoring rate of the tournament (goals per match)?",
    options: ["1.50", "2.67", "2.96", "3.50"],
    optionsEn: ["1.50", "2.67", "2.96", "3.50"],
    correctAnswerIndex: 2,
    explanation:
      "Середня кількість голів склала 2.96 за матч (308 голів / 104 матчі).",
    explanationEn:
      "The scoring average was 2.96 goals per match (308 goals across 104 games).",
  },

  // ─── Фінал турніру та його герої ───
  {
    id: "q21",
    text: "Яка збірна стала переможцем Чемпіонату світу 2026 року?",
    textEn: "Which national team won the 2026 FIFA World Cup?",
    options: ["Аргентина", "Франція", "Англія", "Іспанія"],
    optionsEn: ["Argentina", "France", "England", "Spain"],
    correctAnswerIndex: 3,
    explanation:
      "Іспанія виграла трофей 19 липня, здолавши у фіналі Аргентину.",
    explanationEn:
      "Spain lifted the trophy on July 19 after defeating Argentina in the final.",
  },
  {
    id: "q22",
    text: "Яким був підсумковий рахунок фінального матчу між Іспанією та Аргентиною?",
    textEn: "What was the final score of the final match between Spain and Argentina?",
    options: [
      "2:1 в основний час",
      "0:0, перемога Аргентини по пенальті",
      "1:0 після додаткового часу",
      "3:0 в основний час",
    ],
    optionsEn: [
      "2:1 in regular time",
      "0:0, Argentina won on penalties",
      "1:0 after extra time",
      "3:0 in regular time",
    ],
    correctAnswerIndex: 2,
    explanation:
      "Іспанія перемогла з рахунком 1:0 завдяки голу в екстратаймі після 0:0 у основний час.",
    explanationEn:
      "Spain won 1:0 thanks to an extra-time goal following a 0:0 regular time draw.",
  },
  {
    id: "q23",
    text: "Хто став автором «золотого голу» у фіналі ЧС-2026?",
    textEn: "Who scored the winning goal in the WC 2026 final?",
    options: [
      "Ліонель Мессі",
      "Ламін Ямаль",
      "Ферран Торрес",
      "Альваро Мората",
    ],
    optionsEn: [
      "Lionel Messi",
      "Lamine Yamal",
      "Ferran Torres",
      "Álvaro Morata",
    ],
    correctAnswerIndex: 2,
    explanation:
      "Ферран Торрес вийшов на заміну і забив вирішальний м'яч у фіналі.",
    explanationEn:
      "Ferran Torres came off the bench to score the tournament-winning goal.",
  },
  {
    id: "q24",
    text: "На якій хвилині було забито переможний м'яч у фіналі?",
    textEn: "In which minute was the winning goal scored in the final?",
    options: ["45'", "89'", "106'", "120'"],
    optionsEn: ["45'", "89'", "106'", "120'"],
    correctAnswerIndex: 2,
    explanation:
      "Торрес відзначився на 106-й хвилині на початку другого екстратайму.",
    explanationEn:
      "Torres struck in the 106th minute at the start of the second half of extra time.",
  },
  {
    id: "q25",
    text: "Хто віддав гольову передачу (асист) на Феррана Торреса у фіналі?",
    textEn: "Who provided the assist for Ferran Torres' goal in the final?",
    options: [
      "Ніко Вільямс",
      "Педрі",
      "Марк Кукурелья",
      "Дані Ольмо",
    ],
    optionsEn: [
      "Nico Williams",
      "Pedri",
      "Marc Cucurella",
      "Dani Olmo",
    ],
    correctAnswerIndex: 0,
    explanation:
      "Ніко Вільямс скинув м'яч головою на Торреса.",
    explanationEn:
      "Nico Williams headed the ball down into the box for Torres to finish.",
  },
  {
    id: "q26",
    text: "Скільки сейвів зробив воротар Аргентини Еміліано Мартінес у фіналі, встановивши рекорд?",
    textEn: "How many saves did Argentina GK Emiliano Martínez make in the final to set a record?",
    options: ["5", "8", "11", "15"],
    optionsEn: ["5", "8", "11", "15"],
    correctAnswerIndex: 2,
    explanation:
      "Мартінес здійснив 11 порятунків воріт — це рекордна кількість для фіналів ЧС.",
    explanationEn:
      "Martínez made 11 saves, setting an all-time record for a World Cup final.",
  },
  {
    id: "q27",
    text: "Хто був визнаний найкращим гравцем фінального матчу (Man of the Match)?",
    textEn: "Who was named Man of the Match in the final?",
    options: [
      "Ліонель Мессі",
      "Ферран Торрес",
      "Унаї Сімон",
      "Родрі",
    ],
    optionsEn: [
      "Lionel Messi",
      "Ferran Torres",
      "Unai Simón",
      "Rodri",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Ферран Торрес отримав цю нагороду як автор переможного голу.",
    explanationEn:
      "Ferran Torres claimed Man of the Match after scoring the winning goal.",
  },
  {
    id: "q28",
    text: "Яка збірна отримала 7 жовтих та 1 червону картку у фінальному матчі?",
    textEn: "Which national team received 7 yellow cards and 1 red card in the final?",
    options: [
      "Іспанія",
      "Аргентина",
      "Обидві команди отримали порівну",
      "Карток у фіналі не було",
    ],
    optionsEn: [
      "Spain",
      "Argentina",
      "Both received equal cards",
      "No cards were shown",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Аргентина грала дуже жорстко і закінчила матч у меншості.",
    explanationEn:
      "Argentina accumulated 7 yellows and 1 red card, finishing a man down.",
  },
  {
    id: "q29",
    text: "Яке унікальне досягнення підкорилося Іспанії після перемоги на ЧС-2026?",
    textEn: "What unique milestone did Spain achieve by winning WC 2026?",
    options: [
      "Вона виграла турнір, не забивши жодного голу в плей-оф",
      "Вона стала першою країною, що одночасно володіє чоловічим та жіночим кубками світу",
      "Вона виграла ЧС втретє поспіль",
      "Це її перша перемога в історії",
    ],
    optionsEn: [
      "Won tournament without scoring in knockouts",
      "First nation to hold both Men's & Women's World Cups simultaneously",
      "Won 3 World Cups in a row",
      "First victory in country's history",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Іспанія виграла жіночий ЧС у 2023 році та чоловічий ЧС у 2026 році, володіючи обома титулами одночасно.",
    explanationEn:
      "Spain won the Women's World Cup in 2023 and Men's in 2026, holding both world titles simultaneously.",
  },
  {
    id: "q30",
    text: "Яка інноваційна розважальна програма дебютувала у перерві фіналу ЧС-2026?",
    textEn: "What entertainment show debuted at halftime during the WC 2026 final?",
    options: [
      "Super Bowl Halftime Show",
      "FIFA World Cup Topps Final Halftime Show",
      "Coachella World Stage",
      "UEFA Champions Festival",
    ],
    optionsEn: [
      "Super Bowl Halftime Show",
      "FIFA World Cup Topps Final Halftime Show",
      "Coachella World Stage",
      "UEFA Champions Festival",
    ],
    correctAnswerIndex: 1,
    explanation:
      "ФІФА вперше провела власне масштабне шоу у перерві фіналу спільно з Topps.",
    explanationEn:
      "FIFA launched its official final halftime show in partnership with Topps.",
  },

  // ─── Нагороди, статистика та треті місця ───
  {
    id: "q31",
    text: "Хто здобув нагороду «Золотий бутс» (найкращий бомбардир) на ЧС-2026?",
    textEn: "Who won the Golden Boot (top goalscorer) at WC 2026?",
    options: [
      "Кіліан Мбаппе",
      "Ліонель Мессі",
      "Альваро Мората",
      "Гаррі Кейн",
    ],
    optionsEn: [
      "Kylian Mbappé",
      "Lionel Messi",
      "Álvaro Morata",
      "Harry Kane",
    ],
    correctAnswerIndex: 0,
    explanation:
      "Француз Кіліан Мбаппе забив найбільше голів на турнірі.",
    explanationEn:
      "Kylian Mbappé finished as top scorer of the tournament.",
  },
  {
    id: "q32",
    text: "Скільки голів забив Кіліан Мбаппе, щоб виграти «Золотий бутс» 2026 року?",
    textEn: "How many goals did Kylian Mbappé score to win the 2026 Golden Boot?",
    options: ["6", "8", "10", "12"],
    optionsEn: ["6", "8", "10", "12"],
    correctAnswerIndex: 2,
    explanation:
      "Мбаппе забив 10 голів протягом турніру.",
    explanationEn:
      "Mbappé scored 10 goals during the 2026 tournament.",
  },
  {
    id: "q33",
    text: "Кому ФІФА вручила «Золотий м'яч» як найкращому гравцю всього турніру (adidas Golden Ball)?",
    textEn: "Who was awarded the adidas Golden Ball as Best Player of WC 2026?",
    options: ["Родрі", "Ліонель Мессі", "Джуд Беллінгем", "Ламін Ямаль"],
    optionsEn: ["Rodri", "Lionel Messi", "Jude Bellingham", "Lamine Yamal"],
    correctAnswerIndex: 0,
    explanation:
      "Іспанський півзахисник Родрі був визнаний найкращим гравцем турніру.",
    explanationEn:
      "Spanish midfielder Rodri won the Golden Ball for Best Player of the tournament.",
  },
  {
    id: "q34",
    text: "Хто отримав «Золоту рукавичку» як найкращий воротар ЧС-2026?",
    textEn: "Who received the Golden Glove as the Best Goalkeeper of WC 2026?",
    options: [
      "Еміліано Мартінес (Аргентина)",
      "Тібо Куртуа (Бельгія)",
      "Унаї Сімон (Іспанія)",
      "Джордан Пікфорд (Англія)",
    ],
    optionsEn: [
      "Emiliano Martínez (Argentina)",
      "Thibaut Courtois (Belgium)",
      "Unai Simón (Spain)",
      "Jordan Pickford (England)",
    ],
    correctAnswerIndex: 2,
    explanation:
      "Іспанець Унаї Сімон став найкращим голкіпером турніру.",
    explanationEn:
      "Spain's Unai Simón won the Golden Glove award.",
  },
  {
    id: "q35",
    text: "Кого було визнано найкращим молодим гравцем турніру (Young Player Award)?",
    textEn: "Who was named Young Player of the Tournament?",
    options: [
      "Енцо Фернандеса",
      "Пау Кубарсі",
      "Педрі",
      "Гаві",
    ],
    optionsEn: [
      "Enzo Fernández",
      "Pau Cubarsí",
      "Pedri",
      "Gavi",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Юний іспанський захисник Пау Кубарсі здобув цю нагороду.",
    explanationEn:
      "Young Spanish defender Pau Cubarsí won the Young Player award.",
  },
  {
    id: "q36",
    text: "Хто переміг у матчі за третє місце на ЧС-2026?",
    textEn: "Who won the third-place play-off match at WC 2026?",
    options: ["Франція", "Англія", "Бразилія", "Португалія"],
    optionsEn: ["France", "England", "Brazil", "Portugal"],
    correctAnswerIndex: 1,
    explanation:
      "Збірна Англії виграла бронзові медалі, здолавши Францію.",
    explanationEn:
      "England claimed third place by beating France.",
  },
  {
    id: "q37",
    text: "Яким був підсумковий рахунок у неймовірному матчі за третє місце між Англією та Францією?",
    textEn: "What was the final score in the third-place thriller between England & France?",
    options: ["1:0", "3:3 (по пенальті 4:2)", "6:4", "2:1"],
    optionsEn: ["1:0", "3:3 (4:2 on pens)", "6:4", "2:1"],
    correctAnswerIndex: 2,
    explanation:
      "Матч закінчився з розгромним рахунком 6:4 на користь Англії.",
    explanationEn:
      "The thrilling third-place match ended 6:4 in favor of England.",
  },
  {
    id: "q38",
    text: "Якою була загальна кількість глядачів на трибунах за весь турнір ЧС-2026?",
    textEn: "What was the total stadium attendance across the entire WC 2026?",
    options: [
      "Близько 3 мільйонів",
      "Близько 4.5 мільйонів",
      "Понад 6.8 мільйона",
      "Понад 10 мільйонів",
    ],
    optionsEn: [
      "About 3 million",
      "About 4.5 million",
      "Over 6.8 million",
      "Over 10 million",
    ],
    correctAnswerIndex: 2,
    explanation:
      "Турнір відвідали рекордні 6,810,966 фанатів.",
    explanationEn:
      "A total of 6,810,966 spectators attended matches during the tournament.",
  },
  {
    id: "q39",
    text: "Яким був показник середньої відвідуваності одного матчу на ЧС-2026?",
    textEn: "What was the average match attendance at WC 2026?",
    options: ["45 320", "51 000", "65 490", "82 000"],
    optionsEn: ["45,320", "51,000", "65,490", "82,000"],
    correctAnswerIndex: 2,
    explanation:
      "В середньому на кожен матч приходило 65 490 глядачів.",
    explanationEn:
      "Average attendance reached 65,490 fans per match.",
  },
  {
    id: "q40",
    text: "Який арбітр судив фінальний матч турніру між Іспанією та Аргентиною?",
    textEn: "Which referee officiated the final match between Spain and Argentina?",
    options: [
      "Шимон Марциняк (Польща)",
      "Даніеле Орсато (Італія)",
      "Славко Вінчич (Словенія)",
      "Майкл Олівер (Англія)",
    ],
    optionsEn: [
      "Szymon Marciniak (Poland)",
      "Daniele Orsato (Italy)",
      "Slavko Vinčić (Slovenia)",
      "Michael Oliver (England)",
    ],
    correctAnswerIndex: 2,
    explanation:
      "Головним рефері фіналу був призначений слованець Славко Вінчич.",
    explanationEn:
      "Slovenia's Slavko Vinčić officiated the WC 2026 final.",
  },
];

/**
 * Returns localized questions based on language code ('ua' or 'en').
 */
export function getLocalizedQuestions(questions, lang = "ua") {
  const isEn = lang && lang.startsWith("en");
  return questions.map((q) => ({
    ...q,
    text: isEn && q.textEn ? q.textEn : q.text,
    options: isEn && q.optionsEn ? q.optionsEn : q.options,
    explanation: isEn && q.explanationEn ? q.explanationEn : q.explanation,
  }));
}

export default localQuestions;
