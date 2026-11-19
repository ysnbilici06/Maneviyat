// "Bugün nasıl hissediyorsun?" — duyguya göre ayetler.
// Meal metni Kur'an verisinden gelir; "not" alanları bu uygulama için yazılmış kısa düşüncelerdir.
export const DUYGULAR = [
  { k: 'huzun', ad: 'Hüzünlü', simge: '🌧️', giris: 'Hüzün geçicidir; Rabbin seni unutmadı.', ayetler: [
    { ref: '94:5-6', not: 'Zorluk tek başına gelmez; yanında mutlaka bir kolaylık vardır.' },
    { ref: '93:3', not: 'Sessiz geçen günler terk edildiğin anlamına gelmez.' },
    { ref: '12:86', not: 'Hz. Yakub derdini insanlara değil, Allah\'a açtı.' },
    { ref: '9:40', not: '"Üzülme, Allah bizimle" — mağaradaki teselli bugün de geçerli.' },
    { ref: '3:139', not: 'Gevşeme ve üzülme; iman sahibi için umut her zaman açıktır.' },
  ] },
  { k: 'umut', ad: 'Umut arıyorum', simge: '🌱', giris: 'Rahmet kapısı hiçbir zaman kapanmaz.', ayetler: [
    { ref: '39:53', not: 'Ne kadar uzaklaşmış olursan ol, dönüş yolu açık.' },
    { ref: '12:87', not: 'Ümitsizlik bir müminin vasfı değildir.' },
    { ref: '65:2-3', not: 'Takva sahibine ummadığı yerden kapı açılır.' },
    { ref: '2:186', not: 'Allah yakındır; dua edenin duasına karşılık verir.' },
    { ref: '93:4-5', not: 'Sonrası öncesinden daha hayırlı olacak.' },
  ] },
  { k: 'korku', ad: 'Endişeli', simge: '🌫️', giris: 'Kalbin kaygıyla dolduğunda dayanağını hatırla.', ayetler: [
    { ref: '3:173', not: '"Allah bize yeter" — korkuya karşı müminin sözü.' },
    { ref: '9:51', not: 'Başımıza gelen her şey O\'nun bilgisi dahilindedir.' },
    { ref: '20:46', not: 'Mûsâ ve Hârûn\'a söylenen söz: Ben sizinle beraberim, işitir ve görürüm.' },
    { ref: '3:160', not: 'Allah yardım ederse hiçbir güç karşı koyamaz.' },
    { ref: '2:155-157', not: 'Sınanmak hayatın parçası; sabredenlere müjde var.' },
  ] },
  { k: 'sukunet', ad: 'Huzur istiyorum', simge: '🕊️', giris: 'Kalpler ancak O\'nu anmakla sükûn bulur.', ayetler: [
    { ref: '13:28', not: 'Huzurun kaynağı dışarıda değil, zikirde.' },
    { ref: '48:4', not: 'Kalplere sükûneti indiren O\'dur.' },
    { ref: '89:27-30', not: 'Mutmain nefse yapılan davet.' },
    { ref: '2:152', not: 'Sen O\'nu andıkça O da seni anar.' },
    { ref: '50:16', not: 'Allah sana şah damarından daha yakındır.' },
  ] },
  { k: 'sukur', ad: 'Şükür doluyum', simge: '☀️', giris: 'Şükür, nimeti çoğaltır.', ayetler: [
    { ref: '14:7', not: 'Şükrettikçe artırılan bir bereket vaadi.' },
    { ref: '16:18', not: 'Nimetler saymakla bitmez.' },
    { ref: '27:19', not: 'Hz. Süleyman\'ın şükür duası.' },
    { ref: '31:12', not: 'Şükreden kendi iyiliği için şükreder.' },
    { ref: '93:11', not: 'Rabbinin nimetini an ve anlat.' },
  ] },
  { k: 'yalnizlik', ad: 'Yalnız hissediyorum', simge: '🌙', giris: 'Hiçbir an yalnız değilsin.', ayetler: [
    { ref: '57:4', not: 'Nerede olursan ol, O seninle.' },
    { ref: '50:16', not: 'İçinden geçeni bile bilen bir Rab.' },
    { ref: '2:186', not: 'Seslendiğinde cevap veren yakın bir Rab.' },
    { ref: '20:46', not: 'İşiten ve gören bir yardımcı.' },
  ] },
  { k: 'tovbe', ad: 'Pişmanım', simge: '💧', giris: 'Samimi bir tövbe her şeyi yeniden başlatır.', ayetler: [
    { ref: '39:53', not: 'Allah bütün günahları bağışlayabilir.' },
    { ref: '4:110', not: 'Bağışlanma dileyen, Allah\'ı bağışlayıcı bulur.' },
    { ref: '25:70', not: 'Tövbe edenin kötülükleri iyiliğe çevrilir.' },
    { ref: '7:23', not: 'İlk insanın, ilk pişmanlık duası.' },
    { ref: '66:8', not: 'Tevbe-i nasûh: dönüşü olmayan samimi tövbe.' },
  ] },
  { k: 'ofke', ad: 'Öfkeliyim', simge: '🔥', giris: 'Asıl güç, öfkeye hâkim olabilmektir.', ayetler: [
    { ref: '3:134', not: 'Öfkesini yutan ve affedenler övülür.' },
    { ref: '41:34', not: 'Kötülüğü en güzel olanla savmak düşmanı dosta çevirebilir.' },
    { ref: '42:37', not: 'Müminler öfkelendiklerinde bağışlarlar.' },
    { ref: '7:199', not: 'Affetmeyi seç, iyiliği emret, cahillerle uğraşma.' },
  ] },
  { k: 'kararsiz', ad: 'Kararsızım', simge: '🧭', giris: 'Elinden geleni yap, sonra O\'na dayan.', ayetler: [
    { ref: '3:159', not: 'Danış, karar ver ve tevekkül et.' },
    { ref: '2:216', not: 'Hoşlanmadığın şeyde hayır olabilir.' },
    { ref: '11:88', not: 'Başarı ancak Allah\'ın yardımıyladır.' },
    { ref: '65:3', not: 'Allah\'a dayanana O yeter.' },
  ] },
  { k: 'sevinc', ad: 'Sevinçliyim', simge: '🌸', giris: 'Sevincini şükürle taçlandır.', ayetler: [
    { ref: '10:58', not: 'Asıl sevinilecek şey Allah\'ın lütfu ve rahmetidir.' },
    { ref: '93:11', not: 'Nimeti anmak da bir şükürdür.' },
    { ref: '14:7', not: 'Şükür, sevinci kalıcı kılar.' },
  ] },
  { k: 'hasta', ad: 'Hastayım', simge: '🌿', giris: 'Şifa da O\'ndandır, sabır da.', ayetler: [
    { ref: '26:80', not: 'Hz. İbrâhim: "Hastalandığımda bana şifa veren O\'dur."' },
    { ref: '21:83', not: 'Hz. Eyyûb\'un sabırla ettiği dua.' },
    { ref: '17:82', not: 'Kur\'an, müminler için şifa ve rahmettir.' },
    { ref: '2:155-156', not: 'Her şey O\'na aittir ve O\'na dönecektir.' },
  ] },
  { k: 'sabir', ad: 'Sabır istiyorum', simge: '⛰️', giris: 'Sabır ve namazla yardım dile.', ayetler: [
    { ref: '2:153', not: 'Allah sabredenlerle beraberdir.' },
    { ref: '39:10', not: 'Sabredenlere ecir hesapsız verilir.' },
    { ref: '3:200', not: 'Sabredin, direnin, kenetlenin.' },
    { ref: '16:127', not: 'Sabrın kendisi de Allah\'ın yardımıyladır.' },
  ] },
];
