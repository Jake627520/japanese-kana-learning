import type { Language, LocalizedText } from '../i18n/types';
import type { NavigationTab } from '../types';
import { localize } from '../i18n/localize';

// 單元學習（方案 A）：14 個單元 U0–U13。
// 內容來源是已核准的規劃檔 `gojuuon-unit-plan-16-lessons.md`，教學點文字直接採用
// 該檔依標準日語語音學自行撰寫的內容；沒有加入影片截圖、影片檔案或字帖掃描。
// 長篇文字用 repo 的 LocalizedText（Record<Language, string>）：
// 標題、副標題、每一個教學點、驗收標準都要填滿 6 種語言
// （zh-TW、zh-CN、en、ko、es、pt-BR），少填一種 tsc 就會報錯。
// pt-BR 用詞照 `.audit/pt-br-references.md`（vogal longa、consoante dobrada、
// yoon／choon 不加長音符號、mora 首次出現加註、você-form 語氣、長音雙寫）。

export type UnitText = LocalizedText;

export interface UnitLink {
  tab: NavigationTab;
  /** 連到假名卡片／書寫練習時帶的假名 id（必須存在於 kanaData） */
  kanaId?: string;
  /** 連到易混辨析時帶的群組 id（必須存在於 confusableData） */
  groupId?: string;
}

export interface LearningUnit {
  /** 'u0'–'u13' */
  id: string;
  title: UnitText;
  subtitle: UnitText;
  /** 本單元涵蓋的假名 id（平假名為主；U0、U11、U13 沒有對應假名，留空） */
  kanaIds: string[];
  teachingPoints: UnitText[];
  links: UnitLink[];
  acceptance: UnitText;
}

export function getUnitText(value: UnitText, lang: Language): string {
  return localize(value, lang);
}

const DAKUTEN_HIRAGANA = [
  'hd_ga', 'hd_gi', 'hd_gu', 'hd_ge', 'hd_go',
  'hd_za', 'hd_ji', 'hd_zu', 'hd_ze', 'hd_zo',
  'hd_da', 'hd_dji', 'hd_dzu', 'hd_de', 'hd_do',
  'hd_ba', 'hd_bi', 'hd_bu', 'hd_be', 'hd_bo',
  'hp_pa', 'hp_pi', 'hp_pu', 'hp_pe', 'hp_po',
];

const YOUON_HIRAGANA = [
  'hy_kya', 'hy_kyu', 'hy_kyo',
  'hy_sha', 'hy_shu', 'hy_sho',
  'hy_cha', 'hy_chu', 'hy_cho',
  'hy_nya', 'hy_nyu', 'hy_nyo',
  'hy_hya', 'hy_hyu', 'hy_hyo',
  'hy_bya', 'hy_byu', 'hy_byo',
  'hy_pya', 'hy_pyu', 'hy_pyo',
  'hy_mya', 'hy_myu', 'hy_myo',
  'hy_rya', 'hy_ryu', 'hy_ryo',
];

