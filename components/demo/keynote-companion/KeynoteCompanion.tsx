/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { useEffect, useState } from 'react';
import { LiveConnectConfig, Modality } from '@google/genai';
import c from 'classnames';

import BasicFace from '../basic-face/BasicFace';
import ChatInterface from './ChatInterface';
import { useLiveAPIContext } from '../../../contexts/LiveAPIContext';
import { createSystemInstructions } from '@/lib/prompts';
import { useAgent, useHistory, useUI, useUser, InteractionMode } from '@/lib/state';

// --- Start of JokeList component definition ---
const JOKES_TEXT = `
1. Adam Olmanın Yöntemi Nedir?
Günün birinde Hoca'nın da içinde bulunduğu topluluktan birisi;
“Hocam, adam olmanın yöntemi nedir?” deyince; Hoca Efendi, adamın nefes almasına
bile fırsat vermeden;
“Canım, bunu bilmeyecek ne var, elbette kulaktır.” der.
Fakat Hoca, arkadaşlarının "kulaktır" cevabından pek bir şey anlamadıklarını anlayınca
açıklama yapma gereğini duyar:
"Aa!.. Bunu bilemeyecek ne var? Herhangi bir adam konuşurken onu can kulağı ile
dinlemeli; bu arada kendi ağzından çıkanı kendi kulağı duymalıdır."

2. Allah'ın Rahmetinden Kaçılmaz
Günün birinde bardaktan boşanırcasına yağmur yağmaktadır. Elbette yağmur yağdığı vakit ya
koşulur, ya da bir yerlere sığınılır. Nasreddin Hoca da yağmurun yağışını ve sokakların
yalnızlığını pencereden seyrederken bir de bakar ki yağmurdan kaçan bir adam... Hoca biraz
dikkatli baktığında bunun bir komşusu olduğunu anlar ve pencereyi açarak;
“Komşu, komşu, utanmıyor musun, niçin Allah'ın rahmetinden kaçıyorsun?” deyince
adam koşmayı bırakır ve yavaş yavaş evine doğru gider. Bu arada adamın da ıslanmadık yeri
kalmaz.
Ertesi gün hava yine yağmurludur. Bu defa Hoca Efendi alışveriş için sokağa çıkmıştır. O, işini
bitirip de hızlı adımlarla evine doğru giderken bir gün önceki komşusunun evinin önünden
geçer. Bu sefer komşusu;
"Hoca Efendi, Hoca Efendi, sen dün bana ‘Allah'ın rahmetinden kaçılmaz. ' demiştin;
bak şimdi kendin kaçıyorsun.” deyince, Hoca komşusuna doğru döner ve;
“Be adam! Ben Allah'ın rahmetinden kaçmıyorum, Allah'ın rahmetini çiğnememek için
koşuyorum." der.

3. Altın Olsa Ne, Taş Olsa Ne
Bir yolculuk sırasında Nasreddin Hoca'nın yolu bir ile düşer. Hoca orada bazı garipliklerle
karşılaşır. Bunlardan biri de bazı evlerin üzerine bayrak dikilmesidir. Hoca sözü bir punduna
getirerek sorar:
“Yahu, bazı evlerin üzerinde bayrak asılı, bunun sebebi nedir?” deyince hep bir ağızdan;
"Hocam, o bayrak asılı evlerde küp dolusu altın vardır.” derler.
Bayrak dikmenin sebebini öğrenen Nasreddin Hoca, günün birinde çarşıdan kocaman bir küp
alarak kalmakta olduğu eve gelir. Sonra da küpün içerisini çakıl taşlarıyla doldurur. Yine
âdetmiş, evinde altın olanlar, küplere karşı sohbet ederlermiş. Sıra Nasreddin Hoca'ya gelince
bakmışlar ki küpün içerisinde altın yerine çakıl taşları dolu... Misafirlerden birisi;
“Hoca Efendi, bu nasıl iş, senin küpünde altın yerine çakıl taşları dolu.” deyince Hoca;
"Yahu komşular neye üzülüyorsunuz, küpte yattıktan sonra altın olsa ne, taş olsa ne?
Fark eden ne ki?" der.

4. Ayaklarını Dörde Çıkarabilirim
Nasreddin Hoca'dan hoşlanmayan komşularından birisi günün birinde onu yolu üzerinde
durdurur ve bilmiş bilmiş konuşmaya başlar:
"Hoca Efendi, senin için 'Evliya oldu, erdi' diyorlar. Doğrusu inanmadım, eğer
kerametin varsa benim dört ayaklı eşeğimi iki ayaklı yap da inanayım." der.
Adamın sözlerine sinirlenen Nasreddin Hoca;
“Be adam, ben eşeğin ayaklarını dörtten ikiye indirebilir miyim, bilmem. Fakat sen biraz
daha konuşursan senin ayaklarını dörde çıkarabilirim." deyiverir.

5. Aynı Yaştayız
Arkadaşları zaman zaman Nasreddin Hoca'ya takılırlarmış, çünkü onun cevaplarından hisse
çıkarırlarmış. Gene böyle bir günde Hoca'ya;
"Hoca Efendi, sen mi büyüksün, yoksa kardeşin mi?” diye sorarlar.
Hoca arkadaşlarının yine kendisine takıldıklarını anlayınca şöyle bir düşündükten sonra
gülümseyerek şu cevabı verir:
"Geçen yıl anneme bu soruyu sormuştum, o da; ‘Kardeşin senden bir yaş küçük.'
demişti. O zamandan bu yana bir yıl geçtiğine göre şimdi aynı yaştayız.”

6. Bahardan Hoşnut Olmayan Var mı?
Hoca ve arkadaşları bahar mevsiminde bir çınarın altında oturmuş, çaylarını içerlerken
aralarından biri Hoca'yı sözüm ona imtihan etmek ister:
"Yahu Hocam, bu insanlar yaz aylarında sıcaktan, kış aylarında ise soğuktan şikâyet
ederler; sizce bu şikâyetin sebebi nedir?” Hoca bu, hemen cevabını veriverir:
“Komşu, komşu, sen onlara kulak asma, bak içinde yaşadığımız bahardan hiç hoşnut
olmayan var mı? Sen hayatını yaşamaya devam et."

7. Başını Pencerede Unutmasın
Hemşerileri bazen candan, bazen de sahte olarak Hoca'ya saygı gösterirler. Günün birinde sahte
saygı gösterenlerden biri Hoca'yı evine davet eder. Hoca da konumu gereği davete gider. Gider
gitmesine de eve yaklaşınca ev sahibinin başını pencereden içeriye doğru çektiğini görür.
Hiçbir şey olmamış gibi evin kapısına çalan Hoca;
“Komşu, komşu ben geldim.” deyince, kapının arkasından değiştirilmiş bir ses duyulur:
"Ah Hocam, ah! Evin sahibi buradaydı, az önce gitti, bensizin geldiğinizi söylerim,
mutlaka çok üzülecektir."
Hoca bu söz karşısında iyice sinirlenir ve;
“Ev sahibine söyleyin, bir daha bir yere giderken başını pencerede unutmasın.” der.

8. Belki de Barışmışlardır
Nasreddin Hoca evinin bahçesindeki ağacın gölgesinde namaz saatini beklerken telaşlı bir
şekilde kapısının tokmağına vurulduğunu işitir. Hoca, kapıyı açınca komşusunu görür ve;
“Buyur komşu, nedir bu telaşın?” deyince komşusu;
“Sorma Hocam, karımla baldızım saç saça, baş başa dövüşüyorlar." der.
Bunun üzerine Hoca merakla;
“Komşu, ayıramadın mı?” deyince, komşusu sızlanarak cevap verir:
“Ne mümkün Hocam, bırak ayırmayı yanlarına bile yaklaşamadım."
“Pekiyi, bu hanımlar ne diye kavga ediyorlar?” deyince komşusu;
“Bilmiyorum Hocam!" der.
Hoca bir defa daha sorar:
"Sakın, 'sen yaşlısın, ben yaşlıyım' diye kavga etmesinler?” deyince komşusu;
“Yok Hocam, yok başka bir konuda kavga ediyor olmalılar!” der.
Bunun üzerine Hoca rahat bir şekilde konuyu çözüverir:
“Komşum, o zaman telaşlanmaya gerek yok! Konu yaş değilse çabucak barışırlar, belki
de şimdiye barışmışlardır bile." der.

9. Ben de Birisini Tıraş Ediyorlar Sanmıştım
Nasreddin Hoca tıraş olmak için berber koltuğuna oturduğunda ustanın olmadığını anlar, fakat
iş işten de geçmiştir. Çünkü berber çırağı çoktan Hoca'yı tıraş etmeye başlamıştır bile. Berber
çırağının hareketleri, aletleri kullanmadaki beceriksizliği artınca Hoca'nın da keyfi kaçar.
Tam bu sırada komşu dükkândan garip garip sesler gelmez mi? Sanki orda bir öküz böğürüyor.
Hoca, berberi biraz oyalamak için;
“Bu ses nedir?” deyince berber çırağı;
“Önemli bir şey değil, komşumuz nalbanttır; herhâlde öküze nal çakıyor." der.
Bu sözleri işiten Hoca rahatlar;
“Oh, çok şükür, ben de birisini tıraş ediyorlar sanmıştım.” der.

10. Ben Senin Delikanlılığını da Bilirim
Günlerden bir gün Nasreddin Hoca, alışveriş yapmak için şehre gidecektir.
Ahırdan eşeğini çıkarır, evin önüne getirir. Şehirden siparişi olan komşular Hoca'nın başına
toplanırlar.
Hoca, eşeğine binmeye çalışır, fakat her çaba boşunadır. Bir kez daha denemek ister "Ha
gayret" deyip bir daha eşeğin üstüne sıçrar ama bu kez de eşeğin üzerinden öbür tarafına
düşüverir.
Komşuları Hoca'nın gayretlerinin bu şekilde bitmesine bir taraftan üzülürler, bir taraftan da
ellerinde olmadan gülmeye başlarlar.
Bu durum karşısında canı iyice sıkılan Hoca komşularına dönerek;
“Yahu komşular, benim delikanlılığımı görmediniz. Ben, bir sıçrayışta değil eşeğe
binmek damın üzerine bile atlardım." der.
Hoca, böyle der demesine de bir yandan da kendi kendine;
"Hey gidi Hoca, ben senin delikanlılığını da bilirim.” deyiverir.

11. Ben Senin Düğün Evinden Gelişini de Hatırlarım
Nasreddin Hoca akşam üzeri evine gelince hanımının suratının asık olduğunu görür ve sorar:
“Hanım, hayırdır, ne oldu sana?”
Hanım daha da üzgün bir tavırla cevap verir:
"Daha ne olsun Hoca, sana söylemiştim ya!"
“Neyi söylemiştin hanım, adamı meraklandırma!"
"Biliyorsun ya, bizim komşu hastaydı. . ."
"Eee... Ne olmuş bizim komşuya?”
"Sizlere ömür, komşu ölmüş!"
Hoca şöyle bir kafasını kaşıdıktan sonra;
“Hanım, komşumuza Allah rahmet etsin; fakat ben senin düğün evinden gelişini de
hatırlarım!" der.

12. Ben Zaten İnecektim
Günün birinde Hoca Efendi pazara gitmek için eşeğine biner ve yola koyulur. Bir süre gittikten
sonra eşek huysuzlanır ve ardından hoplayıp zıplamaya başlar. Derken Nasreddin Hoca da
eşekten düşüverir. Düşer düşmesine de çevresine toplanan çocuklar toplu hâlde bağırmaya
başlarlar:
“Nasreddin Hoca eşekten düştü, Nasreddin Hoca eşekten düştü."
Hoca, şöyle bir sağına soluna baktıktan sonra büyüklerden kimselerin olmadığını görünce eşe
dosta rezil olmamak için;
“Çocuklar, eşekten düşmedim, ben zaten eşekten inecektim.” deyiverir.

13. Bilen Var Bilmeyen Var, On Altısı Bir Kile
Hoca, günün birinde başını alıp kırlara gezmeye çıkar. Epeyce dolaştıktan sonra nasıl olduysa
önünden geçmekte olan bir tavşanı yakalar. Tavşanı hemen yanında bulunan heybenin gözüne
koyar ve evine dönmeye karar verir. Hoca'nın amacı, tavşanı eşine dostuna gösterip onların
tanıyıp tanımadıklarını öğrenmektir. Komşularına haber göndererek;
“Bu akşam bize gelin, sizlere tuhaf bir yaratık göstereceğim.” der.
Hoca'nın hanımı da çok meraklı biridir. Heybeyi açar, fakat açmasıyla beraber tavşan heybenin
gözünden zıplayarak kaçıverir.
"Eyvah, Hoca buna çok kızacak!” diye düşünüp dururken aklına bir fikir gelir. Aceleyle
karşısındaki rafta duran buğday tasını heybenin gözüne kor ve ağzını sıkıca bağlar.
Akşam olur. Davetliler bir bir Hoca'nın evine gelirler. Herkes merakla bir şeyleri beklemeye
koyulur. Derken Hoca, heybeyi eline alır, ağır aksak açmaya çalışır. Fakat bu sırada buğday
ölçeği"Pat!" diye yere düşüvermesin mi? Herkesin birbirine şaşkın şaşkın baktığı bir anda
Hoca, hemen söze girer ve;
“İşte arkadaşlar;bilen var, bilmeyen var. Bunun on altısı bir kile eder!" deyiverir.

14. Biliyorsun Savurganlığı Sevmem
Nasreddin Hoca ateş yakacaktır. Belli ki hanımı da yemek yapma hazırlığındadır. Hoca,
duvarda asılı olan körüğü alır ve ateşi körüklemeye başlar, işini bitirdikten sonra da körüğün
ağzını iyice bağlayarak yerine asar. Bütün bu olanlara bir anlam veremeyen Hoca'nın hanımı;
"Yahu Hoca Efendi, bu körüğün ağzını niçin bağlıyorsun?” der.
Hoca bu, lafın altında mı kalır;
"Yahu hatun, bunu bilmeyecek ne var? Eğer körüğün ağzını tıkamasam içerisindeki
hava uçup gidecektir. Biliyorsun ben savurganlığı sevmem." der.

15. Bir Gram Bal İçin Birkaç Kilo Odun Yiyemem
Bir dostu Nasreddin Hoca'ya birkaç kilo keçi boynuzunu hediye getirir ve;
“Hocam, çam sakızı çoban armağanı, bizim oralarda olanlardan sana hediye getirdim.”
der.
Hoca Efendi, keçi boynuzlarını ve dişlerini şöyle bir kontrol ettikten sonra;
“Sağ ol komşu, bir gram bal için bir birkaç kilo odun yiyemem.” der.

16. Bir Yanına da Keten Ekeyim
Hoca, her zaman tıraş olduğu berberin dükkânına vardığında ustanın gelmediğini görür, fakat
tıraş da olması gerekmektedir. Ne yapsın kalfanın koltuğuna oturur. Kalfa, Hoca'nın yüzünü
şöyle güzelce sabunladıktan sonra usturayı her kullanışından sonra kopardığı pamuğu Hoca'nın
yüzüne yapıştırır. Bir pamuk, iki pamuk derken Hoca'nın bir yanağı bembeyaz olur. Yüzünün
kesilmesine daha fazla dayanamayan Hoca koltuktan kalktığı gibi cübbesini giyer ve kavuğunu
başına geçirir. Bu durum karşısında şaşıran kalfa;
“Hocam, nereye böyle daha tıraşın bitmedi.” deyince Hoca;
“Aman oğlum, görmüyor musun yüzümün bir tarafına pamuk ektin, izin verirsen öbür
yanına da ben keten ekeyim.” der ve yavaş yavaş berber dükkânından ayrılır.

17. Birinin de Bininin de Tadı Aynı Değil mi?
Hoca günün birinde Akşehir'deki bağına üzüm kesmeye gider. Kestiği üzümleri bir sepete
doldurduktan sonra eşeğine binerek evinin yolunu tutar. Bağ dönüşü karşılaştığı mahallenin
çocukları Hoca'nın eşeğinin başını tutarlar;
“Hocam üzüm, Hocam üzüm...” demeye başlarlar.
Hoca üzümü vermeden geçmenin mümkün olmadığını anlayınca sepetten çıkardığı bir salkım
üzümü çocuklar arasında paylaştırır. Çocuklar dağıtılan üzümü az bulurlar. İçlerinden biri;
“Hocam, bu ne, bu kadar çocuğa bir salkım üzüm yeter mi?” der.
Hoca daha fazla vermek istemez ama çocukları da kırmak istemez;
"İyi de çocuklar, bunların hepsi aynı bağın üzümü. Birinin de bininin de tadı aynı değil
mi?"deyiverir.

18. Bizim Akşehir'de Araba Tekerine Bile Bakmazlar
Nasreddin Hoca bir Ramazan ayının yaklaştığı günlerde doğduğu Sivrihisar'daki yakınlarını
ziyarete gider. Şehrin girişine vardığında bir de ne görsün, herkes toplanmış gökyüzünde
Ramazan ayı doğacak mı, doğmayacak mı, ona bakıyor. Hoca dayanamayıp;
“Hayırdır, neye bakıyorsunuz?” deyince, halk toplu hâlde;
"Ramazan ayına bakıyoruz." der.
Bunun üzerine Nasreddin Hoca;
“Yahu hemşerilerim, bizim Akşehir'de bunun araba tekeri gibi olanına bile bakmazlar,
siz incecik ayı göreceğiz diye vaktinizi boşa harcıyorsunuz!” der ve yoluna devam eder.

19. Bizim Eve de Uğrardı
Nasreddin Hoca'nın hanımı olmak zor mu zor; geleni olur, gideni olur. Hoca'nın hanımı
gündüzleri hep komşuları tarafından ev oturmalarına çağırılır. Gitse olmaz, gitmese olmaz, ne
de olsa Hoca hanımı... Belki de Hoca hanımı olmanın verdiği sorumluluktan dolayı kimsenin
gönlünü kırmaz ve davetlere gider.
Hanımının çok gezdiğini bilen bir komşusu günün birinde Hoca'ya;
“Hocam, yanlış anlamayın ama senin hanım galiba çok geziyor..." der.
Nasreddin Hoca, komşusunun sözü nereye getirmek istediğini bildiği için;
“Adam sen de! Eğer senin dediğin gibi çok gezmiş olsaydı arada sırada bizim eve de
uğrardı!" deyiverir.

20. Bizim Mollalar Horul Horul Uyuyorlar
Nasreddin Hoca mollalarına Kudurî [dinî kitap] okuturken yanına bir kadın gelir ve;
“Hocam, çocuğum hiç uyumuyor, bana bir muska yazıversene.” der.
Hoca da;
“Al bu Kudurî'yi, çocuğun yatağının yüksekçe bir yerine koy.” deyince kadın
dayanamaz;
“Hocam, Kudurî, muska mıdır?” diye sorar. Hoca da;
“Kudurî, muska mıdır, değil midir bilmem, ama ne zaman okumaya başlasam bizim
mollalar horul horul uyuyorlar." der.

21. Borç Para İsteme
Nasreddin Hoca bir gün yolda giderken arkadaşlarından biri yanına yaklaşır ve Hoca'ya;
“Hocam, senden bir isteğim var. . .” diye söze başlar.
Hoca, arkadaşının niyetini hemen anlar; kendi kendine; “Mutlaka yine para isteyecektir.” diye
düşünür ve ona;
"Benim de senden bir arzum var, gel ilk önce sen onu yerine getir, sonra ben seninkini
dinleyeyim." der. Arkadaşı;
“Peki Hocam, nedir benden isteğin?” deyince Hoca;
“Ne olursun, benden borç para isteme de ne istersen iste.” deyiverir.

22. Boşuna Tıkamamışlar Senin Ağzını
Bir yaz günü öğle sıcağında Nasreddin Hoca, komşu köye gitmektedir. İşi acele olmalı ki,
ikindinin serinliğini beklememiştir. Bir yandan güneş tepeden yakar, bir yandan da susuzluk
içini kavurur. Dili damağına yapışmak üzere iken yolu bir çeşmeye uğrar.
Olacak bu ya, adamın birisi de ‘su boşa akmasın' diye çeşmenin oluğuna ağaç parçası
tıkamıştır.
Hoca, oluğu tıkayan ağaç parçasına var gücüyle asılır, asılır, bir iki denemeden sonra tıpayı
çıkarıverir. Çıkarır çıkarmasına da çıkarmasıyla birlikte basınçlı su Hoca'nın üstünü başını
ıslatır. Bütün bu olan bitenlere kızan Nasreddin Hoca, suyun karşısına geçerek;
“Boşuna tıkamamışlar senin ağzını... Demek ki, hak etmişsin!” der.

23. Bu Adam Dediğini Yapar
Nasreddin Hoca bir gün cami çıkışında cemaatten birisiyle tanışır. Birbirlerine hâl hatır sorarlar,
sohbeti ilerletirler. Hoca, adamın hoşuna gider. Adam;
“Hocam, sen çok hoşuma gittin; bugün akşam bizim fakirhaneye buyur da beraber tuz
ile ekmek yiyelim.” der.
Nasreddin Hoca akşama doğru yemek vakti gelince adamın evine varır ve sohbeti
koyulaştırırlar. Derken sofra kurulur, ortaya da güzel bir sini konulur. Sininin üzerinde ise tuz
ve ekmekten başka hiçbir şey yoktur. Hoca, yemeklerin gelmediğini zannederek sohbeti
sürdürünce ev sahibi Hoca'yı sofraya davet eder:
"Hocam, soframıza buyurun.”
Tam sofraya oturdukları sırada kapıya bir dilenci gelip ev sahibinden ekmek istemez mi? Ev
sahibi her ne kadar,”Hadi hadi, Allah versin" deyip uzaklaştırmak isterse de dilenci bir türlü
gitmez. Bu duruma kızan ev sahibi, pencereden kafasını çıkararak dilenciye bağırmaya başlar.
"Defol git, bak, şimdi gelirsem, kafanı kırarım!. ."
Bu sırada tuzu ekmeğe katık etmekte olan Nasreddin Hoca yerinden kalkıp dilencinin yanına
gider ve ona;
“Aman arkadaş, çabuk buradan kaç; vallahi bak bu adam dediğini yapar, kafanı filan
kırar, maazallah" der.

24. Bu da Hoca'nın Atışı
Nasreddin Hoca, sağda solda "Ben şöyle yay çekerim, şöyle ok atarım.” diye konuşur durur.
Bunun gerçek olup olmadığını anlamak isteyen gençler onu yarışmaya davet ederler.
Hoca, ilk okunu atar, ama hedefin çok uzağına düşer. Çevreden gülüşme sesleri artınca Hoca;
“Bu bizim subaşının atışı; o, oku böyle atar." der.
İkinci olarak oku attığında, hedefi yine vuramaz, yine gülüşme sesleri arasında Hoca;
“Bu da bizim Kadı Efendi'nin atışı..." der.
Üçüncü olarak oku atan Hoca hedefi vurunca;
"Bu da Hoca'nın atışı..." deyiverir.

25. Bugünlerde Ay Alıp Satmadım
Nasreddin Hoca bir gün pazarda dolaşırken yanına bir adam yaklaşır ve;
"Hocam, bugün ayın kaçı?" der.
Hoca, adamın niyetini anlamış olmalı ki;
“Arkadaş, bugünlerde hiç ay alıp satmadım, bilmem.” cevabını verir.

26. Bunlardan Daha İyi Bir Şahit Bulunabilir mi?
Nasreddin Hoca'nın Akşehir kadısı olduğu zamanda makamına bir adam girer. Bu adamın
sıkıntısı olduğu hareketlerinden kolaylıkla sezilmektedir. Hoca;
“Anlat, bakalım, nedir derdin?” dediğinde adam;
“Kadı Efendi benim bir tamburam vardı, onu filan adam çaldı, ondan davacıyım.” der.
Kadının emri üzerine davalı huzura çağırılır. Kadı;
"Sen bu adamın tamburasını çaldın mı?” deyince adam;
“Hayır, Kadı Efendi bu tambura benim babamdan kalmıştır, istersen şahitlerimi
getirebilirim." der.
Kadı'nın emri üzerine şahitler davet edilir ve onlardan birincisine;
“Tamburanın sahibi kimdir?” diye sorulduğunda şahit;
"Tambura dava edilen adamındır."
Öbür şahit de;
“Evet aynen öyledir, hatta ben tamburanın beş teli olduğunu bile biliyorum." der.
Şahitlerin anlattıklarını duyan şikâyetçi ifadelere itiraz edince, Kadı Efendi sebebini sorar. Bu
defa şikâyetçi adam;
“Kadı Efendi, şahitlerden birisi düğünlerin köçeği, birisi şarkıcısı, birisi de ." deyince
Kadı adamın sözünü keser ve;
"Be adam! Böyle bir davada bunlardan daha iyi bir şahit bulunabilir mi?” deyiverir.

27. Buralı Birine Soruver
Bir gün Nasreddin Hoca'nın yolu, daha önce hiç geçmediği bir köye düşer. Hoca'yı gören bir
köylü;
"Efendi, Hoca'ya benziyorsun. Sen bilirsin, bugün günlerden ne?"
Keyfi yerinde olmayan Hoca, köylüyü süzdükten sonra;
“Ben köyünüzün yabancısıyım. Ne bileyim sizin gününüzü? Sen buralı birine soruver.”
deyiverir.

28. Buraya Yeni Taşındığımızı Sanıyordum
Hoca ile hanımı bir gece yataklarında mışıl mışıl uyurlarken evlerine hırsız girer. Usta hırsızın,
onlar uyurlarken evde bulduğu değerli eşyaları bir çuvala doldurup kapıdan çıkacağı sırada
Hoca Efendi uyanır. Bir bakar ki hırsız eşyalarını çuvala doldurmuş götürmektedir.
Alelacele kalkan Hoca epeyce bir süre hırsızı takip ettikten sonra ikisi birlikte bir eve girerler.
Bu ev de hırsızın evidir. Karşısında Hoca'yı gören hırsız heyecanlı bir şekilde;
"Hoca Efendi, benim evimde senin ne işin var? Burası benim evim, haydi var git işine!"
der.
Hoca, hırsızın pişkinliğine aldırmadan cevabını yapıştırır:
“Be adam ne kızıyorsun? Senin sırtındakiler bizim evin eşyaları değil mi? Ben de buraya
yeni taşındığımızı sanıyordum!”

29. Buzağı İken Koştuğunu Gördüm
Günün birinde ciritçiler cirit oynamak için Hoca'yı meydana davet ederler. Hoca da at yerine
bir öküze biner ve meydana varır. Hoca'nın bu hâlini gören herkes bir taraftan güler, bir taraftan
da;
“Hocam, hiç öküz koşar mı, niye ata binmedin?” deyince Hoca;
“Dostlar, niçin gülersiniz, ben bunun buzağı iken koştuğunu gördüm, onun için bununla
geldim." der.

30. Bülbül Derler
Birkaç şehirli dağda gezerlerken bir kirpi bulurlar. Bilmedikleri bu hayvanı torbalarına
koydukları gibi Hoca'nın kapısını çalarlar:
“Hocam, biz böyle bir yaratık bulduk, buna ne derler?"
"Efendiler, ben bir araştırayım, bana bu gece izin verin, yarın gelin size cevap vereyim.”
der.
Belirtilen saatte şehirliler gelince Hoca;
"Arkadaşlar, ben bunu araştırdım, buna kocaman bülbül derler.” der.

31. Cennet ile Cehennem Dolana Kadar
Geveze adamın biri Nasreddin Hoca'yla sokakta karşılaşır.
“Hoca Efendi, sen görmüş geçirmiş ve okumuş bir adamsın, bilirsin. İnsanlar ne zamana
kadar ölecekler?” diye sorar.
Hoca adamın niyetini anlamıştır, şöyle bir sakalını sıvazladıktan sonra;
"Be adam, bunu bilemeyecek ne var? Cennet ile cehennem dolana kadar.” deyiverir.

32. Ciğeri Yiyen Kedi Yüz Akçelik Baltayı Yemez mi?
Nasreddin Hoca zaman zaman evine ciğer getirir. Fakat ne tuhaftır ki akşam sofrada ciğer
kebabının yerine başka yemeklerle karşılaşır. Bir gün böyle, iki gün böyle derken Hoca
dayanamaz ve hanımına sorar:
"Yahu hatun, getirdiğim ciğerlere ne oldu?"
Hoca'nın hanımı hiçbir şey olmamışçasına;
“Aman Hocam, sorma her defasında ciğerin kokusunu alan tekir, ben mutfağa girmeden
yiyip bitiriyor." der.
Bu sözleri işiten Hoca birdenbire yerinden kalkar ve köşedeki baltayı kaptığı gibi koşmaya
başlar, bir süre sonra da hanımının yanına gelir:
"Hoca baltayı nettin?"
"Sakladım."
"Niçin?"
"Kedi yemesin diye."
Hoca'nın hanımı dayanamayıp itiraz eder.
"Yahu Hocam, kedi baltayı yer mi?”
Hoca, hanımını şöyle bir süzdükten sonra cevabını verir:
“Yer hanım yer, üç beş akçelik ciğeri yiyen kedi, acaba yüz akçelik baltayı yemez mi?”
der.

33. Cumaya Kadar Ancak Giderim
Nasreddin Hoca günün birinde Akşehir'de pazarı dolaşmaya başlar. Bir taraftan pazarda
gezerken, bir taraftan da tanıdıklarıyla sohbet eder. Bu arada da komşu köylerin birinden birkaç
köylü ile karşılaşır. Köylüler Hoca'ya;
"Hoca Efendi, bir cuma vakti bizim köye kadar gelseniz de sizin arkanızda bir namaz
kılsak!" derler.
Bunun üzerine Hoca;
“Neden olmasın, bu hafta geleyim!" der.
Nasreddin Hoca ertesi gün eşeğine binerek köyün yolunu tutar. Olacak bu ya, yolu üzerinde
eski dostlarından biriyle karşılaşır. Selamlaşıp hoşbeş edildikten sonra tanıdığı, Hoca'ya sorar:
“Hayırdır Hocam, nereye gidersin böyle?"
"Filanca köye cuma namazı kıldırmaya gidiyorum."
“Ama Hocam, bugün günlerden salı. . . Cumaya daha üç gün var.”
Hoca, bir yandan eşeğinin boynunu sıvazlar, bir yandan da eski dostuna cevap verir:
"Vallahi komşu, sen bu eşeğin huyunu suyunu bilmezsin; ben bununla o köye cumaya
kadar ancak giderim."

34. Cübbenin İçinde Ben de Vardım
Nasreddin Hoca şehre inmek için evinden çıkar. Bu sırada bahçe kapısında bir komşusuyla
karşılaşır. Komşusu Hoca'ya;
“Hocam, geceleyin sizin evden gürültüler geliyordu, merak ettim, hayrola?”deyince
Nasreddin Hoca da;
“Bir şey yoktu, hatunla biraz tartışmıştık, demek ki ağız dalaşımızı duymuşsun." der.
"Hoca Efendi, öyle küçük bir tartışma gibi değildi sanki..."
Bu defa Hoca şöyle bir sakalını sıvazladıktan sonra;
“Haa! Hanımın ayağı benim cübbeye takıldı, yırtıldı, demek ki o sesi duymuşsunuz.”
der.
Komşusu ısrarlıdır, sormayı sürdürüp;
"Hocam, cübbeden hiç öyle ses çıkar mı?” deyince, Nasreddin Hoca dayanamaz;
"Yahu komşu, ne uzatıp duruyorsun, cübbenin içinde ben de vardım." der.

35. Çaylak Olmanız Gerekir
Birkaç kafadar, Hoca'ya takılmak maksadıyla;
“Hocam, sen mürekkep yalamışsın, bilirsin. Bizim arkadaşlardan birkaçı kendi
aralarında tartışmışlar ve tartışmayı bitirememişler.” derler. Hoca da merakla;
"Tartıştıkları konu nedir?” deyince, içlerinden birisi;
"Hocam, çaylak kuşu için altı ay erkek, altı ay dişi olur diyorlar, acaba doğru mu? Bu
konuyu tartışıyorlar."
Nasreddin Hoca bu, böyle şeylerin altında kalacak değil ya! Kafadarlara cevabını veriverir:
"Bakın çocuklar! Bunun doğru olup olmadığını anlayabilmek için sizin bir yıl çaylak
olmayı denemeniz gerekir!. ."

36. Çiğnediğini Sanırlar
Günün birinde işgüzar bir adam Hoca'ya;
“Hocam, helada sakız çiğnenir mi?” diye bir soru sorar.
Hoca, soruya hemen cevap veremediği için;
“Oğlum, bekle ben bir kara kaplı kitaba bakayım.” der. Bir süre sonra soru sahibinin
yanına gelen Hoca;
"Efendi, kara kaplı kitaba baktım, bununla ilgili bir bilgiye rastlayamadım, ama sen
çiğnemesen iyi edersin.” der. Adam:
“Hocam, neden çiğnemeyeyim, madem kitapta yeri yok..." deyince Hoca;
"Oğlum nedeni var mı? Sen tuvalette sakızı çiğnerken kapının dışındakiler senin başka
şey çiğnediğini sanırlar.” diye cevap verir.

37. Daha Şimdiden Yolu Yarıladık
Nasreddin Hoca ile hanımı seyahate çıkarlar. Bir süre gittikten sonra Hoca, hanımına sorar:
“Hanım, daha ne kadar yolumuz var?”
Hanımı şöyle bir düşündükten sonra;
"Efendi, bugün ve yarın da gidersek iki günlük yolumuz kaldı." der.
Bunun üzerine hanımına dönen Hoca;
“Desene hanım, daha şimdiden yolu yarıladık.”

38. Damdan Düşenin Hâlinden Damdan Düşen Anlar
Hoca evinin damında çalışırken, olacak bu ya, aşağıya düşüverir. Haberi duyan komşuları;
"Hocam, geçmiş olsun, damdan düşmüşsün, çok üzüldük.” derler ve ardından soru
üstüne soru sorarlar:
"Nasıl oldu?"
"Neden dikkat etmedin?"
"Bir daha dikkatli ol..."
Sorular uzadıkça, Hoca'nın da canı sıkılmaya başlar. Düşünür, taşınır ve bunların hepsini birden
susturmak için komşularına;
“Komşular, sizin içinizde damdan düşeniniz var mı?" deyince, misafirler hep bir
ağızdan;
"Yook..." diye cevap verir. Bu defa Hoca;
"Öyleyse boşuna konuşmayın, benim hâlimden ancak damdan düşen anlar!” der.

39. Denizin Suyu Niçin Tuzludur?
Günün birinde Hoca'nın da içinde bulunduğu toplulukta yarenlik edilirken, hazır bulunanlardan
biri Hoca'yı imtihan edercesine bir soru sorar:
"Hocam, denizlerin suyu niçin tuzludur?"
“Aaa, bunu bilmeyecek ne var, balıklar kokmasın diye."

40. Dokuz Yüz Doksan Dokuzu Veren Allah Birini de Verir
Hoca'ya rüyasında dokuz yüz doksan dokuz akçe verirler, ancak Hoca;
“Bin olmazsa kabul etmem.” diye direnirken uyanmaz mı?
Elinin boş olduğunu gören Hoca tekrar yatar ve avuçlarını açarak;
"Verin, kabulümdür, dokuz yüz doksan dokuzu veren Allah birini de verir!” deyiverir.

41. Dünyanın Merkezi Neresidir?
Günün birinde üç papazın yolu Akşehir'e uğrar. Burada Nasreddin Hoca ile sohbet eden
papazlar, Efendi'nin bilgisini denemek isterler. İlk soruyu birinci papaz sorar:
“Hocam, dünyanın merkezi neresidir?”
Hoca hiç tereddüt etmeden eşeğini göstererek;
“Eşeğimin sağ ön ayağını bastığı yerdir.” diye cevap verir.
İçlerinden biri itiraz eder:
“Bunu nereden biliyorsun?"
“İnanmıyorsanız ölçün.”
Bu defa ikinci papaz sorar:
“Hocam, gökte kaç yıldız vardır?”
Hoca bu soruya da tereddüt etmeden yine eşeğini göstererek cevap verir:
“Gökyüzünde, eşeğimin kuyruğundaki kıl kadar yıldız vardır.”
"Bunu ispatlayabilir misiniz?” denildiğinde Nasreddin Hoca;
“Arzu ederseniz sayabilirsiniz.” der.
Hoca'nın sorulan sorulara verdiği cevaplar, papazları şaşırtınca üçüncü soruyu sormaktan
vazgeçerler.

42. El Elin Eşeğini Türkü Çağıra Çağıra Arar
Bir gün subaşının eşeği kaybolur. Hoca, birkaç komşusu ile birlikte eşeği aramaya çıkar. Hoca
hem eşeği aramakta hem de türkü söylemektedir. Bu durumu yadırgayan komşularından biri
Hoca'ya;
“Hocam, bu nasıl iş, insan kaybolan eşeği böyle türkü söyleyerek mi arar?” diye sorar.
Hoca bu lafın altında kalır mı?
"El elin eşeğini türkü çağıra çağıra arar." der.

43. Elbette Şükredeceğim
Günün birinde Hoca'nın bir çocuğu olur. Bu sırada Hoca da bir yolculuktan dönmektedir.
Komşularından birisi Hoca'yı karşılar;
"Hoca Efendi, oğlun oldu; müjdemi ver.” der.
Haberi alan Hoca;
“Çok şükür ya Rabbi.” diye karşılık verir.
Bunun üzerine komşusu;
“Hocam, şükredeceğine müjdemi versen.” deyince o, da;
“Yahu komşu, doğduysa benim çocuğum doğdu, sana ne, elbette şükredeceğim.” der.

44. Elbiselerin Hangi Tarafta ise Oraya Dön
Lüzumsuz adamın birisi Hoca'yı sıkıştırmak için bir soru sorar:
“Hocam, gölde abdest alırken hangi yöne dönmeliyim?”
Bu soru üzerine Hoca gülümser ve;
“Elbiselerin hangi tarafta ise oraya dön!” deyiverir.

45. Elin Ağzı Torba Değilsin ki Büzesin
Günün birinde Nasreddin Hoca ile oğlunun komşu köylerden birine işleri düşer. Birlikte yola
çıkarlar. Yolculuk sırasında Hoca, küçük olduğu için önce oğlunu eşeğe bindirir. Biraz sonra
karşılarına çıkan bir adam, eşek ve üstündeki çocuğu iyice bir süzdükten sonra;
"Hey gidi zamane gençleri hey! Hiç utanmadan kendileri eşeğe binerler, yaşlı, bilgin
babalarını yürütürler!” diye söylenir.
Adam, yanlarından geçip giderken oğul da utancından kıpkırmızı olur, eşekten iner ve babasını
bindirir. Biraz sonra karşılaştıkları adamlar da başlarlar söylenmeye:
“Aman, şuna da bak! Senin yaşın geçmiş, kemiğin kartlaşmış; hem iște geldin, işte
gidiyorsun. Şu taze fidanı eşeğe bindir de yorma zavallıyı!"
Bu söz üzerine Hoca Efendi oğlunu da eşeğe bindirir ve baba oğul eşeğin üstünde yollarına
devam ederler.
Bir süre bu şekilde yol aldıktan sonra birkaç kişi daha karşılarına gelir. Bunlar da başlarlar
konuşmaya:
“Amma acımasız adamlar var şu dünyada!”
“Bu zavallı eşek ikinizi nasıl taşısın?”
Bu söz üzerine Hoca Efendi ve oğlu eşekten inerler. Eşeği önlerine katarak kırıta kırıta
giderlerken karşılaştıkları adamlar da bu duruma karışmadan duramazlar:
“Allah Allah, bu ne budalalık yahu!"
“Bak yahu, eşek önlerinde bomboş, hoplaya zıplaya keyifle gidiyor."
Bütün bunları duyan Hoca, adamlar uzaklaştıktan sonra oğluna der ki:
"Bak oğul, adamları gördün işte... Hiçbirini memnun edemedik... Ne yapalım elin ağzı
torba değil ki büzesin.”

46. Ekmek Arası Kar
Günün birinde Hoca komşularını yemeğe davet eder. Misafirler sofraya oturduklarında görürler
ki yemekler ziyafet yemeği filan olmayıp, günlük yemekler... İçlerinden biri Hoca'ya takılır:
"Yahu Hoca, sen koskoca Nasreddin Hoca'sın, bugüne kadar hiç yeni yemek icat
etmedin mi?"
Hoca şaşkınlığını gizleyerek biraz düşünür gibi yapar ve adama dönerek;
“Haklısınız, vaktiyle bir yemek icat etmek istedim, ancak pek tadı tuzu olmadı, tuhaf
bir şey oldu."der.
Misafirler merakla sorarlar:
“Hocam, Hocam yeni keşfettiğin yemek neydi?”
Hoca şöyle bir düşündükten sonra;
"Ekmeğin arasına kar koyup yemek." der.

47. Esnemekten Çenem İkiye Ayrılacaktı
Nasreddin Hoca'nın da içinde bulunduğu bir sohbet toplantısında geveze birisi hiç kimseye söz
hakkı vermez. Sağdan, soldan konuşulurken hep geveze adam konuşur, Hoca da sıkıldığı için
bol bol esner. Sohbet bittikten sonra geveze adam Hoca'ya;
"Yahu Hocam, siz hiç ağzınızı açmadınız?” deyince Hoca, gevezenin tekrar konuşmaya
başlayacağını düşünerek;
“Be adam, nasıl ağzımı açmadım, esnemekten neredeyse çenem ikiye ayrılacaktı.”
deyiverir.

48. Eşeğimin Gönlü Olmadan Vermem
Günlerden bir gün Hoca'nın hoşlanmadığı bir köylüsü değirmene gitmek için Hoca'dan eşeğini
ister.
"Hoca Efendi, evde un kalmadı, eşeğini versen de bir değirmene gitsem, buğdayımı
öğütsem, gelsem.” der.
Hoca'nın niyeti eşeği vermemektir.
“Komşum, bu işte birinci derecede sorumlu olan eşektir, gideyim ona bir sorayım, ona
göre ben de sana bir cevap vereyim.” der ve ahırın yolunu tutar.
Nasreddin Hoca'nın komşusu olanlara anlam veremez ama beklemekten başka da çaresi yoktur.
Biraz sonra Hoca ahırın kapısında görünür.
“Vallahi komşum, gözlerinle gördün işte, gittim eşeğe sordum. Hayvan direniyor,
gelmek istemiyor. Bana; 'Sen beni her defasında köylülerin işlerine yolluyorsun da, neler
olduğunu bilmiyorsun. Beni en ağır işlerde çalıştırıyorlar, dövüyorlar; o da yetmiyormuş gibi
bir de sana küfrediyorlar. ' dedi."
Hoca'nın ne demek istediğini anlayan komşusu;
“Hoca vermeyeceksen açık söyle. Hiç eşek konuşur mu?” deyince Nasreddin Hoca;
“Komşum, eşek her zaman konuşmaz ayda yılda bir konuşur, o da bugüne rastgeldi,
eşeğimin gönlü olmadan veremem.” der.

49. Eşeğin Ayakları
Günün birinde Nasreddin Hoca sabah erkence evinden çıkar, Akşehir Çarşısı'na gider.
Karşısına gelen bir adam selâm verdikten sora Hoca'ya hiç beklemediği bir soru sorar:
"Hoca Efendi, acaba eşeğinin kaç ayağı vardır?"
Eşeğinden inen Hoca bastonuyla eşeğinin ayaklarını teker teker saymaya başlar:
“Bir..., iki... üç... dört... Eşeğimin dört ayağı varmış!"
Bu olaya yakından tanık olanlar şaşırıp kalırlar. İçlerinden biri dayanamayıp Hoca'ya tekrar
sorar:
“Aman Hocam, eşeğin kaç ayağı olduğunu bilmiyor muydun? Niçin teker teker
saydın?"
Hoca, gülerek etrafındakileri şöyle bir baktıktan sonra;
“Elbette biliyorum, hiç bilmez olur muyum? Ama bu sabah eşeğimin ayaklarına
bakmayı unutmuştum. ‘Belki sayısında bir değişiklik olmuştur. ' diye tekrardan sayıverdim!"
der.

50. Eşeğin Başı Değişmiş
Hoca eşeğini bir ağaca bağladıktan sonra şöyle bir gezmek ister. Gezer tozar, ziyaretlerini yapar
gelir ki ne görsün, eşeğinin yuları çalınmış.
Duruma çok üzülen Hoca pazarda dolaşırken bir taraftan da eşeklerin başındaki yularları
kontrol eder. Tam bu sırada bir bakar ki eşeğin birinin kafasında kendi eşeğinin yuları.
Doğruca eşeğin yanına varan Nasreddin Hoca eşek sahibinin duyacağı bir ses tonuyla;
“Yahu, yular bizim eşeğin yularına benziyor, fakat eşeğin başı değişmiş!” deyiverir.

51. Evinizi de Hatırlayın
Nasreddin Hoca günün birinde hastalanır. Yatak yorgan derken, Hoca'ya geçmiş olsun
ziyaretleri başlar. Bir gün böyle, iki gün böyle... Bu arada Hoca da yatağın içerisinde ağrıların
etkisiyle kıvranmaktadır. Geçmiş olsuna gelen komşular da ilk geldiklerinde;
"Hocam, geçmiş olsun, ne oldu, nasılsın?” dedikten sonra hastayı bırakıp kendi
aralarında sohbeti koyulaştırmaktadırlar. Hoca'nın hanımı da gelenlere şerbet ikram etmekte,
bu arada vakit de ilerlemektedir. Çünkü her gelen oturmakta, bir türlü kalkmayı
hatırlayamamaktadır.
Hocanın ağrısı çoktur ama misafirlere de “Kalkın gidin,” diyemez. Ne kadar inlerse de, sızılarsa
da, oflarsa da hepsi boşuna... Bütün bu ofultuların sonunda hiç kimse yerinden bile kıpırdamaz.
Vakit epeyce ilerleyince misafirlerden birisi;
“Hocam, kusura bakma, geç oldu biz gidelim, daha sonra yine geliriz. Bir emrin olursa
haberimiz olsun.” deyince, Hoca taşı gediğine koyuverir:
“Vallahi komşular bu öğüdümü iyi öğrenin: Bundan sonra hasta ziyaretine gittiğinizde
evinizi de hatırlayın, başka bir diyeceğim yok, haydin güle güle."

52. Evlerimizi Çoktan Başımıza Yıkmıştı
Nasreddin Hoca vaaz vermek için kürsüye çıktıktan bir süre sonra sözü dolaştırıp develere
getirir:
"Ey cemaat, Allah'a şükredelim ki, deveye kanat vermemiş."
Bu söz üzerine cemaatten birisi merakla sorar:
"Hocam, sebebi ne ola ki?"
"Kardeşlerim, eğer Allah deveye kanat verseydi, evlerimizi çoktan başımıza yıkmıştı.”

53. Gençlikle Yaşlılığın Hiç Farkı Yokmuş
Nasreddin Hoca komşuları ile bir sohbeti esnasında;
"Gençlikle yaşlılık arasında hiçbir fark yokmuş.” der. Bunun üzerine çevresindekiler;
“Olur mu Hocam, hem de dağ gibi fark var." deyince Hoca;
“Komşular ben bunu denedim, gençliğimde bizim evin önünde bir taş vardı. O zamanlar
kaldırmak istedim, kaldıramadım. Geçenlerde aklıma geldi, taşı tekrar kaldırmak istedim, yine
kaldıramadım. Bu sebepten anladım ki gençlikle yaşlılığın hiç farkı yokmuş.” der.

54. Hangi Kıyamet
Günün birinde Hoca'nın ahbapları Hoca'ya;
“Hocam, kıyamet ne zaman kopacak?” dediklerinde Hoca;
"Hangi kıyamet?” diye sorar.
Bu defa Hoca'nın dostları;
“Hocam, kaç kıyamet var ki?” deyince Hoca;
“Arkadaşlar iki kıyamet var. Hanım öldüğünde küçük, ben öldüğümde büyük kıyamet
kopar. Siz bunlardan hangisini soruyorsunuz?” deyiverir.

55. Hanım İpe Un Sermiş
Günün birinde komşularından biri Nasreddin Hoca'dan çamaşır ipini ister. Komşunun tavrı
Nasreddin Hoca'nın hiç hoşuna gitmez, çünkü komşu aldığı emaneti geri vermeyen biridir.
Hoca;
“Komşucuğum, biraz bekle; ben ipi bulayım." der.
Bir süre sonra Hoca kapıda görünür.
“Vallahi komşum, bizim hanım ipe un sermiş."
Bu cevaba şaşıran komşu kızgınlığını gizleyemez ve;
"Yahu Hoca Efendi; alay mı ediyorsun sen, hiç ipe un serilir mi?” der.
Hoca adamı umursamayan bir tavırla cevap verir:
"Ee!.. İnsanın canı vermek istemeyince ipine un da serer, buğday da..."

56. Haydi Sen de Dişini Çektir
Günün birinde pazardan dönmekte olan Hoca'nın önünü bir komşusu keser ve derdini bir bir
anlatır. Hoca onu biraz oyalamak isteyince komşusu tekrar;
"Ama Hocam, başım çok ağrıyor. " der. Hoca şöyle sağına soluna baktıktan sonra, düşünür gibi
yapar ve ardından cevabını veriverir:
"Bak komşu, senin derdinin dermanını şimdi hatırladım. Bundan birkaç hafta önce benim de
dişim ağrımıştı, epeyce direndikten sonra baktım olacak gibi değil, gittim dişçiye, dişimi
çektirdim. Meğer başımın ağrısının dermanı buymuş. Haydi git sen de dişini çektir.”

57. Hekimlik Nedir?
Nasreddin Hoca'ya sormuşlar:
"Hekimlik nedir?"
O da en güzel cevabı vermiş:
“Ayağını sıcak tut, başını serin; gönlünü ferah tut, düşünme derin derin."

58. Hınk Demenin Bedeli
Hoca'nın kadılık yaptığı yıllarda iki kişi birbirinden davacı olur. Bir süre sonra da Hoca'nın
huzuruna gelirler. Hoca'nın;
"Derdiniz nedir, anlatın bakayım.” demesi üzerine, adamlardan biri bağırıp çağırarak
konuşur:
"Kadı Efendi, bu adamdan davacıyım."
Hoca adamı sakin olmaya davet eder ve;
“Önce sakin ol ve derdini anlat da bir dinleyeyim." der.
"Bu adam ormanda odun keserken ben de onun yanındaydım. O baltayı ağaca her
vurduğunda ben de ‘hınk' diyerek yardımcı oluyordum. Adam ağaçları kesti kesmesine de ben
paramı alamadım. Söyle buna Kadı Efendi, ödesin borcunu.”
Hoca adamları iyice süzdükten sonra, iyi birine benzettiği oduncuya döner:
"Sen bu adamın borcunu niye ödemedin?"
"Aman Kadı Efendi, ben ona, ‘Hınk mınk de'demedim. Sonra hınk demenin bedeli mi
olurmuş?"
Hoca her ikisini de dinledikten sonra kendine özgü yöntemle adaleti dağıtmaya karar verir.
"Olur, olur, bal gibi olur. Şimdi sen bu adama on akçelik borcunu öde bakalım."
Oduncu şaşırır ama Kadı'ya da bir şey diyemez. Çıkarır on akçeyi Kadı'ya verir. Kadı madeni
paraları duvara çarpınca sesler çıkmaya başlar. Bu sırada Hoca'da ‘hınk'ların bedelini isteyen
adama dönerek;
“İşte, aldın hınklarının bedelini, haydi şimdi gidin.” der.
“Kadı Efendi, Kadı Efendi! Sen beni aldatıyorsun. İki ses çıkardın, bizim para ne oldu?"
Kadı, parayı oduncuya teslim ederken, öbürüne;
“Uzatma adam! Senin hınklarının bedeli de ancak on akçenin sesiyle ödenir." der.

59. Hırsızın Hiç mi Suçu Yok?
Bir yaz gecesi Hoca ile hanımı sıcağa dayanamadıkları için damda yatmaya karar verirler.
Herkesin derin uykuya daldığı sırada hırsızlar Hoca'nın evine girerler ve buldukları her şeyi
aldıkları gibi giderler.
Sabahleyin aşağıya, evine inen Hoca, eşyalarının çalındığını görünce, kapıya çıkarak
bağırmaya başlar:
“Yetişin komşular, evimize hırsız girmiş; her şeyimizi çalmışlar!”
Hoca'nın sesini duyan komşuları, onun yanına gelirler ve arka arkaya sorular sormaya başlarlar:
“Ah Hocam, ah! Hiç insan geceleyin damda yatar mı?”
“Hocam, kapının arkasına sürgüsünü takmamış mıydın?”
"Hocam, kilit bozuk muydu yoksa?"
Hoca bakar ki soruların ardı arkası kesilmeyecek, dayanamaz;
“Bre komşular, doğru söylüyorsunuz da, bizim hırsızın hiç mi suçu yok?” der.

60. Hocam! Ayaklarımız Karıştı
Sıcak bir yaz gününde serinlemek için ayaklarını Akşehir Gölü'ne sokan çocuklar bir süre sonra
'ayaklarımız karıştı' diye kavga etmeye başlarlar. Hatta en küçük çocuk; 'ayaklarımı
kaybettim' diye ağlamaya başlar.
O sırada oradan geçmekte olan Nasreddin Hoca, gürültünün olduğu tarafa doğru yönelir ve;
“Çocuklar, hayırdır, nedir bu gürültü?” diye sorar. İçlerinden biri;
“Hocam, Hocam, ayaklarımız karıştı, bunları nasıl ayıracağız?” der ve ardından
ağlamaya başlar. Bunun üzerine Hoca;
“Çocuklarım, ağlamayın, ben şimdi sizin ayaklarınızı bulurum.” der ve hemen ardından
bastonunu suya daldırır. Sonra da çocukların ayaklarına vurmaya başlar. Ayakları acıyan
çocuklar da
"Buldum" diyerek ayaklarını dışarıya çıkarırlar.
Dayağın korkusuyla diğer çocuklar da ayaklarını sudan çıkarınca Hoca, sıkıntıyı çözmüş
olmanın verdiği keyifle yoluna devam eder.

61. Hocam Hiç Âşık Oldunuz mu?
Bir gün Hoca ve öğrencileri ders sırasında sohbet ederlerken, muzibin biri Hoca'ya sorar:
"Hocam!"
"Buyur evladım. "
"Hocam, hayatınızda hiç âşık oldunuz mu?"
Soru Hoca'nın hoşuna gider gitmesine de, bazı aile sırlarının da açığa çıkmasına gönlü razı
değildir. Bu sebepten düşünür, taşınır ve;
"Çocuğum, bir keresinde tam âşık olacaktım, o sırada üzerime geldiler. " deyiverir.

62. İçinde Gitmeyin de Neresinde Giderseniz Gidin
Günün birinde Hoca'yı sıkıştırmak isteyen bir yakını;
“Hocam, biliyorsun hepimiz öleceğiz kabul, buna şüphe yok. Ancak benim aklıma
takılan bir soru var, hep düşünürüm, acaba cenazenin namazı kılındıktan sonra tabutun
neresinde gitmeliyiz?” der.
Hoca bu, şöyle bir düşünür ve cevabı yapıştırır:
“Tabutun içerisinde gitmeyin de neresinde giderseniz gidin.”

63. İnanmıyorsanız Gidin Ölçün
Nasreddin Hoca'nın komşuları Hoca'yı sıkıştırmak için;
“Hocam, sen bilgili adamsın. Bize dünyanın merkezinin neresi olduğunu söyleyebilir
misin?" derler.
Hoca şöyle bir düşündükten sonra;
"Benim durduğum yer..." diye cevap verir.
Bunun üzerine komşular gülüşerek;
"Hoca Efendi bu nasıl cevap?” derler.
Hoca, hiçbir şey olmamışçasına komşularına;
“İnanmıyorsanız gidin, ölçün.” der.

64. İnce Eleyip Sık Dokumayı Sevmem
Nasreddin Hoca, günün birinde bahçesinin ortasında bir çukur kazmaya başlar. Komşularından
biri;
"Hocam, hayırdır, ne yapıyorsun?” deyince Hoca;
“Yahu komşu, sokağın ortasındaki toprağı buraya gömeceğim, biliyorsun gelen geçen
şikâyet ediyor.” der.
Komşusu bu defa;
“Pekiyi komşu, buradan çıkan toprağı ne yapacaksın?” deyince Hoca cevabı yapıştırır:
“Komşu, komşu, ben öyle ince eleyip sık dokumayı sevmem.” der.

65. İnsanın Hayalindeki Çorbayı Bile İstiyorlar
Günün birinde Nasreddin Hoca'nın canı sıcacık bir çorba ister. Tencereleri şöyle bir açıp bakar,
çorba yoktur. Bunun üzerine dumanı üzerinde, kokusu etrafa yayılan mis gibi leziz mi leziz bir
çorba hayal etmeye başlar. Çorbanın kendisi olmasa da hayali bile güzeldir.
Hoca Efendi tam bu hayallerle kendisini avuturken birdenbire kapısı çalınır. Gelen komşusunun
oğludur.
"Hocam, babam hasta yatıyor. Varsa bir tas çorba verseniz de içirsek...” deyince, Hoca
üzüntülü bir tavırla cevap verir:
“Ah oğlum, keşke bir değil iki tas çorba olsaydı da verseydim. Babana ‘geçmiş olsun'
deyiver."
Hoca, komşunun oğlunu uğurlayıp kapıyı da kapattıktan sonra kendi kendine söylenmeye
başlar:
"Buna da pes doğrusu! Şu bizim komşular da amma adamlar yahu... İnsanın
hayalindeki çorbanın bile kokusunu alıyorlar.”

66. İstediğin Kadar Vade Vereyim
Günün birinde Nasreddin Hoca bahçesinde fidanları budarken birdenbire bahçe kapısı açılır ve
komşularından biri içeriye girer. Biraz hoşbeş ettikten sonra oradan buradan konuşmaya başlar.
Komşunun niyetini anlayan Nasreddin Hoca ona döner ve;
“Hayırdır komşu, bir arzun, isteğin mi var?” diye sorar.
Hoca'nın bu sorusundan cesaret alan adam;
“Hocam, biraz paraya ihtiyacım oldu, bana kısa bir süre sonra ödemek üzere biraz borç
verebilir misin? Vadesi gelince öderim.” der.
Hoca, komşusunu iyi tanıdığı için der ki:
“Aman komşum, sen hem borç para istiyorsun hem de vade... Bunun ikisi birden olmaz,
sen istediğinden borç para al da ben sana istediğin kadar vade vereyim.”

67. Kadıya Düşer
Bir köpek Akşehir'in ana caddelerinden birisine pisler. Caddenin sağında ve solunda oturanlar,
"Sen temizleyeceksin, ben temizlemeyeceğim” diye tartışırlarken Nasreddin Hoca üzerlerine
gelir. Bunun üzerine cadde sakinleri;
“Hocam, bu pisliği kim temizleyecek?” diye sorarlar.
Hoca, şöyle bir düşündükten sonra;
“Vallahi hemşerilerim burası ana yoldur, buranın pisliğini temizlemek de kadıya düşer.”
der.

68. Kara Karga
Günün birinde Hoca ile hanımı Akşehir Gölü'ne çamaşır yıkamaya giderler. İkili, bir yandan
çamaşırlarını yıkarlarken, bir yandan da oturup sohbet ederler.
O sırada yanlarına simsiyah bir karga iner, çamaşırları dağıtır, sabunu da kaptığı gibi uçup
gider.
Hanım bu duruma üzüldüğü kadar da şaşırır...
Hoca bakar ki eşinin sakinleşeceği yok, onu avutmaya çalışır:
“Hatun, canını sıkma, şimdi gider başka bir sabun getiririm ama, bak o karganın durumu
bizden çok daha kötü. Ayrıca onun sabun isteyebileceği bir komşusu yok, sonra üstü başı da
bizden çok kirli. Görmüyor musun simsiyah olmuş zavallı.”

69. Karşılamaya Geldik
Günün birinde Hoca eşeğine biner ve komşu köydeki bir ahbabını ziyarete gider. Orada epеусе
bir hâl hatır ettikten sonra izin ister ve tekrar evinin yolunu tutar. Yolu üzerinde karşılaştığı
sözde muzibin biri;
“Aman Hocam, iki kardeş nereden gelip nereye gidiyorsunuz?” der.
Hoca kendinin eşek yerine konulduğunu anlayınca hemen cevabını verir:
“Aman efendim, bunu bilmeyecek ne var, ağabeyimizin geldiğini duyduk, biz de onu
karşılamaya geldik."

70. Katır Nereye Götürürse
Zor işlerinde kullanmak üzere Nasreddin Hoca bir katır alır. Katır alır almasına da katır oldukça
huysuzdur, yanına kimseyi yaklaştırmaz, üzerine kimseyi bindirmez. Ancak Nasreddin Hoca
çok zor şartlarda da olsa günün birinde katırın sırtına binmeyi başarır. Huysuz katır da Hoca
sırtına biner binmez koşmaya başlar. Hoca üzerinde, katır altında o sokak bu sokak derken bir
adam durumu görür;
“Hocam, hayırdır nereye böyle?” diye sorar.
Katırın üzerinde söylenenleri yarım yamalak anlayan Hoca;
"Vallahi ben de bilmiyorum, katır nereye götürürse oraya gidiyorum.” der.

71. Kendim ve Oğlağım İçin Öksürdüm
Nasreddin Hoca ile hanımı tam uykuya daldıkları sırada dışarıdan bazı sesler duyulur:
"Arkadaşlar, haydi içeri girelim.
"Hoca'yı öldürüp karısını kaçıralım."
"Oğlağı da götürüp pişirelim."
Hoca konuşmaları işitip yüksek sesle birkaç defa öksürünce hırsızlar da kaçıp gider. Ortalık
sakinleşince Hoca'nın hanımı;
“Efendi, galiba sen korkudan öksürdün!” deyince, Hoca gülümseyerek cevap verir:
“Hayır hatun, hayır, ben korkudan ve senin için değil, kendim ve oğlağım için
öksürdüm."

72. Kırk Yıllık Sirke
Nasreddin Hoca'nın komşularından birisi turşu kurmak ister, fakat bakar ki evde keskin sirke
yok. Hemen oğlunu çağırır;
“Oğlum, Nasreddin amcalarına git ve kırk yıllık bir keskin sirke al gel." der.
Babasından emri alan çocuk, Hoca'nın kapısını çalıp;
"Hoca amca, babam turşu kuruyordu, evde sirke kalmamış; bana, ‘Hoca amcanlardan
kırk yıllık sirke al gel' dedi." der.
Hoca şöyle bir sakalını sıvazlar ve çocuğa dönerek;
“Babana selam söyle, kırk yıllık sirkeyi veremem, eğer her gelene verseydim, evde hiç
kırk yıllık sirke kalır mıydı?” der.

73. Kırpıp Kırpıp Yıldız Yaparlar
Nasreddin Hoca bir akşamüzeri arkadaşlarıyla ayaküstü sohbet ederlerken yeni doğmakta olan
ayı görürler. Arkadaşları muziplik olsun diye Hoca'ya sorarlar:
“Hocam, yeni ay doğunca eskisini ne yaparlar?”
Hoca bu, sorunun altında kalacak değil ya, hemen cevabını veriverir:
"Bunu bilmeyecek ne var arkadaşlar, kırpıp kırpıp yıldız yaparlar."

74. Kimin Çaldığını Bilseydim?
Günün birinde, nasıl olmuşsa Nasreddin Hoca'nın eşeğini çalmışlar. Eşek bu ya! Hoca'nın da
eli, ayağı... Kısacası her şeyi... Hem Hoca'nın daha eşekle yapılacak onca işi var. Eşine
dostuna bu durumdan yakınır:
"İşlerim yarım kaldı, ne yapacağım bilmiyorum!”
Hoca eşeğinin derdiyle oflayıp puflarken, komşuları başlarlar gereksiz sorularla canını
sıkmaya:
“Hayırdır Hoca Efendi, eşeğini mi çaldılar?”
“Hocam, hem kim çalmış, biliyor musun?”
“Ne zaman çalınmış senin eşek?"
Bu gereksiz sorulardan canı fena hâlde sıkılan ve bunalan Hoca dayanamaz, patlayıverir:
“Be hey komşular, kimin çaldığını bilseydim ben eşeği hiç çaldırır mıydım?”

75. Kurt Yokuş Yukarı Koşmasın
Hoca'nın yolu bir gün ormana düşer. Eşeğini bir kenara bırakıp şöyle temiz bir hava almak için
çevreyi dolaşmaya çıkar. Bir süre sonra eşeğinin anırma sesleriyle birlikte geriye döner. Geriye
döner dönmesine de eşeğini kurt çoktan yemiş ve yokuşa doğru kaçmaya başlamıştır bile.
Tam bu sırada komşularından birisi;
“Hocam, koş kurt kaçıyor!" diye bağırmaya başlayınca Hoca da;
“Komşum, boş yere bağırıp çağırma, ne de olsa bizim eşek gitti, hiç olmazsa tok karına
kurt yokuş yukarı koşmasın.” der.

76. Kurusun Diye Güneşin Altına Dikmişler
Nasreddin Hoca bir gün camiden çıkıp evine doğru giderken tanımadığı bir adamla karşılaşır.
Hoca ileselamlaştıktan sonra adam minareyi göstererek;
"Hoca Efendi, buna ne derler?" diye sorar.
Hoca, tereddüt etmeden;
"Kuyu!" cevabını verir.
Adam, Hoca'yı sıkıştırmak için;
"Hocam, anladım da kuyu nasıl böyle ters yüz olmuş?” deyince Hoca;
"Efendi, kuyuyu ters yüz ettikten sonra kurusun diye güneşin altına dikmişler.”
deyiverir.

77. Marifet Cübbe ve Kavukta ise Al Sen Oku
Nasreddin Hoca günün birinde cami avlusunda dostlarıyla sohbet ederken tanımadığı bir
adamla karşılaşır. Adamın elinde de bir mektup vardır. Mektubu Hoca'ya uzattıktan sonra;
“Hocam, bu mektubu bir okuyuversene!” der.
Hoca, mektuba şöyle bir bakar, aşağısını yukarısını gözden geçirdikten sonra mektubun Farsça
olduğunu anlar ve adama;
"Oğlum ben bu mektubu okuyamadım, sen bunu başkasına okut." der.
Adam bu cevap karşısında;
“Hocam, benim mektubumu niçin okumuyorsun?” diye ısrar edince;
“Evladım, ben Farsça bilmiyorum, onun için okuyamıyorum.” der.
Arsız adam öfkeyle Hoca'ya çıkışır:
“Hem üzerinde kavuğun, cübben olacak, hem de mektubu okuyamayacaksın, böyle
hocalık mı olur?"
Hoca bu sözlerin karşısında epeyce kızar, fakat konumu gereği sabrını da gösterir. Adam,
saçma sapan konuşmalarına devam edince, Nasreddin Hoca yerinden kalkar ve;
“Be adam, ne konuşup duruyorsun, eğer marifet cübbe ve sarıkta ise al sen oku.” deyip
üzerinden çıkardığı iki emaneti onun önüne koyar.

78. Ne Fark Eder ki?
Nasreddin Hoca günün birinde pazara gitmeye niyetlenir ve ahırdan eşeğini dışarı çıkardıktan
sonra binmek için birkaç hamle yapar. Ancak her defasında başarısız olur. Kendisini iyice
toparlayan Hoca son bir hamle daha yaptığında eşeğe bineceğim derken öbür tarafa, burnunun
üzerine düşmesin mi? Hoca'nın eşekten düştüğünü gören çocuklar hep bir ağızdan;
"Hoca eşekten düştü, Hoca eşekten düştü." diye bağırışınca, o da kendisini şöyle bir
toparlar ve;
"Yahu çocuklar, ne bağırıyorsunuz... Ben zaten eşeğin öbür tarafında da yerdeydim,
şimdi de yerdeyim. Ne fark eder ki” deyiverir.

79. Ne Olur Komşu Biraz da Biz Ölelim
Ramazan ayının yazın tam ortasına geldiği yıllar... Gün uzun mu uzun, hava sıcak mı sıcak. . .
Bir komşusu, Nasreddin Hoca'yla birkaç arkadaşını iftara davet eder.
İftar saati yaklaşır, sofraya otururlar. Ezan okunduktan sonra iftar edilip yeme içme faslına
geçilecektir. Sofraya ilk olarak soğuk bir hoşaf tası konulur. Ancak ortada bir kurnazlık vardır.
Evin sahibi, neredeyse kepçe büyüklüğünde bir kaşıkla, hiç nefes almadan hoşafı içmektedir.
Misafirlerin ellerinde ise küçücük kaşıklar vardır. Üstelik, ev sahibi kepçeye benzeyen koca
kaşığı hoşafa her daldırışında tuhaf sesler çıkarır.
"Ohhh... Öldüm!.."
Misafirler ise küçücük kaşıklarla ne hoşafın tadına varabilir, ne de kendi susuzluklarını
giderebilirler. . . Nasreddin Hoca bir bakar, iki bakar ve ardından;
"Bu iş böyle olmaz.” diyerek ev sahibinin elindeki kepçeyi kapar ve;
"Be adam, kepçeyle biraz da biz içsek, belki biraz da biz ölürüz.” der.

80. Ne Zaman Teke Olacak?
Arkadaşları bir gün Hoca'ya;
“Hocam, senin burcun nedir?” diye sorarlar. Hoca da;
"Teke!" cevabını verir.
Bunu duyan arkadaşları hayret içinde;
"Hocam, böyle bir burç var mı? Biz bilmiyoruz da..." der.
“Rahmetli anam bana, ‘Benim burcum cedi, seninki de cedi olsun. ' demişti.”
“Hocam, sen daha iyi bilirsin ama cedi 'oğlak' değil mi? Öyleyse burcun oğlaktır.”
Arkadaşının sözlerini dinleyen Hoca cevabını veriverir:
"Doğru söylüyorsun, burcum bir zamanlar oğlaktı. Aradan yıllar geçti, bu oğlak ne
zaman teke olacak?" der.

81. Neler Çektiğimi Görün
Nasreddin Hoca eşeğinin dışında zaman zaman katır ve ata da biner. Uzak yolculuklarında
tercih ettiği atı biraz huysuz olunca Hoca bunu satmak ister. Atı pazara çekince, alıcılar yaşını
belirlemek için, atın dişine bakarken hayvan şaha kalkıverir. Ayaklarına baktıklarında çifte atar.
Kısacası at huysuz mu huysuz... Etraftan;
"Yahu Hocam, huysuz atı kim alır?” filan deyince, attan canı yanan Hoca;
"Ben de biliyorum huysuz atı kimsenin almayacağını, ancak benim neler çektiğimi
görmeniz için pazara getirdim." der.

82. O Kadar Yıldız Var
Hoca günün birinde Konya'ya gelir ve camilerden birinde vaaz vermek için kürsüye çıkarak;
"Ey cemaat, biliyor musunuz, buranın havasıyla bizim Akşehir'in havası aynı.” der.
Cemaatten biri dayanamayıp;
“Hocam, nereden bildin?" diye sorunca Hoca;
"Bunu bilmeyecek ne var, orada ne kadar yıldız varsa, burada da o kadar yıldız var."
deyiverir.

83. O Şimdi de Benim Sözümü Dinlemez
Nasreddin Hoca hayatının bir döneminde Sivrihisar'da kâtiplik yapar. Bu arada subaşı ile de
sürtüşür durur. İkilinin kavgası o kadar ileriye gider ki birbirleriyle konuşmayacak seviyeye
gelir.
Gün gelir, vakit geçer, subaşı ölür. Halk subaşıyı defnettikten sonra Nasreddin Hoca'ya;
"Haydi Hocam, talkını ver.” deyince Nasreddin Hoca;
“Bu hiç mümkün değil, çünkü subaşı benimle küs idi, o şimdi de benim sözümü
dinlemez." der.

84. Oğlumun Babası Öldü de Onun Yasını Tutuyorum
Nasreddin Hoca, günün birinde karalara bürünmüş vaziyette sokağa çıkar. Onun bu hâlini
görenler;
"Hocam, hayırdır, biz seni hep yeşil cübbenin içinde görüyorduk, ne oldu da karalara
büründün?" deyince Hoca, soruların ardı arkasının kesilmeyeceğini anlar ve;
"Sormayın dostlar oğlumun babası öldü de onun yasını tutuyorum.” der.

85. On Yıllık Sözümden mi Döneyim Bilmem ki?
Hoca bir gün dostlarıyla sohbet ederken konu döner dolaşır Hoca'nın yaşına gelir ve
arkadaşlarından biri sorar:
“Hoca Efendi, kaç yaşındasın?”
Hoca hiç düşünmeden;
"Elli..." deyiverir.
Bir başka arkadaşı da;
“Yahu Hocam! Sen on yıl önce de ‘elli' diyordun. On yıl geçti hâlâ ‘elli' diyorsun. Bu
nasıl iştir?" diye sorar.
Hoca hiç istifini bozmadan cevabını verir:
“Beyler, söz ağızdan bir kere çıkar. Siz istiyorsunuz diye, bu yaştan sonra on yıllık
sözümden mi döneyim?”

86. Onu Bana Sorun Bana
Nasreddin Hoca'nın hanımı ölür, öğle namazından sonra defnedilecektir. Namazdan sonra cami
hocası yüksek sesle sorar:
"Merhumeyi nasıl bilirdiniz?”
Cemaat de hep bir ağızdan;
“Allah rahmet eylesin, iyi biliriz.” der.
Ardından da cenaze omuzlara alınıp giderken Nasreddin Hoca bir cemaate, bir de tabutun
içindeki cenazeye baktıktan sonra derin bir ah çeker ve sessizce;
“Yahu siz, kimi kimden soruyorsunuz, siz onu bana sorun bana." der.

87. Ödeşmiş Olmadık mı?
Hoca bir gün şehre un satmaya gider. Akşama doğru işini bitirince hem günün yorgunluğunu
atmak hem de una bulanmış kıyafetlerini temizlemek için hamamın yolunu tutar.
İçeriye girince hamam çalışanlarının kendisi ile ilgilenmemesine çok canı sıkılırsa da bunu pek
dert etmez. Güzelce yunur yıkanır, üstünü başını temizler, sonra da ücretini öder ve çalışanlara
fazlasıyla bahşiş bırakır.
Hoca bu, başından geçenleri unutur mu hiç? Unutmaz... Aradan birkaç gün geçer. Hoca çok
temiz ve güzel bir şekilde giyinir kuşanır, yine hamamın yolunu tutar. Kafasında da hamam
çalışanlarından geçen gelişindeki ilgisizliğin hesabını sormak vardır.
Hocanın güzel kıyafetleri karşısında hamamcılar ona hizmet etmek için âdeta yarışırlar. Hatta
çıkışta onu kapıya kadar uğurlarlar.
Görevliye ücreti ödeyen Hoca, fazla bahşiş yerine çok az bir bahşiş bırakır. Bahşişi gören
çalışanlar kendi aralarında homurdanmaya başlarlar:
“Adama bak, kendisine ne güzel hizmet ettik... Hizmetimizin karşılığı bu mu? Bu ne
biçim bahşiş?"
Hoca, hamam çalışanlarından daha önceki ilgisizliğin hesabının sormanın tam zamanının
geldiğini anlar ve;
"Yahu, ne bağrışıp duruyorsunuz, geçen hafta üstüm başım un içinde geldiğimde
yüzüme bile bakmadınız, fakat ben o zaman size iyi bahşiş verdim, bugün ise siz benim
kürküme bakarak iyi hizmet ettiniz. İlkinde ben size iyi bahşiş verdim, şimdi ise tersini yaparak
ödeşmiş olmadık mı?" der.

88. Ölçmüş Biçmiş Gidiyor
Günün birinde Nasreddin Hoca yolda giderken birkaç kişiyle karşılaşır. Onlar;
“Hocam, dünya kaç arşındır? Biz anlaşamadık. Sen görmüş geçirmiş adamsın, bize bir
cevap ver." deyince, Hoca Efendi şöyle bir düşüneyim diye başını kaldırdığında bir de ne
görsün, karşı mahalleden mezarlığa doğru bir cenaze gidiyor. Cenaze, Hoca'nın imdadına
yetişince o da hemen cevabını veriverir:
"Arkadaşlar, ben de sizin sorunuzun cevabını biliyordum, ama bakın benden önce şu
giden cenaze cevabı verdi. Görüyor musunuz o, ölçmüş, biçmiş ve gidiyor."

89. Önden Buyur Yiğidim
Günlerden bir gün Hoca, ziyaret için mezarlığa doğru yola koyulur. Oraya varınca birdenbire
karşısına kocaman bir köpek çıkar.
Hoca korkudan ne yapacağını şaşırır. Bulduğu taşı kaptığı gibi köpeğe fırlatır.
Köpeğe❞hoșt hoșt” diye bağırarak onu korkutup uzaklaştırmak ister. Köpek de köpek ha!
Korkup kaçacağı yerde daha çok hırlar ve Hoca'nın üzerine doğru hücum eder.
Hoca, bakar ki köpeğin kaçmaya hiç niyeti yok. Çareyi bir mezar taşının arkasına sığınmakta
bulur ve;
“Anlaşıldı. Mademki bana senden önce geçiş yok, sen önden buyur yiğidim.” der.

90. Ördek Çorbası İçiyorum
Nasreddin Hoca hayattayken büyük bir kıtlık olur. Bırakın eti, bir lokma ekmeği bile bulmak
çok zordur. Evde bulduğu kuru ekmek parçalarını alan Hoca, Akşehir Gölü'nün kenarına
geldiğinde bir de ne görsün, gölde ördekler yüzüyor. Hoca, bunlardan birkaçını yakalamak
isterse de başaramaz. Ardından da yorgun argın bir ağacın gölgesine oturur ve evinden getirdiği
kuru ekmeği suya bandıra bandıra yemeye başlar.
O sırada çevreden geçmekte olan insanlar, Hoca'nın bu garip hâlini görünce dayanamaz ve
sorarlar:
"Hayrola Hocam, ne yapıyorsun?"
Nasreddin Hoca:
“Görmüyor musunuz, ördek çorbası içiyorum." diye cevap verir.

91. Padişah mı Büyük Çiftçi mi?
Nasreddin Hoca bir köye gittiğinde halk, Hoca'yı imtihan etmek ister:
"Hocam, padişah mı büyük, yoksa çiftçi mi?” diye bir soru sorarlar.
Hoca şöyle bir arkasına yaslanır, sonra da sakalını sıvazlar ve;
"Bunu bilmeyecek ne var, elbette çiftçi büyük, eğer çiftçi olmasa padişah acından
ölürdü." der.

92. Parayı Veren Düdüğü Çalar
Nasreddin Hoca günün birinde evinin ihtiyaçlarını gidermek üzere eşeğine biner ve pazara
doğru yola koyulur. Bir süre gittikten sonra çocuklar Hoca'nın yolunu keserler ve;
“Hocam, nereye gidiyorsun?” diye sorarlar.
“Pazara gidiyorum."
"Bize düdük alır mısın?"
"Elbette alırım."
Bu arada çocuklardan birisi Hoca'ya bir miktar para verir, diğerleri ise Hoca'ya iyi dileklerde
bulunurlar.
Pazar alışverişini bitiren Hoca, yorgun argın evine doğru dönerken çocuklar yolunu keserler.
“Hocam, hoş geldin.”
"Hoş bulduk çocuklar." der.
Ardından çocukların istekleri başlar:
“Hocam, bizim düdük, Hocam benim düdük, Hocam bana yok mu?” gibi sözleri işiten
Hoca, cebinden çıkardığı düdüğü para veren çocuğa uzatır. Bu defa diğer çocuklar;
“Olur mu Hocam, hani bize, hani bize?” diye şikâyete başlarlar. Bunun üzerine Hoca;
“Çocuklar, çocuklar! Parayı veren düdüğü çalar, bakın arkadaşınız parayı verdi,
düdüğünü nasıl öttürüyor." deyiverir.

93. Peşin Parayı Görünce Ne de Güzel Gülüyorsun
Nasreddin Hoca komşularından birine borçlu olup bir türlü ödeyememektedir. Alacaklı birkaç
defa kapıyı çalınca Hoca;
“Komşu, çok kısa bir süre içerisinde borcumu sana ödeyeceğim." der.
Komşusu biraz şaşkın vaziyette;
“Bu iş nasıl olacak, ne zaman ödeyeceksin?” deyince Hoca;
“Bak komşu, kapının önüne çalı ektim, çalılar ilkbaharda yeşerecek, sonra çalıları
sertleşecek...”
"Eee..."
“Kapının önünden geçen koyunların yünleri çalılara takılacak..."
"Sonra?"
"Sonra mı, bu yünleri toplayacağız, hatunla birlikte kabartacağız, sonra kirmanda
eğireceğiz, son olarak da pazarda satacağız. O zaman senin paranı ödeyeceğim.” deyince
alacaklı acı acı gülmeye başlar.
Alacaklısının bu tavrı üzerine Hoca;
“Ah komşu ah, peşin parayı görünce ne de güzel gülüyorsun.” der.

94. Pilavla Görüşüvereyim
Akşehirli zenginlerden bir tanesi Nasreddin Hoca'yı iftara çağırır. Sofraya oturdukları zaman
ilk olarak çorba gelir. Çorbadan bir kaşık alır almaz ev sahibi hizmet edenlere;
“Bu nasıl çorba, çabuk değiştirin!" der.
Arkasından sofraya güzel bir et yemeği gelir. Ev sahibi yemekten bir parçayı yedikten sonra
öfkeli bir sesle;
"Nerede bu aşçı? Ben ona baharat koyma demedim mi? Çabuk değiştirin bu yemeği!"
der.
Et yemeğinden sonra sıra baklavaya gelir. Baklavayı gören Hoca ‘Bakalım buna ne kusur
bulacak?' diye içinden geçirirken ev sahibi âdeta kükreyerek;
“Ahmak herifler, aç karnına baklava yenir mi? Kaldırın bunu." der.
Bu sırada Nasreddin Hoca yerinden fırlar ve arkada sırasını beklemekte olan etli pilavdan
yemeğe başlar. Hoca'nın bu hareketi karşısında şaşıran ev sahibi;
“Aman Hocam, ne yapıyorsun? Sofraya getirseydik..."deyince Hoca cevabını veriverir:
“Vallahi Efendi, sen sofraya gelenlerin hesabını göredur. Ben biraz pilavla
görüşüvereyim."

95. Saçlarım Sakalımdan Daha İhtiyardır da Ondan
Hoca, günün birinde berberde tıraş olurken, müşterilerden birisi;
“Hocam, maşallah, saçları ağartmışsın, lakin sakalın pek o kadar değil, neden acaba?”
deyince o da;
"Beyim, bunda bir aksilik yok, saçlarım sakalımdan daha ihtiyardır da ondan.” der.

96. Saklarlar da Kışın Yerler
Misafirlerden birisi, Nasreddin Hoca'nın evinde yatıya kalır. Akşam yemeği yenildikten sonra
sohbet edilir, yatma zamanı gelince yataklar açılır. Vakit ilerlediği için karnı acıkan misafir;
"Bizim eller bizim eller
Yatarken üzüm yerler"
diye bir türkü tutturmaz mı?
Bu türkünün sonunun nereye varacağını anlayan Nasreddin Hoca da elini kulağına atar ve;
"Sizin eller sizin eller
Yatarken üzüm yerler
Bizde böyle âdet yoktur
Saklarlar da kışın yerler." der.

97. Sana Gelir miydim?
Günün birinde Hoca'nın eşeği çalınır. Bunun üzerine Hoca sokakta yüksek sesle;
“Eşeğimi çaldılar, hırsızlar eşeğimi çaldılar." diye bağırır.
Sesi işiten Kadı, Hoca'yı yanına çağırarak;
“Eşeği nasıl çaldırdın, kime çaldırdın, ne zaman çaldırdın?”gibi sorular sorar.
Bu sorulara kızan Nasreddin Hoca;
“Kadı Efendi, Kadı Efendi! Eğer bu soruların cevabını bilseydim sana gelir miydim?"
der.

98. Sana Ne?
Nasreddin Hoca akşam namazından sonra eve doğru giderken geveze bir adamla karşılaşır:
“Hocam, az önce buradan bir tepsi baklava götürüyorlardı.”
“Giderse gitsin, bana ne elin baklavasından." deyince adam;
“Yok Hocam, baklava sizin eve gidiyordu."der.
Öfkelenen Hoca;
"Be adam, giderse gitsin, bizim eve giden baklavadan sana ne?” diyerek adamı azarlar.

99. Sapasağlam Ölüyorum
Nasreddin Hoca günün birinde hastalanır ve yorgan döşek yatar. Nasreddin Hoca bu, sevilen
birisi, bütün eş dost ziyaretine gelir ve;
"Hocam, geçmiş olsun."
“Hayırdır Hocam, dün sapasağlamdın, birdenbire ne oldu?” diye sorarlar.
Hoca, ziyaretçilerin gelip gitmesinden memnundur, ancak soruların ardı arkası kesilmeyince;
“Sormayın dostlarım, ben sapasağlam ölüyorum.” der.

100. Sen Evini Taşı
Evinin yerinden memnun olmayan köylünün biri, sıkıntısını anlatmak üzere Nasreddin Hoca'ya
gelir:
"Hocam, evde gün ışığına hasret kaldık. Evim güneş yüzü görmüyor. Bu sıkıntıma bir
çare bul."
Nasreddin Hoca, evinden şikâyetçi olan adam hakkında bilgi sahibi olmadığından merakını
gizleyemez ve sorar:
“Yahu komşu, senin toprağın filan yok mu?”
“İlahi Hoca Efendi, köylü adamın tarlası olmaz mı hiç?"
"Madem tarlan var, o hâlde güneş de görüyordur."
"Yahu Hocam, tarladır bu, elbette güneş görür."
Hoca, bu lüzumsuz soruyu soran köylüye iyi bir ders vermek niyetindedir. Adama şöyle uzun
uzun bakarak cevap verir:
“Oh, ne güzel! Güneş senin evine gelmiyorsa sen evini tarlaya götürüver.”

101. Sen O Zaman Tozun Dumanın Ne Olduğunu Anlarsın
Nasreddin Hoca ile mollası İmad birlikte ava çıkarlar. Bir süre dolaştıktan sonra İmad bir kurt
yavrusunun ininin içerisine girdiğini görür ve ardından o da girer. Uluma sesleri üzerine ana
kurt da ine gelince Nasreddin Hoca inden içeriye girmek isteyen ana kurdun kuyruğundan tutar.
Kurt yavrusunu kurtarmak için içeriyi zorlarken her taraf toz duman içinde kalır. İmad içeriden
bağırır:
“Hocam, bu ses, gürültü nedir?"
Hoca da;
“Oğlum İmad, sen dua et de kurdun kuyruğu kopmasın; eğer kurdun kuyruğu koparsa
sen o zaman tozun dumanın ne olduğunu anlarsın.” der.

102. Sendeki Alacağım Başka
Nasreddin Hoca bir gün yolda giderken eski tanıdığına rastlar. Adam vaktiyle Hoca'dan borç
para almış; ancak ödememiştir. Bu sebeple de pek ortalarda görünmemektedir. Hâl hatır
sorduktan sonra Hoca;
“Mehmet Efendi, benden aldığın borcun üzerinden epey zaman geçti. Haydi artık öde
de kurtul." der.
Mehmet Efendi ezilip büzülür. O sırada yanlarından geçmekte olan bir adam Mehmet Efendi'ye
acır ve onu Hoca'nın dilinden kurtarmak için;
“Hoca, sen onu bırak. Esas borçlu benim." der.
Öfkelenen Hoca münasebetsiz adamı uyarır:
"Sendeki alacağım başka, o biraz dursun. Benim bundan alacağım var. Ben onu
istiyorum."

103. Senin Gibilere Muhtaç Olmamak İçin
Cimrilerden birisi Hoca'ya takılır:
"Hocam parayı çok sevdiğini öğrendim, acaba neden?"
Hoca bu kendini bilmeze cevapta gecikmez;
"Senin gibilere muhtaç olmamak için.” deyiverir.

104. Senin İçin Yanıyorsa Bilmem
Günün birinde komşularından biri Nasreddin Hoca'yı yemeğe çağırır. Hoşbeşten sonra sofra
kurulur, Hoca da tabaktakileri afiyetle yer. Yemek faslı bittikten sonra ev sahibi Hoca'nın
önüne kara kovan balından bir tabak kor. Balın kaliteli olduğunu anlayan Hoca, kaşık kaşık balı
yemeye başlayınca ev sahibi dayanamaz;
"Hocam, eğer balı ekmeksiz yersen içini yakar." der.
Hoca, şöyle bir arkaya doğru yaslanır ve ardından da ekler:
“Vallahi komşu, benim içimin filan yandığı yok, senin için yanıyorsa bilmem.”

105. Seninle de Konuşulmuyor ki
Bir akşam üzeri Nasreddin Hoca ile hanımı avluda oturmuş, sohbet etmektedirler. Tuhaf bir
hâli olan Hoca, hanımına sorar:
“Hanım, bizim komşu değirmenci Ahmet Efendi'nin adı neydi?”
Kocasının dalgın hâlini merak eden hanım bu soru karşısında şaşırarak;
"Hoca Efendi, bu nasıl söz? ‘Ahmet Efendi' dedin ya.” der.
Bozuntuya vermeyen Hoca soruyu değiştirir:
“Dilim sürçtü. Ne iş yaptığını soracaktım.”
"Efendi, sana ne oldu? ‘Değirmenci' dedin ya."
Üste çıkmaya çalışan Hoca;
“Hatun nerede oturuyor diye soracaktım.” der.
Şaşkına dönen hanım dayanamaz ve;
“Efendi, sana bir şeyler mi oldu ne... Az önce ‘komşu' dedin ya."
Hanımının her sorusuna karşı çıktığını gören Hoca biraz da kızarak;
“Yahu hanım, iki söz edelim dedik, burnumdan getirdin. Seninle de konuşulmuyor ki!”
deyiverir.

106. Sondaki Est’leri Görmüyor musun?
Hoca, medresede öğrenciyken Arapça ve Farsça derslerini de okumuştur. Ancak günlük hayatta
bu dilleri pek kullanmadığı için unutur. Bir işgüzar da Hoca'nın Arapça ve Farsça bilip
bilmediğini anlamak için onu sıkıştırmaya başlar:
“Hocam, iyi hoş adamsın; seni çok severim. Ama Farsça bilmediğin için vaazlarından
yeterince yararlanamıyorum.”
Bunun üzerine Hoca öfkeyle adama çıkışır:
"Be adam, benim Farsçayı bilmediğimi de nereden çıkardın? Dinle bakalım, Farsça
nasıl konuşulurmuş, nasıl Farsça şiir okunurmuş:
Mor menekşe boynun eğmiş uyurest,
Kâfir soğan kat kat urba giyerest. '
Soruyu soran işgüzar, önceleri şaşırırsa da kendisini hemen toparlayarak Hoca'ya bir soru daha
sorar:
“Aman Hocam sen de! Farsça bunun neresinde ki?”
Hoca bu, altta kalır mı hiç! Adamı önce dikkatle süzer, sonra da tebessüm ederek cevabını
yapıştırır:
"Neresinde olacak yahu! Sonlarında elbette... Sen oradaki ‘est'leri görmüyor musun?”

107. Suyunun Suyu
Yakın köylerden birinde oturan bir ahbabı Nasreddin Hoca'yı ziyarete gelir. Yatıya kalacak
olan konuk Hoca'ya bir tavşan hediye eder. Hoca da konuğunu elinden geldiğince ağırlar.
Ertesi hafta tanımadığı bir adam Hoca'ya komşu olur. Adam;
“Hoca Efendi, ben geçen hafta tavşan getiren efendinin komşusuyum.”
Hoca, hediye edilen tavşanın suyuyla bir çorba hazırlatır ve sofraya getirerek;
"Afiyetle iç. Bizim hanım bu çorbayı senin köylünün getirdiği tavşanın suyundan
yaptı."
Üçüncü hafta aynı köyden iki kişi birden gelir ve;
“Biz o tavşanı getiren efendinin köyündeniz."
"Buyurun." der Hoca,”Bu çorbayı o tavşanın suyundan pişirdi bizim hanım."
Dördüncü haftada birkaç kişi birden gelince Hoca köylülere ders vermek ister. Önlerine bir tas
sıcak su koyuverir. Köylüler içtiklerinin sıcak su olduğunu fark edince şaşırıp kalırlar. Fırsatını
yakalayan Hoca verir veriştirir:
“Ulan köftehorlar, hemşeriniz dört hafta önce bir tavşan getirdi, her hafta birileri gelip
konuk oldu. Artık tavşan kalmadı. Varın köye haber verin!"

108. Şıkır Şıkır Akçeler
Nasreddin Hoca'nın kadı olduğu günlerden birinde gürültülü bir şekilde kapısı açılır ve iki
adam içeri girerler. Adamlardan biri diğerinin yakasını tutarak Hoca'nın huzuruna getirir. Son
derece hiddetli olan adam Hoca'nın ‘Ne oluyor?” demesine fırsat vermeden anlatmaya başlar:
"Kadı Efendi, bu adam rüyamda benden şıkır şıkır yirmi akçe aldı. İstiyorum, vermiyor.
Şikâyetçiyim.”
Kadı Efendi rüyada yirmi akçe alan adamı yanına çağırır ve yirmi akçe vermesini ister. Şaşkına
dönen adam Kadı'nın sözünü dinler ve yirmi akçe verir. Akçeleri alan Kadı önündeki
çekmeceye şıkır şıkır akçeleri saydıktan sonra rüya sahibine;
"Al bakalım şu şıkırtıları..." der. Sonra da akçeleri sahibine vererek, sakalını
sıvazladıktan sonra;
"Haydi güle güle. Bir daha birbirinizin hakkını yemeyin.” diye seslenir.
İki adam dostça ayrılıp giderlerken Kadı'nın yanında hazır bulunanlar da karara hayran kalırlar.

109. Tarifesi Bende Kaldı
Ciğeri çok seven Hoca bir gün bir okka ciğer ile evine dönerken yolda karşılaştığı bir dostu
Hoca'ya bir yemek tarifi vermek ister:
"Hocam, sana öyle bir tarif vereceğim ki parmaklarını yiyeceksin.”
Dostu tarife başlayınca Hoca;
"Tarif karışık iş, bu benim aklımda kalmaz. Sen bunu bir kâğıda yazıver." der.
Tarifi alan Hoca yiyeceği ciğerin hayali ile eve doğru ilerlerken bir çaylak alçalır ve oldukça
dalgın olan Hoca'nın elinden ciğeri kaparak kaçar. Bu durumda yapacak bir şeyi olmayan Hoca,
çaylağın ardından bakakalır ve elindeki tarifin yazılı olduğu kâğıdı havaya kaldırarak;
“Boşuna sevinme, tarifesi bende kaldı. Ağız tadıyla yiyemeyeceksin.” deyiverir.

110. Tatlı Bir Uyku Uyumuştum
Nasreddin Hoca günün birinde eşeğine biner ve Konya'nın yolunu tutar. Ancak Konya yolu
uzundur, birkaç gece yollarda konaklaması gerekmektedir. Sabah erkenden çıkılan yolculukta
akşam olunca Hoca bir köyde konaklamak ister. Öyle de yapar ve çaldığı bir kapıda “Tanrı
misafiri' deyip orada konuk edilir. Bu arada Hoca çok acıkmıştır. Hâl hatırdan sonra ev sahibi
Hoca'ya;
"Hocam yoldan geldin, susuzluk, uykusuzluk var mı?” deyince Hoca;
"Vallahi kardeşim, gelirken bir pınarın başında tatlı bir uyku çekmiştim.” deyiverir.

111. Tazıya Döner
Cimri bir kişiliğe sahip olan dönemin subaşını pek sevmeyen Nasreddin Hoca ile subaşının
arası pek de iyi değildir. Subaşı bir gün Hoca'dan tavşan kulaklı, karınca belli bir tazı ister.
Köpekten anlamayan Hoca, birkaç gün sonra sokakta yakaladığı tombul bir köpeği subaşıya
götürür. İstediği gibi bir köpekle karşılaşmayan subaşı Hoca'ya;
“Aman Hocam, ben senden böyle tombul köpek mi istedim? Benim istediğim ince belli
bir tazı olacaktı. Sen tutmuş tombul bir köpek getirmişsin.” der.
Bütün bunları sabırla dinleyen Hoca gülümseyerek cevabını veriverir:
"Merak etmeyin subaşı hazretleri, bu köpek bir aya kalmaz tazıya döner.”

112. Tokadın Bedeli
Günlerden bir gün adamın biri Nasreddin Hoca'nın ensesine bir tokat atar. Hoca da adamı
tuttuğu gibi Kadı Efendi'ye götürür. Hoca;
“Kadı Efendi, bu adam bana tokat attı. Şikâyetçiyim.” der.
Tokadı atan adam Kadı Efendi'nin tanıdığı çıkınca Kadı Efendi kararını verir ve şöyle der:
“Tokat atmanın bedeli bir akçedir. Ver de kurtul."
Adam bir akçeyi getirmeye gider ama bir türlü gelmez. Beklemekten sıkılan Hoca kalkıp Kadı
Efendi'nin ensesine bir tokat atar ve ardından cevabını veriverir:
“Kadı Efendi, adamın parayı getireceği yok. Getirirse de sana attığım tokadın cezası
olarak alıverirsin."

113. Tuzun Sayesinde Aklımız Denk Oldu
Nasreddin Hoca tuzlu yemekleri sevmezmiş. Olacak bu ya hanımı da bütün yemekleri tuzlu
pişirirmiş. Bir ziyafette, önüne konulan çorbaya bol bol tuz atmaya başlar. Sofradakiler şöyle
bir bakarlar Hoca hiç de tuzu bırakmıyor. Bunun üzerine içlerinden biri;
“Hocam, yemeklere çok tuz atma, aklı geriletir.” der.
Hoca, sakalını şöyle bir sıvazladıktan sonra, adamın yüzüne bir bakar ve;
"Efendi efendi, tuz yemesem benim aklım herkesin aklıyla nasıl denk olabilir?” der.

114. Uykumu Kaybettim, Onu Arıyorum
Gecenin ilerlemiş bir saatinde Nasreddin Hoca sokakta gezerken bekçiler tarafından yakalanır
ve sorguya çekilir:
"Efendi, bu saatte sokakta ne arıyorsun?” dediklerinde Hoca gayet olgun bir şekilde;
"Uykumu kaybettim, onu arıyorum.” deyiverir.

115. Ya Eyüp İp Olursa
Hoca bir gün camide vaaz etmektedir:
"Kardeşlerim, değerli Müslümanlar! Doğruluktan ayrılmayın, yalan yere yemin
etmeyin!"
Bu arada cemaat içinde oturmakta olan Eyüp Efendi'ye gözü ilişir.
Tanıdıklarının Eyüp Efendi'nin adını doğru söyleyemediklerini, bu sebeple onun adını çok
farklı seslendirdiklerini hatırlar ve evirir, çevirir sözü onun adına getirir:
“Kardeşlerim, sizlere söylüyorum. Sakın ola ki çocuklarınızın ve torunlarınızın adlarını
Eyüp koymayın."
Dinleyenler şaşırırlar. Hoca'nın Eyüp Peygamber'in adını beğenmediğini sanıp kızanlar bile
olur. Kalabalıktan uğultu yükselince Hoca işi şakaya döker.
“Eğer siz çocuklarınıza, torunlarınıza Eyüp adını verirseniz, günün birinde insanlar onu
söyleye söyleye İp'e çevirirler."

116. Yağım, Biberim, Tuzum, Ateşim Ne Olacak?
Nasreddin Hoca yakaladığı bıldırcınları temizledikten sonra bunlardan güzel bir yemek yapar
ve komşularını davet etmek için evden çıkar. Hoca'yı takip eden bir komşusu da yemeği
tenceresine boşaltıp, yakaladığı canlı bıldırcınları tencerenin içerisine bırakıp gider.
Hoca, komşularını davet ettikten sonra, yemeği koymak için tencerenin kapağını açtığında bir
de ne görsün, yemeğin yerinde yeller esiyor. Bu arada canlı bıldırcınlar da uçup giderler.
Hoca kısa bir süre içerisinde kendisini toplar ve elini açarak;
"Allah'ım, inanıyorum, senin her şeye gücün yeter. Buna şüphe yok. Bıldırcınlara can
verdiğine inanıyorum, onları kurtardığına da inanıyorum. Pekiyi, benim; yağım, biberim,
tuzum, ateşim ne olacak?” deyiverir.

117. Yata Yata Usandım, Biraz da Dolaşmaya Çıkacaktım
Mevsimlerden yazdır. Bu aralarda Hocamızın da canı bir şeylere sıkılmıştır. Şöyle hava almak
için dışarı çıkar.
Hava sıcak mı sıcak... Hoca'nın iç çamaşırları da sıcaktan dolayı sırılsıklam olur. Hoca, terli
elbiselerini değiştirebilmek için uygun bir yer ararsa da bulamaz.
Yol boyu giderken karşısına bir mezarlık çıkar. Hemen mezarlığa girip mezar taşlardan birinin
arkasında üzerini değiştirmeye başlar.
Olacak bu ya, tam da o sırada mezarlığın yakınından geçmekte olan birkaç atlı adam, Nasreddin
Hoca'yı yarı çıplak vaziyette görünce;
“Be adam, bu nasıl hâldir? Senin ne işin var bu vaziyette mezarlıkta?” derler.
Hoca bakar ki atlılar kızgın... Hemen, onların hoşlarına gidecek bir cevap vererek paçayı
kurtarır:
"Ne olsun, burası benim mezarım... Yata yata usandım da biraz dolaşmaya çıkacaktım.”

118. Yorgan Gitti Kavga Bitti
Bir gece Nasreddin Hoca ile hanımı odalarına çekilirler. Ancak bir süre sonra dışarıdan gelen
gürültü patırtı sesleri ile uyanırlar. Mevsim kıştır, Hoca Efendi aceleyle üzerine yorganını
alarak dışarıya çıkar. Bakar ki birkaç genç kavga etmektedir. Hemen onlara öğüt vermeye
başlar:
"Yapmayın, etmeyin.” derken, olacak bu ya, Hoca'nın üzerindeki yorgan da bir taraflara
düşer. Gürültü patırtı çıkaranların bir kısmı kavga eder gibi görünürken bir kısmı da yorganı
kaptıkları gibi kaçarlar. Bir süre sonra adamlar kavgayı bıraktıklarında Hoca bir de ne görsün?
Yorgan gitmiş. Hanımı, üzgün bir şekilde eve dönen Hoca'ya sorar:
"Ne oldu Efendi? Hani yorganın nerede?”
Hoca yorganı kaybetmenin üzüntüsüyle;
“Sorma hatun, kavganın sebebi bizim yorganmış; yorgan gitti, kavga bitti.” diye cevap
verir.

119. Aklın Varsa Göle Koş
Nasreddin Hoca günün birinde eşeğine binerek ormana odun kesmeye gider. Kuru odunlardan
epeyce kestikten sonra bunları eşeğine yükler ve evin yolunu tutar. Ancak, yolda aklına, kestiği
odunların yanıp yanmayacağı konusu gelir ve ince kuru dallardan birkaçını tutuşturur.
Başlangıçta odun çıtır çıtır yanarken Hoca ve eşeği gayet rahattır. Fakat bir süre sonra kuru
odunların tamamı yanmaya başlayınca Nasreddin Hoca'yı bir telaş alır ki sormayın. Bu arada
odunların yanmasıyla birlikte semeri de yanmaya başlayan eşek iyice huysuzlanır ve hoplayıp
zıplamaya başlar. Eşeğin bu acı haline çok üzülen Nasreddin Hoca yüksekçe bir yere çıkar ve;
“Eşeğim, aklın varsa göle koş, yoksa hâlin duman...” deyiverir.

120. Ay da Çıktı Ama Ben de Neler Çektim Neler?
Geceleyin ay ışığının etrafı aydınlattığı bir saatte Nasreddin Hoca evde suyun olmadığını
öğrenince, kova ve testiyi alıp kuyuya gider. Nasreddin Hoca kovayı kuyuya sarkıttığında bir
de ne görsün, kuyunun içerisinde kocaman bir ay...
"Hay Allah, ayın kuyuda ne işi var?"
Hoca, ayın kuyuya düştüğünü sanarak evine gelir, ipin yanına çengeli de alarak tekrar kuyunun
başına döner. Çengeli ipe bağlayarak kuyudan aşağıya sarkıtan Nasreddin Hoca, çengelin bir
taşa takılması üzerine var gücüyle asılmaya başlar. Bir asılır, iki asılır, üç asılır, ancak çengel
çıkmaz.
Biraz daha kendisini çengeli çekmeye hazırlayan Nasreddin Hoca var gücüyle ipi çekince,
çengelin takıldığı taştan kurtulmasıyla birlikte sırtı üzerine düşer. Bir süre toz toprak içinde
kaldıktan sonra Hoca, kendisine gelir ve gökte ayı gördükten sonra;
“Ay çıktı ama ben de neler çektim neler?” deyiverir.

121. Aynı Yöne Gittiğimi Görmemek İçin
Hoca bir gün eşeğe ters binerek giderken, karşısına çıkanlar merakla sorarlar:
"Hoca Efendi, niçin eşeğe ters biniyorsun?" Hoca gülümseyerek cevap verir:
“Eşekle aynı yöne gittiğimi görmemek için...”

122. Bağdat'a Gitmem Gerekir
Günün birinde komşularından birisi Hoca'nın kapısını çalar ve;
“Hoca Efendi, senden bir isteğim var." der.
"Nedir komşu?"
“Hocam, Bağdat'ta bir dostum var, ona mektup yazmak istiyorum, fakat benim yazım
çok kötü. Mümkünse bu mektubu yazıversen.” deyince Hoca;
“Olmaz, çünkü benim Bağdat'a gidecek vaktim yok.” der.
Hoca'nın yanlış anladığını zanneden komşusu;
“Hocam, Bağdat'a gitmeyeceksin, mektubu yazıvereceksin.” deyince Hoca adamı
başından savmak için yeni bahaneler uydurur ve;
“Ah dostum! Bir bilsen benim yazım ne kadar kötü, ancak kendi yazdığımı kendim
okuyabiliyorum, bu sebepten de Bağdat'a gitmem gerekir." der.

123. Ben Perdeyi Buldum ve Çalıp Duruyorum
Bir gün Nasreddin Hoca'yı ziyafete davet ederler. Yeme içme faslından sonra saz çalan bir
misafir sazını ortaya çıkararak;
“Hocam, saz çalmasını bilir misin?” diye sorar.
Hoca da hiç düşünmeden, sözünün sonunun ne olacağını aklına kestirmeden;
"Evet, çalarım.” deyiverir.
Bunun üzerine sazı Hoca'ya uzatırlar. Ne perde, ne mızrap... Hiçbir şeyi bilmeyen Nasreddin
Hoca sazı eline alır ve gelişigüzel mızrapla tellere vurmaya başlar. Sazdan garip garip sesler
çıkınca oradakiler;
“Hoca Efendi, bu nasıl saz çalış? Bunun da bir çalma usulü vardır, seninki saz çalma
değil işkence." derler.
Nasreddin Hoca, saz çalmasını bilmediğini belli etmemek için kahkahayı basar ve;
"Arkadaşlar, bunda şaşılacak ne var? Bu işte perde arayanlar, aramaya devam etsinler,
bakın ben buldum ve çalıp duruyorum.” deyiverir.

124. Benim Kuşumun Düşündüğünü Görmüyor musunuz?
Hoca, pazar yerinde bir kuşun iki akçeye satıldığını görür.
Hoca, kuşun iki akçeye satıldığını görünce sevinir ve;
“Bu küçücük kuş iki akçe ederse benim evdeki hindim onlarca akçe eder.” der. Sonra
da evine gider ve hindiyi yakaladığı gibi pazarın yolunu tutar; ancak Hoca'nın hindisinin
yüzüne kimse bakmaz. Biraz bağırıp çağırmadan sonra zor ve şer Hoca'nın hindisine de iki
akçe veren olur ama Hoca'nın kafasının tası iyice atar;
“Be adamlar! Biraz önce küçücük kuşa iki akçe verdiniz, görmüyor musunuz benim
hindim onun on katı daha büyük.” deyince, pazarcılar;
“Hocam, o kuş dediğin papağandır, o konuşur, bu sebepten kıymetli.” Deyince Hoca
dayanamaz;
"Yahu, siz o kuşun konuştuğunu söylüyorsunuz da benim kuşumun düşündüğünü neden
görmüyorsunuz?” der.

125. Biz Onun Ayağına Gideriz
Nasreddin Hoca'nın hocalığı halk arasında ermişliğe kadar ilerleyince günün birinde
hemşerileri;
“Hocam, senin bir ermiş olduğunu, istediğin her şeyi ayağına getirttiğini söylüyorlar.
Fakat bunu biz göremedik; şu kerametini bize gösterir misin?” diye sorarlar.
Bu sözler karşısında şöyle bir kendini toparlayan Nasreddin Hoca;
“Ey dağ, haydi yanıma gel.” diye üç defa seslenir.
Nasreddin Hoca ve hemşerileri bakarlar ki dağın kıpırdadığı filan yok. Herkes, Hoca ile dalga
geçmeye hazırlanırken Hoca yerinden kalkıp yürümeye başlayarak;
“Hemşerilerim, biliyorsunuz bizde kibir diye bir şey yoktur. Ne yapalım, dağ bizim
ayağımıza gelmezse biz onun ayağına gideriz.” deyiverir.

126. Bizim Eve Geliyor
Günün birinde Nasreddin Hoca'nın komşularından birisi vefat eder. Hoca da komşu hakkı
diyerek başsağlığı dilemeye gider. Bu sırada evdekiler yüksek sesle ağlamaktadır.
"Ah, bizi bırakıp da nereye gidiyorsun, hem de ocağı, ateşi olmayan yere..."
Hoca bu sözleri iyice dinledikten sonra ev sahibinden izin ister ve doğruca evine gelerek
hanımına;
“Hanım, hanım! Sorma başımıza gelenleri, söylenenlere bakılırsa rahmetli komşumuz
bizim eve geliyor.” der.

127. Bunu Sana Haber Vermeye Geldim
Nasreddin Hoca ile hanımı evde sohbet ederlerken hanımın sancısı tutar ve kıvranmaya başlar.
Bu arada Hoca'ya;
"Hoca Efendi, git bana bir hekim çağır." der.
Nasreddin Hoca tam evden çıkacağı sırada hanımı;
“Bey! Gitme, sancım geçti.” der.
Hanımının uyarısına rağmen Hoca hiçbir şey olmamışçasına doktorun yanına gider ve;
"Doktor Bey, hanımım sancılanmıştı, beni de sana göndermişti. Tam evden çıkarken
sancısının geçtiğini söyledi; ben de bunu sana haber vermeye geldim.” der.

128. Büyüyünce Ganem Derler
Nasreddin Hoca Hicaz'a gider. Dönüşte herkes Hoca'yı karşılar, hoş beş sırasında
hemşerilerinden birisi;
“Hocam, Arabistan'da epeyce kaldın, her hâlde Arapçayı da öğrenmişsindir." deyince
Hoca;
“Evet, öğrendim." der.
Bunun üzerine hemşerisi sorar:
"Pekiyi Hocam orada deveye ne derler?"
“Hemşerim, sorduğun soru çok büyük olmadı mı?"
“Pekiyi, küçüğünden soralım, pireye ne derler?”
“Hemşerim, bu defa da çok küçüğünden sordun, bunların ortası yok mu?”
Bu sırada soru sorma sırası bir başka hemşerisine gelir:
"Tamam, Hocam onlar kuzuya ne derler?"
Hoca, bu soruyu duyunca şöyle bir kendine gelir ve cevap verir:
“Hemşerilerim, onlar kuzuya bir şey demezler; ancak kuzu büyüyünce ganem [koyun]
derler."

129. Çekirdeğiyle Tarttı
Hoca pazardan bir okka hurma alır ve evine gelir. Akşam olunca da hanımıyla birlikte yemeye
başlarlar. Hocanın hanımı bir de bakar ki, kocası hurmaları çekirdeği ile birlikte yiyor. Bunu
üzerine Hoca'ya dönerek;
"Efendi, hurmayı çekirdeğiyle mi yiyorsun?” diye sorar.
Hoca bu soru karşısında;
“Elbette çekirdeğiyle yiyorum, çünkü pazarcı bana onu çekirdeğiyle tarttı.” diye cevap
verir.

130. Daha Ne Kadar Gitmemi İstiyor?
Bir gece vakit ilerleyince Hoca ile hanımı odalarına çekilirler. Biraz sonra hanım seslenip;
"Hoca Efendi, biraz öteye gidiver.” deyince Hoca da cübbesini sırtına aldığı gibi sokağa
çıkar. Epeyce yürüdükten sonra sabaha karşı bir tanıdığı ile karşılaşır.
"Hocam, hayırdır, sabahın köründe nereye böyle?” deyince Hoca;
"Vallahi komşu ben de bilmiyorum. Yalnız senden bir ricam var, bizim eve git ve
hanıma bir sor, bakalım daha ne kadar gitmemi istiyor.” der.

131. Elbette Eşekle Birlikte Ben de Kaybolacaktım
Günün birinde Nasreddin Hoca eşeğini kaybeder. Bunun üzerine Hoca'nın bütün eşi dostu
toplanarak kaybolan eşeği aramaya başlarlar. Bu arada Nasreddin Hoca bir taraftan eşeğini
ararken bir taraftan da;
“Çok şükür ya Rabbi! Çok şükür ya Rabbi!” deyip durur.
Bu sesi işiten Hoca'nın dostları;
“Hocam, eșeği aramaya başladığımızdan beri 'çok şükür ya Rabbi! Çok şükür ya
Rabbi!' deyip duruyorsun, bunun sebebi nedir?” diye sorunca Nasreddin Hoca;
“Bu soruyu niçin sorduğunuzu anlayamadım. Bunu bilmeyecek ne var, eşeğin üzerinde
olmadığım için şükrediyorum.” der.
Hoca'nın dostları merakla bir defa daha sorarlar.
“Pekiyi, eşeğin üzerinde olsan ne olacaktı?” deyince Hoca, bir şey olmamışçasına;
"Efendiler, bunu bilmeyecek ne var, elbette eşekle birlikte ben de kaybolacaktım.”

132. Elinden Almak Kolay Olur
Bir gece Hoca'nın evine hırsız girer. Tuhaf sesler işiten hanımı Hoca'yı uyandırarak;
“Hoca, kalk bir tıkırtı var, galiba eve hırsız girdi." deyince Hoca;
“Hanım, boş ver, sen yatmana bak, o çalacak bir şey bulabilirse elinden almak kolay
olur." deyiverir.

133. Hanım Sen de Haklısın
Nasreddin Hoca'nın kadılık yaptığı yıllarda evinin kapısı çalınır. Hoca, kapıyı açında karşısında
komşusunu görür. Komşusu çıkışırcasına Hoca'ya seslenir:
“Kadı Efendi, filan adamdan şikâyetçiyim.”
Hoca, komşusunu sakinleştirmeye çalışarak sorar:
“Nedir, anlat bakayım.”
Şikâyetçi adam, anlatır, anlatır ve Hoca başını kaldırarak;
“Haklısın.” der ve adamı yolcu eder.
Çok geçmeden Hoca'nın kapısı tekrar çalınır, bu defa gelen de yolcu ettiği adamdan
şikâyetçidir. Hoca Efendi adamı dinler ve ardından;
"Haklısın.” der ve onu da yolcu eder.
Olanları içeriden işiten Hoca'nın hanımı hayretle;
“Yahu, sen ne biçim kadısın? İki şikâyetçi de birden haklı olur mu?” deyince, Hoca
çaresiz bir şekilde;
"Hanım sen de haklısın.” demek zorunda kalır.

134. Hem İnsan Dövüyorlar Hem de Zorla Helva Yediriyorlar
Hoca, günün birinde Konya'da bir helvacı dükkânına girer ve hiçbir şey söylemeden helva
yemeye başlar. Dükkân sahibi;
“Yahu arkadaş, kimsin, nesin, para yok pul yok, sen kime danıştın da helvamdan
yiyorsun?" der.
Fakat Hoca, bu sözleri duymazdan gelerek helva yemeye devam eder. Dükkân sahibi de para
alamayacağı bir adam olduğunu zannederek, Hoca'yı dövmeye başlar. Bu sırada bir taraftan
dayak yiyen Hoca bir taraftan da helva yemeye devam eder. Araya girenlerin de yardımıyla
şöyle bir kenara çekilen Hoca;
"Yahu bu Konyalıları da anlamak çok zor, hem insanı dövüyorlar hem de zorla helva
yediriyorlar." deyiverir.

135. İyi ki Gömleğin İçinde Ben Yoktum
Nasreddin Hoca'nın hanımı günün birinde çamaşır yıkar. Daha sonra da yıkadığı çamaşırları
kurusun diye evinin arkasındaki ağaçlara asar. Bunlardan kalın olanlarını daha çabuk kuruması
için iyice gerer.
O gece bahçeden bazı sesler duyan Nasreddin Hoca hanımına seslenir:
“Hanım hanım, çabuk benim yayımı okumu ver, bahçede hırsız var.”
Hanımından oku ve yayı alan Nasreddin Hoca, bahçedeki bir karaltıya nişan alır.
Sabah olunca bir de bakar ki insan zannettiği kendi gömleği değil mi? Bu duruma çok sevinen
Hoca hanımına dönerek;
“Hanım, iyi ki gömleğin içinde ben yoktum, aksi takdirde çoktan ölmüştüm.” deyiverir.

136. Kazan Doğurdu
Nasreddin Hoca komşusundan bir kazan ister, kazanın dışını külle sıvar, bulgurunu kaynatır,
sonra da kazanı güzelce temizler ve içerisine küçük bir tencere koyarak komşunun kapısını
çalar. Komşu kazanın içindeki tencereyi görünce şaşkın bir şekilde Hoca'ya sorar:
"Hocam, bu tencere ne?"
“Komşu, senin kazan hamiyleymiş, doğurdu.” der.
Komşu bu işten memnun kalır. Bir gün böyle, iki gün böyle derken günün birinde Hoca,
komşusundan bir daha kazanı ister. Komşusu da sevinçle kazanı verir. Fakat aradan günler
geçmesine karşılık Hoca kazanı bir türlü getirmez. Bir şeyler sezinleyen komşusu Hoca'nın
kapısı çalar:
“Hocam, bizim kazanı verir misin?”
"Komşu, senin kazan öldü.” der.
Bunun üzerine komşu sinirli bir şekilde Hoca'ya çıkışır:
“Yahu Hocam, hiç kazan ölür mü?”
Hoca, bıyık altından gülerek komşusuna cevap verir:
“Be adam, kazanın doğurduğuna inanıyorsun da öldüğüne neden inanmıyorsun?”

137. Kürsüden İnmek de mi Aklına Gelmiyor?
Hoca, günün birinde vaaz etmek için caminin kürsüsüne çıkar, fakat bir türlü konuşamaz.
Sağına döner, soluna döner, tavana bakar, cemaate bakar ve;
“Ey cemaat, görüyorsunuz, birkaç dakikadır düşünüyorum ama size söyleyecek bir söz
aklıma gelmedi.” der.
Bu sırada Hoca'nın oğlu da kürsünün önündeymiş, başını kaldırır ve babasına;
“İlahi baba, kürsüden inmek de mi aklına gelmiyor?” deyiverir.

138. O Ters Bir Kadındır
Günün birinde Nasreddin Hoca'nın hanımı ırmak kenarına çamaşır yıkamaya gider. O,
ırmaktan kova ile su alırken, ırmağa düşüverir.
Hanımının ırmağa düştüğünü gören komşuları hemen Hoca'ya koşarlar ve;
“Hocam, hanımın ırmağa düştü." derler.
Haberi alan Hoca, ırmağın akıntısının tersi yöne doğru koşmaya başlayınca komşuları;
“Hocam, yanlış yerde arıyorsun, bak ırmak aşağıya doğru akıyor.” derler.
Bu söz üzerine Nasreddin Hoca;
“O ne ters bir kadındır, siz onu bilmezsiniz, ırmağın tersine gider!" der.

139. Secdeye Kapanmasından Endişe Ediyorum
Hoca günün birinde Konya'ya gelir ve geceyi geçireceği bir hana gider. Hava da soğuk mu
soğuk, rüzgârlı mı rüzgârlı... Gece olunca handan çatır çutur sesler gelmeye başlayınca, Hoca
hancıya seslenir:
“Hancı, hancı! Neredeyse bu han yıkılacak.” deyince hancı hiç oralı olmaz:
"Hocam, bir şey olmaz, sen istirahat et, o duyduğun sesler binanın Allah'ı
zikretmesidir.” der. Bunun üzerine Nasreddin Hoca dayanamaz ve;
"Hancı, hancı! Ben de ondan korkuyorum. Zikrederken birden bire coşup da ya secdeye
kapanırsa..." der.

140. Senin İşine Akıl Sır Ermez
Nasreddin Hoca'nın parası çalınır; o da namazdan sonra parasının bulunması için dua etmeye
başlar. Bu sırada Hoca'nın hemşerilerinden birisi de deniz yolculuğu sırasında fırtınaya
yakalanır, o da;
"Ya Rabbi, eğer bu fırtınadan kurtulur, sağ salim memleketime varırsam, Hoca
Efendi'ye iki yüz akçe vereceğim." diye dua eder.
Hoca'nın hemşerisi fırtınadan kurtulur. Sağ salim Akşehir'e geldiğinde Hoca'ya iki yüz akçeyi
verir. Hoca parayı aldıktan sonra;
"Allah'ım, ben bu parayı nerede kaybettim, sen nerede buldurdun, gerçekten senin işine
akıl sır ermez." der.

141. Tasla Ortaya Getirecektim
Hoca'yı bütün konu komşu sırayla yemeğe çağırır. Bir gün, bir hafta, bir yıl derken günün
birinde Hoca'nın ahbapları;
“Hocam, hep biz sizi yemeğe çağırıyoruz, bir de siz bizi çağırsanız olmaz mı?” deyince
Hoca;
“Komşular, ben fakir bir adamım, kıt kanat geçiniyorum, ben size vereceğim ziyafetin
altından kalkamam.” derse de işin içerisinden çıkamaz ve komşularını davet eder.
Hoca'nın hanımı bu işten rahatsız olur:
“Bu kadar adama ne yedireceksin, ne diye eve çağırdın, evde yiyecek hiçbir şey yok."
deyince Hoca, hanımına;
“Hanım, sen üzülme, sen bana bir boş çorba tası ver, gerisini merak etme.” der.
Misafirler eve geldikten sonra Hoca boş çorba tasını alır ve onların yanına varır:
“Komşularım beni bağışlayın, evde odun yok, yağ yok, pirinç yok... Eğer bunlar olsaydı
çorbayı pişirip gördüğünüz bu tasla ortaya getirecektim” der.

142. Taşları Bağlamışlar, Köpekleri İnsanın Üzerine Salıyorlar
Hoca soğuk bir kış günü, eşeğine binerek başka bir köye doğru yola çıkar. Hoca, köye doğru
yaklaştığında köpekler havlayarak üzerine doğru gelince o da savunmaya geçer ve yerde
bulduğu taşlara sarılır, fakat taşlardan hiçbirisini yerinden kaldıramaz. Çünkü bütün taşlar buz
tutmuştur. Hoca bir dener, iki dener, fakat kurtuluşun olmadığını anlayınca elini açar ve;
“Allah'ım, burası nasıl bir memleket, şaşırdım. Görmüyor musun, taşlarını bağlamışlar
köpeklerini insanın üzerine salıyorlar." der.

143. Utancımdan Buraya Saklandım
Günün birinde Hoca'nın evine hırsız girer. Hoca da korkusundan bir dolabın içerisine saklanır.
Hırsız evi epeyce bir karıştırdıktan sonra çalacak hiçbir şey bulamaz ve son olarak bir de
dolabın içine bakmak amacıyla kapağı açar ki bir de ne görsün; içeride Nasreddin Hoca...
Hırsız şaşkın bir vaziyette;
"Yahu Hocam, sen burada mısın? Burada ne yapıyorsun?” deyince Hoca;
“Arkadaş, kusura bakma evde çalınacak bir eşyam olmadığı için utancımdan buraya
saklandım." deyiverir.

144. Üzerine Bir Altın Daha Vermen Gerekir
Günün birinde Hoca'nın yanına heyecanlı bir adam gelir ve elindeki altını uzatarak;
"Hocam, bu altını bozabilir misin?" der.
Hoca altını eline şöyle bir alır, altını üstünü inceler gibi yapar ve;
“Bu altın eksik olduğu için bozamam.” der.
Bu defa adam;
“Tamam eksik bozuver, benim acilen paraya ihtiyacım var.” deyince Hoca;
"Yavrum altının o kadar eksik ki üzerine bir altın daha vermen gerekir.” deyiverir.

145. Ya Tutarsa?
Hoca, günün birinde kepçeyi, tencereyi alıp Akşehir Gölü'nün kıyısına gider; başlar elindeki
kepçeyle bir şeyler yapmaya. Bu durumu görenler merakla izlemeye başlar. İçlerinden biri
dayanamayıp sorar:
“Hocam, ne yapıyorsun?"
“Görmüyor musunuz? Göle yoğurt mayalıyorum."
“İlahi Hocam, hiç göl maya tutar mı?”
“Arkadaşlar, dostlar, ben de biliyorum tutmayacağını; ancak, ya tutarsa!” deyiverir.

146. Yeni Aldığım Çarıkları Giymemiştim
Hoca, sonbaharda tarlasına tohum attıktan sonra çift sürmeye başlar. Olacak bu ya tarlada
bulunan kocaman bir diken Hoca'nın ayağına batmaz mı!Hoca, zorlanarak da olsa dikeni
çıkardıktan sonra;
“Oh! Hele şükür, iyi ki yeni aldığım çarıkları giymemiştim.” der.

147. Yeter ki Dostlar Alışverişte Görsün
Nasreddin Hoca zaman zaman pazarda yumurta satar. Yumurtayı satar satmasına da, dokuzunu
bir akçeye alırken; onunu aynı fiyata satar.
Herkes bu alışverişten Hoca'nın kazancının ne olduğunu merak eder ve;
"Yahu Hocam, iyi hoş da sen bu alışverişten ne kazanıyorsun, zararına bu iş yapılır mı?"
deyince Hoca;
"Ne yapalım dostlar, ziyan da faydadandır, yeter ki dostlar alışverişte görsünler." der.

148. Yoksa Bizim Ölçü Bozulacak
Günün birinde pazara gidecek olan Hoca'ya hanımı;
"Hoca Efendi, bana pazardan bir elbiselik alıver.” deyince Hoca da;
“Hanım, ne kadar olsun?” diye sorar.
Hanım kollarını açınca, Efendi de kendi kollarını açarak bir uzunluk belirler ve pazara doğru
koşmaya başlar. O sırada Hoca'nın karşısından bir tanıdığı gelince Hoca;
“Arkadaş, çekil yolumdan, yoksa bizim ölçü bozulacak.” deyiverir.
`;

