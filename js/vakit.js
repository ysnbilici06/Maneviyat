// Namaz vakti hesabı — cihazda, internetsiz.
// Yöntem: Diyanet İşleri parametreleri — imsak 18°, yatsı 17°, ikindi asr-ı evvel (gölge 1 boy).
// Temkinler (dk): güneş −7, öğle +5, ikindi +4, akşam +7. Kullanıcı ayarlarından vakit başına ek ±dk.

import { get } from './store.js';

export const VAKITLER = [
  { k: 'imsak', ad: 'İmsak' },
  { k: 'gunes', ad: 'Güneş' },
  { k: 'ogle', ad: 'Öğle' },
  { k: 'ikindi', ad: 'İkindi' },
  { k: 'aksam', ad: 'Akşam' },
  { k: 'yatsi', ad: 'Yatsı' },
];

/** Kılınan 5 vakit (işaretleme için) ve hangi vakit aralığına denk geldikleri */
export const NAMAZLAR = [
  { k: 'sabah', ad: 'Sabah', bas: 'imsak', son: 'gunes' },
  { k: 'ogle', ad: 'Öğle', bas: 'ogle', son: 'ikindi' },
  { k: 'ikindi', ad: 'İkindi', bas: 'ikindi', son: 'aksam' },
  { k: 'aksam', ad: 'Akşam', bas: 'aksam', son: 'yatsi' },
  { k: 'yatsi', ad: 'Yatsı', bas: 'yatsi', son: 'imsak+' },
];

const TEMKIN = { imsak: 0, gunes: -7, ogle: 5, ikindi: 4, aksam: 7, yatsi: 0 };
const ACI = { imsak: 18, yatsi: 17 };

const rad = d => d * Math.PI / 180, der = r => r * 180 / Math.PI;
const sin = d => Math.sin(rad(d)), cos = d => Math.cos(rad(d)), tan = d => Math.tan(rad(d));
const asin = x => der(Math.asin(x)), acos = x => der(Math.acos(x)), atan2 = (y, x) => der(Math.atan2(y, x));
const acot = x => der(Math.atan(1 / x));
const duzAci = a => a - 360 * Math.floor(a / 360);
const duzSaat = s => s - 24 * Math.floor(s / 24);

function julyen(y, a, g) {
  if (a <= 2) { y -= 1; a += 12; }
  const A = Math.floor(y / 100), B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (a + 1)) + g + B - 1524.5;
}

function gunesKonumu(jd) {
  const D = jd - 2451545.0;
  const g = duzAci(357.529 + 0.98560028 * D);
  const q = duzAci(280.459 + 0.98564736 * D);
  const L = duzAci(q + 1.915 * sin(g) + 0.020 * sin(2 * g));
  const e = 23.439 - 0.00000036 * D;
  const RA = duzSaat(atan2(cos(e) * sin(L), cos(L)) / 15);
  return { dek: asin(sin(e) * sin(L)), denk: q / 15 - RA };
}

/**
 * Bir gün için ham vakitler (yerel saat, ondalık saat cinsinden).
 * tz: o günkü UTC farkı (saat)
 */
function hamVakitler(y, a, g, lat, lng, tz) {
  const jd0 = julyen(y, a, g) - lng / (15 * 24);
  const ogleSaati = t => duzSaat(12 - gunesKonumu(jd0 + t).denk);
  const aciZamani = (aci, t, once) => {
    const { dek } = gunesKonumu(jd0 + t);
    const T = acos((-sin(aci) - sin(dek) * sin(lat)) / (cos(dek) * cos(lat))) / 15;
    return ogleSaati(t) + (once ? -T : T);
  };
  const asrZamani = (carpan, t) => {
    const { dek } = gunesKonumu(jd0 + t);
    return aciZamani(-acot(carpan + tan(Math.abs(lat - dek))), t, false);
  };

  let v = { imsak: 5, gunes: 6, ogle: 12, ikindi: 13, aksam: 18, yatsi: 18 };
  for (let i = 0; i < 2; i++) {
    const t = Object.fromEntries(Object.entries(v).map(([k, s]) => [k, s / 24]));
    v = {
      imsak: aciZamani(ACI.imsak, t.imsak, true),
      gunes: aciZamani(0.833, t.gunes, true),
      ogle: ogleSaati(t.ogle),
      ikindi: asrZamani(1, t.ikindi),
      aksam: aciZamani(0.833, t.aksam, false),
      yatsi: aciZamani(ACI.yatsi, t.yatsi, false),
    };
  }
  // Yüksek enlem: açı hesaplanamazsa gecenin yedide biri kuralı
  const gece = 24 - (v.aksam - v.gunes);
  if (!Number.isFinite(v.imsak) || v.gunes - v.imsak > gece / 7 * 2) v.imsak = v.gunes - gece / 7;
  if (!Number.isFinite(v.yatsi) || v.yatsi - v.aksam > gece / 7 * 2) v.yatsi = v.aksam + gece / 7;

  const fark = tz - lng / 15;
  for (const k in v) v[k] = v[k] + fark;
  return v;
}

