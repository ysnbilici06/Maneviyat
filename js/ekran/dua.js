// S14-S16 Dualarım (şimdilik yerel; topluluk ikinci aşamada), S24 Dua kütüphanesi
import { get, guncelle, yeniId } from '../store.js';
import { ustBaslik, esc, tost, onayla, ayetBlok, bos, titret } from '../ui.js';
import { paylasPenceresi, eylemDugmeleri, eylemleriBagla } from '../paylas.js';
import { ikon } from '../ikon.js';
import { DUALAR, DUA_KATEGORILERI } from '../../data/icerik/dualar.js';
import { duaMetni } from '../gunun-icerigi.js';

export default function dualarim({ el }) {
  ustBaslik({ baslik: 'Dualar', alt: 'Kendi dualarını yaz, sakla, paylaş' });
  const ds = get('dualarim').slice().sort((a, b) => b.tarih.localeCompare(a.tarih));

  el.innerHTML = `
    <a class="btn buyuk tam" href="#/dua/yaz">${ikon('kalem', 20)} Dua yaz</a>
    <div class="bolum-baslik"><h2>Kütüphane</h2><a href="#/dua/kutuphane">Tümü</a></div>
    <div class="izgara-2 izgara-3">${DUA_KATEGORILERI.map(k => `<a class="kart kisayol" href="#/dua/kutuphane/${k.k}"><span class="satir-ikon">${ikon(k.ikon)}</span><b>${esc(k.ad)}</b></a>`).join('')}</div>
    <div class="bolum-baslik"><h2>Dualarım</h2><span class="kucuk soluk">${ds.length}</span></div>
    ${ds.length ? `<div class="yigin">${ds.map(d => `
      <article class="kart dua-kart">
        <p class="metin">${esc(d.metin)}</p>
        <div class="sira-ara" style="margin-top:12px">
          <span class="cok-kucuk soluk">${new Date(d.tarih).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          <span class="sira" style="gap:4px">
            <button class="amin-btn" aria-pressed="${!!get('amin')[d.id]}" data-amin="${d.id}">${ikon('el', 18)} Âmin${d.amin ? ' · ' + d.amin : ''}</button>
            <button class="ikon-btn" data-paylas="${d.id}" aria-label="Paylaş">${ikon('paylas', 20)}</button>
            <button class="ikon-btn" data-sil="${d.id}" aria-label="Sil">${ikon('cop', 20)}</button>
          </span>
        </div>
      </article>`).join('')}</div>`
      : bos('el', 'Henüz bir dua yazmadın. Kalbinden geçenleri buraya yazıp saklayabilirsin; sadece bu cihazda kalır.')}
    <p class="cok-kucuk soluk" style="margin-top:20px">Dualarını toplulukla paylaşıp başkalarının dualarına "Âmin" deme özelliği ikinci aşamada gelecek. Şimdilik dualar yalnızca bu cihazda tutulur.</p>`;

  el.addEventListener('click', async e => {
    const a = e.target.closest('[data-amin]'), p = e.target.closest('[data-paylas]'), s = e.target.closest('[data-sil]');
    if (a) {
      const id = a.dataset.amin;
      guncelle(st => { const d = st.dualarim.find(x => x.id === id); if (!d) return; if (st.amin[id]) { delete st.amin[id]; d.amin = Math.max(0, (d.amin || 0) - 1); } else { st.amin[id] = 1; d.amin = (d.amin || 0) + 1; } });
      titret(15); dualarim({ el: yenile(el) });
    } else if (p) {
      const d = get('dualarim').find(x => x.id === p.dataset.paylas); if (d) paylasPenceresi({ tur: 'dua', etiket: 'Bir dua', baslik: 'Kalbimden bir dua', tr: d.metin, id: 'duam:' + d.id, href: '#/dua' });
    } else if (s) {
      if (await onayla('Bu dua silinsin mi?', { evet: 'Sil', tehlike: true })) {
        guncelle(st => { st.dualarim = st.dualarim.filter(x => x.id !== s.dataset.sil); delete st.amin[s.dataset.sil]; });
        dualarim({ el: yenile(el) });
      }
    }
  });
}

/** Aynı ekranı dinleyicileri çoğaltmadan yeniden çizmek için kapsayıcıyı değiştir */
function yenile(el) { const yeni = el.cloneNode(false); el.replaceWith(yeni); return yeni; }

