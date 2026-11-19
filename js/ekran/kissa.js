// S17 Kıssa kütüphanesi, S06 kıssa okuyucu
import { get, guncelle } from '../store.js';
import { ustBaslik, esc, paylas, tost } from '../ui.js';
import { ikon } from '../ikon.js';
import { anahtar } from '../tarih.js';
import { KISSALAR, KISSA_KATEGORILERI } from '../../data/icerik/kissalar.js';

export default function kissalar({ el }) {
  ustBaslik({ baslik: 'Kıssalar', alt: `${KISSALAR.length} hikâye`, geri: '#/daha' });
  let kat = '';
  const ciz = () => {
    const okunan = get('okunanKissa');
    const ls = KISSALAR.filter(k => !kat || k.kat === kat);
    el.innerHTML = `
      <div class="cip-grup" role="group" aria-label="Kategori" style="margin-bottom:14px">
        <button class="cip" aria-pressed="${!kat}" data-kat="">Tümü</button>
        ${KISSA_KATEGORILERI.map(k => `<button class="cip" aria-pressed="${kat === k.k}" data-kat="${k.k}">${esc(k.ad)}</button>`).join('')}
      </div>
      <div class="liste">${ls.map(k => `<a class="satir" href="#/kissa/${k.id}"><span class="satir-ikon">${ikon(okunan[k.id] ? 'tik' : 'yaprak')}</span><div class="esnek"><div class="satir-baslik">${esc(k.baslik)}</div><div class="satir-alt">${esc(k.ozet)}</div></div>${ikon('ileri')}</a>`).join('')}</div>`;
  };
  ciz();
  el.addEventListener('click', e => { const c = e.target.closest('[data-kat]'); if (c) { kat = c.dataset.kat; ciz(); } });
}

export function oku({ el, p, q }) {
  const k = KISSALAR.find(x => x.id === p.id);
  if (!k) { location.replace('#/kissa'); return; }
  const gunluk = q.gun === '1';
  ustBaslik({ baslik: k.baslik, geri: gunluk ? '#/' : '#/kissa' });
  const g = anahtar();
  const ciz = () => {
    const bitti = gunluk && !!(get('gorev')[g] || {}).kissa;
    el.innerHTML = `<article class="kart">
      <p class="rozet vurgu">${esc((KISSA_KATEGORILERI.find(x => x.k === k.kat) || {}).ad || '')}</p>
      <div class="metin-govde" style="margin-top:12px">${k.metin.map(m => `<p>${esc(m)}</p>`).join('')}</div>
      <div class="kart kart-yumusak" style="margin-top:18px"><b>Bize düşen</b><p style="margin-top:4px">${esc(k.ders)}</p></div>
      <p class="kaynak">Kaynak: ${esc(k.kaynak)}</p></article>
      <div class="btn-sira"><button class="btn ikincil" data-paylas>${ikon('paylas', 20)} Paylaş</button></div>
      ${gunluk ? `<button class="btn buyuk tam" style="margin-top:12px" data-tamam ${bitti ? 'disabled' : ''}>${ikon('tik', 20)} ${bitti ? 'Tamamlandı' : 'Okudum'}</button>` : ''}`;
  };
  ciz();
  guncelle(s => { s.okunanKissa[k.id] = 1; });
  el.addEventListener('click', e => {
    if (e.target.closest('[data-paylas]')) paylas(`${k.baslik}\n\n${k.metin.join('\n\n')}\n\n${k.ders}\n— ${k.kaynak}`);
    if (e.target.closest('[data-tamam]')) {
      guncelle(s => { s.gorev[g] = s.gorev[g] || {}; s.gorev[g].kissa = 1; });
      tost('Allah kabul etsin'); setTimeout(() => { location.hash = '#/'; }, 500);
    }
  });
}
