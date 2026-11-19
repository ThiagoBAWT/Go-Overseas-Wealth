// GO OVERSEAS Wealth - gera logo (PNG transparente), papel timbrado e cartao de visitas (PDF).
// Uso: node sites/go-overseas-wealth/build.mjs
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const here = path.dirname(fileURLToPath(import.meta.url));
const tmp = path.resolve(here, '../../scratchpad_build/go-overseas/tmp');
fs.mkdirSync(tmp, { recursive: true });
const CHROME = 'C:/Users/ServerRG/.cache/puppeteer/chrome/win64-149.0.7827.22/chrome-win64/chrome.exe';

// ---- Marca (BrandGuides.txt) -------------------------------------------
const BRAND = '#0f1b3d';   // cor primaria do guia
const OCEAN = '#2a8fa8';   // secundaria: oceano
const GOLD = '#d4a95a';    // acento: champanhe
const FONT = `<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600&display=swap" rel="stylesheet">`;

const banker = { slug: 'giovanni-ortu', nome: 'Giovanni Ortu', email: 'gortu.ita@gmail.com', tel: '+55 (11) 99944-5564' };

// ---- Icone: aro (globo) aberto, seta que rompe a fronteira (ir alem-mar) ----
let _id = 0;
const mark = (ring = BRAND, arrow = GOLD) => { const m = 'm' + (_id++); return `
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="mark">
  <defs><mask id="${m}" maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100">
    <rect width="100" height="100" fill="#fff"/>
    <path d="M50 50 L82 18" stroke="#000" stroke-width="24" stroke-linecap="butt"/>
    <path d="M52 18 H84 V50 Z" fill="#000" stroke="#000" stroke-width="12" stroke-linejoin="round"/>
  </mask></defs>
  <circle cx="46" cy="54" r="36" fill="none" stroke="${ring}" stroke-width="8" mask="url(#${m})"/>
  <path d="M30 70 L68 32" stroke="${arrow}" stroke-width="10" stroke-linecap="round"/>
  <path d="M54 18 H82 V46 Z" fill="${arrow}" stroke="${arrow}" stroke-width="5" stroke-linejoin="round"/>
</svg>`; };

const lockupCss = (ink, sub) => `
  .lockup{display:inline-flex;align-items:center;gap:.4em;font-family:'Sora',sans-serif}
  .lockup .mark{height:1.1em;width:1.1em;flex:none}
  .lockup .t{display:flex;flex-direction:column;line-height:1;align-items:flex-start}
  .lockup .n{font-weight:600;letter-spacing:.14em;color:${ink};font-size:.5em;margin-right:-.14em;white-space:nowrap}
  .lockup .w{font-weight:300;color:${sub};font-size:.3em;letter-spacing:.7em;margin-top:.5em;text-transform:uppercase}`;
const lockup = (ring, arrow) => `<div class="lockup">${mark(ring, arrow)}<div class="t"><span class="n">GO OVERSEAS</span><span class="w">Wealth</span></div></div>`;

// ---- Render helpers --------------------------------------------------------
const browser = await puppeteer.launch({ headless: true, executablePath: CHROME });
const open = async (html, name, vp) => {
  const f = path.join(tmp, name);
  fs.writeFileSync(f, html);
  const p = await browser.newPage();
  if (vp) await p.setViewport(vp);
  await p.goto('file:///' + f.split(path.sep).join('/'), { waitUntil: 'networkidle0' });
  await p.evaluate(() => document.fonts.ready);
  await new Promise(r => setTimeout(r, 300));
  return p;
};

// ---- 1. Logo PNG (fundo transparente) ----------------------------------------
async function logoPng(file, ring, arrow, ink, sub) {
  const html = `<!doctype html><meta charset="utf-8">${FONT}<style>html,body{margin:0;background:transparent}
  #stage{display:inline-block;padding:44px 56px 40px;font-size:300px}${lockupCss(ink, sub)}</style><div id="stage">${lockup(ring, arrow)}</div>`;
  const p = await open(html, 'logo.html', { width: 2800, height: 1000, deviceScaleFactor: 2 });
  const el = await p.$('#stage');
  await el.screenshot({ path: path.join(here, file), omitBackground: true });
  await p.close();
}
await logoPng('go-overseas-wealth-logo.png', BRAND, GOLD, BRAND, OCEAN);
await logoPng('go-overseas-wealth-logo-branco.png', '#ffffff', GOLD, '#ffffff', '#8fd3e3');

// icone isolado (favicon / hero)
{
  const html = `<!doctype html><meta charset="utf-8"><style>html,body{margin:0;background:transparent}#s{display:inline-block;width:512px;height:512px}.mark{width:100%;height:100%}</style><div id="s">${mark('#ffffff', GOLD)}</div>`;
  const p = await open(html, 'icon.html', { width: 600, height: 600 });
  await (await p.$('#s')).screenshot({ path: path.join(here, 'go-overseas-wealth-icone.png'), omitBackground: true });
  await p.close();
}

