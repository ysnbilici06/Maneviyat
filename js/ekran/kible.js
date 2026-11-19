// S08 Kıble pusulası
import { get } from '../store.js';
import { ustBaslik, esc, titret } from '../ui.js';
import { ikon } from '../ikon.js';
import { kibleAcisi, kabeyeUzaklik } from '../vakit.js';

export default function kible({ el }) {
  ustBaslik({ baslik: 'Kıble', geri: '#/namaz' });
  const konum = get('ayarlar.konum');
  if (!konum) {
    el.innerHTML = `<div class="bos">${ikon('konum', 40)}<p>Kıble yönünü hesaplamak için konumunu seçmelisin.</p><a class="btn" href="#/ayarlar">Konum seç</a></div>`;
    return;
  }
  const aci = kibleAcisi(konum.lat, konum.lng);
  const km = Math.round(kabeyeUzaklik(konum.lat, konum.lng));
  let dinleniyor = false, hizaliydi = false;

  el.innerHTML = `
    <p class="merkez soluk">${esc(konum.ad)} · Kâbe'ye ${km.toLocaleString('tr-TR')} km</p>
    <div class="pusula" id="pusula" aria-hidden="true">
      <div class="pusula-kadran" id="kadran">
        <span class="yon" style="top:10px;left:50%;transform:translateX(-50%)">K</span>
        <span class="yon" style="bottom:10px;left:50%;transform:translateX(-50%)">G</span>
        <span class="yon" style="left:12px;top:50%;transform:translateY(-50%)">B</span>
        <span class="yon" style="right:12px;top:50%;transform:translateY(-50%)">D</span>
        <span class="k-isaret" style="transform:rotate(${aci}deg)">${ikon('yildiz', 18)}</span>
      </div>
      <div class="pusula-ok"></div>
    </div>
    <p class="merkez" style="font-size:20px;font-weight:700" id="durum">Kıble: kuzeyden ${Math.round(aci)}°</p>
    <p class="merkez kucuk soluk" id="ipucu" style="margin-top:6px">Pusulayı kullanmak için aşağıdaki butona dokun ve telefonu yere paralel tut.</p>
    <div class="btn-sira" style="justify-content:center"><button class="btn" data-baslat>${ikon('pusula', 20)} Pusulayı başlat</button></div>
    <p class="cok-kucuk soluk merkez" style="margin-top:16px">Metal eşyalar ve mıknatıslar pusulayı şaşırtabilir. Gerekirse telefonu havada 8 çizerek kalibre et.</p>`;

  const kadran = el.querySelector('#kadran');
  const pusula = el.querySelector('#pusula');
  const durum = el.querySelector('#durum');

  function yonGuncelle(baslik) {
    if (baslik == null || isNaN(baslik)) return;
    kadran.style.transform = `rotate(${-baslik}deg)`;
    let fark = ((aci - baslik + 540) % 360) - 180;
    const hizali = Math.abs(fark) < 4;
    pusula.classList.toggle('hizali', hizali);
    durum.textContent = hizali ? 'Kıbleye dönüksün' : fark > 0 ? `${Math.round(fark)}° sağa dön` : `${Math.round(-fark)}° sola dön`;
    if (hizali && !hizaliydi) titret(40);
    hizaliydi = hizali;
  }

  const iosOlay = e => { if (e.webkitCompassHeading != null) yonGuncelle(e.webkitCompassHeading); };
  const mutlakOlay = e => { if (e.absolute && e.alpha != null) yonGuncelle(360 - e.alpha); };

  async function baslat() {
    try {
      if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        const s = await DeviceOrientationEvent.requestPermission();
        if (s !== 'granted') { el.querySelector('#ipucu').textContent = 'Pusula izni verilmedi. Kıble açısını yukarıdaki dereceye göre bulabilirsin.'; return; }
      }
    } catch { /* izin sorulamadı */ }
    if ('ondeviceorientationabsolute' in window) addEventListener('deviceorientationabsolute', mutlakOlay);
    addEventListener('deviceorientation', iosOlay);
    dinleniyor = true;
    el.querySelector('[data-baslat]').hidden = true;
    el.querySelector('#ipucu').textContent = 'Telefonu yere paralel tut; ok kıble işaretine gelince titreşir.';
    setTimeout(() => {
      if (!kadran.style.transform) el.querySelector('#ipucu').textContent = 'Bu cihazda pusula algılanamadı. Kıble, kuzeyden saat yönünde ' + Math.round(aci) + '° açıdadır.';
    }, 2500);
  }
  el.addEventListener('click', e => { if (e.target.closest('[data-baslat]')) baslat(); });

  return () => {
    if (dinleniyor) { removeEventListener('deviceorientationabsolute', mutlakOlay); removeEventListener('deviceorientation', iosOlay); }
  };
}
