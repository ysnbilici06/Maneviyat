// İlmihal: temel bilgiler. Hükümler Türkiye'de yaygın olan Hanefî mezhebine göredir.
// Metinler bu uygulama için yazıldı; ayrıntılı ve bağlayıcı bilgi için Diyanet İlmihali ve yetkili din görevlilerine başvurulmalıdır.
// govde: güvenilir, uygulama içi HTML (kullanıcı girdisi değildir).

export const ILMIHAL_BOLUMLERI = [
  { k: 'inanc', ad: 'İnanç' },
  { k: 'temizlik', ad: 'Temizlik' },
  { k: 'namaz', ad: 'Namaz' },
  { k: 'oruc', ad: 'Oruç' },
  { k: 'zekat', ad: 'Zekât ve sadaka' },
  { k: 'hac', ad: 'Hac ve kurban' },
];

export const ILMIHAL = [
  { id: 'iman-esaslari', bolum: 'inanc', baslik: 'İmanın esasları', ozet: 'Altı temel inanç ilkesi', govde: `
    <p>İman, Hz. Muhammed'in Allah'tan getirdiği kesin olarak bilinen esasları kalp ile tasdik etmektir. Âmentü'de sayılan altı esas şunlardır:</p>
    <ol><li><b>Allah'a</b> iman: Allah birdir, ortağı ve benzeri yoktur.</li><li><b>Meleklere</b> iman</li><li><b>Kitaplara</b> iman: Tevrat, Zebur, İncil ve Kur'an-ı Kerîm ile diğer sahifeler.</li><li><b>Peygamberlere</b> iman: İlki Hz. Âdem, sonuncusu Hz. Muhammed'dir.</li><li><b>Ahiret gününe</b> iman</li><li><b>Kader ve kazaya</b> iman: Hayır ve şerrin Allah'ın bilgisi ve yaratmasıyla olduğuna inanmak.</li></ol>
    <p class="kaynak">Bakara 2/285; Nisâ 4/136; Müslim, Îmân</p>` },
  { id: 'islamin-sartlari', bolum: 'inanc', baslik: 'İslâm\'ın şartları', ozet: 'Beş temel ibadet', govde: `
    <ol><li><b>Kelime-i şehâdet</b> getirmek: Allah'tan başka ilah olmadığına ve Hz. Muhammed'in O'nun kulu ve elçisi olduğuna şahitlik etmek.</li><li>Günde beş vakit <b>namaz</b> kılmak</li><li>Ramazan ayında <b>oruç</b> tutmak</li><li>Malı nisaba ulaşanın <b>zekât</b> vermesi</li><li>Gücü yetenin ömründe bir kez <b>hacca</b> gitmesi</li></ol>
    <p class="kaynak">Buhârî, Îmân; Müslim, Îmân</p>` },

  { id: 'abdest', bolum: 'temizlik', baslik: 'Abdest nasıl alınır?', ozet: 'Farzları ve adım adım alınışı', govde: `
    <h3>Abdestin farzları (4)</h3>
    <ol><li>Yüzü bir kez yıkamak</li><li>Kolları dirseklerle birlikte bir kez yıkamak</li><li>Başın dörtte birini meshetmek</li><li>Ayakları topuklarla birlikte bir kez yıkamak</li></ol>
    <p class="kaynak">Mâide 5/6</p>
    <h3>Adım adım</h3>
    <ol><li>Niyet edilir, "Bismillâhirrahmânirrahîm" denir.</li><li>Eller bileklere kadar üç kez yıkanır.</li><li>Ağza üç kez su alınıp çalkalanır.</li><li>Burna üç kez su çekilip temizlenir.</li><li>Yüz, alın saç bitiminden çene altına, bir kulak yumuşağından ötekine kadar üç kez yıkanır.</li><li>Önce sağ, sonra sol kol dirseklerle birlikte üç kez yıkanır.</li><li>Islak elle başın en az dörtte biri meshedilir.</li><li>Kulaklar ve boyun meshedilir.</li><li>Önce sağ, sonra sol ayak topuklarla birlikte, parmak araları da hilallenerek üç kez yıkanır.</li></ol>
    <p>Farzlar dışındaki adımlar sünnettir; sıraya uymak ve organları ara vermeden yıkamak da sünnettir.</p>` },
  { id: 'abdesti-bozanlar', bolum: 'temizlik', baslik: 'Abdesti bozan durumlar', ozet: 'Abdestin bozulduğu başlıca hâller', govde: `
    <ul><li>Ön ve arka yoldan herhangi bir şeyin çıkması (idrar, dışkı, yel vb.)</li><li>Vücuttan kan, irin gibi akıntıların çıkıp yayılması</li><li>Ağız dolusu kusmak</li><li>Bayılmak, sarhoş olmak, delirmek</li><li>Bir yere dayanarak ya da yaslanarak uyumak</li><li>Rükû ve secdesi olan bir namazda, yanındakilerin duyacağı şekilde gülmek (namazı da bozar)</li></ul>
    <p><b>Şâfiî mezhebinde</b> yetişkin bir kadın ile erkeğin tenlerinin örtüsüz değmesi de abdesti bozar; kan çıkması ise bozmaz.</p>` },
  { id: 'gusul', bolum: 'temizlik', baslik: 'Gusül (boy abdesti)', ozet: 'Farzları ve alınışı', govde: `
    <h3>Guslün farzları (3)</h3>
    <ol><li>Ağza su alıp iyice çalkalamak</li><li>Burna su çekip temizlemek</li><li>Bütün bedeni kuru yer kalmayacak şekilde yıkamak</li></ol>
    <h3>Alınışı</h3>
    <ol><li>Niyet edilir, besmele çekilir.</li><li>Eller ve avret yerleri yıkanır, bedende bir kir varsa temizlenir.</li><li>Namaz abdesti gibi abdest alınır.</li><li>Önce başa, sonra sağ omza, sonra sol omza üçer kez su dökülür ve beden ovulur.</li><li>Göbek çukuru, kulak delikleri gibi suyun ulaşması zor yerlere dikkat edilir.</li></ol>
    <p>Cünüplük, hayız (âdet) ve nifas (lohusalık) hâllerinin sona ermesiyle gusül farz olur.</p>` },
  { id: 'teyemmum', bolum: 'temizlik', baslik: 'Teyemmüm', ozet: 'Su bulunamadığında ya da kullanılamadığında', govde: `
    <p>Su bulunmadığında, bulunsa da hastalık gibi bir sebeple kullanılamadığında, abdest ve gusül yerine teyemmüm yapılır.</p>
    <h3>Farzları</h3>
    <ol><li><b>Niyet</b></li><li><b>İki darp:</b> Eller temiz toprak ya da toprak cinsinden bir şeye vurulup yüz meshedilir; ikinci kez vurulup kollar dirseklerle birlikte meshedilir.</li></ol>
    <p>Su bulunduğunda ya da kullanma engeli kalktığında teyemmüm bozulur.</p>
    <p class="kaynak">Mâide 5/6</p>` },

  { id: 'namazin-farzlari', bolum: 'namaz', baslik: 'Namazın farzları', ozet: 'Dışındaki 6 ve içindeki 6 farz', govde: `
    <h3>Namazın dışındaki farzlar (şartlar)</h3>
    <ol><li><b>Hadesten taharet:</b> Abdestli olmak; gerekiyorsa gusletmek</li><li><b>Necasetten taharet:</b> Beden, elbise ve namaz kılınan yerin temiz olması</li><li><b>Setr-i avret:</b> Örtülmesi gereken yerleri örtmek</li><li><b>İstikbâl-i kıble:</b> Kıbleye yönelmek</li><li><b>Vakit:</b> Namazı vaktinde kılmak</li><li><b>Niyet</b></li></ol>
    <h3>Namazın içindeki farzlar (rükünler)</h3>
    <ol><li><b>İftitah tekbiri:</b> "Allâhu ekber" diyerek namaza başlamak</li><li><b>Kıyam:</b> Ayakta durmak</li><li><b>Kıraat:</b> Kur'an'dan okumak</li><li><b>Rükû:</b> Eğilmek</li><li><b>Sücûd:</b> Secde etmek</li><li><b>Ka'de-i ahîre:</b> Son oturuşta Ettehiyyâtü okuyacak kadar oturmak</li></ol>` },
  { id: 'rekatlar', bolum: 'namaz', baslik: 'Vakitler ve rekât sayıları', ozet: 'Beş vakit namazın rekâtları', govde: `
    <table class="tablo"><thead><tr><th>Vakit</th><th>İlk sünnet</th><th>Farz</th><th>Son sünnet</th><th>Diğer</th></tr></thead><tbody>
    <tr><td>Sabah</td><td>2</td><td>2</td><td>–</td><td>–</td></tr>
    <tr><td>Öğle</td><td>4</td><td>4</td><td>2</td><td>–</td></tr>
    <tr><td>İkindi</td><td>4*</td><td>4</td><td>–</td><td>–</td></tr>
    <tr><td>Akşam</td><td>–</td><td>3</td><td>2</td><td>–</td></tr>
    <tr><td>Yatsı</td><td>4*</td><td>4</td><td>2</td><td>3 vitir (vâcip)</td></tr>
    </tbody></table>
    <p class="kucuk soluk">* Gayr-i müekkede (zaman zaman terk edilebilen) sünnet. Cuma namazı: 4 ilk sünnet, 2 farz, 4 son sünnet.</p>
    <p>Sabah namazının vakti imsakla başlar, güneşin doğuşuyla biter. Öğle, güneşin tepe noktasını geçmesiyle başlar; ikindi, gölgenin bir boy uzamasıyla girer. Akşam, güneşin batmasıyla; yatsı, ufuktaki kızıllığın kaybolmasıyla başlar ve imsaka kadar sürer.</p>` },
  { id: 'namaz-kilinisi', bolum: 'namaz', baslik: 'Namaz nasıl kılınır?', ozet: 'İki rekâtlık bir namaz adım adım', govde: `
    <p>Örnek olarak sabah namazının iki rekât sünneti:</p>
    <ol>
      <li>Kıbleye dönülür, kalpten niyet edilir: "Niyet ettim Allah rızası için bugünkü sabah namazının sünnetini kılmaya."</li>
      <li>Erkekler ellerini kulak hizasına, kadınlar omuz hizasına kaldırarak <b>"Allâhu ekber"</b> der ve namaza başlar.</li>
      <li>Eller bağlanır; <b>Sübhâneke</b>, <b>Eûzü-Besmele</b>, <b>Fâtiha</b> ve ardından kısa bir sûre (örneğin İhlâs) okunur.</li>
      <li>"Allâhu ekber" diyerek <b>rükûya</b> gidilir; üç kez "Sübhâne rabbiye'l-azîm" denir.</li>
      <li>"Semi'allâhü limen hamideh" diyerek doğrulunur, "Rabbenâ leke'l-hamd" denir.</li>
      <li>"Allâhu ekber" diyerek <b>secdeye</b> gidilir; üç kez "Sübhâne rabbiye'l-a'lâ" denir. Kısa bir oturuştan sonra ikinci secde yapılır.</li>
      <li>"Allâhu ekber" diyerek ikinci rekâta kalkılır; besmele, Fâtiha ve bir sûre okunur, rükû ve iki secde yapılır.</li>
      <li>Oturulur; <b>Ettehiyyâtü</b>, <b>Allâhümme salli</b>, <b>Allâhümme bârik</b> ve <b>Rabbenâ</b> duaları okunur.</li>
      <li>Önce sağa, sonra sola "Esselâmü aleyküm ve rahmetullâh" diyerek selâm verilir.</li>
    </ol>
    <p>Dört rekâtlı namazlarda ikinci rekâttan sonra oturulup yalnızca Ettehiyyâtü okunur ve üçüncü rekâta kalkılır. Farzların üçüncü ve dördüncü rekâtlarında Fâtiha'dan sonra sûre okunmaz.</p>` },
  { id: 'sehiv', bolum: 'namaz', baslik: 'Sehiv secdesi', ozet: 'Namazda yanılınca yapılan secde', govde: `
    <p>Namazda bir vâcip yanılarak terk edilir, geciktirilir ya da bir farz geciktirilirse namazın sonunda sehiv secdesi yapılır.</p>
    <h3>Nasıl yapılır?</h3>
    <ol><li>Son oturuşta yalnızca Ettehiyyâtü okunur.</li><li>Sağa selâm verilir.</li><li>İki secde yapılır.</li><li>Oturulup Ettehiyyâtü, Salli, Bârik ve Rabbenâ duaları okunur, iki tarafa selâm verilir.</li></ol>
    <p>Örnekler: Fâtiha'yı unutmak, ilk oturuşu unutup kalkmak, sûreyi Fâtiha'dan önce okumak.</p>` },
  { id: 'cuma', bolum: 'namaz', baslik: 'Cuma namazı', ozet: 'Kimlere farzdır, nasıl kılınır?', govde: `
    <p>Cuma namazı; hür, erkek, akıllı, ergenlik çağına girmiş, mukim (yolcu olmayan) ve sağlıklı Müslümanlara farzdır. Öğle vaktinde, cemaatle ve hutbe ile kılınır.</p>
    <p>Sıralaması: 4 rekât ilk sünnet, hutbe, 2 rekât farz (cemaatle), 4 rekât son sünnet. Ardından isteyen 4 rekât zuhr-i âhir ve 2 rekât vaktin sünneti kılar.</p>
    <p class="kaynak">Cuma 62/9-10</p>` },

  { id: 'oruc', bolum: 'oruc', baslik: 'Oruç', ozet: 'Ramazan orucu ve temel hükümler', govde: `
    <p>Oruç, imsak vaktinden akşam vaktine kadar niyetle birlikte yemekten, içmekten ve cinsel ilişkiden uzak durmaktır. Ramazan orucu; akıllı, ergenlik çağındaki ve gücü yeten her Müslümana farzdır.</p>
    <h3>Niyet</h3>
    <p>Ramazan orucu için niyet, akşamdan başlayıp ertesi gün kuşluk vaktine (öğleye yaklaşık bir saat kalana) kadar yapılabilir. Sahura kalkmak da niyet yerine geçer.</p>
    <h3>Oruç tutmayabilecekler</h3>
    <ul><li>Hasta olanlar ve yolcular (sonra kaza ederler)</li><li>Hamile ve emziren kadınlar, kendileri ya da çocukları için endişe ederlerse (sonra kaza ederler)</li><li>Hayız ve lohusa kadınlar (sonra kaza ederler)</li><li>İyileşme ümidi olmayan hastalar ve oruca gücü yetmeyen yaşlılar (her gün için fidye verirler)</li></ul>
    <p class="kaynak">Bakara 2/183-187</p>` },
  { id: 'orucu-bozanlar', bolum: 'oruc', baslik: 'Orucu bozan ve bozmayan durumlar', ozet: 'Kaza, keffaret ve unutarak yemek', govde: `
    <h3>Kaza ve keffaret gerektirenler</h3>
    <p>Ramazan orucunu, geçerli bir mazeret olmadan bilerek yiyip içerek ya da cinsel ilişkide bulunarak bozmak. Keffaret: ara vermeden 60 gün oruç tutmaktır; buna gücü yetmeyen 60 fakiri doyurur.</p>
    <h3>Yalnızca kaza gerektirenler (örnekler)</h3>
    <ul><li>Abdest alırken boğaza kaçan su</li><li>Kasten ağız dolusu kusmak</li><li>İmsak vakti girdiği hâlde girmedi sanarak yemek</li><li>Burna ya da kulağa ilaç damlatmak</li></ul>
    <h3>Orucu bozmayanlar</h3>
    <ul><li><b>Unutarak</b> yemek ve içmek (hatırlayınca hemen bırakılır, oruca devam edilir)</li><li>Elde olmadan kusmak</li><li>Göze damla damlatmak, sürme çekmek</li><li>Kan aldırmak, iğne yaptırmak (besleyici olmayan)</li><li>Misvak kullanmak, yıkanmak</li></ul>
    <p class="kaynak">Buhârî, Savm; Müslim, Sıyâm</p>` },

  { id: 'zekat', bolum: 'zekat', baslik: 'Zekât', ozet: 'Kimler verir, ne kadar, kime verilir?', govde: `
    <p>Temel ihtiyaçlarından ve borçlarından fazla olarak <b>nisap</b> miktarı mala sahip olan ve üzerinden bir kameri yıl geçen akıllı ve ergen Müslümanın zekât vermesi farzdır.</p>
    <ul><li><b>Nisap:</b> 80,18 gram altın ya da bu değerde para ve ticaret malı</li><li><b>Oran:</b> Para, altın ve ticaret mallarında kırkta bir (%2,5)</li></ul>
    <h3>Zekât verilecek kimseler</h3>
    <p>Fakirler, yoksullar, zekât toplamakla görevliler, kalbi İslâm'a ısındırılacak olanlar, esaretten kurtarılacaklar, borçlular, Allah yolunda olanlar ve yolda kalmışlar.</p>
    <p><b>Verilemeyenler:</b> Anne, baba, dede, nine; çocuklar ve torunlar; eş; nisap miktarı malı olanlar.</p>
    <p class="kaynak">Tevbe 9/60</p>` },
  { id: 'fitre', bolum: 'zekat', baslik: 'Fitre (fıtır sadakası)', ozet: 'Ramazan bayramından önce verilen sadaka', govde: `
    <p>Temel ihtiyaçlarından fazla olarak nisap miktarı mala sahip olan Müslüman, Ramazan bayramının ilk günü sabahı itibarıyla kendisi ve bakmakla yükümlü olduğu küçük çocukları için fitre verir. Vâciptir.</p>
    <p>Fitrenin bayramdan önce, ihtiyaç sahiplerinin bayram hazırlığına yetişecek şekilde verilmesi daha faziletlidir. Miktarı her yıl Diyanet İşleri Başkanlığı tarafından açıklanır.</p>` },

  { id: 'hac', bolum: 'hac', baslik: 'Hac ve umre', ozet: 'Farzları ve vâcipleri', govde: `
    <p>Hac, gücü yeten Müslümana ömründe bir kez farzdır.</p>
    <h3>Haccın farzları</h3>
    <ol><li><b>İhram</b> (şartı)</li><li><b>Arafat vakfesi:</b> Arefe günü öğleden sonra ile bayram sabahı arasında Arafat'ta bulunmak</li><li><b>Ziyaret tavafı</b></li></ol>
    <h3>Başlıca vâcipleri</h3>
    <ul><li>Müzdelife vakfesi</li><li>Safâ ile Merve arasında sa'y</li><li>Şeytan taşlama</li><li>Tıraş olup ihramdan çıkmak</li><li>Veda tavafı (Mekke dışından gelenler için)</li></ul>
    <h3>Umre</h3>
    <p>Yılın her zamanı yapılabilen umre; ihram, tavaf, sa'y ve tıraştan oluşur.</p>
    <p class="kaynak">Âl-i İmrân 3/97; Bakara 2/196-203</p>` },
  { id: 'kurban', bolum: 'hac', baslik: 'Kurban', ozet: 'Kimler keser, ne zaman?', govde: `
    <p>Kurban bayramı günlerinde, temel ihtiyaçlarından fazla nisap miktarı mala sahip olan, akıllı, ergen ve mukim Müslümanın kurban kesmesi vâciptir.</p>
    <ul><li><b>Vakti:</b> Bayramın ilk günü bayram namazından sonra başlar, üçüncü günün güneş batışına kadar sürer.</li><li><b>Hayvanlar:</b> Koyun ve keçi bir kişi adına; sığır, manda ve deve yedi kişiye kadar ortaklaşa kesilebilir.</li><li><b>Yaş:</b> Koyun ve keçi bir yaşını, sığır iki yaşını, deve beş yaşını doldurmuş olmalıdır (altı ayını doldurmuş, gösterişli kuzu da yeterlidir).</li></ul>
    <p>Etinin üçte birinin fakirlere, üçte birinin akraba ve komşulara dağıtılması, kalanın evde tüketilmesi tavsiye edilir.</p>
    <p class="kaynak">Kevser 108/2; Hac 22/36-37</p>` },
];
