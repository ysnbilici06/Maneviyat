// Tasarım sistemi önizlemesi (replica-design kontrolü). Menüde yok; #/tasarim ile açılır.
import { ustBaslik, ayetBlok, bos } from '../ui.js';
import { ikon } from '../ikon.js';

export default function tasarim({ el }) {
  ustBaslik({ baslik: 'Tasarım sistemi', geri: '#/ayarlar' });
  const renkler = ['bg', 'surface', 'surface-2', 'border', 'border-input', 'text', 'text-muted', 'accent', 'on-accent', 'accent-soft', 'gold', 'danger', 'success', 'warning'];
  el.innerHTML = `
    <div class="bolum-baslik"><h2>Renk rolleri</h2></div>
    <div class="izgara-2 izgara-3">${renkler.map(r => `<div class="kart sira" style="padding:10px"><span style="width:32px;height:32px;border-radius:8px;background:var(--${r});border:1px solid var(--border)"></span><span class="kucuk">${r}</span></div>`).join('')}</div>
    <div class="bolum-baslik"><h2>Butonlar</h2></div>
    <div class="cip-grup"><button class="btn">Birincil</button><button class="btn ikincil">İkincil</button><button class="btn hayalet">Hayalet</button><button class="btn tehlike">Tehlike</button><button class="btn" disabled>Pasif</button><button class="ikon-btn dolu" aria-label="Örnek">${ikon('arti')}</button></div>
    <div class="bolum-baslik"><h2>Kartlar</h2></div>
    <div class="yigin"><div class="kart"><h3>Düz kart</h3><p class="kucuk soluk">Açıklama metni</p></div><div class="kart kart-yumusak"><h3>Vurgulu kart</h3></div><div class="kart kart-kahraman"><h3>Kahraman kart</h3><p class="soluk kucuk">Sıradaki vakit</p></div></div>
    <div class="bolum-baslik"><h2>Form</h2></div>
    <div class="yigin"><input class="girdi" placeholder="Metin girişi"><label class="sira-ara"><span>Anahtar</span><span class="anahtar"><input type="checkbox" checked><span></span></span></label>
    <div class="cip-grup"><button class="cip" aria-pressed="true">Seçili</button><button class="cip" aria-pressed="false">Seçili değil</button></div>
    <div class="bolumlu"><button aria-pressed="true">Bir</button><button aria-pressed="false">İki</button></div></div>
    <div class="bolum-baslik"><h2>Ayet bloğu</h2></div>
    <div class="kart">${ayetBlok({ ar: 'ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ', ok: 'elḥamdü lillâhi rabbi-l`âlemîn.', tr: "Hamd, Alemlerin Rabbi Allah'a mahsustur." }, { ref: '1:2' })}</div>
    <div class="bolum-baslik"><h2>Boş durum</h2></div>
    <div class="kart">${bos('defter', 'Burada henüz bir şey yok.', '<button class="btn kucuk-btn">Ekle</button>')}</div>
    <div class="bolum-baslik"><h2>Simgeler</h2></div>
    <div class="cip-grup">${['ev', 'saat', 'kitap', 'tesbih', 'menu', 'pusula', 'kalp', 'el', 'kalem', 'cop', 'yildiz', 'gunes', 'ay', 'konum', 'zil', 'takvim', 'liste', 'ara', 'yaprak', 'defter', 'terazi', 'ses', 'goz', 'yerimi', 'paylas'].map(i => `<span class="ikon-btn dolu" title="${i}">${ikon(i)}</span>`).join('')}</div>`;
}
