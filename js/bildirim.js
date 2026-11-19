// Vakit hatırlatmaları.
// Sunucusuz PWA sınırı: bildirim yalnızca uygulama açıkken / arka planda canlıyken zamanlanabilir.
// Uygulama tamamen kapalıyken tam vaktinde bildirim için ikinci aşamada sunucu (web push) ya da native sürüm gerekir.
import { get } from './store.js';
import { vakitleriHesapla, VAKITLER } from './vakit.js';
import { saat } from './tarih.js';

let zamanlayicilar = [];

export const bildirimDestegi = () => 'Notification' in window;

export async function izinIste() {
  if (!bildirimDestegi()) return 'yok';
  if (Notification.permission === 'granted') return 'granted';
  try { return await Notification.requestPermission(); } catch { return 'denied'; }
}

export async function goster(baslik, govde, etiket = 'vakit') {
  if (!bildirimDestegi() || Notification.permission !== 'granted') return;
  const secenek = { body: govde, tag: etiket, icon: 'icons/icon-192.png', badge: 'icons/icon-192.png', renotify: true };
  try {
    const kayit = await navigator.serviceWorker?.getRegistration();
    if (kayit) { await kayit.showNotification(baslik, secenek); return; }
  } catch {}
  try { new Notification(baslik, secenek); } catch {}
}

export function bildirimleriPlanla() {
  zamanlayicilar.forEach(clearTimeout);
  zamanlayicilar = [];
  const b = get('ayarlar.bildirim');
  if (!b || !b.acik || !bildirimDestegi() || Notification.permission !== 'granted') return;
  const simdi = new Date();
  const gunler = [simdi, new Date(simdi.getFullYear(), simdi.getMonth(), simdi.getDate() + 1)];
  for (const gun of gunler) {
    const v = vakitleriHesapla(gun);
    if (!v) return;
    for (const { k, ad } of VAKITLER) {
      if (!b.vakitler[k]) continue;
      const an = new Date(v[k].getTime() - (Number(b.dkOnce) || 0) * 60000);
      const fark = an - simdi;
      if (fark <= 0 || fark > 26 * 3600 * 1000) continue;
      const govde = b.dkOnce > 0 ? `${ad} vaktine ${b.dkOnce} dakika kaldı (${saat(v[k])}).` : `${ad} vakti girdi (${saat(v[k])}).`;
      zamanlayicilar.push(setTimeout(() => goster(k === 'gunes' ? 'Güneş doğuyor' : `${ad} vakti`, govde, 'vakit-' + k), fark));
    }
  }
}
