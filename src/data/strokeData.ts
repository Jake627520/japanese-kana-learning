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
      { 'zh-TW': '③ 由左往右繞一圈收在右下', 'zh-CN': '③ 从左往右绕一圈，收在右下', en: '③ Loop from left to right, ending at the lower right', ko: '③ 왼쪽에서 오른쪽으로 고리를 돌려 오른쪽 아래에서 마무리', es: '③ Haz un bucle de izquierda a derecha y termina abajo a la derecha' },
    ],
    note: { 'zh-TW': '第三畫的圈收在右下；お 的圈在左下且右上多一點。', 'zh-CN': '第三笔的圈收在右下；お 的圈在左下，且右上多一点。', en: 'The third stroke ends its loop at the lower right; お has its loop at the lower left and an extra dot at the upper right.', ko: '세 번째 획의 고리는 오른쪽 아래에서 끝난다. お는 고리가 왼쪽 아래에 있고 오른쪽 위에 점이 하나 더 있다.', es: 'El bucle del tercer trazo termina abajo a la derecha; en お el bucle queda abajo a la izquierda y hay un punto extra arriba a la derecha.' },
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
      { 'zh-TW': '② 由左下折向右下，收成一個平底', 'zh-CN': '② 从左下折向右下，收成一个平底', en: '② From the lower left, turning sharply toward the lower right and ending in a flat base', ko: '② 왼쪽 아래에서 오른쪽 아래로 꺾어 평평한 밑바닥으로 마무리', es: '② Traza desde abajo a la izquierda, quiebra hacia abajo a la derecha y cierra con una base plana' },
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
      { 'zh-TW': '① 由上往下、末端向左彎的長撇', 'zh-CN': '① 从上往下、末端向左弯的长撇', en: '① Long sweep from top to bottom, curving left at the end', ko: '① 위에서 아래로 내려 끝이 왼쪽으로 휘는 긴 삐침', es: '① Haz un trazo oblicuo largo de arriba abajo que se curva a la izquierda al final' },
      { 'zh-TW': '② 右上一短橫接下彎', 'zh-CN': '② 右上一短横接下弯', en: '② Short horizontal stroke at the upper right, continuing into a downward curve', ko: '② 오른쪽 위 짧은 가로획에 이어 아래로 곡선', es: '② Haz un trazo horizontal corto arriba a la derecha que continúa en una curva hacia abajo' },
      { 'zh-TW': '③ 右側補一短撇', 'zh-CN': '③ 右侧补一短撇', en: '③ Short sweep added on the right', ko: '③ 오른쪽에 짧은 삐침 추가', es: '③ Añade un trazo oblicuo corto a la derecha' },
    ],
  },
  h_ki: {
    count: 4,
    steps: [
      { 'zh-TW': '① 上方一短橫', 'zh-CN': '① 上方一短横', en: '① Short horizontal stroke on top', ko: '① 위쪽에 짧은 가로획', es: '① Haz un trazo horizontal corto arriba' },
      { 'zh-TW': '② 下方再一短橫（兩橫平行）', 'zh-CN': '② 下方再一短横（两横平行）', en: '② Another short horizontal stroke below (the two run parallel)', ko: '② 아래에 짧은 가로획 하나 더 (두 가로획은 평행)', es: '② Haz otro trazo horizontal corto debajo (los dos, paralelos)' },
      { 'zh-TW': '③ 由右上往左下的長撇', 'zh-CN': '③ 从右上往左下的长撇', en: '③ Long sweep from upper right to lower left', ko: '③ 오른쪽 위에서 왼쪽 아래로 긴 삐침', es: '③ Haz un trazo oblicuo largo de arriba a la derecha hacia abajo a la izquierda' },
      { 'zh-TW': '④ 末端向右下收', 'zh-CN': '④ 末端向右下收', en: '④ Closing stroke toward the lower right', ko: '④ 끝은 오른쪽 아래로 마무리', es: '④ Cierra hacia abajo a la derecha' },
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
      { 'zh-TW': '③ 由橫往下的豎（略帶彎）', 'zh-CN': '③ 从横往下的竖（略带弯）', en: '③ Vertical stroke down from the horizontal (slightly curved)', ko: '③ 가로획에서 아래로 세로획 (약간 휘게)', es: '③ Haz un trazo vertical hacia abajo desde el horizontal (ligeramente curvo)' },
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
      { 'zh-TW': '② 由右上往左下的撇', 'zh-CN': '② 从右上往左下的撇', en: '② Sweep from upper right to lower left', ko: '② 오른쪽 위에서 왼쪽 아래로 삐침', es: '② Haz un trazo oblicuo de arriba a la derecha hacia abajo a la izquierda' },
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
      { 'zh-TW': '① 上方一短橫', 'zh-CN': '① 上方一短横', en: '① Short horizontal stroke on top', ko: '① 위쪽에 짧은 가로획', es: '① Haz un trazo horizontal corto arriba' },
      { 'zh-TW': '② 由右上往左下，繞一圈收在中間', 'zh-CN': '② 从右上往左下，绕一圈收在中间', en: '② From upper right toward lower left, looping once and ending in the middle', ko: '② 오른쪽 위에서 왼쪽 아래로, 고리를 한 번 돌려 가운데에서 마무리', es: '② Traza desde arriba a la derecha hacia abajo a la izquierda, haz un bucle y termina en el centro' },
    ],
    note: { 'zh-TW': 'す 沒有 む 右上那一點。', 'zh-CN': 'す 没有 む 右上那一点。', en: 'す lacks the dot that む has at the upper right.', ko: 'す에는 む의 오른쪽 위 점이 없다.', es: 'す no tiene el punto de arriba a la derecha que lleva む.' },
  },
  h_se: {
    count: 3,
    steps: [
      { 'zh-TW': '① 左側一豎', 'zh-CN': '① 左侧一竖', en: '① Vertical stroke on the left', ko: '① 왼쪽에 세로획', es: '① Haz un trazo vertical a la izquierda' },
      { 'zh-TW': '② 中間一長橫', 'zh-CN': '② 中间一长横', en: '② Long horizontal stroke across the middle', ko: '② 가운데에 긴 가로획', es: '② Haz un trazo horizontal largo en el centro' },
      { 'zh-TW': '③ 右側由上往下並向左收', 'zh-CN': '③ 右侧从上往下，并向左收', en: '③ On the right, top to bottom, closing toward the left', ko: '③ 오른쪽에 위에서 아래로 내려 왼쪽으로 마무리', es: '③ A la derecha, traza de arriba abajo y cierra hacia la izquierda' },
    ],
  },
  h_so: {
    count: 1,
    steps: [
      { 'zh-TW': '① 由左上折向右下再折回左下（一筆之字形）', 'zh-CN': '① 从左上折向右下，再折回左下（一笔写成的之字形）', en: '① From upper left, turning sharply toward the lower right, then back toward the lower left (one zigzag stroke)', ko: '① 왼쪽 위에서 오른쪽 아래로 꺾고 다시 왼쪽 아래로 꺾기 (한 획의 지그재그)', es: '① Traza desde arriba a la izquierda, quiebra hacia abajo a la derecha y vuelve hacia abajo a la izquierda (un solo trazo en zigzag)' },
    ],
    note: { 'zh-TW': 'そ 不繞圈；ろ 也不繞圈但只有一個彎。', 'zh-CN': 'そ 不绕圈；ろ 也不绕圈，但只有一个弯。', en: 'そ has no loop; neither does ろ, but ろ has only one curve.', ko: 'そ는 고리가 없다. ろ도 고리는 없지만 곡선이 하나뿐이다.', es: 'そ no tiene bucle; ろ tampoco, pero solo tiene una curva.' },
  },
  h_ta: {
    count: 4,
    steps: [
      { 'zh-TW': '① 左上一短橫', 'zh-CN': '① 左上一短横', en: '① Short horizontal stroke at the upper left', ko: '① 왼쪽 위에 짧은 가로획', es: '① Haz un trazo horizontal corto arriba a la izquierda' },
      { 'zh-TW': '② 由上往下一豎（穿過橫）', 'zh-CN': '② 从上往下一竖（穿过横）', en: '② Vertical stroke from top to bottom (crossing the horizontal)', ko: '② 위에서 아래로 세로획 (가로획을 관통)', es: '② Haz un trazo vertical de arriba abajo (cruzando el horizontal)' },
      { 'zh-TW': '③ 右下一短撇', 'zh-CN': '③ 右下一短撇', en: '③ Short sweep at the lower right', ko: '③ 오른쪽 아래에 짧은 삐침', es: '③ Haz un trazo oblicuo corto abajo a la derecha' },
      { 'zh-TW': '④ 右下再一短撇', 'zh-CN': '④ 右下再一短撇', en: '④ Another short sweep at the lower right', ko: '④ 오른쪽 아래에 짧은 삐침 하나 더', es: '④ Haz otro trazo oblicuo corto abajo a la derecha' },
    ],
    note: { 'zh-TW': 'た 右下兩短撇分開；な 右下要繞圈。', 'zh-CN': 'た 右下两短撇分开；な 右下要绕圈。', en: 'た keeps its two short sweeps at the lower right apart; な loops at the lower right.', ko: 'た는 오른쪽 아래 짧은 삐침 두 개가 떨어져 있고, な는 오른쪽 아래에서 고리를 돈다.', es: 'En た, los dos trazos oblicuos cortos de abajo a la derecha van separados; な hace un bucle abajo a la derecha.' },
  },
  h_chi: {
    count: 2,
    steps: [
      { 'zh-TW': '① 上方一短橫', 'zh-CN': '① 上方一短横', en: '① Short horizontal stroke on top', ko: '① 위쪽에 짧은 가로획', es: '① Haz un trazo horizontal corto arriba' },
      { 'zh-TW': '② 由右上往左下再彎向右下', 'zh-CN': '② 从右上往左下，再弯向右下', en: '② From upper right toward lower left, then curving toward the lower right', ko: '② 오른쪽 위에서 왼쪽 아래로, 다시 오른쪽 아래로 휘기', es: '② Traza desde arriba a la derecha hacia abajo a la izquierda y curva hacia abajo a la derecha' },
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
      { 'zh-TW': '① 上方一短橫，接著往左下彎收筆', 'zh-CN': '① 上方一短横，接着往左下弯收笔', en: '① Short horizontal stroke on top, then curving down to the left to finish', ko: '① 위쪽에 짧은 가로획, 이어서 왼쪽 아래로 휘어 마무리', es: '① Haz un trazo horizontal corto arriba y curva hacia abajo a la izquierda para cerrar' },
    ],
  },
  h_to: {
    count: 2,
    steps: [
      { 'zh-TW': '① 一短豎（略斜）', 'zh-CN': '① 一短竖（略斜）', en: '① Short vertical stroke (slightly slanted)', ko: '① 짧은 세로획 (약간 비스듬히)', es: '① Haz un trazo vertical corto (algo inclinado)' },
      { 'zh-TW': '② 由豎的中段往右下畫弧', 'zh-CN': '② 从竖的中段往右下画弧', en: '② Arc from the middle of the vertical toward the lower right', ko: '② 세로획 중간에서 오른쪽 아래로 호', es: '② Traza un arco desde la mitad del vertical hacia abajo a la derecha' },
    ],
  },
  h_na: {
    count: 4,
    steps: [
      { 'zh-TW': '① 上方一短橫', 'zh-CN': '① 上方一短横', en: '① Short horizontal stroke on top', ko: '① 위쪽에 짧은 가로획', es: '① Haz un trazo horizontal corto arriba' },
      { 'zh-TW': '② 由上往下一豎（穿過橫）', 'zh-CN': '② 从上往下一竖（穿过横）', en: '② Vertical stroke from top to bottom (crossing the horizontal)', ko: '② 위에서 아래로 세로획 (가로획을 관통)', es: '② Haz un trazo vertical de arriba abajo (cruzando el horizontal)' },
      { 'zh-TW': '③ 左下一短撇', 'zh-CN': '③ 左下一短撇', en: '③ Short sweep at the lower left', ko: '③ 왼쪽 아래에 짧은 삐침', es: '③ Haz un trazo oblicuo corto abajo a la izquierda' },
      { 'zh-TW': '④ 右下繞一個圈', 'zh-CN': '④ 右下绕一个圈', en: '④ Loop at the lower right', ko: '④ 오른쪽 아래에 고리', es: '④ Haz un bucle abajo a la derecha' },
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
      { 'zh-TW': '① 由左上往右下的撇', 'zh-CN': '① 从左上往右下的撇', en: '① Sweep from upper left to lower right', ko: '① 왼쪽 위에서 오른쪽 아래로 삐침', es: '① Haz un trazo oblicuo de arriba a la izquierda hacia abajo a la derecha' },
      { 'zh-TW': '② 由左往右、末端繞一個圈收尾', 'zh-CN': '② 从左往右，末端绕一个圈收尾', en: '② From left to right, ending in a loop', ko: '② 왼쪽에서 오른쪽으로, 끝에 고리를 돌려 마무리', es: '② Traza de izquierda a derecha y termina con un bucle' },
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
      { 'zh-TW': '① 由右上往左下繞一個大弧（一筆完成）', 'zh-CN': '① 从右上往左下绕一个大弧（一笔完成）', en: '① From upper right toward lower left, circling around in one big arc (in one stroke)', ko: '① 오른쪽 위에서 왼쪽 아래로 크게 호를 그리며 돌기 (한 획으로)', es: '① Traza desde arriba a la derecha hacia abajo a la izquierda y rodea en un arco amplio (en un solo trazo)' },
    ],
  },
  h_ha: {
    count: 3,
    steps: [
      { 'zh-TW': '① 左側一長豎', 'zh-CN': '① 左侧一长竖', en: '① Long vertical stroke on the left', ko: '① 왼쪽에 긴 세로획', es: '① Haz un trazo vertical largo a la izquierda' },
      { 'zh-TW': '② 右上一短橫', 'zh-CN': '② 右上一短横', en: '② Short horizontal stroke at the upper right', ko: '② 오른쪽 위에 짧은 가로획', es: '② Haz un trazo horizontal corto arriba a la derecha' },
      { 'zh-TW': '③ 由橫往下再向右繞收', 'zh-CN': '③ 从横往下，再向右绕收', en: '③ Down from the horizontal, then looping to the right to finish', ko: '③ 가로획에서 아래로 내려 오른쪽으로 고리를 돌려 마무리', es: '③ Traza hacia abajo desde el horizontal y cierra con un bucle hacia la derecha' },
    ],
    note: { 'zh-TW': 'は 右邊一橫；ほ 右邊兩橫。', 'zh-CN': 'は 右边一横；ほ 右边两横。', en: 'は has one horizontal on the right; ほ has two.', ko: 'は는 오른쪽 가로획이 하나, ほ는 둘이다.', es: 'は tiene un horizontal a la derecha; ほ, dos.' },
  },
  h_hi: {
    count: 1,
    steps: [
      { 'zh-TW': '① 由左下往上、繞向右下再收（一筆完成）', 'zh-CN': '① 从左下往上，绕向右下再收（一笔完成）', en: '① From lower left upward, curving around toward the lower right to finish (in one stroke)', ko: '① 왼쪽 아래에서 위로, 오른쪽 아래로 돌아 마무리 (한 획으로)', es: '① Traza desde abajo a la izquierda hacia arriba, rodea hacia abajo a la derecha y cierra (en un solo trazo)' },
    ],
  },
  h_fu: {
    count: 4,
    steps: [
      { 'zh-TW': '① 上方一小點', 'zh-CN': '① 上方一小点', en: '① Small dot on top', ko: '① 위쪽에 작은 점', es: '① Haz un punto pequeño arriba' },
      { 'zh-TW': '② 左側一短撇', 'zh-CN': '② 左侧一短撇', en: '② Short sweep on the left', ko: '② 왼쪽에 짧은 삐침', es: '② Haz un trazo oblicuo corto a la izquierda' },
      { 'zh-TW': '③ 中間一短撇', 'zh-CN': '③ 中间一短撇', en: '③ Short sweep in the middle', ko: '③ 가운데에 짧은 삐침', es: '③ Haz un trazo oblicuo corto en el centro' },
      { 'zh-TW': '④ 右側一短撇', 'zh-CN': '④ 右侧一短撇', en: '④ Short sweep on the right', ko: '④ 오른쪽에 짧은 삐침', es: '④ Haz un trazo oblicuo corto a la derecha' },
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
      { 'zh-TW': '① 由左上往右下再折向左（之字）', 'zh-CN': '① 从左上往右下，再折向左（之字形）', en: '① From upper left toward lower right, then turning sharply to the left (zigzag)', ko: '① 왼쪽 위에서 오른쪽 아래로, 다시 왼쪽으로 꺾기 (지그재그)', es: '① Traza desde arriba a la izquierda hacia abajo a la derecha y quiebra hacia la izquierda (en zigzag)' },
      { 'zh-TW': '② 由中段往右上收', 'zh-CN': '② 从中段往右上收', en: '② From the middle, finishing toward the upper right', ko: '② 가운데에서 오른쪽 위로 마무리', es: '② Traza desde la mitad hacia arriba a la derecha y cierra' },
    ],
  },
  h_mu: {
    count: 3,
    steps: [
      { 'zh-TW': '① 上方一短橫', 'zh-CN': '① 上方一短横', en: '① Short horizontal stroke on top', ko: '① 위쪽에 짧은 가로획', es: '① Haz un trazo horizontal corto arriba' },
      { 'zh-TW': '② 由右上往左下繞圈', 'zh-CN': '② 从右上往左下绕圈', en: '② From upper right toward lower left, with a loop', ko: '② 오른쪽 위에서 왼쪽 아래로 고리', es: '② Traza desde arriba a la derecha hacia abajo a la izquierda con un bucle' },
      { 'zh-TW': '③ 右上補一點', 'zh-CN': '③ 右上补一点', en: '③ Dot added at the upper right', ko: '③ 오른쪽 위에 점 추가', es: '③ Añade un punto arriba a la derecha' },
    ],
    note: { 'zh-TW': 'む 右上有一點；す 沒有。', 'zh-CN': 'む 右上有一点；す 没有。', en: 'む has a dot at the upper right; す does not.', ko: 'む는 오른쪽 위에 점이 있고, す는 없다.', es: 'む tiene un punto arriba a la derecha; す no.' },
  },
  h_me: {
    count: 2,
    steps: [
      { 'zh-TW': '① 由左上往右下的撇', 'zh-CN': '① 从左上往右下的撇', en: '① Sweep from upper left to lower right', ko: '① 왼쪽 위에서 오른쪽 아래로 삐침', es: '① Haz un trazo oblicuo de arriba a la izquierda hacia abajo a la derecha' },
      { 'zh-TW': '② 由左往右收尾（不繞圈）', 'zh-CN': '② 从左往右收尾（不绕圈）', en: '② From left to right to finish (no loop)', ko: '② 왼쪽에서 오른쪽으로 마무리 (고리 없음)', es: '② Traza de izquierda a derecha y cierra (sin bucle)' },
    ],
    note: { 'zh-TW': 'め 不繞圈；ぬ 繞圈。', 'zh-CN': 'め 不绕圈；ぬ 绕圈。', en: 'め has no loop; ぬ does.', ko: 'め는 고리가 없고, ぬ는 있다.', es: 'め no tiene bucle; ぬ sí.' },
  },
  h_mo: {
    count: 3,
    steps: [
      { 'zh-TW': '① 由上往下一豎（略彎）', 'zh-CN': '① 从上往下一竖（略弯）', en: '① Vertical stroke from top to bottom (slightly curved)', ko: '① 위에서 아래로 세로획 (약간 휘게)', es: '① Haz un trazo vertical de arriba abajo (ligeramente curvo)' },
      { 'zh-TW': '② 中間一短橫', 'zh-CN': '② 中间一短横', en: '② Short horizontal stroke in the middle', ko: '② 가운데에 짧은 가로획', es: '② Haz un trazo horizontal corto en el centro' },
      { 'zh-TW': '③ 下方再一短橫', 'zh-CN': '③ 下方再一短横', en: '③ Another short horizontal stroke below', ko: '③ 아래에 짧은 가로획 하나 더', es: '③ Haz otro trazo horizontal corto debajo' },
    ],
  },
  h_ya: {
    count: 3,
    steps: [
      { 'zh-TW': '① 由左上往右下的長弧', 'zh-CN': '① 从左上往右下的长弧', en: '① Long arc from upper left to lower right', ko: '① 왼쪽 위에서 오른쪽 아래로 긴 호', es: '① Traza un arco largo de arriba a la izquierda hacia abajo a la derecha' },
      { 'zh-TW': '② 中間一短橫', 'zh-CN': '② 中间一短横', en: '② Short horizontal stroke in the middle', ko: '② 가운데에 짧은 가로획', es: '② Haz un trazo horizontal corto en el centro' },
      { 'zh-TW': '③ 右下一短撇', 'zh-CN': '③ 右下一短撇', en: '③ Short sweep at the lower right', ko: '③ 오른쪽 아래에 짧은 삐침', es: '③ Haz un trazo oblicuo corto abajo a la derecha' },
    ],
    note: { 'zh-TW': '小寫 ゃ 用於拗音。', 'zh-CN': '小写 ゃ 用于拗音。', en: 'Small ゃ is used in contracted sounds (yōon).', ko: '작은 ゃ는 요음에 쓴다.', es: 'La ゃ pequeña se usa en los sonidos contraídos (yōon).' },
  },
  h_yu: {
    count: 2,
    steps: [
      { 'zh-TW': '① 由左上繞一個大圈回到右上', 'zh-CN': '① 从左上绕一个大圈回到右上', en: '① From upper left, one big loop back up to the upper right', ko: '① 왼쪽 위에서 큰 고리를 돌아 오른쪽 위로', es: '① Traza desde arriba a la izquierda un bucle amplio que vuelve arriba a la derecha' },
      { 'zh-TW': '② 由上往下一豎穿過', 'zh-CN': '② 从上往下一竖穿过', en: '② Vertical stroke from top to bottom, cutting through', ko: '② 위에서 아래로 관통하는 세로획', es: '② Haz un trazo vertical de arriba abajo que lo atraviese' },
    ],
  },
  h_yo: {
    count: 2,
    steps: [
      { 'zh-TW': '① 由上往下一豎（略彎）', 'zh-CN': '① 从上往下一竖（略弯）', en: '① Vertical stroke from top to bottom (slightly curved)', ko: '① 위에서 아래로 세로획 (약간 휘게)', es: '① Haz un trazo vertical de arriba abajo (ligeramente curvo)' },
      { 'zh-TW': '② 中下一短橫接右彎', 'zh-CN': '② 中下一短横接右弯', en: '② Short horizontal stroke in the lower middle, continuing into a curve to the right', ko: '② 가운데 아래쪽 짧은 가로획에 이어 오른쪽으로 곡선', es: '② Haz un trazo horizontal corto abajo en el centro que continúa en una curva hacia la derecha' },
    ],
  },
  h_ra: {
    count: 2,
    steps: [
      { 'zh-TW': '① 上方一短撇', 'zh-CN': '① 上方一短撇', en: '① Short sweep on top', ko: '① 위쪽에 짧은 삐침', es: '① Haz un trazo oblicuo corto arriba' },
      { 'zh-TW': '② 由右上往左下再彎向右', 'zh-CN': '② 从右上往左下，再弯向右', en: '② From upper right toward lower left, then curving to the right', ko: '② 오른쪽 위에서 왼쪽 아래로, 다시 오른쪽으로 휘기', es: '② Traza desde arriba a la derecha hacia abajo a la izquierda y curva hacia la derecha' },
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
      { 'zh-TW': '① 由左上折向右下，末端繞一個圈（一筆完成）', 'zh-CN': '① 从左上折向右下，末端绕一个圈（一笔完成）', en: '① From upper left, turning sharply toward the lower right and ending in a loop (in one stroke)', ko: '① 왼쪽 위에서 오른쪽 아래로 꺾고 끝에 고리 (한 획으로)', es: '① Traza desde arriba a la izquierda, quiebra hacia abajo a la derecha y termina con un bucle (en un solo trazo)' },
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
      { 'zh-TW': '① 由左上折向右下再收（不繞圈）', 'zh-CN': '① 从左上折向右下再收（不绕圈）', en: '① From upper left, turning sharply toward the lower right to finish (no loop)', ko: '① 왼쪽 위에서 오른쪽 아래로 꺾어 마무리 (고리 없음)', es: '① Traza desde arriba a la izquierda, quiebra hacia abajo a la derecha y cierra (sin bucle)' },
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
      { 'zh-TW': '② 由右上往左下的撇', 'zh-CN': '② 从右上往左下的撇', en: '② Sweep from upper right to lower left', ko: '② 오른쪽 위에서 왼쪽 아래로 삐침', es: '② Haz un trazo oblicuo de arriba a la derecha hacia abajo a la izquierda' },
      { 'zh-TW': '③ 由左往右下收筆', 'zh-CN': '③ 从左往右下收笔', en: '③ From the left, finishing toward the lower right', ko: '③ 왼쪽에서 오른쪽 아래로 마무리', es: '③ Traza desde la izquierda hacia abajo a la derecha y cierra' },
    ],
    note: { 'zh-TW': '幾乎只當受詞助詞用，讀音同 お。', 'zh-CN': '几乎只用作宾语助词，读音同 お。', en: 'Used almost only as the object particle; pronounced like お.', ko: '거의 목적격 조사로만 쓰며, 발음은 お와 같다.', es: 'Se usa casi solo como partícula de objeto directo; se pronuncia como お.' },
  },
  h_n: {
    count: 1,
    steps: [
      { 'zh-TW': '① 由左上一短撇起筆，往右下拉一個長弧（一筆完成）', 'zh-CN': '① 从左上一短撇起笔，往右下拉一个长弧（一笔完成）', en: '① Short sweep from the upper left, pulled into a long arc toward the lower right (in one stroke)', ko: '① 왼쪽 위에서 짧은 삐침으로 시작해 오른쪽 아래로 긴 호 (한 획으로)', es: '① Empieza con un trazo oblicuo corto arriba a la izquierda y prolóngalo en un arco largo hacia abajo a la derecha (en un solo trazo)' },
    ],
    note: { 'zh-TW': 'ん 佔一拍；不能放在詞首。', 'zh-CN': 'ん 占一拍；不能放在词首。', en: 'ん takes one full beat (mora) and never starts a word.', ko: 'ん은 한 박(모라)을 차지하며, 단어 첫머리에 오지 않는다.', es: 'ん ocupa un tiempo (mora) y nunca va al inicio de una palabra.' },
  },
};
