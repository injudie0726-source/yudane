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
    BELIEVER: 'yudane_believer',
    PWA_DISMISSED: 'pwa-dismissed'
};

// ========================================
// Believer System Constants
// ========================================
const BELIEVER = {
    BASE_ID: 10000, // 信者番号の基準値
    EXP_PER_VISIT: 10,
    EXP_PER_SSR: 50,
    EXP_PER_SR: 20,
    EXP_PER_R: 5,
    TITLES: [
        { level: 1, name: '入信者' },
        { level: 5, name: '信徒' },
        { level: 10, name: '修行者' },
        { level: 20, name: '求道者' },
        { level: 30, name: '帰依者' },
        { level: 50, name: '覚醒者' },
        { level: 100, name: '悟達者' }
    ],
    STREAK_BONUS: {
        3: 'R',    // 3日連続でR確定
        7: 'SR',   // 7日連続でSR確定
        30: 'SSR'  // 30日連続でSSR確定
    }
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
// 1.5 Sacred Geometry Background
// ========================================
class SacredGeometry {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.time = 0;
        this.patterns = [];
        this.resize();
        this.init();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
    }

    init() {
        // 幾何学パターンのパラメータ
        this.patterns = [
            { radius: 150, sides: 6, rotation: 0, speed: 0.0003 },
            { radius: 200, sides: 6, rotation: Math.PI / 6, speed: -0.0002 },
            { radius: 250, sides: 12, rotation: 0, speed: 0.0001 },
            { radius: 100, sides: 3, rotation: 0, speed: 0.0005 }
        ];
        this.animate();
    }

    drawPolygon(x, y, radius, sides, rotation) {
        this.ctx.beginPath();
        for (let i = 0; i <= sides; i++) {
            const angle = (i / sides) * Math.PI * 2 + rotation;
            const px = x + Math.cos(angle) * radius;
            const py = y + Math.sin(angle) * radius;
            if (i === 0) {
                this.ctx.moveTo(px, py);
            } else {
                this.ctx.lineTo(px, py);
            }
        }
        this.ctx.closePath();
    }

    drawFlowerOfLife(x, y, radius, count) {
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const cx = x + Math.cos(angle) * radius * 0.5;
            const cy = y + Math.sin(angle) * radius * 0.5;
            this.ctx.beginPath();
            this.ctx.arc(cx, cy, radius * 0.5, 0, Math.PI * 2);
            this.ctx.stroke();
        }
        // 中心円
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius * 0.5, 0, Math.PI * 2);
        this.ctx.stroke();
    }

    animate() {
        this.time += 1;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // ゆっくり呼吸するような透明度変化
        const breathAlpha = 0.3 + Math.sin(this.time * 0.005) * 0.15;
        this.ctx.strokeStyle = `rgba(100, 150, 200, ${breathAlpha})`;
        this.ctx.lineWidth = 0.5;

        // 幾何学パターン描画
        this.patterns.forEach(p => {
            p.rotation += p.speed;
            this.drawPolygon(this.centerX, this.centerY, p.radius, p.sides, p.rotation);
            this.ctx.stroke();
        });

        // Flower of Life（中心）
        const flowerBreath = 80 + Math.sin(this.time * 0.003) * 10;
        this.ctx.strokeStyle = `rgba(150, 180, 220, ${breathAlpha * 0.7})`;
        this.drawFlowerOfLife(this.centerX, this.centerY, flowerBreath, 6);

        // 外周の回転リング
        const outerRadius = 300 + Math.sin(this.time * 0.002) * 20;
        this.ctx.strokeStyle = `rgba(80, 120, 180, ${breathAlpha * 0.5})`;
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, outerRadius, 0, Math.PI * 2);
        this.ctx.stroke();

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
        this.drawFrame(rarity); // レアリティ別フレーム
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
     * Draw rarity-based frame
     * @param {{ name: string }} rarity - Rarity object
     */
    drawFrame(rarity) {
        const ctx = this.ctx;
        const w = this.width;
        const h = this.height;

        // N: フレームなし
        if (rarity.name === 'N') return;

        const frameStyles = {
            R: { color: 'rgba(0, 229, 255, 0.4)', width: 2, glow: 0 },
            SR: { color: 'rgba(199, 125, 255, 0.6)', width: 3, glow: 10 },
            SSR: { color: 'rgba(255, 215, 0, 0.8)', width: 4, glow: 20 }
        };

        const style = frameStyles[rarity.name];
        if (!style) return;

        const margin = 20;

        // グロー効果
        if (style.glow > 0) {
            ctx.shadowColor = style.color;
            ctx.shadowBlur = style.glow;
        }

        ctx.strokeStyle = style.color;
        ctx.lineWidth = style.width;
        ctx.beginPath();
        ctx.roundRect(margin, margin, w - margin * 2, h - margin * 2, 12);
        ctx.stroke();

        // SSR: 二重フレーム + コーナーエフェクト
        if (rarity.name === 'SSR') {
            // 内側フレーム
            ctx.strokeStyle = 'rgba(255, 215, 0, 0.3)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.roundRect(margin + 8, margin + 8, w - (margin + 8) * 2, h - (margin + 8) * 2, 8);
            ctx.stroke();

            // コーナーのダイヤモンドエフェクト
            const corners = [
                { x: margin + 12, y: margin + 12 },
                { x: w - margin - 12, y: margin + 12 },
                { x: margin + 12, y: h - margin - 12 },
                { x: w - margin - 12, y: h - margin - 12 }
            ];

            corners.forEach(corner => {
                ctx.save();
                ctx.translate(corner.x, corner.y);
                ctx.rotate(Math.PI / 4);
                ctx.fillStyle = 'rgba(255, 215, 0, 0.9)';
                ctx.fillRect(-4, -4, 8, 8);
                ctx.restore();
            });
        }

        // SR: コーナーアクセント
        if (rarity.name === 'SR') {
            const cornerSize = 30;
            ctx.strokeStyle = 'rgba(199, 125, 255, 0.8)';
            ctx.lineWidth = 2;

            // 四隅にL字アクセント
            [[margin, margin, 1, 1], [w - margin, margin, -1, 1],
            [margin, h - margin, 1, -1], [w - margin, h - margin, -1, -1]].forEach(([x, y, dx, dy]) => {
                ctx.beginPath();
                ctx.moveTo(x, y + dy * cornerSize);
                ctx.lineTo(x, y);
                ctx.lineTo(x + dx * cornerSize, y);
                ctx.stroke();
            });
        }

        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
    }

    /**
     * Download generated image (Web Share API対応)
     * iOS/Androidでシェアシートから「画像を保存」可能
     * @param {string} message - Oracle message
     * @param {{ name: string, label: string }} rarity - Rarity object
     */
    async download(message, rarity) {
        await document.fonts.ready;
        const dataUrl = this.generate(message, rarity);

        // DataURL → Blob変換
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        const file = new File([blob], `yudane_${Date.now()}.png`, { type: 'image/png' });

        // Web Share API対応チェック（iOS Safari/Android Chrome）
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            try {
                await navigator.share({
                    files: [file],
                    title: 'YUDANE - 今日の啓示',
                    text: '今日の啓示をシェア'
                });
                return; // シェア成功
            } catch (err) {
                // ユーザーがキャンセルした場合など
                if (err.name !== 'AbortError') {
                    console.warn('Share failed, falling back to download:', err);
                } else {
                    return; // キャンセルは正常終了
                }
            }
        }

        // フォールバック: 従来のダウンロード方式（PC/非対応ブラウザ）
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `yudane_${Date.now()}.png`;
        link.click();
    }
}