export const UNITS: LearningUnit[] = [
  {
    id: 'u0',
    title: {
      'zh-TW': '導學：認識五十音',
      'zh-CN': '导学：认识五十音',
      en: 'Orientation: Meet the Kana',
      ko: '오리엔테이션: 오십음 알아보기',
      es: 'Orientación: conocer el kana',
      'pt-BR': 'Orientação: conhecendo o kana',
    },
    subtitle: {
      'zh-TW': '五十音是什麼、平假名與片假名的分工、每天怎麼學',
      'zh-CN': '五十音是什么、平假名与片假名的分工、每天怎么学',
      en: 'What the kana are, hiragana vs katakana, and how to study daily',
      ko: '오십음이란 무엇인지, 히라가나와 가타카나의 역할, 매일 공부하는 방법',
      es: 'Qué es el kana, la diferencia entre hiragana y katakana, y cómo estudiar cada día',
      'pt-BR': 'O que é o kana, a diferença entre hiragana e katakana, e como estudar todos os dias',
    },
    kanaIds: [],
    teachingPoints: [
      {
        'zh-TW': '五十音從 46 個清音起步：平假名和片假名是同一套音的兩種寫法。App 全表 208 音，是清音加上濁音、半濁音、拗音與撥音的總數。',
        'zh-CN': '五十音从 46 个清音起步：平假名和片假名是同一套音的两种写法。App 全表 208 音，是清音加上浊音、半浊音、拗音与拨音的总数。',
        en: "Start from the 46 basic sounds: hiragana and katakana are two scripts for the same sounds. The app's full chart of 208 covers basic sounds plus voiced, semi-voiced, contracted, and moraic-nasal sounds.",
        ko: '오십음은 46개의 청음에서 출발합니다. 히라가나와 가타카나는 같은 소리를 쓰는 두 가지 문자입니다. 앱의 전체 표에 있는 208개 음은 청음에 탁음, 반탁음, 요음, 발음을 더한 것입니다.',
        es: 'El kana empieza con 46 sonidos básicos: hiragana y katakana son dos escrituras para los mismos sonidos. La tabla completa de la app tiene 208 sonidos: los básicos más los sonoros, semisonoros, contraídos y la nasal moraica.',
        'pt-BR': 'O kana começa com 46 sons básicos: hiragana e katakana são duas escritas para os mesmos sons. A tabela completa do aplicativo tem 208 sons: os básicos mais os sonoros, semissonoros, contraídos e a nasal moraica (ん).',
      },
      {
        'zh-TW': '平假名寫日語固有詞、助詞與詞尾；片假名寫外來語、擬聲詞與強調。',
        'zh-CN': '平假名写日语固有词、助词与词尾；片假名写外来语、拟声词与强调。',
        en: 'Hiragana is used for native Japanese words, particles, and endings; katakana is used for loanwords, sound effects, and emphasis.',
        ko: '히라가나는 일본어 고유어, 조사, 어미를 쓰고, 가타카나는 외래어, 의성어, 강조를 씁니다.',
        es: 'El hiragana se usa para palabras propias del japonés, partículas y terminaciones; el katakana, para extranjerismos, onomatopeyas y énfasis.',
        'pt-BR': 'O hiragana serve para palavras próprias do japonês, partículas e terminações; o katakana, para palavras estrangeiras, onomatopeias e ênfase.',
      },
      {
        'zh-TW': '羅馬字只是注音工具，不是日語本身；學假名時盡量直接認假名。',
        'zh-CN': '罗马字只是注音工具，不是日语本身；学假名时尽量直接认假名。',
        en: 'Romaji is only a pronunciation aid, not Japanese itself; try to read the kana directly.',
        ko: '로마자는 발음을 적는 도구일 뿐, 일본어 자체가 아닙니다. 가나를 배울 때는 가나를 직접 읽는 연습을 하세요.',
        es: 'El romaji es solo una ayuda para la pronunciación, no es japonés en sí; al aprender kana, intente leer el kana directamente.',
        'pt-BR': 'O roomaji é apenas um apoio para a pronúncia, não é o japonês em si; ao aprender kana, procure ler o kana diretamente.',
      },
      {
        'zh-TW': '學法：每天 30–45 分鐘，學一回、到 App 做對應測驗、清掉 SRS 到期項目；不要一次背完整張表。',
        'zh-CN': '学法：每天 30–45 分钟，学一回、到 App 做对应测验、清掉 SRS 到期项目；不要一次背完整张表。',
        en: "Study 30–45 minutes a day: finish one lesson, take the matching quiz in the app, and clear due SRS reviews. Don't try to memorize the whole chart at once.",
        ko: '학습법: 하루 30–45분씩 한 과를 배우고, 앱에서 해당 퀴즈를 풀고, 기한이 된 SRS 복습을 비우세요. 표 전체를 한 번에 외우려 하지 마세요.',
        es: 'Método: estudie 30–45 minutos al día, complete una lección, haga el cuestionario correspondiente en la app y ponga al día las revisiones SRS vencidas. No intente memorizar toda la tabla de una vez.',
        'pt-BR': 'Método: estude de 30 a 45 minutos por dia, complete uma lição, faça o questionário correspondente no aplicativo e coloque em dia as revisões do SRS. Não tente decorar a tabela inteira de uma vez.',
      },
    ],
    links: [{ tab: 'grid' }, { tab: 'study' }],
    acceptance: {
      'zh-TW': '能說出平假名與片假名的分工，知道本週要學哪幾回。',
      'zh-CN': '能说出平假名与片假名的分工，知道本周要学哪几回。',
      en: 'You can explain how hiragana and katakana differ, and you know which lessons come this week.',
      ko: '히라가나와 가타카나의 역할을 설명할 수 있고, 이번 주에 배울 과를 압니다.',
      es: 'Puede explicar la diferencia entre hiragana y katakana, y sabe qué lecciones tocan esta semana.',
      'pt-BR': 'Você consegue explicar a diferença entre hiragana e katakana e sabe quais lições vêm nesta semana.',
    },
  },
  {
    id: 'u1',
    title: {
      'zh-TW': '第 1 回：あ行',
      'zh-CN': '第 1 回：あ行',
      en: 'Lesson 1: A-row',
      ko: '제1과: 아행',
      es: 'Lección 1: fila A',
      'pt-BR': 'Lição 1: fileira A',
    },
    subtitle: {
      'zh-TW': '五個母音 a i u e o',
      'zh-CN': '五个元音 a i u e o',
      en: 'The five vowels: a, i, u, e, o',
      ko: '다섯 개의 모음 a i u e o',
      es: 'Las cinco vocales: a, i, u, e, o',
      'pt-BR': 'As cinco vogais: a, i, u, e, o',
    },
    kanaIds: ['h_a', 'h_i', 'h_u', 'h_e', 'h_o'],
    teachingPoints: [
      {
        'zh-TW': '五個母音 a、i、u、e、o 是所有發音的基礎，後面每一行都是子音加上這五個母音。',
        'zh-CN': '五个元音 a、i、u、e、o 是所有发音的基础，后面每一行都是辅音加上这五个元音。',
        en: 'The five vowels a, i, u, e, o are the basis of every sound; each later row is a consonant plus one of these vowels.',
        ko: '다섯 개의 모음 a, i, u, e, o는 모든 발음의 기초입니다. 뒤의 모든 행은 자음에 이 모음 중 하나를 더한 것입니다.',
        es: 'Las cinco vocales a, i, u, e, o son la base de todos los sonidos; cada fila siguiente es una consonante más una de estas vocales.',
        'pt-BR': 'As cinco vogais a, i, u, e, o são a base de todos os sons; cada fileira seguinte é uma consoante mais uma dessas vogais.',
      },
      {
        'zh-TW': 'う 不圓唇：嘴唇不收圓，接近中文「迂」但更放鬆；不要發成英文 u。',
        'zh-CN': 'う 不圆唇：嘴唇不收圆，接近中文“迂”但更放松；不要发成英文 u。',
        en: 'The vowel u is unrounded: keep your lips relaxed, close to the Mandarin "yū" but looser. Don\'t pronounce it like the English "oo".',
        ko: 'う는 입술을 둥글게 하지 않는 모음입니다. 입술에 힘을 빼고 편안하게 발음하세요. 영어의 "oo"처럼 발음하지 마세요.',
        es: 'La u no es redondeada: mantenga los labios relajados, sin fruncirlos. No la pronuncie como la "u" inglesa.',
        'pt-BR': 'O u não é arredondado: mantenha os lábios relaxados, sem franzir. Não o pronuncie como o "u" do inglês.',
      },
      {
        'zh-TW': '例詞：あい（愛）、うえ（上）。',
        'zh-CN': '例词：あい（爱）、うえ（上）。',
        en: 'Example words: あい (love), うえ (above).',
        ko: '예: あい(사랑), うえ(위).',
        es: 'Ejemplos: あい (amor), うえ (arriba).',
        'pt-BR': 'Exemplos: あい (ai, amor), うえ (ue, em cima).',
      },
    ],
    links: [
      { tab: 'grid' },
      { tab: 'study', kanaId: 'h_a' },
      { tab: 'writing', kanaId: 'h_a' },
      { tab: 'confusable', groupId: 'cf_a_o' },
    ],
    acceptance: {
      'zh-TW': '假名卡片あ行 5 音認讀全對，書寫練習あ行筆順完成。',
      'zh-CN': '假名卡片あ行 5 音认读全对，书写练习あ行笔顺完成。',
      en: 'Read all five A-row kana correctly on flashcards and finish the A-row stroke order in writing practice.',
      ko: '플래시카드에서 아행 5개 음을 모두 맞히고, 쓰기 연습에서 아행 획순을 완성하세요.',
      es: 'Lea correctamente los cinco sonidos de la fila A en las tarjetas y complete el orden de trazos de la fila A en la práctica de escritura.',
      'pt-BR': 'Leia corretamente os cinco sons da fileira A nos cartões e complete a ordem dos traços da fileira A na prática de escrita.',
    },
  },
  {
    id: 'u2',
    title: {
      'zh-TW': '第 2 回：か行',
      'zh-CN': '第 2 回：か行',
      en: 'Lesson 2: K-row',
      ko: '제2과: 카행',
      es: 'Lección 2: fila K',
      'pt-BR': 'Lição 2: fileira K',
    },
    subtitle: {
      'zh-TW': 'k 加上五個母音',
      'zh-CN': 'k 加上五个元音',
      en: 'K plus the five vowels',
      ko: 'k에 다섯 개의 모음',
      es: 'K más las cinco vocales',
      'pt-BR': 'K mais as cinco vogais',
    },
    kanaIds: ['h_ka', 'h_ki', 'h_ku', 'h_ke', 'h_ko'],
    teachingPoints: [
      {
        'zh-TW': 'か行是 k 加上母音；き 的發音接近 ki，不要拖長。',
        'zh-CN': 'か行是 k 加上元音；き 的发音接近 ki，不要拖长。',
        en: "The K-row is k plus a vowel; き sounds like 'ki' — don't stretch it.",
        ko: '카행은 k에 모음을 더한 것입니다. き는 "ki"에 가깝게 발음하고, 길게 끌지 마세요.',
        es: "La fila K es k más una vocal; き suena como 'ki', sin alargarla.",
        'pt-BR': "A fileira K é k mais uma vogal; o き soa como 'ki', sem alongar.",
      },
      {
        'zh-TW': '預告：か行加上濁點就變成が行（がぎぐげご），在第 10 回正式教。',
        'zh-CN': '预告：か行加上浊点就变成が行（がぎぐげご），在第 10 回正式教。',
        en: 'Preview: add a dakuten mark and the K-row becomes the G-row (がぎぐげご), taught in Lesson 10.',
        ko: '미리 보기: 카행에 탁점을 붙이면 가행(がぎぐげご)이 되며, 제10과에서 정식으로 배웁니다.',
        es: 'Adelanto: con el signo de sonoridad, la fila K se convierte en la fila G (がぎぐげご), que se estudia en la lección 10.',
        'pt-BR': 'Prévia: com o sinal de sonoridade (dakuten), a fileira K vira a fileira G (がぎぐげご), estudada na lição 10.',
      },
      {
        'zh-TW': '例詞：かぜ（風）、き（木、氣）。',
        'zh-CN': '例词：かぜ（风）、き（木、气）。',
        en: 'Example words: かぜ (wind), き (tree; spirit).',
        ko: '예: かぜ(바람), き(나무, 기운).',
        es: 'Ejemplos: かぜ (viento), き (árbol; espíritu).',
        'pt-BR': 'Exemplos: かぜ (kaze, vento), き (ki, árvore; espírito).',
      },
    ],
    links: [
      { tab: 'grid' },
      { tab: 'study', kanaId: 'h_ka' },
      { tab: 'writing', kanaId: 'h_ka' },
      { tab: 'confusable', groupId: 'cf_ki_sa' },
    ],
    acceptance: {
      'zh-TW': 'か行認讀全對；能區分 か與が 的寫法（還不要求發音區分）。',
      'zh-CN': 'か行认读全对；能区分 か与が 的写法（还不要求发音区分）。',
      en: 'Read the whole K-row correctly and tell か apart from が in writing (pronunciation contrast comes later).',
      ko: '카행을 모두 정확히 읽고, か와 が의 쓰임을 구분할 수 있습니다(발음 구분은 아직 요구하지 않습니다).',
      es: 'Lea toda la fila K correctamente y distinga か de が por escrito (la distinción de pronunciación vendrá después).',
      'pt-BR': 'Leia toda a fileira K corretamente e distinga か de が na escrita (a distinção de pronúncia vem depois).',
    },
  },
  {
    id: 'u3',
    title: {
      'zh-TW': '第 3 回：さ行',
      'zh-CN': '第 3 回：さ行',
      en: 'Lesson 3: S-row',
      ko: '제3과: 사행',
      es: 'Lección 3: fila S',
      'pt-BR': 'Lição 3: fileira S',
    },
    subtitle: {
      'zh-TW': 'し、す是本回的難音',
      'zh-CN': 'し、す是本回的难点音',
      en: 'The tricky sounds are し and す',
      ko: 'し와 す가 이번 과의 어려운 소리입니다',
      es: 'Los sonidos difíciles son し y す',
      'pt-BR': 'Os sons difíceis são し e す',
    },
    kanaIds: ['h_sa', 'h_shi', 'h_su', 'h_se', 'h_so'],
    teachingPoints: [
      {
        'zh-TW': 'し 讀起來接近「xi」（舌面音），不是「si」。',
        'zh-CN': 'し 读起来接近“xi”（舌面音），不是“si”。',
        en: 'し sounds close to "xi" (a palatal sound), not "si".',
        ko: 'し는 "xi"에 가깝게(혀 앞부분을 입천장에 가까이 대고) 발음합니다. "si"가 아닙니다.',
        es: 'し suena parecido a "xi" (un sonido palatal), no a "si".',
        'pt-BR': 'O し é um som palatal, com a língua próxima do céu da boca; não é "si".',
      },
      {
        'zh-TW': 'す 的 u 常常弱化，聽起來接近只有 s。',
        'zh-CN': 'す 的 u 常常弱化，听起来接近只有 s。',
        en: 'The u in す is often devoiced, so it can sound almost like just "s".',
        ko: 'す의 u는 자주 약해져서, s만 들리는 것처럼 느껴질 수 있습니다.',
        es: 'La u de す suele debilitarse, y a veces suena casi como una simple "s".',
        'pt-BR': 'O u de す costuma enfraquecer, e o som pode parecer apenas "s".',
      },
      {
        'zh-TW': '易混：し vs す；さ vs ざ（濁音預告）。',
        'zh-CN': '易混：し vs す；さ vs ざ（浊音预告）。',
        en: 'Easy to mix up: し vs す, and さ vs ざ (voiced preview).',
        ko: '헷갈리기 쉬운 쌍: し와 す, さ와 ざ(탁음 미리 보기).',
        es: 'Fácil de confundir: し y す; さ y ざ (adelanto de sonoridad).',
        'pt-BR': 'Fácil de confundir: し e す; さ e ざ (prévia dos sons sonoros).',
      },
    ],
    links: [
      { tab: 'grid' },
      { tab: 'study', kanaId: 'h_sa' },
      { tab: 'writing', kanaId: 'h_sa' },
      { tab: 'confusable', groupId: 'cf_sa_chi' },
      { tab: 'confusable', groupId: 'cf_tsu_shi' },
    ],
    // TODO：規劃檔的驗收寫「易混辨析し–す一組完成」，但 confusableData 沒有 し–す
    // 專屬群組；這裡改為已有的 さ–ち、つ–し 兩組，待日後補群組再對回原寫法。
    acceptance: {
      'zh-TW': 'し、す聽音測驗全對；完成易混辨析（さ–ち、つ–し）。',
      'zh-CN': 'し、す听音测验全对；完成易混辨析（さ–ち、つ–し）。',
      en: 'Score full marks on the し / す listening quiz and finish the confusable drills (さ–ち, つ–し).',
      ko: 'し와 す 듣기 퀴즈를 모두 맞히고, 헷갈리기 쉬운 쌍 연습(さ–ち, つ–し)을 마치세요.',
      es: 'Obtenga la puntuación completa en el cuestionario de escucha de し y す, y termine los ejercicios de pares confusos (さ–ち, つ–し).',
      'pt-BR': 'Acerte todas as questões de escuta de し e す e complete os exercícios de pares que confundem (さ–ち, つ–し).',
    },
  },
  {
    id: 'u4',
    title: {
      'zh-TW': '第 4 回：た行',
      'zh-CN': '第 4 回：た行',
      en: 'Lesson 4: T-row',
      ko: '제4과: 타행',
      es: 'Lección 4: fila T',
      'pt-BR': 'Lição 4: fileira T',
    },
    subtitle: {
      'zh-TW': 'ち、つ的羅馬字最容易寫錯',
      'zh-CN': 'ち、つ的罗马字最容易写错',
      en: 'The romaji for ち and つ is the easiest to misspell',
      ko: 'ち와 つ의 로마자 표기가 가장 헷갈립니다',
      es: 'El romaji de ち y つ es el más fácil de escribir mal',
      'pt-BR': 'O roomaji de ち e つ é o mais fácil de errar',
    },
    kanaIds: ['h_ta', 'h_chi', 'h_tsu', 'h_te', 'h_to'],
    teachingPoints: [
      {
        'zh-TW': 'ち 讀 chi（不是 ti），つ 讀 tsu（不是 tu）；這兩個是初學者最常寫錯的羅馬字對應。',
        'zh-CN': 'ち 读 chi（不是 ti），つ 读 tsu（不是 tu）；这两个是初学者最常写错的罗马字对应。',
        en: 'ち is "chi" (not "ti") and つ is "tsu" (not "tu") — the two romaji spellings beginners get wrong most often.',
        ko: 'ち는 "chi"(ti가 아님), つ는 "tsu"(tu가 아님)로 읽습니다. 이 두 개는 초보자가 로마자 표기를 가장 자주 틀리는 소리입니다.',
        es: 'ち se lee "chi" (no "ti") y つ se lee "tsu" (no "tu"); son las dos correspondencias en romaji que los principiantes escriben mal con más frecuencia.',
        'pt-BR': 'O ち se lê "chi" (não "ti"), parecido com o "tia" em boa parte do Brasil; o つ se lê "tsu" (não "tu"). São as duas correspondências em roomaji que mais causam erro no começo.',
      },
      {
        'zh-TW': '易混：ち vs し、つ vs す。',
        'zh-CN': '易混：ち vs し、つ vs す。',
        en: 'Easy to mix up: ち vs し, and つ vs す.',
        ko: '헷갈리기 쉬운 쌍: ち와 し, つ와 す.',
        es: 'Fácil de confundir: ち y し; つ y す.',
        'pt-BR': 'Fácil de confundir: ち e し; つ e す.',
      },
    ],
    links: [
      { tab: 'grid' },
      { tab: 'study', kanaId: 'h_ta' },
      { tab: 'writing', kanaId: 'h_ta' },
      { tab: 'confusable', groupId: 'cf_tsu_shi' },
      { tab: 'confusable', groupId: 'cf_ta_na' },
    ],
    // TODO：規劃檔的驗收寫「易混辨析ち–し、つ–す完成」，但 confusableData 沒有
    // ち–し 專屬群組；這裡改為已有的 つ–し、た–な 兩組，待日後補群組再對回原寫法。
    acceptance: {
      'zh-TW': 'ち、つ認讀與聽音全對；完成易混辨析（つ–し、た–な）。',
      'zh-CN': 'ち、つ认读与听音全对；完成易混辨析（つ–し、た–な）。',
      en: 'Read and hear ち and つ correctly, and finish the confusable drills (つ–し, た–な).',
      ko: 'ち와 つ를 읽기와 듣기에서 모두 맞히고, 헷갈리기 쉬운 쌍 연습(つ–し, た–な)을 마치세요.',
      es: 'Lea y escuche ち y つ correctamente, y termine los ejercicios de pares confusos (つ–し, た–な).',
      'pt-BR': 'Leia e ouça ち e つ corretamente e complete os exercícios de pares que confundem (つ–し, た–な).',
    },
  },
  {
    id: 'u5',
    title: {
      'zh-TW': '第 5 回：な行',
      'zh-CN': '第 5 回：な行',
      en: 'Lesson 5: N-row',
      ko: '제5과: 나행',
      es: 'Lección 5: fila N',
      'pt-BR': 'Lição 5: fileira N',
    },
    subtitle: {
      'zh-TW': 'n 加上五個母音',
      'zh-CN': 'n 加上五个元音',
      en: 'N plus the five vowels',
      ko: 'n에 다섯 개의 모음',
      es: 'N más las cinco vocales',
      'pt-BR': 'N mais as cinco vogais',
    },
    kanaIds: ['h_na', 'h_ni', 'h_nu', 'h_ne', 'h_no'],
    teachingPoints: [
      {
        'zh-TW': 'な行發音單純，就是 n 加上母音；に 的發音接近 ni。',
        'zh-CN': 'な行发音单纯，就是 n 加上元音；に 的发音接近 ni。',
        en: 'The N-row is straightforward: n plus a vowel. に sounds like "ni".',
        ko: '나행은 단순합니다. n에 모음을 더한 것이고, に는 "ni"에 가깝게 발음합니다.',
        es: 'La fila N es sencilla: n más una vocal. に suena como "ni".',
        'pt-BR': 'A fileira N é simples: n mais uma vogal. O に soa como "ni".',
      },
      {
        'zh-TW': '預告：ん（撥音）在第 9 回正式教；な行的 n 不要跟ん混為一談。',
        'zh-CN': '预告：ん（拨音）在第 9 回正式教；な行的 n 不要跟ん混为一谈。',
        en: 'Preview: ん (the moraic nasal) is taught in Lesson 9 — don\'t confuse it with the n in the N-row.',
        ko: '미리 보기: ん(발음)은 제9과에서 정식으로 배웁니다. 나행의 n과 ん을 혼동하지 마세요.',
        es: 'Adelanto: ん (la nasal moraica) se estudia en la lección 9; no la confunda con la n de la fila N.',
        'pt-BR': 'Prévia: o ん (som nasal n) é estudado na lição 9; não o confunda com o n da fileira N.',
      },
      {
        'zh-TW': '例詞：なつ（夏）、にほん（日本）。',
        'zh-CN': '例词：なつ（夏）、にほん（日本）。',
        en: 'Example words: なつ (summer), にほん (Japan).',
        ko: '예: なつ(여름), にほん(일본).',
        es: 'Ejemplos: なつ (verano), にほん (Japón).',
        'pt-BR': 'Exemplos: なつ (natsu, verão), にほん (nihon, Japão).',
      },
    ],
    links: [
      { tab: 'grid' },
      { tab: 'study', kanaId: 'h_na' },
      { tab: 'writing', kanaId: 'h_na' },
      { tab: 'confusable', groupId: 'cf_ta_na' },
    ],
    acceptance: {
      'zh-TW': 'な行認讀全對。',
      'zh-CN': 'な行认读全对。',
      en: 'Read the whole N-row correctly.',
      ko: '나행을 모두 정확히 읽으세요.',
      es: 'Lea toda la fila N correctamente.',
      'pt-BR': 'Leia toda a fileira N corretamente.',
    },
  },
  {
    id: 'u6',
    title: {
      'zh-TW': '第 6 回：は行',
      'zh-CN': '第 6 回：は行',
      en: 'Lesson 6: H-row',
      ko: '제6과: 하행',
      es: 'Lección 6: fila H',
      'pt-BR': 'Lição 6: fileira H',
    },
    subtitle: {
      'zh-TW': 'ふ、ひ是本回的難音',
      'zh-CN': 'ふ、ひ是本回的难点音',
      en: 'The tricky sounds are ふ and ひ',
      ko: 'ふ와 ひ가 이번 과의 어려운 소리입니다',
      es: 'Los sonidos difíciles son ふ y ひ',
      'pt-BR': 'Os sons difíceis são ふ e ひ',
    },
    kanaIds: ['h_ha', 'h_hi', 'h_fu', 'h_he', 'h_ho'],
    teachingPoints: [
      {
        'zh-TW': 'ふ 不是英文 f：上下唇不碰牙齒，雙唇微收送氣，接近 hu。',
        'zh-CN': 'ふ 不是英文 f：上下唇不碰牙齿，双唇微收送气，接近 hu。',
        en: 'ふ is not the English "f": your upper teeth don\'t touch your lower lip — both lips stay slightly apart and let air through, close to "hu".',
        ko: 'ふ는 영어의 f가 아닙니다. 윗니가 아랫입술에 닿지 않고, 두 입술을 살짝 모으고 바람을 내보내며, "hu"에 가깝게 발음합니다.',
        es: 'ふ no es la "f" del inglés: los dientes superiores no tocan el labio inferior; junte los labios ligeramente y deje pasar el aire, como una "hu".',
        'pt-BR': 'O ふ não é o f do português: os dentes não tocam os lábios; deixe o ar passar entre os lábios levemente juntos, com som próximo de "hu".',
      },
      {
        'zh-TW': 'ひ 發音輕，接近德語 ich 的 ch，不要發成重音 hi。',
        'zh-CN': 'ひ 发音轻，接近德语 ich 的 ch，不要发成重音 hi。',
        en: 'ひ is light, close to the "ch" in German "ich" — don\'t stress it into a heavy "hee".',
        ko: 'ひ는 가볍게 발음합니다. 독일어 "ich"의 ch에 가깝고, 무거운 "히"로 발음하지 마세요.',
        es: 'ひ es suave, parecido a la "ch" del alemán "ich"; no lo pronuncie como una "ji" fuerte.',
        'pt-BR': 'O ひ é leve, com som [ç]; não o pronuncie como um "hi" forte.',
      },
      {
        'zh-TW': '預告：は 作助詞時讀 wa，正式講在文法階段，這裡先提一句就好。',
        'zh-CN': '预告：は 作助词时读 wa，正式讲在文法阶段，这里先提一句就好。',
        en: 'Preview: as a particle, は is read "wa". That is covered properly in grammar later — just note it for now.',
        ko: '미리 보기: は는 조사로 쓰일 때 "wa"로 읽습니다. 문법 단계에서 정식으로 배우니, 지금은 알아두기만 하세요.',
        es: 'Adelanto: como partícula, は se lee "wa". Se estudiará en la gramática más adelante; por ahora basta con anotarlo.',
        'pt-BR': 'Prévia: como partícula, o は se lê "wa". Isso será estudado na gramática; por enquanto, basta anotar.',
      },
      {
        'zh-TW': '易混：ふ vs ほ；は vs ば（濁音預告）。',
        'zh-CN': '易混：ふ vs ほ；は vs ば（浊音预告）。',
        en: 'Easy to mix up: ふ vs ほ, and は vs ば (voiced preview).',
        ko: '헷갈리기 쉬운 쌍: ふ와 ほ, は와 ば(탁음 미리 보기).',
        es: 'Fácil de confundir: ふ y ほ; は y ば (adelanto de sonoridad).',
        'pt-BR': 'Fácil de confundir: ふ e ほ; は e ば (prévia dos sons sonoros).',
      },
    ],
    links: [
      { tab: 'grid' },
      { tab: 'study', kanaId: 'h_ha' },
      { tab: 'writing', kanaId: 'h_ha' },
      { tab: 'confusable', groupId: 'cf_ha_ho' },
    ],
    acceptance: {
      'zh-TW': 'ふ、ひ聽音測驗全對。',
      'zh-CN': 'ふ、ひ听音测验全对。',
      en: 'Score full marks on the ふ / ひ listening quiz.',
      ko: 'ふ와 ひ 듣기 퀴즈를 모두 맞히세요.',
      es: 'Obtenga la puntuación completa en el cuestionario de escucha de ふ y ひ.',
      'pt-BR': 'Acerte todas as questões de escuta de ふ e ひ.',
    },
  },
  {
    id: 'u7',
    title: {
      'zh-TW': '第 7 回：ま行',
      'zh-CN': '第 7 回：ま行',
      en: 'Lesson 7: M-row',
      ko: '제7과: 마행',
      es: 'Lección 7: fila M',
      'pt-BR': 'Lição 7: fileira M',
    },
    subtitle: {
      'zh-TW': 'm 加上五個母音，順便複習前 6 行',
      'zh-CN': 'm 加上五个元音，顺便复习前 6 行',
      en: 'M plus the five vowels, plus a review of the first six rows',
      ko: 'm에 다섯 개의 모음, 앞의 6개 행 복습',
      es: 'M más las cinco vocales, con repaso de las seis primeras filas',
      'pt-BR': 'M mais as cinco vogais, com revisão das seis primeiras fileiras',
    },
    kanaIds: ['h_ma', 'h_mi', 'h_mu', 'h_me', 'h_mo'],
    teachingPoints: [
      {
        'zh-TW': 'ま行發音單純，m 加上母音；み 的 i 不要發成「咪」的長音。',
        'zh-CN': 'ま行发音单纯，m 加上元音；み 的 i 不要发成“咪”的长音。',
        en: 'The M-row is straightforward: m plus a vowel. Don\'t stretch the i in み into a long "mee".',
        ko: '마행은 단순합니다. m에 모음을 더한 것이고, み의 i를 길게 늘여서 발음하지 마세요.',
        es: 'La fila M es sencilla: m más una vocal. No alargue la i de み.',
        'pt-BR': 'A fileira M é simples: m mais uma vogal. Não alongue o i de み.',
      },
      {
        'zh-TW': '小複習：前 6 行（あ–は行）認讀抽測，錯的回頭補。',
        'zh-CN': '小复习：前 6 行（あ–は行）认读抽测，错的回头补。',
        en: 'Quick review: quiz yourself on the first six rows (A through H); go back and patch any misses.',
        ko: '작은 복습: 앞의 6개 행(아–하행)을 골고루 읽어 보고, 틀린 부분은 돌아가서 보완하세요.',
        es: 'Pequeño repaso: póngase a prueba leyendo las seis primeras filas (A a H); repase lo que falle.',
        'pt-BR': 'Pequena revisão: teste a leitura das seis primeiras fileiras (A a H) e volte para reforçar o que errar.',
      },
      {
        'zh-TW': '例詞：まち（町）、みず（水）。',
        'zh-CN': '例词：まち（町）、みず（水）。',
        en: 'Example words: まち (town), みず (water).',
        ko: '예: まち(마을), みず(물).',
        es: 'Ejemplos: まち (pueblo), みず (agua).',
        'pt-BR': 'Exemplos: まち (machi, cidade), みず (mizu, água).',
      },
    ],
    links: [
      { tab: 'grid' },
      { tab: 'study', kanaId: 'h_ma' },
      { tab: 'writing', kanaId: 'h_ma' },
      { tab: 'confusable', groupId: 'cf_ma_ki' },
    ],
    acceptance: {
      'zh-TW': 'ま行認讀全對；前 6 行抽測 90% 以上。',
      'zh-CN': 'ま行认读全对；前 6 行抽测 90% 以上。',
      en: 'Read the whole M-row correctly and score at least 90% on the first-six-rows spot check.',
      ko: '마행을 모두 정확히 읽고, 앞의 6개 행 점검에서 90% 이상 맞히세요.',
      es: 'Lea toda la fila M correctamente y obtenga al menos el 90% en la prueba de las seis primeras filas.',
      'pt-BR': 'Leia toda a fileira M corretamente e acerte pelo menos 90% na revisão das seis primeiras fileiras.',
    },
  },
  {
    id: 'u8',
    title: {
      'zh-TW': '第 8 回：や行、ら行',
      'zh-CN': '第 8 回：や行、ら行',
      en: 'Lesson 8: Y-row and R-row',
      ko: '제8과: 야행, 라행',
      es: 'Lección 8: filas Y y R',
      'pt-BR': 'Lição 8: fileiras Y e R',
    },
    subtitle: {
      'zh-TW': 'や行只有 3 個音；ら行是彈舌音',
      'zh-CN': 'や行只有 3 个音；ら行是弹舌音',
      en: 'The Y-row has only three sounds; the R-row is a tongue tap',
      ko: '야행은 3개의 소리만 있고, 라행은 탄음입니다',
      es: 'La fila Y tiene solo tres sonidos; la fila R es un toque vibrante',
      'pt-BR': 'A fileira Y tem só três sons; a fileira R é um toque rápido da língua',
    },
    kanaIds: ['h_ya', 'h_yu', 'h_yo', 'h_ra', 'h_ri', 'h_ru', 'h_re', 'h_ro'],
    teachingPoints: [
      {
        'zh-TW': 'や行只有 3 個音（やゆよ），沒有 yi、ye。',
        'zh-CN': 'や行只有 3 个音（やゆよ），没有 yi、ye。',
        en: 'The Y-row has only three sounds (やゆよ) — there is no "yi" or "ye".',
        ko: '야행은 3개의 소리(やゆよ)만 있습니다. yi, ye는 없습니다.',
        es: 'La fila Y tiene solo tres sonidos (やゆよ); no existen "yi" ni "ye".',
        'pt-BR': 'A fileira Y tem só três sons (やゆよ); não existem "yi" nem "ye".',
      },
      {
        // ら行寫法：正面描述彈音 [ɾ]，不寫「不是 l」（Joko 1987 把 [l] 列為
        // 日語 r 的自由變體）。6 種語言版本都用同一寫法。
        'zh-TW': 'ら行 r 是彈音 [ɾ]：舌尖輕觸上顎一次，就像彈一下；初學先求接近，不要求一次到位。',
        'zh-CN': 'ら行 r 是弹音 [ɾ]：舌尖轻触上颚一次，就像弹一下；初学先求接近，不要求一次到位。',
        en: 'The R-row "r" is a tap [ɾ]: touch the tip of your tongue to the roof of your mouth once, like a quick flick. Getting close is enough at first.',
        ko: '라행의 r은 탄음 [ɾ]입니다. 혀끝을 입천장에 한 번 가볍게 튕기면 됩니다. 한국어의 ㄹ과 비슷하며, 처음에는 비슷하게만 내도 충분합니다.',
        es: 'La "r" de la fila R es un toque vibrante simple [ɾ]: toque el paladar una vez con la punta de la lengua, como la r simple del español (como en "caro"). Al principio basta con acercarse al sonido.',
        'pt-BR': 'O som de ら é um toque rápido da ponta da língua no céu da boca [ɾ], parecido com o r de "caro" em boa parte do Brasil. No começo, basta se aproximar do som.',
      },
      {
        'zh-TW': '易混：ら行 vs だ行；や vs ゆ。',
        'zh-CN': '易混：ら行 vs だ行；や vs ゆ。',
        en: 'Easy to mix up: R-row vs D-row, and や vs ゆ.',
        ko: '헷갈리기 쉬운 쌍: 라행과 다행, や와 ゆ.',
        es: 'Fácil de confundir: fila R y fila D; や y ゆ.',
        'pt-BR': 'Fácil de confundir: fileira R e fileira D; や e ゆ.',
      },
    ],
    links: [
      { tab: 'grid' },
      { tab: 'study', kanaId: 'h_ya' },
      { tab: 'writing', kanaId: 'h_ya' },
      { tab: 'confusable', groupId: 'cf_ra_u' },
      { tab: 'confusable', groupId: 'cf_ru_ro' },
    ],
    // TODO：規劃檔的驗收寫「易混辨析ら–だ完成」，但 confusableData 沒有 ら–だ
    // 專屬群組；這裡改為已有的 ら–う、る–ろ 兩組，待日後補群組再對回原寫法。
    acceptance: {
      'zh-TW': 'ら行聽音測驗全對；完成易混辨析（ら–う、る–ろ）。',
      'zh-CN': 'ら行听音测验全对；完成易混辨析（ら–う、る–ろ）。',
      en: 'Score full marks on the R-row listening quiz and finish the confusable drills (ら–う, る–ろ).',
      ko: '라행 듣기 퀴즈를 모두 맞히고, 헷갈리기 쉬운 쌍 연습(ら–う, る–ろ)을 마치세요.',
      es: 'Obtenga la puntuación completa en el cuestionario de escucha de la fila R y termine los ejercicios de pares confusos (ら–う, る–ろ).',
      'pt-BR': 'Acerte todas as questões de escuta da fileira R e complete os exercícios de pares que confundem (ら–う, る–ろ).',
    },
  },
  {
    id: 'u9',
    title: {
      'zh-TW': '第 9 回：わ行、ん（撥音）',
      'zh-CN': '第 9 回：わ行、ん（拨音）',
      en: 'Lesson 9: W-row and ん',
      ko: '제9과: 와행, ん(발음)',
      es: 'Lección 9: fila W y ん',
      'pt-BR': 'Lição 9: fileira W e ん',
    },
    subtitle: {
      'zh-TW': '46 個清音到齊',
      'zh-CN': '46 个清音到齐',
      en: 'All 46 basic sounds complete',
      ko: '46개의 청음이 모두 모였습니다',
      es: 'Los 46 sonidos básicos, completos',
      'pt-BR': 'Os 46 sons básicos, completos',
    },
    kanaIds: ['h_wa', 'h_wo', 'h_n'],
    teachingPoints: [
      {
        'zh-TW': 'わ行現代日語只剩 わ、を（wi、we、wo 不存在）。',
        'zh-CN': 'わ行现代日语只剩 わ、を（wi、we、wo 不存在）。',
        en: 'In modern Japanese the W-row has only わ and を — "wi", "we", and "wo" don\'t exist.',
        ko: '현대 일본어에서 와행은 わ와 を만 남았습니다(wi, we, wo는 없습니다).',
        es: 'En el japonés moderno, la fila W solo tiene わ y を; "wi", "we" y "wo" no existen.',
        'pt-BR': 'No japonês moderno, a fileira W só tem わ e を; "wi", "we" e "wo" não existem.',
      },
      {
        'zh-TW': 'を 作助詞時讀 o，本課先提一句。',
        'zh-CN': 'を 作助词时读 o，本课先提一句。',
        en: 'As a particle, を is read "o" — just note it for now.',
        ko: 'を는 조사로 쓰일 때 "o"로 읽습니다. 이번 과에서는 알아두기만 하세요.',
        es: 'Como partícula, を se lee "o"; por ahora basta con anotarlo.',
        'pt-BR': 'Como partícula, o を se lê "o"; por enquanto, basta anotar.',
      },
      {
        'zh-TW': 'ん 是唯一單獨的子音，發音跟著後面的音變：b、p、m 前面讀 m，t、d、n 前面讀 n，k、g 前面讀 ng，母音前面帶鼻音。',
        'zh-CN': 'ん 是唯一单独的辅音，发音跟着后面的音变：b、p、m 前面读 m，t、d、n 前面读 n，k、g 前面读 ng，元音前面带鼻音。',
        en: 'ん is the only standalone consonant, and its sound changes with what follows: "m" before b, p, m; "n" before t, d, n; "ng" before k, g; and a nasalized vowel before vowels.',
        ko: 'ん은 유일한 단독 자음이며, 뒤에 오는 소리에 따라 발음이 바뀝니다. b, p, m 앞에서는 m, t, d, n 앞에서는 n, k, g 앞에서는 ng로, 모음 앞에서는 비음으로 발음합니다.',
        es: 'ん es la única consonante independiente, y su sonido cambia según lo que sigue: "m" antes de b, p, m; "n" antes de t, d, n; "ng" antes de k, g; y una vocal nasalizada antes de vocales.',
        'pt-BR': 'O ん é a única consoante sozinha (som nasal n) e muda conforme o som seguinte: vira "m" antes de b, p, m; "n" antes de t, d, n; "ng" antes de k, g; e uma vogal nasal antes de vogais. Em português, o ん costuma soar como uma vogal nasal; no japonês, preste atenção ao som seguinte.',
      },
      {
        'zh-TW': '到此 46 個清音全部到齊。',
        'zh-CN': '到此 46 个清音全部到齐。',
        en: 'With this lesson, all 46 basic sounds are complete.',
        ko: '여기까지 46개의 청음이 모두 모였습니다.',
        es: 'Con esta lección, los 46 sonidos básicos están completos.',
        'pt-BR': 'Com esta lição, os 46 sons básicos estão completos.',
      },
    ],
    links: [
      { tab: 'grid' },
      { tab: 'study', kanaId: 'h_wa' },
      { tab: 'writing', kanaId: 'h_wa' },
      { tab: 'confusable', groupId: 'cf_ne_re_wa' },
      { tab: 'review' },
    ],
    acceptance: {
      'zh-TW': '46 清音綜合測驗 90% 以上；SRS 到期清零。',
      'zh-CN': '46 清音综合测验 90% 以上；SRS 到期清零。',
      en: 'Score at least 90% on the 46-sound comprehensive quiz and clear all due SRS reviews.',
      ko: '46개 청음 종합 퀴즈에서 90% 이상 맞히고, 기한이 된 SRS 복습을 모두 비우세요.',
      es: 'Obtenga al menos el 90% en el cuestionario general de los 46 sonidos y ponga al día todas las revisiones SRS vencidas.',
      'pt-BR': 'Acerte pelo menos 90% no questionário geral dos 46 sons e coloque em dia todas as revisões do SRS.',
    },
  },
  {
    id: 'u10',
    title: {
      'zh-TW': '第 10 回：濁音、半濁音',
      'zh-CN': '第 10 回：浊音、半浊音',
      en: 'Lesson 10: Voiced and semi-voiced sounds',
      ko: '제10과: 탁음, 반탁음',
      es: 'Lección 10: sonidos sonoros y semisonoros',
      'pt-BR': 'Lição 10: sons sonoros e semissonoros',
    },
    subtitle: {
      'zh-TW': '濁點 ゛、半濁點 ゜',
      'zh-CN': '浊点 ゛、半浊点 ゜',
      en: 'Dakuten ゛ and handakuten ゜',
      ko: '탁점 ゛, 반탁점 ゜',
      es: 'Dakuten ゛ y handakuten ゜',
      'pt-BR': 'Dakuten ゛ e handakuten ゜',
    },
    kanaIds: DAKUTEN_HIRAGANA,
    teachingPoints: [
      {
        'zh-TW': '濁點 ゛：か→が、さ→ざ、た→だ、は→ば；半濁點 ゜：は→ぱ。',
        'zh-CN': '浊点 ゛：か→が、さ→ざ、た→だ、は→ば；半浊点 ゜：は→ぱ。',
        en: 'Dakuten ゛: か→が, さ→ざ, た→だ, は→ば. Handakuten ゜: は→ぱ.',
        ko: '탁점 ゛: か→が, さ→ざ, た→だ, は→ば. 반탁점 ゜: は→ぱ.',
        es: 'Dakuten ゛: か→が, さ→ざ, た→だ, は→ば. Handakuten ゜: は→ぱ.',
        'pt-BR': 'Dakuten ゛ (ten-ten): か→が, さ→ざ, た→だ, は→ば. Handakuten ゜ (maru): は→ぱ.',
      },
      {
        'zh-TW': '濁音是聲帶震動：手摸喉嚨，か不震、が會震，自己就能驗證。',
        'zh-CN': '浊音是声带振动：手摸喉咙，か不震、が会震，自己就能验证。',
        en: "Voiced sounds vibrate your vocal cords: touch your throat — か doesn't vibrate, が does. You can feel it yourself.",
        ko: '탁음은 성대가 진동하는 소리입니다. 목에 손을 대어 보세요. か는 진동하지 않고, が는 진동합니다. 직접 확인할 수 있습니다.',
        es: 'Los sonidos sonoros hacen vibrar las cuerdas vocales: toque su garganta; か no vibra, が sí. Puede comprobarlo usted mismo.',
        'pt-BR': 'Os sons sonoros vibram as cordas vocais: toque a garganta; o か não vibra, o が vibra. Dá para sentir sozinho.',
      },
      {
        'zh-TW': 'が行在東京腔常讀鼻濁音（ŋa），先知道有這回事，不要求模仿。',
        'zh-CN': 'が行在东京腔常读鼻浊音（ŋa），先知道有这回事，不要求模仿。',
        en: 'In Tokyo speech the G-row is often nasalized (ŋa). Just know it exists — no need to imitate it yet.',
        ko: '가행은 도쿄 말씨에서 종종 비탁음(ŋa)으로 발음됩니다. 그런 현상이 있다는 것만 알아두세요. 따라 할 필요는 없습니다.',
        es: 'En el habla de Tokio, la fila G suele nasalizarse (ŋa). Basta con saber que existe; no hace falta imitarla todavía.',
        'pt-BR': 'Na fala de Tóquio, a fileira G costuma ser nasalizada (ŋa). Basta saber que isso existe; não é preciso imitar por enquanto.',
      },
      {
        'zh-TW': '易混：は行 vs ば行 vs ぱ行；か行 vs が行。',
        'zh-CN': '易混：は行 vs ば行 vs ぱ行；か行 vs が行。',
        en: 'Easy to mix up: H-row vs B-row vs P-row, and K-row vs G-row.',
        ko: '헷갈리기 쉬운 쌍: 하행과 바행, 파행; 카행과 가행.',
        es: 'Fácil de confundir: fila H, fila B y fila P; fila K y fila G.',
        'pt-BR': 'Fácil de confundir: fileira H, fileira B e fileira P; fileira K e fileira G.',
      },
    ],
    // 書寫練習只支援平假名基本音（WritingPracticeView 用 HIRAGANA_DATA），
    // 濁音／半濁音沒有書寫連結；濁音也沒有專屬易混群組。
    links: [
      { tab: 'grid' },
      { tab: 'study', kanaId: 'hd_ga' },
      { tab: 'special' },
    ],
    // TODO：規劃檔的驗收寫「易混辨析は–ば–ぱ完成」，但 confusableData 沒有
    // は–ば–ぱ 專屬群組；驗收先只寫認讀與聽音，待日後補群組再補回。
    acceptance: {
      'zh-TW': '濁音、半濁音認讀與聽音全對。',
      'zh-CN': '浊音、半浊音认读与听音全对。',
      en: 'Read and hear all voiced and semi-voiced sounds correctly.',
      ko: '탁음과 반탁음을 읽기와 듣기에서 모두 맞히세요.',
      es: 'Lea y escuche correctamente todos los sonidos sonoros y semisonoros.',
      'pt-BR': 'Leia e ouça corretamente todos os sons sonoros e semissonoros.',
    },
  },
  {
    id: 'u11',
    title: {
      'zh-TW': '第 11 回：長音',
      'zh-CN': '第 11 回：长音',
      en: 'Lesson 11: Long vowels',
      ko: '제11과: 장음',
      es: 'Lección 11: vocales largas',
      'pt-BR': 'Lição 11: vogal longa',
    },
    subtitle: {
      'zh-TW': '長音不是新假名，是「音拉長一拍」',
      'zh-CN': '长音不是新假名，是“音拉长一拍”',
      en: 'A long vowel is not a new kana — it is a sound held one beat longer',
      ko: '장음은 새로운 가나가 아니라, 소리를 한 박자 더 길게 내는 것입니다',
      es: 'Una vocal larga no es un kana nuevo: es un sonido que dura un tiempo más',
      'pt-BR': 'A vogal longa não é um kana novo: é um som sustentado por um tempo a mais (uma mora)',
    },
    kanaIds: [],
    teachingPoints: [
      {
        'zh-TW': '長音符號是「ー」（片假名常用）或母音重複（平假名常用）：おばあさん、ビール。',
        'zh-CN': '长音符号是“ー”（片假名常用）或元音重复（平假名常用）：おばあさん、ビール。',
        en: 'Long vowels are written with ー (common in katakana) or by repeating the vowel (common in hiragana): おばあさん, ビール.',
        ko: '장음은 ー(가타카나에서 주로 사용)나 모음 반복(히라가나에서 주로 사용)으로 표시합니다. おばあさん, ビール.',
        es: 'Las vocales largas se escriben con ー (habitual en katakana) o repitiendo la vocal (habitual en hiragana): おばあさん, ビール.',
        'pt-BR': 'A vogal longa se escreve com ー (comum no katakana) ou com a vogal repetida (comum no hiragana): おばあさん, ビール.',
      },
      {
        'zh-TW': '長短音會改變意思：おばさん（阿姨）vs おばあさん（祖母）。',
        'zh-CN': '长短音会改变意思：おばさん（阿姨）vs おばあさん（祖母）。',
        en: 'Vowel length changes meaning: おばさん (aunt) vs おばあさん (grandmother).',
        ko: '장단음은 뜻을 바꿉니다. おばさん(이모)과 おばあさん(할머니).',
        es: 'La duración cambia el significado: おばさん (tía) frente a おばあさん (abuela).',
        'pt-BR': 'O comprimento da vogal muda o sentido: おばさん (tia) e おばあさん (avó).',
      },
      {
        'zh-TW': '拍節感：長音佔一拍，日語是拍節語言；本課建立「一拍」的感覺。',
        'zh-CN': '拍节感：长音占一拍，日语是拍节语言；本课建立“一拍”的感觉。',
        en: 'Sense of beats: a long vowel takes one beat. Japanese is a mora-timed language; this lesson builds your feel for one beat.',
        ko: '박자 감각: 장음은 한 박자를 차지합니다. 일본어는 박자 언어입니다. 이번 과에서는 한 박자의 감각을 기릅니다.',
        es: 'Sentido del ritmo: una vocal larga ocupa un tiempo (mora). El japonés es una lengua de ritmo moraico; esta lección desarrolla su sentido de un tiempo.',
        'pt-BR': 'Senso de ritmo: uma vogal longa ocupa uma mora (unidade de tempo; aprox. uma sílaba). O japonês é uma língua de ritmo moraico; esta lição desenvolve o senso de uma mora.',
      },
      {
        'zh-TW': '易混：短音 vs 長音對照聽辨；えい、ええ 的聽感差異（參考規格書 D-19）。',
        'zh-CN': '易混：短音 vs 长音对照听辨；えい、ええ 的听感差异（参考规格书 D-19）。',
        en: 'Easy to mix up: short vs long vowel contrasts; the listening difference between えい and ええ (see spec D-19).',
        ko: '헷갈리기 쉬운 쌍: 단음과 장음의 대비 듣기, えい와 ええ의 청취 차이(스펙 D-19 참고).',
        es: 'Fácil de confundir: el contraste entre vocales cortas y largas; la diferencia auditiva entre えい y ええ (véase la especificación D-19).',
        'pt-BR': 'Fácil de confundir: o contraste entre vogais curtas e longas; a diferença auditiva entre えい e ええ (ver a especificação D-19).',
      },
    ],
    // 本單元沒有對應假名；書寫練習不支援長音，寫作連結留空。
    links: [{ tab: 'grid' }, { tab: 'study' }, { tab: 'special' }],
    acceptance: {
      'zh-TW': '長音聽辨測驗 90% 以上。',
      'zh-CN': '长音听辨测验 90% 以上。',
      en: 'Score at least 90% on the long-vowel listening quiz.',
      ko: '장음 듣기 퀴즈에서 90% 이상 맞히세요.',
      es: 'Obtenga al menos el 90% en el cuestionario de escucha de vocales largas.',
      'pt-BR': 'Acerte pelo menos 90% no questionário de escuta de vogais longas.',
    },
  },
  {
    id: 'u12',
    title: {
      'zh-TW': '第 12 回：促音、拗音',
      'zh-CN': '第 12 回：促音、拗音',
      en: 'Lesson 12: Sokuon and yōon',
      ko: '제12과: 촉음, 요음',
      es: 'Lección 12: consonantes dobles y sonidos contraídos',
      'pt-BR': 'Lição 12: consoante dobrada e yoon',
    },
    subtitle: {
      'zh-TW': '促音是「停一拍」，拗音是「小字」',
      'zh-CN': '促音是“停一拍”，拗音是“小字”',
      en: 'Sokuon is "a beat of silence"; yōon is written with a small kana',
      ko: '촉음은 "한 박자 쉼", 요음은 "작은 글자"입니다',
      es: 'La consonante doble es "una pausa de un tiempo"; el sonido contraído se escribe con un kana pequeño',
      'pt-BR': 'A consoante dobrada é "uma pausa de um tempo"; o yoon se escreve com um kana pequeno',
    },
    kanaIds: YOUON_HIRAGANA,
    teachingPoints: [
      {
        'zh-TW': '促音：小さい「っ」佔一拍，後面子音停頓一拍再發：がっこう（學校）、きって（郵票）。',
        'zh-CN': '促音：小“っ”占一拍，后面辅音停顿一拍再发：がっこう（学校）、きって（邮票）。',
        en: 'Sokuon: the small っ takes one beat — pause one beat, then release the next consonant: がっこう (school), きって (stamp).',
        ko: '촉음: 작은 っ는 한 박자를 차지합니다. 한 박자 쉰 뒤 다음 자음을 발음합니다. がっこう(학교), きって(우표).',
        es: 'Consonante doble: la っ pequeña ocupa un tiempo; haga una pausa de un tiempo y luego pronuncie la consonante siguiente: がっこう (escuela), きって (sello).',
        'pt-BR': 'Consoante dobrada: o っ pequeno ocupa uma mora (unidade de tempo); faça uma pausa de uma mora e depois pronuncie a consoante seguinte: がっこう (escola), きって (selo).',
      },
      {
        'zh-TW': '拗音：い段假名加上小さい「ゃ・ゅ・ょ」，一個音節：きゃ（不讀 ki-ya）、しゅ（不讀 shi-yu）。',
        'zh-CN': '拗音：い段假名加上小“ゃ・ゅ・ょ”，一个音节：きゃ（不读 ki-ya）、しゅ（不读 shi-yu）。',
        en: 'Yōon: an i-row kana plus a small ゃ・ゅ・ょ forms ONE syllable: きゃ is not "ki-ya", しゅ is not "shi-yu".',
        ko: '요음: 이단 가나에 작은 ゃ・ゅ・ょ를 붙이면 하나의 음절이 됩니다. きゃ는 "키-야"가 아니고, しゅ는 "시-유"가 아닙니다.',
        es: 'Sonido contraído: un kana de la fila I más una ゃ・ゅ・ょ pequeña forma UNA sílaba: きゃ no es "ki-ya"; しゅ no es "shi-yu".',
        'pt-BR': 'Yoon: um kana da fileira I mais um ゃ・ゅ・ょ pequeno forma UMA sílaba: きゃ não é "ki-ya"; しゅ não é "shi-yu".',
      },
      {
        'zh-TW': '易混：きょ vs きよ（長度與音節數都不同）；っ 有無對照（がっこう vs がこう）。',
        'zh-CN': '易混：きょ vs きよ（长度与音节数都不同）；っ 有无对照（がっこう vs がこう）。',
        en: 'Easy to mix up: きょ vs きよ (different length and syllable count), and pairs with and without っ (がっこう vs がこう).',
        ko: '헷갈리기 쉬운 쌍: きょ와 きよ(길이와 음절 수가 다릅니다), っ의 유무(がっこう과 がこう).',
        es: 'Fácil de confundir: きょ y きよ (difieren en duración y en número de sílabas), y pares con y sin っ (がっこう y がこう).',
        'pt-BR': 'Fácil de confundir: きょ e きよ (diferem em duração e em número de sílabas), e pares com e sem っ (がっこう e がこう).',
      },
    ],
    links: [
      { tab: 'grid' },
      { tab: 'study', kanaId: 'hy_kya' },
      { tab: 'special' },
    ],
    // TODO：規劃檔的驗收寫「易混辨析きょ–きよ完成」，但 confusableData 沒有
    // きょ–きよ 專屬群組；驗收先只寫促音、拗音聽辨，待日後補群組再補回。
    acceptance: {
      'zh-TW': '促音、拗音聽辨測驗 90% 以上。',
      'zh-CN': '促音、拗音听辨测验 90% 以上。',
      en: 'Score at least 90% on the sokuon / yōon listening quiz.',
      ko: '촉음과 요음 듣기 퀴즈에서 90% 이상 맞히세요.',
      es: 'Obtenga al menos el 90% en el cuestionario de escucha de consonantes dobles y sonidos contraídos.',
      'pt-BR': 'Acerte pelo menos 90% no questionário de escuta de consoantes dobradas e yoon.',
    },
  },
  {
    id: 'u13',
    title: {
      'zh-TW': '第 13 回：聲調、輸入法、總複習',
      'zh-CN': '第 13 回：声调、输入法、总复习',
      en: 'Lesson 13: Pitch accent, input method, and final review',
      ko: '제13과: 성조, 입력법, 총복습',
      es: 'Lección 13: acento tonal, escritura y repaso final',
      'pt-BR': 'Lição 13: acento de altura, digitação e revisão final',
    },
    subtitle: {
      'zh-TW': '從「讀得出」到「用得出」',
      'zh-CN': '从“读得出”到“用得出”',
      en: 'From "can read it" to "can use it"',
      ko: '"읽을 수 있다"에서 "쓸 수 있다"로',
      es: 'De "saber leerlo" a "saber usarlo"',
      'pt-BR': 'De "saber ler" a "saber usar"',
    },
    kanaIds: [],
    teachingPoints: [
      {
        'zh-TW': '聲調（高低重音）：日語重音是音調高低，不是音量大小；はし 讀法不同會是「橋」或「筷子」。',
        'zh-CN': '声调（高低重音）：日语重音是音调高低，不是音量大小；はし 读法不同会是“桥”或“筷子”。',
        en: 'Pitch accent: Japanese stress is about pitch height, not loudness. はし can mean "bridge" or "chopsticks" depending on the pitch pattern.',
        ko: '성조(고저 악센트): 일본어 악센트는 음량의 크기가 아니라 음의 높낮이입니다. はし는 음의 높낮이에 따라 "다리"가 되기도 하고 "젓가락"이 되기도 합니다.',
        es: 'Acento tonal: en japonés, el acento es la altura del tono, no el volumen. はし puede significar "puente" o "palillos" según el patrón de tono.',
        'pt-BR': 'Acento de altura: no japonês, o acento é a altura do tom, não o volume. O はし pode significar "ponte" ou "hashi" conforme o padrão de tom.',
      },
      {
        'zh-TW': '輸入法：電腦／手機打羅馬字出假名（例：輸入 kya 出きゃ，輸入 nn 出ん）。',
        'zh-CN': '输入法：电脑／手机打罗马字出假名（例：输入 kya 出きゃ，输入 nn 出ん）。',
        en: 'Input method: type romaji on a computer or phone to get kana (type "kya" for きゃ, "nn" for ん).',
        ko: '입력법: 컴퓨터나 휴대폰에서 로마자를 입력하면 가나가 나옵니다("kya"를 입력하면 きゃ, "nn"을 입력하면 ん).',
        es: 'Escritura: escriba en romaji en el ordenador o el móvil para obtener kana (escriba "kya" para きゃ, "nn" para ん).',
        'pt-BR': 'Digitação: digite em roomaji no computador ou no celular para obter kana (digite "kya" para きゃ, "nn" para ん).',
      },
      {
        'zh-TW': '總複習：14 個單元認讀抽測；App 全表 208 音認讀 90% 以上，SRS 到期清零。',
        'zh-CN': '总复习：14 个单元认读抽测；App 全表 208 音认读 90% 以上，SRS 到期清零。',
        en: 'Final review: spot-check all 14 units; read at least 90% of the app\'s full 208-sound chart correctly and clear all due SRS reviews.',
        ko: '총복습: 14개 단원 전체를 골고루 읽어 봅니다. 앱 전체 표의 208개 음을 90% 이상 정확히 읽고, 기한이 된 SRS 복습을 모두 비우세요.',
        es: 'Repaso final: póngase a prueba con las 14 unidades; lea correctamente al menos el 90% de los 208 sonidos de la tabla completa de la app y ponga al día todas las revisiones SRS vencidas.',
        'pt-BR': 'Revisão final: teste a leitura das 14 unidades; leia corretamente pelo menos 90% dos 208 sons da tabela completa do aplicativo e coloque em dia todas as revisões do SRS.',
      },
    ],
    links: [
      { tab: 'grid' },
      { tab: 'study' },
      { tab: 'review' },
      { tab: 'shadowing' },
    ],
    acceptance: {
      'zh-TW': 'App 全表 208 音認讀 90% 以上，SRS 到期清零；畢業條件請見兩週計畫 Day 14。',
      'zh-CN': 'App 全表 208 音认读 90% 以上，SRS 到期清零；毕业条件请见两周计划 Day 14。',
      en: 'Read at least 90% of the app\'s full 208-sound chart correctly and clear all due SRS reviews; see Day 14 of the two-week plan for the graduation requirement.',
      ko: '앱 전체 표의 208개 음을 90% 이상 정확히 읽고, 기한이 된 SRS 복습을 모두 비우세요. 졸업 조건은 2주 계획 Day 14를 참고하세요.',
      es: 'Lea correctamente al menos el 90% de los 208 sonidos de la tabla completa de la app y ponga al día todas las revisiones SRS vencidas; consulte el día 14 del plan de dos semanas para el requisito de graduación.',
      'pt-BR': 'Leia corretamente pelo menos 90% dos 208 sons da tabela completa do aplicativo e coloque em dia todas as revisões do SRS; veja o dia 14 do plano de duas semanas para o requisito de conclusão.',
    },
  },
];
