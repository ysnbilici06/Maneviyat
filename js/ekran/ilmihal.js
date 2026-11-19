// S25 İlmihal
import { ustBaslik, esc } from '../ui.js';
import { ikon } from '../ikon.js';
import { ILMIHAL, ILMIHAL_BOLUMLERI } from '../../data/icerik/ilmihal.js';

export default function ilmihal({ el }) {
  ustBaslik({ baslik: 'İlmihal', alt: 'Temel dinî bilgiler', geri: '#/daha' });
  el.innerHTML = ILMIHAL_BOLUMLERI.map(b => `
    <div class="bolum-baslik"><h2>${esc(b.ad)}</h2></div>
    <div class="liste">${ILMIHAL.filter(x => x.bolum === b.k).map(x => `<a class="satir" href="#/ilmihal/${x.id}"><div class="esnek"><div class="satir-baslik">${esc(x.baslik)}</div><div class="satir-alt">${esc(x.ozet)}</div></div>${ikon('ileri')}</a>`).join('')}</div>`).join('')
    + '<p class="cok-kucuk soluk" style="margin-top:20px">Hükümler Hanefî mezhebine göredir. Ayrıntılı ve kişisel durumunuza özel bilgi için Diyanet İlmihali\'ne ya da bir din görevlisine danışın (Alo 190).</p>';
}

export function oku({ el, p }) {
  const i = ILMIHAL.findIndex(x => x.id === p.id);
  if (i < 0) { location.replace('#/ilmihal'); return; }
  const x = ILMIHAL[i];
  ustBaslik({ baslik: x.baslik, geri: '#/ilmihal' });
  const onceki = ILMIHAL[i - 1], sonraki = ILMIHAL[i + 1];
  // govde uygulama içi, güvenilir HTML'dir (kullanıcı girdisi değil)
  el.innerHTML = `<article class="kart metin-govde">${x.govde}</article>
    <div class="sira-ara" style="margin-top:16px">
      ${onceki ? `<a class="btn ikincil" href="#/ilmihal/${onceki.id}">${ikon('geri', 20)} Önceki</a>` : '<span></span>'}
      ${sonraki ? `<a class="btn ikincil" href="#/ilmihal/${sonraki.id}">Sonraki ${ikon('ileri', 20)}</a>` : '<span></span>'}
    </div>`;
}
