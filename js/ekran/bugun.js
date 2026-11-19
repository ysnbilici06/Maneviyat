// S03 Bugün: haftalık şerit, tarih/vakit kartı, günün adımları, ibadetler, günün seçkisi
import { get, guncelle } from '../store.js';
import { ustBaslik, esc, titret } from '../ui.js';
import { ikon } from '../ikon.js';
import { anahtar, hicri, saat, kalanMetin, gunEkle, gunAdi, ayAdi, gunNo } from '../tarih.js';
import { vakitDurumu, VAKITLER, NAMAZLAR } from '../vakit.js';
import { gununAyetRef, gununDuasi, gununKissasi } from '../gunun-icerigi.js';
import { refEtiket } from '../kuran-veri.js';
import { ZIKIRLER } from '../../data/icerik/zikirler.js';

const KISA_GUN = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];

// Kart süsü: kendi çizimimiz — mihrap kemeri, asılı kandil, yıldızlar
const SUS = `<svg class="gun-sus" viewBox="0 0 140 160" aria-hidden="true" fill="none">
  <defs><radialGradient id="kandilIsik" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#ffd98a" stop-opacity=".9"/><stop offset="1" stop-color="#ffd98a" stop-opacity="0"/></radialGradient></defs>
  <path d="M14 160V78C14 40 40 14 70 6c30 8 56 34 56 72v82" stroke="#e3bf76" stroke-opacity=".55" stroke-width="2"/>
  <path d="M30 160V84C30 56 48 36 70 28c22 8 40 28 40 56v76" stroke="#e3bf76" stroke-opacity=".3" stroke-width="1.5"/>
  <path d="M70 28v40" stroke="#e3bf76" stroke-opacity=".6" stroke-width="1.2"/>
  <circle cx="70" cy="84" r="26" fill="url(#kandilIsik)"/>
  <path d="M62 70h16l-3 22h-10z" fill="#e3bf76" fill-opacity=".9"/><path d="M60 70h20M64 92h12" stroke="#f6dfa6" stroke-width="2" stroke-linecap="round"/>
  <circle cx="22" cy="20" r="1.4" fill="#f2ede1"/><circle cx="118" cy="30" r="1.1" fill="#f2ede1"/><circle cx="104" cy="12" r="1.6" fill="#e3bf76"/><circle cx="36" cy="44" r="1" fill="#f2ede1" fill-opacity=".7"/>
</svg>`;

function gunEtiketi(vd, simdi) {
  const b = vd.bugun;
  const g = gunAdi(simdi);
  if (simdi >= b.aksam) return `${gunAdi(gunEkle(simdi, 1))} gecesi`;
  if (simdi < b.imsak) return `${g} gecesi`;
  if (simdi < b.gunes) return `${g} seheri`;
  if (simdi < b.ogle) return `${g} sabahı`;
  if (simdi < b.ikindi) return `${g} öğlesi`;
  return `${g} ikindisi`;
}

