// Uygulama kabuğu: yönlendirici, alt menü, tema, servis çalışanı
import { get, dinle } from './store.js';
import { $, $$ } from './ui.js';
import { ikon } from './ikon.js';
import { bildirimleriPlanla } from './bildirim.js';

export const UYGULAMA_ADI = 'Maneviyat';

// [desen, modül, fonksiyon]
const ROTALAR = [
  ['', 'bugun'],
  ['karsilama', 'karsilama'],
  ['gun/:tur', 'gun'],
  ['namaz', 'namaz'],
  ['namaz/gecmis', 'namaz', 'gecmis'],
  ['kible', 'kible'],
  ['kaza', 'kaza'],
  ['zikir', 'zikir'],
  ['zikir/say/:id', 'zikir', 'say'],
  ['zikir/grup/:id', 'zikir', 'grup'],
  ['dua', 'dua'],
  ['dua/yaz', 'dua', 'yaz'],
  ['dua/kutuphane', 'dua', 'kutuphane'],
  ['dua/kutuphane/:kat', 'dua', 'kategori'],
  ['dua/oku/:id', 'dua', 'oku'],
  ['kissa', 'kissa'],
  ['kissa/:id', 'kissa', 'oku'],
  ['his', 'his'],
  ['his/:k', 'his', 'sonuc'],
  ['kuran', 'kuran'],
  ['kuran/:sure', 'kuran', 'oku'],
  ['hadis', 'hadis'],
  ['hadis/:konu', 'hadis', 'konu'],
  ['ilmihal', 'ilmihal'],
  ['ilmihal/:id', 'ilmihal', 'oku'],
  ['gunluk', 'gunluk'],
  ['gunluk/yaz/:id', 'gunluk', 'yaz'],
  ['ayarlar', 'ayarlar'],
  ['daha', 'daha'],
  ['tasarim', 'tasarim'],
];

const SEKMELER = [
  { k: 'bugun', ad: 'Bugün', ikon: 'ev', href: '#/' },
  { k: 'namaz', ad: 'Namaz', ikon: 'saat', href: '#/namaz' },
  { k: 'kuran', ad: "Kur'an", ikon: 'kitap', href: '#/kuran' },
  { k: 'zikir', ad: 'Zikir', ikon: 'tesbih', href: '#/zikir' },
  { k: 'daha', ad: 'Daha', ikon: 'menu', href: '#/daha' },
];

function sekmeBul(yol) {
  const ilk = yol.split('/')[0];
  if (ilk === '') return 'bugun';
  if (['namaz', 'kible', 'kaza'].includes(ilk)) return 'namaz';
  if (ilk === 'kuran') return 'kuran';
  if (ilk === 'zikir') return 'zikir';
  if (ilk === 'gun') return 'bugun';
  return 'daha';
}

function eslestir(yol) {
  const p = yol.split('/');
  for (const [desen, m, f] of ROTALAR) {
    const d = desen.split('/');
    if (d.length !== p.length) continue;
    const params = {};
    let tamam = true;
    for (let i = 0; i < d.length; i++) {
      if (d[i].startsWith(':')) params[d[i].slice(1)] = decodeURIComponent(p[i]);
      else if (d[i] !== p[i]) { tamam = false; break; }
    }
    if (tamam) return { m, f: f || 'default', params };
  }
  return null;
}

let temizle = null;
let gecisNo = 0;

async function yonlendir() {
  const ham = location.hash.replace(/^#\/?/, '');
  const [yol, sorgu = ''] = ham.split('?');
  const q = Object.fromEntries(new URLSearchParams(sorgu));

  if (!get('kurulum') && yol !== 'karsilama') { location.replace('#/karsilama'); return; }

  const es = eslestir(yol.replace(/\/$/, '')) || { m: 'bugun', f: 'default', params: {} };
  const no = ++gecisNo;
  if (typeof temizle === 'function') { try { temizle(); } catch {} }
  temizle = null;

  const sekme = sekmeBul(yol);
  $$('.sekme').forEach(a => {
    const aktif = a.dataset.k === sekme;
    a.classList.toggle('aktif', aktif);
    if (aktif) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });
  document.body.dataset.ekran = es.m;
  document.body.classList.toggle('menusuz', es.m === 'karsilama');

  const el = $('#sayfa');
  try {
    const mod = await import(`./ekran/${es.m}.js`);
    if (no !== gecisNo) return;
    // Her ekrana yeni kapsayıcı: önceki ekranın olay dinleyicileri onunla birlikte gider
    const kap = document.createElement('div');
    kap.className = 'ekran';
    el.innerHTML = '';
    el.appendChild(kap);
    window.scrollTo(0, 0);
    const sonuc = await mod[es.f]({ el: kap, p: es.params, q });
    if (no !== gecisNo) { if (typeof sonuc === 'function') sonuc(); return; }
    temizle = sonuc;
    el.focus({ preventScroll: true });
  } catch (e) {
    console.error(e);
    el.innerHTML = `<div class="bos"><p>Bu sayfa açılamadı.</p><p class="kucuk">${String(e.message || e).replace(/</g, '&lt;')}</p><a class="btn" href="#/">Ana sayfaya dön</a></div>`;
  }
}

function temaUygula() {
  const t = get('ayarlar.tema');
  if (t === 'acik' || t === 'koyu') document.documentElement.dataset.theme = t === 'acik' ? 'light' : 'dark';
  else delete document.documentElement.dataset.theme;
  const koyu = t === 'koyu' || (t !== 'acik' && matchMedia('(prefers-color-scheme: dark)').matches);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = koyu ? '#07120e' : '#f6f2e9';
  document.documentElement.style.setProperty('--yazi-carpan', String(get('ayarlar.okuma.yazi') || 1));
}

function menuyuCiz() {
  $('#menu').innerHTML = SEKMELER.map(s =>
    `<a class="sekme" data-k="${s.k}" href="${s.href}">${ikon(s.ikon)}<span>${s.ad}</span></a>`).join('');
}

// Geri butonu: tarih yığını varsa geri, yoksa verilen rota
document.addEventListener('click', e => {
  const g = e.target.closest('[data-geri]');
  if (!g) return;
  e.preventDefault();
  if (history.length > 1 && sessionStorage.getItem('icGezinti')) history.back();
  else location.hash = g.dataset.geri || '#/';
});
addEventListener('hashchange', () => { try { sessionStorage.setItem('icGezinti', '1'); } catch {} yonlendir(); });

menuyuCiz();
temaUygula();
dinle(temaUygula);
matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', temaUygula);
yonlendir();
bildirimleriPlanla();
document.addEventListener('visibilitychange', () => { if (!document.hidden) bildirimleriPlanla(); });

if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(e => console.warn('SW', e)));
}
if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});
