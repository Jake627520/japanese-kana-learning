// 易混假名組。
//
// 隨機抽卡練不到這個：ぬ 和 め 單獨出現時都認得，一起出現才會猶豫。
// 這裡把真正會互相干擾的字放在同一題裡對比，逼出「到底靠哪個特徵分辨」。
//
// 每組都附 distinguish（判斷點）——這是關鍵：不寫「它們很像」，
// 而是寫「看哪裡就能分出來」，否則練完還是靠感覺猜。
//
// 分組依據是真實混淆來源，不是隨便湊像的字：
//   形近（字形骨架幾乎相同）、鏡像（左右相反）、多寡一筆（差一橫/一點）
//   片假名的方向差（シ/ツ、ソ/ン 是初學者最大的坎）

import type { LocalizedText } from '../i18n/types';

export interface ConfusableGroup {
  id: string;
  members: string[];      // 該組假名的 id（對應 kanaData 各檔）
  distinguish: LocalizedText; // 判斷點：看哪裡就能分辨
  category: 'hiragana' | 'katakana';
  modality?: 'visual' | 'listening' | 'both';
}

export const CONFUSABLE_GROUPS: ConfusableGroup[] = [
  // ── 平假名：繞不繞圈 ──
  {
    id: 'cf_nu_me',
    members: ['h_nu', 'h_me'],
    distinguish: {
      'zh-TW': '最後一筆有沒有繞圈：ぬ 繞圈，め 直接收尾。這是唯一的判斷點。',
      'zh-CN': '最后一笔有没有绕圈：ぬ 绕圈，め 直接收尾。这是唯一的判断点。',
      'en': 'Does the last stroke end in a loop? ぬ loops, め just ends. This is the only thing to check.',
      'ko': '마지막 획이 고리를 그리는지 보세요. ぬ는 고리를 그리고, め는 그냥 끝나요. 이것 하나만 보면 돼요.',
      'es': '¿El último trazo hace un bucle? ぬ termina con un bucle; め termina sin él. Es el único detalle que las distingue.',
    },
    category: 'hiragana',
    modality: 'visual',
  },
  {
    id: 'cf_ru_ro',
    members: ['h_ru', 'h_ro'],
    distinguish: {
      'zh-TW': '尾端有沒有繞圈：る 繞圈，ろ 直接收。',
      'zh-CN': '尾端有没有绕圈：る 绕圈，ろ 直接收。',
      'en': 'Does the tail end in a loop? る loops, ろ just ends.',
      'ko': '끝부분에 고리가 있는지 보세요. る는 고리를 그리고, ろ는 그냥 끝나요.',
      'es': '¿Hay un bucle al final? る termina en bucle; ろ termina sin él.',
    },
    category: 'hiragana',
    modality: 'visual',
  },
  {
    id: 'cf_ne_re_wa',
    members: ['h_ne', 'h_re', 'h_wa'],
    distinguish: {
      'zh-TW': '左邊都有一豎，差別全在右半收尾：ね 繞圈、れ 往右上翹出去、わ 彎鉤不繞也不翹。',
      'zh-CN': '左边都有一竖，差别全在右半收尾：ね 绕圈、れ 往右上翘出去、わ 弯钩不绕也不翘。',
      'en': 'All three have a vertical stroke on the left. The difference is in how the right half ends: ね loops, れ flicks out to the upper right, and わ curves in a hook that neither loops nor flicks.',
      'ko': '셋 다 왼쪽에 세로획이 있고, 차이는 모두 오른쪽 끝에 있어요. ね는 고리를 그리고, れ는 오른쪽 위로 삐쳐 나가고, わ는 고리도 삐침도 없이 둥글게 구부러져요.',
      'es': 'Las tres tienen un trazo vertical a la izquierda; toda la diferencia está en cómo termina la mitad derecha: ね hace un bucle, れ sale hacia arriba a la derecha, わ es una curva que ni hace bucle ni sale hacia arriba.',
    },
    category: 'hiragana',
    modality: 'visual',
  },
  // ── 平假名：鏡像與多寡一筆 ──
  {
    id: 'cf_sa_chi',
    members: ['h_sa', 'h_chi'],
    distinguish: {
      'zh-TW': '左右鏡像：さ 的彎往左，ち 的彎往右。',
      'zh-CN': '左右镜像：さ 的弯往左，ち 的弯往右。',
      'en': 'They are mirror images: the curve of さ bulges to the left, the curve of ち bulges to the right.',
      'ko': '좌우 대칭이에요. さ는 굽은 부분이 왼쪽으로, ち는 오른쪽으로 열려 있어요.',
      'es': 'Son imágenes en espejo: la curva de さ sobresale hacia la izquierda; la de ち, hacia la derecha.',
    },
    category: 'hiragana',
    modality: 'visual',
  },
  {
    id: 'cf_ki_sa',
    members: ['h_ki', 'h_sa'],
    distinguish: {
      'zh-TW': '數橫線：き 兩橫，さ 只有一橫。',
      'zh-CN': '数横线：き 两横，さ 只有一横。',
      'en': 'Count the horizontal strokes: き has two, さ has only one.',
      'ko': '가로획 수를 세세요. き는 두 개, さ는 하나예요.',
      'es': 'Cuenta las líneas horizontales: き tiene dos; さ, solo una.',
    },
    category: 'hiragana',
    modality: 'visual',
  },
  {
    id: 'cf_ha_ho',
    members: ['h_ha', 'h_ho'],
    distinguish: {
      'zh-TW': '右邊幾橫：は 一橫，ほ 兩橫。',
      'zh-CN': '右边几横：は 一横，ほ 两横。',
      'en': 'Count the horizontal strokes on the right: は has one, ほ has two.',
      'ko': '오른쪽 가로획 수를 보세요. は는 하나, ほ는 두 개예요.',
      'es': 'Cuenta las líneas horizontales de la derecha: は tiene una; ほ, dos.',
    },
    category: 'hiragana',
    modality: 'visual',
  },
  {
    id: 'cf_ma_ki',
    members: ['h_ma', 'h_ki'],
    distinguish: {
      'zh-TW': '直筆有沒有繞圈：ま 繞圈，き 不繞圈（兩者都是兩橫）。',
      'zh-CN': '直笔有没有绕圈：ま 绕圈，き 不绕圈（两者都是两横）。',
      'en': 'Does the vertical stroke loop? ま loops, き does not (both have two horizontal strokes).',
      'ko': '세로획에 고리가 있는지 보세요. ま는 고리를 그리고, き는 그리지 않아요 (둘 다 가로획은 두 개예요).',
      'es': '¿El trazo vertical hace un bucle? ま sí; き no (las dos tienen dos líneas horizontales).',
    },
    category: 'hiragana',
    modality: 'visual',
  },
  {
    id: 'cf_su_mu',
    members: ['h_su', 'h_mu'],
    distinguish: {
      'zh-TW': '右上有沒有那一點：む 有，す 沒有。',
      'zh-CN': '右上有没有那一点：む 有，す 没有。',
      'en': 'Is there a dot at the upper right? む has one, す does not.',
      'ko': '오른쪽 위에 점이 있는지 보세요. む는 있고, す는 없어요.',
      'es': '¿Hay un punto arriba a la derecha? む lo tiene; す no.',
    },
    category: 'hiragana',
    modality: 'both',
  },
  {
    id: 'cf_a_o',
    members: ['h_a', 'h_o'],
    distinguish: {
      'zh-TW': '先看右上有沒有那一點（短筆）：お 右上有一點，あ 沒有。圈只當輔助線索：あ 的圈是另外一筆、穿過直豎畫成；お 的直豎往下直接轉成圈（同一筆）。',
      'zh-CN': '先看右上有没有那一点（短笔）：お 右上有一点，あ 没有。圈只作辅助线索：あ 的圈是另外一笔、穿过竖笔画成；お 的竖笔往下直接转成圈（同一笔）。',
      'en': 'Look for the dot first: お has a separate short stroke at the upper right, and あ has none. The loop is only a secondary hint: in あ it is a separate stroke that crosses the vertical; in お the vertical itself turns into the loop.',
      'ko': '먼저 오른쪽 위의 점(짧은 획)을 보세요. お에는 점이 있고, あ에는 없어요. 고리는 보조 단서일 뿐이에요. あ의 고리는 세로획을 가로지르는 별도의 획이고, お는 세로획이 그대로 이어져 고리가 돼요.',
      'es': 'Fíjate primero en el punto: お tiene un trazo corto separado arriba a la derecha y あ no. El bucle es solo una pista secundaria: en あ es un trazo aparte que cruza el vertical; en お, el propio vertical se convierte en el bucle.',
    },
    category: 'hiragana',
    modality: 'both',
  },
  {
    id: 'cf_tsu_shi',
    members: ['h_tsu', 'h_shi'],
    distinguish: {
      'zh-TW': '彎的方向：つ 是橫著的彎，し 是豎著往上勾。',
      'zh-CN': '弯的方向：つ 是横着的弯，し 是竖着往上勾。',
      'en': 'Direction of the curve: つ is a sideways curve, し runs down and hooks upward.',
      'ko': '굽은 방향을 보세요. つ는 가로로 누운 곡선이고, し는 세로로 내려와 위로 올려 쳐요.',
      'es': 'Dirección de la curva: つ es una curva horizontal; し es vertical y termina en un gancho hacia arriba.',
    },
    category: 'hiragana',
    modality: 'both',
  },
  {
    id: 'cf_ta_na',
    members: ['h_ta', 'h_na'],
    distinguish: {
      'zh-TW': '右下有沒有繞圈：な 繞圈；た 是兩筆分開的短橫，形狀像「こ」。',
      'zh-CN': '右下有没有绕圈：な 绕圈；た 是两笔分开的短横，形状像「こ」。',
      'en': 'Is there a loop at the lower right? な loops; た has two short separate horizontal strokes there, shaped like こ.',
      'ko': '오른쪽 아래에 고리가 있는지 보세요. な는 고리를 그리고, た는 짧은 가로획 두 개가 떨어져 있어요(こ 모양).',
      'es': '¿Hay un bucle abajo a la derecha? な sí; en た son dos trazos horizontales cortos y separados, con forma de こ.',
    },
    category: 'hiragana',
    modality: 'visual',
  },
  {
    id: 'cf_ko_ni',
    members: ['h_ko', 'h_ni'],
    distinguish: {
      'zh-TW': '左邊有沒有豎：に 有一長豎，こ 只有兩橫。',
      'zh-CN': '左边有没有竖：に 有一长竖，こ 只有两横。',
      'en': 'Is there a vertical stroke on the left? に has a long one, こ is just two horizontal strokes.',
      'ko': '왼쪽에 세로획이 있는지 보세요. に는 긴 세로획이 있고, こ는 가로획 두 개뿐이에요.',
      'es': '¿Hay un trazo vertical a la izquierda? に tiene uno largo; こ solo tiene dos líneas horizontales.',
    },
    category: 'hiragana',
    modality: 'visual',
  },
  {
    id: 'cf_ra_u',
    members: ['h_ra', 'h_u'],
    distinguish: {
      'zh-TW': '上面是撇還是點：ら 上面是短撇，う 上面是一點。',
      'zh-CN': '上面是撇还是点：ら 上面是短撇，う 上面是一点。',
      'en': 'Is the top a short slanted stroke or a dot? ら has a short slanted stroke, う has a dot.',
      'ko': '위쪽이 짧은 삐침인지 점인지 보세요. ら는 짧은 삐침, う는 점이에요.',
      'es': '¿Arriba hay un trazo corto o un punto? ら tiene un trazo corto inclinado; う, un punto.',
    },
    category: 'hiragana',
    modality: 'visual',
  },
  {
    id: 'cf_i_ri',
    members: ['h_i', 'h_ri'],
    distinguish: {
      'zh-TW': '右筆長度：り 的右筆明顯下拉且微彎，い 兩筆較短且分開。',
      'zh-CN': '右笔长度：り 的右笔明显下拉且微弯，い 两笔较短且分开。',
      'en': 'Length of the right stroke: in り it pulls clearly downward with a slight curve; in い both strokes are shorter and stand apart.',
      'ko': '오른쪽 획의 길이를 보세요. り는 오른쪽 획이 길게 내려오며 살짝 휘고, い는 두 획이 짧고 떨어져 있어요.',
      'es': 'Longitud del trazo derecho: en り baja claramente y se curva un poco; en い los dos trazos son más cortos y están separados.',
    },
    category: 'hiragana',
    modality: 'both',
  },
  // ── 片假名：方向差（最大的坎）──
  {
    id: 'cf_shi_tsu_kata',
    members: ['k_shi', 'k_tsu'],
    distinguish: {
      'zh-TW': '看筆畫方向，不是看點數（都是兩點）：シ 的點在左側、末筆由左下往右上挑；ツ 的點在上方、末筆由右上往左下撇。',
      'zh-CN': '看笔画方向，不是看点数（都是两点）：シ 的点在左侧、末笔由左下往右上挑；ツ 的点在上方、末笔由右上往左下撇。',
      'en': 'Look at the stroke direction, not the number of dots (both have two): シ has its dots on the left and its last stroke flicks up from lower left to upper right; ツ has its dots on top and its last stroke sweeps down from upper right to lower left.',
      'ko': '점 개수가 아니라 획의 방향을 보세요 (둘 다 점이 두 개예요). シ는 점이 왼쪽에 있고 마지막 획을 왼쪽 아래에서 오른쪽 위로 올려 쳐요. ツ는 점이 위쪽에 있고 마지막 획을 오른쪽 위에서 왼쪽 아래로 삐쳐 내려요.',
      'es': 'Fíjate en la dirección de los trazos, no en el número de puntos (ambas tienen dos): en シ los puntos están a la izquierda y el último trazo sube de abajo a la izquierda hacia arriba a la derecha; en ツ los puntos están arriba y el último trazo baja de arriba a la derecha hacia abajo a la izquierda.',
    },
    category: 'katakana',
    modality: 'both',
  },
  {
    id: 'cf_so_n_kata',
    members: ['k_so', 'k_n'],
    distinguish: {
      'zh-TW': '和 シ/ツ 同一個法則：ソ 由上往下撇，ン 由下往上挑。',
      'zh-CN': '和 シ/ツ 同一个法则：ソ 由上往下撇，ン 由下往上挑。',
      'en': 'Same rule as シ/ツ: ソ sweeps from top to bottom, ン flicks from bottom to top.',
      'ko': 'シ/ツ와 같은 규칙이에요. ソ는 위에서 아래로 삐쳐 내리고, ン은 아래에서 위로 올려 쳐요.',
      'es': 'La misma regla que シ/ツ: en ソ el trazo largo baja de arriba hacia abajo; en ン sube de abajo hacia arriba.',
    },
    category: 'katakana',
    modality: 'visual',
  },
  {
    id: 'cf_ku_wa_u_kata',
    members: ['k_ku', 'k_wa', 'k_u'],
    distinguish: {
      'zh-TW': 'ク 左上有一短撇；ワ 是方框缺右下；ウ 是 ワ 頂上多一點。',
      'zh-CN': 'ク 左上有一短撇；ワ 是方框缺右下；ウ 是 ワ 顶上多一点。',
      'en': 'ク has a short slanted stroke at the upper left; ワ is a box missing its lower right; ウ is ワ with an extra dot on top.',
      'ko': 'ク는 왼쪽 위에 짧은 삐침이 있어요. ワ는 오른쪽 아래가 빈 네모 모양이에요. ウ는 ワ 위에 점이 하나 더 있어요.',
      'es': 'ク tiene un trazo corto arriba a la izquierda; ワ es un recuadro sin la esquina inferior derecha; ウ es ワ con un punto encima.',
    },
    category: 'katakana',
    modality: 'visual',
  },
  {
    id: 'cf_su_nu_kata',
    members: ['k_su', 'k_nu'],
    distinguish: {
      'zh-TW': '收尾：ス 收成一撇，ヌ 多一捺像個叉。',
      'zh-CN': '收尾：ス 收成一撇，ヌ 多一捺像个叉。',
      'en': 'How it ends: ス ends in one sweep, ヌ adds a crossing stroke so it looks like an X.',
      'ko': '끝맺음을 보세요. ス는 삐침 하나로 끝나고, ヌ는 획이 하나 더 있어 X자처럼 교차해요.',
      'es': 'El final: ス termina en un trazo diagonal; ヌ añade otro trazo que lo cruza como una X.',
    },
    category: 'katakana',
    modality: 'visual',
  },
  {
    id: 'cf_te_ra_kata',
    members: ['k_te', 'k_ra'],
    distinguish: {
      'zh-TW': '橫線數：テ 兩橫加一豎，ラ 只有一橫加一撇。',
      'zh-CN': '横线数：テ 两横加一竖，ラ 只有一横加一撇。',
      'en': 'Count the horizontal strokes: テ has two plus a downstroke, ラ has only one plus a sweep.',
      'ko': '가로획 수를 보세요. テ는 가로획 두 개에 세로획 하나, ラ는 가로획 하나에 삐침 하나예요.',
      'es': 'Cuenta las líneas horizontales: テ tiene dos horizontales y un trazo vertical; ラ, solo una horizontal y un trazo curvo.',
    },
    category: 'katakana',
    modality: 'visual',
  },
  {
    id: 'cf_no_me_kata',
    members: ['k_no', 'k_me'],
    distinguish: {
      'zh-TW': 'ノ 只有一撇；メ 是兩筆交叉。',
      'zh-CN': 'ノ 只有一撇；メ 是两笔交叉。',
      'en': 'ノ is a single sweep; メ is two strokes that cross.',
      'ko': 'ノ는 삐침 하나뿐이고, メ는 두 획이 교차해요.',
      'es': 'ノ es un solo trazo diagonal; メ son dos trazos cruzados.',
    },
    category: 'katakana',
    modality: 'visual',
  },
  {
    id: 'cf_a_ma_kata',
    members: ['k_a', 'k_ma'],
    distinguish: {
      'zh-TW': 'ア 的橫在上、右邊往下撇；マ 是折線收在中間。',
      'zh-CN': 'ア 的横在上、右边往下撇；マ 是折线收在中间。',
      'en': 'ア has its horizontal at the top with the right side sweeping down; マ is a folded line that ends in the middle.',
      'ko': 'ア는 가로획이 위에 있고 오른쪽에서 아래로 삐쳐 내려요. マ는 꺾인 선이 가운데에서 끝나요.',
      'es': 'En ア la línea horizontal está arriba y el lado derecho baja en diagonal; マ es una línea quebrada que termina en el centro.',
    },
    category: 'katakana',
    modality: 'visual',
  },
];
