// Hadis seçkisi: yaygın bilinen hadisler, bu uygulama için yapılmış Türkçe ifadeyle. Kaynaklar eser düzeyinde.
export const HADIS_KONULARI = [
  { k: 'niyet', ad: 'Niyet ve ihlâs' },
  { k: 'ahlak', ad: 'Güzel ahlâk' },
  { k: 'kardeslik', ad: 'Kardeşlik ve merhamet' },
  { k: 'aile', ad: 'Aile ve komşu' },
  { k: 'ilim', ad: 'İlim ve Kur\'an' },
  { k: 'ibadet', ad: 'İbadet' },
  { k: 'sabir', ad: 'Sabır ve şükür' },
  { k: 'zikir', ad: 'Dua ve zikir' },
  { k: 'comertlik', ad: 'Cömertlik ve sadaka' },
  { k: 'hayat', ad: 'Hayat ve zaman' },
];

export const HADISLER = [
  { konu: 'niyet', m: 'Ameller ancak niyetlere göredir. Herkes için yalnızca niyet ettiği şey vardır.', k: 'Buhârî, Müslim' },
  { konu: 'niyet', m: 'Allah sizin dış görünüşünüze ve mallarınıza bakmaz; kalplerinize ve amellerinize bakar.', k: 'Müslim' },
  { konu: 'niyet', m: 'Din samimiyettir (nasihattir).', k: 'Müslim' },

  { konu: 'ahlak', m: 'Müslüman, elinden ve dilinden diğer Müslümanların güvende olduğu kimsedir.', k: 'Buhârî, Müslim' },
  { konu: 'ahlak', m: 'Allah\'a ve ahiret gününe inanan kimse ya hayır söylesin ya da sussun.', k: 'Buhârî, Müslim' },
  { konu: 'ahlak', m: 'Güçlü kimse, güreşte rakibini yenen değil; öfkelendiğinde kendine hâkim olandır.', k: 'Buhârî, Müslim' },
  { konu: 'ahlak', m: 'Kıyamet günü müminin mizanında güzel ahlâktan daha ağır bir şey olmayacaktır.', k: 'Ebû Dâvûd, Tirmizî' },
  { konu: 'ahlak', m: 'Hayâ imandandır.', k: 'Buhârî, Müslim' },
  { konu: 'ahlak', m: 'Nerede olursan ol Allah\'tan sakın. Kötülüğün ardından bir iyilik yap ki onu silsin. İnsanlara güzel ahlâkla davran.', k: 'Tirmizî' },
  { konu: 'ahlak', m: 'Kolaylaştırın, zorlaştırmayın; müjdeleyin, nefret ettirmeyin.', k: 'Buhârî, Müslim' },
  { konu: 'ahlak', m: 'Allah güzeldir, güzeli sever.', k: 'Müslim' },
  { konu: 'ahlak', m: 'Mümin, aynı delikten iki defa sokulmaz.', k: 'Buhârî, Müslim' },

  { konu: 'kardeslik', m: 'Sizden biriniz, kendisi için istediğini kardeşi için de istemedikçe gerçek anlamda iman etmiş olmaz.', k: 'Buhârî, Müslim' },
  { konu: 'kardeslik', m: 'Müminler birbirlerini sevmede, birbirlerine merhamet ve şefkat göstermede bir beden gibidir. Bir organ rahatsızlandığında bütün beden uykusuzluk ve ateşle ona ortak olur.', k: 'Buhârî, Müslim' },
  { konu: 'kardeslik', m: 'Merhamet etmeyene merhamet olunmaz.', k: 'Buhârî, Müslim' },
  { konu: 'kardeslik', m: 'Birbirinizi kıskanmayın, birbirinize sırt çevirmeyin. Ey Allah\'ın kulları, kardeş olun.', k: 'Buhârî, Müslim' },
  { konu: 'kardeslik', m: 'Hiçbir iyiliği küçük görme; kardeşini güler yüzle karşılamak bile olsa.', k: 'Müslim' },
  { konu: 'kardeslik', m: 'Kardeşinin yüzüne gülümsemen sadakadır.', k: 'Tirmizî' },
  { konu: 'kardeslik', m: 'Kişi sevdiğiyle beraberdir.', k: 'Buhârî, Müslim' },

  { konu: 'aile', m: 'Bir adam "İnsanlar içinde iyi davranmama en çok kim layık?" diye sordu. "Annen" buyurdu. "Sonra kim?" "Annen." "Sonra kim?" "Annen." "Sonra kim?" "Baban."', k: 'Buhârî, Müslim' },
  { konu: 'aile', m: 'Cebrâil bana komşu hakkında o kadar çok tavsiyede bulundu ki, komşuyu komşuya mirasçı kılacak sandım.', k: 'Buhârî, Müslim' },
  { konu: 'aile', m: 'Allah\'a ve ahiret gününe inanan kimse misafirine ikram etsin.', k: 'Buhârî, Müslim' },
  { konu: 'aile', m: 'Sizin en hayırlınız, ailesine karşı en hayırlı olanınızdır.', k: 'Tirmizî' },

  { konu: 'ilim', m: 'Sizin en hayırlınız Kur\'an\'ı öğrenen ve öğretendir.', k: 'Buhârî' },
  { konu: 'ilim', m: 'Kim ilim öğrenmek için bir yola girerse, Allah ona cennete giden yolu kolaylaştırır.', k: 'Müslim' },
  { konu: 'ilim', m: 'İnsan ölünce ameli kesilir; ancak üç şey müstesna: sürekli fayda veren bir sadaka, faydalanılan bir ilim ve kendisine dua eden hayırlı bir evlat.', k: 'Müslim' },
  { konu: 'ilim', m: 'Kim bir hayra vesile olursa, onu yapanın sevabı kadar sevap alır.', k: 'Müslim' },

  { konu: 'ibadet', m: 'Birinizin kapısının önünden bir nehir aksa ve her gün beş kez yıkansa, üzerinde kir kalır mı? İşte beş vakit namaz da böyledir; Allah onlarla günahları siler.', k: 'Buhârî, Müslim' },
  { konu: 'ibadet', m: 'Allah katında amellerin en sevimlisi, az da olsa devamlı olanıdır.', k: 'Buhârî, Müslim' },
  { konu: 'ibadet', m: 'Temizlik imanın yarısıdır.', k: 'Müslim' },
  { konu: 'ibadet', m: 'Oruç bir kalkandır.', k: 'Buhârî, Müslim' },
  { konu: 'ibadet', m: 'Kim inanarak ve karşılığını Allah\'tan bekleyerek Ramazan orucunu tutarsa, geçmiş günahları bağışlanır.', k: 'Buhârî, Müslim' },

  { konu: 'sabir', m: 'Müminin durumu ne hoştur! Her hâli kendisi için hayırlıdır. Sevindirici bir şey olursa şükreder, bu onun için hayır olur. Bir sıkıntıya uğrarsa sabreder, bu da onun için hayır olur.', k: 'Müslim' },
  { konu: 'sabir', m: 'Zenginlik mal çokluğu değildir; asıl zenginlik gönül zenginliğidir.', k: 'Buhârî, Müslim' },
  { konu: 'sabir', m: 'Müslümanın başına gelen hiçbir yorgunluk, hastalık, keder ve sıkıntı yoktur ki, ayağına batan bir diken bile olsa, Allah onunla günahlarından bir kısmını bağışlamasın.', k: 'Buhârî, Müslim' },

  { konu: 'zikir', m: 'Dua ibadetin ta kendisidir.', k: 'Ebû Dâvûd, Tirmizî' },
  { konu: 'zikir', m: 'İki kelime vardır ki dile hafif, mizanda ağır, Rahmân\'a sevimlidir: Sübhânallâhi ve bihamdihî, sübhânallâhi\'l-azîm.', k: 'Buhârî, Müslim' },
  { konu: 'zikir', m: 'Rabbini anan ile anmayanın durumu, diri ile ölünün durumu gibidir.', k: 'Buhârî' },

  { konu: 'comertlik', m: 'Sadaka malı eksiltmez.', k: 'Müslim' },
  { konu: 'comertlik', m: 'Güzel söz sadakadır.', k: 'Buhârî, Müslim' },
  { konu: 'comertlik', m: 'Yarım hurma ile de olsa ateşten korunun; onu da bulamayan güzel bir sözle korunsun.', k: 'Buhârî, Müslim' },

  { konu: 'hayat', m: 'İki nimet vardır ki insanların çoğu onların kıymetini bilmez: sağlık ve boş vakit.', k: 'Buhârî' },
  { konu: 'hayat', m: 'Dünyada bir garip ya da bir yolcu gibi ol.', k: 'Buhârî' },
  { konu: 'hayat', m: 'Beş şey gelmeden önce beş şeyin kıymetini bil: ihtiyarlıktan önce gençliğin, hastalıktan önce sağlığın, yoksulluktan önce zenginliğin, meşguliyetten önce boş vaktin ve ölümden önce hayatın.', k: 'Hâkim, Müstedrek' },
];
