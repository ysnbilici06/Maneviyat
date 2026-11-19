// S04 Günün ayeti / S05 Günün duası
import { get, guncelle } from '../store.js';
import { ustBaslik, ayetBlok, esc, paylas, tost } from '../ui.js';
import { ikon } from '../ikon.js';
import { anahtar } from '../tarih.js';
import { gununAyetRef, gununDuasi, duaMetni } from '../gunun-icerigi.js';
import { ayetGetir, refEtiket } from '../kuran-veri.js';

export default async function gun({ el, p }) {
  const tur = p.tur === 'dua' ? 'dua' : 'ayet';
  const g = anahtar();
  ustBaslik({ baslik: tur === 'ayet' ? 'Günün ayeti' : 'Günün duası', geri: '#/' });

  let govde = '', paylasMetni = '', ek = '';
  if (tur === 'ayet') {
    const ref = gununAyetRef();
    const [ayetler, etiket] = await Promise.all([ayetGetir(ref), refEtiket(ref)]);
    govde = ayetler.map(a => ayetBlok(a, { ref: `${a.n}. ayet` })).join('');
    paylasMetni = `${ayetler.map(a => a.tr).join(' ')}\n— ${etiket}`;
    ek = `<a class="btn ikincil" href="#/kuran/${ref.split(':')[0]}?ayet=${ref.split(':')[1].split('-')[0]}">${ikon('kitap', 20)} Sûrede aç</a>`;
    govde = `<p class="rozet vurgu" style="margin-bottom:4px">${esc(etiket)}</p>${govde}`;
  } else {
    const dua = gununDuasi();
    const m = await duaMetni(dua);
    govde = `<h2 style="font-size:22px">${esc(dua.ad)}</h2>${ayetBlok(m)}${m.etiket ? `<p class="kaynak">${esc(m.etiket)}</p>` : ''}`;
    paylasMetni = `${dua.ad}\n\n${m.ok}\n\n${m.tr}`;
    ek = `<a class="btn ikincil" href="#/dua/kutuphane">${ikon('liste', 20)} Tüm dualar</a>`;
  }

  const ciz = () => {
    const bitti = !!(get('gorev')[g] || {})[tur];
    el.innerHTML = `<div class="kart">${govde}</div>
      <div class="btn-sira" style="justify-content:space-between">
        <button class="btn ikincil" data-paylas>${ikon('paylas', 20)} Paylaş</button>${ek}
      </div>
      <button class="btn buyuk tam" style="margin-top:16px" data-tamam ${bitti ? 'disabled' : ''}>${ikon('tik', 20)} ${bitti ? 'Tamamlandı' : 'Okudum'}</button>`;
  };
  ciz();

  el.addEventListener('click', e => {
    if (e.target.closest('[data-paylas]')) paylas(paylasMetni);
    if (e.target.closest('[data-tamam]')) {
      guncelle(s => { s.gorev[g] = s.gorev[g] || {}; s.gorev[g][tur] = 1; });
      tost('Allah kabul etsin');
      setTimeout(() => { location.hash = '#/'; }, 500);
    }
  });
}