type Joke = {
  title: string;
  text: string;
};

type JokeListProps = {
  onTellJoke: (jokeText: string) => void;
  disabled: boolean;
};

function JokeList({ onTellJoke, disabled }: JokeListProps) {
  const [jokes, setJokes] = useState<Joke[]>([]);

  useEffect(() => {
    const parsedJokes: Joke[] = [];
    const jokeBlocks = JOKES_TEXT.split(/\n\s*\n?(?=\d+\.\s)/).filter(
      block => block.trim() !== '',
    );

    jokeBlocks.forEach(block => {
      const lines = block.trim().split('\n');
      const title = lines[0].replace(/^\d+\.\s*/, '').trim();
      const text = lines.slice(0).join('\n').trim();
      if (title && text) {
        parsedJokes.push({ title, text });
      }
    });
    setJokes(parsedJokes);
  }, []);

  return (
    <div className="joke-list-container">
      <h3>Fıkralar</h3>
      <div className="joke-list">
        {jokes.map((joke, index) => (
          <button
            key={index}
            onClick={() => onTellJoke(joke.text)}
            disabled={disabled}
            title={disabled ? 'Fıkra anlatmak için bağlanın' : joke.title}
          >
            {joke.title}
          </button>
        ))}
      </div>
    </div>
  );
}
// --- End of JokeList component definition ---