export default async function bugun({ el }) {
  const gun = anahtar();
  const ad = get('ayarlar.ad');
  ustBaslik({ baslik: ad ? `Selâmün aleyküm, ${ad}` : 'Selâmün aleyküm', sag: `<a class="ikon-btn" href="#/ayarlar" aria-label="Ayarlar">${ikon('ayar')}</a>` });

  const ayetRef = gununAyetRef();
  const dua = gununDuasi();
  const kissa = gununKissasi();
  const zikir = ZIKIRLER[(gunNo() * 3 + 5) % 9];   // ilk 9 kısa zikirden
  const ayetEtiket = await refEtiket(ayetRef);

  function ciz() {
    const simdi = new Date();
    const vd = vakitDurumu(simdi);
    const tumKayit = get('namaz');
    const kayit = tumKayit[gun] || {};
    const gorev = get('gorev')[gun] || {};
    const zikirBugun = ((get('zikirSayim')[gun] || {})[zikir.id] || 0);
    const kazaBugun = get('kazaLog')[gun] || 0;
    const kazaVar = Object.values(get('kaza').borc).some(x => x > 0);
    const konum = get('ayarlar.konum');

    const kilinan = NAMAZLAR.filter(n => kayit[n.k]).length;
    const secki = [
      { k: 'ayet', bitti: !!gorev.ayet, ikon: 'kitap', baslik: "Kur'an'dan bir ayet", alt: ayetEtiket, href: '#/gun/ayet' },
      { k: 'dua', bitti: !!gorev.dua, ikon: 'el', baslik: 'Kalpten bir dua', alt: dua.ad, href: '#/gun/dua' },
      { k: 'zikir', bitti: zikirBugun >= zikir.hedef, ikon: 'tesbih', baslik: 'Dilinde bir zikir', alt: `${zikir.ad}${zikirBugun ? ` · ${Math.min(zikirBugun, zikir.hedef)}/${zikir.hedef}` : ''}`, href: `#/zikir/say/${zikir.id}` },
      { k: 'kissa', bitti: !!gorev.kissa, ikon: 'yaprak', baslik: 'Kıssadan hisse', alt: kissa.baslik, href: `#/kissa/${kissa.id}?gun=1` },
    ];
    const seckiBiten = secki.filter(s => s.bitti).length;
    const toplamAdim = 5 + secki.length + (kazaVar ? 1 : 0);
    const bitenAdim = kilinan + seckiBiten + (kazaVar && kazaBugun > 0 ? 1 : 0);

    // Haftalık şerit (Pazartesi'den başlar)
    const pzt = gunEkle(simdi, -((simdi.getDay() + 6) % 7));
    const hafta = Array.from({ length: 7 }, (_, i) => {
      const d = gunEkle(pzt, i), k = anahtar(d);
      const n = NAMAZLAR.filter(z => (tumKayit[k] || {})[z.k]).length;
      const gelecek = k > gun;
      return `<a class="hafta-gun ${k === gun ? 'bugun' : ''}" href="#/namaz?gun=${k}" aria-label="${d.getDate()} ${ayAdi(d.getMonth())}: ${n}/5 vakit">
        <span class="hg-ad">${KISA_GUN[d.getDay()]}</span>
        <span class="hg-daire ${n === 5 ? 'tam' : n > 0 ? 'kismi' : ''} ${gelecek ? 'gelecek' : ''}" style="--oran:${n / 5}">${n === 5 ? ikon('tik', 14) : ''}</span>
        <span class="hg-no">${d.getDate()}</span></a>`;
    }).join('');

    const gunKart = vd ? `
      <section class="kart kart-kahraman gun-kart" aria-label="Bugün ve vakitler">
        ${SUS}
        <p class="gk-etiket">${esc(gunEtiketi(vd, simdi))}</p>
        <p class="gk-kalan"><span data-kalan>${esc(vd.siradaki.ad)} vaktine ${kalanMetin(vd.siradaki.zaman - simdi)}</span></p>
        <div class="gk-tarih"><b>${simdi.getDate()}</b><span>${ayAdi(simdi.getMonth())}<small>${gunAdi(simdi)}</small></span></div>
        <p class="gk-hicri">${hicri(simdi)}${konum ? ` · ${esc(konum.ad)}` : ''}</p>
        <div class="gk-vakitler">${VAKITLER.map(v => `<div class="${vd.simdiki.k === v.k ? 'simdi' : ''}"><span>${v.ad}</span><b>${saat(vd.bugun[v.k])}</b></div>`).join('')}</div>
      </section>` : `
      <a class="kart kart-yumusak" href="#/ayarlar"><div class="sira">${ikon('konum')}<div class="esnek"><h3>Konumunu seç</h3><p class="kucuk">Namaz vakitlerini görmek için şehrini belirle.</p></div>${ikon('ileri')}</div></a>`;

    const satir = (ikonAdi, baslik, alt, sag, href, ek = '') => `
      <div class="ib-satir ${ek}">
        <a class="ib-bag" href="${href}"><span class="ib-ikon">${ikon(ikonAdi, 20)}</span><span class="esnek"><span class="ib-baslik">${baslik}</span>${alt ? `<span class="ib-alt">${esc(alt)}</span>` : ''}</span></a>
        ${sag}
      </div>`;

    const namazDaireleri = vd ? `<span class="daireler" role="group" aria-label="Bugün kıldığın namazlar">${NAMAZLAR.map(n => {
      const girdi = vd.bugun[n.bas] <= simdi;
      return `<button class="daire ${kayit[n.k] ? 'dolu' : ''}" role="checkbox" aria-checked="${!!kayit[n.k]}" data-namaz="${n.k}" ${girdi || kayit[n.k] ? '' : 'disabled'} aria-label="${n.ad}">${kayit[n.k] ? ikon('tik', 14) : ''}</button>`;
    }).join('')}</span>` : '';
    const kazaDaireleri = `<a class="daireler" href="#/kaza" aria-label="Bugün ${kazaBugun} kaza">${Array.from({ length: 5 }, (_, i) => `<span class="daire ${i < kazaBugun ? 'dolu' : ''}">${i < kazaBugun ? ikon('tik', 14) : ''}</span>`).join('')}</a>`;

    el.innerHTML = `
      <nav class="hafta" aria-label="Bu hafta">${hafta}</nav>
      ${gunKart}

      <div class="cip-serit">
        <a class="cip koyu-cip" href="#/zikir">${ikon('tesbih', 18)} Zikir</a>
        <a class="cip koyu-cip" href="#/dua">${ikon('el', 18)} Dualar</a>
        <a class="cip koyu-cip" href="#/his">${ikon('kalp', 18)} Hislerim</a>
        <a class="cip koyu-cip" href="#/kible">${ikon('pusula', 18)} Kıble</a>
        <a class="cip koyu-cip" href="#/kissa">${ikon('yaprak', 18)} Kıssalar</a>
        <a class="cip koyu-cip" href="${get('okuma') ? `#/kuran/${get('okuma').sure}?ayet=${get('okuma').ayet}` : '#/kuran'}" aria-label="Okumaya devam et">${ikon('yerimi', 18)}</a>
      </div>

      <div class="adim-baslik"><span>Günün adımları</span><b>${bitenAdim}/${toplamAdim}</b></div>
      <div class="altin-bar" role="progressbar" aria-valuemin="0" aria-valuemax="${toplamAdim}" aria-valuenow="${bitenAdim}" aria-label="Günün adımları"><i style="width:${bitenAdim / toplamAdim * 100}%"></i></div>

      <div class="grup-baslik"><h2>İbadetler</h2><span>${(kilinan === 5 ? 1 : 0) + (kazaVar && kazaBugun ? 1 : 0)}/${kazaVar ? 2 : 1}</span></div>
      <div class="kart ib-kart">
        ${satir('saat', 'Namaz', `${kilinan}/5 vakit`, namazDaireleri, '#/namaz')}
        ${satir('terazi', 'Kaza namazı', kazaVar ? `Bugün ${kazaBugun} vakit` : 'Takibi başlat', kazaDaireleri, '#/kaza')}
      </div>

      <div class="grup-baslik"><h2>Günün seçkisi</h2><span>${seckiBiten}/${secki.length}</span></div>
      <div class="kart ib-kart">
        ${secki.map(s => satir(s.ikon, s.baslik, s.alt, `<a class="onay-isaret ${s.bitti ? 'dolu' : ''}" href="${s.href}" aria-label="${s.bitti ? 'Tamamlandı' : 'Aç'}">${s.bitti ? ikon('tik', 16) : ''}</a>`, s.href)).join('')}
      </div>
      <p class="merkez cok-kucuk soluk" style="margin:22px 0 6px">Beni anın ki ben de sizi anayım. · Bakara 2/152</p>`;
  }

  ciz();

  el.addEventListener('click', e => {
    const b = e.target.closest('[data-namaz]');
    if (!b) return;
    const k = b.dataset.namaz;
    guncelle(s => { s.namaz[gun] = s.namaz[gun] || {}; s.namaz[gun][k] = s.namaz[gun][k] ? 0 : 1; });
    titret(20);
    ciz();
  });

  // Kalan süre ve vakit geçişleri
  let sonSiradaki = (vakitDurumu() || {}).siradaki?.k;
  const t = setInterval(() => {
    if (anahtar() !== gun) { location.reload(); return; }
    const vd = vakitDurumu();
    if (!vd) return;
    if (vd.siradaki.k !== sonSiradaki) { sonSiradaki = vd.siradaki.k; ciz(); return; }
    const s = el.querySelector('[data-kalan]');
    if (s) s.textContent = `${vd.siradaki.ad} vaktine ${kalanMetin(vd.siradaki.zaman - new Date())}`;
  }, 15000);
  return () => clearInterval(t);
}
