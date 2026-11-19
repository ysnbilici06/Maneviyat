// Kur'an verisi: data/sureler.json (indeks) + data/kuran/NNN.json (sure başına)
let indeks = null;
const sureOnbellek = new Map();

export async function sureler() {
  if (!indeks) indeks = await (await fetch('data/sureler.json')).json();
  return indeks;
}

export async function sure(no) {
  no = Number(no);
  if (!sureOnbellek.has(no)) {
    const p = fetch(`data/kuran/${String(no).padStart(3, '0')}.json`)
      .catch(() => { throw new Error('Bu sûre henüz cihaza indirilmedi. İnternete bağlanınca açılır.'); })
      .then(r => {
        if (!r.ok) throw new Error('Sûre yüklenemedi.');
        return r.json();
      });
    sureOnbellek.set(no, p);
    p.catch(() => sureOnbellek.delete(no));
  }
  return sureOnbellek.get(no);
}

/** "2:255" veya "94:5-6" → [{sure, n, ar, tr, ok, g}] */
export async function ayetGetir(ref) {
  const [s, aralik] = ref.split(':');
  const [bas, son] = aralik.split('-').map(Number);
  const veri = await sure(s);
  return veri.ayetler.filter(a => a.n >= bas && a.n <= (son || bas)).map(a => ({ ...a, sure: Number(s) }));
}

/** "Bakara 2/255" biçiminde kaynak etiketi */
export async function refEtiket(ref) {
  const [s, aralik] = ref.split(':');
  const ls = await sureler();
  const x = ls[Number(s) - 1];
  return `${x ? x.ad : 'Sure'} ${s}/${aralik}`;
}

/** Tüm sureleri önbelleğe almak için (Ayarlar → çevrimdışı indir) */
export const KURAN_ONBELLEK = 'maneviyat-kuran';   // sw.js ile aynı ad
export async function tumunuIndir(ilerleme, bekle = 0) {
  if (!('caches' in window)) { for (let i = 1; i <= 114; i++) { await sure(i); ilerleme && ilerleme(i); } return; }
  const c = await caches.open(KURAN_ONBELLEK);
  for (let i = 1; i <= 114; i++) {
    const url = `data/kuran/${String(i).padStart(3, '0')}.json`;
    if (!(await c.match(url))) {
      await c.add(url);
      if (bekle) await new Promise(r => setTimeout(r, bekle));
    }
    ilerleme && ilerleme(i);
  }
}

export const sesUrl = g => `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${g}.mp3`;
