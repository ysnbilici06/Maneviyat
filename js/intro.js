// Açılış ekranı: her açılışta (ve 15 dk'dan uzun aradan sonra dönüşte) 5 saniye boyunca
// sırayla bir ayet, hadis ya da dua gösterir. "Geç" ile atlanır, paylaşılabilir. Ayarlar'dan kapatılabilir.
import { get } from './store.js';
import { esc } from './ui.js';
import { ikon } from './ikon.js';
import { ayetGetir, refEtiket } from './kuran-veri.js';
import { INTRO_AYETLER, INTRO_HADISLER, INTRO_DUALAR } from '../data/icerik/intro.js';
import { HADISLER } from '../data/icerik/hadisler.js';
import { DUALAR } from '../data/icerik/dualar.js';
import { duaMetni } from './gunun-icerigi.js';
import { paylasPenceresi, IMZA } from './paylas.js';

const SURE_MS = 5000;
const TURLER = ['ayet', 'hadis', 'dua'];
const DURUM_ANAHTAR = 'maneviyat.intro';

function durumOku() { try { return JSON.parse(localStorage.getItem(DURUM_ANAHTAR) || '{}'); } catch { return {}; } }
function durumYaz(d) { try { localStorage.setItem(DURUM_ANAHTAR, JSON.stringify(d)); } catch {} }

/** Sıradaki içerik: türler dönüşümlü, her türde son gösterilenden farklı rastgele bir öğe */
async function icerikSec() {
  const d = durumOku();
  const sayac = (d.sayac || 0) + 1;
  const tur = TURLER[sayac % TURLER.length];
  const havuz = tur === 'ayet' ? INTRO_AYETLER : tur === 'hadis' ? INTRO_HADISLER : INTRO_DUALAR;
  let i = Math.floor(Math.random() * havuz.length);
  if (havuz.length > 1 && d['son_' + tur] === i) i = (i + 1) % havuz.length;
  durumYaz({ ...d, sayac, ['son_' + tur]: i });

  if (tur === 'ayet') {
    const x = havuz[i];
    const [ayetler, etiket] = await Promise.all([ayetGetir(x.ref), refEtiket(x.ref)]);
    return { tur, etiket: 'Günün ayeti', baslik: x.baslik, ar: ayetler.map(a => a.ar).join(' ۝ '), tr: ayetler.map(a => a.tr).join(' '), kaynak: etiket, id: 'ayet:' + x.ref, href: `#/kuran/${x.ref.split(':')[0]}?ayet=${x.ref.split(':')[1].split('-')[0]}` };
  }
  if (tur === 'hadis') {
    const h = HADISLER.find(z => z.m.startsWith(havuz[i])) || HADISLER[0];
    return { tur, etiket: 'Günün hadisi', baslik: 'Hadis-i şerif', tr: h.m, kaynak: h.k, id: 'hadis:' + h.m.slice(0, 40), href: '#/hadis' };
  }
  const dua = DUALAR.find(z => z.id === havuz[i]) || DUALAR[0];
  const m = await duaMetni(dua);
  return { tur, etiket: 'Günün duası', baslik: dua.ad, ar: m.ar, tr: m.tr, kaynak: m.etiket, id: 'dua:' + dua.id, href: `#/dua/oku/${dua.id}` };
}

let acik = false;

export async function introGoster() {
  if (acik || !get('kurulum') || get('ayarlar.intro') === false) return;
  acik = true;
  const kap = document.createElement('div');
  kap.className = 'intro';
  kap.setAttribute('role', 'dialog');
  kap.setAttribute('aria-label', 'Açılış');
  kap.innerHTML = `<div class="intro-yildizlar" aria-hidden="true"></div>
    <div class="intro-ust"><img src="icons/icon.svg" alt="" width="40" height="40"><span>Maneviyat Rehberim</span></div>
    <div class="intro-govde"><p class="intro-yuk">${ikon('yildiz', 28)}</p></div>
    <div class="intro-alt">
      <p class="intro-imza">${IMZA}</p>
      <div class="intro-cubuk"><i></i></div>
      <div class="intro-dugmeler">
        <button class="btn hayalet" data-intro="paylas" hidden>${ikon('paylas', 20)} Paylaş</button>
        <button class="btn ikincil" data-intro="gec">Geç ${ikon('ileri', 18)}</button>
      </div>
    </div>`;
  document.body.appendChild(kap);
  document.body.classList.add('intro-acik');
  requestAnimationFrame(() => kap.classList.add('gorunur'));

  let icerik = null, zaman = null, durdu = false;
  const kapat = () => {
    clearTimeout(zaman);
    kap.classList.remove('gorunur');
    kap.classList.add('kapaniyor');
    document.body.classList.remove('intro-acik');
    setTimeout(() => { kap.remove(); acik = false; }, 380);
  };

  try { icerik = await icerikSec(); } catch { icerik = null; }
  if (!icerik) { kapat(); return; }
  kap.querySelector('.intro-govde').innerHTML = `
    <p class="intro-etiket">${esc(icerik.etiket)}</p>
    ${icerik.baslik && icerik.tur !== 'hadis' ? `<h2 class="intro-baslik">${esc(icerik.baslik)}</h2>` : ''}
    ${icerik.ar && icerik.ar.length < 260 ? `<p class="intro-arapca" lang="ar" dir="rtl">${esc(icerik.ar)}</p>` : ''}
    <p class="intro-metin">${esc(icerik.tr)}</p>
    <p class="intro-kaynak">${esc(icerik.kaynak || '')}</p>`;
  kap.querySelector('[data-intro="paylas"]').hidden = false;
  kap.classList.add('dolu');
  zaman = setTimeout(kapat, SURE_MS);

  kap.addEventListener('click', e => {
    const b = e.target.closest('[data-intro]');
    if (!b) return;
    if (b.dataset.intro === 'gec') kapat();
    if (b.dataset.intro === 'paylas' && !durdu) {
      // Paylaşırken süreyi durdur
      durdu = true; clearTimeout(zaman); kap.classList.add('durdu');
      b.innerHTML = `${ikon('paylas', 20)} Paylaş`;
      paylasPenceresi(icerik);
    } else if (b.dataset.intro === 'paylas') paylasPenceresi(icerik);
  });
  const tus = e => { if (e.key === 'Escape') { kapat(); removeEventListener('keydown', tus); } };
  addEventListener('keydown', tus);
}

// Uygulamaya uzun aradan sonra dönüldüğünde de göster
let gizlendi = 0;
document.addEventListener('visibilitychange', () => {
  if (document.hidden) gizlendi = Date.now();
  else if (gizlendi && Date.now() - gizlendi > 15 * 60 * 1000) introGoster();
});
