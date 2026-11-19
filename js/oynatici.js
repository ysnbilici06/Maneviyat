// Sesli Kur'an oynatıcısı (ayet ayet, alt mini çubuk + kilit ekranı medya kontrolleri)
import { $ } from './ui.js';
import { ikon } from './ikon.js';
import { sure, sureler, sesUrl } from './kuran-veri.js';
import { tost } from './ui.js';

const ses = new Audio();
ses.preload = 'auto';
let kuyruk = [];     // [{sure, n, g}]
let sira = 0;
let sureAdi = '';
const dinleyiciler = new Set();

export const durum = () => ({ calisiyor: !ses.paused, aktif: kuyruk[sira] || null, sureAdi });
export function dinle(fn) { dinleyiciler.add(fn); return () => dinleyiciler.delete(fn); }
function haber() { dinleyiciler.forEach(f => f(durum())); ciz(); }

function ciz() {
  const el = $('#oynatici');
  const a = kuyruk[sira];
  if (!a) { el.hidden = true; document.body.classList.remove('oynatici-acik'); return; }
  el.hidden = false; document.body.classList.add('oynatici-acik');
  el.innerHTML = `<div class="esnek"><b>${sureAdi}</b>${a.n}. ayet</div>
    <button class="ikon-btn" data-o="oynat" aria-label="${ses.paused ? 'Oynat' : 'Duraklat'}">${ikon(ses.paused ? 'oynat' : 'durdur')}</button>
    <button class="ikon-btn" data-o="sonraki" aria-label="Sonraki ayet">${ikon('sonraki')}</button>
    <button class="ikon-btn" data-o="kapat" aria-label="Kapat">${ikon('kapat')}</button>`;
}

$('#oynatici').addEventListener('click', e => {
  const b = e.target.closest('[data-o]'); if (!b) return;
  if (b.dataset.o === 'oynat') ses.paused ? ses.play().catch(hata) : ses.pause();
  if (b.dataset.o === 'sonraki') git(sira + 1);
  if (b.dataset.o === 'kapat') durdur();
});

function hata() { tost(navigator.onLine ? 'Ses yüklenemedi' : 'Dinlemek için internet gerekli'); haber(); }

function medyaBilgisi() {
  if (!('mediaSession' in navigator)) return;
  const a = kuyruk[sira];
  try {
    navigator.mediaSession.metadata = new MediaMetadata({ title: `${sureAdi} · ${a.n}. ayet`, artist: 'Mişâri Râşid el-Afâsî', album: 'Maneviyat', artwork: [{ src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' }] });
    navigator.mediaSession.setActionHandler('play', () => ses.play());
    navigator.mediaSession.setActionHandler('pause', () => ses.pause());
    navigator.mediaSession.setActionHandler('nexttrack', () => git(sira + 1));
    navigator.mediaSession.setActionHandler('previoustrack', () => git(Math.max(0, sira - 1)));
  } catch {}
}

function git(i) {
  if (i >= kuyruk.length) { durdur(); return; }
  sira = i;
  ses.src = sesUrl(kuyruk[sira].g);
  ses.play().catch(hata);
  medyaBilgisi();
  haber();
}

ses.addEventListener('ended', () => git(sira + 1));
ses.addEventListener('play', haber);
ses.addEventListener('pause', haber);
ses.addEventListener('error', hata);

/** Bir sureyi verilen ayetten itibaren çal */
export async function cal(sureNo, ayetNo = 1) {
  const [v, ls] = await Promise.all([sure(sureNo), sureler()]);
  sureAdi = ls[sureNo - 1].ad + ' Sûresi';
  kuyruk = v.ayetler.map(a => ({ sure: sureNo, n: a.n, g: a.g }));
  git(Math.max(0, kuyruk.findIndex(a => a.n === Number(ayetNo))));
}

export function durdur() { ses.pause(); ses.removeAttribute('src'); kuyruk = []; sira = 0; haber(); }
export function duraklat() { ses.pause(); }
