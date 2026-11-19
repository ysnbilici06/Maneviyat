// S10 Kaza namazları: borç sayaçları, kılınan, bitirme yolculuğu
import { get, guncelle } from '../store.js';
import { ustBaslik, esc, pencere, tost, titret, onayla } from '../ui.js';
import { ikon } from '../ikon.js';
import { anahtar, gunEkle } from '../tarih.js';

const KALEMLER = [
  { k: 'sabah', ad: 'Sabah' }, { k: 'ogle', ad: 'Öğle' }, { k: 'ikindi', ad: 'İkindi' },
  { k: 'aksam', ad: 'Akşam' }, { k: 'yatsi', ad: 'Yatsı' }, { k: 'vitir', ad: 'Vitir' },
];

export default function kaza({ el }) {
  ustBaslik({ baslik: 'Kaza namazları', geri: '#/namaz', sag: `<button class="ikon-btn" data-hesap aria-label="Borç hesapla">${ikon('terazi')}</button>` });

  function ciz() {
    const kz = get('kaza');
    const toplamBorc = KALEMLER.reduce((a, x) => a + (kz.borc[x.k] || 0), 0);
    const toplamKilinan = KALEMLER.reduce((a, x) => a + Math.min(kz.kilinan[x.k] || 0, kz.borc[x.k] || 0), 0);
    const kalan = Math.max(0, toplamBorc - toplamKilinan);
    const oran = toplamBorc ? toplamKilinan / toplamBorc : 0;
    const bugunKilinan = get('kazaLog')[anahtar()] || 0;
    const hedef = kz.hedefGunluk || 1;
    const gunlukVakit = Math.max(1, hedef);   // hedef: günde kaç "gün" (6 namaz) kaza
    const kalanGun = kalan ? Math.ceil(kalan / (gunlukVakit * 6)) : 0;
    const bitis = kalanGun ? gunEkle(new Date(), kalanGun) : null;
    // Yolculuk: 10 durak
    const duraklar = Array.from({ length: 10 }, (_, i) => `<i class="${oran >= (i + 1) / 10 ? 'dolu' : ''}"></i>`).join('');

    if (!toplamBorc) {
      el.innerHTML = `<div class="bos">${ikon('terazi', 40)}
        <p>Kaza borcunu girerek takibe başla. Bilmiyorsan, ergenlik yaşından itibaren kılınmayan yılları hesaplamana yardım edelim.</p>
        <button class="btn" data-hesap>Borcumu hesapla</button>
        <button class="btn ikincil" data-elle>Elle gireceğim</button></div>`;
      return;
    }
    el.innerHTML = `
      <section class="kart">
        <div class="sira-ara"><div><p class="kucuk soluk">Kalan kaza</p><p style="font-size:36px;font-weight:750;font-variant-numeric:tabular-nums">${kalan.toLocaleString('tr-TR')}</p></div>
          <div style="text-align:right"><p class="kucuk soluk">Tamamlanan</p><p style="font-size:22px;font-weight:700" class="altin">%${Math.floor(oran * 100)}</p></div></div>
        <div class="yolculuk" aria-label="Bitirme yolculuğu">${duraklar}</div>
        <p class="kucuk soluk" style="margin-top:10px">${kalan ? `Günde ${gunlukVakit} günlük kaza ile yaklaşık <b>${kalanGun.toLocaleString('tr-TR')} gün</b> sonra bitiyor${bitis ? ` (${bitis.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })})` : ''}.` : 'Maşallah! Bütün kazalarını tamamladın.'}</p>
        <p class="kucuk" style="margin-top:6px">Bugün ${bugunKilinan} vakit kaza kıldın.</p>
      </section>
      <div class="bolum-baslik"><h2>Vakit vakit</h2><button class="btn hayalet kucuk-btn" data-elle>Borcu düzenle</button></div>
      <div class="liste">
        ${KALEMLER.map(x => {
          const b = kz.borc[x.k] || 0, kl = Math.min(kz.kilinan[x.k] || 0, b);
          return `<div class="sayac-satir"><div class="esnek"><b>${x.ad}</b><div class="kucuk soluk">${kl.toLocaleString('tr-TR')} / ${b.toLocaleString('tr-TR')} kılındı</div></div>
            <div class="sayac"><button class="ikon-btn dolu" data-geri-al="${x.k}" aria-label="${x.ad} kazasını geri al" ${kl ? '' : 'disabled'}>${ikon('eksi')}</button>
            <output aria-live="polite">${(b - kl).toLocaleString('tr-TR')}</output>
            <button class="ikon-btn dolu" data-kil="${x.k}" aria-label="Bir ${x.ad} kazası kıldım" ${b - kl > 0 ? '' : 'disabled'}>${ikon('tik')}</button></div></div>`;
        }).join('')}
      </div>
      <div class="kart" style="margin-top:16px"><div class="sira-ara"><div><b>Günlük hedef</b><p class="kucuk soluk">Her gün kaç günlük kaza (6 vakit) kılacaksın?</p></div>
        <div class="sayac"><button class="ikon-btn dolu" data-hedef="-1" aria-label="Azalt">${ikon('eksi')}</button><output>${gunlukVakit}</output><button class="ikon-btn dolu" data-hedef="1" aria-label="Artır">${ikon('arti')}</button></div></div></div>
      <p class="cok-kucuk soluk" style="margin-top:14px">✓ butonu, o vakitten bir kaza kıldığını işaretler. Yanlışlıkla bastıysan − ile geri alabilirsin.</p>`;
  }
  ciz();

  function elleDuzenle() {
    const kz = get('kaza');
    const { el: p, kapat } = pencere(`<form class="yigin" id="borc-form">
      <p class="kucuk soluk">Her vakit için toplam kaza borcunu yaz.</p>
      ${KALEMLER.map(x => `<div class="sira-ara"><label for="b-${x.k}"><b>${x.ad}</b></label><input class="girdi" style="max-width:140px;text-align:right" type="number" min="0" max="99999" inputmode="numeric" id="b-${x.k}" value="${kz.borc[x.k] || 0}"></div>`).join('')}
      <div class="btn-sira"><button type="button" class="btn ikincil" data-kapat>Vazgeç</button><button class="btn">Kaydet</button></div></form>`, { baslik: 'Kaza borcu' });
    p.querySelector('form').addEventListener('submit', e => {
      e.preventDefault();
      guncelle(s => { KALEMLER.forEach(x => { s.kaza.borc[x.k] = Math.max(0, Math.min(99999, parseInt(p.querySelector('#b-' + x.k).value, 10) || 0)); }); s.kaza.baslangic = s.kaza.baslangic || anahtar(); });
      kapat(); ciz(); tost('Kaydedildi');
    });
  }

  function hesapla() {
    const { el: p, kapat } = pencere(`<form class="yigin">
      <p class="kucuk soluk">Namaz kılmadığın toplam süreyi yaklaşık olarak gir. Her gün için 5 vakit ve vitir eklenir.</p>
      <div class="sira-ara"><label for="h-yil"><b>Yıl</b></label><input class="girdi" style="max-width:120px;text-align:right" type="number" min="0" max="80" inputmode="numeric" id="h-yil" value="0"></div>
      <div class="sira-ara"><label for="h-ay"><b>Ay</b></label><input class="girdi" style="max-width:120px;text-align:right" type="number" min="0" max="11" inputmode="numeric" id="h-ay" value="0"></div>
      <div class="sira-ara"><label for="h-gun"><b>Gün</b></label><input class="girdi" style="max-width:120px;text-align:right" type="number" min="0" max="31" inputmode="numeric" id="h-gun" value="0"></div>
      <p class="cok-kucuk soluk">Kadınlar için âdet günleri kaza gerektirmez; bu süreyi düşerek girmelisin.</p>
      <p id="h-sonuc" class="kart kart-yumusak"><b>0</b> günlük kaza</p>
      <div class="btn-sira"><button type="button" class="btn ikincil" data-kapat>Vazgeç</button><button class="btn">Borca ekle</button></div></form>`, { baslik: 'Borç hesapla' });
    const gunHesap = () => Math.round((+p.querySelector('#h-yil').value || 0) * 365.25 + (+p.querySelector('#h-ay').value || 0) * 30.44 + (+p.querySelector('#h-gun').value || 0));
    p.addEventListener('input', () => { p.querySelector('#h-sonuc').innerHTML = `<b>${gunHesap().toLocaleString('tr-TR')}</b> günlük kaza (her vakitten)`; });
    p.querySelector('form').addEventListener('submit', e => {
      e.preventDefault();
      const n = gunHesap();
      if (!n) { kapat(); return; }
      guncelle(s => { KALEMLER.forEach(x => { s.kaza.borc[x.k] = (s.kaza.borc[x.k] || 0) + n; }); s.kaza.baslangic = s.kaza.baslangic || anahtar(); });
      kapat(); ciz(); tost('Borç eklendi');
    });
  }

  el.addEventListener('click', async e => {
    const kil = e.target.closest('[data-kil]'), geri = e.target.closest('[data-geri-al]'), h = e.target.closest('[data-hedef]');
    if (kil) {
      guncelle(s => { s.kaza.kilinan[kil.dataset.kil] = (s.kaza.kilinan[kil.dataset.kil] || 0) + 1; const g = anahtar(); s.kazaLog[g] = (s.kazaLog[g] || 0) + 1; });
      titret(20); ciz();
    } else if (geri) {
      guncelle(s => { s.kaza.kilinan[geri.dataset.geriAl] = Math.max(0, (s.kaza.kilinan[geri.dataset.geriAl] || 0) - 1); const g = anahtar(); s.kazaLog[g] = Math.max(0, (s.kazaLog[g] || 0) - 1); });
      ciz();
    } else if (h) {
      guncelle(s => { s.kaza.hedefGunluk = Math.max(1, Math.min(10, (s.kaza.hedefGunluk || 1) + Number(h.dataset.hedef))); });
      ciz();
    } else if (e.target.closest('[data-elle]')) elleDuzenle();
  });
  el.addEventListener('click', e => { if (e.target.closest('[data-hesap]')) hesapla(); });
  // Üst başlıktaki buton: ekrandan çıkınca dinleyiciyi kaldır
  const ust = document.querySelector('#ust');
  const ustTik = e => { if (e.target.closest('[data-hesap]')) hesapla(); };
  ust.addEventListener('click', ustTik);
  return () => ust.removeEventListener('click', ustTik);
}
