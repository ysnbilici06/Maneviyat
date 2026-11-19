// Temel zikirler. Arapça metinler klasik (telifsiz); Türkçe anlamlar bu uygulama için yazıldı.
export const ZIKIRLER = [
  { id: 'subhanallah', ad: 'Sübhânallah', ar: 'سُبْحَانَ اللّٰهِ', anlam: "Allah her türlü eksiklikten uzaktır.", hedef: 33 },
  { id: 'elhamdulillah', ad: 'Elhamdülillah', ar: 'اَلْحَمْدُ لِلّٰهِ', anlam: "Hamd Allah'a mahsustur.", hedef: 33 },
  { id: 'allahuekber', ad: 'Allâhu ekber', ar: 'اَللّٰهُ أَكْبَرُ', anlam: 'Allah en büyüktür.', hedef: 33 },
  { id: 'tevhid', ad: 'Lâ ilâhe illallah', ar: 'لَا إِلٰهَ إِلَّا اللّٰهُ', anlam: "Allah'tan başka ilah yoktur.", hedef: 100 },
  { id: 'estagfirullah', ad: 'Estağfirullah', ar: 'أَسْتَغْفِرُ اللّٰهَ', anlam: "Allah'tan bağışlanma dilerim.", hedef: 100 },
  { id: 'salavat', ad: 'Salavât', ok: 'Allâhümme salli alâ seyyidinâ Muhammed', ar: 'اَللّٰهُمَّ صَلِّ عَلٰى سَيِّدِنَا مُحَمَّدٍ', anlam: "Allah'ım, efendimiz Muhammed'e salât eyle.", hedef: 100 },
  { id: 'havkale', ad: 'Lâ havle ve lâ kuvvete illâ billâh', ar: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللّٰهِ', anlam: "Güç ve kuvvet ancak Allah'tandır.", hedef: 100 },
  { id: 'subhanallahi-ve-bihamdihi', ad: 'Sübhânallâhi ve bihamdihî', ar: 'سُبْحَانَ اللّٰهِ وَبِحَمْدِهِ', anlam: "Allah'ı hamd ile tesbih ederim.", hedef: 100, not: 'Günde yüz kez söylemenin fazileti Buhârî ve Müslim\'de rivayet edilir.' },
  { id: 'subhanallahil-azim', ad: "Sübhânallâhi'l-azîm", ar: 'سُبْحَانَ اللّٰهِ الْعَظِيمِ', anlam: 'Yüce Allah her türlü eksiklikten uzaktır.', hedef: 100 },
  { id: 'hasbunallah', ad: "Hasbünallâhu ve ni'me'l-vekîl", ar: 'حَسْبُنَا اللّٰهُ وَنِعْمَ الْوَكِيلُ', anlam: 'Allah bize yeter, O ne güzel vekildir. (Âl-i İmrân 3/173)', hedef: 100 },
  { id: 'yunus', ad: 'Lâ ilâhe illâ ente sübhâneke', ok: "Lâ ilâhe illâ ente sübhâneke innî küntü mine'z-zâlimîn", ar: 'لَا إِلٰهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ', anlam: 'Senden başka ilah yoktur, seni tenzih ederim; ben gerçekten kendine yazık edenlerden oldum. (Enbiyâ 21/87)', hedef: 100 },
  { id: 'ya-hayyu', ad: 'Yâ Hayyu yâ Kayyûm', ar: 'يَا حَيُّ يَا قَيُّومُ', anlam: 'Ey diri olan, ey her şeyi ayakta tutan!', hedef: 100 },
  { id: 'estagfirullah-tam', ad: "Estağfirullâhe'l-azîm", ok: "Estağfirullâhe'l-azîm ellezî lâ ilâhe illâ hüve'l-hayye'l-kayyûme ve etûbü ileyh", ar: 'أَسْتَغْفِرُ اللّٰهَ الْعَظِيمَ الَّذِي لَا إِلٰهَ إِلَّا هُوَ الْحَيَّ الْقَيُّومَ وَأَتُوبُ إِلَيْهِ', anlam: "Kendisinden başka ilah olmayan, diri ve her şeyi ayakta tutan yüce Allah'tan bağışlanma diler, O'na tövbe ederim. (Ebû Dâvûd, Tirmizî)", hedef: 3 },
  { id: 'selam', ad: "Allâhümme ente's-selâm", ok: "Allâhümme ente's-selâmü ve minke's-selâm, tebârakte yâ ze'l-celâli ve'l-ikrâm", ar: 'اَللّٰهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ', anlam: "Allah'ım, sen selâmsın, esenlik sendendir. Ey celâl ve ikram sahibi, sen ne yücesin! (Müslim)", hedef: 1 },
  { id: 'tevhid-tam', ad: 'Lâ ilâhe illallâhu vahdehû', ok: "Lâ ilâhe illallâhu vahdehû lâ şerîke leh, lehü'l-mülkü ve lehü'l-hamdü ve hüve alâ külli şey'in kadîr", ar: 'لَا إِلٰهَ إِلَّا اللّٰهُ وَحْدَهُ لَا شَرِيكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلٰى كُلِّ شَيْءٍ قَدِيرٌ', anlam: "Allah'tan başka ilah yoktur, O tektir, ortağı yoktur. Mülk O'nundur, hamd O'nadır ve O her şeye gücü yetendir.", hedef: 1 },
];

// Hazır gruplar: sırayla ilerleyen zikir dizileri. ayetRef verilen adımda Arapça ve meal Kur'an verisinden gelir.
export const HAZIR_GRUPLAR = [
  {
    id: 'tesbihat', ad: 'Namaz sonrası tesbihat', aciklama: 'Farzdan sonra okunan kısa tesbihat sırası.',
    ogeler: [
      { zikirId: 'estagfirullah', hedef: 3 },
      { zikirId: 'selam', hedef: 1 },
      { ad: 'Âyetü\'l-Kürsî', ayetRef: '2:255', hedef: 1 },
      { zikirId: 'subhanallah', hedef: 33 },
      { zikirId: 'elhamdulillah', hedef: 33 },
      { zikirId: 'allahuekber', hedef: 33 },
      { zikirId: 'tevhid-tam', hedef: 1 },
    ],
  },
  {
    id: 'gunluk-yuz', ad: 'Günlük yüzlük', aciklama: 'İstiğfar, salavat ve kelime-i tevhid; her biri yüzer kez.',
    ogeler: [{ zikirId: 'estagfirullah', hedef: 100 }, { zikirId: 'salavat', hedef: 100 }, { zikirId: 'tevhid', hedef: 100 }],
  },
  {
    id: 'sabah-aksam-kisa', ad: 'Sabah-akşam kısa zikir', aciklama: 'Sabah ve akşam okunabilecek kısa bir dizi.',
    ogeler: [{ zikirId: 'subhanallahi-ve-bihamdihi', hedef: 100 }, { zikirId: 'havkale', hedef: 33 }, { zikirId: 'hasbunallah', hedef: 7 }],
  },
];
