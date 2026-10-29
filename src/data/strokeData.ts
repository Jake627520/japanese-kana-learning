// 平假名筆順資料。
//
// 刻意「不」內嵌 SVG 路徑座標：那類資料多半來自 KanjiVG 等外部專案（有各自的
// 授權條款），而且要逐字校對 46 組貝茲曲線，出錯了畫面上也看不出來。
// 這裡改記「筆畫數 + 每一畫的書寫要點」——這是可查證、可讀、也真正幫得上忙的
// 部分：初學者最常錯的是「筆順順序」與「起筆方向」，不是曲線的精確弧度。
//
// 書寫練習用「描紅 + 自己判斷」而不是自動判分：手寫相似度判斷做不準，
// 而錯誤的回饋比沒有回饋更傷（同 shadowing 不做發音評分的理由）。

import type { LocalizedText } from '../i18n/types';

export interface StrokeGuide {
  count: number;            // 筆畫數
  steps: LocalizedText[];   // 每一畫的書寫要點，順序即筆順
  note?: LocalizedText;     // 整體提醒（常見錯誤、易混字）
}

export const HIRAGANA_STROKES: Record<string, StrokeGuide> = {
  h_a: {
    count: 3,
    steps: [
      { 'zh-TW': '① 左上往右畫一短橫', 'zh-CN': '① 从左上往右画一短横', en: '① Short horizontal stroke from upper left to the right', ko: '① 왼쪽 위에서 오른쪽으로 짧은 가로획', es: '① Haz un trazo horizontal corto de arriba a la izquierda hacia la derecha' },
      { 'zh-TW': '② 從橫的中間往下畫一豎（略帶弧）', 'zh-CN': '② 从横的中间往下画一竖（略带弧度）', en: '② Vertical stroke down through the middle of the horizontal (slightly curved)', ko: '② 가로획 가운데를 지나 아래로 세로획 (약간 휘게)', es: '② Haz un trazo vertical hacia abajo por el centro del horizontal (ligeramente curvo)' },
      { 'zh-TW': '③ 從右側中段起筆，往左下斜拉穿過豎畫，再往右繞一個大圈，收在下方', 'zh-CN': '③ 从右侧中段起笔，往左下斜拉穿过竖画，再往右绕一个大圈，收在下方', en: '③ Start on the right side, slant down to the lower left across the vertical, then loop around to the right and finish at the bottom', ko: '③ 오른쪽 중간에서 시작해 세로획을 가로질러 왼쪽 아래로 비스듬히 내린 뒤, 오른쪽으로 크게 고리를 돌려 아래에서 마무리', es: '③ Empieza en el lado derecho, baja inclinado hacia la izquierda cruzando el vertical, luego haz un bucle amplio hacia la derecha y termina abajo' },
    ],
    note: { 'zh-TW': '和 お 最好認的差別是 お 右上多一點。另外 あ 的第三畫另起一筆，斜穿過豎畫再繞圈；お 的圈直接由豎畫轉出。', 'zh-CN': '和 お 最好认的区别是 お 右上多一点。另外 あ 的第三笔另起一笔，斜穿过竖画再绕圈；お 的圈直接由竖画转出。', en: 'The easiest way to tell it from お: お has a dot at the upper right. Also, the third stroke of あ is a separate stroke that crosses the vertical before looping; the loop of お grows straight out of its vertical.', ko: 'お와 가장 쉽게 구별하는 법은 お의 오른쪽 위 점이다. 또 あ의 세 번째 획은 따로 그어 세로획을 비스듬히 가로지른 뒤 고리를 돌고, お의 고리는 세로획에서 바로 이어진다.', es: 'Lo más fácil para distinguirla de お: お tiene un punto arriba a la derecha. Además, el tercer trazo de あ va aparte y cruza el vertical antes del bucle; el bucle de お sale directamente de su vertical.' },
  },
  h_i: {
    count: 2,
    steps: [
      { 'zh-TW': '① 左邊由上往下、末端往右上勾', 'zh-CN': '① 左边从上往下，末端往右上钩', en: '① Left stroke from top to bottom, hooking up to the right at the end', ko: '① 왼쪽에 위에서 아래로, 끝은 오른쪽 위로 갈고리', es: '① A la izquierda, traza de arriba abajo y termina con un gancho hacia arriba a la derecha' },
      { 'zh-TW': '② 右邊短豎，由上往下', 'zh-CN': '② 右边短竖，从上往下', en: '② Short vertical stroke on the right, top to bottom', ko: '② 오른쪽에 위에서 아래로 짧은 세로획', es: '② Haz un trazo vertical corto a la derecha, de arriba abajo' },
    ],
    note: { 'zh-TW': '兩畫分開，左長右短。', 'zh-CN': '两笔分开，左长右短。', en: 'The two strokes stay apart: the left one long, the right one short.', ko: '두 획은 떨어져 있고, 왼쪽이 길고 오른쪽이 짧다.', es: 'Los dos trazos van separados: el izquierdo largo y el derecho corto.' },
  },
  h_u: {
    count: 2,
    steps: [
      { 'zh-TW': '① 上方一小點（短橫）', 'zh-CN': '① 上方一小点（短横）', en: '① Small dot on top (a short horizontal)', ko: '① 위쪽에 작은 점 (짧은 가로획)', es: '① Haz un punto pequeño arriba (un horizontal corto)' },
      { 'zh-TW': '② 由左往右下轉一個大彎收筆', 'zh-CN': '② 从左往右下转一个大弯收笔', en: '② From the left toward the lower right in one big curve to finish', ko: '② 왼쪽에서 오른쪽 아래로 크게 휘어 마무리', es: '② Traza desde la izquierda hacia abajo a la derecha en una curva amplia y cierra' },
    ],
    note: { 'zh-TW': 'う 上面是一點；ら 上面是短撇。', 'zh-CN': 'う 上面是一点；ら 上面是短撇。', en: 'う has a dot on top; ら has a short sweep.', ko: 'う는 위가 점이고, ら는 위가 짧은 삐침이다.', es: 'う lleva un punto arriba; ら, un trazo oblicuo corto.' },
  },
  h_e: {
    count: 2,
    steps: [
      { 'zh-TW': '① 上方一短橫', 'zh-CN': '① 上方一短横', en: '① Short horizontal stroke on top', ko: '① 위쪽에 짧은 가로획', es: '① Haz un trazo horizontal corto arriba' },
      { 'zh-TW': '② 左側中段起筆往右一小段，折向左下斜拉，再往右下彎出，收成一個平底', 'zh-CN': '② 左侧中段起笔往右一小段，折向左下斜拉，再往右下弯出，收成一个平底', en: '② Start on the left at mid-height with a short move right, turn sharply down to the lower left, then curve out toward the lower right and end in a flat base', ko: '② 왼쪽 중간에서 오른쪽으로 조금 긋고 왼쪽 아래로 꺾어 내린 뒤, 오른쪽 아래로 휘어 평평한 밑바닥으로 마무리', es: '② Empieza a media altura a la izquierda con un tramo corto hacia la derecha, quiebra hacia abajo a la izquierda, luego curva hacia abajo a la derecha y cierra con una base plana' },
    ],
  },
  h_o: {
    count: 3,
    steps: [
      { 'zh-TW': '① 左上往右一短橫', 'zh-CN': '① 从左上往右一短横', en: '① Short horizontal stroke from upper left to the right', ko: '① 왼쪽 위에서 오른쪽으로 짧은 가로획', es: '① Haz un trazo horizontal corto de arriba a la izquierda hacia la derecha' },
      { 'zh-TW': '② 從橫中往下一豎並向左繞圈', 'zh-CN': '② 从横的中间往下一竖，并向左绕圈', en: '② Vertical stroke down through the middle of the horizontal, then a loop to the left', ko: '② 가로획 가운데를 지나 아래로 세로획, 이어서 왼쪽으로 고리', es: '② Haz un trazo vertical hacia abajo por el centro del horizontal y un bucle hacia la izquierda' },
      { 'zh-TW': '③ 右上補一點', 'zh-CN': '③ 右上补一点', en: '③ Dot added at the upper right', ko: '③ 오른쪽 위에 점 추가', es: '③ Añade un punto arriba a la derecha' },
    ],
    note: { 'zh-TW': 'お 有右上那一點，あ 沒有。', 'zh-CN': 'お 有右上那一点，あ 没有。', en: 'お has the dot at the upper right; あ does not.', ko: 'お는 오른쪽 위에 점이 있고, あ는 없다.', es: 'お lleva el punto de arriba a la derecha; あ no.' },
  },
  h_ka: {
    count: 3,
    steps: [
      { 'zh-TW': '① 左上起一橫，往右再轉折往下，末端往左上勾', 'zh-CN': '① 从左上起一横，往右再转折往下，末端往左上钩', en: '① Horizontal stroke from the left that turns down, ending in a hook up to the left', ko: '① 왼쪽에서 가로획을 긋고 꺾어 아래로 내린 뒤, 끝은 왼쪽 위로 갈고리', es: '① Haz un trazo horizontal desde la izquierda que gira hacia abajo y termina con un gancho hacia arriba a la izquierda' },
      { 'zh-TW': '② 由上方往左下的長撇（穿過第一畫）', 'zh-CN': '② 从上方往左下的长撇（穿过第一笔）', en: '② Long sweep from the top down to the lower left (crossing the first stroke)', ko: '② 위에서 왼쪽 아래로 긴 삐침 (첫 획을 관통)', es: '② Haz un trazo oblicuo largo desde arriba hacia abajo a la izquierda (cruzando el primer trazo)' },
      { 'zh-TW': '③ 右側一短點（由左上往右下）', 'zh-CN': '③ 右侧一短点（从左上往右下）', en: '③ Short dot on the right (from upper left toward lower right)', ko: '③ 오른쪽에 짧은 점 (왼쪽 위에서 오른쪽 아래로)', es: '③ Haz un punto corto a la derecha (de arriba a la izquierda hacia abajo a la derecha)' },
    ],
  },
  h_ki: {
    count: 4,
    steps: [
      { 'zh-TW': '① 上方一短橫', 'zh-CN': '① 上方一短横', en: '① Short horizontal stroke on top', ko: '① 위쪽에 짧은 가로획', es: '① Haz un trazo horizontal corto arriba' },
      { 'zh-TW': '② 下方再一短橫（兩橫平行）', 'zh-CN': '② 下方再一短横（两横平行）', en: '② Another short horizontal stroke below (the two run parallel)', ko: '② 아래에 짧은 가로획 하나 더 (두 가로획은 평행)', es: '② Haz otro trazo horizontal corto debajo (los dos, paralelos)' },
      { 'zh-TW': '③ 由左上往右下的斜線（穿過兩橫），末端輕輕往左上勾', 'zh-CN': '③ 从左上往右下的斜线（穿过两横），末端轻轻往左上钩', en: '③ Slanted stroke from the upper left down to the right (crossing both horizontals), ending in a small hook up to the left', ko: '③ 왼쪽 위에서 오른쪽 아래로 비스듬한 획 (두 가로획을 관통), 끝은 왼쪽 위로 살짝 갈고리', es: '③ Haz un trazo inclinado de arriba a la izquierda hacia abajo a la derecha (cruzando los dos horizontales) y termina con un gancho pequeño hacia arriba a la izquierda' },
      { 'zh-TW': '④ 下方另起一筆，由左往右的弧線', 'zh-CN': '④ 下方另起一笔，从左往右的弧线', en: '④ Separate curve at the bottom, starting on the left and curving to the right', ko: '④ 아래에 따로 떨어진 곡선, 왼쪽에서 시작해 오른쪽으로', es: '④ Haz una curva aparte abajo, que empieza a la izquierda y se curva hacia la derecha' },
    ],
    note: { 'zh-TW': 'き 兩橫；さ 只有一橫。', 'zh-CN': 'き 两横；さ 只有一横。', en: 'き has two horizontals; さ has only one.', ko: 'き는 가로획이 둘, さ는 하나뿐이다.', es: 'き tiene dos horizontales; さ, solo uno.' },
  },
  h_ku: {
    count: 1,
    steps: [
      { 'zh-TW': '① 由右上往左下，再折向右下（一筆完成）', 'zh-CN': '① 从右上往左下，再折向右下（一笔完成）', en: '① From upper right toward lower left, then turning sharply toward the lower right (in one stroke)', ko: '① 오른쪽 위에서 왼쪽 아래로, 다시 오른쪽 아래로 꺾기 (한 획으로)', es: '① Traza desde arriba a la derecha hacia abajo a la izquierda y quiebra hacia abajo a la derecha (en un solo trazo)' },
    ],
    note: { 'zh-TW': '角在左；へ 的角在上方偏左。', 'zh-CN': '角在左；へ 的角在上方偏左。', en: 'The corner is on the left; へ has its corner at the top, slightly left.', ko: '모서리가 왼쪽에 있다. へ는 모서리가 위쪽, 약간 왼쪽에 있다.', es: 'El ángulo queda a la izquierda; el de へ, arriba y algo a la izquierda.' },
  },
  h_ke: {
    count: 3,
    steps: [
      { 'zh-TW': '① 左側一長豎', 'zh-CN': '① 左侧一长竖', en: '① Long vertical stroke on the left', ko: '① 왼쪽에 긴 세로획', es: '① Haz un trazo vertical largo a la izquierda' },
      { 'zh-TW': '② 右上一短橫', 'zh-CN': '② 右上一短横', en: '② Short horizontal stroke at the upper right', ko: '② 오른쪽 위에 짧은 가로획', es: '② Haz un trazo horizontal corto arriba a la derecha' },
      { 'zh-TW': '③ 由上往下穿過橫的豎（略帶彎）', 'zh-CN': '③ 从上往下穿过横的竖（略带弯）', en: '③ Vertical stroke from the top down through the horizontal (slightly curved)', ko: '③ 위에서 아래로 가로획을 관통하는 세로획 (약간 휘게)', es: '③ Haz un trazo vertical de arriba abajo que cruza el horizontal (ligeramente curvo)' },
    ],
  },
  h_ko: {
    count: 2,
    steps: [
      { 'zh-TW': '① 上方一短橫', 'zh-CN': '① 上方一短横', en: '① Short horizontal stroke on top', ko: '① 위쪽에 짧은 가로획', es: '① Haz un trazo horizontal corto arriba' },
      { 'zh-TW': '② 下方一短橫（略長，可微彎）', 'zh-CN': '② 下方一短横（略长，可微弯）', en: '② Short horizontal stroke below (a bit longer, may curve slightly)', ko: '② 아래에 짧은 가로획 (조금 더 길고, 살짝 휘어도 됨)', es: '② Haz un trazo horizontal corto debajo (algo más largo; puede curvarse un poco)' },
    ],
    note: { 'zh-TW': 'こ 兩橫分開；に 左邊多一豎。', 'zh-CN': 'こ 两横分开；に 左边多一竖。', en: 'こ is two separate horizontals; に adds a vertical on the left.', ko: 'こ는 가로획 두 개가 떨어져 있고, に는 왼쪽에 세로획이 하나 더 있다.', es: 'こ son dos horizontales separados; に suma un vertical a la izquierda.' },
  },
  h_sa: {
    count: 3,
    steps: [
      { 'zh-TW': '① 上方一短橫', 'zh-CN': '① 上方一短横', en: '① Short horizontal stroke on top', ko: '① 위쪽에 짧은 가로획', es: '① Haz un trazo horizontal corto arriba' },
      { 'zh-TW': '② 由左上往右下的斜線（穿過橫），末端往左勾', 'zh-CN': '② 从左上往右下的斜线（穿过横），末端往左钩', en: '② Slanted stroke from the upper left down to the right (crossing the horizontal), ending in a hook to the left', ko: '② 왼쪽 위에서 오른쪽 아래로 비스듬한 획 (가로획을 관통), 끝은 왼쪽으로 갈고리', es: '② Haz un trazo inclinado de arriba a la izquierda hacia abajo a la derecha (cruzando el horizontal) y termina con un gancho hacia la izquierda' },
      { 'zh-TW': '③ 末端向右下收（彎向左）', 'zh-CN': '③ 末端向右下收（弯向左）', en: '③ Closing stroke toward the lower right (curving left)', ko: '③ 끝은 오른쪽 아래로 마무리 (왼쪽으로 휘게)', es: '③ Cierra hacia abajo a la derecha (curvando a la izquierda)' },
    ],
    note: { 'zh-TW': 'さ 的彎往左；ち 的彎往右（鏡像）。', 'zh-CN': 'さ 的弯往左；ち 的弯往右（镜像）。', en: 'さ curves left; ち curves right (mirror images).', ko: 'さ는 왼쪽으로 휘고, ち는 오른쪽으로 휜다 (좌우 대칭).', es: 'さ se curva a la izquierda; ち, a la derecha (son imagen especular).' },
  },
  h_shi: {
    count: 1,
    steps: [
      { 'zh-TW': '① 由上往下，末端往右上勾（一筆完成）', 'zh-CN': '① 从上往下，末端往右上钩（一笔完成）', en: '① From top to bottom, hooking up to the right at the end (in one stroke)', ko: '① 위에서 아래로, 끝은 오른쪽 위로 갈고리 (한 획으로)', es: '① Traza de arriba abajo y termina con un gancho hacia arriba a la derecha (en un solo trazo)' },
    ],
    note: { 'zh-TW': 'し 是豎著的勾；つ 是橫著的彎。', 'zh-CN': 'し 是竖着的钩；つ 是横着的弯。', en: 'し is a vertical hook; つ is a horizontal curve.', ko: 'し는 세로 방향 갈고리이고, つ는 가로 방향 곡선이다.', es: 'し es un gancho vertical; つ, una curva horizontal.' },
  },
  h_su: {
    count: 2,
    steps: [
      { 'zh-TW': '① 上方一長橫', 'zh-CN': '① 上方一长横', en: '① Long horizontal stroke on top', ko: '① 위쪽에 긴 가로획', es: '① Haz un trazo horizontal largo arriba' },
      { 'zh-TW': '② 由上往下穿過橫的豎，中段向左繞一個小圈，再往下收向左下', 'zh-CN': '② 从上往下穿过横的竖，中段向左绕一个小圈，再往下收向左下', en: '② Vertical stroke from the top down through the horizontal, looping once to the left halfway down, then finishing toward the lower left', ko: '② 위에서 아래로 가로획을 관통하는 세로획, 중간에서 왼쪽으로 작은 고리를 돌리고 아래로 내려 왼쪽 아래로 마무리', es: '② Haz un trazo vertical de arriba abajo que cruza el horizontal, con un bucle pequeño hacia la izquierda a media altura, y termina bajando hacia la izquierda' },
    ],
    note: { 'zh-TW': 'す 沒有 む 右上那一點。', 'zh-CN': 'す 没有 む 右上那一点。', en: 'す lacks the dot that む has at the upper right.', ko: 'す에는 む의 오른쪽 위 점이 없다.', es: 'す no tiene el punto de arriba a la derecha que lleva む.' },
  },
  h_se: {
    count: 3,
    steps: [
      { 'zh-TW': '① 中間一長橫', 'zh-CN': '① 中间一长横', en: '① Long horizontal stroke across the middle', ko: '① 가운데에 긴 가로획', es: '① Haz un trazo horizontal largo en el centro' },
      { 'zh-TW': '② 右側一豎，由上往下穿過橫，末端往左勾', 'zh-CN': '② 右侧一竖，从上往下穿过横，末端往左钩', en: '② Vertical stroke on the right, from the top down through the horizontal, ending in a hook to the left', ko: '② 오른쪽 세로획, 위에서 아래로 가로획을 관통하고 끝은 왼쪽으로 갈고리', es: '② Haz un trazo vertical a la derecha, de arriba abajo cruzando el horizontal, y termina con un gancho hacia la izquierda' },
      { 'zh-TW': '③ 左側由上往下穿過橫，再沿底部往右收', 'zh-CN': '③ 左侧从上往下穿过横，再沿底部往右收', en: '③ On the left, from the top down through the horizontal, then along the bottom to the right', ko: '③ 왼쪽에서 위에서 아래로 가로획을 관통한 뒤, 밑을 따라 오른쪽으로 마무리', es: '③ A la izquierda, traza de arriba abajo cruzando el horizontal y termina hacia la derecha por la parte de abajo' },
    ],
  },
  h_so: {
    count: 1,
    steps: [
      { 'zh-TW': '① 左上起一小橫，折向左下，再往右拉一長橫，接著折回左下，最後往右下彎出（一筆之字形）', 'zh-CN': '① 从左上起一小横，折向左下，再往右拉一长横，接着折回左下，最后往右下弯出（一笔写成的之字形）', en: '① From the upper left, a short stroke right, then sharply down to the left, a long stroke to the right, back down to the left, and a final curve out to the lower right (one zigzag stroke)', ko: '① 왼쪽 위에서 오른쪽으로 짧게 긋고 왼쪽 아래로 꺾은 뒤, 오른쪽으로 길게 긋고 다시 왼쪽 아래로 꺾어 마지막에 오른쪽 아래로 휘어 마무리 (한 획의 지그재그)', es: '① Desde arriba a la izquierda, traza un tramo corto hacia la derecha, quiebra hacia abajo a la izquierda, traza un tramo largo hacia la derecha, vuelve hacia abajo a la izquierda y termina con una curva hacia abajo a la derecha (un solo trazo en zigzag)' },
    ],
    note: { 'zh-TW': 'そ 不繞圈；ろ 也不繞圈但只有一個彎。', 'zh-CN': 'そ 不绕圈；ろ 也不绕圈，但只有一个弯。', en: 'そ has no loop; neither does ろ, but ろ has only one curve.', ko: 'そ는 고리가 없다. ろ도 고리는 없지만 곡선이 하나뿐이다.', es: 'そ no tiene bucle; ろ tampoco, pero solo tiene una curva.' },
  },
  h_ta: {
    count: 4,
    steps: [
      { 'zh-TW': '① 左上一短橫', 'zh-CN': '① 左上一短横', en: '① Short horizontal stroke at the upper left', ko: '① 왼쪽 위에 짧은 가로획', es: '① Haz un trazo horizontal corto arriba a la izquierda' },
      { 'zh-TW': '② 由上往下一豎（穿過橫）', 'zh-CN': '② 从上往下一竖（穿过横）', en: '② Vertical stroke from top to bottom (crossing the horizontal)', ko: '② 위에서 아래로 세로획 (가로획을 관통)', es: '② Haz un trazo vertical de arriba abajo (cruzando el horizontal)' },
      { 'zh-TW': '③ 右側中段一短橫（由左往右）', 'zh-CN': '③ 右侧中段一短横（从左往右）', en: '③ Short horizontal stroke on the right at mid-height (left to right)', ko: '③ 오른쪽 중간에 짧은 가로획 (왼쪽에서 오른쪽으로)', es: '③ Haz un trazo horizontal corto a la derecha, a media altura (de izquierda a derecha)' },
      { 'zh-TW': '④ 右下再一短橫（由左往右，略彎），和上一橫組成 こ 的形狀', 'zh-CN': '④ 右下再一短横（从左往右，略弯），和上一横组成 こ 的形状', en: '④ Another short horizontal stroke at the lower right (left to right, slightly curved); with the one above it forms a こ shape', ko: '④ 오른쪽 아래에 짧은 가로획 하나 더 (왼쪽에서 오른쪽으로, 약간 휘게). 위의 가로획과 함께 こ 모양이 된다', es: '④ Haz otro trazo horizontal corto abajo a la derecha (de izquierda a derecha, ligeramente curvo); con el de arriba forma la figura de こ' },
    ],
    note: { 'zh-TW': 'た 右邊兩短橫分開；な 右下要繞圈。', 'zh-CN': 'た 右边两短横分开；な 右下要绕圈。', en: 'た keeps its two short horizontals on the right apart; な loops at the lower right.', ko: 'た는 오른쪽의 짧은 가로획 두 개가 떨어져 있고, な는 오른쪽 아래에서 고리를 돈다.', es: 'En た, los dos trazos horizontales cortos de la derecha van separados; な hace un bucle abajo a la derecha.' },
  },
  h_chi: {
    count: 2,
    steps: [
      { 'zh-TW': '① 上方一短橫', 'zh-CN': '① 上方一短横', en: '① Short horizontal stroke on top', ko: '① 위쪽에 짧은 가로획', es: '① Haz un trazo horizontal corto arriba' },
      { 'zh-TW': '② 由上往下穿過橫，折向右上，再往右繞一個大彎，收向左下', 'zh-CN': '② 从上往下穿过横，折向右上，再往右绕一个大弯，收向左下', en: '② From the top down through the horizontal, turn up to the right, then swing around in a big curve to the right and finish toward the lower left', ko: '② 위에서 아래로 가로획을 관통한 뒤 오른쪽 위로 꺾고, 오른쪽으로 크게 휘어 왼쪽 아래로 마무리', es: '② Traza de arriba abajo cruzando el horizontal, quiebra hacia arriba a la derecha, rodea en una curva amplia hacia la derecha y termina hacia abajo a la izquierda' },
    ],
    note: { 'zh-TW': 'ち 的彎往右；さ 往左。', 'zh-CN': 'ち 的弯往右；さ 往左。', en: 'ち curves right; さ curves left.', ko: 'ち는 오른쪽으로 휘고, さ는 왼쪽으로 휜다.', es: 'ち se curva a la derecha; さ, a la izquierda.' },
  },
  h_tsu: {
    count: 1,
    steps: [
      { 'zh-TW': '① 由左上往右，再轉向左下彎（橫向的彎）', 'zh-CN': '① 从左上往右，再转向左下弯（横向的弯）', en: '① From upper left to the right, then curving down to the left (a horizontal curve)', ko: '① 왼쪽 위에서 오른쪽으로, 다시 왼쪽 아래로 휘기 (가로 방향 곡선)', es: '① Traza desde arriba a la izquierda hacia la derecha y curva hacia abajo a la izquierda (una curva horizontal)' },
    ],
    note: { 'zh-TW': 'つ 橫著彎；し 豎著勾。小寫 っ 是促音。', 'zh-CN': 'つ 横着弯；し 竖着钩。小写 っ 是促音。', en: 'つ curves horizontally; し hooks vertically. Small っ marks a doubled consonant (sokuon).', ko: 'つ는 가로로 휘고, し는 세로로 갈고리를 친다. 작은 っ는 촉음이다.', es: 'つ se curva en horizontal; し hace un gancho en vertical. La っ pequeña marca una consonante doble (sokuon).' },
  },
  h_te: {
    count: 1,
    steps: [
      { 'zh-TW': '① 上方一橫往右，折回左下彎，再往右下收筆', 'zh-CN': '① 上方一横往右，折回左下弯，再往右下收笔', en: '① Horizontal stroke on top to the right, then back down to the left in a curve, finishing toward the lower right', ko: '① 위쪽에 오른쪽으로 가로획을 긋고 왼쪽 아래로 꺾어 휜 뒤, 오른쪽 아래로 마무리', es: '① Haz un trazo horizontal arriba hacia la derecha, vuelve curvando hacia abajo a la izquierda y termina hacia abajo a la derecha' },
    ],
  },
  h_to: {
    count: 2,
    steps: [
      { 'zh-TW': '① 左上一短豎（略向右下斜）', 'zh-CN': '① 左上一短竖（略向右下斜）', en: '① Short vertical stroke at the upper left (slanting slightly to the lower right)', ko: '① 왼쪽 위에 짧은 세로획 (오른쪽 아래로 약간 비스듬히)', es: '① Haz un trazo vertical corto arriba a la izquierda (algo inclinado hacia abajo a la derecha)' },
      { 'zh-TW': '② 從右上起筆往左下，再沿底部往右收', 'zh-CN': '② 从右上起笔往左下，再沿底部往右收', en: '② Start at the upper right, go down to the left, then sweep right along the bottom', ko: '② 오른쪽 위에서 시작해 왼쪽 아래로 내린 뒤, 밑을 따라 오른쪽으로 마무리', es: '② Empieza arriba a la derecha, baja hacia la izquierda y termina hacia la derecha por la parte de abajo' },
    ],
  },
  h_na: {
    count: 4,
    steps: [
      { 'zh-TW': '① 上方一短橫', 'zh-CN': '① 上方一短横', en: '① Short horizontal stroke on top', ko: '① 위쪽에 짧은 가로획', es: '① Haz un trazo horizontal corto arriba' },
      { 'zh-TW': '② 由上往左下的撇（穿過橫）', 'zh-CN': '② 从上往左下的撇（穿过横）', en: '② Sweep from the top down to the lower left (crossing the horizontal)', ko: '② 위에서 왼쪽 아래로 삐침 (가로획을 관통)', es: '② Haz un trazo oblicuo desde arriba hacia abajo a la izquierda (cruzando el horizontal)' },
      { 'zh-TW': '③ 右上一短點', 'zh-CN': '③ 右上一短点', en: '③ Short dot at the upper right', ko: '③ 오른쪽 위에 짧은 점', es: '③ Haz un punto corto arriba a la derecha' },
      { 'zh-TW': '④ 從右側中段往下，底部繞一個圈再往右收', 'zh-CN': '④ 从右侧中段往下，底部绕一个圈再往右收', en: '④ From the middle of the right side, go down, loop at the bottom, and finish to the right', ko: '④ 오른쪽 중간에서 아래로 내려 밑에서 고리를 돌리고 오른쪽으로 마무리', es: '④ Desde la mitad del lado derecho, baja, haz un bucle abajo y termina hacia la derecha' },
    ],
    note: { 'zh-TW': 'な 右下繞圈；た 不繞圈。', 'zh-CN': 'な 右下绕圈；た 不绕圈。', en: 'な loops at the lower right; た does not.', ko: 'な는 오른쪽 아래에서 고리를 돌고, た는 돌지 않는다.', es: 'な hace un bucle abajo a la derecha; た no.' },
  },
  h_ni: {
    count: 3,
    steps: [
      { 'zh-TW': '① 左側一長豎', 'zh-CN': '① 左侧一长竖', en: '① Long vertical stroke on the left', ko: '① 왼쪽에 긴 세로획', es: '① Haz un trazo vertical largo a la izquierda' },
      { 'zh-TW': '② 右上一短橫', 'zh-CN': '② 右上一短横', en: '② Short horizontal stroke at the upper right', ko: '② 오른쪽 위에 짧은 가로획', es: '② Haz un trazo horizontal corto arriba a la derecha' },
      { 'zh-TW': '③ 右下一短橫', 'zh-CN': '③ 右下一短横', en: '③ Short horizontal stroke at the lower right', ko: '③ 오른쪽 아래에 짧은 가로획', es: '③ Haz un trazo horizontal corto abajo a la derecha' },
    ],
    note: { 'zh-TW': 'に 左邊有豎；こ 沒有。', 'zh-CN': 'に 左边有竖；こ 没有。', en: 'に has a vertical on the left; こ does not.', ko: 'に는 왼쪽에 세로획이 있고, こ는 없다.', es: 'に tiene un vertical a la izquierda; こ no.' },
  },
  h_nu: {
    count: 2,
    steps: [
      { 'zh-TW': '① 由左上往右下的斜線', 'zh-CN': '① 从左上往右下的斜线', en: '① Slanted stroke from upper left to lower right', ko: '① 왼쪽 위에서 오른쪽 아래로 비스듬한 획', es: '① Haz un trazo inclinado de arriba a la izquierda hacia abajo a la derecha' },
      { 'zh-TW': '② 由上方往左下斜拉（穿過第一畫），再往上繞到右邊、往下，末端在右下繞一個圈', 'zh-CN': '② 从上方往左下斜拉（穿过第一笔），再往上绕到右边、往下，末端在右下绕一个圈', en: '② From the top, slant down to the lower left (crossing the first stroke), swing up and around to the right and down, and end in a loop at the lower right', ko: '② 위에서 왼쪽 아래로 비스듬히 내리고 (첫 획을 관통), 위로 돌아 오른쪽으로 넘어가 아래로 내린 뒤, 오른쪽 아래에서 고리로 마무리', es: '② Desde arriba, baja inclinado hacia la izquierda (cruzando el primer trazo), sube y rodea hacia la derecha y abajo, y termina con un bucle abajo a la derecha' },
    ],
    note: { 'zh-TW': 'ぬ 最後繞圈；め 不繞圈。這是唯一的判斷點。', 'zh-CN': 'ぬ 最后绕圈；め 不绕圈。这是唯一的区分点。', en: 'ぬ ends in a loop; め does not. That is the only difference.', ko: 'ぬ는 끝에 고리가 있고, め는 없다. 구별점은 이것 하나뿐이다.', es: 'ぬ termina en bucle; め no. Es la única diferencia.' },
  },
  h_ne: {
    count: 2,
    steps: [
      { 'zh-TW': '① 左側一長豎', 'zh-CN': '① 左侧一长竖', en: '① Long vertical stroke on the left', ko: '① 왼쪽에 긴 세로획', es: '① Haz un trazo vertical largo a la izquierda' },
      { 'zh-TW': '② 由左往右、末端繞一個圈', 'zh-CN': '② 从左往右，末端绕一个圈', en: '② From left to right, ending in a loop', ko: '② 왼쪽에서 오른쪽으로, 끝에 고리', es: '② Traza de izquierda a derecha y termina con un bucle' },
    ],
    note: { 'zh-TW': 'ね 繞圈、れ 往右上翹、わ 彎鉤不繞圈。', 'zh-CN': 'ね 绕圈，れ 往右上翘，わ 弯钩不绕圈。', en: 'ね ends in a loop, れ flicks up to the right, and わ ends in a curved hook with no loop.', ko: 'ね는 고리, れ는 오른쪽 위로 삐쳐 올림, わ는 고리 없는 휘어진 갈고리다.', es: 'ね termina en bucle, れ levanta la punta hacia arriba a la derecha y わ cierra con un gancho curvo, sin bucle.' },
  },
  h_no: {
    count: 1,
    steps: [
      { 'zh-TW': '① 從中間往左下撇，再往上、向右繞一個大弧，收在下方（一筆完成）', 'zh-CN': '① 从中间往左下撇，再往上、向右绕一个大弧，收在下方（一笔完成）', en: '① From the center, sweep down to the lower left, then circle up and around to the right in one big arc, finishing at the bottom (in one stroke)', ko: '① 가운데에서 왼쪽 아래로 삐친 뒤, 위로 올라 오른쪽으로 크게 호를 그리며 돌아 아래에서 마무리 (한 획으로)', es: '① Desde el centro, baja hacia la izquierda, sube y rodea hacia la derecha en un arco amplio y termina abajo (en un solo trazo)' },
    ],
  },
  h_ha: {
    count: 3,
    steps: [
      { 'zh-TW': '① 左側一長豎', 'zh-CN': '① 左侧一长竖', en: '① Long vertical stroke on the left', ko: '① 왼쪽에 긴 세로획', es: '① Haz un trazo vertical largo a la izquierda' },
      { 'zh-TW': '② 右上一短橫', 'zh-CN': '② 右上一短横', en: '② Short horizontal stroke at the upper right', ko: '② 오른쪽 위에 짧은 가로획', es: '② Haz un trazo horizontal corto arriba a la derecha' },
      { 'zh-TW': '③ 由上往下穿過橫的豎，底部向左繞一個圈，再往右收', 'zh-CN': '③ 从上往下穿过横的竖，底部向左绕一个圈，再往右收', en: '③ Vertical stroke from the top down through the horizontal, looping to the left at the bottom, then finishing to the right', ko: '③ 위에서 아래로 가로획을 관통하는 세로획, 밑에서 왼쪽으로 고리를 돌린 뒤 오른쪽으로 마무리', es: '③ Haz un trazo vertical de arriba abajo que cruza el horizontal, con un bucle hacia la izquierda abajo, y termina hacia la derecha' },
    ],
    note: { 'zh-TW': 'は 右邊一橫；ほ 右邊兩橫。', 'zh-CN': 'は 右边一横；ほ 右边两横。', en: 'は has one horizontal on the right; ほ has two.', ko: 'は는 오른쪽 가로획이 하나, ほ는 둘이다.', es: 'は tiene un horizontal a la derecha; ほ, dos.' },
  },
  h_hi: {
    count: 1,
    steps: [
      { 'zh-TW': '① 左上起筆往右一小段，折向下彎過底部，往右上挑起，再向右下收（一筆完成）', 'zh-CN': '① 从左上起笔往右一小段，折向下弯过底部，往右上挑起，再向右下收（一笔完成）', en: '① From the upper left, a short move right, then down and around the bottom, up to the upper right, and a final stroke down to the right (in one stroke)', ko: '① 왼쪽 위에서 오른쪽으로 조금 긋고 아래로 꺾어 밑을 돌아 오른쪽 위로 올린 뒤, 오른쪽 아래로 마무리 (한 획으로)', es: '① Desde arriba a la izquierda, un tramo corto hacia la derecha, baja y rodea por abajo, sube hacia arriba a la derecha y termina hacia abajo a la derecha (en un solo trazo)' },
    ],
  },
  h_fu: {
    count: 4,
    steps: [
      { 'zh-TW': '① 上方一小點', 'zh-CN': '① 上方一小点', en: '① Small dot on top', ko: '① 위쪽에 작은 점', es: '① Haz un punto pequeño arriba' },
      { 'zh-TW': '② 中間一筆由上往下彎，收向左下', 'zh-CN': '② 中间一笔从上往下弯，收向左下', en: '② Middle stroke curving down from the top, finishing toward the lower left', ko: '② 가운데에서 위에서 아래로 휘어 내려 왼쪽 아래로 마무리', es: '② Haz un trazo en el centro que baja curvándose y termina hacia abajo a la izquierda' },
      { 'zh-TW': '③ 左側一短點，末端往右上挑', 'zh-CN': '③ 左侧一短点，末端往右上挑', en: '③ Short dot on the left, flicking up to the right at the end', ko: '③ 왼쪽에 짧은 점, 끝은 오른쪽 위로 삐쳐 올리기', es: '③ Haz un punto corto a la izquierda que termina hacia arriba a la derecha' },
      { 'zh-TW': '④ 右側一短點（由左上往右下）', 'zh-CN': '④ 右侧一短点（从左上往右下）', en: '④ Short dot on the right (from upper left toward lower right)', ko: '④ 오른쪽에 짧은 점 (왼쪽 위에서 오른쪽 아래로)', es: '④ Haz un punto corto a la derecha (de arriba a la izquierda hacia abajo a la derecha)' },
    ],
  },
  h_he: {
    count: 1,
    steps: [
      { 'zh-TW': '① 由左下往右上，再折向右下（一筆完成）', 'zh-CN': '① 从左下往右上，再折向右下（一笔完成）', en: '① From lower left up to the right, then turning sharply toward the lower right (in one stroke)', ko: '① 왼쪽 아래에서 오른쪽 위로, 다시 오른쪽 아래로 꺾기 (한 획으로)', es: '① Traza desde abajo a la izquierda hacia arriba a la derecha y quiebra hacia abajo a la derecha (en un solo trazo)' },
    ],
    note: { 'zh-TW': 'へ 頂點偏左；く 的角在左側。', 'zh-CN': 'へ 顶点偏左；く 的角在左侧。', en: 'へ peaks slightly left of center; く has its corner on the left.', ko: 'へ는 꼭짓점이 왼쪽으로 치우쳐 있고, く는 모서리가 왼쪽에 있다.', es: 'El vértice de へ queda algo a la izquierda; el ángulo de く, a la izquierda.' },
  },
  h_ho: {
    count: 4,
    steps: [
      { 'zh-TW': '① 左側一長豎', 'zh-CN': '① 左侧一长竖', en: '① Long vertical stroke on the left', ko: '① 왼쪽에 긴 세로획', es: '① Haz un trazo vertical largo a la izquierda' },
      { 'zh-TW': '② 右上一短橫', 'zh-CN': '② 右上一短横', en: '② Short horizontal stroke at the upper right', ko: '② 오른쪽 위에 짧은 가로획', es: '② Haz un trazo horizontal corto arriba a la derecha' },
      { 'zh-TW': '③ 右邊再一短橫', 'zh-CN': '③ 右边再一短横', en: '③ Another short horizontal stroke on the right', ko: '③ 오른쪽에 짧은 가로획 하나 더', es: '③ Haz otro trazo horizontal corto a la derecha' },
      { 'zh-TW': '④ 由橫往下再向右繞收', 'zh-CN': '④ 从横往下，再向右绕收', en: '④ Down from the horizontal, then looping to the right to finish', ko: '④ 가로획에서 아래로 내려 오른쪽으로 고리를 돌려 마무리', es: '④ Traza hacia abajo desde el horizontal y cierra con un bucle hacia la derecha' },
    ],
    note: { 'zh-TW': 'ほ 比 は 多一橫。', 'zh-CN': 'ほ 比 は 多一横。', en: 'ほ has one more horizontal than は.', ko: 'ほ는 は보다 가로획이 하나 더 많다.', es: 'ほ tiene un horizontal más que は.' },
  },
  h_ma: {
    count: 3,
    steps: [
      { 'zh-TW': '① 上方一短橫', 'zh-CN': '① 上方一短横', en: '① Short horizontal stroke on top', ko: '① 위쪽에 짧은 가로획', es: '① Haz un trazo horizontal corto arriba' },
      { 'zh-TW': '② 下方再一短橫', 'zh-CN': '② 下方再一短横', en: '② Another short horizontal stroke below', ko: '② 아래에 짧은 가로획 하나 더', es: '② Haz otro trazo horizontal corto debajo' },
      { 'zh-TW': '③ 由上往下一豎並繞圈', 'zh-CN': '③ 从上往下一竖，并绕圈', en: '③ Vertical stroke from top to bottom, ending in a loop', ko: '③ 위에서 아래로 세로획을 내려 고리', es: '③ Haz un trazo vertical de arriba abajo y termina con un bucle' },
    ],
    note: { 'zh-TW': 'ま 直筆繞圈；き 不繞圈。', 'zh-CN': 'ま 竖笔绕圈；き 不绕圈。', en: 'ま ends its vertical in a loop; き has no loop.', ko: 'ま는 세로획 끝에 고리가 있고, き는 고리가 없다.', es: 'El vertical de ま termina en bucle; き no tiene bucle.' },
  },
  h_mi: {
    count: 2,
    steps: [
      { 'zh-TW': '① 左上起一小橫，折向左下，繞一個小圈後往右拉長收筆', 'zh-CN': '① 从左上起一小横，折向左下，绕一个小圈后往右拉长收笔', en: '① From the upper left, a short stroke right, then sharply down to the left, a small loop, and a long stroke out to the right', ko: '① 왼쪽 위에서 오른쪽으로 짧게 긋고 왼쪽 아래로 꺾은 뒤, 작은 고리를 돌려 오른쪽으로 길게 마무리', es: '① Desde arriba a la izquierda, traza un tramo corto hacia la derecha, quiebra hacia abajo a la izquierda, haz un bucle pequeño y termina con un tramo largo hacia la derecha' },
      { 'zh-TW': '② 右側中段起筆，往左下撇（穿過第一畫）', 'zh-CN': '② 从右侧中段起笔，往左下撇（穿过第一笔）', en: '② Start on the right at mid-height and sweep down to the lower left (crossing the first stroke)', ko: '② 오른쪽 중간에서 시작해 왼쪽 아래로 삐침 (첫 획을 관통)', es: '② Empieza a media altura a la derecha y baja en un trazo oblicuo hacia la izquierda (cruzando el primer trazo)' },
    ],
  },
  h_mu: {
    count: 3,
    steps: [
      { 'zh-TW': '① 上方一短橫', 'zh-CN': '① 上方一短横', en: '① Short horizontal stroke on top', ko: '① 위쪽에 짧은 가로획', es: '① Haz un trazo horizontal corto arriba' },
      { 'zh-TW': '② 由上往下穿過橫，向左繞一個小圈，再沿底部往右，末端往上勾', 'zh-CN': '② 从上往下穿过横，向左绕一个小圈，再沿底部往右，末端往上钩', en: '② From the top down through the horizontal, a small loop to the left, then along the bottom to the right, ending in a hook upward', ko: '② 위에서 아래로 가로획을 관통하고 왼쪽으로 작은 고리를 돌린 뒤, 밑을 따라 오른쪽으로 가서 끝은 위로 갈고리', es: '② Traza de arriba abajo cruzando el horizontal, haz un bucle pequeño hacia la izquierda, sigue por abajo hacia la derecha y termina con un gancho hacia arriba' },
      { 'zh-TW': '③ 右上補一點', 'zh-CN': '③ 右上补一点', en: '③ Dot added at the upper right', ko: '③ 오른쪽 위에 점 추가', es: '③ Añade un punto arriba a la derecha' },
    ],
    note: { 'zh-TW': 'む 右上有一點；す 沒有。', 'zh-CN': 'む 右上有一点；す 没有。', en: 'む has a dot at the upper right; す does not.', ko: 'む는 오른쪽 위에 점이 있고, す는 없다.', es: 'む tiene un punto arriba a la derecha; す no.' },
  },
  h_me: {
    count: 2,
    steps: [
      { 'zh-TW': '① 由左上往右下的斜線', 'zh-CN': '① 从左上往右下的斜线', en: '① Slanted stroke from upper left to lower right', ko: '① 왼쪽 위에서 오른쪽 아래로 비스듬한 획', es: '① Haz un trazo inclinado de arriba a la izquierda hacia abajo a la derecha' },
      { 'zh-TW': '② 由上方往左下斜拉（穿過第一畫），再往上繞到右邊、往下收（不繞圈）', 'zh-CN': '② 从上方往左下斜拉（穿过第一笔），再往上绕到右边、往下收（不绕圈）', en: '② From the top, slant down to the lower left (crossing the first stroke), then swing up and around to the right and down to finish (no loop)', ko: '② 위에서 왼쪽 아래로 비스듬히 내리고 (첫 획을 관통), 위로 돌아 오른쪽으로 넘어가 아래로 마무리 (고리 없음)', es: '② Desde arriba, baja inclinado hacia la izquierda (cruzando el primer trazo), sube y rodea hacia la derecha y abajo para cerrar (sin bucle)' },
    ],
    note: { 'zh-TW': 'め 不繞圈；ぬ 繞圈。', 'zh-CN': 'め 不绕圈；ぬ 绕圈。', en: 'め has no loop; ぬ does.', ko: 'め는 고리가 없고, ぬ는 있다.', es: 'め no tiene bucle; ぬ sí.' },
  },
  h_mo: {
    count: 3,
    steps: [
      { 'zh-TW': '① 由上往下一豎，底部向右彎、往上勾', 'zh-CN': '① 从上往下一竖，底部向右弯、往上钩', en: '① Vertical stroke from top to bottom, curving right at the bottom into a hook upward', ko: '① 위에서 아래로 세로획, 밑에서 오른쪽으로 휘어 위로 갈고리', es: '① Haz un trazo vertical de arriba abajo que se curva hacia la derecha abajo y termina con un gancho hacia arriba' },
      { 'zh-TW': '② 中間一短橫', 'zh-CN': '② 中间一短横', en: '② Short horizontal stroke in the middle', ko: '② 가운데에 짧은 가로획', es: '② Haz un trazo horizontal corto en el centro' },
      { 'zh-TW': '③ 下方再一短橫', 'zh-CN': '③ 下方再一短横', en: '③ Another short horizontal stroke below', ko: '③ 아래에 짧은 가로획 하나 더', es: '③ Haz otro trazo horizontal corto debajo' },
    ],
  },
  h_ya: {
    count: 3,
    steps: [
      { 'zh-TW': '① 左側起筆往右上拉，再向右下彎回，末端往左勾', 'zh-CN': '① 从左侧起笔往右上拉，再向右下弯回，末端往左钩', en: '① Start on the left and pull up to the right, then curve back down, ending in a hook to the left', ko: '① 왼쪽에서 시작해 오른쪽 위로 긋고, 오른쪽 아래로 휘어 돌아와 끝은 왼쪽으로 갈고리', es: '① Empieza a la izquierda y sube hacia la derecha, luego curva hacia abajo y termina con un gancho hacia la izquierda' },
      { 'zh-TW': '② 上方一短點', 'zh-CN': '② 上方一短点', en: '② Short dot on top', ko: '② 위쪽에 짧은 점', es: '② Haz un punto corto arriba' },
      { 'zh-TW': '③ 由左上往右下的長斜線（穿過第一畫）', 'zh-CN': '③ 从左上往右下的长斜线（穿过第一笔）', en: '③ Long slanted stroke from the upper left down to the right (crossing the first stroke)', ko: '③ 왼쪽 위에서 오른쪽 아래로 긴 비스듬한 획 (첫 획을 관통)', es: '③ Haz un trazo inclinado largo de arriba a la izquierda hacia abajo a la derecha (cruzando el primer trazo)' },
    ],
    note: { 'zh-TW': '小寫 ゃ 用於拗音。', 'zh-CN': '小写 ゃ 用于拗音。', en: 'Small ゃ is used in contracted sounds (yōon).', ko: '작은 ゃ는 요음에 쓴다.', es: 'La ゃ pequeña se usa en los sonidos contraídos (yōon).' },
  },
  h_yu: {
    count: 2,
    steps: [
      { 'zh-TW': '① 左上起筆往下，折回往上，再向右繞一個大弧，收向中間', 'zh-CN': '① 从左上起笔往下，折回往上，再向右绕一个大弧，收向中间', en: '① From the upper left go down, double back up, then swing around to the right in a big arc and finish curling back toward the middle', ko: '① 왼쪽 위에서 아래로 내린 뒤 다시 위로 꺾고, 오른쪽으로 크게 호를 그리며 돌아 가운데로 마무리', es: '① Desde arriba a la izquierda baja, vuelve a subir, rodea hacia la derecha en un arco amplio y termina curvando hacia el centro' },
      { 'zh-TW': '② 由上往下一豎穿過', 'zh-CN': '② 从上往下一竖穿过', en: '② Vertical stroke from top to bottom, cutting through', ko: '② 위에서 아래로 관통하는 세로획', es: '② Haz un trazo vertical de arriba abajo que lo atraviese' },
    ],
  },
  h_yo: {
    count: 2,
    steps: [
      { 'zh-TW': '① 右上一短橫', 'zh-CN': '① 右上一短横', en: '① Short horizontal stroke at the upper right', ko: '① 오른쪽 위에 짧은 가로획', es: '① Haz un trazo horizontal corto arriba a la derecha' },
      { 'zh-TW': '② 由上往下一豎（經過橫的左端），底部向左繞一個圈，再往右收', 'zh-CN': '② 从上往下一竖（经过横的左端），底部向左绕一个圈，再往右收', en: '② Vertical stroke from top to bottom (passing the left end of the horizontal), looping to the left at the bottom, then finishing to the right', ko: '② 위에서 아래로 세로획 (가로획의 왼쪽 끝을 지남), 밑에서 왼쪽으로 고리를 돌린 뒤 오른쪽으로 마무리', es: '② Haz un trazo vertical de arriba abajo (pasando por el extremo izquierdo del horizontal), con un bucle hacia la izquierda abajo, y termina hacia la derecha' },
    ],
  },
  h_ra: {
    count: 2,
    steps: [
      { 'zh-TW': '① 上方一短撇', 'zh-CN': '① 上方一短撇', en: '① Short sweep on top', ko: '① 위쪽에 짧은 삐침', es: '① Haz un trazo oblicuo corto arriba' },
      { 'zh-TW': '② 左側由上往下，折向右上，再往右繞一個大彎，收向左下', 'zh-CN': '② 左侧从上往下，折向右上，再往右绕一个大弯，收向左下', en: '② On the left, go down from the top, turn up to the right, then swing around in a big curve to the right and finish toward the lower left', ko: '② 왼쪽에서 위에서 아래로 내린 뒤 오른쪽 위로 꺾고, 오른쪽으로 크게 휘어 왼쪽 아래로 마무리', es: '② A la izquierda, baja desde arriba, quiebra hacia arriba a la derecha, rodea en una curva amplia hacia la derecha y termina hacia abajo a la izquierda' },
    ],
    note: { 'zh-TW': 'ら 上面是撇；う 上面是點。', 'zh-CN': 'ら 上面是撇；う 上面是点。', en: 'ら has a sweep on top; う has a dot.', ko: 'ら는 위가 삐침이고, う는 위가 점이다.', es: 'ら lleva un trazo oblicuo arriba; う, un punto.' },
  },
  h_ri: {
    count: 2,
    steps: [
      { 'zh-TW': '① 左側一短豎', 'zh-CN': '① 左侧一短竖', en: '① Short vertical stroke on the left', ko: '① 왼쪽에 짧은 세로획', es: '① Haz un trazo vertical corto a la izquierda' },
      { 'zh-TW': '② 右側一長豎（往下拉並微彎）', 'zh-CN': '② 右侧一长竖（往下拉并微弯）', en: '② Long vertical stroke on the right (pulled down, slightly curved)', ko: '② 오른쪽에 긴 세로획 (아래로 길게 내리며 살짝 휘게)', es: '② Haz un trazo vertical largo a la derecha (bájalo y cúrvalo un poco)' },
    ],
    note: { 'zh-TW': 'り 右筆下拉較長；い 兩筆較短。', 'zh-CN': 'り 右笔下拉较长；い 两笔较短。', en: 'り pulls its right stroke down longer; い has two shorter strokes.', ko: 'り는 오른쪽 획이 아래로 길게 내려가고, い는 두 획이 더 짧다.', es: 'En り el trazo derecho baja más; en い los dos trazos son más cortos.' },
  },
  h_ru: {
    count: 1,
    steps: [
      { 'zh-TW': '① 左上起一小橫，折向左下斜拉，再往右繞一個大彎，末端繞一個圈（一筆完成）', 'zh-CN': '① 从左上起一小横，折向左下斜拉，再往右绕一个大弯，末端绕一个圈（一笔完成）', en: '① From the upper left, a short stroke right, then sharply down to the lower left, a big curve around to the right, and a loop at the end (in one stroke)', ko: '① 왼쪽 위에서 오른쪽으로 짧게 긋고 왼쪽 아래로 꺾어 내린 뒤, 오른쪽으로 크게 휘어 돌고 끝에 고리 (한 획으로)', es: '① Desde arriba a la izquierda, traza un tramo corto hacia la derecha, quiebra hacia abajo a la izquierda, rodea en una curva amplia hacia la derecha y termina con un bucle (en un solo trazo)' },
    ],
    note: { 'zh-TW': 'る 尾端繞圈；ろ 不繞圈。', 'zh-CN': 'る 尾端绕圈；ろ 不绕圈。', en: 'る ends in a loop; ろ does not.', ko: 'る는 끝에 고리가 있고, ろ는 없다.', es: 'る termina en bucle; ろ no.' },
  },
  h_re: {
    count: 2,
    steps: [
      { 'zh-TW': '① 左側一長豎', 'zh-CN': '① 左侧一长竖', en: '① Long vertical stroke on the left', ko: '① 왼쪽에 긴 세로획', es: '① Haz un trazo vertical largo a la izquierda' },
      { 'zh-TW': '② 由左往右、末端往右上翹出去', 'zh-CN': '② 从左往右，末端往右上翘出去', en: '② From left to right, flicking up to the right at the end', ko: '② 왼쪽에서 오른쪽으로, 끝은 오른쪽 위로 삐쳐 올리기', es: '② Traza de izquierda a derecha y levanta la punta hacia arriba a la derecha' },
    ],
    note: { 'zh-TW': 'れ 往右上翹；ね 繞圈。', 'zh-CN': 'れ 往右上翘；ね 绕圈。', en: 'れ flicks up to the right; ね loops.', ko: 'れ는 오른쪽 위로 삐쳐 올리고, ね는 고리를 돈다.', es: 'れ levanta la punta hacia arriba a la derecha; ね hace un bucle.' },
  },
  h_ro: {
    count: 1,
    steps: [
      { 'zh-TW': '① 左上起一小橫，折向左下斜拉，再往右繞一個大彎，收向左下（不繞圈）', 'zh-CN': '① 从左上起一小横，折向左下斜拉，再往右绕一个大弯，收向左下（不绕圈）', en: '① From the upper left, a short stroke right, then sharply down to the lower left, a big curve around to the right, finishing toward the lower left (no loop)', ko: '① 왼쪽 위에서 오른쪽으로 짧게 긋고 왼쪽 아래로 꺾어 내린 뒤, 오른쪽으로 크게 휘어 돌아 왼쪽 아래로 마무리 (고리 없음)', es: '① Desde arriba a la izquierda, traza un tramo corto hacia la derecha, quiebra hacia abajo a la izquierda, rodea en una curva amplia hacia la derecha y termina hacia abajo a la izquierda (sin bucle)' },
    ],
    note: { 'zh-TW': 'ろ 不繞圈；る 繞圈。', 'zh-CN': 'ろ 不绕圈；る 绕圈。', en: 'ろ has no loop; る does.', ko: 'ろ는 고리가 없고, る는 있다.', es: 'ろ no tiene bucle; る sí.' },
  },
  h_wa: {
    count: 2,
    steps: [
      { 'zh-TW': '① 左側一長豎', 'zh-CN': '① 左侧一长竖', en: '① Long vertical stroke on the left', ko: '① 왼쪽에 긴 세로획', es: '① Haz un trazo vertical largo a la izquierda' },
      { 'zh-TW': '② 由左往右、末端彎鉤（不繞圈不翹出）', 'zh-CN': '② 从左往右，末端弯钩（不绕圈也不翘出）', en: '② From left to right, ending in a curved hook (no loop, no upward flick)', ko: '② 왼쪽에서 오른쪽으로, 끝은 휘어진 갈고리 (고리도, 삐쳐 올림도 없음)', es: '② Traza de izquierda a derecha y termina con un gancho curvo (sin bucle ni punta levantada)' },
    ],
    note: { 'zh-TW': 'わ 彎鉤；ね 繞圈；れ 翹出。', 'zh-CN': 'わ 弯钩；ね 绕圈；れ 翘出。', en: 'わ ends in a curved hook; ね loops; れ flicks up.', ko: 'わ는 휘어진 갈고리, ね는 고리, れ는 삐쳐 올림이다.', es: 'わ cierra con un gancho curvo; ね, con un bucle; れ levanta la punta.' },
  },
  h_wo: {
    count: 3,
    steps: [
      { 'zh-TW': '① 上方一短橫', 'zh-CN': '① 上方一短横', en: '① Short horizontal stroke on top', ko: '① 위쪽에 짧은 가로획', es: '① Haz un trazo horizontal corto arriba' },
      { 'zh-TW': '② 由上往左下斜拉（穿過橫），再折向右下彎', 'zh-CN': '② 从上往左下斜拉（穿过横），再折向右下弯', en: '② From the top, slant down to the lower left (crossing the horizontal), then turn and curve down to the right', ko: '② 위에서 왼쪽 아래로 비스듬히 내리고 (가로획을 관통), 꺾어서 오른쪽 아래로 휘기', es: '② Desde arriba, baja inclinado hacia la izquierda (cruzando el horizontal), luego quiebra y curva hacia abajo a la derecha' },
      { 'zh-TW': '③ 從右側起筆往左下，再沿底部往右收', 'zh-CN': '③ 从右侧起笔往左下，再沿底部往右收', en: '③ Start on the right, go down to the left, then sweep right along the bottom', ko: '③ 오른쪽에서 시작해 왼쪽 아래로 내린 뒤, 밑을 따라 오른쪽으로 마무리', es: '③ Empieza a la derecha, baja hacia la izquierda y termina hacia la derecha por la parte de abajo' },
    ],
    note: { 'zh-TW': '幾乎只當受詞助詞用，讀音同 お。', 'zh-CN': '几乎只用作宾语助词，读音同 お。', en: 'Used almost only as the object particle; pronounced like お.', ko: '거의 목적격 조사로만 쓰며, 발음은 お와 같다.', es: 'Se usa casi solo como partícula de objeto directo; se pronuncia como お.' },
  },
  h_n: {
    count: 1,
    steps: [
      { 'zh-TW': '① 由上往左下拉一長撇，折回往上，再往右下彎，末端往右上挑（一筆完成）', 'zh-CN': '① 从上往左下拉一长撇，折回往上，再往右下弯，末端往右上挑（一笔完成）', en: '① Long sweep from the top down to the lower left, then back up, curving down to the right and flicking up to the right at the end (in one stroke)', ko: '① 위에서 왼쪽 아래로 길게 삐친 뒤 다시 위로 꺾고, 오른쪽 아래로 휘어 끝은 오른쪽 위로 삐쳐 올리기 (한 획으로)', es: '① Haz un trazo oblicuo largo desde arriba hacia abajo a la izquierda, vuelve hacia arriba, curva hacia abajo a la derecha y termina hacia arriba a la derecha (en un solo trazo)' },
    ],
    note: { 'zh-TW': 'ん 佔一拍；不能放在詞首。', 'zh-CN': 'ん 占一拍；不能放在词首。', en: 'ん takes one full beat (mora) and never starts a word.', ko: 'ん은 한 박(모라)을 차지하며, 단어 첫머리에 오지 않는다.', es: 'ん ocupa un tiempo (mora) y nunca va al inicio de una palabra.' },
  },
};
