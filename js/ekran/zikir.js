// S11 Zikirler, S12 Zikirmatik (+ kilit ekranı tesbihi), S13 Zikir grubu
import { get, guncelle, yeniId } from '../store.js';
import { ustBaslik, esc, titret, tost, onayla, pencere } from '../ui.js';
import { ikon } from '../ikon.js';
import { anahtar } from '../tarih.js';
import { ZIKIRLER, HAZIR_GRUPLAR } from '../../data/icerik/zikirler.js';
import { ayetGetir } from '../kuran-veri.js';
import * as kilit from '../kilit-tesbih.js';

const zikirBul = id => ZIKIRLER.find(z => z.id === id);
const grupBul = id => HAZIR_GRUPLAR.find(g => g.id === id) || get('zikirGrup').find(g => g.id === id);

export default function zikirler({ el }) {
  ustBaslik({ baslik: 'Zikir', alt: 'Bir zikre dokun, saymaya başla' });
  const bugun = get('zikirSayim')[anahtar()] || {};
  const toplam = Object.values(bugun).reduce((a, b) => a + b, 0);
  const benim = get('zikirGrup');
  const aktif = get('aktifSayac');

  el.innerHTML = `
    ${aktif ? `<a class="kart kart-yumusak sira" href="#/zikir/say/${aktif.grupId ? 'grup:' + aktif.grupId : aktif.zikirId}" style="margin-bottom:12px">${ikon('tesbih')}<div class="esnek"><b>Yarım kalan zikrin var</b><p class="kucuk">${esc((aktif.grupId ? (grupBul(aktif.grupId) || {}).ad : (zikirBul(aktif.zikirId) || {}).ad) || '')} · ${aktif.sayi}${aktif.hedef ? '/' + aktif.hedef : ''}</p></div>${ikon('ileri')}</a>` : ''}
    <div class="kart sira-ara"><div><p class="kucuk soluk">Bugün toplam</p><p style="font-size:30px;font-weight:750;font-variant-numeric:tabular-nums">${toplam.toLocaleString('tr-TR')}</p></div><span class="satir-ikon" style="width:52px;height:52px">${ikon('tesbih', 28)}</span></div>

    <div class="bolum-baslik"><h2>Hazır diziler</h2></div>
    <div class="liste">${HAZIR_GRUPLAR.map(g => `<a class="satir" href="#/zikir/say/grup:${g.id}"><span class="satir-ikon">${ikon('liste')}</span><div class="esnek"><div class="satir-baslik">${esc(g.ad)}</div><div class="satir-alt">${esc(g.aciklama)}</div></div>${ikon('ileri')}</a>`).join('')}</div>

    <div class="bolum-baslik"><h2>Dizilerim</h2><a href="#/zikir/grup/yeni">${ikon('arti', 16)} Yeni</a></div>
    ${benim.length ? `<div class="liste">${benim.map(g => `<a class="satir" href="#/zikir/say/grup:${g.id}"><span class="satir-ikon">${ikon('yildiz')}</span><div class="esnek"><div class="satir-baslik">${esc(g.ad)}</div><div class="satir-alt">${g.ogeler.length} zikir · ${g.ogeler.reduce((a, o) => a + o.hedef, 0)} tekrar</div></div><span class="ikon-btn" data-duzenle="${g.id}" role="button" aria-label="Düzenle">${ikon('kalem', 20)}</span></a>`).join('')}</div>`
      : `<a class="kart sira" href="#/zikir/grup/yeni" style="color:var(--text-muted)">${ikon('arti')}<span>Kendi zikir dizini oluştur</span></a>`}

    <div class="bolum-baslik"><h2>Temel zikirler</h2></div>
    <div class="liste">${ZIKIRLER.map(z => `<a class="satir" href="#/zikir/say/${z.id}"><div class="esnek"><div class="satir-baslik">${esc(z.ad)}</div><div class="satir-alt">${esc(z.anlam)}</div></div><span class="rozet">${bugun[z.id] ? bugun[z.id] + ' · ' : ''}${z.hedef}</span></a>`).join('')}</div>`;

  el.addEventListener('click', e => {
    const d = e.target.closest('[data-duzenle]');
    if (d) { e.preventDefault(); location.hash = '#/zikir/grup/' + d.dataset.duzenle; }
  });
}

