// S23 Hadisler
import { ustBaslik, esc, paylas, bos } from '../ui.js';
import { ikon } from '../ikon.js';
import { HADISLER, HADIS_KONULARI } from '../../data/icerik/hadisler.js';
import { gunNo } from '../tarih.js';

const kart = (h, i) => `<article class="kart"><p class="metin-govde">“${esc(h.m)}”</p>
  <div class="sira-ara" style="margin-top:10px"><span class="kucuk soluk">${esc(h.k)}</span><button class="ikon-btn" data-paylas="${i}" aria-label="Paylaş">${ikon('paylas', 20)}</button></div></article>`;

function paylasDinle(el, liste) {
  el.addEventListener('click', e => {
    const b = e.target.closest('[data-paylas]');
    if (b) { const h = liste[+b.dataset.paylas]; paylas(`“${h.m}”\n— ${h.k}`, 'Hadis-i şerif'); }
  });
}

export default function hadisler({ el }) {
  ustBaslik({ baslik: 'Hadisler', alt: `${HADISLER.length} hadis-i şerif`, geri: '#/daha' });
  const gunun = HADISLER[(gunNo() * 11 + 3) % HADISLER.length];
  el.innerHTML = `
    <div class="bolum-baslik" style="margin-top:0"><h2>Günün hadisi</h2></div>
    ${kart(gunun, HADISLER.indexOf(gunun))}
    <div class="arama" style="margin:16px 0 0">${ikon('ara', 20)}<input class="girdi" type="search" id="ara" placeholder="Hadislerde ara" aria-label="Hadislerde ara"></div>
    <div id="sonuc"></div>`;
  const ciz = (q = '') => {
    const s = q.trim().toLocaleLowerCase('tr');
    el.querySelector('#sonuc').innerHTML = s
      ? (HADISLER.map((h, i) => [h, i]).filter(([h]) => h.m.toLocaleLowerCase('tr').includes(s)).map(([h, i]) => kart(h, i)).join('<div style="height:12px"></div>') || bos('ara', 'Sonuç bulunamadı.'))
      : `<div class="bolum-baslik"><h2>Konular</h2></div><div class="liste">${HADIS_KONULARI.map(k => `<a class="satir" href="#/hadis/${k.k}"><div class="esnek"><div class="satir-baslik">${esc(k.ad)}</div><div class="satir-alt">${HADISLER.filter(h => h.konu === k.k).length} hadis</div></div>${ikon('ileri')}</a>`).join('')}</div>`;
  };
  ciz();
  el.querySelector('#ara').addEventListener('input', e => ciz(e.target.value));
  paylasDinle(el, HADISLER);
  el.insertAdjacentHTML('beforeend', '<p class="cok-kucuk soluk" style="margin-top:16px">Hadisler, kaynaklardaki anlamına sadık kalınarak sade bir Türkçe ile aktarılmıştır.</p>');
}

export function konu({ el, p }) {
  const k = HADIS_KONULARI.find(x => x.k === p.konu);
  if (!k) { location.replace('#/hadis'); return; }
  ustBaslik({ baslik: k.ad, geri: '#/hadis' });
  const ls = HADISLER.filter(h => h.konu === k.k);
  el.innerHTML = `<div class="yigin">${ls.map(kart).join('')}</div>`;
  paylasDinle(el, ls);
}
