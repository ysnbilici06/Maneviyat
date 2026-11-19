// S20 Sure listesi, S21 Sure okuyucu, S22 dinleme
import { get, set, guncelle } from '../store.js';
import { ustBaslik, esc, ayetBlok, tost, pencere } from '../ui.js';
import { paylasPenceresi } from '../paylas.js';
import { ikon } from '../ikon.js';
import { sureler, sure } from '../kuran-veri.js';
import * as oynatici from '../oynatici.js';

const BESMELE = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ';

export default async function liste({ el }) {
  ustBaslik({ baslik: "Kur'an-ı Kerîm", alt: '114 sûre · Diyanet meali' });
  const ls = await sureler();
  const okuma = get('okuma');
  const yer = get('yerImleri');
  let sekme = 'sure';

  const ciz = (q = '') => {
    const s = q.trim().toLocaleLowerCase('tr');
    const no = parseInt(s, 10);
    const sonuc = ls.filter(x => !s || x.ad.toLocaleLowerCase('tr').includes(s) || x.no === no);
    el.querySelector('#icerik').innerHTML = sekme === 'sure'
      ? `<div class="liste">${sonuc.map(x => `<a class="satir" href="#/kuran/${x.no}"><span class="satir-no">${x.no}</span><div class="esnek"><div class="satir-baslik">${esc(x.ad)}</div><div class="satir-alt">${x.ayet} ayet · ${x.inis} · ${x.cuz}. cüz</div></div><span class="arapca" style="font-size:20px;margin:0;line-height:1.4" lang="ar">${esc(x.ar.replace('سُورَةُ ', ''))}</span></a>`).join('') || '<p class="soluk">Sonuç yok.</p>'}</div>`
      : (yer.length ? `<div class="liste">${yer.slice().reverse().map(y => `<a class="satir" href="#/kuran/${y.sure}?ayet=${y.ayet}"><span class="satir-ikon">${ikon('yerimi')}</span><div class="esnek"><div class="satir-baslik">${esc(ls[y.sure - 1].ad)} ${y.sure}/${y.ayet}</div><div class="satir-alt">${new Date(y.zaman).toLocaleDateString('tr-TR')}</div></div>${ikon('ileri')}</a>`).join('')}</div>`
        : `<div class="bos">${ikon('yerimi', 40)}<p>Okurken bir ayetin yanındaki yer imi işaretine dokunarak buraya ekleyebilirsin.</p></div>`);
  };

  el.innerHTML = `
    ${okuma ? `<a class="kart kart-kahraman devam-kart" href="#/kuran/${okuma.sure}?ayet=${okuma.ayet}" style="margin-bottom:14px"><span class="satir-ikon" style="background:rgba(255,255,255,.15);color:#fff">${ikon('kitap')}</span><div class="esnek"><p class="kucuk soluk">Kaldığın yerden devam et</p><b style="font-size:18px">${esc(ls[okuma.sure - 1].ad)} · ${okuma.ayet}. ayet</b></div>${ikon('ileri')}</a>` : ''}
    <div class="bolumlu" role="group" aria-label="Görünüm" style="margin-bottom:12px"><button aria-pressed="true" data-sekme="sure">Sûreler</button><button aria-pressed="false" data-sekme="yer">Yer imleri (${yer.length})</button></div>
    <div class="arama" style="margin-bottom:12px" id="arama-kutu">${ikon('ara', 20)}<input class="girdi" type="search" id="ara" placeholder="Sûre adı ya da numarası" aria-label="Sûre ara"></div>
    <div id="icerik"></div>`;
  ciz();
  el.querySelector('#ara').addEventListener('input', e => ciz(e.target.value));
  el.addEventListener('click', e => {
    const b = e.target.closest('[data-sekme]'); if (!b) return;
    sekme = b.dataset.sekme;
    el.querySelectorAll('[data-sekme]').forEach(x => x.setAttribute('aria-pressed', x === b));
    el.querySelector('#arama-kutu').hidden = sekme !== 'sure';
    ciz(el.querySelector('#ara').value);
  });
}