/** Zikirmatik. id: zikir id'si ya da 'grup:ID' */
export async function say({ el, p }) {
  const grup = p.id.startsWith('grup:') ? grupBul(p.id.slice(5)) : null;
  const tek = grup ? null : zikirBul(p.id);
  if (!grup && !tek) { location.replace('#/zikir'); return; }

  const adimlar = grup ? grup.ogeler.map(o => ({ ...o, z: o.zikirId ? zikirBul(o.zikirId) : { id: 'ayet:' + o.ayetRef, ad: o.ad, ayetRef: o.ayetRef } })) : [{ zikirId: tek.id, hedef: tek.hedef, z: tek }];
  // Ayet adımları için metni yükle
  for (const a of adimlar) {
    if (a.z.ayetRef && !a.z.ar) {
      try { const ay = await ayetGetir(a.z.ayetRef); a.z = { ...a.z, ar: ay.map(x => x.ar).join(' '), anlam: ay.map(x => x.tr).join(' ') }; } catch {}
    }
  }

  // Yarım kalan sayacı sürdür
  const kayitli = get('aktifSayac');
  let adim = 0, sayi = 0, hedefOzel = null;
  if (kayitli && ((grup && kayitli.grupId === grup.id) || (!grup && kayitli.zikirId === tek.id && !kayitli.grupId))) {
    adim = Math.min(kayitli.adim || 0, adimlar.length - 1); sayi = kayitli.sayi || 0; hedefOzel = kayitli.hedefOzel || null;
  }

  ustBaslik({ baslik: grup ? grup.ad : tek.ad, geri: '#/zikir', sag: `<button class="ikon-btn" data-hedef-ayar aria-label="Hedefi değiştir">${ikon('ayar')}</button>` });

  const hedef = () => hedefOzel || adimlar[adim].hedef || 0;
  const kaydet = () => guncelle(s => { s.aktifSayac = { zikirId: adimlar[adim].z.id, grupId: grup ? grup.id : null, adim, sayi, hedef: hedef(), hedefOzel }; });
  const gunlugeEkle = (n = 1) => guncelle(s => { const g = anahtar(); s.zikirSayim[g] = s.zikirSayim[g] || {}; const id = adimlar[adim].z.id; s.zikirSayim[g][id] = Math.max(0, (s.zikirSayim[g][id] || 0) + n); });

  function ciz() {
    const a = adimlar[adim], z = a.z, h = hedef();
    const oran = h ? Math.min(1, sayi / h) : 0;
    const R = 46, C = 2 * Math.PI * R;
    const tamam = h && sayi >= h;
    const sonAdim = adim === adimlar.length - 1;
    el.innerHTML = `
      <div class="zikir-sahne">
        ${grup ? `<div class="adim-cizgi" aria-label="Adım ${adim + 1} / ${adimlar.length}">${adimlar.map((_, i) => `<i class="${i < adim ? 'bitti' : i === adim ? 'simdi' : ''}"></i>`).join('')}</div>` : ''}
        <div class="zikir-ad">
          ${z.ar ? `<p class="arapca" lang="ar" dir="rtl" style="${z.ayetRef ? 'font-size:22px;line-height:1.9' : ''}">${esc(z.ar)}</p>` : ''}
          <h2 style="font-size:20px;margin-top:6px">${esc(z.ok || z.ad)}</h2>
          <p class="kucuk soluk" style="margin-top:4px;max-width:46ch">${esc(z.anlam || '')}</p>
        </div>
        <button class="zikir-dugme ${tamam ? 'tamam' : ''}" data-say aria-label="Say. Şu an ${sayi}${h ? ', hedef ' + h : ''}">
          <svg class="halka" viewBox="0 0 100 100" aria-hidden="true"><circle class="halka-iz" cx="50" cy="50" r="${R}" fill="none" stroke-width="2.2" stroke-dasharray="0.1 3.2" stroke-linecap="round"/><circle class="halka-dolu" cx="50" cy="50" r="${R}" fill="none" stroke-width="3" stroke-linecap="round" stroke-opacity="${oran > 0 ? 1 : 0}" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - oran)}"/></svg>
          <span><span class="sayi" aria-live="polite">${sayi}</span><span class="hedef" style="display:block">${h ? `/ ${h}` : 'dokun'}</span></span>
        </button>
        ${tamam ? `<p class="kucuk" style="color:var(--success);font-weight:700">${sonAdim ? 'Tamamlandı. Allah kabul etsin.' : 'Bu adım tamam.'}</p>` : ''}
        <div class="zikir-alt">
          <button class="btn ikincil" data-sifirla>${ikon('sifirla', 20)} Sıfırla</button>
          ${grup && tamam && !sonAdim ? `<button class="btn" data-sonraki>Sonraki ${ikon('ileri', 20)}</button>` : ''}
          ${!grup || sonAdim ? `<button class="btn ikincil" data-bitir>${ikon('tik', 20)} Bitir</button>` : ''}
        </div>
        ${kilit.destekleniyor() ? `<button class="btn ${kilit.acikMi() ? '' : 'hayalet'} kucuk-btn" data-kilit aria-pressed="${kilit.acikMi()}">${ikon('ses', 18)} ${kilit.acikMi() ? 'Kilit ekranı tesbihi açık' : 'Kilit ekranından çek'}</button>` : ''}
        <p class="cok-kucuk soluk merkez">Boşluk tuşu ile de sayabilirsin.</p>
      </div>`;
    kilit.guncelle({ ad: z.ad, sayi, hedef: h });
  }

  function artir(n = 1) {
    const h = hedef();
    if (n < 0 && sayi === 0) return;
    sayi += n;
    gunlugeEkle(n);
    if (n > 0) {
      if (h && sayi === h) {
        titret([60, 60, 60]);
        // Kilit ekranında dizi otomatik ilerlesin
        if (grup && adim < adimlar.length - 1 && kilit.acikMi()) { adim++; sayi = 0; hedefOzel = null; }
      } else titret(12);
    }
    kaydet(); ciz();
  }

  ciz();
  kilit.bagla(n => artir(n));

  el.addEventListener('click', async e => {
    if (e.target.closest('[data-say]')) artir(1);
    else if (e.target.closest('[data-sonraki]')) { adim++; sayi = 0; hedefOzel = null; kaydet(); ciz(); }
    else if (e.target.closest('[data-sifirla]')) { if (sayi === 0 || await onayla('Sayaç sıfırlansın mı?', { evet: 'Sıfırla' })) { sayi = 0; kaydet(); ciz(); } }
    else if (e.target.closest('[data-bitir]')) { guncelle(s => { s.aktifSayac = null; }); kilit.bitir(); tost('Allah kabul etsin'); location.hash = '#/zikir'; }
    else if (e.target.closest('[data-kilit]')) {
      if (kilit.acikMi()) { kilit.bitir(); ciz(); return; }
      try {
        await kilit.baslat({ ad: adimlar[adim].z.ad, sayi, hedef: hedef(), artir: n => artir(n) });
        ciz();
        pencere(`<div class="yigin"><p>Şimdi telefonunu kilitleyebilirsin. Kilit ekranındaki müzik kontrollerinde:</p>
          <ul class="metin-govde" style="font-size:16px"><li><b>⏭ (sonraki)</b> → +1</li><li><b>⏮ (önceki)</b> → yanlış basışı geri al</li><li>Bazı telefonlarda <b>⏯</b> tuşu da +1 sayar</li></ul>
          <p class="kucuk soluk">Kulaklık tuşları ve akıllı saatteki medya kontrolleri de çalışabilir. Bitince buradan "Kilit ekranı tesbihi açık" düğmesine basarak kapat.</p>
          <button class="btn tam" data-kapat>Anladım</button></div>`, { baslik: 'Kilit ekranından tesbih' });
      } catch (err) { tost(err.message || 'Başlatılamadı'); }
    }
  });

  const ust = document.querySelector('#ust');
  const hedefAyar = e => {
    if (!e.target.closest('[data-hedef-ayar]')) return;
    const { el: pe, kapat } = pencere(`<form class="yigin"><div class="alan"><label for="hdf">Hedef sayı (0 = sınırsız)</label>
      <input class="girdi" id="hdf" type="number" min="0" max="100000" inputmode="numeric" value="${hedef()}"></div>
      <div class="cip-grup">${[33, 99, 100, 500, 1000].map(n => `<button type="button" class="cip" data-n="${n}">${n}</button>`).join('')}</div>
      <div class="btn-sira"><button type="button" class="btn ikincil" data-kapat>Vazgeç</button><button class="btn">Kaydet</button></div></form>`, { baslik: 'Hedef' });
    pe.addEventListener('click', ev => { const c = ev.target.closest('[data-n]'); if (c) pe.querySelector('#hdf').value = c.dataset.n; });
    pe.querySelector('form').addEventListener('submit', ev => { ev.preventDefault(); hedefOzel = Math.max(0, parseInt(pe.querySelector('#hdf').value, 10) || 0); kaydet(); ciz(); kapat(); });
  };
  ust.addEventListener('click', hedefAyar);
  const tus = e => {
    if ((e.code === 'Space' || e.key === ' ' || e.key === 'Enter') && !e.target.closest('input,textarea,button,a,dialog')) { e.preventDefault(); artir(1); }
  };
  document.addEventListener('keydown', tus);
  return () => { ust.removeEventListener('click', hedefAyar); document.removeEventListener('keydown', tus); };
}

