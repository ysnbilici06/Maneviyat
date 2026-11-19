// "Daha" menüsü: diğer bölümler
import { ustBaslik } from '../ui.js';
import { ikon } from '../ikon.js';

const OGELER = [
  ['Beğendiklerim', 'Kalp ile kaydettiklerin, paylaşmaya hazır', 'kalp', '#/begeniler'],
  ['Dualar', 'Kendi dualarını yaz, dua kütüphanesi', 'el', '#/dua'],
  ['Nasıl hissediyorsun?', 'Duygularına göre ayetler', 'gunes', '#/his'],
  ['Kıssalar', 'Peygamberlerden ve siyerden hikâyeler', 'yaprak', '#/kissa'],
  ['Hadisler', 'Konularına göre hadis-i şerifler', 'kitap', '#/hadis'],
  ['İlmihal', 'Abdest, namaz, oruç, zekât, hac', 'liste', '#/ilmihal'],
  ['Manevi günlük', 'Şükürlerin ve düşüncelerin', 'defter', '#/gunluk'],
  ['Kaza namazları', 'Borç takibi ve bitirme yolculuğu', 'terazi', '#/kaza'],
  ['Kıble', 'Pusula ile kıble yönü', 'pusula', '#/kible'],
  ['Ayarlar', 'Konum, hatırlatmalar, tema, yedek', 'ayar', '#/ayarlar'],
];

export default function daha({ el }) {
  ustBaslik({ baslik: 'Daha fazla' });
  el.innerHTML = `<div class="liste">${OGELER.map(([ad, alt, ik, href]) =>
    `<a class="satir" href="${href}"><span class="satir-ikon">${ikon(ik)}</span><div class="esnek"><div class="satir-baslik">${ad}</div><div class="satir-alt">${alt}</div></div>${ikon('ileri')}</a>`).join('')}</div>`;
}
