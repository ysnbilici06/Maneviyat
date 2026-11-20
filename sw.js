// Servis çalışanı: uygulama kabuğu önceden önbelleğe alınır, gerisi okundukça (önce önbellek).
// Sürümü her yayında artır.
const SURUM = 'maneviyat-5c8df297b3';
const KURAN_ONBELLEK = 'maneviyat-kuran';   // sûreler: sürüm değişse de silinmez
const KABUK = [
  './', 'index.html', 'style.css', 'manifest.json',
  'fonts/amiri-quran.woff2', 'fonts/cormorant-latin-600.woff2', 'fonts/cormorant-latin-ext-600.woff2', 'fonts/cormorant-latin-700.woff2', 'fonts/cormorant-latin-ext-700.woff2', 'icons/icon.svg', 'icons/icon-192.png', 'icons/icon-512.png',
  'js/app.js', 'js/store.js', 'js/ui.js', 'js/ikon.js', 'js/tarih.js', 'js/vakit.js', 'js/iller.js', 'js/bildirim.js',
  'js/kuran-veri.js', 'js/gunun-icerigi.js', 'js/oynatici.js', 'js/kilit-tesbih.js', 'js/paylas.js', 'js/intro.js', 'js/ekran/begeniler.js', 'data/icerik/intro.js',
  'js/ekran/bugun.js', 'js/ekran/karsilama.js', 'js/ekran/gun.js', 'js/ekran/namaz.js', 'js/ekran/kible.js',
  'js/ekran/kaza.js', 'js/ekran/zikir.js', 'js/ekran/dua.js', 'js/ekran/kissa.js', 'js/ekran/his.js',
  'js/ekran/kuran.js', 'js/ekran/hadis.js', 'js/ekran/ilmihal.js', 'js/ekran/gunluk.js', 'js/ekran/ayarlar.js',
  'js/ekran/daha.js', 'js/ekran/tasarim.js',
  'data/sureler.json', 'data/icerik/dualar.js', 'data/icerik/zikirler.js', 'data/icerik/kissalar.js',
  'data/icerik/hadisler.js', 'data/icerik/ilmihal.js', 'data/icerik/duygular.js', 'data/icerik/ayet-havuzu.js',
  'ses/sessiz.wav',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(SURUM).then(c => c.addAll(KABUK)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== SURUM && k !== KURAN_ONBELLEK).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;   // ses CDN'i vb. ağdan
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(hit => {
      const ag = fetch(e.request).then(r => {
        if (r && r.ok) { const kopya = r.clone(); caches.open(SURUM).then(c => c.put(e.request, kopya)); }
        return r;
      });
      // Yedek olarak ana sayfa yalnızca sayfa açılışlarında; veri dosyalarında gerçek hata dönsün
      return hit || ag.catch(() => e.request.mode === 'navigate' ? caches.match('index.html') : Response.error());
    })
  );
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: 'window' }).then(cs => {
    if (cs.length) return cs[0].focus();
    return self.clients.openWindow('./');
  }));
});