export function yaz({ el }) {
  ustBaslik({ baslik: 'Dua yaz', geri: '#/dua' });
  el.innerHTML = `<form class="yigin" id="f">
    <div class="alan"><label for="m">Duan</label><textarea class="girdi" id="m" maxlength="1000" placeholder="Rabbim…" required></textarea>
    <p class="cok-kucuk soluk" id="sayac">0 / 1000</p></div>
    <button class="btn buyuk tam">${ikon('tik', 20)} Kaydet</button></form>`;
  const m = el.querySelector('#m');
  setTimeout(() => m.focus(), 50);
  m.addEventListener('input', () => { el.querySelector('#sayac').textContent = `${m.value.length} / 1000`; });
  el.querySelector('#f').addEventListener('submit', e => {
    e.preventDefault();
    const metin = m.value.trim();
    if (metin.length < 3) { tost('Biraz daha yaz'); return; }
    guncelle(s => { s.dualarim.push({ id: yeniId(), metin, tarih: new Date().toISOString(), paylas: false, amin: 0 }); });
    tost('Duan kaydedildi'); location.hash = '#/dua';
  });
}

export function kutuphane({ el }) {
  ustBaslik({ baslik: 'Dua kütüphanesi', geri: '#/dua' });
  el.innerHTML = `<div class="arama" style="margin-bottom:12px">${ikon('ara', 20)}<input class="girdi" type="search" id="ara" placeholder="Dua ara" aria-label="Dua ara"></div>
    <div id="sonuc"></div>`;
  const ciz = (q = '') => {
    const s = q.toLocaleLowerCase('tr');
    el.querySelector('#sonuc').innerHTML = DUA_KATEGORILERI.map(k => {
      const ds = DUALAR.filter(d => d.kat === k.k && (!s || (d.ad + ' ' + (d.tr || '') + ' ' + (d.ok || '')).toLocaleLowerCase('tr').includes(s)));
      if (!ds.length) return '';
      return `<div class="bolum-baslik"><h2>${esc(k.ad)}</h2></div><div class="liste">${ds.map(d => `<a class="satir" href="#/dua/oku/${d.id}"><div class="esnek"><div class="satir-baslik">${esc(d.ad)}</div>${d.tekrar ? `<div class="satir-alt">${d.tekrar} kez</div>` : ''}</div>${ikon('ileri')}</a>`).join('')}</div>`;
    }).join('') || bos('ara', 'Aradığın dua bulunamadı.');
  };
  ciz();
  el.querySelector('#ara').addEventListener('input', e => ciz(e.target.value));
}

export function kategori({ el, p }) {
  const k = DUA_KATEGORILERI.find(x => x.k === p.kat);
  if (!k) { location.replace('#/dua/kutuphane'); return; }
  ustBaslik({ baslik: k.ad, alt: esc(k.aciklama), geri: '#/dua' });
  el.innerHTML = `<div class="liste">${DUALAR.filter(d => d.kat === k.k).map(d => `<a class="satir" href="#/dua/oku/${d.id}"><div class="esnek"><div class="satir-baslik">${esc(d.ad)}</div>${d.tekrar ? `<div class="satir-alt">${d.tekrar} kez</div>` : ''}</div>${ikon('ileri')}</a>`).join('')}</div>`;
}

export async function oku({ el, p }) {
  let d = DUALAR.find(x => x.id === p.id);
  if (!d) { location.replace('#/dua/kutuphane'); return; }
  if (d.bag) d = { ...DUALAR.find(x => x.id === d.bag), ad: d.ad };
  ustBaslik({ baslik: d.ad, geri: `#/dua/kutuphane/${d.kat}` });
  const m = await duaMetni(d);
  const icerik = { tur: 'dua', baslik: d.ad, ar: m.ar, tr: m.tr, kaynak: m.etiket, id: 'dua:' + p.id, href: `#/dua/oku/${p.id}` };
  el.innerHTML = `<div class="kart">${d.tekrar ? `<span class="rozet vurgu">${d.tekrar} kez okunur</span>` : ''}${ayetBlok(m)}${m.etiket ? `<p class="kaynak">${esc(m.etiket)}</p>` : ''}</div>
    <div class="btn-sira" style="align-items:center"><span class="ayet-eylem">${eylemDugmeleri('d', icerik)}</span><button class="btn" data-paylas="d">${ikon('paylas', 20)} Paylaş</button></div>`;
  eylemleriBagla(el, { d: icerik });
}