export default function KeynoteCompanion() {
  const { client, connected, setConfig } = useLiveAPIContext();

  const userName = useUser(state => state.name);
  const userInfo = useUser(state => state.info);
  const { interactionMode } = useUI();

  const agents = useAgent(state => state.agents);
  const currentAgentId = useAgent(state => state.currentAgentId);
  const currentAgent = agents.find(agent => agent.id === currentAgentId)!;

  const { startConversation } = useHistory();

  // New handler for telling jokes
  const handleTellJoke = (jokeText: string) => {
    if (!connected) return;
    const prompt = `Hadi şu fıkrayı anlatalım! Kendi bilge ve neşeli üslubunla, sanki karşında çocuklar varmış gibi bu fıkrayı anlatır mısın? İşte fıkra:\n\n"${jokeText}"`;
    client.send({ text: prompt }, true);
  };

  // Set the configuration for the Live API
  useEffect(() => {
    const user = { name: userName, info: userInfo };

    const config: LiveConnectConfig = {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: currentAgent.voice },
        },
      },
      systemInstruction: {
        parts: [
          {
            text: createSystemInstructions(currentAgent, user),
          },
        ],
      },
      inputAudioTranscription: {},
      outputAudioTranscription: {},
    };

    setConfig(config);
  }, [setConfig, userName, userInfo, currentAgent]);

  // Initiate the session when the Live API connection is established
  // Instruct the model to send an initial greeting message
  useEffect(() => {
    const beginSession = async () => {
      if (!connected) return;
      startConversation(currentAgent.id);
      client.send(
        {
          text: 'Merhaba! Seninle sohbet etmek için sabırsızlanıyorum. Lütfen kendini tanıt ve bana bilimin ne kadar eğlenceli olabileceğini göster.',
        },
        true
      );
    };
    beginSession();
  }, [client, connected, startConversation, currentAgent.id]);

  return (
    <div className={c('keynote-companion', `mode-${interactionMode}`)}>
      <JokeList onTellJoke={handleTellJoke} disabled={!connected} />
      <div className="agent-face-container">
        <BasicFace />
      </div>
      {interactionMode === InteractionMode.CHAT && <ChatInterface />}
    </div>
  );
}
