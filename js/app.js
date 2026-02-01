/**
 * YUDANE - 完全なる委任
 * Main Application Module
 * @version 2.0.0
 */

// ========================================
// Animation Timing Constants
// ========================================
const TIMING = {
    GRAVITY_SETTLE: 2800,
    FLASH_DURATION: 1500,
    COUNTDOWN_INTERVAL: 1000,
    INSTALL_PROMPT_DELAY: 5000,
    PWA_DISMISS_DURATION: 7 * 24 * 60 * 60 * 1000 // 1 week
};

// ========================================
// Storage Keys
// ========================================
const STORAGE = {
    RITUAL: 'yudane_ritual',
    PWA_DISMISSED: 'pwa-dismissed'
};

// ========================================
// 1. Marine Snow Effect
// ========================================
class MarineSnow {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.resize();
        this.init();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        const count = Math.min(80, Math.floor(window.innerWidth * window.innerHeight / 15000));
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 0.5,
                speedY: Math.random() * 0.3 + 0.1,
                speedX: (Math.random() - 0.5) * 0.2,
                opacity: Math.random() * 0.5 + 0.1,
                pulse: Math.random() * Math.PI * 2,
                pulseSpeed: Math.random() * 0.02 + 0.01
            });
        }
        this.animate();
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach(p => {
            p.y -= p.speedY;
            p.x += p.speedX + Math.sin(p.pulse) * 0.1;
            p.pulse += p.pulseSpeed;

            if (p.y < -10) {
                p.y = this.canvas.height + 10;
                p.x = Math.random() * this.canvas.width;
            }

            const flicker = 0.5 + Math.sin(p.pulse) * 0.3;
            const alpha = p.opacity * flicker;

            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(200, 220, 255, ${alpha})`;
            this.ctx.fill();

            if (p.size > 1.5) {
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(150, 180, 255, ${alpha * 0.15})`;
                this.ctx.fill();
            }
        });

        requestAnimationFrame(() => this.animate());
    }
}

// ========================================
// 2. SSR Particle Explosion
// ========================================
class SSRParticleExplosion {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.running = false;
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    explode(scale = 1) {
        this.particles = [];
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height * 0.38;
        const count = Math.floor(100 * scale);

        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2 + Math.random() * 0.3;
            const speed = (3 + Math.random() * 8) * scale;
            const size = 2 + Math.random() * 4;

            this.particles.push({
                x: centerX,
                y: centerY,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size,
                life: 1,
                decay: 0.01 + Math.random() * 0.02,
                hue: 40 + Math.random() * 20
            });
        }

        for (let i = 0; i < 30; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 50;
            this.particles.push({
                x: centerX + Math.cos(angle) * distance,
                y: centerY + Math.sin(angle) * distance,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2 - 1,
                size: 1 + Math.random() * 2,
                life: 1,
                decay: 0.005 + Math.random() * 0.01,
                hue: 45,
                sparkle: true
            });
        }

        this.running = true;
        this.animate();
    }

    animate() {
        if (!this.running) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        let alive = false;

        this.particles.forEach(p => {
            if (p.life <= 0) return;
            alive = true;

            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.1;
            p.vx *= 0.99;
            p.life -= p.decay;

            const alpha = p.life;

            if (p.sparkle) {
                this.ctx.save();
                this.ctx.translate(p.x, p.y);
                this.ctx.rotate(Date.now() * 0.01);
                this.ctx.beginPath();
                for (let i = 0; i < 4; i++) {
                    const angle = (i / 4) * Math.PI * 2;
                    this.ctx.moveTo(0, 0);
                    this.ctx.lineTo(Math.cos(angle) * p.size * 3, Math.sin(angle) * p.size * 3);
                }
                this.ctx.strokeStyle = `hsla(${p.hue}, 100%, 70%, ${alpha})`;
                this.ctx.lineWidth = 1;
                this.ctx.stroke();
                this.ctx.restore();
            } else {
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
                this.ctx.fillStyle = `hsla(${p.hue}, 100%, 60%, ${alpha})`;
                this.ctx.fill();

                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size * p.life * 2, 0, Math.PI * 2);
                this.ctx.fillStyle = `hsla(${p.hue}, 100%, 50%, ${alpha * 0.3})`;
                this.ctx.fill();
            }
        });

        if (alive) {
            requestAnimationFrame(() => this.animate());
        } else {
            this.running = false;
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
}

