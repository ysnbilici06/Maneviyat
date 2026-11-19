// S07 Namaz vakitleri + işaretleme, S09 geçmiş
import { get, guncelle } from '../store.js';
import { ustBaslik, esc, titret } from '../ui.js';
import { ikon } from '../ikon.js';
import { anahtar, anahtardanTarih, gunEkle, uzunTarih, hicri, saat, kalanMetin, ayAdi, kisaTarih } from '../tarih.js';
import { vakitleriHesapla, vakitDurumu, VAKITLER, NAMAZLAR } from '../vakit.js';

export default function namaz({ el, q }) {
  let gun = q.gun ? anahtardanTarih(q.gun) : new Date();
  const bugunK = anahtar();

  function ciz() {
    const k = anahtar(gun);
    const konum = get('ayarlar.konum');
    ustBaslik({ baslik: 'Namaz', alt: konum ? `${ikon('konum', 14)} ${esc(konum.ad)}` : '', sag: `<a class="ikon-btn" href="#/namaz/gecmis" aria-label="Geçmiş">${ikon('takvim')}</a>` });
    if (!konum) {
      el.innerHTML = `<div class="bos">${ikon('konum', 40)}<p>Vakitleri hesaplayabilmemiz için konumunu seçmelisin.</p><a class="btn" href="#/ayarlar">Konum seç</a></div>`;
      return;
    }
    const v = vakitleriHesapla(gun);
    const vd = vakitDurumu();
    const simdi = new Date();
    const kayit = get('namaz')[k] || {};
    const bugunMu = k === bugunK;
    const ilerideMi = k > bugunK;

    const satirlar = VAKITLER.map(x => {
      const gecti = bugunMu ? v[x.k] <= simdi : !ilerideMi;
      const siradaki = bugunMu && vd && vd.siradaki.k === x.k && !vd.siradaki.yarin;
      const namazK = { imsak: 'sabah', ogle: 'ogle', ikindi: 'ikindi', aksam: 'aksam', yatsi: 'yatsi' }[x.k];
      const n = NAMAZLAR.find(z => z.k === namazK);
      const girdi = !ilerideMi && (!bugunMu || v[x.k] <= simdi);
      const onay = n ? `<button class="onay-kutu" role="checkbox" aria-checked="${!!kayit[n.k]}" data-namaz="${n.k}" ${girdi || kayit[n.k] ? '' : 'disabled'} aria-label="${n.ad} namazını kıldım">${ikon('tik', 20)}</button>` : '<span style="width:36px"></span>';
      return `<div class="vakit-satir ${gecti && !siradaki ? 'gecti' : ''} ${siradaki ? 'siradaki' : ''}">
        <span class="ad">${x.ad}${siradaki ? `<span class="kucuk" style="display:block;font-weight:500">${kalanMetin(v[x.k] - simdi)} kaldı</span>` : ''}${n && n.k === 'sabah' ? '<span class="cok-kucuk soluk" style="display:block;font-weight:500">Sabah namazı</span>' : ''}</span>
        <span class="zaman">${saat(v[x.k])}</span>${onay}</div>`;
    }).join('');

    const kilinan = NAMAZLAR.filter(n => kayit[n.k]).length;
    el.innerHTML = `
      <div class="sira-ara" style="margin-bottom:12px">
        <button class="ikon-btn dolu" data-gun="-1" aria-label="Önceki gün">${ikon('geri')}</button>
        <div class="merkez"><b>${bugunMu ? 'Bugün' : esc(uzunTarih(gun))}</b><div class="kucuk soluk">${bugunMu ? esc(uzunTarih(gun)) + '<br>' : ''}${hicri(gun) ? `<span class="altin">${hicri(gun)}</span>` : ''}</div></div>
        <button class="ikon-btn dolu" data-gun="1" aria-label="Sonraki gün">${ikon('ileri')}</button>
      </div>
      <div class="liste">${satirlar}</div>
      <p class="kucuk soluk merkez" style="margin-top:10px">${ilerideMi ? 'İleri tarihli vakitler' : `${kilinan}/5 vakit işaretli`}${!bugunMu ? ` · <button class="btn hayalet kucuk-btn" data-bugun>Bugüne dön</button>` : ''}</p>

      <div class="izgara-2" style="margin-top:16px">
        <a class="kart kisayol" href="#/kible"><span class="satir-ikon">${ikon('pusula')}</span><b>Kıble yönü</b></a>
        <a class="kart kisayol" href="#/kaza"><span class="satir-ikon">${ikon('terazi')}</span><b>Kaza namazları</b></a>
      </div>
      <p class="cok-kucuk soluk" style="margin-top:16px">Vakitler cihazında Diyanet yöntemiyle hesaplanır. Yerel takvimle fark görürsen Ayarlar → Vakit düzeltme bölümünden dakika ekleyip çıkarabilirsin.</p>`;
  }
  ciz();

  el.addEventListener('click', e => {
    const n = e.target.closest('[data-namaz]');
    if (n) {
      const k = anahtar(gun);
      guncelle(s => { s.namaz[k] = s.namaz[k] || {}; s.namaz[k][n.dataset.namaz] = s.namaz[k][n.dataset.namaz] ? 0 : 1; });
      titret(20); ciz(); return;
    }
    const g = e.target.closest('[data-gun]');
    if (g) { gun = gunEkle(gun, Number(g.dataset.gun)); ciz(); return; }
    if (e.target.closest('[data-bugun]')) { gun = new Date(); ciz(); }
  });
  const t = setInterval(ciz, 30000);
  return () => clearInterval(t);
}

