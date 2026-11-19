// Kullanıcı verisi: tek anahtar altında JSON (localStorage). Sunucu yok.
// Okuma: get('ayarlar.konum'); yazma: set('ayarlar.konum', {...}) veya guncelle(s => {...}).

const ANAHTAR = 'maneviyat.v1';
const ESKI_ANAHTAR = 'huzur.v1';   // çalışma adı döneminden kalan veri
const kopya = o => JSON.parse(JSON.stringify(o));   // eski iOS'ta structuredClone yok

export const VARSAYILAN = {
  surum: 1,
  kurulum: false,
  ayarlar: {
    ad: '',
    konum: null,                       // {lat, lng, ad}
    duzeltme: { imsak: 0, gunes: 0, ogle: 0, ikindi: 0, aksam: 0, yatsi: 0 },
    bildirim: { acik: false, dkOnce: 0, vakitler: { imsak: true, gunes: false, ogle: true, ikindi: true, aksam: true, yatsi: true } },
    tema: 'koyu',            // varsayılan koyu (gece yeşili + altın)
    okuma: { ar: true, ok: true, tr: true, yazi: 1 },
    titresim: true,
    intro: true,             // her açılışta 5 sn ayet/hadis/dua
  },
  namaz: {},          // 'YYYY-AA-GG': {sabah:1, ...}
  kaza: { borc: { sabah: 0, ogle: 0, ikindi: 0, aksam: 0, yatsi: 0, vitir: 0 }, kilinan: { sabah: 0, ogle: 0, ikindi: 0, aksam: 0, yatsi: 0, vitir: 0 }, hedefGunluk: 1, baslangic: null },
  kazaLog: {},        // 'YYYY-AA-GG': adet
  zikirGrup: [],      // [{id, ad, ogeler:[{zikirId, hedef}]}]
  zikirSayim: {},     // 'YYYY-AA-GG': {zikirId: sayi}
  aktifSayac: null,   // {zikirId, sayi, hedef, grupId, adim}
  dualarim: [],       // [{id, metin, tarih, paylas, amin}]
  amin: {},           // duaId: 1
  gorev: {},          // 'YYYY-AA-GG': {ayet:1, dua:1, kissa:1}
  okuma: null,        // {sure, ayet, zaman}
  yerImleri: [],      // [{sure, ayet, zaman}]
  gunluk: [],         // [{id, tarih, his, metin}]
  okunanKissa: {},
  begeniler: [],      // [{id, tur, baslik, ar, tr, kaynak, href, zaman}]
};

function derinBirlestir(hedef, kaynak) {
  for (const k of Object.keys(kaynak)) {
    const v = kaynak[k];
    if (v && typeof v === 'object' && !Array.isArray(v) && hedef[k] && typeof hedef[k] === 'object' && !Array.isArray(hedef[k])) {
      derinBirlestir(hedef[k], v);
    } else {
      hedef[k] = v;
    }
  }
  return hedef;
}

function yukle() {
  let kayitli = null;
  try { kayitli = JSON.parse(localStorage.getItem(ANAHTAR) || localStorage.getItem(ESKI_ANAHTAR) || 'null'); } catch { kayitli = null; }
  const temel = kopya(VARSAYILAN);
  return kayitli ? derinBirlestir(temel, kayitli) : temel;
}

let durum = yukle();
const dinleyiciler = new Set();
let zamanlayici = null;

function kaydet() {
  clearTimeout(zamanlayici);
  zamanlayici = setTimeout(() => {
    try { localStorage.setItem(ANAHTAR, JSON.stringify(durum)); } catch (e) { console.warn('kaydedilemedi', e); }
  }, 150);
}
// Sayfa kapanırken bekleyen yazmayı kaçırma
addEventListener('pagehide', () => { try { localStorage.setItem(ANAHTAR, JSON.stringify(durum)); } catch {} });

export function get(yol) {
  if (!yol) return durum;
  return yol.split('.').reduce((o, k) => (o == null ? undefined : o[k]), durum);
}

export function set(yol, deger) {
  const parcalar = yol.split('.');
  let o = durum;
  for (let i = 0; i < parcalar.length - 1; i++) {
    if (o[parcalar[i]] == null || typeof o[parcalar[i]] !== 'object') o[parcalar[i]] = {};
    o = o[parcalar[i]];
  }
  o[parcalar[parcalar.length - 1]] = deger;
  degisti();
}

export function guncelle(fn) { fn(durum); degisti(); }

function degisti() { kaydet(); dinleyiciler.forEach(f => { try { f(durum); } catch (e) { console.error(e); } }); }

export function dinle(fn) { dinleyiciler.add(fn); return () => dinleyiciler.delete(fn); }

export function yedekMetni() { return JSON.stringify({ uygulama: 'maneviyat', tarih: new Date().toISOString(), veri: durum }, null, 1); }

export function yedektenYukle(metin) {
  const j = JSON.parse(metin);
  const veri = j && j.veri ? j.veri : j;
  if (!veri || typeof veri !== 'object' || !('ayarlar' in veri)) throw new Error('Bu dosya bir yedek gibi görünmüyor.');
  durum = derinBirlestir(kopya(VARSAYILAN), veri);
  degisti();
}

export function sifirla() { durum = kopya(VARSAYILAN); degisti(); }

export const yeniId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
