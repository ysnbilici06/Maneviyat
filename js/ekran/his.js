// S18 Nasıl hissediyorsun?  S19 duyguya göre ayetler
import { ustBaslik, esc, ayetBlok, paylas } from '../ui.js';
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
  el.innerHTML = `<div class="yigin">${parcalar.map(({ x, ayetler, etiket }, i) => `
    <article class="kart">
      <div class="sira-ara"><span class="rozet vurgu">${esc(etiket)}</span>
        <span class="ayet-eylem"><a class="ikon-btn" href="#/kuran/${x.ref.split(':')[0]}?ayet=${x.ref.split(':')[1].split('-')[0]}" aria-label="Sûrede aç">${ikon('kitap', 20)}</a><button class="ikon-btn" data-paylas="${i}" aria-label="Paylaş">${ikon('paylas', 20)}</button></span></div>
      ${ayetler.map(a => ayetBlok(a)).join('')}
      <p class="kucuk" style="margin-top:4px;color:var(--gold);font-weight:600">${esc(x.not)}</p>
    </article>`).join('')}</div>
    <div class="btn-sira" style="justify-content:center"><a class="btn ikincil" href="#/his">Başka bir duygu seç</a></div>`;
  el.addEventListener('click', e => {
    const b = e.target.closest('[data-paylas]');
    if (b) { const { ayetler, etiket } = parcalar[+b.dataset.paylas]; paylas(`${ayetler.map(a => a.tr).join(' ')}\n— ${etiket}`); }
  });
}