export async function oku({ el, p, q }) {
  const no = Number(p.sure);
  if (!(no >= 1 && no <= 114)) { location.replace('#/kuran'); return; }
  const [ls, veri] = await Promise.all([sureler(), sure(no)]);
  const bilgi = ls[no - 1];
  ustBaslik({ baslik: `${bilgi.ad} Sûresi`, alt: `${bilgi.ayet} ayet · ${bilgi.inis}`, geri: '#/kuran',
    sag: `<button class="ikon-btn" data-gorunum aria-label="Görünüm ayarları">${ikon('goz')}</button><button class="ikon-btn" data-dinle aria-label="Sûreyi dinle">${ikon('ses')}</button>` });

  const yerImli = n => get('yerImleri').some(y => y.sure === no && y.ayet === n);
  const ayetHtml = a => ayetBlok({ ...a, id: 'a' + a.n }, {
    ref: `${no}:${a.n}`,
    eylemler: `<button class="ikon-btn" data-oynat="${a.n}" aria-label="${a.n}. ayetten dinle">${ikon('oynat', 18)}</button>
      <button class="ikon-btn ${yerImli(a.n) ? 'secili' : ''}" data-yerimi="${a.n}" aria-label="Yer imi" aria-pressed="${yerImli(a.n)}">${ikon('yerimi', 18)}</button>
      <button class="ikon-btn" data-paylas="${a.n}" aria-label="Paylaş">${ikon('paylas', 18)}</button>`,
  });

  const ciz = () => {
    el.innerHTML = `
      <div class="sure-baslik"><p class="arapca" lang="ar">${esc(bilgi.ar)}</p></div>
      ${no !== 1 && no !== 9 && get('ayarlar.okuma.ar') ? `<p class="besmele" lang="ar" dir="rtl">${BESMELE}</p>` : ''}
      <div>${veri.ayetler.map(ayetHtml).join('')}</div>
      <div class="sira-ara" style="margin:20px 0">
        ${no > 1 ? `<a class="btn ikincil" href="#/kuran/${no - 1}">${ikon('geri', 20)} ${esc(ls[no - 2].ad)}</a>` : '<span></span>'}
        ${no < 114 ? `<a class="btn ikincil" href="#/kuran/${no + 1}">${esc(ls[no].ad)} ${ikon('ileri', 20)}</a>` : '<span></span>'}
      </div>
      <p class="cok-kucuk soluk">Arapça metin: Tanzil Projesi (tanzil.net). Meal: Diyanet İşleri Başkanlığı. Okunuş: Muhammet Abay. Ses: Mişâri Râşid el-Afâsî.</p>`;
  };
  ciz();

  // Hedef ayete kaydır
  const hedef = Number(q.ayet);
  if (hedef > 1) requestAnimationFrame(() => { const a = el.querySelector('#a' + hedef); if (a) a.scrollIntoView({ block: 'start' }); window.scrollBy(0, -70); });

  // Okuma konumunu izle
  let sonKayit = 0;
  const gozlemci = 'IntersectionObserver' in window ? new IntersectionObserver(girdiler => {
    const gorunen = girdiler.filter(g => g.isIntersecting).map(g => Number(g.target.id.slice(1)));
    if (!gorunen.length) return;
    const n = Math.min(...gorunen);
    if (Date.now() - sonKayit > 800) { sonKayit = Date.now(); set('okuma', { sure: no, ayet: n, zaman: Date.now() }); }
  }, { rootMargin: '-80px 0px -60% 0px' }) : null;
  const izle = () => { if (gozlemci) { gozlemci.disconnect(); el.querySelectorAll('.ayet').forEach(a => gozlemci.observe(a)); } };
  izle();
  if (!hedef) set('okuma', { sure: no, ayet: 1, zaman: Date.now() });

  // Çalan ayeti vurgula
  const vurgula = d => {
    el.querySelectorAll('.ayet.caliyor').forEach(x => x.classList.remove('caliyor'));
    if (d.aktif && d.aktif.sure === no) {
      const a = el.querySelector('#a' + d.aktif.n);
      if (a) { a.classList.add('caliyor'); if (d.calisiyor) a.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
    }
  };
  const birak = oynatici.dinle(vurgula);
  vurgula(oynatici.durum());

  el.addEventListener('click', e => {
    const o = e.target.closest('[data-oynat]'), y = e.target.closest('[data-yerimi]'), pa = e.target.closest('[data-paylas]');
    if (o) oynatici.cal(no, Number(o.dataset.oynat));
    else if (y) {
      const n = Number(y.dataset.yerimi);
      guncelle(s => {
        const i = s.yerImleri.findIndex(x => x.sure === no && x.ayet === n);
        if (i >= 0) s.yerImleri.splice(i, 1); else s.yerImleri.push({ sure: no, ayet: n, zaman: Date.now() });
      });
      const on = yerImli(n);
      y.classList.toggle('secili', on); y.setAttribute('aria-pressed', on);
      tost(on ? 'Yer imi eklendi' : 'Yer imi kaldırıldı');
    } else if (pa) {
      const a = veri.ayetler.find(x => x.n === Number(pa.dataset.paylas));
      paylasPenceresi({ tur: 'ayet', ar: a.ar, tr: a.tr, kaynak: `${bilgi.ad} ${no}/${a.n}`, id: `ayet:${no}:${a.n}`, href: `#/kuran/${no}?ayet=${a.n}` });
    }
  });

  const ust = document.querySelector('#ust');
  const ustTik = e => {
    if (e.target.closest('[data-dinle]')) { const d = oynatici.durum(); if (d.calisiyor && d.aktif && d.aktif.sure === no) oynatici.duraklat(); else oynatici.cal(no, (get('okuma') || {}).sure === no ? get('okuma').ayet : 1); }
    if (e.target.closest('[data-gorunum]')) gorunumAyarlari(() => { ciz(); izle(); vurgula(oynatici.durum()); });
  };
  ust.addEventListener('click', ustTik);
  return () => { ust.removeEventListener('click', ustTik); birak(); if (gozlemci) gozlemci.disconnect(); };
}

export function gorunumAyarlari(sonra) {
  const o = get('ayarlar.okuma');
  const { el } = pencere(`<div class="yigin">
    ${[['ar', 'Arapça metin'], ['ok', 'Okunuş'], ['tr', 'Meal']].map(([k, ad]) => `<label class="sira-ara"><span>${ad}</span><span class="anahtar"><input type="checkbox" data-k="${k}" ${o[k] ? 'checked' : ''}><span></span></span></label>`).join('')}
    <div class="alan"><span class="etiket">Yazı boyutu</span>
      <div class="cip-grup">${[[0.85, 'Küçük'], [1, 'Normal'], [1.2, 'Büyük'], [1.45, 'Çok büyük']].map(([v, ad]) => `<button class="cip" data-yazi="${v}" aria-pressed="${o.yazi === v}">${ad}</button>`).join('')}</div></div>
    <button class="btn tam" data-kapat>Tamam</button></div>`, { baslik: 'Görünüm' });
  el.addEventListener('change', e => {
    const k = e.target.dataset.k; if (!k) return;
    const yeni = { ...get('ayarlar.okuma'), [k]: e.target.checked };
    if (!yeni.ar && !yeni.ok && !yeni.tr) { e.target.checked = true; tost('En az biri açık kalmalı'); return; }
    set('ayarlar.okuma', yeni); sonra && sonra();
  });
  el.addEventListener('click', e => {
    const b = e.target.closest('[data-yazi]'); if (!b) return;
    set('ayarlar.okuma', { ...get('ayarlar.okuma'), yazi: Number(b.dataset.yazi) });
    el.querySelectorAll('[data-yazi]').forEach(x => x.setAttribute('aria-pressed', x === b));
    sonra && sonra();
  });
}
