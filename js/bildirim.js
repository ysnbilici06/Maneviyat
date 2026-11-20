// Vakit hatırlatmaları.
// Sunucusuz PWA sınırı: bildirim yalnızca uygulama açıkken / arka planda canlıyken zamanlanabilir.
// Uygulama tamamen kapalıyken tam vaktinde bildirim için ikinci aşamada sunucu (web push) ya da native sürüm gerekir.
import { get } from './store.js';
import { vakitleriHesapla, VAKITLER } from './vakit.js';
import { saat } from './tarih.js';

let zamanlayicilar = [];

export const bildirimDestegi = () => 'Notification' in window;

export const android = () => /Android/i.test(navigator.userAgent);
export const samsung = () => /SamsungBrowser|SM-[A-Z0-9]/i.test(navigator.userAgent);

export async function izinIste() {
  if (!bildirimDestegi()) return 'yok';
  if (Notification.permission === 'granted') return 'granted';
  try {
    // Eski Samsung Internet sürümleri izni Promise yerine geri çağırmayla döndürür
    return await new Promise(coz => {
      const p = Notification.requestPermission(coz);
      if (p && typeof p.then === 'function') p.then(coz, () => coz('denied'));
    });
  } catch { return 'denied'; }
}

// İzin reddedildiğinde nereden açılacağını anlatan kısa metin
export function izinYardimi() {
  if (samsung()) return 'Telefon Ayarları › Uygulamalar › Samsung Internet (ya da Chrome) › Bildirimler\'i aç; sonra tarayıcıda ⋮ › Ayarlar › Siteler › Bildirimler\'den bu siteye izin ver.';
  if (android()) return 'Telefon Ayarları › Uygulamalar › Chrome › Bildirimler\'i aç; sonra Chrome\'da adres çubuğundaki kilit simgesi › İzinler › Bildirimler\'i aç.';
  return 'Tarayıcı ya da telefon ayarlarından bu siteye bildirim izni ver.';
}

// Etkin service worker kaydını bekle (ilk açılışta henüz hazır olmayabilir)
function swHazir(ms = 4000) {
  if (!('serviceWorker' in navigator)) return Promise.resolve(null);
  return Promise.race([navigator.serviceWorker.ready, new Promise(r => setTimeout(() => r(null), ms))]).catch(() => null);
}

// true: bildirim gösterildi, false: gösterilemedi
export async function goster(baslik, govde, etiket = 'vakit') {
  if (!bildirimDestegi() || Notification.permission !== 'granted') return false;
  const secenek = { body: govde, tag: etiket, icon: 'icons/icon-192.png', badge: 'icons/icon-192.png', renotify: true, vibrate: [200, 100, 200] };
  try {
    const kayit = await swHazir();
    if (kayit && kayit.showNotification) { await kayit.showNotification(baslik, secenek); return true; }
  } catch {}
  // Android'de 'new Notification' yasak (hata verir); yalnızca masaüstü/iOS için yedek
  if (android()) return false;
  try { new Notification(baslik, secenek); return true; } catch { return false; }
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
