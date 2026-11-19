// S27 Ayarlar
import { get, set, guncelle, yedekMetni, yedektenYukle, sifirla } from '../store.js';
import { ustBaslik, esc, tost, onayla, dosyaIndir, pencere } from '../ui.js';
import { ikon } from '../ikon.js';
import { ILLER } from '../iller.js';
import { konumAl, ilSecici } from './karsilama.js';
import { izinIste, bildirimDestegi, bildirimleriPlanla, goster } from '../bildirim.js';
import { VAKITLER } from '../vakit.js';
import { tumunuIndir } from '../kuran-veri.js';
import { gorunumAyarlari } from './kuran.js';
import { anahtar } from '../tarih.js';
import { IMZA } from '../paylas.js';

const anahtarHtml = (id, acik, etiket, alt = '') => `<label class="satir" for="${id}"><div class="esnek"><div class="satir-baslik">${etiket}</div>${alt ? `<div class="satir-alt">${alt}</div>` : ''}</div><span class="anahtar"><input type="checkbox" id="${id}" ${acik ? 'checked' : ''}><span></span></span></label>`;

export default function ayarlar({ el }) {
  ustBaslik({ baslik: 'Ayarlar', geri: '#/' });

  function ciz() {
    const a = get('ayarlar');
    const b = a.bildirim;
    const izin = bildirimDestegi() ? Notification.permission : 'yok';
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const kurulu = matchMedia('(display-mode: standalone)').matches || navigator.standalone;
    el.innerHTML = `
      <div class="bolum-baslik" style="margin-top:0"><h2>Profil</h2></div>
      <div class="liste"><div class="satir"><label for="ad" class="satir-baslik" style="flex:none">Adın</label><input class="girdi" id="ad" maxlength="30" value="${esc(a.ad)}" placeholder="İsteğe bağlı" style="min-height:40px;border:0;text-align:right;background:transparent"></div></div>

      <div class="bolum-baslik"><h2>Konum</h2></div>
      <div class="liste">
        <div class="satir">${ikon('konum')}<div class="esnek"><div class="satir-baslik">${a.konum ? esc(a.konum.ad) : 'Seçilmedi'}</div>${a.konum ? `<div class="satir-alt">${a.konum.lat.toFixed(2)}, ${a.konum.lng.toFixed(2)}</div>` : ''}</div><button class="btn kucuk-btn" data-gps>Konumumu bul</button></div>
        <div class="satir"><div class="esnek">${ilSecici(a.konum && ILLER.some(i => i.ad === a.konum.ad && i.lat === a.konum.lat) ? a.konum : null)}</div></div>
      </div>

      <div class="bolum-baslik"><h2>Vakit düzeltme (dakika)</h2></div>
      <div class="liste">${VAKITLER.map(v => `<div class="sayac-satir"><b class="esnek">${v.ad}</b><div class="sayac">
        <button class="ikon-btn dolu" data-duz="${v.k}" data-f="-1" aria-label="${v.ad} bir dakika geri">${ikon('eksi')}</button>
        <output>${a.duzeltme[v.k] > 0 ? '+' : ''}${a.duzeltme[v.k] || 0}</output>
        <button class="ikon-btn dolu" data-duz="${v.k}" data-f="1" aria-label="${v.ad} bir dakika ileri">${ikon('arti')}</button></div></div>`).join('')}</div>

      <div class="bolum-baslik"><h2>Hatırlatmalar</h2></div>
      <div class="liste">
        ${anahtarHtml('b-acik', b.acik && izin === 'granted', 'Vakit hatırlatmaları', izin === 'denied' ? 'Bildirim izni tarayıcı ayarlarından kapatılmış.' : izin === 'yok' ? 'Bu tarayıcı desteklemiyor.' : ios && !kurulu ? 'iPhone/iPad\'de önce ana ekrana eklemelisin.' : 'Uygulama açıkken ya da arka planda çalışırken')}
        ${b.acik && izin === 'granted' ? VAKITLER.map(v => anahtarHtml('bv-' + v.k, b.vakitler[v.k], v.ad)).join('') + `
          <div class="satir"><div class="esnek satir-baslik">Kaç dakika önce?</div><select class="girdi" id="dk" style="max-width:130px;min-height:40px">${[0, 5, 10, 15, 30, 45].map(n => `<option value="${n}" ${b.dkOnce === n ? 'selected' : ''}>${n ? n + ' dk önce' : 'Tam vaktinde'}</option>`).join('')}</select></div>
          <div class="satir"><button class="btn ikincil kucuk-btn" data-dene>Deneme bildirimi gönder</button></div>` : ''}
      </div>

      <div class="bolum-baslik"><h2>Görünüm</h2></div>
      <div class="liste">
        <div class="satir"><div class="esnek satir-baslik">Tema</div><div class="bolumlu" role="group" aria-label="Tema" style="min-width:220px">${[['otomatik', 'Otomatik'], ['acik', 'Açık'], ['koyu', 'Koyu']].map(([k, ad]) => `<button aria-pressed="${a.tema === k}" data-tema="${k}">${ad}</button>`).join('')}</div></div>
        <button class="satir" style="width:100%;border-left:0;border-right:0;border-top:0;cursor:pointer;text-align:left" data-okuma><div class="esnek"><div class="satir-baslik">Kur'an okuma görünümü</div><div class="satir-alt">Arapça, okunuş, meal, yazı boyutu</div></div>${ikon('ileri')}</button>
        ${anahtarHtml('intro', a.intro !== false, 'Açılış ekranı', 'Her açılışta 5 saniye ayet, hadis ya da dua')}
        ${anahtarHtml('titresim', a.titresim, 'Titreşim', 'Zikirmatik ve işaretlemelerde')}
      </div>

      <div class="bolum-baslik"><h2>Veriler</h2></div>
      <div class="liste">
        <button class="satir" style="width:100%;border-left:0;border-right:0;border-top:0;cursor:pointer;text-align:left" data-indir-kuran>${ikon('indir')}<div class="esnek"><div class="satir-baslik">Kur'an'ı çevrimdışı kaydet</div><div class="satir-alt" id="kuran-durum">114 sûrenin tamamı (yaklaşık 3,5 MB)</div></div></button>
        <button class="satir" style="width:100%;border-left:0;border-right:0;border-top:0;cursor:pointer;text-align:left" data-yedekle>${ikon('indir')}<div class="esnek"><div class="satir-baslik">Yedekle</div><div class="satir-alt">Tüm verilerini bir dosyaya kaydet</div></div></button>
        <label class="satir" style="cursor:pointer">${ikon('yukle')}<div class="esnek"><div class="satir-baslik">Yedekten geri yükle</div><div class="satir-alt">Daha önce aldığın yedek dosyasını seç</div></div><input type="file" accept="application/json,.json" id="yedek-dosya" class="sr"></label>
        <button class="satir" style="width:100%;border:0;cursor:pointer;text-align:left;color:var(--danger)" data-sifirla>${ikon('cop')}<div class="esnek satir-baslik">Tüm verileri sil</div></button>
      </div>
      <p class="cok-kucuk soluk" style="margin-top:8px">Verilerin yalnızca bu cihazda tutulur. Telefon değiştirirken ya da tarayıcı verilerini silmeden önce yedek al.</p>

      ${!kurulu ? `<div class="bolum-baslik"><h2>Ana ekrana ekle</h2></div>
      <div class="kart kucuk">${ios
        ? 'Safari\'de alttaki <b>Paylaş</b> düğmesine, ardından <b>"Ana Ekrana Ekle"</b>ye dokun. Uygulama simgesiyle açılır, internetsiz çalışır ve hatırlatma gönderebilir.'
        : 'Chrome menüsünden (⋮) <b>"Uygulamayı yükle"</b> ya da <b>"Ana ekrana ekle"</b>yi seç. Uygulama simgesiyle açılır ve internetsiz çalışır.'}</div>` : ''}

      <div class="bolum-baslik"><h2>Hakkında</h2></div>
      <div class="kart kucuk yigin">
        <p><b>Maneviyat Rehberim</b> · sürüm 0.2 · ücretsiz ve reklamsız.</p>
        <p class="imza-not" style="text-align:left">${IMZA}</p>
        <p class="soluk">Arapça metin: Tanzil Projesi (tanzil.net, değiştirilmeden kullanılmıştır). Meal: Diyanet İşleri Başkanlığı. Okunuş: Muhammet Abay. Sesli okuma: Mişâri Râşid el-Afâsî (islamic.network). Arapça yazı tipi: Amiri Quran (SIL Open Font License). Namaz vakitleri cihazda Diyanet yöntemiyle hesaplanır.</p>
        <p class="soluk">Kıssa, dua açıklamaları, hadis ifadeleri ve ilmihal metinleri bu uygulama için hazırlanmıştır.</p>
        <a href="#/tasarim" class="cok-kucuk">Tasarım sistemi</a>
      </div>`;
  }
  ciz();

  el.addEventListener('change', async e => {
    const t = e.target;
    if (t.id === 'ad') set('ayarlar.ad', t.value.trim().slice(0, 30));
    else if (t.id === 'il-sec' && t.value !== '') { const il = ILLER[+t.value]; set('ayarlar.konum', { lat: il.lat, lng: il.lng, ad: il.ad }); bildirimleriPlanla(); ciz(); tost(il.ad + ' seçildi'); }
    else if (t.id === 'b-acik') {
      if (t.checked) {
        const s = await izinIste();
        if (s !== 'granted') { t.checked = false; tost(s === 'yok' ? 'Bu tarayıcı bildirim desteklemiyor' : 'Bildirim izni verilmedi'); return; }
      }
      guncelle(s => { s.ayarlar.bildirim.acik = t.checked; }); bildirimleriPlanla(); ciz();
    } else if (t.id.startsWith('bv-')) { guncelle(s => { s.ayarlar.bildirim.vakitler[t.id.slice(3)] = t.checked; }); bildirimleriPlanla(); }
    else if (t.id === 'dk') { guncelle(s => { s.ayarlar.bildirim.dkOnce = +t.value; }); bildirimleriPlanla(); }
    else if (t.id === 'titresim') set('ayarlar.titresim', t.checked);
    else if (t.id === 'intro') set('ayarlar.intro', t.checked);
    else if (t.id === 'yedek-dosya' && t.files[0]) {
      try {
        const metin = await t.files[0].text();
        if (await onayla('Mevcut verilerin yedekteki verilerle değiştirilecek. Devam edilsin mi?', { evet: 'Geri yükle' })) { yedektenYukle(metin); tost('Yedek geri yüklendi'); ciz(); }
      } catch (err) { tost(err.message || 'Dosya okunamadı'); }
      t.value = '';
    }
  });

  el.addEventListener('click', async e => {
    const d = e.target.closest('[data-duz]'), tm = e.target.closest('[data-tema]');
    if (d) { guncelle(s => { const k = d.dataset.duz; s.ayarlar.duzeltme[k] = Math.max(-30, Math.min(30, (s.ayarlar.duzeltme[k] || 0) + Number(d.dataset.f))); }); bildirimleriPlanla(); ciz(); }
    else if (tm) { set('ayarlar.tema', tm.dataset.tema); ciz(); }
    else if (e.target.closest('[data-gps]')) {
      const b = e.target.closest('[data-gps]'); b.disabled = true; b.textContent = 'Aranıyor…';
      try { set('ayarlar.konum', await konumAl()); bildirimleriPlanla(); tost('Konum güncellendi'); } catch (err) { tost(err.message); }
      ciz();
    }
    else if (e.target.closest('[data-dene]')) goster('Maneviyat Rehberim', 'Hatırlatmalar çalışıyor.', 'deneme');
    else if (e.target.closest('[data-okuma]')) gorunumAyarlari();
    else if (e.target.closest('[data-indir-kuran]')) {
      const durum = el.querySelector('#kuran-durum');
      try { await tumunuIndir(i => { durum.textContent = `İndiriliyor… ${i}/114`; }); durum.textContent = 'Tamamı bu cihazda kayıtlı ✓'; }
      catch { durum.textContent = 'İndirme yarıda kaldı. İnternet bağlantını kontrol et.'; }
    }
    else if (e.target.closest('[data-yedekle]')) { dosyaIndir(`maneviyat-yedek-${anahtar()}.json`, yedekMetni()); tost('Yedek dosyası hazırlandı'); }
    else if (e.target.closest('[data-sifirla]')) {
      if (await onayla('Namaz kayıtların, zikirlerin, duaların ve günlüğün dahil bütün veriler silinecek. Emin misin?', { evet: 'Hepsini sil', tehlike: true })) { sifirla(); location.replace('#/karsilama'); }
    }
  });
}
