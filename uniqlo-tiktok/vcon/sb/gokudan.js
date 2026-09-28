// Vコン：「違い、1分で。」#01 極暖と超極暖、1,000円ぶんの差はある？
// 尺 45秒 / 出演：店員（店名＋実名）/ 音源：環境音（トークのみ）
// 価格は2025AW参考（要一次確認）
window.SB = {
  title: '違い、1分で。#01 極暖 vs 超極暖',
  cuts: [
    { dur: 2.2, bg: '#111', footage: false, telopBig: true,
      telop: '<span style="color:#fff">極暖と超極暖、</span><br><span class="hl">1,000円</span><span style="color:#fff">ぶんの差、ある？</span>' },

    { dur: 3.8, bg: '#f4f4f4', icon: '🧥🧥🧥',
      scene: '店員バストアップ。ヒートテック3枚を左から通常・極暖・超極暖の順で胸の前に並べて持つ。店名ネーム付き',
      stickers: [{text:'通常 ¥1,290',cls:'wh'},{text:'極暖 ¥1,990',cls:'wh'},{text:'超極暖 ¥2,990',cls:'red'}],
      lt: 'ヒートテック 3段階<small>価格は2025AW参考・要確認</small>',
      sub: '◯◯店の△△です。<b>結論から</b>言います。' },

    { dur: 4.5, bg: '#fff', icon: '☝️',
      scene: '店員、カメラに向かって指1本。テンポ速く',
      telop: '差は<span class="hl">ある</span>。<br>でも「全員」じゃない。',
      sub: '差はあります。でも<b>全員に超極暖が正解</b>、ではないです。' },

    { dur: 6, bg: '#f4f4f4', icon: '🔥',
      scene: '生地の裏面アップ。通常→極暖（微起毛）→超極暖（ワッフル＋長い起毛）を指でなぞる',
      telop: '差① <span class="hl">暖かさ</span>',
      bars: [{label:'通常',pct:44,val:'1倍'},{label:'極暖',pct:66,val:'約1.5倍'},{label:'超極暖',pct:100,val:'約2.25倍'}],
      sub: '暖かさは<b>1倍・1.5倍・2.25倍</b>。数字どおり、はっきり違います。' },

    { dur: 6, bg: '#eef4ff', icon: '🌡️',
      scene: '店の入口から外を見るカット。画面に気温テロップを大きく出す',
      telop: '差② <span class="hl">気温の目安</span>',
      stickers: [{text:'15℃ → 通常',cls:'wh'},{text:'10℃ → 極暖',cls:''},{text:'5℃以下 → 超極暖',cls:'red'}],
      sub: '目安は<b>15度・10度・5度</b>。あなたの街の1月の最高気温、いくつですか。' },

    { dur: 6, bg: '#fff', icon: '👔',
      scene: '白シャツの下に着比べ。腕・首元のアップで厚みと透けを見せる',
      telop: '差③ <span class="hl">厚み</span>と着膨れ',
      stickers: [{text:'シャツの下 → 極暖まで',cls:'wh'},{text:'超極暖は1枚で着る',cls:'red'}],
      sub: '超極暖は<b>一番厚い</b>。シャツの下に入れるなら極暖まで。超極暖は1枚で着る服です。' },

    { dur: 7, bg: '#f4f4f4', icon: '⚖️',
      scene: '店員が左手・右手に1枚ずつ持ち、左右に振り分ける',
      telop: 'あなたは<span class="hl">どっち</span>？',
      cols: [{h:'通常 / 極暖', p:'通勤で電車が暑い<br>屋内メイン<br>シャツやニットの下'},{h:'超極暖', p:'屋外の仕事・観戦<br>とにかく寒がり<br>在宅で1枚で過ごす'}],
      sub: '<b>電車が暑い人</b>は極暖まで。<b>屋外・寒がり・在宅で1枚</b>なら超極暖です。' },

    { dur: 5, bg: '#fff9e0', icon: '🏷️',
      scene: '値札アップ。感謝祭の¥990プライスカードと、その横の極暖・超極暖の通常値札',
      telop: '感謝祭で<span class="hl">990円</span>になるのは<br><span class="small">通常ヒートテックだけ。極暖・超極暖は対象外</span>',
      sub: '感謝祭で安くなるのは<b>通常だけ</b>。極暖・超極暖は値段そのまま。ここ、毎年聞かれます。' },

    { dur: 4.5, bg: '#e60012', footage: false,
      endcard: '<h1>迷ったら、<br>店員に聞いて。</h1><p>コメントの質問には<br>来週の動画で答えます</p><span class="hash">#違い1分で</span>',
      sub: '' }
  ]
};
