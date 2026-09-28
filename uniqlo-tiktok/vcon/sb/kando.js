// Vコン：「違い、1分で。」#02 感動パンツとスマートアンクル、全部同じに見える問題
// 尺 40秒 / 出演：店員2名（同時に履いて並ぶ）/ 音源：環境音
window.SB = {
  title: '違い、1分で。#02 感動パンツ vs スマートアンクル',
  cuts: [
    { dur: 2.2, bg: '#111', footage: false, telopBig: true,
      telop: '<span style="color:#fff">感動パンツと</span><br><span style="color:#fff">スマートアンクル、</span><br><span class="hl">同じに見える？</span>' },

    { dur: 4, bg: '#f4f4f4', icon: '👖👖',
      scene: '店員2名が横並び。左：感動パンツ、右：スマートアンクル。同じ色・同じサイズ。足元まで全身',
      stickers: [{text:'左：感動パンツ',cls:'wh'},{text:'右：スマートアンクル',cls:'wh'}],
      sub: 'この質問、店で<b>いちばん</b>多いです。同じ色・同じサイズで並びました。' },

    { dur: 5, bg: '#fff', icon: '📏',
      scene: '足元アップ。裾の長さの差を横から。靴との距離をテロップの矢印で',
      telop: '差① <span class="hl">丈</span>',
      stickers: [{text:'感動：スラックス丈',cls:''},{text:'スマートアンクル：足首見せ',cls:'red'}],
      sub: '感動パンツは<b>普通のスラックスの丈</b>。スマートアンクルは<b>足首が見える</b>短め。' },

    { dur: 5, bg: '#f4f4f4', icon: '🔍',
      scene: 'ウエスト部分アップ。スマートアンクルのゴム、感動パンツのフックとベルトループ',
      telop: '差② <span class="hl">ウエスト</span>',
      stickers: [{text:'感動：フック＋ベルト',cls:''},{text:'スマートアンクル：ゴム入り',cls:'red'}],
      sub: 'スマートアンクルは<b>ウエストがゴム</b>。感動パンツは本格的なスラックス仕様です。' },

    { dur: 5, bg: '#eef4ff', icon: '💧',
      scene: '生地に水を一滴。感動パンツの速乾性・シワになりにくさを手でくしゃっと握って離す',
      telop: '差③ <span class="hl">生地</span>',
      stickers: [{text:'感動：速乾・シワに強い',cls:'red'},{text:'季節で夏用／冬用あり',cls:'wh'}],
      sub: '感動パンツは<b>速乾でシワに強い</b>。どちらも夏用・冬用があるので、タグを見てください。' },

    { dur: 7, bg: '#fff', icon: '⚖️',
      scene: '2人が一歩前に出て、それぞれ「こんな人」ポーズ',
      telop: 'あなたは<span class="hl">どっち</span>？',
      cols: [{h:'感動パンツ', p:'スーツ・ジャケット合わせ<br>丈は裾上げで調整<br>出張・雨の日'},{h:'スマートアンクル', p:'カジュアル・きれいめ<br>楽に履きたい<br>スニーカーと合わせる'}],
      sub: '<b>ジャケットに合わせる</b>なら感動。<b>楽にきれいめ</b>ならスマートアンクル。' },

    { dur: 5, bg: '#fff9e0', icon: '✂️',
      scene: '裾上げカウンター。店員がメジャーを当てる',
      telop: '裾上げは<span class="hl">無料</span>・当日OK<br><span class="small">丈で迷うなら感動パンツを店で合わせる</span>',
      sub: '丈で迷うなら、感動パンツを店で<b>裾上げ</b>。その場で合わせます。' },

    { dur: 4.5, bg: '#e60012', footage: false,
      endcard: '<h1>「全部同じ」<br>じゃなかった。</h1><p>次回：タックワイド／スマートも並べます</p><span class="hash">#違い1分で</span>' }
  ]
};