/** Verilen gün için Date nesneleri: {imsak, gunes, ogle, ikindi, aksam, yatsi} */
export function vakitleriHesapla(gun = new Date(), konum = get('ayarlar.konum'), duzeltme = get('ayarlar.duzeltme') || {}) {
  if (!konum) return null;
  const y = gun.getFullYear(), a = gun.getMonth() + 1, g = gun.getDate();
  const ogleYerel = new Date(y, a - 1, g, 12);
  const tz = -ogleYerel.getTimezoneOffset() / 60;
  const ham = hamVakitler(y, a, g, konum.lat, konum.lng, tz);
  const sonuc = {};
  for (const { k } of VAKITLER) {
    const dk = ham[k] * 60 + TEMKIN[k] + (Number(duzeltme[k]) || 0);
    // Saniyeleri yukarı yuvarla (dakika hassasiyeti)
    const tam = Math.round(dk);
    sonuc[k] = new Date(y, a - 1, g, 0, tam);
  }
  return sonuc;
}

/** Şu anki ve sıradaki vakit. {simdiki:{k,ad,zaman}, siradaki:{k,ad,zaman}, bugun} */
export function vakitDurumu(simdi = new Date()) {
  const bugun = vakitleriHesapla(simdi);
  if (!bugun) return null;
  let simdiki = null, siradaki = null;
  for (const v of VAKITLER) {
    if (bugun[v.k] <= simdi) simdiki = { ...v, zaman: bugun[v.k] };
    else if (!siradaki) siradaki = { ...v, zaman: bugun[v.k] };
  }
  if (!siradaki) {
    const yarin = new Date(simdi); yarin.setDate(yarin.getDate() + 1);
    siradaki = { ...VAKITLER[0], zaman: vakitleriHesapla(yarin).imsak, yarin: true };
  }
  if (!simdiki) {
    const dun = new Date(simdi); dun.setDate(dun.getDate() - 1);
    simdiki = { ...VAKITLER[5], zaman: vakitleriHesapla(dun).yatsi };
  }
  return { simdiki, siradaki, bugun };
}

/** Bir namaz vakti girdi mi? (geçmiş gün için hep true) */
export function namazGirdiMi(namazK, gunAnahtari, bugunAnahtari, bugunVakitler, simdi = new Date()) {
  if (gunAnahtari < bugunAnahtari) return true;
  if (gunAnahtari > bugunAnahtari) return false;
  const n = NAMAZLAR.find(x => x.k === namazK);
  return bugunVakitler ? bugunVakitler[n.bas] <= simdi : true;
}

// Kıble: Kâbe 21.4225 K, 39.8262 D
export function kibleAcisi(lat, lng) {
  const kLat = 21.4225, kLng = 39.8262;
  const y = sin(kLng - lng);
  const x = cos(lat) * tan(kLat) - sin(lat) * cos(kLng - lng);
  return duzAci(atan2(y, x));
}

export function kabeyeUzaklik(lat, lng) {
  const R = 6371, kLat = 21.4225, kLng = 39.8262;
  const dLat = rad(kLat - lat), dLng = rad(kLng - lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(lat)) * Math.cos(rad(kLat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
