// Tarih yardımcıları (yerel saat)

const AYLAR = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
const GUNLER = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
const HICRI_AYLAR = ['Muharrem', 'Safer', 'Rebîülevvel', 'Rebîülâhir', 'Cemâziyelevvel', 'Cemâziyelâhir', 'Receb', 'Şâbân', 'Ramazân', 'Şevvâl', 'Zilkâde', 'Zilhicce'];

const iki = n => String(n).padStart(2, '0');

export const anahtar = (d = new Date()) => `${d.getFullYear()}-${iki(d.getMonth() + 1)}-${iki(d.getDate())}`;

export function anahtardanTarih(k) { const [y, m, g] = k.split('-').map(Number); return new Date(y, m - 1, g); }

/** Yerel takvime göre 1970'ten beri geçen gün sayısı (günlük içerik seçimi için) */
export function gunNo(d = new Date()) { return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000); }

export function gunEkle(d, n) { const x = new Date(d); x.setDate(x.getDate() + n); return x; }

export const uzunTarih = (d = new Date()) => `${d.getDate()} ${AYLAR[d.getMonth()]} ${d.getFullYear()}, ${GUNLER[d.getDay()]}`;
export const kisaTarih = (d = new Date()) => `${d.getDate()} ${AYLAR[d.getMonth()]}`;
export const gunAdi = (d = new Date()) => GUNLER[d.getDay()];
export const ayAdi = i => AYLAR[i];

export const saat = d => `${iki(d.getHours())}:${iki(d.getMinutes())}`;

export function hicri(d = new Date()) {
  try {
    const p = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn', { day: 'numeric', month: 'numeric', year: 'numeric' }).formatToParts(d);
    const al = t => Number(p.find(x => x.type === t)?.value);
    const g = al('day'), a = al('month'), y = al('year');
    if (!g || !a || !y) return '';
    return `${g} ${HICRI_AYLAR[a - 1]} ${y}`;
  } catch { return ''; }
}

/** "1 sa 23 dk" / "12 dk" / "45 sn" */
export function kalanMetin(ms) {
  if (ms < 0) ms = 0;
  const s = Math.floor(ms / 1000), sa = Math.floor(s / 3600), dk = Math.floor((s % 3600) / 60);
  if (sa > 0) return `${sa} sa ${dk} dk`;
  if (dk > 0) return `${dk} dk`;
  return `${s % 60} sn`;
}

/** 01:23:45 */
export function sayac(ms) {
  if (ms < 0) ms = 0;
  const s = Math.floor(ms / 1000);
  return `${iki(Math.floor(s / 3600))}:${iki(Math.floor((s % 3600) / 60))}:${iki(s % 60)}`;
}
