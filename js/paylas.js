// Paylaşım: WhatsApp (metin / görsel), Instagram (hikâye görseli), kopyala, görseli kaydet, beğen.
// İçerik nesnesi: { tur: 'ayet'|'hadis'|'dua'|'kissa'|'zikir', baslik, ar, tr, kaynak, href, id }
import { get, guncelle } from './store.js';
import { pencere, tost, esc, dosyaIndir } from './ui.js';
import { ikon } from './ikon.js';

export const SITE = 'https://ysnbilici06.github.io/Maneviyat/';
export const UYGULAMA_ADI = 'Maneviyat Rehberim';
const TUR_ADI = { ayet: "Kur'an-ı Kerîm", hadis: 'Hadis-i şerif', dua: 'Dua', kissa: 'Kıssadan hisse', zikir: 'Zikir' };

export const icerikId = c => c.id || `${c.tur}:${(c.kaynak || '') + (c.tr || '').slice(0, 40)}`;

export function begenildiMi(c) { return get('begeniler').some(b => b.id === icerikId(c)); }

export function begeniDegistir(c) {
  const id = icerikId(c);
  let eklendi = false;
  guncelle(s => {
    const i = s.begeniler.findIndex(b => b.id === id);
    if (i >= 0) s.begeniler.splice(i, 1);
    else { s.begeniler.push({ ...c, id, zaman: Date.now() }); eklendi = true; }
  });
  return eklendi;
}

export function paylasimMetni(c) {
  return [c.baslik, c.ar, c.uzunMetin || c.tr, c.kaynak ? `— ${c.kaynak}` : '', `— ${UYGULAMA_ADI}`].filter(Boolean).join('\n\n');
}

// ---------- Görsel üretimi (canvas) ----------
function satirlaraBol(ctx, metin, genislik) {
  const satirlar = [];
  for (const parca of String(metin).split('\n')) {
    let satir = '';
    for (const kelime of parca.split(/\s+/).filter(Boolean)) {
      const dene = satir ? satir + ' ' + kelime : kelime;
      if (ctx.measureText(dene).width > genislik && satir) { satirlar.push(satir); satir = kelime; }
      else satir = dene;
    }
    if (satir) satirlar.push(satir);
  }
  return satirlar;
}

/** Metni verilen kutuya sığacak en büyük boyutla yerleştir. Döner: {satirlar, boyut, yukseklik} */
function sigdir(ctx, metin, font, enBuyuk, enKucuk, genislik, yukseklik, satirAraligi) {
  for (let b = enBuyuk; b >= enKucuk; b -= 2) {
    ctx.font = font(b);
    const satirlar = satirlaraBol(ctx, metin, genislik);
    const h = satirlar.length * b * satirAraligi;
    if (h <= yukseklik) return { satirlar, boyut: b, yukseklik: h };
  }
  ctx.font = font(enKucuk);
  let satirlar = satirlaraBol(ctx, metin, genislik);
  const sigan = Math.max(1, Math.floor(yukseklik / (enKucuk * satirAraligi)));
  if (satirlar.length > sigan) { satirlar = satirlar.slice(0, sigan); satirlar[sigan - 1] += ' …'; }
  return { satirlar, boyut: enKucuk, yukseklik: satirlar.length * enKucuk * satirAraligi };
}

function yildiz(ctx, x, y, r, renk, kalinlik) {
  ctx.save(); ctx.translate(x, y); ctx.strokeStyle = renk; ctx.lineWidth = kalinlik;
  for (const a of [0, Math.PI / 4]) { ctx.save(); ctx.rotate(a); ctx.strokeRect(-r, -r, 2 * r, 2 * r); ctx.restore(); }
  ctx.restore();
}

async function fontlariYukle() {
  if (!document.fonts || !document.fonts.load) return;
  try {
    await Promise.all([
      document.fonts.load('700 60px "Cormorant Garamond"', 'Maneviyat ğüşıöç'),
      document.fonts.load('600 60px "Cormorant Garamond"', 'ğüşıöç'),
      document.fonts.load('60px "Amiri Quran"', 'بسم'),
    ]);
  } catch {}
}