// ========================================
// 4. Lexicon Engine (Oracle Generator)
// 構造: 「突拍子もない免罪符」+「許可/命令」
// レアリティ別: SSR > SR > R/N
// ========================================
const LEXICON = {
    // ========================================
    // N/R用（日常のダルさ × 即効性のある解決）
    // ========================================
    common: {
        excuses: [
            '気圧がゴミだから、',
            '月曜とかいうバグのせいだし、',
            'Wi-Fi弱いし、',
            '充電15%だし、',
            '空腹は敵だから、',
            '天気アプリが曇りって言ってるし、',
            '今日金曜じゃないし、',
            '通知溜まりすぎだし、',
            '布団が離してくれないから、',
            'コーヒー切れてるし、',
            'エアコンの温度ちょうどよすぎるし、',
            '湿度やばいし、',
            '電車混みすぎだし、',
            'アラーム鳴らなかったし、',
            '夜更かししたの昨日の自分のせいだし、',
            '給料日じゃないし、',
            '服決まらないし、',
            '髪型決まらないし、',
            'メイク乗らないし、',
            'おなか空いてないし、',
            'おなか空きすぎだし、',
            '水曜日まだ終わってないし、',
            '昼飯重かったし、',
            '眠いもんは眠いし、',
            '寒いし、',
            '暑いし、',
            '蒸し暑いし、',
            '花粉飛んでるし、',
            '黄砂来てるし、',
            '低気圧接近中だし、',
            '満月だし、',
            '新月だし、',
            'バイオリズム最悪だし、',
            '血糖値乱高下してるし、',
            'カフェイン切れだし、',
            '寝不足だし、',
            '寝すぎたし、',
            'スマホ重いし、',
            'アプリ落ちるし、',
            'なんか今日そういう日だし、'
        ],
        permissions: [
            'とりあえず寝ろ。',
            'マック食って忘れろ。',
            '既読無視でOK。',
            '二度寝しろ。',
            'Uber頼め。',
            'コンビニ行け。',
            'アイス食え。',
            'ポテト食え。',
            '返信は明日。',
            'タスク閉じろ。',
            '通知オフれ。',
            'YouTube開け。',
            '推しの動画見ろ。',
            '布団に戻れ。',
            '風呂入らなくていい。',
            '歯磨きサボれ。',
            '外出なくていい。',
            '予定飛ばせ。',
            'ドタキャンでいい。',
            '「体調悪い」で。',
            '課金しろ。',
            'ガチャ回せ。',
            'カフェオレ飲め。',
            '昼寝しろ。',
            'ゲームしろ。',
            '漫画読め。',
            'TikTok見ろ。',
            'Xスクロールしろ。',
            'なんも考えるな。',
            '適当でいい。',
            '雑でいい。',
            '60点でいい。',
            'やらなくていい。',
            '後でいい。',
            '来週でいい。',
            '来月でいい。',
            '明日の自分に任せろ。',
            'バレなきゃセーフ。',
            '誰も見てない。',
            '知らんぷりで。'
        ]
    },

    // ========================================
    // SR用（メンタル自衛 × 自己肯定）
    // ========================================
    sr: {
        excuses: [
            '人間関係とかいう無理ゲーやってるから、',
            '社会が設計ミスってるから、',
            '生存本能が『無理』って言ってるから、',
            'メンタルのHP1だから、',
            'キャパ超えてるから、',
            '頑張りすぎた反動だから、',
            '限界オタクだから、',
            '自己肯定感バグってるから、',
            'ストレスのサブスク払いすぎだから、',
            '他人軸で生きすぎたから、'
        ],
        permissions: [
            '嫌いな奴はミュート。',
            '合わない奴はブロック。',
            '推しだけ見とけ。',
            '直帰していい。',
            '有給取れ。',
            '泣いていい。',
            '逃げていい。',
            '「無理」って言え。',
            '自分だけは味方しろ。',
            '甘やかせ、自分を。'
        ]
    },

    // ========================================
    // SSR用（圧倒的な真理 × 完全なる虚無）
    // ========================================
    ssr: {
        excuses: [
            'どうせ100年後は全員いないから、',
            '宇宙規模で見たらホコリだから、',
            'DNAレベルで疲れてるから、',
            '地球が回ってるだけで奇跡だから、',
            '生きてるだけでハードモードだから、',
            '人類史的にそういうフェーズだから、',
            '物理法則に従ってるだけだから、',
            '脳が「終わり」って言ってるから、',
            '存在してること自体がバグだから、',
            '時間は幻想だから、'
        ],
        permissions: [
            '今日は閉店ガラガラ。',
            '存在してるだけで100点。',
            '全部あとまわしで。',
            '何もしなくていい、マジで。',
            '生きてる、それだけでいい。',
            '考えなくていい。',
            '答え出さなくていい。',
            '意味なくていい。',
            '全部許した。',
            'おまえはもう、えらい。'
        ]
    }
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
 * Draw rarity based on probability (with streak bonus)
 * @param {number} streak - 連続参拝日数
 * @returns {{ name: string, label: string, probability: number }}
 */
function drawRarity(streak = 0) {
    // ストリークボーナス確認
    const bonus = getStreakBonus(streak);
    if (bonus) {
        return RARITY[bonus];
    }

    // 通常抽選
    const rand = Math.random();
    let cumulative = 0;
    if (rand < (cumulative += RARITY.SSR.probability)) return RARITY.SSR;
    if (rand < (cumulative += RARITY.SR.probability)) return RARITY.SR;
    if (rand < (cumulative += RARITY.R.probability)) return RARITY.R;
    return RARITY.N;
}

/**
 * Generate oracle message (2-part structure)
 * @param {{ name: string }} rarity - レアリティオブジェクト
 * @returns {string}
 */
function generateOracle(rarity) {
    // レアリティに応じたワードプールを選択
    let pool;
    switch (rarity.name) {
        case 'SSR':
            pool = LEXICON.ssr;
            break;
        case 'SR':
            pool = LEXICON.sr;
            break;
        default:
            pool = LEXICON.common;
    }

    const excuse = pool.excuses[Math.floor(Math.random() * pool.excuses.length)];
    const permission = pool.permissions[Math.floor(Math.random() * pool.permissions.length)];
    // 免罪符と許可の間に改行を入れる（「、」の後で自然に改行）
    return `${excuse}\n${permission}`;
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

// ========================================
// 8. Believer System Functions
// ========================================

/**
 * 信者データの読み込み
 */
function loadBeliever() {
    try {
        const data = localStorage.getItem(STORAGE.BELIEVER);
        return data ? JSON.parse(data) : null;
    } catch (e) {
        return null;
    }
}

/**
 * 信者データの保存
 */
function saveBeliever(believer) {
    localStorage.setItem(STORAGE.BELIEVER, JSON.stringify(believer));
}

/**
 * 信者の初期化（初回訪問時）
 */
function initBeliever() {
    let believer = loadBeliever();

    if (!believer) {
        // 新規信者を生成
        const id = BELIEVER.BASE_ID + Math.floor(Math.random() * 90000);
        believer = {
            id: id,
            createdAt: getTodayDate(),
            level: 1,
            exp: 0,
            streak: 0,
            lastVisit: null,
            totalVisits: 0,
            ssrCount: 0,
            srCount: 0,
            rCount: 0
        };
        saveBeliever(believer);
    }

    return believer;
}

/**
 * 連続参拝日数の更新
 */
function updateStreak(believer) {
    const today = getTodayDate();
    const yesterday = getYesterdayDate();

    if (believer.lastVisit === today) {
        // 今日既に参拝済み
        return believer;
    }

    if (believer.lastVisit === yesterday) {
        // 昨日参拝した → 連続
        believer.streak++;
    } else if (believer.lastVisit !== null) {
        // 連続が途切れた
        believer.streak = 1;
    } else {
        // 初回参拝
        believer.streak = 1;
    }

    believer.lastVisit = today;
    believer.totalVisits++;

    return believer;
}

/**
 * 昨日の日付を取得
 */
function getYesterdayDate() {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split('T')[0];
}

/**
 * 経験値追加とレベルアップ判定
 */
function addExp(believer, amount) {
    believer.exp += amount;

    // レベルアップ判定
    const requiredExp = believer.level * 100;
    while (believer.exp >= requiredExp) {
        believer.exp -= requiredExp;
        believer.level++;
    }

    return believer;
}

/**
 * レベルに応じた称号を取得
 */
function getTitle(level) {
    let title = BELIEVER.TITLES[0].name;
    for (const t of BELIEVER.TITLES) {
        if (level >= t.level) {
            title = t.name;
        }
    }
    return title;
}

/**
 * ストリークボーナスの取得
 */
function getStreakBonus(streak) {
    if (streak >= 30) return 'SSR';
    if (streak >= 7) return 'SR';
    if (streak >= 3) return 'R';
    return null;
}

/**
 * 儀式完了時の信者データ更新
 */
function onRitualComplete(believer, rarity) {
    // レアリティに応じた経験値
    let exp = BELIEVER.EXP_PER_VISIT;

    switch (rarity.name) {
        case 'SSR':
            exp += BELIEVER.EXP_PER_SSR;
            believer.ssrCount++;
            break;
        case 'SR':
            exp += BELIEVER.EXP_PER_SR;
            believer.srCount++;
            break;
        case 'R':
            exp += BELIEVER.EXP_PER_R;
            believer.rCount++;
            break;
    }

    believer = addExp(believer, exp);
    saveBeliever(believer);

    return believer;
}

/**
 * 信者数のシミュレーション（フェイク）
 */
function getBelieverCount() {
    const baseCount = 24847;
    const daysSinceStart = Math.floor((Date.now() - new Date('2026-01-01').getTime()) / 86400000);
    const dailyGrowth = Math.floor(Math.random() * 50) + 30;
    return baseCount + (daysSinceStart * dailyGrowth);
}

/**
 * 本日の参拝者数のシミュレーション（フェイク）
 */
function getTodayVisitors() {
    const hour = new Date().getHours();
    const base = 200 + (hour * 50);
    return base + Math.floor(Math.random() * 100);
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
            buttonContainer: document.getElementById('button-container'),
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
            installClose: document.getElementById('install-close'),
            // Believer Profile Elements
            profileBtn: document.getElementById('profile-btn'),
            profileModal: document.getElementById('profile-modal'),
            profileClose: document.getElementById('profile-close'),
            believerNumber: document.getElementById('believer-number'),
            levelValue: document.getElementById('level-value'),
            expFill: document.getElementById('exp-fill'),
            expText: document.getElementById('exp-text'),
            streakValue: document.getElementById('streak-value'),
            ssrCount: document.getElementById('ssr-count'),
            srCount: document.getElementById('sr-count'),
            titleValue: document.getElementById('title-value'),
            totalBelievers: document.getElementById('total-believers'),
            todayVisitors: document.getElementById('today-visitors'),
            // Animation Enhancement Elements
            ritualOverlay: document.getElementById('ritual-overlay'),
            sacredGeometryCanvas: document.getElementById('sacred-geometry-canvas')
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
            deferredPrompt: null,
            believer: null  // 信者データ
        };

        // Effects
        this.marineSnow = null;
        this.ssrExplosion = null;
        this.shareImageGenerator = null;
        this.sacredGeometry = null;

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

        // Believer Profile Events
        if (this.elements.profileBtn) {
            this.elements.profileBtn.addEventListener('click', () => this.openProfile());
        }
        if (this.elements.profileClose) {
            this.elements.profileClose.addEventListener('click', () => this.closeProfile());
        }
        if (this.elements.profileModal) {
            this.elements.profileModal.addEventListener('click', (e) => {
                if (e.target === this.elements.profileModal) this.closeProfile();
            });
        }

        window.addEventListener('beforeinstallprompt', (e) => this.handleInstallPrompt(e));
        window.addEventListener('appinstalled', () => this.handleAppInstalled());
    }

    async init() {
        this.marineSnow = new MarineSnow(document.getElementById('marine-snow-canvas'));
        this.ssrExplosion = new SSRParticleExplosion(document.getElementById('ssr-particles-canvas'));
        this.sacredGeometry = new SacredGeometry(this.elements.sacredGeometryCanvas);

        // 信者システム初期化
        this.state.believer = initBeliever();

        const saved = loadRitual();

        if (saved) {
            this.state.currentRitual = saved;
            this.elements.title.classList.add('fade');
            this.elements.buttonContainer.classList.add('hidden');
            this.showOracle(saved.message, saved.rarity);
        } else {
            this.elements.yudaneBtn.textContent = '読み込み中...';
            this.elements.yudaneBtn.disabled = true;

            this.generateAnxietyWords();
            this.initPhysics();
            this.setupCustomRendering();

            this.elements.yudaneBtn.textContent = '委ねる';
            this.elements.yudaneBtn.disabled = false;
        }

        // 信者数カウンター更新
        this.updateBelieverCounter();

        this.registerServiceWorker();
    }

    // ... (Physics and other methods would continue here)
    // For brevity, keeping essential methods

    releaseAnxiety() {
        if (this.state.isReleased) return;
        this.state.isReleased = true;

        this.elements.buttonContainer.classList.add('hidden');
        this.elements.title.classList.add('fade');

        // 儀式トランジション開始（暗転→光拡散）
        this.elements.ritualOverlay.classList.add('active');

        // ストリーク更新
        this.state.believer = updateStreak(this.state.believer);
        const streak = this.state.believer.streak;

        this.state.engine.gravity.y = this.config.gravityStrength;
        this.state.anxietyBodies.forEach(body => {
            Matter.Body.applyForce(body, body.position, { x: 0, y: 0.04 });
        });

        setTimeout(() => {
            // ストリークボーナスを渡してレアリティ抽選
            const rarity = drawRarity(streak);
            const message = generateOracle(rarity);
            saveRitual(message, rarity);
            this.state.currentRitual = { message, rarity };

            // 信者データ更新（経験値等）
            this.state.believer = onRitualComplete(this.state.believer, rarity);

            // GA4: レアリティイベント送信
            if (typeof gtag === 'function') {
                gtag('event', 'oracle_revealed', {
                    rarity: rarity.name,
                    rarity_label: rarity.label,
                    streak: streak
                });
            }

            // 効果音再生
            this.playRaritySound(rarity);

            this.showOracle(message, rarity);
        }, TIMING.GRAVITY_SETTLE);
    }

    showOracle(message, rarity) {
        this.elements.app.classList.remove('rarity-N', 'rarity-R', 'rarity-SR', 'rarity-SSR');
        this.elements.app.classList.add(`rarity-${rarity.name}`);

        // レアリティ別演出（パチンコ風の射幸心演出）
        this.playRarityEffect(rarity);

        this.elements.rarityBadge.textContent = rarity.label;

        // タイプライター効果で啓示を表示
        this.typewriterEffect(message);

        this.elements.oracle.classList.add('visible');
        this.elements.nextRitual.classList.add('visible');
        this.startCountdown();
    }

    /**
     * タイプライター効果（神秘的な一文字ずつ表示）
     * @param {string} text - 表示するテキスト
     */
    typewriterEffect(text) {
        const element = this.elements.oracleMessage;
        element.textContent = '';
        element.style.opacity = '1';

        let index = 0;
        const speed = 60; // ミリ秒/文字

        const type = () => {
            if (index < text.length) {
                const char = text.charAt(index);
                if (char === '\n') {
                    element.innerHTML += '<br>';
                } else {
                    element.textContent += char;
                }
                index++;
                setTimeout(type, speed);
            }
        };

        // 少し遅延させてからスタート（演出のため）
        setTimeout(type, 400);
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

    /**
     * レアリティ別効果音再生（Web Audio APIシンセサイズ）
     */
    playRaritySound(rarity) {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();

            switch (rarity.name) {
                case 'SSR':
                    // SSR: 豪華なファンファーレ（上昇音+和音）
                    this.playTone(ctx, 523.25, 0, 0.15, 0.3);   // C5
                    this.playTone(ctx, 659.25, 0.1, 0.15, 0.3); // E5
                    this.playTone(ctx, 783.99, 0.2, 0.15, 0.3); // G5
                    this.playTone(ctx, 1046.50, 0.3, 0.4, 0.4); // C6
                    // キラキラ音
                    this.playTone(ctx, 2093, 0.5, 0.1, 0.15);
                    this.playTone(ctx, 2349, 0.6, 0.1, 0.15);
                    this.playTone(ctx, 2637, 0.7, 0.15, 0.2);
                    break;

                case 'SR':
                    // SR: 上昇音（3音）
                    this.playTone(ctx, 440, 0, 0.12, 0.2);     // A4
                    this.playTone(ctx, 554.37, 0.1, 0.12, 0.2); // C#5
                    this.playTone(ctx, 659.25, 0.2, 0.2, 0.25); // E5
                    break;

                case 'R':
                    // R: 軽い上昇音（2音）
                    this.playTone(ctx, 392, 0, 0.1, 0.15);     // G4
                    this.playTone(ctx, 523.25, 0.08, 0.15, 0.18); // C5
                    break;

                default:
                    // N: 控えめな単音
                    this.playTone(ctx, 349.23, 0, 0.15, 0.12); // F4
                    break;
            }
        } catch (e) {
            // Audio context not supported
        }
    }

    /**
     * 単音再生ヘルパー
     */
    playTone(ctx, frequency, delay, duration, volume = 0.2) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.value = frequency;

        gain.gain.setValueAtTime(0, ctx.currentTime + delay);
        gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + delay + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + duration + 0.1);
    }

    // ========================================
    // Believer Profile Methods
    // ========================================

    openProfile() {
        this.updateProfileCard();
        this.elements.profileModal.classList.remove('hidden');
        this.elements.profileModal.classList.add('visible');
    }

    closeProfile() {
        this.elements.profileModal.classList.remove('visible');
        this.elements.profileModal.classList.add('hidden');
    }

    updateProfileCard() {
        const b = this.state.believer;
        if (!b) return;

        // 信者番号
        this.elements.believerNumber.textContent = String(b.id).padStart(5, '0');

        // レベル
        this.elements.levelValue.textContent = b.level;

        // EXPバー
        const requiredExp = b.level * 100;
        const expPercent = (b.exp / requiredExp) * 100;
        this.elements.expFill.style.width = `${expPercent}%`;
        this.elements.expText.textContent = `${b.exp}/${requiredExp}`;

        // ストリーク
        this.elements.streakValue.textContent = b.streak;

        // 統計
        this.elements.ssrCount.textContent = b.ssrCount;
        this.elements.srCount.textContent = b.srCount;

        // 称号
        this.elements.titleValue.textContent = getTitle(b.level);
    }

    updateBelieverCounter() {
        const total = getBelieverCount();
        const today = getTodayVisitors();

        this.elements.totalBelievers.textContent = total.toLocaleString();
        this.elements.todayVisitors.textContent = today.toLocaleString();
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
    generateAnxietyWords() {
        // フォールバックワードをシャッフルして使用
        this.config.anxietyWords = [...this.config.fallbackWords].sort(() => Math.random() - 0.5);
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
