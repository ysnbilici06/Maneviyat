// Ortak arayüz parçaları
import { ikon } from './ikon.js';
import { get } from './store.js';

export const $ = (s, k = document) => k.querySelector(s);
export const $$ = (s, k = document) => Array.from(k.querySelectorAll(s));

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ESC[c]);

/** Üst başlık. {baslik, alt, geri:true|'#/rota', sag:'html'} */
export function ustBaslik({ baslik = '', alt = '', geri = false, sag = '' } = {}) {
  const el = $('#ust');
  const geriHtml = geri
    ? `<button class="ikon-btn" data-geri="${typeof geri === 'string' ? esc(geri) : ''}" aria-label="Geri">${ikon('geri')}</button>`
    : '';
  el.className = 'ust' + (geri ? ' ust-alt' : '');
  el.innerHTML = `${geriHtml}<div class="ust-metin"><h1>${esc(baslik)}</h1>${alt ? `<p>${alt}</p>` : ''}</div><div class="ust-sag">${sag}</div>`;
  document.title = baslik ? `${baslik} · Maneviyat` : 'Maneviyat';
}

let tostZaman = null;
export function tost(metin) {
  const t = $('#tost');
  t.textContent = metin;
  t.classList.add('gorunur');
  clearTimeout(tostZaman);
  tostZaman = setTimeout(() => t.classList.remove('gorunur'), 2600);
}

export function bos(ikonAdi, metin, eylem = '') {
  return `<div class="bos">${ikon(ikonAdi, 40)}<p>${metin}</p>${eylem}</div>`;
}

/** Alttan açılan pencere. icerik: html. Döner: {kapat, el} */
export function pencere(icerik, { baslik = '' } = {}) {
  const d = document.createElement('dialog');
  d.className = 'pencere';
  d.innerHTML = `<div class="pencere-ic">${baslik ? `<div class="pencere-ust"><h2>${esc(baslik)}</h2><button class="ikon-btn" data-kapat aria-label="Kapat">${ikon('kapat')}</button></div>` : ''}${icerik}</div>`;
  document.body.appendChild(d);
  const kapat = () => { d.close(); };
  d.addEventListener('close', () => d.remove());
  d.addEventListener('click', e => {
    if (e.target === d || e.target.closest('[data-kapat]')) kapat();
  });
  if (typeof d.showModal === 'function') d.showModal();
  else {
    // iOS 15.3 ve öncesi: <dialog> desteği yok
    d.setAttribute('open', ''); d.classList.add('yedek-pencere');
    d.close = () => { d.removeAttribute('open'); d.dispatchEvent(new Event('close')); };
  }
  return { kapat, el: d };
}

export function onayla(metin, { evet = 'Evet', hayir = 'Vazgeç', tehlike = false } = {}) {
  return new Promise(coz => {
    const { el, kapat } = pencere(`<p class="onay-metin">${metin}</p>
      <div class="btn-sira"><button class="btn ikincil" data-c="0">${hayir}</button><button class="btn ${tehlike ? 'tehlike' : ''}" data-c="1">${evet}</button></div>`);
    let sonuc = false;
    el.addEventListener('click', e => { const b = e.target.closest('[data-c]'); if (b) { sonuc = b.dataset.c === '1'; kapat(); } });
    el.addEventListener('close', () => coz(sonuc));
  });
}

export function titret(ms = 15) {
  if (get('ayarlar.titresim') && navigator.vibrate) { try { navigator.vibrate(ms); } catch {} }
}

/** Ayet bloğu: {ar, ok, tr, ref} */
export function ayetBlok(a, { ref = '', eylemler = '', gizle = {} } = {}) {
  const o = get('ayarlar.okuma');
  return `<article class="ayet" ${a.id ? `id="${a.id}"` : ''}>
    ${ref ? `<div class="ayet-ust"><span class="rozet">${esc(ref)}</span><span class="ayet-eylem">${eylemler}</span></div>` : ''}
    ${o.ar && !gizle.ar && a.ar ? `<p class="arapca" lang="ar" dir="rtl">${esc(a.ar)}</p>` : ''}
    ${o.ok && !gizle.ok && a.ok ? `<p class="okunus">${esc(a.ok)}</p>` : ''}
    ${o.tr && !gizle.tr && a.tr ? `<p class="meal">${esc(a.tr)}</p>` : ''}
  </article>`;
}

export async function paylas(metin, baslik = 'Maneviyat') {
  try {
    if (navigator.share) { await navigator.share({ title: baslik, text: metin }); return; }
  } catch (e) { if (e && e.name === 'AbortError') return; }
  try { await navigator.clipboard.writeText(metin); tost('Panoya kopyalandı'); }
  catch { tost('Paylaşılamadı'); }
}

export function dosyaIndir(ad, metin, tur = 'application/json') {
  const url = URL.createObjectURL(new Blob([metin], { type: tur }));
  const a = document.createElement('a');
  a.href = url; a.download = ad; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
