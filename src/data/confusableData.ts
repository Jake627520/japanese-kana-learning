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

export interface ConfusableGroup {
  id: string;
  members: string[];      // 該組假名的 id（對應 kanaData 各檔）
  distinguish: string;    // 判斷點：看哪裡就能分辨
  category: 'hiragana' | 'katakana';
}

export const CONFUSABLE_GROUPS: ConfusableGroup[] = [
  // ── 平假名：繞不繞圈 ──
  {
    id: 'cf_nu_me',
    members: ['h_nu', 'h_me'],
    distinguish: '最後一筆有沒有繞圈：ぬ 繞圈，め 直接收尾。這是唯一的判斷點。',
    category: 'hiragana',
  },
  {
    id: 'cf_ru_ro',
    members: ['h_ru', 'h_ro'],
    distinguish: '尾端有沒有繞圈：る 繞圈，ろ 直接收。',
    category: 'hiragana',
  },
  {
    id: 'cf_ne_re_wa',
    members: ['h_ne', 'h_re', 'h_wa'],
    distinguish: '左邊都有一豎，差別全在右半收尾：ね 繞圈、れ 往右上翹出去、わ 彎鉤不繞也不翹。',
    category: 'hiragana',
  },
  // ── 平假名：鏡像與多寡一筆 ──
  {
    id: 'cf_sa_chi',
    members: ['h_sa', 'h_chi'],
    distinguish: '左右鏡像：さ 的彎往左，ち 的彎往右。',
    category: 'hiragana',
  },
  {
    id: 'cf_ki_sa',
    members: ['h_ki', 'h_sa'],
    distinguish: '數橫線：き 兩橫，さ 只有一橫。',
    category: 'hiragana',
  },
  {
    id: 'cf_ha_ho',
    members: ['h_ha', 'h_ho'],
    distinguish: '右邊幾橫：は 一橫，ほ 兩橫。',
    category: 'hiragana',
  },
  {
    id: 'cf_ma_ki',
    members: ['h_ma', 'h_ki'],
    distinguish: '直筆有沒有繞圈：ま 繞圈，き 不繞圈（兩者都是兩橫）。',
    category: 'hiragana',
  },
  {
    id: 'cf_su_mu',
    members: ['h_su', 'h_mu'],
    distinguish: '右上有沒有那一點：む 有，す 沒有。',
    category: 'hiragana',
  },
  {
    id: 'cf_a_o',
    members: ['h_a', 'h_o'],
    distinguish: '圈在哪邊＋有無右上點：あ 圈在右下、無點；お 圈在左下、右上有一點。',
    category: 'hiragana',
  },
  {
    id: 'cf_tsu_shi',
    members: ['h_tsu', 'h_shi'],
    distinguish: '彎的方向：つ 是橫著的彎，し 是豎著往上勾。',
    category: 'hiragana',
  },
  {
    id: 'cf_ta_na',
    members: ['h_ta', 'h_na'],
    distinguish: '右下有沒有繞圈：な 繞圈，た 是兩筆分開的短撇。',
    category: 'hiragana',
  },
  {
    id: 'cf_ko_ni',
    members: ['h_ko', 'h_ni'],
    distinguish: '左邊有沒有豎：に 有一長豎，こ 只有兩橫。',
    category: 'hiragana',
  },
  {
    id: 'cf_ra_u',
    members: ['h_ra', 'h_u'],
    distinguish: '上面是撇還是點：ら 上面是短撇，う 上面是一點。',
    category: 'hiragana',
  },
  {
    id: 'cf_i_ri',
    members: ['h_i', 'h_ri'],
    distinguish: '右筆長度：り 的右筆明顯下拉且微彎，い 兩筆較短且分開。',
    category: 'hiragana',
  },
  // ── 片假名：方向差（最大的坎）──
  {
    id: 'cf_shi_tsu_kata',
    members: ['k_shi', 'k_tsu'],
    distinguish: '看筆畫方向，不是看點數（都是兩點）：シ 的點在左側、末筆由左下往右上挑；ツ 的點在上方、末筆由右上往左下撇。',
    category: 'katakana',
  },
  {
    id: 'cf_so_n_kata',
    members: ['k_so', 'k_n'],
    distinguish: '和 シ/ツ 同一個法則：ソ 由上往下撇，ン 由下往上挑。',
    category: 'katakana',
  },
  {
    id: 'cf_ku_wa_u_kata',
    members: ['k_ku', 'k_wa', 'k_u'],
    distinguish: 'ク 左上有一短撇；ワ 是方框缺右下；ウ 是 ワ 頂上多一點。',
    category: 'katakana',
  },
  {
    id: 'cf_su_nu_kata',
    members: ['k_su', 'k_nu'],
    distinguish: '收尾：ス 收成一撇，ヌ 多一捺像個叉。',
    category: 'katakana',
  },
  {
    id: 'cf_te_ra_kata',
    members: ['k_te', 'k_ra'],
    distinguish: '橫線數：テ 兩橫加一豎，ラ 只有一橫加一撇。',
    category: 'katakana',
  },
  {
    id: 'cf_no_me_kata',
    members: ['k_no', 'k_me'],
    distinguish: 'ノ 只有一撇；メ 是兩筆交叉。',
    category: 'katakana',
  },
  {
    id: 'cf_a_ma_kata',
    members: ['k_a', 'k_ma'],
    distinguish: 'ア 的橫在上、右邊往下撇；マ 是折線收在中間。',
    category: 'katakana',
  },
];
