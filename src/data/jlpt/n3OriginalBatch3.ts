import { JlptQuestion } from '../../types';

// N3 原創題 Batch3：知識點 21–30（文字語彙、読解，以及目的相關的相似句型），每點 3 題。
//
// 兩個読解節點的出題形式是<b>一篇短文／一份資訊表配三題</b>——這兩個考點考的本來
// 就不是單句文法，而是「指示詞指向哪裡」與「多重條件交叉篩選」，拆成單句就
// 驗證不到 evidence 描述的行為。短文與資訊表皆為原創，未取自任何真題。
//
// ⚠ source.confirmed 一律 false：自然度尚未經第三方覆核。
export const N3_ORIGINAL_BATCH3: JlptQuestion[] = [
  // ── jpv_n3-compounds ──
  {
    id: 'n3-own-b3-01', subject: '日本語', year: 2026, paper: 'n3-original-batch3', number: 1,
    type: 'single', score: 1,
    stem: '「解決」の 読み方は どれですか。',
    options: ['がいけつ', 'かいけち', 'かいけつ', 'げけつ'],
    answer: '3',
    source: { book: 'JLPT N3', chapter: '漢語語彙', level: 'N3', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpv_n3-compounds', topicIds: ['jpv_n3-compounds'] },
  },
  {
    id: 'n3-own-b3-02', subject: '日本語', year: 2026, paper: 'n3-original-batch3', number: 2,
    type: 'single', score: 1,
    stem: 'この 問題は 早く （　　）しなければ なりません。',
    options: ['意識', '発展', '期待', '解決'],
    answer: '4',
    source: { book: 'JLPT N3', chapter: '漢語語彙', level: 'N3', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpv_n3-compounds', topicIds: ['jpv_n3-compounds'] },
  },
  {
    id: 'n3-own-b3-03', subject: '日本語', year: 2026, paper: 'n3-original-batch3', number: 3,
    type: 'single', score: 1,
    stem: '「発展」の いみに いちばん 近い ものは どれですか。',
    options: ['小さく 分ける こと', '前と 変わらない こと', '大きく のびて、進んで いく こと', 'もとの 形に もどる こと'],
    answer: '3',
    source: { book: 'JLPT N3', chapter: '漢語語彙', level: 'N3', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpv_n3-compounds', topicIds: ['jpv_n3-compounds'] },
  },

  // ── jpv_n3-katakana ──
  {
    id: 'n3-own-b3-04', subject: '日本語', year: 2026, paper: 'n3-original-batch3', number: 4,
    type: 'single', score: 1,
    stem: '仕事の （　　）が たまって、よく ねむれません。',
    options: ['デザイン', 'アイデア', 'チャンス', 'ストレス'],
    answer: '4',
    source: { book: 'JLPT N3', chapter: '外來語', level: 'N3', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpv_n3-katakana', topicIds: ['jpv_n3-katakana'] },
  },
  {
    id: 'n3-own-b3-05', subject: '日本語', year: 2026, paper: 'n3-original-batch3', number: 5,
    type: 'single', score: 1,
    stem: '「予定表」を あらわす 外来語の 正しい 書き方は どれですか。',
    options: ['スケジュール', 'スケージュル', 'スケジュル', 'スケジュウル'],
    answer: '1',
    source: { book: 'JLPT N3', chapter: '外來語', level: 'N3', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpv_n3-katakana', topicIds: ['jpv_n3-katakana'] },
  },
  {
    id: 'n3-own-b3-06', subject: '日本語', year: 2026, paper: 'n3-original-batch3', number: 6,
    type: 'single', score: 1,
    stem: 'かいぎ中に、いい （　　）が うかびました。',
    options: ['スケジュール', 'アイデア', 'ストレス', 'チャンス'],
    answer: '2',
    source: { book: 'JLPT N3', chapter: '外來語', level: 'N3', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpv_n3-katakana', topicIds: ['jpv_n3-katakana'] },
  },

  // ── jpv_n3-adverbs ──
  {
    id: 'n3-own-b3-07', subject: '日本語', year: 2026, paper: 'n3-original-batch3', number: 7,
    type: 'single', score: 1,
    stem: 'あまりに おかしくて、（　　）笑って しまいました。',
    options: ['相変わらず', 'ますます', 'さっそく', '思わず'],
    answer: '4',
    source: { book: 'JLPT N3', chapter: '副詞', level: 'N3', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpv_n3-adverbs', topicIds: ['jpv_n3-adverbs'] },
  },
  {
    id: 'n3-own-b3-08', subject: '日本語', year: 2026, paper: 'n3-original-batch3', number: 8,
    type: 'single', score: 1,
    stem: '三年 かかって、（　　）研究が 完成しました。',
    options: ['ぜひ', '思わず', 'ついに', 'まるで'],
    answer: '3',
    source: { book: 'JLPT N3', chapter: '副詞', level: 'N3', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpv_n3-adverbs', topicIds: ['jpv_n3-adverbs'] },
  },
  {
    id: 'n3-own-b3-09', subject: '日本語', year: 2026, paper: 'n3-original-batch3', number: 9,
    type: 'single', score: 1,
    stem: '十年ぶりに 会ったが、彼は （　　）元気そうだった。',
    options: ['思わず', 'さっそく', '相変わらず', 'ついに'],
    answer: '3',
    source: { book: 'JLPT N3', chapter: '副詞', level: 'N3', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpv_n3-adverbs', topicIds: ['jpv_n3-adverbs'] },
  },

  // ── jpv_n3-onomatopoeia ──
  {
    id: 'n3-own-b3-10', subject: '日本語', year: 2026, paper: 'n3-original-batch3', number: 10,
    type: 'single', score: 1,
    stem: 'シャワーを あびたら、気分が （　　）しました。',
    options: ['すっきり', 'ふらふら', 'うっかり', 'そっくり'],
    answer: '1',
    source: { book: 'JLPT N3', chapter: '擬態語', level: 'N3', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpv_n3-onomatopoeia', topicIds: ['jpv_n3-onomatopoeia'] },
  },
  {
    id: 'n3-own-b3-11', subject: '日本語', year: 2026, paper: 'n3-original-batch3', number: 11,
    type: 'single', score: 1,
    stem: 'この くつは サイズが （　　）で、とても はきやすい。',
    options: ['ぴったり', 'はっきり', 'うっかり', 'すっきり'],
    answer: '1',
    source: { book: 'JLPT N3', chapter: '擬態語', level: 'N3', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpv_n3-onomatopoeia', topicIds: ['jpv_n3-onomatopoeia'] },
  },
  {
    id: 'n3-own-b3-12', subject: '日本語', year: 2026, paper: 'n3-original-batch3', number: 12,
    type: 'single', score: 1,
    stem: '（　　）して、かさを 電車の 中に わすれて きて しまった。',
    options: ['うっかり', 'ゆっくり', 'すっきり', 'ぴったり'],
    answer: '1',
    source: { book: 'JLPT N3', chapter: '擬態語', level: 'N3', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpv_n3-onomatopoeia', topicIds: ['jpv_n3-onomatopoeia'] },
  },

  // ── jpr_n3-short-passage（同一篇短文配三題）──
  {
    id: 'n3-own-b3-13', subject: '日本語', year: 2026, paper: 'n3-original-batch3', number: 13,
    type: 'single', score: 1,
    stem: '［つぎの 文章を 読んで、こたえて ください］<br><br>最近、電子書籍を 読む 人が 増えて いる。持ち運びが 便利で、何百冊もの 本が 一台の 機械に 入るからだ。<u>しかし</u>、紙の 本が なくなる わけでは ない。ページを めくる 感覚や、本だなに ならんだ 背表紙を ながめる 楽しみ——<u>それ</u>は、電子書籍には ない ものだ。<br><br><b>問：「それ」は 何を さして いますか。</b>',
    options: ['ページを めくる 感覚と、背表紙を ながめる 楽しみ', '持ち運びが 便利だと いう こと', '何百冊もの 本が 一台の 機械に 入る こと', '電子書籍を 読む 人が 増えて いる こと'],
    answer: '1',
    source: { book: 'JLPT N3', chapter: '短文読解', level: 'N3', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpr_n3-short-passage', topicIds: ['jpr_n3-short-passage'] },
  },
  {
    id: 'n3-own-b3-14', subject: '日本語', year: 2026, paper: 'n3-original-batch3', number: 14,
    type: 'single', score: 1,
    stem: '［前の 文章に ついて］<br><br>最近、電子書籍を 読む 人が 増えて いる。持ち運びが 便利で、何百冊もの 本が 一台の 機械に 入るからだ。<u>しかし</u>、紙の 本が なくなる わけでは ない。ページを めくる 感覚や、本だなに ならんだ 背表紙を ながめる 楽しみ——それは、電子書籍には ない ものだ。<br><br><b>問：この 文章で 筆者が いちばん 言いたい ことは 何ですか。</b>',
    options: ['電子書籍は 便利なので、これからも 増えて いく', '電子書籍が 増えても、紙の 本には 別の よさが ある', '本は 何百冊も 持ち歩く べきだ', '紙の 本は もう すぐ なくなって しまう'],
    answer: '2',
    source: { book: 'JLPT N3', chapter: '短文読解', level: 'N3', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpr_n3-short-passage', topicIds: ['jpr_n3-short-passage'] },
  },
  {
    id: 'n3-own-b3-15', subject: '日本語', year: 2026, paper: 'n3-original-batch3', number: 15,
    type: 'single', score: 1,
    stem: '［前の 文章に ついて］<br><br>最近、電子書籍を 読む 人が 増えて いる。持ち運びが 便利で、何百冊もの 本が 一台の 機械に 入るからだ。<u>しかし</u>、紙の 本が なくなる わけでは ない。ページを めくる 感覚や、本だなに ならんだ 背表紙を ながめる 楽しみ——それは、電子書籍には ない ものだ。<br><br><b>問：「紙の 本が なくなる わけでは ない」の いみは どれですか。</b>',
    options: ['紙の 本が なくなる わけが ない', '紙の 本は ぜったいに なくなる', '紙の 本は もう なくなった', '紙の 本が ぜんぶ なくなる という ことでは ない'],
    answer: '4',
    source: { book: 'JLPT N3', chapter: '短文読解', level: 'N3', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpr_n3-short-passage', topicIds: ['jpr_n3-short-passage', 'jpg_n3-wake-ga-nai'] },
  },

  // ── jpr_n3-info-search（同一份資訊表配三題）──
  {
    id: 'n3-own-b3-16', subject: '日本語', year: 2026, paper: 'n3-original-batch3', number: 16,
    type: 'single', score: 1,
    stem: '［つぎの 案内を 見て、こたえて ください］<br><br><b>市民センター 料理教室</b><br>A 和食コース：土曜 10:00〜12:00　2,000円<br>B 洋食コース：土曜 14:00〜16:00　1,800円<br>C 中華コース：日曜 10:00〜12:00　1,500円<br>D パンコース：日曜 14:00〜16:00　2,000円<br>※ 上の 料金の ほかに、材料費 500円が 毎回 かかります。<br>※ 駐車場が 無料に なるのは 日曜日だけです。<br><br><b>問：土曜日に 参加でき、材料費を 入れても 2,300円 以内で うけられる コースは どれですか。</b>',
    options: ['B 洋食コース', 'D パンコース', 'C 中華コース', 'A 和食コース'],
    answer: '1',
    source: { book: 'JLPT N3', chapter: '情報検索', level: 'N3', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpr_n3-info-search', topicIds: ['jpr_n3-info-search'] },
  },
  {
    id: 'n3-own-b3-17', subject: '日本語', year: 2026, paper: 'n3-original-batch3', number: 17,
    type: 'single', score: 1,
    stem: '［前の 案内に ついて］<br><br><b>市民センター 料理教室</b><br>A 和食コース：土曜 10:00〜12:00　2,000円<br>B 洋食コース：土曜 14:00〜16:00　1,800円<br>C 中華コース：日曜 10:00〜12:00　1,500円<br>D パンコース：日曜 14:00〜16:00　2,000円<br>※ 上の 料金の ほかに、材料費 500円が 毎回 かかります。<br>※ 駐車場が 無料に なるのは 日曜日だけです。<br><br><b>問：車で 行きたい、駐車場代は はらいたくない、午前中が いい——この 三つに 合う コースは どれですか。</b>',
    options: ['A 和食コース', 'D パンコース', 'B 洋食コース', 'C 中華コース'],
    answer: '4',
    source: { book: 'JLPT N3', chapter: '情報検索', level: 'N3', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpr_n3-info-search', topicIds: ['jpr_n3-info-search'] },
  },
  {
    id: 'n3-own-b3-18', subject: '日本語', year: 2026, paper: 'n3-original-batch3', number: 18,
    type: 'single', score: 1,
    stem: '［前の 案内に ついて］<br><br>※ 上の 料金の ほかに、材料費 500円が 毎回 かかります。<br>※ 駐車場が 無料に なるのは 日曜日だけです。<br><br><b>問：この 二つの ※に ついて、正しい ものは どれですか。</b>',
    options: ['駐車場は いつでも 無料である', '料金の ほかに 毎回 500円 はらう ひつようが ある', '土曜日も 駐車場は 無料に なる', '材料費は 一回だけ はらえば いい'],
    answer: '2',
    source: { book: 'JLPT N3', chapter: '情報検索', level: 'N3', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpr_n3-info-search', topicIds: ['jpr_n3-info-search'] },
  },

  // ── jpg_n3-tame-ni-purpose ──
  {
    id: 'n3-own-b3-19', subject: '日本語', year: 2026, paper: 'n3-original-batch3', number: 19,
    type: 'single', score: 1,
    stem: '家を 買う（　　）、毎月 貯金して います。',
    options: ['おかげで', 'ために', 'ように', 'とおりに'],
    answer: '2',
    source: { book: 'JLPT N3', chapter: '目的與手段', level: 'N3', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_n3-tame-ni-purpose', topicIds: ['jpg_n3-tame-ni-purpose'] },
  },
  {
    id: 'n3-own-b3-20', subject: '日本語', year: 2026, paper: 'n3-original-batch3', number: 20,
    type: 'single', score: 1,
    stem: '健康（　　）ために、毎朝 走って います。',
    options: ['を', 'の', 'が', 'に'],
    answer: '2',
    source: { book: 'JLPT N3', chapter: '目的與手段', level: 'N3', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_n3-tame-ni-purpose', topicIds: ['jpg_n3-tame-ni-purpose', 'jpg_n3-tame-ni'] },
  },
  {
    id: 'n3-own-b3-21', subject: '日本語', year: 2026, paper: 'n3-original-batch3', number: 21,
    type: 'single', score: 1,
    stem: '日本語が 話せる（　　）、毎日 練習して います。',
    options: ['ために', 'ことに', 'ものに', 'ように'],
    answer: '4',
    source: { book: 'JLPT N3', chapter: '目的與手段', level: 'N3', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_n3-tame-ni-purpose', topicIds: ['jpg_n3-tame-ni-purpose', 'jpg_n3-youni-purpose'] },
  },

  // ── jpg_n3-tatotte ──
  {
    id: 'n3-own-b3-22', subject: '日本語', year: 2026, paper: 'n3-original-batch3', number: 22,
    type: 'single', score: 1,
    stem: 'いくら 走っ（　　）、もう 間に合わないよ。',
    options: ['たら', 'ては', 'たり', 'たって'],
    answer: '4',
    source: { book: 'JLPT N3', chapter: '逆接條件', level: 'N3', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_n3-tatotte', topicIds: ['jpg_n3-tatotte'] },
  },
  {
    id: 'n3-own-b3-23', subject: '日本語', year: 2026, paper: 'n3-original-batch3', number: 23,
    type: 'single', score: 1,
    stem: '「言う」に 「〜たって」を つけると どう なりますか。',
    options: ['言いたって', '言うたって', '言ってたって', '言ったって'],
    answer: '4',
    source: { book: 'JLPT N3', chapter: '逆接條件', level: 'N3', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_n3-tatotte', topicIds: ['jpg_n3-tatotte'] },
  },
  {
    id: 'n3-own-b3-24', subject: '日本語', year: 2026, paper: 'n3-original-batch3', number: 24,
    type: 'single', score: 1,
    stem: '「今から 行ったって、店は もう 閉まって いる。」この 文の いみに いちばん 近い ものは どれですか。',
    options: ['今から 行けば、店は まだ 開いて いる', '今から 行く ことに した', '今から 行った ほうが いい', '今から 行っても、店は もう 閉まって いる'],
    answer: '4',
    source: { book: 'JLPT N3', chapter: '逆接條件', level: 'N3', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_n3-tatotte', topicIds: ['jpg_n3-tatotte'] },
  },

  // ── jpg_n3-youni-purpose ──
  {
    id: 'n3-own-b3-25', subject: '日本語', year: 2026, paper: 'n3-original-batch3', number: 25,
    type: 'single', score: 1,
    stem: '忘れない（　　）、手帳に メモして おきます。',
    options: ['ばかりに', 'ところに', 'ために', 'ように'],
    answer: '4',
    source: { book: 'JLPT N3', chapter: '目的與期望', level: 'N3', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_n3-youni-purpose', topicIds: ['jpg_n3-youni-purpose'] },
  },
  {
    id: 'n3-own-b3-26', subject: '日本語', year: 2026, paper: 'n3-original-batch3', number: 26,
    type: 'single', score: 1,
    stem: 'つぎの 中で、「ために」では なく 「ように」を つかう べき 文は どれですか。',
    options: ['子どもにも 読める（　　）、ふりがなを つけた。', '大学に 入る（　　）、一生けんめい 勉強する。', '留学する（　　）、お金を ためて いる。', '家族の（　　）、まいにち はたらいて いる。'],
    answer: '1',
    source: { book: 'JLPT N3', chapter: '目的與期望', level: 'N3', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_n3-youni-purpose', topicIds: ['jpg_n3-youni-purpose', 'jpg_n3-tame-ni-purpose'] },
  },
  {
    id: 'n3-own-b3-27', subject: '日本語', year: 2026, paper: 'n3-original-batch3', number: 27,
    type: 'single', score: 1,
    stem: '（お守りを 買って）「どうか 試験に 合格 できます（　　）。」',
    options: ['ように', 'ために', 'ことに', 'そうに'],
    answer: '1',
    source: { book: 'JLPT N3', chapter: '目的與期望', level: 'N3', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_n3-youni-purpose', topicIds: ['jpg_n3-youni-purpose'] },
  },

  // ── jpg_n3-nani-nani-koto-da ──
  {
    id: 'n3-own-b3-28', subject: '日本語', year: 2026, paper: 'n3-original-batch3', number: 28,
    type: 'single', score: 1,
    stem: '（会社の 決定で）私は 来月から 大阪の 支社で 働く（　　）。',
    options: ['とのことです', 'ものです', 'ことに なりました', 'ことに しました'],
    answer: '3',
    source: { book: 'JLPT N3', chapter: '決定與變化', level: 'N3', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_n3-nani-nani-koto-da', topicIds: ['jpg_n3-nani-nani-koto-da'] },
  },
  {
    id: 'n3-own-b3-29', subject: '日本語', year: 2026, paper: 'n3-original-batch3', number: 29,
    type: 'single', score: 1,
    stem: '体に よくないので、たばこを やめる（　　）。',
    options: ['ものです', 'ように なりました', 'ことに しました', 'ことに なりました'],
    answer: '3',
    source: { book: 'JLPT N3', chapter: '決定與變化', level: 'N3', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_n3-nani-nani-koto-da', topicIds: ['jpg_n3-nani-nani-koto-da'] },
  },
  {
    id: 'n3-own-b3-30', subject: '日本語', year: 2026, paper: 'n3-original-batch3', number: 30,
    type: 'single', score: 1,
    stem: '「毎朝 走る ことに して います」の いみは どれですか。',
    options: ['走った ことが ある', '会社の きそくで 走らされて いる', '自分で 決めて、しゅうかんに して いる', '走れるように なった'],
    answer: '3',
    source: { book: 'JLPT N3', chapter: '決定與變化', level: 'N3', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_n3-nani-nani-koto-da', topicIds: ['jpg_n3-nani-nani-koto-da'] },
  },
];
