// Kilit ekranında tesbih (deneysel)
// PWA'lar gerçek kilit ekranı widget'ı ekleyemez. Bunun yerine sistemin kilit ekranı medya kontrollerini kullanıyoruz:
// sessize yakın bir ses döngüde çalar, başlıkta zikir ve sayı görünür, ⏭ = +1, ⏮ = −1 (yanlış basışı geri al).
// iOS 15+ Safari / ana ekrana eklenmiş PWA ve Android Chrome'da çalışır.
// Native sürümde (ikinci aşama) bunun yerine gerçek kilit ekranı widget'ı yapılacak.
import { duraklat as kuranDuraklat } from './oynatici.js';

let ses = null;
let aktif = false;
let geriCagir = null;   // (fark) => void
let bilgi = { ad: '', sayi: 0, hedef: 0 };

export const destekleniyor = () => 'mediaSession' in navigator && typeof MediaMetadata !== 'undefined';
export const acikMi = () => aktif;

function metaGuncelle() {
  if (!destekleniyor()) return;
  const { ad, sayi, hedef } = bilgi;
  const bitti = hedef && sayi >= hedef;
  try {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: `${bitti ? '✓ ' : ''}${ad} · ${sayi}${hedef ? ' / ' + hedef : ''}`,
      artist: bitti ? 'Hedef tamamlandı — ⏭ ile devam' : '⏭ +1   ·   ⏮ geri al',
      album: 'Maneviyat · Tesbih',
      artwork: [{ src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' }],
    });
    navigator.mediaSession.playbackState = 'playing';
  } catch {}
}

export async function baslat({ ad, sayi, hedef, artir }) {
  if (!destekleniyor()) throw new Error('Bu tarayıcı kilit ekranı kontrollerini desteklemiyor.');
  kuranDuraklat();
  geriCagir = artir;
  bilgi = { ad, sayi, hedef };
  if (!ses) {
    ses = new Audio('ses/sessiz.wav');
    ses.loop = true;
    ses.volume = 0.01;
    ses.setAttribute('playsinline', '');
  }
  await ses.play();
  aktif = true;
  const ms = navigator.mediaSession;
  const art = f => () => { if (geriCagir) geriCagir(f); if (ses.paused) ses.play().catch(() => {}); };
  try { ms.setActionHandler('nexttrack', art(1)); } catch {}
  try { ms.setActionHandler('previoustrack', art(-1)); } catch {}
  // Duraklat tuşu da sayılsın: bazı kilit ekranlarında yalnızca oynat/duraklat görünür
  try { ms.setActionHandler('pause', art(1)); } catch {}
  try { ms.setActionHandler('play', art(1)); } catch {}
  try { ms.setActionHandler('seekforward', null); ms.setActionHandler('seekbackward', null); } catch {}
  metaGuncelle();
}

export function guncelle(yeni) {
  bilgi = { ...bilgi, ...yeni };
  if (aktif) metaGuncelle();
}

export function bitir() {
  aktif = false;
  geriCagir = null;
  if (ses) { ses.pause(); }
  if (destekleniyor()) {
    try {
      ['nexttrack', 'previoustrack', 'play', 'pause'].forEach(a => navigator.mediaSession.setActionHandler(a, null));
      navigator.mediaSession.metadata = null;
      navigator.mediaSession.playbackState = 'none';
    } catch {}
  }
}

/** Zikirmatik ekranı yeniden açıldığında sayımı yeni ekrana bağla */
export function bagla(artir) { if (aktif) geriCagir = artir; }