// ========================================
// 3. Share Image Generator
// ========================================
class ShareImageGenerator {
    constructor() {
        this.canvas = document.getElementById('share-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = 1200;
        this.height = 675;
    }

    /**
     * Generate share image
     * @param {string} message - Oracle message
     * @param {{ name: string, label: string }} rarity - Rarity object
     * @returns {string} Data URL
     */
    generate(message, rarity) {
        this.drawBackground(rarity);
        this.drawParticles(rarity);
        this.drawText(message, rarity);
        this.drawBranding();
        return this.canvas.toDataURL('image/png');
    }

    drawBackground(rarity) {
        const ctx = this.ctx;
        const w = this.width;
        const h = this.height;

        const baseColors = {
            N: ['#010610', '#041225', '#0a1f3a'],
            R: ['#010815', '#032035', '#0a3050'],
            SR: ['#0a0618', '#1a1035', '#2a1850'],
            SSR: ['#0a0608', '#1a1020', '#2a1a30']
        };

        const colors = baseColors[rarity.name] || baseColors.N;
        const gradient = ctx.createLinearGradient(0, 0, 0, h);
        gradient.addColorStop(0, colors[0]);
        gradient.addColorStop(0.5, colors[1]);
        gradient.addColorStop(1, colors[2]);

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);

        const lightColors = {
            N: 'rgba(100, 150, 200, 0.08)',
            R: 'rgba(0, 229, 255, 0.12)',
            SR: 'rgba(199, 125, 255, 0.15)',
            SSR: 'rgba(255, 215, 0, 0.2)'
        };

        const lightGrad = ctx.createRadialGradient(w * 0.3, h * 0.2, 0, w * 0.3, h * 0.2, 400);
        lightGrad.addColorStop(0, lightColors[rarity.name] || lightColors.N);
        lightGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = lightGrad;
        ctx.fillRect(0, 0, w, h);

        if (rarity.name === 'SSR') {
            const goldGlow = ctx.createRadialGradient(w * 0.5, h * 0.4, 0, w * 0.5, h * 0.4, 350);
            goldGlow.addColorStop(0, 'rgba(255, 215, 0, 0.15)');
            goldGlow.addColorStop(0.5, 'rgba(255, 165, 0, 0.08)');
            goldGlow.addColorStop(1, 'transparent');
            ctx.fillStyle = goldGlow;
            ctx.fillRect(0, 0, w, h);
        }
    }

    drawParticles(rarity) {
        const ctx = this.ctx;
        const w = this.width;
        const h = this.height;

        const particleCount = rarity.name === 'SSR' ? 60 : rarity.name === 'SR' ? 40 : 25;
        const particleColors = {
            N: 'rgba(200, 220, 255, 0.3)',
            R: 'rgba(0, 229, 255, 0.4)',
            SR: 'rgba(199, 125, 255, 0.5)',
            SSR: 'rgba(255, 215, 0, 0.6)'
        };

        for (let i = 0; i < particleCount; i++) {
            const x = Math.random() * w;
            const y = Math.random() * h;
            const size = Math.random() * 3 + 1;
            const alpha = Math.random() * 0.5 + 0.2;

            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fillStyle = particleColors[rarity.name] || particleColors.N;
            ctx.globalAlpha = alpha;
            ctx.fill();

            if (size > 2) {
                ctx.beginPath();
                ctx.arc(x, y, size * 3, 0, Math.PI * 2);
                ctx.fillStyle = particleColors[rarity.name] || particleColors.N;
                ctx.globalAlpha = alpha * 0.2;
                ctx.fill();
            }
        }

        if (rarity.name === 'SSR') {
            for (let i = 0; i < 15; i++) {
                const x = Math.random() * w;
                const y = Math.random() * h;
                this.drawSparkle(x, y, Math.random() * 8 + 4);
            }
        }

        ctx.globalAlpha = 1;
    }

