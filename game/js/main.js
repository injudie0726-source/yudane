// =============================================================
//  配達プロト v0.1
//  コア体験検証: 左右レーン切替 + バッグの慣性追従
// =============================================================

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const W = canvas.width;
const H = canvas.height;

// --- 道路レイアウト -------------------------------------------
const ROAD_X = 60;
const ROAD_W = 240;
const LANE_W = ROAD_W / 2;
const LANE_CENTERS = [ROAD_X + LANE_W / 2, ROAD_X + LANE_W * 1.5];

// --- 物理定数（ここを触ると手触りが変わる） -------------------
const PLAYER_LERP = 0.18;          // プレイヤーがレーン中心へ追従する速さ
const BAG_SPRING = 0.045;          // バッグがプレイヤーへ引かれる強さ
const BAG_DAMP = 0.18;             // バッグの揺れ減衰
const BAG_TILT = 0.025;            // バッグの傾き表現倍率
const WOBBLE_THRESHOLD = 22;       // この px 以上ズレたら "揺れすぎ"
const PLAYER_Y = H * 0.78;

// --- ゲーム状態 -----------------------------------------------
const state = createInitialState();

function createInitialState() {
    return {
        player: { lane: 0, x: LANE_CENTERS[0] },
        bag: { x: LANE_CENTERS[0], vx: 0, angle: 0 },
        obstacles: [],
        scrollY: 0,
        speed: 4,
        distance: 0,
        combo: 0,
        bestCombo: 0,
        wobbling: false,
        alive: true,
        deadAt: 0,
        time: 0,
        shake: 0,
        nextSpawnDist: 220,
    };
}

function reset() {
    Object.assign(state, createInitialState());
}

// --- 入力 -----------------------------------------------------
function setLane(l) {
    if (!state.alive) return;
    state.player.lane = l;
}

document.addEventListener('keydown', (e) => {
    if (e.repeat) return;
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') setLane(0);
    else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') setLane(1);
    else if (e.key === 'r' || e.key === 'R') reset();
});

canvas.addEventListener('pointerdown', (e) => {
    if (!state.alive) {
        // 死亡から 0.4 秒後はタップでリトライ
        if (performance.now() - state.deadAt > 400) reset();
        return;
    }
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    setLane(x < rect.width / 2 ? 0 : 1);
});

// --- 障害物スポーン -------------------------------------------
function spawnTick() {
    if (state.distance < state.nextSpawnDist) return;
    // どちらかのレーンに歩行者を出す
    const lane = Math.random() < 0.5 ? 0 : 1;
    state.obstacles.push({
        lane,
        x: LANE_CENTERS[lane],
        y: -40,
        type: 'walker',
    });
    // 速度が上がるほど間隔は詰まる
    const gap = 160 - Math.min(60, state.speed * 8) + Math.random() * 100;
    state.nextSpawnDist = state.distance + gap;
}

// --- 更新 -----------------------------------------------------
function update(dt) {
    if (!state.alive) {
        state.shake *= 0.85;
        return;
    }
    state.time += dt;

    // プレイヤーをレーン中心へ
    const targetX = LANE_CENTERS[state.player.lane];
    state.player.x += (targetX - state.player.x) * PLAYER_LERP;

    // バッグの慣性（ばね＋減衰）
    const pull = (state.player.x - state.bag.x) * BAG_SPRING;
    state.bag.vx = (state.bag.vx + pull) * (1 - BAG_DAMP);
    state.bag.x += state.bag.vx;
    state.bag.angle = (state.bag.x - state.player.x) * BAG_TILT;

    // 揺れ判定とコンボ
    const offset = Math.abs(state.bag.x - state.player.x);
    state.wobbling = offset > WOBBLE_THRESHOLD;
    if (state.wobbling) {
        state.combo = Math.max(0, state.combo - 0.04);
    } else {
        state.combo = Math.min(99, state.combo + 0.02);
    }
    if (state.combo > state.bestCombo) state.bestCombo = state.combo;

    // スクロール
    state.scrollY = (state.scrollY + state.speed) % 40;
    state.distance += state.speed * 0.1;

    // 速度はゆっくり上昇 (4 → 8)
    state.speed = 4 + Math.min(4, state.time / 8000);

    // 障害物移動・衝突
    for (const o of state.obstacles) {
        o.y += state.speed;
    }
    state.obstacles = state.obstacles.filter((o) => o.y < H + 60);

    for (const o of state.obstacles) {
        if (o.lane !== state.player.lane) continue;
        if (Math.abs(o.y - PLAYER_Y) < 26) {
            die();
            break;
        }
    }

    spawnTick();
    state.shake *= 0.85;
}

function die() {
    state.alive = false;
    state.deadAt = performance.now();
    state.shake = 14;
}