// ---- 2. Papel timbrado A4 ---------------------------------------------------------
const icoPhone = `<svg viewBox="0 0 24 24" width="100%" height="100%"><circle cx="12" cy="12" r="12" fill="${BRAND}"/><path d="M8.2 6.6c.4-.4 1-.4 1.3.1l1 1.6c.2.4.2.8-.1 1.1l-.7.7c.6 1.2 1.6 2.2 2.8 2.8l.7-.7c.3-.3.8-.3 1.1-.1l1.6 1c.5.3.5.9.1 1.3l-.8.8c-.6.6-1.5.8-2.3.5-3-1.1-5.1-3.2-6.2-6.2-.3-.8-.1-1.7.5-2.3z" fill="#fff"/></svg>`;
const icoMail = `<svg viewBox="0 0 24 24" width="100%" height="100%"><rect x="1" y="5" width="22" height="14" rx="1.5" fill="${BRAND}"/><path d="M2 6.5l10 7 10-7" fill="none" stroke="#fff" stroke-width="1.6"/></svg>`;

{
  const b = banker;
  const html = `<!doctype html><meta charset="utf-8">${FONT}<style>
  @page{size:210mm 297mm;margin:0}*{box-sizing:border-box}html,body{margin:0}
  .pg{position:relative;width:210mm;height:297mm;overflow:hidden;background:#fff;font-family:'Sora',sans-serif}
  .logo{position:absolute;left:16mm;top:11mm;font-size:24mm}${lockupCss(BRAND, OCEAN)}
  svg.bg{position:absolute;inset:0;width:100%;height:100%}
  .ct{position:absolute;left:17.5mm;bottom:15.8mm;color:#3b4766;font-size:4.1mm;font-weight:300;line-height:1}
  .ct div{display:flex;align-items:center;gap:2.2mm;margin-top:2.4mm}.ct i{display:block;width:5.4mm;height:5.4mm}
  </style><div class="pg">
  <svg class="bg" viewBox="0 0 1414 2000" preserveAspectRatio="none">
    <rect x="975" y="235" width="554" height="3.4" fill="${GOLD}"/>
    <path d="M0 1917 H870 Q955 1917 955 1832 H1414 V2000 H0 Z" fill="${BRAND}"/>
    <path d="M955 1832 H1414 V1850 H963 Q960 1840 955 1832 Z" fill="${OCEAN}"/>
  </svg>
  <div class="logo">${lockup(BRAND, GOLD)}</div>
  <div class="ct"><div><i>${icoPhone}</i>${b.tel}</div><div><i>${icoMail}</i>${b.email}</div></div>
  </div>`;
  const p = await open(html, 'pt.html');
  await p.pdf({ path: path.join(here, `go-overseas-wealth-papel-timbrado-${b.slug}.pdf`), printBackground: true, preferCSSPageSize: true });
  await p.close();
}

// ---- 3. Cartao de visitas (frente e verso) 90 x 50 mm -----------------------------
{
  const b = banker;
  const html = `<!doctype html><meta charset="utf-8">${FONT}<style>
  @page{size:90mm 50mm;margin:0}*{box-sizing:border-box}html,body{margin:0}
  .c{position:relative;width:90mm;height:50mm;overflow:hidden;page-break-after:always;font-family:'Sora',sans-serif}
  .f{background:${BRAND};display:flex;align-items:center;justify-content:center}
  .f::before{content:'';position:absolute;inset:4.2mm;border:.3mm solid ${GOLD}}
  .f .lockup{font-size:12.5mm}${lockupCss('#fff', '#8fd3e3')}
  .v{background:#fff;color:${BRAND};display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
  .v::before{content:'';position:absolute;inset:4.2mm;border:.3mm solid ${BRAND}}
  .v .brand{font-weight:600;font-size:4.9mm;letter-spacing:.16em;margin-right:-.16em;line-height:1}
  .v .brand2{font-weight:300;font-size:2.5mm;letter-spacing:.5em;margin:.9mm -.5em 0 0;color:${OCEAN}}
  .v .nome{font-weight:400;font-size:4.7mm;margin-top:3.4mm;line-height:1}
  .v .cargo{font-weight:400;font-size:1.9mm;letter-spacing:.14em;text-transform:uppercase;color:${OCEAN};margin-top:1.4mm}
  .v .l{font-weight:300;font-size:2.9mm;margin-top:1.1mm;color:#3b4766}
  .v .l:first-of-type{margin-top:3mm}
  </style>
  <div class="c f">${lockup('#ffffff', GOLD)}</div>
  <div class="c v"><span class="brand">GO OVERSEAS</span><span class="brand2">Wealth</span>
    <span class="nome">${b.nome}</span><span class="cargo">Planejamento patrimonial</span>
    <span class="l">${b.tel}</span><span class="l">${b.email}</span></div>`;
  const p = await open(html, 'cv.html');
  await p.pdf({ path: path.join(here, `go-overseas-wealth-cartao-visita-${b.slug}.pdf`), printBackground: true, preferCSSPageSize: true });
  await p.close();
}

await browser.close();
console.log('ok');