/** S13 Zikir dizisi oluştur / düzenle */
export function grup({ el, p }) {
  const yeni = p.id === 'yeni';
  const mevcut = yeni ? null : get('zikirGrup').find(g => g.id === p.id);
  if (!yeni && !mevcut) { location.replace('#/zikir'); return; }
  let ad = mevcut ? mevcut.ad : '';
  let ogeler = mevcut ? mevcut.ogeler.map(o => ({ ...o })) : [];
  ustBaslik({ baslik: yeni ? 'Yeni zikir dizisi' : 'Diziyi düzenle', geri: '#/zikir' });

  function ciz() {
    el.innerHTML = `
      <div class="alan"><label for="g-ad">Dizinin adı</label><input class="girdi" id="g-ad" maxlength="40" value="${esc(ad)}" placeholder="Örneğin: Sabah zikrim"></div>
      <div class="bolum-baslik"><h2>Sıradaki zikirler</h2></div>
      ${ogeler.length ? `<div class="liste">${ogeler.map((o, i) => {
        const z = zikirBul(o.zikirId);
        return `<div class="sayac-satir"><div class="esnek"><b>${i + 1}. ${esc(z ? z.ad : '?')}</b></div>
          <div class="sayac"><input class="girdi" style="width:90px;min-height:40px;text-align:right" type="number" min="1" max="100000" inputmode="numeric" value="${o.hedef}" data-hedef-i="${i}" aria-label="${esc(z ? z.ad : '')} hedefi">
          <button class="ikon-btn" data-sil-i="${i}" aria-label="Kaldır">${ikon('cop', 20)}</button></div></div>`;
      }).join('')}</div>` : '<p class="kucuk soluk">Aşağıdan zikir ekle.</p>'}
      <div class="bolum-baslik"><h2>Zikir ekle</h2></div>
      <div class="cip-grup">${ZIKIRLER.map(z => `<button class="cip" data-ekle="${z.id}">${ikon('arti', 16)} ${esc(z.ad)}</button>`).join('')}</div>
      <div class="btn-sira" style="justify-content:space-between;margin-top:24px">
        ${yeni ? '<span></span>' : `<button class="btn tehlike" data-sil>${ikon('cop', 20)} Sil</button>`}
        <button class="btn" data-kaydet ${ogeler.length ? '' : 'disabled'}>Kaydet</button></div>`;
  }
  ciz();

  el.addEventListener('input', e => {
    if (e.target.id === 'g-ad') ad = e.target.value;
    if (e.target.dataset.hedefI != null) ogeler[+e.target.dataset.hedefI].hedef = Math.max(1, parseInt(e.target.value, 10) || 1);
  });
  el.addEventListener('click', async e => {
    const ek = e.target.closest('[data-ekle]'), sil = e.target.closest('[data-sil-i]');
    if (ek) { const z = zikirBul(ek.dataset.ekle); ogeler.push({ zikirId: z.id, hedef: z.hedef }); ciz(); }
    else if (sil) { ogeler.splice(+sil.dataset.silI, 1); ciz(); }
    else if (e.target.closest('[data-kaydet]')) {
      const kayit = { id: mevcut ? mevcut.id : yeniId(), ad: (ad || '').trim() || 'Zikir dizim', ogeler };
      guncelle(s => { const i = s.zikirGrup.findIndex(g => g.id === kayit.id); if (i >= 0) s.zikirGrup[i] = kayit; else s.zikirGrup.push(kayit); });
      tost('Kaydedildi'); location.hash = '#/zikir';
    } else if (e.target.closest('[data-sil]')) {
      if (await onayla('Bu dizi silinsin mi?', { evet: 'Sil', tehlike: true })) {
        guncelle(s => { s.zikirGrup = s.zikirGrup.filter(g => g.id !== mevcut.id); if (s.aktifSayac && s.aktifSayac.grupId === mevcut.id) s.aktifSayac = null; });
        location.hash = '#/zikir';
      }
    }
  });
}