    drawSparkle(x, y, size) {
        const ctx = this.ctx;
        ctx.save();
        ctx.translate(x, y);
        ctx.beginPath();
        for (let i = 0; i < 4; i++) {
            const angle = (i / 4) * Math.PI * 2;
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(angle) * size, Math.sin(angle) * size);
        }
        ctx.strokeStyle = 'rgba(255, 255, 200, 0.8)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();
    }

    drawText(message, rarity) {
        const ctx = this.ctx;
        const w = this.width;
        const h = this.height;

        const badgeY = 180;
        ctx.font = '600 20px "Zen Kaku Gothic New", sans-serif';
        ctx.textAlign = 'center';

        const badgeColors = {
            N: { bg: 'rgba(255, 255, 255, 0.08)', text: 'rgba(255, 255, 255, 0.5)', border: 'rgba(255, 255, 255, 0.1)' },
            R: { bg: 'rgba(0, 229, 255, 0.15)', text: '#00e5ff', border: 'rgba(0, 229, 255, 0.4)' },
            SR: { bg: 'rgba(199, 125, 255, 0.2)', text: '#c77dff', border: 'rgba(199, 125, 255, 0.5)' },
            SSR: { bg: 'rgba(255, 215, 0, 0.25)', text: '#ffd700', border: 'rgba(255, 215, 0, 0.6)' }
        };

        const badge = badgeColors[rarity.name] || badgeColors.N;
        const badgeText = rarity.label;
        const badgeWidth = ctx.measureText(badgeText).width + 40;

        ctx.fillStyle = badge.bg;
        ctx.strokeStyle = badge.border;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(w / 2 - badgeWidth / 2, badgeY - 15, badgeWidth, 36, 18);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = badge.text;
        ctx.fillText(badgeText, w / 2, badgeY + 7);

        const messageY = h * 0.5;
        ctx.font = '500 36px "Shippori Mincho", serif';

        const textColors = {
            N: 'rgba(255, 255, 255, 0.92)',
            R: '#b0f0ff',
            SR: '#dcc0ff',
            SSR: '#ffd700'
        };

        const textShadows = {
            N: 'rgba(100, 150, 200, 0.3)',
            R: 'rgba(0, 229, 255, 0.5)',
            SR: 'rgba(199, 125, 255, 0.6)',
            SSR: 'rgba(255, 215, 0, 0.8)'
        };

        ctx.shadowColor = textShadows[rarity.name] || textShadows.N;
        ctx.shadowBlur = rarity.name === 'SSR' ? 40 : 20;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        ctx.fillStyle = textColors[rarity.name] || textColors.N;

        const maxWidth = w - 160;
        const lines = this.wrapText(message, maxWidth, ctx);
        const lineHeight = 56;
        const startY = messageY - ((lines.length - 1) * lineHeight) / 2;

        lines.forEach((line, i) => {
            ctx.fillText(line, w / 2, startY + i * lineHeight);
        });

        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
    }

    wrapText(text, maxWidth, ctx) {
        const words = text.split('');
        const lines = [];
        let currentLine = '';

        for (const char of words) {
            const testLine = currentLine + char;
            const width = ctx.measureText(testLine).width;

            if (width > maxWidth && currentLine) {
                lines.push(currentLine);
                currentLine = char;
            } else {
                currentLine = testLine;
            }
        }

        if (currentLine) {
            lines.push(currentLine);
        }

        return lines;
    }

    drawBranding() {
        const ctx = this.ctx;
        const w = this.width;
        const h = this.height;

        ctx.font = '400 48px "Shippori Mincho", serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fillText('Y U D A N E', w / 2, 80);

        ctx.font = '300 14px "Zen Kaku Gothic New", sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.fillText('DIGITAL RELIGION FOR GEN-Z', w / 2, 110);

        const today = new Date();
        const dateStr = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`;

        ctx.font = '300 16px "Zen Kaku Gothic New", sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.fillText(dateStr, w / 2, h - 60);

        ctx.font = '300 14px "Zen Kaku Gothic New", sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.fillText('#YUDANE', w / 2, h - 35);
    }

    /**
     * Download generated image
     * @param {string} message - Oracle message
     * @param {{ name: string, label: string }} rarity - Rarity object
     */
    async download(message, rarity) {
        await document.fonts.ready;
        const dataUrl = this.generate(message, rarity);
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `yudane_${Date.now()}.png`;
        link.click();
    }
}

// ========================================
// 4. Lexicon Engine (Oracle Generator)
// 構造: 「突拍子もない免罪符」+「許可/命令」
// ========================================
const LEXICON = {
    // 免罪符: 論理的に繋がらないけど、なぜか許される理由
    excuses: [
        '今日は誰かの誕生日だから、',
        '月が綺麗だから、',
        '地球の裏側で誰かが泣いているから、',
        '宇宙はどうせ膨張しているから、',
        '誰かがあなたの代わりに頑張っているから、',
        'どこかで猫が寝ているから、',
        '空が青いから、',
        '世界のどこかで朝が来ているから、',
        '今日は素数の日だから、',
        '風が吹いているから、',
        'どこかで花が咲いているから、',
        '星が瞬いているから、',
        '海は広いから、',
        '雲が流れているから、',
        '誰かがコーヒーを淹れているから、',
        '電車がどこかで走っているから、',
        '世界のどこかで雨が降っているから、',
        '太陽はまた昇るから、',
        '誰かがあなたを思い出しているから、',
        'どこかでパンが焼けているから、',
        '地球は回り続けているから、',
        '誰かが今日も生きているから、',
        '明日もどうせ来るから、',
        '過去は変えられないから、',
        '未来は誰にもわからないから、',
        '今この瞬間は一度きりだから、',
        'あなたはここにいるから、',
        '誰も見ていないから、',
        '神様も今日は休みだから、',
        '時間は止まらないから、'
    ],

    // 許可/命令: 強迫観念を封じる免罪符
    permissions: [
        'Lサイズのポテトを食べなさい。',
        '返信しなくていい。',
        '今日は何もしなくていい。',
        '布団から出なくていい。',
        '誰にも会わなくていい。',
        'サボっていい。',
        '寝ていい。',
        '泣いていい。',
        '逃げていい。',
        '諦めていい。',
        '後回しにしていい。',
        '忘れていい。',
        '既読無視していい。',
        '断っていい。',
        '休んでいい。',
        'ダラダラしていい。',
        '夜更かししていい。',
        '二度寝していい。',
        'お菓子を食べていい。',
        '課金していい。',
        '推しを見ていい。',
        '現実逃避していい。',
        '何も考えなくていい。',
        '完璧じゃなくていい。',
        '期待に応えなくていい。',
        '頑張らなくていい。',
        'いい人でいなくていい。',
        '生産的じゃなくていい。',
        'ダメなままでいい。',
        'そのままでいい。'
    ]
};

// ========================================
// 5. Rarity System
// ========================================
const RARITY = {
    SSR: { name: 'SSR', label: '★★★★', probability: 0.01 },
    SR: { name: 'SR', label: '★★★', probability: 0.04 },
    R: { name: 'R', label: '★★', probability: 0.25 },
    N: { name: 'N', label: '★', probability: 0.70 }
};

/**
 * Draw rarity based on probability
 * @returns {{ name: string, label: string, probability: number }}
 */
function drawRarity() {
    const rand = Math.random();
    let cumulative = 0;
    if (rand < (cumulative += RARITY.SSR.probability)) return RARITY.SSR;
    if (rand < (cumulative += RARITY.SR.probability)) return RARITY.SR;
    if (rand < (cumulative += RARITY.R.probability)) return RARITY.R;
    return RARITY.N;
}

/**
 * Generate oracle message (2-part structure)
 * @returns {string}
 */
function generateOracle() {
    const excuse = LEXICON.excuses[Math.floor(Math.random() * LEXICON.excuses.length)];
    const permission = LEXICON.permissions[Math.floor(Math.random() * LEXICON.permissions.length)];
    return `${excuse}${permission}`;
}

// ========================================
// 6. Daily Seal (Storage)
// ========================================
function getTodayDate() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function saveRitual(message, rarity) {
    localStorage.setItem(STORAGE.RITUAL, JSON.stringify({
        date: getTodayDate(),
        message,
        rarity: rarity.name
    }));
}

function loadRitual() {
    try {
        const data = JSON.parse(localStorage.getItem(STORAGE.RITUAL));
        if (data && data.date === getTodayDate()) {
            return { message: data.message, rarity: RARITY[data.rarity] };
        }
    } catch (e) {
        console.warn('Failed to load ritual:', e.message);
    }
    return null;
}

function getTimeUntilMidnight() {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    return midnight - now;
}

function formatTime(ms) {
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// ========================================
// 7. Main Application Class
// ========================================
class YudaneApp {
    constructor() {
        // DOM Elements
        this.elements = {
            app: document.getElementById('app'),
            container: document.getElementById('canvas-container'),
            yudaneBtn: document.getElementById('yudane-btn'),
            oracle: document.getElementById('oracle'),
            oracleMessage: document.getElementById('oracle-message'),
            rarityBadge: document.getElementById('rarity-badge'),
            shareBtn: document.getElementById('share-btn'),
            downloadBtn: document.getElementById('download-btn'),
            nextRitual: document.getElementById('next-ritual'),
            countdown: document.getElementById('countdown'),
            title: document.getElementById('title'),
            ssrFlash: document.getElementById('ssr-flash'),
            installPrompt: document.getElementById('install-prompt'),
            installBtn: document.getElementById('install-btn'),
            installClose: document.getElementById('install-close')
        };

        // State
        this.state = {
            engine: null,
            render: null,
            runner: null,
            mouse: null,
            mouseConstraint: null,
            anxietyBodies: [],
            isReleased: false,
            canvasWidth: 0,
            canvasHeight: 0,
            currentRitual: null,
            countdownInterval: null,
            deferredPrompt: null
        };

        // Effects
        this.marineSnow = null;
        this.ssrExplosion = null;
        this.shareImageGenerator = null;

        // Config
        this.config = {
            fallbackWords: [
                '将来', 'タスク', '同調圧力', '既読', 'インボイス',
                'マウント', '自己責任', '高騰', '正解は？', 'ダルい',
                '締切', '老後', '奨学金', 'ノルマ', '残業'
            ],
            anxietyPatterns: [
                '不安', '問題', '危機', '値上げ', '高騰', '不足',
                '炎上', '批判', '事故', '被害', '悪化', '懸念'
            ],
            anxietySuffixes: ['しなきゃ', 'どうする？', 'やばい', '怖い', '無理'],
            newsFeeds: ['https://news.yahoo.co.jp/rss/topics/top-picks.xml'],
            rss2jsonApi: 'https://api.rss2json.com/v1/api.json?rss_url=',
            anxietyWords: [],
            colors: [
                'rgba(80, 120, 180, 0.6)',
                'rgba(100, 130, 170, 0.6)',
                'rgba(70, 110, 160, 0.6)',
                'rgba(90, 140, 190, 0.6)'
            ],
            objectCount: 12,
            floatForce: 0.00025,
            gravityStrength: 1.3,
            restitution: 0.55,
            friction: 0.2
        };

        this.bindEvents();
    }

    bindEvents() {
        this.elements.yudaneBtn.addEventListener('click', () => this.releaseAnxiety());
        this.elements.shareBtn.addEventListener('click', () => this.shareToX());
        this.elements.downloadBtn.addEventListener('click', () => this.downloadImage());

        if (this.elements.installBtn) {
            this.elements.installBtn.addEventListener('click', () => this.installPWA());
        }

        if (this.elements.installClose) {
            this.elements.installClose.addEventListener('click', () => this.dismissInstallPrompt());
        }

        window.addEventListener('beforeinstallprompt', (e) => this.handleInstallPrompt(e));
        window.addEventListener('appinstalled', () => this.handleAppInstalled());
    }

    async init() {
        this.marineSnow = new MarineSnow(document.getElementById('marine-snow-canvas'));
        this.ssrExplosion = new SSRParticleExplosion(document.getElementById('ssr-particles-canvas'));

        const saved = loadRitual();

        if (saved) {
            this.state.currentRitual = saved;
            this.elements.title.classList.add('fade');
            this.elements.yudaneBtn.classList.add('hidden');
            this.showOracle(saved.message, saved.rarity);
        } else {
            this.elements.yudaneBtn.textContent = '読み込み中...';
            this.elements.yudaneBtn.disabled = true;

            await this.generateAnxietyWords();
            this.initPhysics();
            this.setupCustomRendering();

            this.elements.yudaneBtn.textContent = '委ねる';
            this.elements.yudaneBtn.disabled = false;
        }

        this.registerServiceWorker();
    }

    // ... (Physics and other methods would continue here)
    // For brevity, keeping essential methods

    releaseAnxiety() {
        if (this.state.isReleased) return;
        this.state.isReleased = true;

        this.elements.yudaneBtn.classList.add('hidden');
        this.elements.title.classList.add('fade');

        this.state.engine.gravity.y = this.config.gravityStrength;
        this.state.anxietyBodies.forEach(body => {
            Matter.Body.applyForce(body, body.position, { x: 0, y: 0.04 });
        });

        setTimeout(() => {
            const rarity = drawRarity();
            const message = generateOracle();
            saveRitual(message, rarity);
            this.state.currentRitual = { message, rarity };
            this.showOracle(message, rarity);
        }, TIMING.GRAVITY_SETTLE);
    }

    showOracle(message, rarity) {
        this.elements.app.classList.remove('rarity-N', 'rarity-R', 'rarity-SR', 'rarity-SSR');
        this.elements.app.classList.add(`rarity-${rarity.name}`);

        // レアリティ別演出（パチンコ風の射幸心演出）
        this.playRarityEffect(rarity);

        this.elements.rarityBadge.textContent = rarity.label;
        this.elements.oracleMessage.textContent = message;

        this.elements.oracle.classList.add('visible');
        this.elements.nextRitual.classList.add('visible');
        this.startCountdown();
    }

    /**
     * レアリティ別演出（N < R < SR < SSR）
     * @param {{ name: string }} rarity
     */
    playRarityEffect(rarity) {
        const flashEl = this.elements.ssrFlash;

        switch (rarity.name) {
            case 'SSR':
                // SSR: 最大演出（フラッシュ+爆発+振動+スクリーンシェイク）
                flashEl.classList.add('active', 'ssr');
                this.ssrExplosion.explode();
                if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 200]);
                document.body.classList.add('screen-shake');
                setTimeout(() => {
                    flashEl.classList.remove('active', 'ssr');
                    document.body.classList.remove('screen-shake');
                }, TIMING.FLASH_DURATION);
                break;

            case 'SR':
                // SR: フラッシュ+軽い振動+パーティクル少なめ
                flashEl.classList.add('active', 'sr');
                this.ssrExplosion.explode(0.5); // 50%の規模
                if (navigator.vibrate) navigator.vibrate([80, 40, 80]);
                setTimeout(() => flashEl.classList.remove('active', 'sr'), 1000);
                break;

            case 'R':
                // R: 軽いフラッシュのみ
                flashEl.classList.add('active', 'r');
                if (navigator.vibrate) navigator.vibrate([50]);
                setTimeout(() => flashEl.classList.remove('active', 'r'), 600);
                break;

            default:
                // N: 演出なし（静かに表示）
                break;
        }
    }

    startCountdown() {
        if (this.state.countdownInterval) clearInterval(this.state.countdownInterval);
        const update = () => { this.elements.countdown.textContent = formatTime(getTimeUntilMidnight()); };
        update();
        this.state.countdownInterval = setInterval(update, TIMING.COUNTDOWN_INTERVAL);
    }

    shareToX() {
        if (!this.state.currentRitual) return;
        const { message, rarity } = this.state.currentRitual;

        if (rarity.name === 'SSR') {
            this.elements.ssrFlash.classList.add('active');
            this.ssrExplosion.explode();
            setTimeout(() => this.elements.ssrFlash.classList.remove('active'), TIMING.FLASH_DURATION);
        }

        let tweetText;
        if (rarity.name === 'SSR') {
            tweetText = `🌟✨ SSR神託を授かりました ✨🌟\n\n「${message}」\n\n運命の言葉を受け取りました。\n\n#YUDANE #SSR神託`;
        } else if (rarity.name === 'SR') {
            tweetText = `💜 SR神託を引きました！\n\n${message}\n\n#YUDANE`;
        } else if (rarity.name === 'R') {
            tweetText = `💎 R神託：\n${message}\n\n#YUDANE`;
        } else {
            tweetText = `今日の神託：\n${message}\n\n#YUDANE`;
        }

        const url = window.location.origin + '/';
        const encoded = encodeURIComponent(tweetText);
        window.open(`https://twitter.com/intent/tweet?text=${encoded}&url=${encodeURIComponent(url)}`, '_blank', 'width=550,height=500');
    }

    async downloadImage() {
        if (!this.state.currentRitual) return;
        if (!this.shareImageGenerator) {
            this.shareImageGenerator = new ShareImageGenerator();
        }
        await this.shareImageGenerator.download(this.state.currentRitual.message, this.state.currentRitual.rarity);
    }

    handleInstallPrompt(e) {
        e.preventDefault();
        this.state.deferredPrompt = e;

        const dismissed = localStorage.getItem(STORAGE.PWA_DISMISSED);
        if (dismissed && Date.now() - parseInt(dismissed) < TIMING.PWA_DISMISS_DURATION) {
            return;
        }

        setTimeout(() => {
            this.elements.installPrompt.classList.remove('hidden');
        }, TIMING.INSTALL_PROMPT_DELAY);
    }

    async installPWA() {
        if (!this.state.deferredPrompt) return;

        this.state.deferredPrompt.prompt();
        await this.state.deferredPrompt.userChoice;

        this.state.deferredPrompt = null;
        this.elements.installPrompt.classList.add('hidden');
    }

    dismissInstallPrompt() {
        this.elements.installPrompt.classList.add('hidden');
        localStorage.setItem(STORAGE.PWA_DISMISSED, Date.now().toString());
    }

    handleAppInstalled() {
        this.elements.installPrompt.classList.add('hidden');
        this.state.deferredPrompt = null;
    }

    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .catch((error) => {
                    console.warn('SW registration failed:', error.message);
                });
        }
    }

    // Physics methods
    async generateAnxietyWords() {
        const news = await this.fetchNewsKeywords();
        if (news.length >= 4) {
            const phrases = news.map(k => Math.random() > 0.5 ?
                k + this.config.anxietySuffixes[Math.floor(Math.random() * this.config.anxietySuffixes.length)] : k);
            const mixed = [...phrases.slice(0, 8), ...this.config.fallbackWords.slice(0, 7)];
            this.config.anxietyWords = mixed.sort(() => Math.random() - 0.5);
        } else {
            this.config.anxietyWords = [...this.config.fallbackWords];
        }
    }

    async fetchNewsKeywords() {
        const keywords = new Set();
        try {
            const res = await fetch(this.config.rss2jsonApi + encodeURIComponent(this.config.newsFeeds[0]));
            const data = await res.json();
            if (data.status === 'ok' && data.items) {
                data.items.forEach(item => {
                    this.config.anxietyPatterns.forEach(p => {
                        if (item.title.includes(p)) keywords.add(p);
                    });
                    const katakana = item.title.match(/[ァ-ヶー]{2,6}/g);
                    if (katakana) katakana.forEach(k => {
                        if (!['ニュース', 'トップ'].includes(k)) keywords.add(k);
                    });
                });
            }
        } catch (e) {
            console.warn('News fetch failed:', e.message);
        }
        return Array.from(keywords);
    }

    getCanvasSize() {
        this.state.canvasWidth = window.innerWidth;
        this.state.canvasHeight = window.innerHeight;
    }

    initPhysics() {
        const { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint } = Matter;

        this.getCanvasSize();
        this.state.engine = Engine.create();
        this.state.engine.gravity.y = 0;
        this.state.engine.gravity.x = 0;

        this.state.render = Render.create({
            element: this.elements.container,
            engine: this.state.engine,
            options: {
                width: this.state.canvasWidth,
                height: this.state.canvasHeight,
                wireframes: false,
                background: 'transparent',
                pixelRatio: Math.min(window.devicePixelRatio, 2)
            }
        });

        // Create walls
        const wallThickness = 100;
        const walls = [
            Bodies.rectangle(this.state.canvasWidth / 2, this.state.canvasHeight + wallThickness / 2, this.state.canvasWidth * 2, wallThickness, { isStatic: true, render: { visible: false } }),
            Bodies.rectangle(-wallThickness / 2, this.state.canvasHeight / 2, wallThickness, this.state.canvasHeight * 2, { isStatic: true, render: { visible: false } }),
            Bodies.rectangle(this.state.canvasWidth + wallThickness / 2, this.state.canvasHeight / 2, wallThickness, this.state.canvasHeight * 2, { isStatic: true, render: { visible: false } })
        ];
        Composite.add(this.state.engine.world, walls);

        // Create anxiety bodies
        const centerX = this.state.canvasWidth / 2;
        const centerY = this.state.canvasHeight * 0.45;

        for (let i = 0; i < this.config.objectCount; i++) {
            const word = this.config.anxietyWords[i % this.config.anxietyWords.length];
            const size = 30 + Math.random() * 25;
            const x = centerX + (Math.random() - 0.5) * 350;
            const y = centerY + (Math.random() - 0.5) * 280;

            const body = Bodies.circle(x, y, size, {
                restitution: this.config.restitution,
                friction: this.config.friction,
                frictionAir: 0.02,
                label: word,
                render: { fillStyle: 'transparent' }
            });

            body.initialX = x;
            body.initialY = y;
            body.floatPhase = Math.random() * Math.PI * 2;

            this.state.anxietyBodies.push(body);
        }

        Composite.add(this.state.engine.world, this.state.anxietyBodies);

        // Mouse interaction
        this.state.mouse = Mouse.create(this.state.render.canvas);
        this.state.mouseConstraint = MouseConstraint.create(this.state.engine, {
            mouse: this.state.mouse,
            constraint: {
                stiffness: 0.1,
                damping: 0.1,
                render: { visible: false }
            }
        });
        Composite.add(this.state.engine.world, this.state.mouseConstraint);
        this.state.render.mouse = this.state.mouse;

        // Runner
        this.state.runner = Runner.create();
        Runner.run(this.state.runner, this.state.engine);
        Render.run(this.state.render);
    }

    setupCustomRendering() {
        const { Events, Body } = Matter;

        Events.on(this.state.engine, 'beforeUpdate', () => {
            if (!this.state.isReleased) {
                this.state.anxietyBodies.forEach((body, index) => {
                    body.floatPhase += 0.015;
                    const offsetY = Math.sin(body.floatPhase) * 0.4;
                    const offsetX = Math.cos(body.floatPhase * 0.7 + index) * 0.2;
                    Body.applyForce(body, body.position, {
                        x: offsetX * this.config.floatForce,
                        y: offsetY * this.config.floatForce
                    });
                });
            }
        });

        Events.on(this.state.render, 'afterRender', () => {
            const ctx = this.state.render.context;
            ctx.save();
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            this.state.anxietyBodies.forEach(body => {
                const fontSize = Math.max(11, body.circleRadius * 0.55);
                ctx.font = `400 ${fontSize}px 'Zen Kaku Gothic New', sans-serif`;

                const alpha = this.state.isReleased ? Math.max(0, 1 - (body.position.y / this.state.canvasHeight) * 0.8) : 0.7;
                ctx.fillStyle = `rgba(200, 220, 255, ${alpha})`;

                ctx.save();
                ctx.translate(body.position.x, body.position.y);
                ctx.rotate(body.angle);
                ctx.fillText(body.label, 0, 0);
                ctx.restore();
            });

            ctx.restore();
        });
    }
}

// ========================================
// Bootstrap
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    const app = new YudaneApp();
    app.init();
});
