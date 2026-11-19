// S26 Manevi günlük
import { get, guncelle, yeniId } from '../store.js';
import { ustBaslik, esc, bos, tost, onayla } from '../ui.js';
import { ikon } from '../ikon.js';
import { DUYGULAR } from '../../data/icerik/duygular.js';

const hisBul = k => DUYGULAR.find(d => d.k === k);

export default function gunluk({ el }) {
  ustBaslik({ baslik: 'Manevi günlük', alt: 'Kalbinden geçenler, sadece sende kalır', geri: '#/daha' });
  const ls = get('gunluk').slice().sort((a, b) => b.tarih.localeCompare(a.tarih));
  el.innerHTML = `<a class="btn buyuk tam" href="#/gunluk/yaz/yeni">${ikon('kalem', 20)} Bugünü yaz</a>
    <div class="yigin" style="margin-top:16px">${ls.length ? ls.map(g => {
      const h = hisBul(g.his);
      return `<a class="kart" href="#/gunluk/yaz/${g.id}">
        <div class="sira-ara"><b>${new Date(g.tarih).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' })}</b>${h ? `<span class="rozet">${h.simge} ${esc(h.ad)}</span>` : ''}</div>
        <p class="kucuk soluk" style="margin-top:6px;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden">${esc(g.metin)}</p></a>`;
    }).join('') : bos('defter', 'Günlüğün boş. Bugün neye şükrettin, neyi dert edindin? Yazmak kalbi hafifletir.')}</div>`;
}

export function yaz({ el, p }) {
  const mevcut = p.id === 'yeni' ? null : get('gunluk').find(g => g.id === p.id);
  if (p.id !== 'yeni' && !mevcut) { location.replace('#/gunluk'); return; }
  let his = mevcut ? mevcut.his : '';
  ustBaslik({ baslik: mevcut ? 'Günlük' : 'Bugünü yaz', geri: '#/gunluk' });
  el.innerHTML = `<form class="yigin" id="f">
    <div class="alan"><span class="etiket">Bugün nasıldın?</span>
      <div class="cip-grup" role="group" aria-label="His">${DUYGULAR.map(d => `<button type="button" class="cip" data-his="${d.k}" aria-pressed="${his === d.k}">${d.simge} ${esc(d.ad)}</button>`).join('')}</div></div>
    <div class="alan"><label for="m">Yazmak istediklerin</label>
      <textarea class="girdi" id="m" maxlength="5000" style="min-height:220px" placeholder="Bugün neye şükrettim? Kime dua ettim? Neyi düzeltmek istiyorum?">${esc(mevcut ? mevcut.metin : '')}</textarea></div>
    <div class="btn-sira" style="justify-content:space-between">
      ${mevcut ? `<button type="button" class="btn tehlike" data-sil>${ikon('cop', 20)} Sil</button>` : '<span></span>'}
      <button class="btn">${ikon('tik', 20)} Kaydet</button></div></form>`;
  el.addEventListener('click', async e => {
    const h = e.target.closest('[data-his]');
    if (h) { his = his === h.dataset.his ? '' : h.dataset.his; el.querySelectorAll('[data-his]').forEach(x => x.setAttribute('aria-pressed', x.dataset.his === his)); }
    if (e.target.closest('[data-sil]') && await onayla('Bu kayıt silinsin mi?', { evet: 'Sil', tehlike: true })) {
      guncelle(s => { s.gunluk = s.gunluk.filter(g => g.id !== mevcut.id); }); location.hash = '#/gunluk';
    }
  });
  el.querySelector('#f').addEventListener('submit', e => {
    e.preventDefault();
    const metin = el.querySelector('#m').value.trim();
    if (!metin) { tost('Bir şeyler yaz'); return; }
    guncelle(s => {
      if (mevcut) { const g = s.gunluk.find(x => x.id === mevcut.id); g.metin = metin; g.his = his; }
      else s.gunluk.push({ id: yeniId(), tarih: new Date().toISOString(), his, metin });
    });
    tost('Kaydedildi'); location.hash = '#/gunluk';
  });
}