// --- 描画 -----------------------------------------------------
function draw() {
    // 揺れ
    ctx.save();
    if (state.shake > 0.5) {
        ctx.translate(
            (Math.random() - 0.5) * state.shake,
            (Math.random() - 0.5) * state.shake
        );
    }

    // 背景クリア
    ctx.fillStyle = '#2a2a3e';
    ctx.fillRect(0, 0, W, H);

    // 歩道
    ctx.fillStyle = '#3a3a52';
    ctx.fillRect(0, 0, ROAD_X, H);
    ctx.fillRect(ROAD_X + ROAD_W, 0, W - (ROAD_X + ROAD_W), H);

    // 歩道のタイル感
    ctx.strokeStyle = '#4a4a64';
    ctx.lineWidth = 1;
    for (let y = -40 + state.scrollY; y < H; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(ROAD_X, y);
        ctx.moveTo(ROAD_X + ROAD_W, y);
        ctx.lineTo(W, y);
        ctx.stroke();
    }

    // 路面
    ctx.fillStyle = '#181826';
    ctx.fillRect(ROAD_X, 0, ROAD_W, H);

    // センターの破線
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.setLineDash([16, 24]);
    ctx.lineDashOffset = -state.scrollY;
    ctx.beginPath();
    ctx.moveTo(W / 2, 0);
    ctx.lineTo(W / 2, H);
    ctx.stroke();
    ctx.setLineDash([]);

    // 路肩の黄色いライン
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(ROAD_X, 0);
    ctx.lineTo(ROAD_X, H);
    ctx.moveTo(ROAD_X + ROAD_W, 0);
    ctx.lineTo(ROAD_X + ROAD_W, H);
    ctx.stroke();

    // 障害物
    for (const o of state.obstacles) {
        // 影
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.beginPath();
        ctx.ellipse(o.x, o.y + 14, 14, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        // 本体
        ctx.font = '34px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🚶', o.x, o.y);
    }

    // プレイヤー影
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.beginPath();
    ctx.ellipse(state.player.x, PLAYER_Y + 18, 18, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // プレイヤー (チャリ)
    ctx.save();
    const lean = (LANE_CENTERS[state.player.lane] - state.player.x) * -0.025;
    ctx.translate(state.player.x, PLAYER_Y);
    ctx.rotate(lean);
    ctx.font = '38px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🚴', 0, 0);
    ctx.restore();

    // バッグ (プレイヤーの後ろ＝画面下側)
    drawBag();

    // 揺れすぎインジケータ
    if (state.wobbling && state.alive) {
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('⚠ 揺れすぎ', state.player.x, PLAYER_Y + 50);
    }

    ctx.restore();

    drawHUD();

    if (!state.alive) drawGameOver();
}

function drawBag() {
    const bx = state.bag.x;
    const by = PLAYER_Y + 26;
    ctx.save();
    ctx.translate(bx, by);
    ctx.rotate(state.bag.angle);
    // 本体
    ctx.fillStyle = state.wobbling ? '#dc2626' : '#0f8a5f';
    ctx.strokeStyle = '#052e1d';
    ctx.lineWidth = 2;
    roundRect(ctx, -20, -16, 40, 32, 5);
    ctx.fill();
    ctx.stroke();
    // ロゴっぽい文字
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('CHARI', 0, 0);
    ctx.restore();
}

function roundRect(c, x, y, w, h, r) {
    c.beginPath();
    c.moveTo(x + r, y);
    c.arcTo(x + w, y, x + w, y + h, r);
    c.arcTo(x + w, y + h, x, y + h, r);
    c.arcTo(x, y + h, x, y, r);
    c.arcTo(x, y, x + w, y, r);
    c.closePath();
}

function drawHUD() {
    // 距離
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 16px monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(`${Math.floor(state.distance)} m`, 12, 12);

    // コンボ
    const comboMul = 1 + state.combo * 0.05;
    ctx.font = 'bold 13px monospace';
    ctx.fillStyle = state.wobbling ? '#9ca3af' : '#fbbf24';
    ctx.fillText(`×${comboMul.toFixed(2)}`, 12, 32);

    // コンボバー
    const barW = 90;
    const barH = 6;
    ctx.fillStyle = '#1f2937';
    ctx.fillRect(12, 50, barW, barH);
    ctx.fillStyle = state.wobbling ? '#dc2626' : '#10b981';
    ctx.fillRect(12, 50, barW * (state.combo / 99), barH);
}

function drawGameOver() {
    // フェード
    const fadeT = Math.min(1, (performance.now() - state.deadAt) / 400);
    ctx.fillStyle = `rgba(0,0,0,${0.6 * fadeT})`;
    ctx.fillRect(0, 0, W, H);

    if (fadeT < 0.5) return;
    const t = (fadeT - 0.5) * 2;

    ctx.fillStyle = `rgba(255,255,255,${t})`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText('💥', W / 2, H / 2 - 60);
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText('配達失敗', W / 2, H / 2 - 18);

    ctx.font = 'bold 16px monospace';
    ctx.fillStyle = `rgba(251,191,36,${t})`;
    ctx.fillText(`${Math.floor(state.distance)} m`, W / 2, H / 2 + 18);

    ctx.font = '12px monospace';
    ctx.fillStyle = `rgba(156,163,175,${t})`;
    ctx.fillText(`最高コンボ ×${(1 + state.bestCombo * 0.05).toFixed(2)}`, W / 2, H / 2 + 44);

    ctx.font = '13px sans-serif';
    ctx.fillStyle = `rgba(229,231,235,${t})`;
    ctx.fillText('タップ / R でリトライ', W / 2, H / 2 + 80);
}

// --- メインループ ---------------------------------------------
let last = performance.now();
function frame(t) {
    const dt = Math.min(50, t - last);
    last = t;
    update(dt);
    draw();
    requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
