// Beğendiklerim: kalp ile kaydedilen ayet, hadis, dua ve kıssalar
import { get } from '../store.js';
import { ustBaslik, esc, bos } from '../ui.js';
import { ikon } from '../ikon.js';
import { eylemDugmeleri, eylemleriBagla } from '../paylas.js';

const TUR_ADI = { ayet: 'Ayet', hadis: 'Hadis', dua: 'Dua', kissa: 'Kıssa', zikir: 'Zikir' };

export default function begeniler({ el }) {
  ustBaslik({ baslik: 'Beğendiklerim', alt: 'Kalbine dokunanlar, paylaşmaya hazır', geri: '#/daha' });
  let filtre = '';
  const ciz = () => {
    const hepsi = get('begeniler').slice().sort((a, b) => b.zaman - a.zaman);
    const ls = hepsi.filter(x => !filtre || x.tur === filtre);
    const turler = [...new Set(hepsi.map(x => x.tur))];
    const harita = {};
    el.innerHTML = hepsi.length ? `
      ${turler.length > 1 ? `<div class="cip-grup" style="margin-bottom:14px"><button class="cip" aria-pressed="${!filtre}" data-filtre="">Tümü (${hepsi.length})</button>${turler.map(t => `<button class="cip" aria-pressed="${filtre === t}" data-filtre="${t}">${TUR_ADI[t] || t}</button>`).join('')}</div>` : ''}
      <div class="yigin">${ls.map((x, i) => {
        harita[i] = x;
        return `<article class="kart">
          <div class="sira-ara"><span class="rozet vurgu">${esc(TUR_ADI[x.tur] || '')}${x.kaynak ? ' · ' + esc(x.kaynak) : ''}</span><span class="ayet-eylem">${eylemDugmeleri(i, x)}</span></div>
          ${x.baslik && x.tur !== 'hadis' ? `<h3 style="margin-top:10px;font-family:var(--font-serif);font-size:22px">${esc(x.baslik)}</h3>` : ''}
          ${x.ar ? `<p class="arapca" lang="ar" dir="rtl" style="font-size:24px">${esc(x.ar)}</p>` : ''}
          <p class="metin-govde" style="margin-top:6px">${esc(x.tr)}</p>
          ${x.href ? `<a class="kucuk" href="${esc(x.href)}" style="display:inline-block;margin-top:8px;text-decoration:none">Kaynağında aç ${ikon('ileri', 14)}</a>` : ''}
        </article>`;
      }).join('')}</div>`
      : bos('kalp', 'Henüz bir şey beğenmedin. Ayet, hadis, dua ya da kıssalardaki kalp işaretine dokunduğunda burada toplanır.', '<a class="btn" href="#/his">Ayetlere göz at</a>');
    eylemHarita = harita;
  };
  let eylemHarita = {};
  ciz();
  eylemleriBagla(el, new Proxy({}, { get: (_, k) => eylemHarita[k] }));
  el.addEventListener('click', e => {
    const f = e.target.closest('[data-filtre]');
    if (f) { filtre = f.dataset.filtre; ciz(); }
    // Beğeni kaldırılınca listeyi yenile
    if (e.target.closest('[data-begen]')) setTimeout(ciz, 50);
  });
  const yenile = () => ciz();
  document.addEventListener('begeni-degisti', yenile);
  return () => document.removeEventListener('begeni-degisti', yenile);
}
