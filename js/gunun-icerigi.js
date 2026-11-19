// Günün ayeti / duası / kıssası: sunucusuz, tarihe göre belirlenir (aynı gün hep aynı içerik).
import { gunNo } from './tarih.js';
import { AYET_HAVUZU } from '../data/icerik/ayet-havuzu.js';
import { DUALAR, GUNUN_DUASI_HAVUZU } from '../data/icerik/dualar.js';
import { KISSALAR } from '../data/icerik/kissalar.js';
import { ayetGetir, refEtiket } from './kuran-veri.js';

// Farklı adımlar: üç içerik aynı periyotla dönmesin
export const gununAyetRef = (d = new Date()) => AYET_HAVUZU[(gunNo(d) * 7) % AYET_HAVUZU.length];
export const gununDuasi = (d = new Date()) => DUALAR.find(x => x.id === GUNUN_DUASI_HAVUZU[(gunNo(d) * 3 + 1) % GUNUN_DUASI_HAVUZU.length]);
export const gununKissasi = (d = new Date()) => KISSALAR[(gunNo(d) * 5 + 2) % KISSALAR.length];

/** Bir duanın gösterilecek metni: ref varsa Kur'an verisinden birleştirilir */
export async function duaMetni(dua) {
  if (!dua.ref) return { ar: dua.ar || '', ok: dua.ok || '', tr: dua.tr || '', etiket: dua.kaynak || '' };
  const ayetler = await ayetGetir(dua.ref);
  const etiket = await refEtiket(dua.ref);
  return {
    ar: ayetler.map(a => a.ar).join(' ۝ '),
    ok: ayetler.map(a => a.ok).join(' '),
    tr: ayetler.map(a => a.tr).join(' '),
    etiket: [etiket, dua.kaynak].filter(Boolean).join(' · '),
    ayetler,
  };
}
