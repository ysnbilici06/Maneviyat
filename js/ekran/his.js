// S18 Nasıl hissediyorsun?  S19 duyguya göre ayetler
import { ustBaslik, esc, ayetBlok } from '../ui.js';
import { eylemDugmeleri, eylemleriBagla } from '../paylas.js';
import { ikon } from '../ikon.js';
import { DUYGULAR } from '../../data/icerik/duygular.js';
import { ayetGetir, refEtiket } from '../kuran-veri.js';

export default function his({ el }) {
  ustBaslik({ baslik: 'Nasıl hissediyorsun?', alt: 'Kalbine iyi gelecek ayetleri bulalım', geri: '#/' });
  el.innerHTML = `<div class="his-izgara" role="list">${DUYGULAR.map(d => `
    <a class="kart his-kart" role="listitem" href="#/his/${d.k}"><span class="simge" aria-hidden="true">${d.simge}</span><b>${esc(d.ad)}</b></a>`).join('')}</div>`;
}

export async function sonuc({ el, p }) {
  const d = DUYGULAR.find(x => x.k === p.k);
  if (!d) { location.replace('#/his'); return; }
  ustBaslik({ baslik: d.ad, alt: esc(d.giris), geri: '#/his' });
  el.innerHTML = '<p class="soluk">Yükleniyor…</p>';
  const parcalar = await Promise.all(d.ayetler.map(async x => ({ x, ayetler: await ayetGetir(x.ref), etiket: await refEtiket(x.ref) })));
  const harita = Object.fromEntries(parcalar.map(({ x, ayetler, etiket }, i) => [i, { tur: 'ayet', etiket: d.ad, ar: ayetler.map(a => a.ar).join(' ۝ '), tr: ayetler.map(a => a.tr).join(' '), kaynak: etiket, id: 'ayet:' + x.ref, href: `#/kuran/${x.ref.split(':')[0]}?ayet=${x.ref.split(':')[1].split('-')[0]}` }]));
  el.innerHTML = `<div class="yigin">${parcalar.map(({ x, ayetler, etiket }, i) => `
    <article class="kart">
      <div class="sira-ara"><span class="rozet vurgu">${esc(etiket)}</span>
        <span class="ayet-eylem"><a class="ikon-btn" href="#/kuran/${x.ref.split(':')[0]}?ayet=${x.ref.split(':')[1].split('-')[0]}" aria-label="Sûrede aç">${ikon('kitap', 20)}</a>${eylemDugmeleri(i, harita[i])}</span></div>
      ${ayetler.map(a => ayetBlok(a)).join('')}
      <p class="kucuk" style="margin-top:4px;color:var(--gold);font-weight:600">${esc(x.not)}</p>
    </article>`).join('')}</div>
    <div class="btn-sira" style="justify-content:center"><a class="btn ikincil" href="#/his">Başka bir duygu seç</a></div>`;
  eylemleriBagla(el, harita);
}
