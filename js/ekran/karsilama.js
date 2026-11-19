// S01 Karşılama: tanıtım, ad, konum (GPS ya da il listesi), bildirim izni
import { get, set, guncelle } from '../store.js';
import { ustBaslik, esc, tost } from '../ui.js';
import { ikon } from '../ikon.js';
import { ILLER, enYakinIl } from '../iller.js';
import { izinIste, bildirimDestegi, bildirimleriPlanla } from '../bildirim.js';

export function konumAl() {
  return new Promise((coz, red) => {
    if (!navigator.geolocation) return red(new Error('Bu cihaz konum vermiyor.'));
    navigator.geolocation.getCurrentPosition(
      p => {
        const lat = +p.coords.latitude.toFixed(4), lng = +p.coords.longitude.toFixed(4);
        const il = enYakinIl(lat, lng);
        coz({ lat, lng, ad: il ? il.ad : 'Bulunduğun konum' });
      },
      e => red(new Error(e.code === 1 ? 'Konum izni verilmedi.' : 'Konum alınamadı.')),
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 3600000 });
  });
}

export function ilSecici(secili) {
  return `<select class="girdi" id="il-sec" aria-label="İl seç">
    <option value="">İl seç…</option>
    ${ILLER.map((il, i) => `<option value="${i}" ${secili && secili.ad === il.ad ? 'selected' : ''}>${esc(il.ad)}</option>`).join('')}
  </select>`;
}

export default function karsilama({ el }) {
  let adim = 0;
  ustBaslik({});

  function ciz() {
    const konum = get('ayarlar.konum');
    const adimlar = [
      `<div class="yigin-genis merkez" style="padding-top:8vh">
        <div style="display:grid;place-items:center"><img src="icons/icon.svg" width="96" height="96" alt="" style="border-radius:24px"></div>
        <div><h1 style="font-size:32px">Maneviyat Rehberim</h1><p class="soluk" style="margin-top:8px">Namaz vakitleri, Kur'an, zikir ve dualar tek yerde.<br>Ücretsiz, reklamsız; internet olmadan da çalışır.</p></div>
        <div class="alan" style="text-align:left"><label for="ad">Sana nasıl hitap edelim? <span class="soluk">(isteğe bağlı)</span></label>
          <input class="girdi" id="ad" maxlength="30" autocomplete="given-name" value="${esc(get('ayarlar.ad'))}" placeholder="Adın"></div>
        <button class="btn buyuk tam" data-ileri>Başlayalım</button>
      </div>`,
      `<div class="yigin-genis" style="padding-top:6vh">
        <div><span class="satir-ikon" style="width:56px;height:56px">${ikon('konum', 28)}</span></div>
        <div><h1 style="font-size:28px">Konumun</h1><p class="soluk" style="margin-top:8px">Namaz vakitleri ve kıble yönü bulunduğun yere göre hesaplanır. Konumun cihazından dışarı çıkmaz.</p></div>
        ${konum ? `<div class="kart kart-yumusak sira">${ikon('tik')}<b class="esnek">${esc(konum.ad)}</b></div>` : ''}
        <button class="btn buyuk tam" data-gps>${ikon('konum', 20)} Konumumu bul</button>
        <div class="alan"><label for="il-sec">ya da listeden seç</label>${ilSecici(konum)}</div>
        <div class="btn-sira" style="justify-content:space-between"><button class="btn hayalet" data-geri-adim>Geri</button><button class="btn" data-ileri ${konum ? '' : 'disabled'}>Devam</button></div>
      </div>`,
      `<div class="yigin-genis" style="padding-top:6vh">
        <div><span class="satir-ikon" style="width:56px;height:56px">${ikon('zil', 28)}</span></div>
        <div><h1 style="font-size:28px">Vakit hatırlatmaları</h1><p class="soluk" style="margin-top:8px">Vakit girdiğinde haber verelim mi? Bunu daha sonra Ayarlar'dan değiştirebilirsin.</p>
        <p class="kucuk soluk" style="margin-top:8px">iPhone ve iPad'de hatırlatmalar için uygulamayı önce Paylaş → "Ana Ekrana Ekle" ile eklemelisin.</p></div>
        ${bildirimDestegi() ? `<button class="btn buyuk tam" data-bildirim>${ikon('zil', 20)} Hatırlatmaları aç</button>` : `<p class="kart kucuk">Bu tarayıcı bildirimleri desteklemiyor.</p>`}
        <button class="btn ikincil buyuk tam" data-bitir>Şimdilik geç</button>
      </div>`,
    ];
    el.innerHTML = adimlar[adim];
  }
  ciz();

  const bitir = () => { set('kurulum', true); location.replace('#/'); };

  el.addEventListener('click', async e => {
    const t = e.target.closest('button'); if (!t) return;
    if (t.hasAttribute('data-ileri')) {
      if (adim === 0) set('ayarlar.ad', (el.querySelector('#ad').value || '').trim().slice(0, 30));
      adim++; ciz();
    } else if (t.hasAttribute('data-geri-adim')) { adim--; ciz(); }
    else if (t.hasAttribute('data-gps')) {
      t.disabled = true; t.textContent = 'Konum aranıyor…';
      try { set('ayarlar.konum', await konumAl()); ciz(); }
      catch (err) { tost(err.message + ' Listeden seçebilirsin.'); ciz(); }
    } else if (t.hasAttribute('data-bildirim')) {
      const s = await izinIste();
      if (s === 'granted') { guncelle(x => { x.ayarlar.bildirim.acik = true; }); bildirimleriPlanla(); tost('Hatırlatmalar açıldı'); }
      else tost('İzin verilmedi. Ayarlar\'dan tekrar deneyebilirsin.');
      bitir();
    } else if (t.hasAttribute('data-bitir')) bitir();
  });
  el.addEventListener('change', e => {
    if (e.target.id === 'il-sec' && e.target.value !== '') {
      const il = ILLER[Number(e.target.value)];
      set('ayarlar.konum', { lat: il.lat, lng: il.lng, ad: il.ad });
      ciz();
    }
  });
}
