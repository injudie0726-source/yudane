// Vコン書き出し：HTMLアニマティック → .webm（動画）＋ カットごとのPNG
// 使い方: node render.js gokudan [kando ...]
// 依存: グローバル playwright（/opt/node22/lib/node_modules/playwright）＋ 同梱Chromium
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const gRoot = execSync('npm root -g').toString().trim();
const { chromium } = require(path.join(gRoot, 'playwright'));

const here = __dirname;
const out = path.join(here, 'out');
fs.mkdirSync(out, { recursive: true });

async function renderOne(name) {
  const url = 'file://' + path.join(here, 'vcon.html') + '?sb=' + name;
  // 1) 動画
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: 1080, height: 1920 },
    deviceScaleFactor: 1,
    recordVideo: { dir: out, size: { width: 1080, height: 1920 } },
  });
  const page = await ctx.newPage();
  await page.goto(url);
  await page.waitForFunction(() => window.__started === true, null, { timeout: 20000 });
  const total = await page.evaluate(() => window.__total);
  await page.waitForFunction(() => window.__done === true, null, { timeout: (total + 15) * 1000 });
  await page.waitForTimeout(800);
  const video = page.video();
  await ctx.close();
  const tmp = await video.path();
  const dst = path.join(out, `${name}.webm`);
  fs.renameSync(tmp, dst);
  await browser.close();
  console.log('video:', dst, `(${total}s)`);

  // 2) カットごとのPNG（絵コンテ表用）
  const b2 = await chromium.launch();
  const p2 = await b2.newPage({ viewport: { width: 1080, height: 1920 } });
  const n = await (async () => {
    await p2.goto(url + '&still=0');
    await p2.waitForFunction(() => window.__ready === true, null, { timeout: 20000 });
    return await p2.evaluate(() => window.SB.cuts.length);
  })();
  const stills = [];
  for (let i = 0; i < n; i++) {
    await p2.goto(url + '&still=' + i);
    await p2.waitForFunction(() => window.__ready === true, null, { timeout: 20000 });
    await p2.waitForTimeout(300);
    const f = path.join(out, `${name}_cut${String(i + 1).padStart(2, '0')}.png`);
    await p2.screenshot({ path: f });
    stills.push(f);
  }
  await b2.close();
  console.log('stills:', stills.length);
  return { video: dst, stills };
}

(async () => {
  const names = process.argv.slice(2);
  if (!names.length) { console.error('usage: node render.js <storyboard> [...]'); process.exit(1); }
  for (const n of names) await renderOne(n);
})().catch(e => { console.error(e); process.exit(1); });