/** format: 'hikaye' (1080×1920) | 'kare' (1080×1080). Döner: Blob (png) */
export async function gorselUret(c, format = 'hikaye') {
  await fontlariYukle();
  const W = 1080, H = format === 'kare' ? 1080 : 1920;
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
  const ctx = cv.getContext('2d');

  // Gece zemini
  const g = ctx.createRadialGradient(W * 0.85, H * 0.08, 40, W * 0.6, H * 0.4, H);
  g.addColorStop(0, '#24453a'); g.addColorStop(0.35, '#18302a'); g.addColorStop(0.7, '#11211c'); g.addColorStop(1, '#0c1513');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  // Yıldızlar (sabit konumlar)
  let tohum = 7;
  const rnd = () => (tohum = (tohum * 9301 + 49297) % 233280) / 233280;
  for (let i = 0; i < 90; i++) {
    ctx.globalAlpha = 0.25 + rnd() * 0.6; ctx.fillStyle = rnd() > 0.85 ? '#d4b876' : '#f2ede1';
    ctx.beginPath(); ctx.arc(rnd() * W, rnd() * H * 0.9, rnd() * 2.2 + 0.4, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;
  // Altın çerçeve
  const m = format === 'kare' ? 40 : 56;
  ctx.strokeStyle = 'rgba(227,191,118,.55)'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.roundRect ? ctx.roundRect(m, m, W - 2 * m, H - 2 * m, 36) : ctx.rect(m, m, W - 2 * m, H - 2 * m); ctx.stroke();

  const ic = W - 2 * m - 120;
  let y = m + (format === 'kare' ? 80 : 150);
  ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';

  // Tür etiketi
  ctx.fillStyle = '#d4b876'; ctx.font = '600 30px system-ui, -apple-system, "Segoe UI", sans-serif';
  const etiket = (c.etiket || TUR_ADI[c.tur] || '').toLocaleUpperCase('tr');
  if ('letterSpacing' in ctx) ctx.letterSpacing = '6px';
  ctx.fillText(etiket, W / 2, y);
  if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';
  y += format === 'kare' ? 40 : 70;
  yildiz(ctx, W / 2, y, 14, 'rgba(227,191,118,.8)', 2.5);
  y += format === 'kare' ? 50 : 90;

  const altAlan = format === 'kare' ? 170 : 300;
  const alanY = y, alanH = H - m - altAlan - y;
  const arVar = c.ar && c.ar.length < (format === 'kare' ? 140 : 320);
  const baslikVar = c.baslik && c.tur !== 'ayet' && c.tur !== 'hadis';
  // Önce ölç, sonra bütün bloğu dikeyde ortala
  const B = baslikVar ? sigdir(ctx, c.baslik, s => `700 ${s}px "Cormorant Garamond", Georgia, serif`, 56, 40, ic, 140, 1.15) : null;
  ctx.save(); ctx.direction = 'rtl';
  const A = arVar ? sigdir(ctx, c.ar, s => `${s}px "Amiri Quran", "Geeza Pro", serif`, format === 'kare' ? 52 : 66, 34, ic, alanH * 0.4, 1.75) : null;
  ctx.restore();
  const kalanT = alanH - (B ? B.yukseklik + 30 : 0) - (A ? A.yukseklik + 50 : 0) - (c.kaynak ? 70 : 0);
  const T = sigdir(ctx, c.tr || '', s => `600 ${s}px "Cormorant Garamond", Georgia, serif`, format === 'kare' ? 58 : 72, 34, ic, kalanT, 1.3);
  const toplam = (B ? B.yukseklik + 30 : 0) + (A ? A.yukseklik + 50 : 0) + T.yukseklik + (c.kaynak ? 70 : 0);
  y = alanY + Math.max(0, (alanH - toplam) / 2);
  if (B) {
    ctx.fillStyle = '#ecdcb4'; ctx.font = `700 ${B.boyut}px "Cormorant Garamond", Georgia, serif`;
    B.satirlar.forEach((s, i) => ctx.fillText(s, W / 2, y + B.boyut + i * B.boyut * 1.15));
    y += B.yukseklik + 30;
  }
  if (A) {
    ctx.save(); ctx.direction = 'rtl'; ctx.fillStyle = '#f6efdc'; ctx.font = `${A.boyut}px "Amiri Quran", "Geeza Pro", serif`;
    A.satirlar.forEach((s, i) => ctx.fillText(s, W / 2, y + A.boyut * 1.2 + i * A.boyut * 1.75));
    ctx.restore();
    y += A.yukseklik + 50;
  }
  ctx.fillStyle = '#ffffff'; ctx.font = `600 ${T.boyut}px "Cormorant Garamond", Georgia, serif`;
  T.satirlar.forEach((s, i) => ctx.fillText(s, W / 2, y + T.boyut + i * T.boyut * 1.3));
  y += T.yukseklik;
  if (c.kaynak) {
    ctx.fillStyle = '#d4b876'; ctx.font = '500 30px system-ui, -apple-system, "Segoe UI", sans-serif';
    ctx.fillText(c.kaynak.length > 60 ? c.kaynak.slice(0, 58) + '…' : c.kaynak, W / 2, y + 60);
  }
  // Alt imza: yıldız + uygulama adı birlikte ortalı
  const ay = H - m - (format === 'kare' ? 50 : 80);
  ctx.font = '700 48px "Cormorant Garamond", Georgia, serif';
  const adG = ctx.measureText(UYGULAMA_ADI).width;
  const x0 = W / 2 - (adG + 46) / 2;
  yildiz(ctx, x0 + 14, ay - 14, 13, '#d4b876', 2.5);
  ctx.fillStyle = '#f2ede1'; ctx.textAlign = 'left';
  ctx.fillText(UYGULAMA_ADI, x0 + 46, ay);
  ctx.textAlign = 'center';

  return new Promise(coz => cv.toBlob(coz, 'image/png'));
}

// ---------- Paylaşım penceresi ----------
export async function paylasPenceresi(c) {
  const metin = paylasimMetni(c);
  const { el, kapat } = pencere(`
    <div class="paylas-onizleme"><img alt="Paylaşım görseli önizlemesi" id="pg-img"><span class="soluk kucuk" id="pg-yuk">Görsel hazırlanıyor…</span></div>
    <div class="bolumlu" role="group" aria-label="Görsel biçimi" style="margin:12px 0">
      <button aria-pressed="true" data-bicim="hikaye">Hikâye (dikey)</button><button aria-pressed="false" data-bicim="kare">Kare</button></div>
    <div class="paylas-izgara">
      <button class="paylas-btn wa" data-p="wa-metin">${ikon('sohbet', 22)}<span>WhatsApp<small>metin</small></span></button>
      <button class="paylas-btn wa" data-p="wa-gorsel">${ikon('resim', 22)}<span>WhatsApp<small>görsel</small></span></button>
      <button class="paylas-btn ig" data-p="ig">${ikon('kamera', 22)}<span>Instagram<small>hikâye / gönderi</small></span></button>
      <button class="paylas-btn" data-p="diger">${ikon('menu', 22)}<span>Diğer<small>uygulamalar</small></span></button>
      <button class="paylas-btn" data-p="kopya">${ikon('kopyala', 22)}<span>Kopyala<small>metin</small></span></button>
      <button class="paylas-btn" data-p="kaydet">${ikon('indir', 22)}<span>Kaydet<small>görsel</small></span></button>
    </div>
    <button class="btn ${begenildiMi(c) ? '' : 'ikincil'} tam" style="margin-top:12px" data-p="begen" aria-pressed="${begenildiMi(c)}">${ikon('kalp', 20)} <span>${begenildiMi(c) ? 'Beğendiklerimde' : 'Beğendiklerime ekle'}</span></button>`, { baslik: 'Paylaş' });

  // Görselleri önceden hazırla: paylaş düğmesine basıldığı anda hazır olsun (iOS kullanıcı hareketi kuralı)
  const gorseller = {};
  let bicim = 'hikaye';
  const dosya = b => new File([gorseller[b]], `maneviyat-rehberim-${c.tur || 'paylasim'}.png`, { type: 'image/png' });
  const onizle = async () => {
    if (!gorseller[bicim]) gorseller[bicim] = await gorselUret(c, bicim);
    const img = el.querySelector('#pg-img');
    if (img.src) URL.revokeObjectURL(img.src);
    img.src = URL.createObjectURL(gorseller[bicim]);
    el.querySelector('#pg-yuk').hidden = true;
    img.dataset.bicim = bicim;
  };
  onizle().then(() => { gorselUret(c, bicim === 'hikaye' ? 'kare' : 'hikaye').then(b => { gorseller[bicim === 'hikaye' ? 'kare' : 'hikaye'] = b; }); });

  const dosyaPaylas = async (b, metinle) => {
    if (!gorseller[b]) { tost('Görsel hazırlanıyor, bir saniye…'); gorseller[b] = await gorselUret(c, b); }
    const f = dosya(b);
    const veri = metinle ? { files: [f], text: metin } : { files: [f] };
    if (navigator.canShare && navigator.canShare({ files: [f] })) {
      try { await navigator.share(veri); return true; } catch (e) { if (e && e.name === 'AbortError') return true; }
    }
    dosyaIndir(f.name, gorseller[b], 'image/png');
    tost('Görsel kaydedildi; uygulamadan paylaşabilirsin');
    return false;
  };

  el.addEventListener('click', async e => {
    const bc = e.target.closest('[data-bicim]');
    if (bc) { bicim = bc.dataset.bicim; el.querySelectorAll('[data-bicim]').forEach(x => x.setAttribute('aria-pressed', x === bc)); onizle(); return; }
    const p = e.target.closest('[data-p]'); if (!p) return;
    switch (p.dataset.p) {
      case 'wa-metin': window.open('https://wa.me/?text=' + encodeURIComponent(metin), '_blank'); break;
      case 'wa-gorsel': await dosyaPaylas('kare', true); break;
      case 'ig': await dosyaPaylas('hikaye', false); break;
      case 'diger':
        if (navigator.share) { try { await navigator.share({ title: c.baslik || UYGULAMA_ADI, text: metin }); } catch {} }
        else { try { await navigator.clipboard.writeText(metin); tost('Panoya kopyalandı'); } catch { tost('Paylaşılamadı'); } }
        break;
      case 'kopya': try { await navigator.clipboard.writeText(metin); tost('Kopyalandı'); } catch { tost('Kopyalanamadı'); } break;
      case 'kaydet':
        if (!gorseller[bicim]) gorseller[bicim] = await gorselUret(c, bicim);
        dosyaIndir(`maneviyat-rehberim-${c.tur || 'paylasim'}.png`, gorseller[bicim], 'image/png'); tost('Görsel kaydedildi'); break;
      case 'begen': {
        const ek = begeniDegistir(c);
        p.setAttribute('aria-pressed', ek); p.classList.toggle('ikincil', !ek);
        p.querySelector('span').textContent = ek ? 'Beğendiklerimde' : 'Beğendiklerime ekle';
        tost(ek ? 'Beğendiklerine eklendi' : 'Beğendiklerinden çıkarıldı');
        document.dispatchEvent(new CustomEvent('begeni-degisti'));
        break;
      }
    }
  });
  el.addEventListener('close', () => { const img = el.querySelector('#pg-img'); if (img && img.src) URL.revokeObjectURL(img.src); });
  return { kapat };
}

/** Kartlarda kullanılan küçük kalp + paylaş düğmeleri */
export function eylemDugmeleri(anahtar, c) {
  const b = begenildiMi(c);
  return `<button class="ikon-btn ${b ? 'secili' : ''}" data-begen="${esc(anahtar)}" aria-pressed="${b}" aria-label="Beğen">${ikon('kalp', 20)}</button>
    <button class="ikon-btn" data-paylas="${esc(anahtar)}" aria-label="Paylaş">${ikon('paylas', 20)}</button>`;
}

/** Bir kapsayıcıdaki [data-begen] / [data-paylas] düğmelerini içerik haritasına bağlar */
export function eylemleriBagla(el, harita) {
  el.addEventListener('click', e => {
    const p = e.target.closest('[data-paylas]'), b = e.target.closest('[data-begen]');
    if (p && harita[p.dataset.paylas]) { e.preventDefault(); paylasPenceresi(harita[p.dataset.paylas]); }
    if (b && harita[b.dataset.begen]) {
      e.preventDefault();
      const ek = begeniDegistir(harita[b.dataset.begen]);
      b.classList.toggle('secili', ek); b.setAttribute('aria-pressed', ek);
      tost(ek ? 'Beğendiklerine eklendi' : 'Beğendiklerinden çıkarıldı');
    }
  });
}