export function gecmis({ el }) {
  ustBaslik({ baslik: 'Namaz geçmişi', geri: '#/namaz' });
  let ay = new Date(); ay.setDate(1);

  function seri() {
    let n = 0, d = new Date();
    const kayit = get('namaz');
    // Bugün henüz tamamlanmadıysa diziyi dünden say
    const say = x => NAMAZLAR.filter(z => (kayit[anahtar(x)] || {})[z.k]).length;
    if (say(d) < 5) d = gunEkle(d, -1);
    while (say(d) === 5) { n++; d = gunEkle(d, -1); }
    return n;
  }

  function ciz() {
    const kayit = get('namaz');
    const y = ay.getFullYear(), m = ay.getMonth();
    const ilkGun = (new Date(y, m, 1).getDay() + 6) % 7;   // Pazartesi başlangıç
    const gunSayisi = new Date(y, m + 1, 0).getDate();
    const bugunK = anahtar();
    let toplam = 0, tam = 0, gecenGun = 0;
    let hucreler = ['Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct', 'Pz'].map(x => `<div class="baslik">${x}</div>`).join('');
    hucreler += '<div></div>'.repeat(ilkGun);
    for (let g = 1; g <= gunSayisi; g++) {
      const k = anahtar(new Date(y, m, g));
      const n = NAMAZLAR.filter(z => (kayit[k] || {})[z.k]).length;
      if (k <= bugunK) { toplam += n; gecenGun++; if (n === 5) tam++; }
      hucreler += `<a class="gun ${k === bugunK ? 'bugun' : ''}" data-n="${n}" href="#/namaz?gun=${k}" aria-label="${g} ${ayAdi(m)}: ${n} vakit" style="text-decoration:none">${g}</a>`;
    }
    el.innerHTML = `
      <div class="kart istatistik"><div><b>${seri()}</b><span>gün seri</span></div><div><b>${tam}</b><span>tam gün (bu ay)</span></div><div><b>${gecenGun ? Math.round(toplam / (gecenGun * 5) * 100) : 0}%</b><span>bu ay</span></div></div>
      <div class="sira-ara" style="margin:20px 0 12px">
        <button class="ikon-btn dolu" data-ay="-1" aria-label="Önceki ay">${ikon('geri')}</button>
        <b>${ayAdi(m)} ${y}</b>
        <button class="ikon-btn dolu" data-ay="1" aria-label="Sonraki ay">${ikon('ileri')}</button>
      </div>
      <div class="takvim">${hucreler}</div>
      <p class="kucuk soluk" style="margin-top:14px">Bir güne dokunarak o günün vakitlerini işaretleyebilirsin. Renk koyulaştıkça o gün daha çok vakit kılınmış demektir.</p>`;
  }
  ciz();
  el.addEventListener('click', e => {
    const b = e.target.closest('[data-ay]');
    if (b) { ay = new Date(ay.getFullYear(), ay.getMonth() + Number(b.dataset.ay), 1); ciz(); }
  });
}
