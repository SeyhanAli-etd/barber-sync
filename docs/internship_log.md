# Barber-Sync - Staj Günlüğü

Bu doküman, "Barber-Sync" projesi geliştirme sürecinde yapılan günlük çalışmaları ve öğrenimleri kaydetmek amacıyla oluşturulmuştur.

---

### 1. Gün: Proje Planlama ve Dokümantasyon

- **Yapılanlar:** Projenin amacı, hedef kitlesi ve temel özellikleri üzerine beyin fırtınası yapıldı. MVP (Minimum Viable Product) kapsamı belirlendi. Projenin teknik mimarisi ve teknoloji yığını (Node.js, React, PostgreSQL, Docker) kararlaştırıldı.
- **Çıktılar:**
    - `docs/prd/prd-v1.0-mvp.md`: Proje gereksinim dokümanı oluşturuldu.
    - `docs/architecture.md`: Sistem mimarisi dokümanı hazırlandı.
    - `docs/tasks.md`: Geliştirme görevleri listesi oluşturuldu.
- **Öğrenimler:** Bir yazılım projesine başlamadan önce detaylı planlama ve dokümantasyonun önemi anlaşıldı. Teknoloji seçimlerinin gerekçelendirilmesi pratiği yapıldı.

---

### 2. Gün: Geliştirme Ortamının Kurulumu ve İlk Engeller

- **Yapılanlar:** Yerel geliştirme ortamını kurma çalışmalarına başlandı. Windows üzerine doğrudan PostgreSQL veritabanı kurulumu denendi.
- **Karşılaşılan Sorunlar:** PostgreSQL kurulumu sonrası hizmetin (service) başlamaması sorunuyla karşılaşıldı. Windows Olay Görüntüleyicisi (Event Viewer) kullanılarak sorunun kök nedeni araştırıldı. `postgresql.conf` dosyasının bulunamadığı tespit edildi.
- **Öğrenimler:** Yazılım kurulumlarında karşılaşılan sorunların tespiti için sistem loglarının (Olay Görüntüleyicisi gibi) nasıl kullanılacağı öğrenildi.

---

### 3. Gün: Derinlemesine Hata Ayıklama ve Strateji Değişikliği

- **Yapılanlar:** `initdb` komutu ile veritabanı kümesini manuel olarak oluşturma denemeleri yapıldı.
- **Karşılaşılan Sorunlar:**
    1.  `locale name "Turkish_Türkiye.1254" contains non-ASCII characters` hatası alındı. Bu sorun `--locale=C` parametresi ile aşıldı.
    2.  `Permission denied` hatası ile karşılaşıldı. Windows'un `C:\Program Files` klasörü üzerindeki katı güvenlik politikaları nedeniyle klasör oluşturma ve yazma izinleri alınamadı. Klasör sahipliğini değiştirme gibi ileri düzey yetkilendirme denemeleri yapıldı.
- **Alınan Karar:** Windows'un yerel izin sorunlarıyla uğraşmanın sürdürülebilir olmadığına ve geliştirme ortamını standardize etmenin daha verimli olacağına karar verildi.
- **Öğrenimler:** İşletim sistemine özgü sorunların geliştirme sürecini nasıl yavaşlatabileceği ve bu noktada Docker gibi konteynerleştirme teknolojilerinin neden önemli olduğu anlaşıldı.

---

### 4. Gün: Docker ve WSL ile Tanışma

- **Yapılanlar:** Proje kurulum stratejisi tamamen değiştirilerek Docker kullanılmasına karar verildi. Docker'ın Windows üzerinde çalışabilmesi için gerekli olan WSL (Windows Subsystem for Linux) kurulumu yapıldı.
- **Çıktılar:**
    - `docker-compose.yml` ve `.env` dosyaları oluşturularak PostgreSQL veritabanı hizmeti tanımlandı.
    - `docker-compose up -d` komutu ile veritabanı başarıyla bir konteyner içinde çalıştırıldı.
- **Öğrenimler:** Docker ve Docker Compose'un temel konseptleri öğrenildi. Bir uygulamanın ve bağımlılıklarının (veritabanı gibi) izole bir ortamda nasıl çalıştırıldığı deneyimlendi. WSL'in Windows'a Linux yetenekleri kazandırmadaki rolü anlaşıldı.

---

### 5. Gün: Veritabanı Yönetimi ve Şema Oluşturma

- **Yapılanlar:** Veritabanını görsel olarak yönetmek için pgAdmin aracı indirildi ve kuruldu. pgAdmin üzerinden, Docker konteyner'ı içinde çalışan PostgreSQL sunucusuna başarılı bir şekilde bağlantı kuruldu.
- **Çıktılar:** Mimari dokümanında tasarlanan `users`, `barber_profiles` ve `appointments` tabloları, pgAdmin'in "Query Tool" aracı kullanılarak SQL komutları ile oluşturuldu.
- **Öğrenimler:** pgAdmin gibi bir veritabanı istemcisinin nasıl kullanılacağı, sunucuya nasıl bağlanılacağı ve SQL sorgularının nasıl çalıştırılacağı öğrenildi. Veritabanı şemasının (schema) kod ile oluşturulmasının önemi kavrandı.

---

### 6. Gün: Backend Projesinin Başlatılması ve İlk API Endpoint'i
- **Yapılanlar:** Proje ana dizininde `backend` klasörü oluşturuldu. `npm init` ile Node.js projesi başlatıldı. `Express`, `pg`, `dotenv`, `bcryptjs`, `cors` gibi temel bağımlılıklar yüklendi. Mimari dokümanına uygun olarak `config`, `controllers`, `models`, `routes` klasör yapısı oluşturuldu.
- **Çıktılar:**
    - Veritabanı bağlantı havuzu (`config/db.js`) oluşturuldu.
    - Şifre hash'leme ve veritabanına kullanıcı ekleme mantığını içeren ilk controller (`controllers/auth.controller.js`) ve model (`models/user.model.js`) yazıldı.
    - `/api/auth/register` adresine gelen POST isteklerini karşılayan ilk API endpoint'i oluşturuldu.
    - `nodemon` ile geliştirme sunucusu ayağa kaldırıldı ve Thunder Client gibi bir araçla başarılı bir şekilde test edildi.
- **Öğrenimler:** Bir Node.js/Express projesinin nasıl yapılandırıldığı öğrenildi. Katmanlı mimarinin (Model-View-Controller benzeri) pratikte nasıl uygulandığı görüldü. REST API endpoint'i oluşturma, istek (request) ve cevap (response) döngüsü, şifrelerin `bcrypt` ile güvenli bir şekilde hash'lenmesi gibi temel backend konseptleri deneyimlendi.

---

### 7. Gün: Çok Adımlı Backend Hata Ayıklama

- **Yapılanlar:** `npm run dev` komutu ile sunucu başlatılmaya çalışıldı. `Error: Cannot find module '../config/db'` hatası ile karşılaşıldı. Hata mesajı ve "require stack" incelenerek sorunun kök nedeni bulundu.
- **Karşılaşılan Sorunlar:**
    1.  **Modül Yolu Hatası:** `db.js` dosyasının yanlışlıkla `backend/` ana dizinine oluşturulduğu, ancak kodun bu dosyayı `backend/src/config/` dizininde aradığı tespit edildi.
    2.  **`clean exit` Sorunu:** Dosya yolu düzeltildikten sonra sunucunun başlayıp hemen kapandığı gözlemlendi. `package.json` dosyasındaki bağımlılıkların kararsız sürümlere sahip olduğu anlaşıldı.
    3.  **`EADDRINUSE` Hatası:** Önceki denemeden kalan bir "hayalet" işlemin 5000 portunu meşgul ettiği ve sunucunun bu yüzden başlayamadığı tespit edildi.
- **Çıktılar:** VS Code yeniden başlatılarak port temizlendi. `package.json` dosyası düzeltildi. `node_modules` ve `package-lock.json` silinerek `npm install` ile temiz bir kurulum yapıldı. Sunucu başarıyla ve kalıcı olarak başlatıldı.
- **Öğrenimler:** `EADDRINUSE` hatasının ne anlama geldiği ve nasıl çözüleceği öğrenildi. Paket yönetiminin (`package.json`) önemi ve kararlı (stable) sürüm kullanmanın projenin sağlığı üzerindeki etkisi anlaşıldı. Geliştirme sürecinde sorunların katmanlı olabileceği ve adım adım çözülmesi gerektiği deneyimlendi.

---

### 8. Gün: Kullanıcı Girişi (Login) ve Kimlik Doğrulama (JWT)

- **Yapılanlar:** Kullanıcıların sisteme giriş yapabilmesi için gerekli altyapı oluşturuldu. `jsonwebtoken` paketi projeye eklendi.
- **Çıktılar:**
    - `.env` dosyasına `JWT_SECRET` anahtarı eklendi.
    - `user.model.js` dosyasına, kullanıcıyı e-posta adresine göre bulan `findByEmail` fonksiyonu eklendi.
    - `auth.controller.js` dosyasına, gelen e-posta ve şifreyi doğrulayan, `bcrypt.compare` ile şifre karşılaştırması yapan ve başarılı girişte JWT (JSON Web Token) oluşturan `login` fonksiyonu yazıldı.
    - `/api/auth/login` endpoint'i oluşturuldu ve Thunder Client ile test edildi.
- **Öğrenimler:** JWT'nin ne olduğu, nasıl oluşturulduğu (payload, secret, options) ve kimlik doğrulama süreçlerinde nasıl kullanıldığı öğrenildi. Güvenli şifre karşılaştırması için `bcrypt.compare` fonksiyonunun önemi anlaşıldı. API'lerde stateful (session) ve stateless (JWT) kimlik doğrulama arasındaki farklar kavrandı.

---

### 9. Gün: API Testi ve Hata Ayıklama (404, EADDRINUSE, 401)

- **Yapılanlar:** Oluşturulan `/api/auth/login` endpoint'i Thunder Client ile test edildi.
- **Karşılaşılan Sorunlar:**
    1.  **`404 Not Found`:** Test sırasında `404` hatası alındı. Sorunun, API isteği gönderilirken URL'nin veya HTTP metodunun yanlış girilmesinden kaynaklandığı anlaşıldı.
    2.  **`EADDRINUSE`:** Sunucuyu yeniden başlatmaya çalışırken `address already in use` hatası alındı. Portu meşgul eden "hayalet" işlemi sonlandırmak amacıyla VS Code yeniden başlatıldı.
    3.  **`401 Unauthorized`:** Başarılı test ortamı kurulduktan sonra, login denemesinde "Geçersiz e-posta veya şifre" (`401`) hatası alındı.
- **Çıktılar:** Hatalar sistematik olarak çözüldü. `401` hatasının, test edilen kullanıcının veritabanında olmamasından veya şifrenin yanlış girilmesinden kaynaklandığı anlaşıldı. Önce `/register` endpoint'i ile kullanıcı oluşturulup, ardından aynı bilgilerle `/login` endpoint'i test edilerek başarılı bir şekilde JWT alındı.
- **Öğrenimler:** API testlerinde sadece "mutlu yol" (happy path) senaryolarının değil, aynı zamanda hatalı girdi (yanlış şifre, var olmayan kullanıcı) gibi "hata yolu" (failure path) senaryolarının da test edilmesinin önemi kavrandı. `401 Unauthorized` status kodunun kimlik doğrulama hataları için kullanıldığı öğrenildi.

---

### 10. Gün: Korumalı Rotalar ve "Hanging Request" Hata Ayıklaması

- **Yapılanlar:** Sadece giriş yapmış kullanıcıların erişebileceği, korumalı bir API endpoint'i (`/api/users/me`) oluşturuldu.
- **Karşılaşılan Sorunlar:** Korumalı rota Thunder Client ile test edilirken, isteğin "processing..." durumunda takılıp kaldığı ve sunucunun hiçbir zaman cevap dönmediği ("hanging request") gözlemlendi.
- **Çıktılar:** Sorunun, veritabanı sorgusunun (`db.query`) askıda kalmasından kaynaklandığı tespit edildi. Kök nedenin, `dotenv` yapılandırmasının hem `app.js` hem de `db.js` içinde yapılması ve bu durumun veritabanı havuzu (`Pool`) oluşturulurken çevre değişkenlerinin (`process.env`) doğru yüklenememesine yol açması olduğu anlaşıldı. `db.js` dosyasındaki gereksiz `require('dotenv').config()` satırı kaldırılarak yapılandırma `app.js`'te merkezileştirildi. Sorun çözüldü ve istek başarıyla cevap aldı.
- **Öğrenimler:**
    - "Hanging request" (askıda kalan istek) sorununun genellikle I/O (veritabanı, harici API çağrısı vb.) işlemlerinde beklemeden kaynaklandığı öğrenildi.
    - Uygulama yapılandırmasının (özellikle `.env` dosyaları) tek bir merkezi noktadan (uygulamanın giriş dosyası) yönetilmesinin önemi kavrandı.
    - Node.js'te modül yükleme sırasının ve `process.env`'nin ne zaman doldurulduğunun kritik olduğu anlaşıldı.

---

### 11. Gün: Yetkilendirme (Authorization) ve Rol Bazlı Erişim Kontrolü

- **Yapılanlar:** Kimlik doğrulamanın (authentication) bir adım ötesine geçilerek, yetkilendirme (authorization) mekanizması kuruldu. Sadece belirli bir role (örn: `barber`) sahip kullanıcıların erişebileceği özel rotalar oluşturuldu.
- **Çıktılar:**
    - `src/api/middlewares/role.middleware.js` adında, parametre olarak aldığı role göre erişim kontrolü yapan yeni bir middleware oluşturuldu.
    - Bu middleware, `auth.middleware`'den sonra çalışarak `req.user.role` bilgisini kontrol eder.
    - Test amaçlı, sadece `barber` rolündeki kullanıcıların erişebileceği `/api/users/barber-dashboard` adında yeni bir korumalı endpoint oluşturuldu.
    - Thunder Client ile iki senaryo test edildi: 1) `customer` rolündeki bir kullanıcı token'ı ile istek gönderildiğinde `403 Forbidden` hatası alındı. 2) `berber` rolündeki bir kullanıcı token'ı ile istek gönderildiğinde `200 OK` cevabı başarıyla alındı.
- **Öğrenimler:** Kimlik doğrulama (Authentication - "Sen kimsin?") ve yetkilendirmenin (Authorization - "Neler yapabilirsin?") farkı pratik olarak anlaşıldı. Express'te zincirleme (chaining) middleware kullanımının (örn: `[authMiddleware, roleMiddleware]`) nasıl çalıştığı öğrenildi. HTTP `401 Unauthorized` (kimlik doğrulanmamış) ve `403 Forbidden` (kimlik doğrulanmış ama yetkisiz) hata kodları arasındaki anlamsal fark kavrandı.

---

### 12. Gün: Genel Liste Endpoint'i ve Veritabanı İlişkileri (JOIN)

- **Yapılanlar:** Uygulamanın ana özelliklerinden biri olan, tüm berberleri listeleyen halka açık (public) bir API endpoint'i oluşturuldu.
- **Çıktılar:**
    - `user.model.js` dosyasına, `users` ve `barber_profiles` tablolarını `JOIN` ile birleştirerek sadece `barber` rolüne sahip kullanıcıların profil bilgilerini getiren `findAllBarbers` fonksiyonu eklendi.
    - `user.controller.js` dosyasına, bu model fonksiyonunu çağıran `getBarbers` fonksiyonu eklendi.
    - Sadece halka açık berber bilgilerini sunmak için `src/api/routes/barbers.routes.js` adında yeni bir rota dosyası oluşturuldu ve `/api/barbers` endpoint'i tanımlandı.
    - `app.js` dosyası, bu yeni rota dosyasını kullanacak şekilde güncellendi.
- **Öğrenimler:** SQL'de `JOIN` (özellikle `INNER JOIN`) kullanarak ilişkili tablolardan nasıl anlamlı ve birleşik veri setleri oluşturulacağı pratik edildi. API tasarımında halka açık (public) ve özel (private) endpoint'leri mantıksal olarak ayrı rota dosyalarında gruplamanın kod organizasyonunu nasıl iyileştirdiği anlaşıldı.

---

### 13. Gün: Berber Profili Yönetimi (CRUD - Upsert)

- **Yapılanlar:** Berberlerin kendi profesyonel profillerini (dükkan adı, adres, çalışma saatleri vb.) oluşturup güncellemelerini sağlayan API endpoint'i oluşturuldu.
- **Çıktılar:**
    - `barberProfile.model.js` adında, `barber_profiles` tablosu için "upsert" (update or insert) işlemini yapan yeni bir model dosyası oluşturuldu. Bu işlem için PostgreSQL'in `ON CONFLICT ... DO UPDATE` özelliği kullanıldı.
    - `profile.controller.js` ve `profile.routes.js` adında yeni dosyalar oluşturularak profil yönetimi mantığı ayrıştırıldı.
    - Sadece `barber` rolüne sahip kullanıcıların erişebileceği, `PUT /api/profile/me` adında yeni bir korumalı endpoint oluşturuldu.
    - `app.js` dosyası, yeni profil rotasını içerecek şekilde güncellendi.
- **Öğrenimler:** "Upsert" tasarım deseninin ne olduğu ve veritabanında nasıl verimli bir şekilde uygulanacağı öğrenildi. RESTful API tasarımında, mevcut bir kaynağı güncellemek için `PUT` metodunun idempotent (tekrarlanabilir) doğası gereği nasıl kullanıldığı anlaşıldı. Kod organizasyonu için yeni özelliklerin kendi `model`, `controller` ve `route` dosyalarına ayrılmasının önemi pekiştirildi.

... (20. Güne kadar devam eder)

---
### 14. Gün: Berberin Kendi Profilini Getirmesi

- **Yapılanlar:** Bir önceki adımda oluşturulan profil oluşturma/güncelleme (`PUT`) endpoint'ine ek olarak, giriş yapmış bir berberin kendi profil detaylarını getirmesini sağlayan bir `GET` endpoint'i oluşturuldu.
- **Çıktılar:**
    - `barberProfile.model.js` dosyasına, `users` ve `barber_profiles` tablolarını `LEFT JOIN` ile birleştirerek tek bir kullanıcının birleşik profil verisini getiren `findByUserId` fonksiyonu eklendi.
    - `profile.controller.js` dosyasına, `req.user.id`'yi kullanarak modelden profili isteyen `getMyBarberProfile` fonksiyonu eklendi.
    - `profile.routes.js` dosyasına, `GET /api/profile/me` endpoint'i eklendi ve bu endpoint `authMiddleware` ve `roleMiddleware('barber')` ile koruma altına alındı.
    - Test senaryosu olarak "Hasan Bozcan" adında bir berber oluşturuldu, bu berber ile giriş yapılarak token alındı ve yeni endpoint başarıyla test edildi.
- **Öğrenimler:** `LEFT JOIN`'in, birincil tablodaki kayıt mevcutken ilişkili tablodaki kayıt olmasa bile sonuç döndürme yeteneği anlaşıldı. Bu, "profili henüz oluşturulmamış berber" senaryosunu yönetmek için ideal bir yöntemdir. Aynı URL yolunun (`/me`) farklı HTTP metodları (`GET`, `PUT`) ile farklı işlevler için nasıl kullanılabileceği (RESTful prensibi) pratik edildi.

---

### 15. Gün: Halka Açık Detay Sayfası Endpoint'i

- **Yapılanlar:** Müşterilerin, berber listesinden bir berbere tıkladığında o berberin detaylı profilini görebilmesi için halka açık bir API endpoint'i (`GET /api/barbers/:id`) oluşturuldu.
- **Çıktılar:**
    - Kod organizasyonunu iyileştirmek için, berber profillerini listeleyen `findAllBarbers` fonksiyonu `user.model.js`'den `barberProfile.model.js`'e taşındı ve adı `findAll` olarak değiştirildi.
    - `user.controller.js` dosyasına, URL'den gelen `:id` parametresini alıp `barberProfile.model`'deki `findByUserId` fonksiyonunu çağıran `getBarberById` fonksiyonu eklendi.
    - `barbers.routes.js` dosyasına `/:id` yolu eklenerek yeni controller fonksiyonuna bağlandı.
    - Endpoint, herhangi bir token gerektirmeden, bir berberin ID'si ile istek gönderilerek başarıyla test edildi.
- **Öğrenimler:** RESTful API tasarımında, bir koleksiyon (`/barbers`) ve o koleksiyondaki tek bir eleman (`/barbers/:id`) için URL yapısının nasıl oluşturulduğu anlaşıldı. Kodun okunabilirliğini ve sürdürülebilirliğini artırmak için sorumlulukların doğru modellere (refactoring) dağıtılmasının önemi pratik edildi. URL'den dinamik parametrelerin (`req.params`) nasıl okunacağı öğrenildi.

---

### 16. Gün: Dinamik Müsaitlik Hesaplama API'si

- **Yapılanlar:** Bir berberin belirli bir tarihteki müsait randevu saatlerini dinamik olarak hesaplayan ve listeleyen bir API endpoint'i (`GET /api/barbers/:id/availability`) oluşturuldu.
- **Çıktılar:**
    - `appointment.model.js` adında, veritabanından randevu verilerini çeken yeni bir model dosyası oluşturuldu.
    - `user.controller.js` dosyasına, iş mantığını içeren `getBarberAvailability` fonksiyonu eklendi. Bu fonksiyon:
        1.  Berberin çalışma saatlerini ve o günkü mevcut randevularını veritabanından çeker.
        2.  Çalışma saatlerine göre 30 dakikalık aralıklarla tüm potansiyel randevu saatlerini bir liste olarak oluşturur.
        3.  Mevcut randevuları bu listeden çıkarır.
        4.  Sonuç olarak sadece boş olan saatleri bir dizi olarak döndürür.
    - `barbers.routes.js` dosyasına `/:id/availability` yolu eklenerek yeni controller fonksiyonuna bağlandı.
    - Endpoint, bir berber ID'si ve `?date=YYYY-MM-DD` sorgu parametresi ile başarıyla test edildi.
- **Öğrenimler:** Karmaşık iş mantığının API katmanında nasıl uygulanacağı deneyimlendi. JavaScript'in `Date` objesi ile tarih ve saat manipülasyonu (gün adını bulma, saat aralıkları oluşturma) pratiği yapıldı. Performans için `Promise.all` kullanarak birden fazla asenkron veritabanı sorgusunun paralel olarak nasıl çalıştırılacağı öğrenildi. Bir algoritma tasarlama (tüm slotları oluştur, dolu olanları çıkar) ve bunu koda dökme becerisi geliştirildi.

---

### 17. Gün: Güvenli Randevu Oluşturma ve Sunucu Taraflı Doğrulama

- **Yapılanlar:** Müşterilerin randevu oluşturabilmesi için `POST /api/appointments` endpoint'i oluşturuldu. Bu endpoint, sadece randevu oluşturmakla kalmaz, aynı zamanda kritik sunucu taraflı doğrulamalar da yapar.
- **Çıktılar:**
    - Randevu mantığını yönetmek için `appointment.controller.js` ve `appointment.routes.js` adında yeni dosyalar oluşturuldu.
    - `appointment.model.js` dosyasına, yeni randevu ekleyen `create` ve bir zaman diliminin dolu olup olmadığını kontrol eden `isSlotBooked` fonksiyonları eklendi.
    - `createAppointment` controller fonksiyonu, bir randevu oluşturmadan önce şu kontrolleri yapacak şekilde yazıldı:
        1.  İsteğin bir `customer` tarafından yapıldığından emin olma (middleware).
        2.  Seçilen saatin geçmiş bir tarih olup olmadığını kontrol etme.
        3.  **En önemlisi:** `isSlotBooked` fonksiyonu ile, başka bir kullanıcının aynı saati saniyeler önce alması durumunu (race condition) engelleyen bir kontrol yapma. Bu durumda `409 Conflict` hatası döndürülür.
        4.  Seçilen saatin, berberin çalışma saatleri içinde olup olmadığını tekrar kontrol etme.
    - Endpoint, hem başarılı randevu oluşturma hem de aynı saate ikinci kez randevu oluşturmaya çalışarak `409` hatası alma senaryolarıyla test edildi.
- **Öğrenimler:** "Race condition" (yarış durumu) kavramının ne olduğu ve sunucu taraflı doğrulamanın bu tür sorunları önlemedeki kritik rolü anlaşıldı. HTTP `409 Conflict` status kodunun, bir kaynağın mevcut durumuyla çakışan bir istek olduğunda (örn: dolu bir saate randevu alma) nasıl kullanılacağı öğrenildi. Bir özelliğin güvenliğini ve tutarlılığını sağlamak için birden fazla doğrulama katmanının (girdi doğruluğu, iş kuralları, veritabanı durumu) nasıl bir arada kullanıldığı pratik edildi.

---

### 18. Gün: Randevu Yönetimi (Onay/Red)

- **Yapılanlar:** Berberlerin, kendilerine gelen randevu taleplerini onaylamasını veya reddetmesini sağlayan bir API endpoint'i (`PATCH /api/appointments/:id/status`) oluşturuldu.
- **Çıktılar:**
    - `appointment.model.js` dosyasına, bir randevuyu ID'sine göre bulan `findById` ve durumunu güncelleyen `updateStatus` fonksiyonları eklendi.
    - `appointment.controller.js` dosyasına, `updateAppointmentStatus` fonksiyonu eklendi. Bu fonksiyon, gelen isteğin geçerli bir durum (`confirmed` veya `cancelled`) içerdiğini doğrular.
    - **En önemlisi:** Controller içinde, isteği yapan berberin ID'si (`req.user.id`) ile randevu kaydındaki `barber_id`'nin eşleşip eşleşmediğini kontrol eden bir yetkilendirme katmanı daha eklendi. Bu, bir berberin başka bir berberin randevusunu yönetmesini engeller.
    - `appointment.routes.js` dosyasına yeni `PATCH` rotası eklendi ve `roleMiddleware('barber')` ile koruma altına alındı.
    - Endpoint, hem başarılı bir güncelleme senaryosuyla hem de yetkisiz bir berberin denemesiyle (`403 Forbidden` hatası) test edildi.
- **Öğrenimler:** Bir kaynağın kısmi olarak güncellenmesi için `PATCH` HTTP metodunun nasıl kullanıldığı öğrenildi. Güvenlikte, rol bazlı yetkilendirmenin (middleware) yanı sıra, nesne sahipliği (object ownership) kontrolünün de (controller içinde yapılan kontrol) ne kadar önemli olduğu anlaşıldı. Bu, "Kullanıcı X, Kaynak Y üzerinde işlem yapmaya yetkili mi?" sorusunu cevaplar.

---

### 19. Gün: API Sağlamlaştırma ve Girdi Doğrulama

- **Yapılanlar:** Randevu oluşturma (`POST /api/appointments`) endpoint'i test edilirken, geçersiz bir `barber_id` gönderildiğinde "Sunucu Hatası" (500) alındığı tespit edildi.
- **Karşılaşılan Sorunlar:** Sorunun, veritabanının UUID formatında olmayan bir ID'yi reddetmesinden ve bu hatanın genel bir 500 hatası olarak kullanıcıya yansımasından kaynaklandığı anlaşıldı.
- **Çıktılar:** `createAppointment` controller'ına, veritabanına gitmeden önce gelen `barber_id`'nin geçerli bir UUID formatında olup olmadığını kontrol eden bir doğrulama adımı eklendi. Artık geçersiz formatta bir ID gönderildiğinde, sunucu daha anlamlı bir "Geçersiz berber ID formatı." mesajı ile `400 Bad Request` hatası döndürüyor.
- **Öğrenimler:** API'lerde girdi doğrulamanın (input validation) ne kadar kritik olduğu anlaşıldı. Kullanıcıdan gelen veriye asla güvenilmemesi ve veritabanına ulaşmadan önce mümkün olan tüm kontrollerin yapılması gerektiği öğrenildi. Anlamlı ve spesifik hata mesajları döndürmenin, hem frontend geliştiricisi hem de API'yi test eden kişi için hata ayıklama sürecini nasıl kolaylaştırdığı pratik edildi.

---

### 20. Gün: Berber Randevu Paneli API'si

- **Yapılanlar:** Giriş yapmış bir berberin, kendisine gelen tüm randevu taleplerini (geçmiş ve gelecek) listeleyebilmesi için bir API endpoint'i (`GET /api/appointments/my-requests`) oluşturuldu.
- **Çıktılar:**
    - `appointment.model.js` dosyasına, belirli bir berberin tüm randevularını müşteri bilgileriyle (`JOIN` kullanarak) birlikte getiren `findForBarber` fonksiyonu eklendi.
    - `appointment.controller.js` dosyasına, `req.user.id`'yi kullanarak modelden randevuları isteyen `getBarberAppointments` fonksiyonu eklendi.
    - `appointment.routes.js` dosyasına `/my-requests` yolu eklendi ve bu endpoint `authMiddleware` ve `roleMiddleware('berber')` ile koruma altına alındı.
    - Endpoint, bir berber olarak giriş yapılıp token ile test edildi ve o berbere ait randevuların listesi başarıyla alındı.
- **Öğrenimler:** Bir kullanıcının "kendisine ait" verileri listelemesi senaryosunun nasıl yönetileceği öğrenildi. Veritabanı sorgularında `JOIN` kullanarak farklı tablolardan gelen verileri birleştirip zenginleştirilmiş bir sonuç seti oluşturmanın önemi pekiştirildi. API tasarımında, belirli bir kullanıcıya ait kaynakları getirmek için `/me` veya `/my-requests` gibi özel yollar kullanmanın yaygın bir pratik olduğu görüldü.

---

### 21. Gün: API Testi ve Yetkilendirme Hata Ayıklaması

- **Yapılanlar:** Korumalı bir endpoint (`/api/appointments/my-requests`) test edilirken "Yetkilendirme reddedildi" (`401 Unauthorized`) hatası alındı.
- **Karşılaşılan Sorunlar:** Hatanın, isteğin `Authorization` başlığında geçerli bir Bearer Token içermemesinden veya yanlış bir token kullanılmasından kaynaklandığı anlaşıldı.
- **Çıktılar:** Sorunu çözmek için doğru test akışı belgelendi ve uygulandı:
    1.  Önce, endpoint'in gerektirdiği role sahip bir kullanıcıyla (`barber` rolü) `/login` endpoint'ine istek gönderilerek geçerli bir token alındı.
    2.  Bu token kopyalandı.
    3.  Korumalı endpoint'e gönderilen isteğin "Auth" sekmesinde "Bearer Token" seçeneği kullanılarak bu token eklendi.
- **Öğrenimler:** Korumalı API endpoint'lerinin nasıl doğru bir şekilde test edileceği ve `Authorization: Bearer <token>` başlığının kimlik doğrulama sürecindeki rolü pratik edildi. API test araçlarında token yönetiminin ve doğru kullanıcı rolüyle test yapmanın önemi kavrandı.

---

### 22. Gün: Versiyon Kontrolü ve Projeyi GitHub'a Yükleme

- **Yapılanlar:** Projenin tamamı Git ile versiyon kontrolü altına alındı ve merkezi bir depoda saklanması için GitHub'a yüklendi.
- **Çıktılar:**
    - `git init` ile yerel bir Git deposu oluşturuldu.
    - `node_modules` ve `.env` gibi hassas/gereksiz dosyaları hariç tutmak için `.gitignore` dosyası oluşturuldu.
    - GitHub.com üzerinde `barber-sync` adında yeni bir remote repository (uzak depo) oluşturuldu.
    - Proje dosyaları `git add .` ve `git commit -m "Initial commit"` komutlarıyla kaydedildi.
    - `git push -u origin main` komutu ile tüm proje geçmişi GitHub'a başarıyla yüklendi.
- **Öğrenimler:** Git'in temel komutları (`init`, `add`, `commit`, `branch`, `remote`, `push`) öğrenildi. `.gitignore` dosyasının neden önemli olduğu ve hassas bilgilerin (API anahtarları, veritabanı şifreleri) ile gereksiz dosyaların (paket bağımlılıkları) versiyon kontrolüne dahil edilmemesi gerektiği anlaşıldı. Kodun merkezi bir depoda saklanmasının yedekleme, işbirliği ve versiyon takibi açısından faydaları kavrandı.

---

### 23. Gün: Ciro Takibi Özelliği için Veritabanı Altyapısının Kurulması

- **Yapılanlar:** Projenin v3.0 hedefi olan ciro takibi özelliğinin ilk adımı olarak veritabanı şeması güncellendi.
- **Çıktılar:**
    - Berberlerin hizmetlerini (saç, sakal vb.) ve fiyatlarını tanımlayabilmesi için bir `services` tablosu oluşturuldu. Bu tablo, berberin "hizmet menüsü" olarak görev yapacak.
    - Mevcut `appointments` tablosuna, bir randevu tamamlandığında kesilen nihai ücreti (`final_price`), yapılan hizmetin adını (`performed_service_name`) ve tamamlanma zamanını (`completed_at`) saklamak için yeni kolonlar eklendi.
    - Bu değişiklikler, `architecture.md` dokümanındaki veritabanı şemasına da yansıtıldı.
- **Öğrenimler:** Bir özelliğin verisini saklarken, gelecekteki raporlama ihtiyaçlarını (ciro hesaplama gibi) göz önünde bulundurarak şema tasarımının nasıl yapılması gerektiği öğrenildi. Bir işlemin "menü fiyatı" (services tablosu) ile "satış fiyatını" (appointments tablosu) ayrı ayrı saklamanın, indirim ve özel durumlar için esneklik sağladığı anlaşıldı. `ALTER TABLE` komutu ile mevcut bir tablonun yapısının nasıl değiştirileceği pratik edildi.

---

### 24. Gün: Müşteri Randevu Paneli API'si

- **Yapılanlar:** Giriş yapmış bir müşterinin, kendi geçmiş ve gelecek tüm randevularını görebilmesi için bir API endpoint'i (`GET /api/appointments/my-appointments`) oluşturuldu.
- **Çıktılar:**
    - `appointment.model.js` dosyasına, belirli bir müşterinin tüm randevularını, `JOIN` ile berber ve dükkan adı gibi zenginleştirilmiş bilgilerle birlikte getiren `findForCustomer` fonksiyonu eklendi.
    - `appointment.controller.js` dosyasına, isteği işleyen `getCustomerAppointments` fonksiyonu eklendi.
    - `appointment.routes.js` dosyasına `/my-appointments` yolu eklendi ve bu endpoint `authMiddleware` ile `roleMiddleware('customer')` kullanılarak sadece müşterilerin erişimine açıldı.
- **Öğrenimler:** Bir kullanıcının "kendine ait" verileri listelemesi senaryosunun farklı bir rol (bu kez 'customer') için nasıl uygulandığı görüldü. Veritabanı sorgularında `JOIN` kullanarak zenginleştirilmiş veri setleri hazırlamanın, frontend tarafında yapılacak ek API çağrılarını azaltarak performansı ve geliştirici verimliliğini artırdığı pekiştirildi.

---

### 25. Gün: Berber Hizmet Yönetimi API'si (CRUD)

- **Yapılanlar:** Ciro takibi özelliğinin ikinci adımı olarak, berberlerin kendi "hizmet menülerini" yönetebilmeleri için tam bir CRUD (Create, Read, Update, Delete) API'si oluşturuldu.
- **Çıktılar:**
    - `service.model.js`, `service.controller.js` ve `service.routes.js` adında yeni dosyalar oluşturularak hizmet yönetimi mantığı kendi modülüne ayrıldı.
    - `POST /api/services`: Berberin yeni bir hizmet (saç, sakal vb.) eklemesini sağlar.
    - `GET /api/services`: Berberin mevcut tüm aktif hizmetlerini listeler.
    - `PUT /api/services/:id`: Berberin bir hizmetin adını, fiyatını veya süresini güncellemesini sağlar.
    - `DELETE /api/services/:id`: Bir hizmeti siler (veritabanında `is_active=false` olarak işaretleyerek "soft delete" yapılır).
    - Tüm endpoint'ler, sadece `barber` rolüne sahip kullanıcıların erişebileceği ve sadece kendi hizmetleri üzerinde işlem yapabilecekleri şekilde güvenli hale getirildi.
- **Öğrenimler:** Bir kaynak için tam bir CRUD (Oluştur, Oku, Güncelle, Sil) döngüsünün API tarafında nasıl tasarlandığı ve uygulandığı pratik edildi. "Soft delete" (yumuşak silme) yaklaşımının, veri kaybını önlemek ve geçmiş kayıtların bütünlüğünü korumak için neden "hard delete" (kalıcı silme) işlemine tercih edildiği anlaşıldı. Veritabanı `UNIQUE` kısıtlamasından kaynaklanan hataların (örn: aynı isimde ikinci bir hizmet ekleme) controller katmanında nasıl yakalanıp anlamlı bir `409 Conflict` hatasına dönüştürüldüğü öğrenildi.

---

### 26. Gün: Randevu Tamamlama ve Ciroya İşleme API'si

- **Yapılanlar:** Ciro takibi özelliğinin en kritik adımı olan, bir randevunun "tamamlandı" olarak işaretlenip, yapılan hizmet ve ücretin ciroya kaydedilmesini sağlayan API endpoint'i (`POST /api/appointments/:id/complete`) oluşturuldu.
- **Çıktılar:**
    - `appointment.model.js` dosyasına, bir randevunun durumunu `completed` olarak güncelleyen ve `final_price`, `performed_service_name`, `completed_at` alanlarını dolduran yeni bir `complete` fonksiyonu eklendi.
    - `appointment.controller.js` dosyasına, `completeAppointment` adında yeni bir fonksiyon eklendi. Bu fonksiyon:
        1.  İstekle gelen `service_id`'yi doğrular.
        2.  Hem randevunun hem de seçilen hizmetin varlığını ve berbere ait olduğunu kontrol eder.
        3.  Sadece `confirmed` durumundaki randevuların tamamlanmasına izin verir.
        4.  İstekle özel bir `final_price` gelmezse, hizmetin standart fiyatını ciroya işler.
    - `appointment.routes.js` dosyasına, bu yeni controller'ı tetikleyen ve sadece berberlerin erişebileceği `/complete` rotası eklendi.
- **Öğrenimler:** Bir iş akışının (workflow) API'de nasıl modellendiği (örn: randevu onayla -> tamamla) öğrenildi. `Promise.all` kullanarak birden fazla veritabanı okuma işlemini paralel hale getirmenin performansa etkisi görüldü. Bir API endpoint'inin, birden fazla kaynağın (randevu ve hizmet) durumunu doğrulayarak nasıl karmaşık iş kuralları uygulayabileceği pratik edildi. İsteğe bağlı alanlarla (optional request body fields) esnek bir API tasarımının nasıl yapılabileceği anlaşıldı.

---

### 27. Gün: Ciro Raporlama API'si

- **Yapılanlar:** Ciro takibi özelliğinin son backend adımı olarak, giriş yapmış bir berberin günlük ve aylık toplam cirosunu ve işlem sayısını görebileceği bir raporlama API'si (`GET /api/reports/revenue`) oluşturuldu.
- **Çıktılar:**
    - Raporlama mantığını ana modüllerden ayırmak için `report.model.js`, `report.controller.js` ve `report.routes.js` adında yeni dosyalar oluşturuldu.
    - `report.model.js` dosyasına, belirli bir tarih aralığındaki tamamlanmış randevuların `final_price` alanını toplayan (`SUM`) ve işlem sayısını sayan (`COUNT`) bir `getRevenueStats` fonksiyonu eklendi.
    - `report.controller.js` dosyasına, hem içinde bulunulan günün hem de ayın başlangıç ve bitiş tarihlerini hesaplayan bir `getRevenueReport` fonksiyonu yazıldı. Bu fonksiyon, `Promise.all` ile her iki periyot için istatistikleri paralel olarak çeker.
    - `app.js` dosyası, yeni `/api/reports` yolunu kullanacak şekilde güncellendi.
- **Öğrenimler:** Veritabanında `SUM` ve `COUNT` gibi aggregate (toplama) fonksiyonlarının raporlama amaçlı nasıl kullanılacağı öğrenildi. `COALESCE` fonksiyonu ile `SUM`'dan `NULL` dönmesi durumunun nasıl yönetileceği ve 0 olarak gösterileceği pratik edildi. JavaScript'in `Date` objesi ile dinamik tarih aralıkları (ayın başı, günün sonu vb.) oluşturma pratiği yapıldı. Raporlama gibi farklı bir işlevselliğe sahip özelliklerin, kod organizasyonu için ayrı modüller halinde tasarlanmasının önemi anlaşıldı.

---

### 28. Gün: Gerçek Zamanlı Bildirim Sistemi (Socket.IO)

- **Yapılanlar:** Berber bir randevuyu onayladığında veya iptal ettiğinde, müşteriye anında bildirim gitmesini sağlayan altyapı Socket.IO kullanılarak kuruldu.
- **Çıktılar:**
    - `socket.io` paketi projeye eklendi ve `app.js` dosyası, HTTP sunucusu üzerinden Socket.IO bağlantılarını kabul edecek şekilde yeniden yapılandırıldı.
    - `sockets/socketManager.js` adında yeni bir modül oluşturuldu. Bu modül, bağlanan her kullanıcının JWT'sini doğrulayarak kendi `user_id`'si ile adlandırılmış özel bir "odaya" katılmasını sağlar.
    - `appointment.controller.js` içindeki `updateAppointmentStatus` fonksiyonu güncellendi. Artık bir randevunun durumu değiştiğinde, sunucu, randevu sahibinin (`customer_id`) odasına `appointment_update` adında bir olay (event) gönderiyor.
- **Öğrenimler:** Geleneksel HTTP'nin istek-cevap modelinin anlık bildirimler için neden yetersiz olduğu ve "polling" gibi yöntemlerin verimsizliği anlaşıldı. WebSocket teknolojisinin, sunucu ile istemci arasında kalıcı ve çift yönlü bir iletişim kanalı kurarak bu sorunu nasıl çözdüğü öğrenildi. Socket.IO'nun, WebSocket'i basitleştiren, "room" (oda) gibi özelliklerle hedefli mesajlaşmayı kolaylaştıran ve tarayıcı uyumluluğu sağlayan bir kütüphane olduğu kavrandı.

---

### 29. Gün: Frontend Bildirim Sistemi (React Context)

- **Yapılanlar:** Backend'den gelen anlık bildirimleri yakalamak, yönetmek ve kullanıcıya göstermek için frontend tarafında bir altyapı kuruldu.
- **Çıktılar:**
    - `socket.io-client` paketi frontend projesine eklendi.
    - `NotificationContext.jsx` adında yeni bir React Context'i oluşturuldu. Bu context, kullanıcının token'ı ile Socket.IO sunucusuna bağlanır, `appointment_update` olaylarını dinler ve gelen bildirimleri bir state içinde saklar.
    - `useNotifications.js` adında, bu context'e kolay erişim sağlayan bir custom hook oluşturuldu.
    - `NotificationDisplay.jsx` adında, `useNotifications` hook'unu kullanarak gelen bildirimleri ekranda gösteren ve kapatılmasına olanak tanıyan bir UI bileşeni oluşturuldu.
- **Öğrenimler:** React Context API'nin, global state (uygulama genelinde erişilmesi gereken veri) yönetimi için nasıl kullanıldığı pratik edildi. Bir `Provider` bileşeninin, `useEffect` hook'u içinde dış sistemlerle (Socket.IO sunucusu gibi) nasıl bağlantı kurup yönettiği ve "cleanup" fonksiyonu ile bağlantıyı nasıl güvenli bir şekilde sonlandırdığı öğrenildi. Custom hook'ların, karmaşık context mantığını soyutlayarak bileşenlerde daha temiz ve okunabilir bir kullanım sağladığı anlaşıldı.

---

### 30. Gün: Frontend Projesinin Başlatılması (Vite + React)

- **Yapılanlar:** `npm create vite@latest` komutu kullanılarak `frontend` adında yeni bir React projesi oluşturuldu.
- **Çıktılar:**
    - Vite ile temel bir React proje iskeleti (`src`, `public`, `package.json` vb.) oluşturuldu.
    - Gerekli bağımlılıklar `npm install` ile yüklendi.
    - `npm run dev` komutu ile geliştirme sunucusu başlatıldı ve `http://localhost:5173` adresinde çalışan varsayılan React uygulaması görüntülendi.
- **Öğrenimler:** Vite'ın ne olduğu ve geleneksel `create-react-app`'e göre neden daha hızlı bir geliştirme deneyimi sunduğu (native ES module desteği) anlaşıldı. Bir frontend projesinin nasıl başlatıldığı, bağımlılıklarının nasıl yönetildiği ve geliştirme sunucusunun nasıl çalıştırıldığı pratik edildi. HMR (Hot Module Replacement) kavramının, kodda yapılan değişikliklerin tarayıcıya anında yansımasını sağlayarak geliştirme verimliliğini nasıl artırdığı görüldü.

---

### 31. Gün: Frontend Kimlik Doğrulama Akışı (Login)

- **Yapılanlar:** Kullanıcıların frontend üzerinden giriş yapabilmesi ve oturum durumunun uygulama genelinde yönetilebilmesi için tam bir kimlik doğrulama akışı oluşturuldu.
- **Çıktılar:**
    - `services/authService.js`: Backend'in login endpoint'ine istek atan bir servis modülü oluşturuldu.
    - `context/AuthContext.jsx`: Kullanıcı, token ve kimlik doğrulama durumunu (`isAuthenticated`) global olarak yöneten bir React Context'i oluşturuldu. Bu context, `login` ve `logout` fonksiyonları sağlar ve token'ı `localStorage`'da saklar.
    - `hooks/useAuth.js`: `AuthContext`'e kolay erişim sağlayan bir custom hook oluşturuldu.
    - `pages/LoginPage.jsx`: Kullanıcının e-posta ve şifresini girebileceği bir giriş formu bileşeni oluşturuldu.
    - `App.jsx` ana bileşeni, `AuthProvider` ile sarmalandı ve artık kullanıcının giriş durumuna göre ya `LoginPage`'i ya da ana uygulamayı (`AuthenticatedApp`) koşullu olarak render ediyor.
    - `NotificationContext`, token'ı doğrudan `localStorage`'dan okumak yerine `useAuth` hook'unu kullanacak şekilde güncellendi.
- **Öğrenimler:** React'te global state yönetimi için Context API'nin (bu kez kimlik doğrulama için) nasıl güçlü bir araç olduğu pekiştirildi. `localStorage`'ın, tarayıcı kapatılıp açılsa bile oturum bilgilerini saklamak için nasıl kullanıldığı öğrenildi. Koşullu renderlama (conditional rendering) ile bir uygulamanın farklı kullanıcı durumlarına (giriş yapmış / yapmamış) göre farklı arayüzler nasıl gösterebileceği pratik edildi. Frontend'de servis katmanı oluşturarak API çağrılarının bileşen mantığından nasıl soyutlandığı anlaşıldı.

---

### 32. Gün: Frontend Kullanıcı Kayıt Akışı

- **Yapılanlar:** Kullanıcıların frontend arayüzü üzerinden sisteme kayıt olabilmeleri için bir kayıt sayfası ve akışı oluşturuldu.
- **Çıktılar:**
    - `services/authService.js` dosyasına, backend'in `/api/auth/register` endpoint'ine istek gönderen bir `register` fonksiyonu eklendi.
    - `pages/RegisterPage.jsx` adında, kullanıcının ad, e-posta, şifre ve rol (Müşteri/Berber) bilgilerini girebileceği yeni bir sayfa bileşeni oluşturuldu. Başarılı kayıt sonrası kullanıcıya bir bildirim gösterilir ve giriş sayfasına yönlendirilir.
    - `LoginPage.jsx` bileşenine, kullanıcıyı kayıt sayfasına yönlendiren bir "Kayıt ol" linki eklendi.
    - `App.jsx` dosyası, giriş yapmamış kullanıcılar için `LoginPage` ve `RegisterPage` arasında geçişi yöneten bir `UnauthenticatedApp` bileşeni içerecek şekilde yeniden düzenlendi.
- **Öğrenimler:** Bir React uygulamasında, router kullanmadan basit state yönetimi ile farklı formlar veya sayfalar arasında nasıl geçiş yapılabileceği öğrenildi. Kullanıcıya geri bildirim vermenin (başarı/hata mesajları) ve form gönderimi sonrası kullanıcı deneyimini iyileştirmenin (örn: butonu devre dışı bırakma, otomatik yönlendirme) önemi anlaşıldı.

---

### 33. Gün: Frontend-Backend Bağlantı Hatası ("Failed to fetch") ve CORS

- **Yapılanlar:** Frontend'deki kayıt formundan istek gönderilirken "Failed to fetch" hatası alındı ve bu hata ayıklandı.
- **Karşılaşılan Sorunlar:** Tarayıcı geliştirici konsolu incelendiğinde, hatanın "CORS policy" tarafından engellendiği görüldü. Bu, `http://localhost:5173` adresinde çalışan frontend'in, güvenlik nedeniyle `http://localhost:5000` adresindeki backend'e istek göndermesinin tarayıcı tarafından engellenmesi anlamına geliyordu.
- **Çıktılar:** Backend'deki `app.js` dosyasında bulunan `cors` middleware'i, `origin` seçeneği ile sadece frontend adresine (`http://localhost:5173`) izin verecek şekilde daha spesifik olarak yapılandırıldı. Bu değişiklik sonrası frontend'den gönderilen API istekleri başarıyla backend'e ulaştı.
- **Öğrenimler:** "Failed to fetch" hatasının genellikle bir ağ veya CORS sorunu olduğuna işaret ettiği öğrenildi. Tarayıcı geliştirici araçlarındaki "Console" ve "Network" sekmelerinin, bu tür hataların kök nedenini bulmak için ne kadar kritik olduğu anlaşıldı. CORS (Cross-Origin Resource Sharing) politikasının ne olduğu ve modern web uygulamalarında backend'in, hangi "origin"lerden (kaynaklardan) istek kabul edeceğini açıkça belirtmesi gerektiği kavrandı.

---

### 34. Gün: Proje Değişikliklerini GitHub'a Yükleme (Git Workflow)

- **Yapılanlar:** Projede yapılan değişikliklerin ve eklenen yeni özelliklerin (frontend projesi, yeni API'ler vb.) yerel depodan GitHub'daki uzak depoya nasıl yükleneceği öğrenildi.
- **Çıktılar:** Temel Git iş akışı olan "add, commit, push" döngüsü pratik edildi:
    1.  `git add .`: Tüm yeni ve değiştirilmiş dosyaları "sahneye" (staging area) ekler.
    2.  `git commit -m "Açıklayıcı bir mesaj"`: Sahnedeki değişiklikleri, ne yapıldığını anlatan bir mesajla birlikte kalıcı bir versiyon (commit) olarak kaydeder.
    3.  `git push`: Yereldeki tüm yeni commit'leri GitHub'daki `origin main` dalına gönderir.
- **Öğrenimler:** Proje geçmişini temiz ve anlaşılır tutmak için düzenli olarak commit yapmanın ve açıklayıcı commit mesajları yazmanın önemi kavrandı. Bir geliştiricinin günlük iş akışında Git'i nasıl aktif olarak kullanacağı anlaşıldı.

---

### 35. Gün: Frontend Sayfa Yönlendirme (Routing)

- **Yapılanlar:** Uygulama içi sayfa geçişlerini yönetmek için `react-router-dom` kütüphanesi projeye entegre edildi.
- **Çıktılar:**
    - `react-router-dom` paketi frontend projesine eklendi.
    - `main.jsx` dosyası, tüm uygulamayı `<BrowserRouter>` ile sarmalayacak şekilde güncellendi.
    - `App.jsx` dosyası, state tabanlı sayfa geçişi yerine `Routes` ve `Route` bileşenlerini kullanacak şekilde tamamen yeniden yapılandırıldı. `/login`, `/register` gibi halka açık rotalar ve `/*` gibi özel rotalar tanımlandı.
    - `components/PrivateRoute.jsx` adında, sadece giriş yapmış kullanıcıların erişebileceği sayfaları koruyan yeni bir bileşen oluşturuldu.
    - `LoginPage` ve `RegisterPage` bileşenleri, `useNavigate` hook'u ile yönlendirme yapacak ve sayfalar arası geçiş için `<Link>` bileşenini kullanacak şekilde güncellendi.
- **Öğrenimler:** Tek Sayfa Uygulamalarında (SPA) routing'in (yönlendirme) önemi ve `react-router-dom`'un temel bileşenleri (`BrowserRouter`, `Routes`, `Route`, `Link`, `useNavigate`) öğrenildi. Korumalı rotalar (private routes) oluşturarak bir uygulamanın belirli bölümlerine erişimi nasıl kısıtlayacağımız pratik edildi. URL'nin, uygulama state'ini yönetmek için nasıl güçlü bir araç olduğu anlaşıldı.

---

### 36. Gün: Berber Listeleme Sayfası

- **Yapılanlar:** Müşterilerin, sistemdeki tüm berberleri listeleyebileceği bir sayfa oluşturuldu.
- **Çıktılar:**
    - `services/barberService.js` adında, backend'in `/api/barbers` endpoint'ine istek atan yeni bir servis modülü oluşturuldu.
    - `pages/BarbersListPage.jsx` adında, `useEffect` ile berber listesini çeken, yüklenme ve hata durumlarını yöneten yeni bir sayfa bileşeni oluşturuldu.
    - `App.jsx` dosyası, `react-router-dom`'un iç içe rota (nested routes) ve `Outlet` özelliklerini kullanacak şekilde yeniden yapılandırıldı. Giriş yapmış kullanıcılar için ortak bir `AppLayout` (navigasyon menüsü vb. içeren) oluşturuldu.
    - `/barbers` yolu, `AppLayout` içinde `BarbersListPage` bileşenini gösterecek şekilde `Routes`'a eklendi.
- **Öğrenimler:** Bir `useEffect` hook'u içinde asenkron API çağrılarının nasıl yapılacağı ve gelen verinin state'e nasıl yazılacağı pratik edildi. Yüklenme (loading) ve hata (error) durumlarını yöneterek kullanıcıya daha iyi bir deneyim sunmanın önemi anlaşıldı. `react-router-dom`'un `Outlet` bileşeni ile iç içe (nested) ve layout tabanlı rota yapılarının nasıl oluşturulduğu öğrenildi.

---

### 37. Gün: Kullanıcı Profil Sayfası ve Oturum Doğrulama

- **Yapılanlar:** Giriş yapmış kullanıcıların kendi profil bilgilerini görebileceği ve berberlerin kendi profesyonel profillerini yönetebileceği bir profil sayfası oluşturuldu. Ayrıca, sayfa yenilendiğinde oturumun devam etmesini sağlayan bir iyileştirme yapıldı.
- **Çıktılar:**
    - `AuthContext` güncellendi: Artık sayfa yüklendiğinde `localStorage`'daki token'ı kullanarak `/api/users/me` endpoint'inden kullanıcı bilgilerini çekiyor ve `user` state'ini dolduruyor. Bu, sayfa yenilemelerinde oturumun korunmasını sağladı.
    - `services/profileService.js` adında, berberin kendi profilini getiren (`GET /api/profile/me`) ve güncelleyen (`PUT /api/profile/me`) fonksiyonları içeren yeni bir servis modülü oluşturuldu.
    - `pages/ProfilePage.jsx` adında yeni bir sayfa bileşeni oluşturuldu. Bu bileşen, kullanıcının rolüne göre koşullu olarak farklı arayüzler render eder: Müşteri için temel bilgileri gösterir, berber için ise profilini yönetebileceği bir form sunar.
    - `App.jsx` içindeki `/profile` rotası, bu yeni `ProfilePage` bileşenini gösterecek şekilde güncellendi.
- **Öğrenimler:** Bir React uygulamasında kalıcı oturum (persistent session) yönetiminin nasıl yapılacağı öğrenildi. `localStorage`'daki token'ın, uygulama her yüklendiğinde kullanıcı verisini yeniden çekmek için nasıl bir anahtar olarak kullanıldığı anlaşıldı. Bir bileşenin, kullanıcının rolü gibi context'ten gelen verilere göre farklı görünümler veya işlevler sunacak şekilde nasıl tasarlanacağı (koşullu renderlama) pekiştirildi.

---

### 38. Gün: Sunucu Başlatma Hatası (EADDRINUSE)

- **Yapılanlar:** Backend sunucusu başlatılmaya çalışılırken `Error: listen EADDRINUSE: address already in use :::5000` hatası alındı ve bu hata çözüldü.
- **Karşılaşılan Sorunlar:** Hatanın, daha önceki bir oturumdan kalan ve düzgün kapatılmamış bir Node.js işleminin hala `5000` portunu kullanmasından kaynaklandığı anlaşıldı.
- **Çıktılar:** Sorunu çözmek için iki yöntem öğrenildi:
    1.  **Basit Yöntem:** VS Code'u tamamen kapatıp yeniden açarak tüm alt işlemlerin sonlandırılması.
    2.  **Manuel Yöntem:** Windows komut satırında `netstat -ano | findstr :5000` komutu ile portu kullanan işlemin PID'sinin (Process ID) bulunması ve `taskkill /PID <PID> /F` komutu ile bu işlemin zorla sonlandırılması.
- **Öğrenimler:** `EADDRINUSE` ("Address in use") hatasının ne anlama geldiği ve bir portun aynı anda sadece tek bir işlem tarafından kullanılabileceği anlaşıldı. Geliştirme ortamında karşılaşılan "hayalet" veya "zombi" işlemlerin nasıl tespit edilip sonlandırılacağı öğrenildi.

---

### 39. Gün: Geliştirme Ortamı Yönetimi ("Bu siteye ulaşılamıyor")

- **Yapılanlar:** Frontend'e erişmeye çalışırken "Bu siteye ulaşılamıyor" hatası alındı ve hata ayıklandı.
- **Karşılaşılan Sorunlar:** Hatanın, frontend geliştirme sunucusunun (`vite`) çalışmamasından kaynaklandığı anlaşıldı. Projenin hem backend hem de frontend olmak üzere iki ayrı sunucuya sahip olduğu ve ikisinin de aynı anda çalışması gerektiği pekiştirildi.
- **Çıktılar:** Doğru çalışma akışı uygulandı:
    1.  Bir terminalde `backend` klasörüne gidilip `npm run dev` ile API sunucusu başlatıldı.
    2.  Ayrı bir ikinci terminalde `frontend` klasörüne gidilip `npm run dev` ile Vite sunucusu başlatıldı.
- **Öğrenimler:** Modern bir full-stack uygulamanın genellikle birden fazla bağımsız süreçten (process) oluştuğu (API sunucusu, frontend geliştirme sunucusu vb.) ve hepsinin geliştirme sırasında aktif olması gerektiği anlaşıldı. VS Code'da birden fazla terminali yönetme pratiği yapıldı.

---

### 39. Gün: Geliştirme Ortamı Yönetimi ("Bu siteye ulaşılamıyor")

- **Yapılanlar:** Frontend'e erişmeye çalışırken "Bu siteye ulaşılamıyor" hatası alındı ve hata ayıklandı.
- **Karşılaşılan Sorunlar:** Hatanın, frontend geliştirme sunucusunun (`vite`) çalışmamasından kaynaklandığı anlaşıldı. Projenin hem backend hem de frontend olmak üzere iki ayrı sunucuya sahip olduğu ve ikisinin de aynı anda çalışması gerektiği pekiştirildi.
- **Çıktılar:** Doğru çalışma akışı uygulandı:
    1.  Bir terminalde `backend` klasörüne gidilip `npm run dev` ile API sunucusu başlatıldı.
    2.  Ayrı bir ikinci terminalde `frontend` klasörüne gidilip `npm run dev` ile Vite sunucusu başlatıldı.
- **Öğrenimler:** Modern bir full-stack uygulamanın genellikle birden fazla bağımsız süreçten (process) oluştuğu (API sunucusu, frontend geliştirme sunucusu vb.) ve hepsinin geliştirme sırasında aktif olması gerektiği anlaşıldı. VS Code'da birden fazla terminali yönetme pratiği yapıldı.

---

### 40. Gün: Berber Detay Sayfası ve Randevu Alma

- **Yapılanlar:** Kullanıcıların berber listesinden bir berberi seçip, profil detaylarını görebileceği ve müsait saatlerinden birine randevu alabileceği tam bir akış oluşturuldu.
- **Çıktılar:**
    - `services/barberService.js` dosyasına, tek bir berberin detaylarını (`getBarberById`) ve belirli bir tarihteki müsaitlik durumunu (`getBarberAvailability`) getiren yeni fonksiyonlar eklendi.
    - `services/appointmentService.js` adında, randevu oluşturma isteğini (`POST /api/appointments`) gönderen yeni bir servis modülü oluşturuldu.
    - `components/AppointmentCalendar.jsx` adında, bir tarih seçici ve o tarihteki müsait saatleri listeleyen, tıklandığında randevu oluşturan yeniden kullanılabilir bir takvim bileşeni oluşturuldu.
    - `pages/BarberDetailPage.jsx` adında, URL'den berber ID'sini alıp berberin profil bilgilerini ve `AppointmentCalendar` bileşenini gösteren yeni bir sayfa oluşturuldu.
    - `App.jsx`'teki rota yapısı, `/barbers/:id` dinamik yolunu içerecek şekilde güncellendi.
- **Öğrenimler:** `react-router-dom`'un `useParams` hook'u ile dinamik URL segmentlerinden (örn: `:id`) nasıl veri okunacağı öğrenildi. Bir bileşenin (takvim) başka bir bileşen (detay sayfası) içinde nasıl kullanıldığı ve aralarında `prop`'lar aracılığıyla nasıl veri aktarıldığı pratik edildi. Bir kullanıcı etkileşimiyle (saat seçimi) tetiklenen tam bir API akışının (müsaitlik kontrolü -> randevu oluşturma -> arayüzü güncelleme) frontend'de nasıl yönetileceği deneyimlendi.

---

### 41. Gün: Berber Randevu Yönetim Paneli

- **Yapılanlar:** Berberlerin, kendilerine gelen randevu taleplerini listeleyebileceği, onaylayabileceği ve iptal edebileceği bir yönetim paneli oluşturuldu.
- **Çıktılar:**
    - `appointmentService.js` dosyasına, berberin randevularını getiren (`getMyBarberAppointments`) ve bir randevunun durumunu güncelleyen (`updateAppointmentStatus`) yeni fonksiyonlar eklendi.
    - `pages/BarberDashboardPage.jsx` adında, berberin tüm randevularını listeleyen ve "Onayla"/"İptal Et" butonları ile durum güncellemesi yapabilen yeni bir sayfa bileşeni oluşturuldu.
    - `components/BarberRoute.jsx` adında, bir rotanın sadece `barber` rolüne sahip kullanıcılar tarafından erişilmesini sağlayan yeni bir korumalı rota bileşeni oluşturuldu.
    - `App.jsx` dosyası, `/dashboard` yolunu `BarberDashboardPage`'e yönlendirecek ve bu rotayı `BarberRoute` ile koruyacak şekilde güncellendi. Ayrıca, navigasyon menüsünde "Randevu Paneli" linki sadece berberler için görünür hale getirildi.
- **Öğrenimler:** Frontend'de rol bazlı yetkilendirmenin nasıl uygulanacağı ve belirli arayüz elemanlarının veya sayfaların kullanıcının rolüne göre nasıl koşullu olarak render edileceği öğrenildi. Bir listedeki bir öğe güncellendiğinde, tüm listeyi yeniden çekmek yerine sadece o öğeyi lokal state'te güncelleyerek daha iyi bir kullanıcı deneyimi ve performans sağlanabileceği pratik edildi.

---

### 42. Gün: Berber Hizmet Yönetimi Arayüzü (CRUD)

- **Yapılanlar:** Berberlerin, ciro takibi için gerekli olan kendi hizmetlerini (saç, sakal vb.) ve fiyatlarını ekleyip, düzenleyip, silebileceği bir yönetim arayüzü oluşturuldu.
- **Çıktılar:**
    - `services/serviceService.js` adında, hizmetler için CRUD (Create, Read, Update, Delete) operasyonlarını yürüten yeni bir servis modülü oluşturuldu.
    - `pages/ServiceManagementPage.jsx` adında, berberin hizmetlerini listeleyen, yeni hizmet ekleme/düzenleme formu içeren ve silme işlemlerini gerçekleştiren yeni bir sayfa bileşeni oluşturuldu.
    - `App.jsx` dosyası, `/manage-services` yolunu bu yeni sayfaya yönlendirecek ve `BarberRoute` ile koruyacak şekilde güncellendi.
    - Navigasyon menüsüne, sadece berberler için görünür olan "Hizmet Yönetimi" linki eklendi.
- **Öğrenimler:** Bir kaynak için tam bir CRUD arayüzünün React'te nasıl oluşturulacağı pratik edildi. Tek bir form bileşeninin hem "oluşturma" hem de "düzenleme" modları için nasıl yeniden kullanılabilir hale getirileceği öğrenildi. Kullanıcıya anlık geri bildirim sağlamak için bir API isteği sonrası tüm listeyi yeniden çekmenin (refetch) nasıl bir strateji olduğu görüldü.

---

### 43. Gün: Müşteri "Randevularım" Sayfası

- **Yapılanlar:** Müşterilerin, geçmiş ve gelecek tüm randevularını listeleyebileceği bir "Randevularım" sayfası oluşturuldu.
- **Çıktılar:**
    - `appointmentService.js` dosyasına, müşterinin randevularını getiren (`getMyCustomerAppointments`) yeni bir fonksiyon eklendi.
    - `pages/CustomerAppointmentsPage.jsx` adında, müşterinin randevularını listeleyen yeni bir sayfa bileşeni oluşturuldu.
    - `App.jsx` dosyası, `/my-appointments` yolunu bu yeni sayfaya yönlendirecek şekilde güncellendi.
    - Navigasyon menüsüne, tüm giriş yapmış kullanıcılar için görünür olan "Randevularım" linki eklendi.
- **Öğrenimler:** Farklı kullanıcı rolleri için benzer ama farklı veri setleri sunan API endpoint'lerinin (berberin randevuları vs. müşterinin randevuları) frontend'de nasıl yönetileceği görüldü. Bir özelliğin tamamlanması için servis, bileşen ve rota katmanlarının bir arada nasıl çalıştığı pekiştirildi.

---

### 44. Gün: Randevu Tamamlama ve Ciroya İşleme Arayüzü

- **Yapılanlar:** Berberin, onaylanmış bir randevuyu "tamamlandı" olarak işaretleyip, yapılan hizmeti ve ücreti seçerek ciroya işlemesini sağlayan bir arayüz oluşturuldu.
- **Çıktılar:**
    - `appointmentService.js` dosyasına, bir randevuyu tamamlama isteği gönderen `completeAppointment` fonksiyonu eklendi.
    - `components/CompleteAppointmentModal.jsx` adında, berberin hizmetlerini listeleyen ve nihai fiyatı girmesine olanak tanıyan yeni bir modal bileşeni oluşturuldu.
    - `BarberDashboardPage.jsx` güncellendi: Artık `confirmed` durumundaki randevular için bir "Tamamla" butonu gösteriyor. Bu butona tıklandığında, hizmet seçimi için `CompleteAppointmentModal` açılıyor.
- **Öğrenimler:** Karmaşık bir kullanıcı aksiyonu için modal (dialog) pencerelerinin nasıl kullanılacağı öğrenildi. Bir ana bileşenin (sayfa), bir alt bileşene (modal) veri (`appointment` bilgisi) ve callback fonksiyonları (`onClose`, `onComplete`) geçirerek nasıl iletişim kurduğu pratik edildi. Bir form gönderimi sonrası, sayfanın tamamını yenilemeden sadece ilgili veriyi güncelleyerek akıcı bir kullanıcı deneyimi sağlamanın önemi anlaşıldı.

---

### 45. Gün: Ciro Raporları Dashboard'u

- **Yapılanlar:** Berberlerin, günlük ve aylık cirolarını görebilecekleri bir raporlama ekranı oluşturuldu.
- **Çıktılar:**
    - `services/reportService.js` adında, backend'in `/api/reports/revenue` endpoint'ine istek atan yeni bir servis modülü oluşturuldu.
    - `pages/RevenueDashboardPage.jsx` adında, ciro verilerini API'den çeken ve `StatCard` gibi alt bileşenler kullanarak görsel olarak sunan yeni bir sayfa bileşeni oluşturuldu.
    - `App.jsx` dosyası, `/reports` yolunu bu yeni sayfaya yönlendirecek ve `BarberRoute` ile koruyacak şekilde güncellendi.
    - Navigasyon menüsüne, sadece berberler için görünür olan "Ciro Raporları" linki eklendi.
- **Öğrenimler:** API'den gelen veriyi alıp, anlamlı ve görsel olarak çekici bir şekilde kullanıcıya sunma pratiği yapıldı. Karmaşık bir sayfanın, daha küçük ve yeniden kullanılabilir bileşenlere (örn: `StatCard`) bölünerek nasıl daha yönetilebilir hale getirileceği anlaşıldı.

---

### 46. Gün: Uçtan Uca Test ve Eksik Özelliğin Tespiti

- **Yapılanlar:** Müşterinin randevu alması ve berberin onaylaması senaryosu uçtan uca test edildi. Test sırasında, müşterinin berberin müsaitlik durumunu kontrol etmeye çalıştığında hata aldığı tespit edildi.
- **Karşılaşılan Sorunlar:** Sorunun kök nedeninin, berberin profil sayfasında çalışma saatlerini girebileceği bir alan olmaması olduğu anlaşıldı. Bu eksiklik, backend'in müsaitlik hesaplaması yapmasını engelliyordu.
- **Çıktılar:** `ProfilePage.jsx` bileşeni, berberlerin haftanın her günü için çalışma saatlerini ("09:00-19:00" veya "closed" formatında) girebilecekleri input alanları içerecek şekilde güncellendi. Bu sayede randevu alma akışındaki eksik halka tamamlandı.
- **Öğrenimler:** Uçtan uca testin, bir özelliğin eksik veya hatalı kısımlarını ortaya çıkarmadaki kritik önemi anlaşıldı. Bir özelliğin çalışması için gerekli olan tüm veri giriş noktalarının kullanıcıya sunulması gerektiği pekiştirildi. React'te dinamik olarak oluşturulan form elemanlarının state'inin nasıl yönetileceği pratik edildi.

---

### 47. Gün: Backend Mimarisi İyileştirme (Refactoring)

- **Yapılanlar:** Müşteri olarak berber detay sayfasına girerken alınan "Berber profili getirilemedi" hatası üzerine backend kod yapısı incelendi ve yeniden düzenlendi.
- **Karşılaşılan Sorunlar:** Berberlerle ilgili halka açık API mantığının (`tümünü listele`, `tekini getir`, `müsaitliğini hesapla`) farklı controller dosyalarına dağılmış olduğu ve bu durumun hata takibini zorlaştırdığı tespit edildi.
- **Çıktılar:**
    - `controllers/barber.controller.js` adında yeni bir controller dosyası oluşturuldu.
    - Berberlerle ilgili tüm halka açık mantık (`getAllBarbers`, `getBarberById`, `getBarberAvailability`) bu yeni dosyada merkezileştirildi.
    - `api/routes/barbers.routes.js` dosyası, artık sadece bu yeni ve merkezi controller'ı kullanacak şekilde güncellendi.
    - Bu yeniden düzenleme sonrası, berber detay sayfasındaki hata giderildi.
- **Öğrenimler:** "Refactoring" (yeniden düzenleme) kavramının ne olduğu ve kod tekrarını azaltıp, okunabilirliği ve sürdürülebilirliği artırmadaki önemi anlaşıldı. Birbiriyle ilişkili iş mantıklarını tek bir sorumlu controller altında toplamanın (Single Responsibility Principle) kod organizasyonunu nasıl iyileştirdiği görüldü.

---

### 48. Gün: Refactoring Sonrası Hata Ayıklama (Module Not Found)

- **Yapılanlar:** Backend sunucusu başlatılırken alınan `Error: Cannot find module '../../controllers/user.controller'` hatası çözüldü.
- **Karşılaşılan Sorunlar:** 47. gündeki yeniden düzenleme (refactoring) sırasında, berberlerle ilgili fonksiyonların `barber.controller.js`'e taşınmasının ardından `user.controller.js` dosyasının silindiği, ancak bu dosyanın hala `/api/users/me` rotası tarafından kullanıldığı anlaşıldı.
- **Çıktılar:** `backend/src/controllers/user.controller.js` dosyası, sadece `getMe` fonksiyonunu içerecek şekilde yeniden oluşturuldu. Bu, `user.routes.js` dosyasının bağımlılığını karşılayarak sunucunun başarıyla başlamasını sağladı.
- **Öğrenimler:** Kod yeniden düzenlemesi (refactoring) yaparken, eski kod parçalarını silmeden önce projenin başka hangi bölümlerinin bu parçalara bağımlı olduğunu kontrol etmenin (dependency check) ne kadar önemli olduğu anlaşıldı. `MODULE_NOT_FOUND` hatasının, genellikle bir dosya yolu yanlışlığı veya silinmiş/taşınmış bir dosyadan kaynaklandığı pekiştirildi.

---

### 49. Gün: Refactoring Sonrası Hata Ayıklama (Undefined Middleware)

- **Yapılanlar:** Backend sunucusu başlatılırken alınan `TypeError: Router.use() requires a middleware function but got a undefined` hatası çözüldü.
- **Karşılaşılan Sorunlar:** Hatanın, `user.routes.js` dosyasının, `user.controller.js` içinde artık var olmayan `getProfile` fonksiyonunu çağırmaya çalışmasından kaynaklandığı tespit edildi. Fonksiyonun doğru adı `getMe` idi.
- **Çıktılar:** `user.routes.js` dosyası, `userController.getProfile` çağrısını `userController.getMe` olarak düzeltecek şekilde güncellendi. Ayrıca, artık kullanılmayan eski bir test rotası (`/barber-dashboard`) da kod temizliği amacıyla kaldırıldı.
- **Öğrenimler:** Kodun farklı parçaları arasındaki (rota ve controller gibi) isim ve imza tutarlılığının ne kadar önemli olduğu anlaşıldı. Hata mesajlarını dikkatlice okumanın, sorunun kaynağını (`undefined` bir fonksiyon çağrısı) hızlıca bulmayı nasıl sağladığı pratik edildi.

---

### 50. Gün: Ana Sayfa (Landing Page) Tasarımı

- **Yapılanlar:** Giriş yapmış kullanıcıların karşılandığı ana sayfaya basit ve işlevsel bir tasarım yapıldı.
- **Çıktılar:**
    - `pages/HomePage.jsx` adında, kullanıcıyı ismiyle karşılayan, uygulamanın amacını açıklayan ve önemli sayfalara yönlendiren (Berberleri Görüntüle, Randevularım) butonlar içeren yeni bir sayfa bileşeni oluşturuldu.
    - `App.jsx` dosyasındaki ana sayfa rotası (`/`), bu yeni `HomePage` bileşenini gösterecek şekilde güncellendi.
- **Öğrenimler:** Kullanıcıyı karşılayan bir ana sayfanın, uygulama içindeki temel aksiyonlara hızlı erişim sağlayarak kullanıcı deneyimini nasıl iyileştirdiği görüldü. React'te temel sayfa düzeni ve stilizasyon için inline CSS'in nasıl kullanılabileceği pratik edildi.

---

### 52. Gün: 3D Ana Sayfa Hata Ayıklaması (Module Not Found)

- **Yapılanlar:** 3D ana sayfa oluşturulurken alınan `Failed to resolve import "../components/3d/BarberChair"` hatası çözüldü.
- **Karşılaşılan Sorunlar:** Hatanın, `BarberChair.jsx` bileşeninin yanlışlıkla `pages` klasörü içine oluşturulmasından kaynaklandığı tespit edildi. `HomePage.jsx`, bu bileşeni `components/3d/` klasöründe arıyordu.
- **Çıktılar:** `frontend/src/components/3d` klasörü oluşturuldu ve `BarberChair.jsx` dosyası bu doğru konuma taşındı. Bu işlem, Vite'ın modülü doğru bir şekilde bulmasını sağlayarak hatayı giderdi.
- **Öğrenimler:** React projelerinde dosya ve klasör organizasyonunun ne kadar önemli olduğu ve `import` yollarının dosya konumlarıyla tam olarak eşleşmesi gerektiği anlaşıldı. `MODULE_NOT_FOUND` veya `Failed to resolve import` gibi hataların genellikle dosya yolu yanlışlıklarından kaynaklandığı pekiştirildi.

---

### 54. Gün: Arayüz İyileştirmeleri (Responsive Navigasyon ve Video Arka Planı)

- **Yapılanlar:**
    - Halka açık ana sayfada (`PublicLandingPage`) büyük ekranlarda navigasyon menüsündeki butonların kaybolması sorunu çözüldü.
    - Giriş yapmış kullanıcıların gördüğü 3D ana sayfaya (`HomePage`) arka plan video desteği eklendi.
- **Karşılaşılan Sorunlar:**
    - Navigasyon barının `position: absolute` ve `width: 100%` özelliklerinin, üst container'da `position: relative` olmamasından dolayı sayfanın genel yerleşiminden daha geniş bir alana yayılması ve elemanların kaybolmasına neden olduğu tespit edildi.
- **Çıktılar:**
    - `PublicLandingPage.css` dosyasına, ana container'a `position: relative` eklenerek navbar'ın doğru şekilde kapsanması sağlandı.
    - `HomePage.jsx` dosyasına, sayfa arka planında oynatılacak bir `<video>` elementi eklendi.
    - `HomePage.css` dosyası, videoyu ekranı kaplayacak şekilde sabitlemek, üzerine okunabilirliği artırmak için karartma efekti eklemek ve diğer katmanların (`canvas`, metin) `z-index` değerlerini doğru şekilde ayarlamak için güncellendi.
- **Öğrenimler:** CSS'te `position: absolute` özelliğinin, en yakın `position: relative` (veya `absolute`, `fixed`) atasına göre konumlandığı pekiştirildi. `z-index` ile katman yönetiminin, özellikle video, canvas ve metin gibi birden çok üst üste binen elementle çalışırken ne kadar önemli olduğu anlaşıldı. `object-fit: cover` ve `transform: translate(-50%, -50%)` gibi modern CSS teknikleriyle tam ekran arka plan videolarının nasıl oluşturulacağı öğrenildi.

---

### 55. Gün: Profesyonel Animasyon ve Etkileşim İyileştirmeleri

- **Yapılanlar:**
    - 3D ana sayfadaki berber koltuğuna, fare ile üzerine gelindiğinde tepki veren bir animasyon eklendi.
    - Sayfa kaydırıldıkça beliren metinlerin animasyonu daha akıcı ve profesyonel hale getirildi.
- **Çıktılar:**
    - `HomePage.jsx` bileşeni, `useState` ve `onPointerOver`/`onPointerOut` olay yöneticileri kullanılarak güncellendi. Artık fare koltuğun üzerine geldiğinde, `gsap` ile koltuğun ölçeği pürüzsüz bir şekilde büyüyor ve imleç "pointer" şeklini alıyor.
    - Metin animasyonları, `gsap`'in `stagger` (kademeli) özelliğini kullanacak şekilde yeniden yazıldı. Bu sayede başlık ve paragraflar daha estetik bir şekilde art arda beliriyor.
    - GSAP `ScrollTrigger`'ın tetikleyici (`trigger`) elementinin, animasyonun doğru çalışması için kaydırılabilir ana container olarak ayarlanması sağlandı.
- **Öğrenimler:** React ve Three.js (react-three-fiber) ortamında kullanıcı etkileşimlerine (fare olayları gibi) nasıl tepki verileceği öğrenildi. GSAP animasyon kütüphanesinin, 3D nesnelerin özelliklerini (örn: `scale`) zamanla pürüzsüzce değiştirmek için nasıl kullanıldığı pratik edildi. `stagger` gibi ileri düzey animasyon tekniklerinin, kullanıcı arayüzüne nasıl daha profesyonel bir his kattığı anlaşıldı.

---

### 56. Gün: Mimari Değişiklik (3D Ana Sayfanın Halka Açık Hale Getirilmesi)

- **Yapılanlar:** Kullanıcı deneyimini iyileştirmek amacıyla önemli bir mimari değişiklik yapıldı. Daha önce sadece giriş yapmış kullanıcıların gördüğü 3D animasyonlu ana sayfa, artık tüm ziyaretçileri karşılayan halka açık ana sayfa (`/`) olarak yeniden konumlandırıldı. Giriş yapmış kullanıcılar ise artık doğrudan işlevsel bir sayfaya (`/booking`) yönlendiriliyor.
- **Çıktılar:**
    - `PublicLandingPage.jsx` bileşeni, `HomePage.jsx`'in tüm 3D sahne, video ve kaydırma animasyonu mantığını içerecek şekilde tamamen yeniden yapılandırıldı. Eski statik "hero" bölümü, bu yeni dinamik ve etkileşimli sahne ile değiştirildi.
    - `App.jsx` dosyasındaki rota yapısı güncellendi: Ana rota (`/`) artık bu yeni ve zenginleştirilmiş `PublicLandingPage`'i gösteriyor.
    - `PrivateRoute.jsx` güncellendi: Artık kimliği doğrulanmamış kullanıcıları `/login` sayfasına yönlendiriyor.
    - `AppLayout.jsx` içindeki, giriş yapmış kullanıcıların ana sayfasını (`/`) diğer sayfalardan farklı kılan koşullu stil mantığı kaldırıldı, çünkü bu sayfa artık `AppLayout` dışında.
- **Öğrenimler:** Bir uygulamanın "vitrin" (halka açık sayfa) ve "uygulama içi" (giriş yapılmış panel) deneyimlerinin nasıl ayrıştırılacağı ve kullanıcı yolculuğuna göre nasıl yeniden düzenleneceği anlaşıldı. React Router'da rota yapısını değiştirerek ve `Navigate` bileşenini kullanarak kullanıcıları oturum durumlarına ve hedeflerine göre doğru sayfalara yönlendirmenin önemi pekiştirildi. Büyük bir bileşenin (HomePage) mantığının ve JSX'inin başka bir bileşene (PublicLandingPage) nasıl entegre edileceği (refactoring) pratik edildi.

---

### 57. Gün: Kritik Hata Ayıklama (Yönlendirme ve Render Sorunları)

- **Yapılanlar:** Bir önceki mimari değişiklik sonrası ortaya çıkan iki kritik hata çözüldü: 1) Ana sayfada 3D modelin "siyah bir kare" olarak görünmesi. 2) Kullanıcı giriş yaptıktan sonra uygulama paneli yerine tekrar ana sayfaya yönlendirilmesi.
- **Karşılaşılan Sorunlar:**
    - "Siyah kare" sorununun, 3D modelin yerini tutan geçici objenin (placeholder) materyalinin çok karanlık olmasından ve yeterince aydınlatılamamasından kaynaklandığı tespit edildi.
    - Yönlendirme sorununun, `LoginPage` bileşeninin başarılı giriş sonrası kullanıcıyı yanlışlıkla ana sayfaya (`/`) yönlendirmesinden kaynaklandığı anlaşıldı.
- **Çıktılar:**
    - `BarberChair.jsx` dosyasındaki placeholder'ın materyali, hata ayıklamayı kolaylaştırmak için parlak ve tel kafes bir görünüme kavuşturuldu.
    - `LoginPage.jsx` dosyası, başarılı giriş sonrası kullanıcıyı doğru bir şekilde uygulama paneline (`/booking`) yönlendirecek şekilde düzeltildi/oluşturuldu.
    - Artık tamamen gereksiz olan `HomePage.jsx` dosyası projeden silinerek kod temizliği yapıldı.
    - `App.jsx` içindeki ana logo linki, giriş yapmış kullanıcıları doğru panele yönlendirecek şekilde güncellendi.
- **Öğrenimler:** Büyük refactoring işlemleri sonrası uçtan uca test yapmanın ne kadar kritik olduğu anlaşıldı. Bir bileşenin görsel olarak beklenmedik şekilde render edilmesinin (siyah kare) aydınlatma, materyal veya ölçekleme sorunlarından kaynaklanabileceği öğrenildi. Kullanıcı kimlik doğrulama akışlarında, başarılı bir işlem sonrası yönlendirmenin (navigation) kullanıcı deneyiminin temel bir parçası olduğu ve doğru hedefe yapılması gerektiği pekiştirildi.

---

### 58. Gün: Kritik Hata Ayıklama (Uygulama Çökmesi - "Siyah Ekran")

- **Yapılanlar:** Uygulama başlatıldığında karşılaşılan "siyah ekran" sorunu çözüldü.
- **Karşılaşılan Sorunlar:** Sorunun, bir önceki mimari değişiklik sırasında `App.jsx` dosyasından `PublicLandingPage` bileşeninin import satırının yanlışlıkla silinmesinden veya eklenmemesinden kaynaklandığı tespit edildi. Bu durum, React'in ana rotada (`/`) hangi bileşeni render edeceğini bilememesine ve uygulamanın tamamen çökmesine neden oluyordu.
- **Çıktılar:** `App.jsx` dosyasına, `PublicLandingPage` bileşenini import eden `import PublicLandingPage from './pages/PublicLandingPage';` satırı eklendi.
- **Öğrenimler:** Büyük refactoring veya mimari değişiklikler sonrası, bağımlılıkların (özellikle `import` ifadelerinin) doğru bir şekilde güncellenmesinin ne kadar kritik olduğu anlaşıldı. "Siyah ekran" gibi genel hataların, genellikle uygulamanın en üst seviyesindeki bir render veya import hatasından kaynaklanabileceği ve geliştirici konsolundaki hata mesajlarının bu tür sorunları bulmak için ilk bakılacak yer olduğu pekiştirildi.

---

### 59. Gün: Kritik Hata Ayıklama ("Hizmetler Getirilmedi" Sorunu)

- **Yapılanlar:** "Randevu Al" sayfasında, bir berber seçildikten sonra ortaya çıkan "hizmetler getirilmedi" hatası çözüldü.
- **Karşılaşılan Sorunlar:** Sorunun kök nedeninin, seçilen bir berberin hizmetlerini listeleyecek halka açık bir API endpoint'inin bulunmaması olduğu tespit edildi.
- **Çıktılar:**
    - **Backend:** Yeni bir API endpoint'i oluşturmak yerine, mevcut `GET /api/barbers/:id` endpoint'i, berberin profil bilgileriyle birlikte hizmet listesini de döndürecek şekilde güncellendi. Bu, `barberProfile.model.js` dosyasındaki `findByUserId` fonksiyonunun `Promise.all` ile iki sorguyu paralel çalıştırmasıyla sağlandı.
    - **Frontend:** `services/barberService.js` ve `services/appointmentService.js` adında yeni servis modülleri oluşturuldu.
    - **Frontend:** `pages/BookingPage.jsx` bileşeni, bu yeni servisleri kullanarak berberleri listeleyen, seçilen berberin hizmetlerini doğru bir şekilde gösteren ve randevu alma akışını yöneten sağlam bir yapıyla baştan yazıldı.
- **Öğrenimler:** Bir API tasarlarken, birbiriyle ilişkili verileri (profil ve hizmetler gibi) tek bir istekte döndürmenin, ağ trafiğini azaltarak performansı nasıl artırabileceği anlaşıldı. `Promise.all` kullanarak birden fazla asenkron veritabanı sorgusunu paralel olarak çalıştırmanın backend performansına olumlu etkisi görüldü. React'te karmaşık bir sayfanın state yönetiminin (seçimler, yüklenme durumu, hata durumu) nasıl dikkatli bir şekilde yapılması gerektiği pratik edildi.

---

### 61. Gün: Frontend Hata Ayıklama (Missing Dependency - `axios`)

- **Yapılanlar:** Frontend'de API servis katmanı oluşturulduktan sonra karşılaşılan `Failed to resolve import "axios"` hatası çözüldü.
- **Karşılaşılan Sorunlar:** Yeni oluşturulan API servis katmanının (`api.js`, `barberService.js` vb.) `axios` paketini kullandığı, ancak bu paketin `frontend` projesine hiç yüklenmediği (`package.json` dosyasında eksik olduğu) tespit edildi.
- **Çıktılar:** `frontend` klasöründe `npm install axios` komutu çalıştırılarak eksik bağımlılık projeye eklendi ve sorun giderildi.
- **Öğrenimler:** Bir projenin `package.json` dosyasında listelenmeyen bir paketi `import` etmeye çalışmanın `Failed to resolve import` hatasına yol açtığı anlaşıldı. Frontend projelerinde dış kütüphaneleri kullanmadan önce `npm install` ile yüklenmesi gerektiği pekiştirildi. Bağımlılık yönetiminin, projenin sağlıklı bir şekilde çalışması için temel bir gereklilik olduğu kavrandı.

---

### 62. Gün: Kritik Hata Ayıklama (Beyaz Ekran - Eksik Fonksiyon)

- **Yapılanlar:** "Randevu Al" sayfasına girildiğinde karşılaşılan "beyaz ekran" (uygulama çökmesi) sorunu çözüldü.
- **Karşılaşılan Sorunlar:** Tarayıcı geliştirici konsolu incelendiğinde, hatanın `AppointmentCalendar` bileşeninin, `barberService.js` içinde bulunmayan `getBarberAvailability` fonksiyonunu import etmeye çalışmasından kaynaklandığı tespit edildi. Bu, bir "module export not found" hatasına ve React render döngüsünün çökmesine neden oluyordu.
- **Çıktılar:** `frontend/src/services/barberService.js` dosyasına, backend'in `/api/barbers/:id/availability` endpoint'ine istek atan eksik `getBarberAvailability` fonksiyonu eklendi. Fonksiyon, berber ID'si, tarih ve hizmet süresini parametre olarak alacak şekilde doğru bir şekilde implemente edildi.
- **Öğrenimler:** "Beyaz ekran" gibi genel uygulama çökmelerinin, genellikle bir JavaScript runtime hatasından (örn: var olmayan bir fonksiyonu çağırmak) kaynaklandığı anlaşıldı. Tarayıcı geliştirici konsolunun, bu tür hataların kaynağını bulmak için en önemli araç olduğu pekiştirildi. Kodun farklı modülleri (bileşen ve servis gibi) arasındaki bağımlılıkların ve fonksiyon imzalarının tutarlı olmasının önemi kavrandı.

---

### 60. Gün: Frontend Hata Ayıklama (Module Not Found - Missing API Config)

- **Yapılanlar:** Frontend'de API servis dosyaları oluşturulduktan sonra karşılaşılan `Failed to resolve import "./api"` hatası çözüldü.
- **Karşılaşılan Sorunlar:** `appointmentService.js` ve `barberService.js` gibi yeni servis dosyalarının, merkezi bir API yapılandırma modülüne (`api.js`) bağımlı olduğu, ancak bu dosyanın hiç oluşturulmadığı tespit edildi.
- **Çıktılar:** `frontend/src/services/api.js` adında yeni bir dosya oluşturuldu. Bu dosya, `axios` kullanarak backend'in temel URL'sini (`baseURL`) ayarlayan ve `localStorage`'dan aldığı JWT'yi her isteğin `Authorization` başlığına otomatik olarak ekleyen bir "interceptor" (araya girici) içeren merkezi bir API istemcisi tanımlar.
- **Öğrenimler:** Frontend projelerinde, API çağrılarını yönetmek için merkezi ve yeniden kullanılabilir bir servis katmanı oluşturmanın önemi anlaşıldı. `axios` interceptor'larının, her API isteğine token ekleme gibi tekrarlayan görevleri otomatikleştirmek için nasıl güçlü bir araç olduğu öğrenildi. `MODULE_NOT_FOUND` veya `Failed to resolve import` hatalarının, sadece dosya yolu yanlışlıklarından değil, aynı zamanda hiç oluşturulmamış modüllerden de kaynaklanabileceği pekiştirildi.

---

### 63. Gün: Hata Ayıklama ("Randevu Al" Sayfasında Veri Yükleme Sorunu)

- **Yapılanlar:** "Randevu Al" sayfasında, bir berber seçildiğinde tarih ve saat seçim panelinin görünmemesi sorunu çözüldü.
- **Karşılaşılan Sorunlar:** Tarayıcı geliştirici konsolu incelendiğinde, hatanın `BookingPage.jsx` bileşeninin, `barberService.js` içinde bulunmayan `getBarberById` fonksiyonunu çağırmaya çalışmasından kaynaklandığı tespit edildi. Bu, bir "module export not found" hatasına ve sayfanın çökmesine neden oluyordu.
- **Çıktılar:**
    - `frontend/src/services/barberService.js` dosyasına, backend'in `/api/barbers/:id` endpoint'ine istek atan eksik `getBarberById` fonksiyonu eklendi.
    - `BookingPage.jsx` bileşeni, berber seçimi sırasında olası API hatalarını daha iyi yönetmek ve kullanıcıya geri bildirimde bulunmak için `try...catch` bloğu ve hata state'i ile sağlamlaştırıldı.
- **Öğrenimler:** Bir kullanıcı etkileşimiyle tetiklenen asenkron veri yükleme işlemlerinde, hem yüklenme (loading) hem de hata (error) durumlarını kullanıcı arayüzüne yansıtmanın önemi anlaşıldı. Bir özelliğin farklı parçalarının (API servisi ve UI bileşeni) birbiriyle tutarlı olması gerektiği ve eksik bir fonksiyonun tüm akışı nasıl kırabileceği pratik olarak görüldü.

---

### 64. Gün: Hata Ayıklama (Duplicated Export)

- **Yapılanlar:** `frontend/src/services/barberService.js` dosyasında `Duplicated export 'getBarberById'` hatası çözüldü.
- **Karşılaşılan Sorunlar:** Hatanın, `getBarberById` fonksiyonunun aynı dosya içinde iki kez tanımlanıp dışa aktarılmaya çalışılmasından kaynaklandığı tespit edildi.
- **Çıktılar:** `barberService.js` dosyasındaki tekrar eden `getBarberById` fonksiyon tanımı kaldırıldı.
- **Öğrenimler:** JavaScript modüllerinde aynı isimde birden fazla dışa aktarımın mümkün olmadığı ve bu tür hataların derleme sürecini nasıl durdurabileceği anlaşıldı. Kod düzenlemesi sırasında dikkatli olmanın ve linter/derleyici hatalarını dikkatle okumanın önemi pekiştirildi.

---

### 65. Gün: Çok Katmanlı Hata Ayıklama ("Seçim Yapılamıyor" Sorunu)

- **Yapılanlar:** "Randevu Al" sayfasında berber, hizmet ve tarih seçimlerinin yapılamamasına neden olan bir dizi hata giderildi.
- **Karşılaşılan Sorunlar:**
    1.  **Ana Sorun:** Backend'in, berber listesini (`/api/barbers`) döndürürken berber kimliğini `user_id` olarak, tek bir berber detayını (`/api/barbers/:id`) döndürürken ise `id` olarak adlandırdığı tespit edildi. Bu tutarsızlık, frontend'in seçilen berberi tanıyamamasına ve hizmetleri getirememesine neden oluyordu.
    2.  **Tarih Hatası:** `AppointmentCalendar` bileşenindeki tarih değiştirme fonksiyonunun, farklı saat dilimlerindeki kullanıcılar için tarihi yanlış hesaplayarak bir gün geri atmasına neden olduğu bulundu.
- **Çıktılar:**
    - **Backend:** `barberProfile.model.js` dosyasındaki `findAll` fonksiyonu, `u.id as user_id` yerine `u.id as id` kullanacak şekilde güncellenerek API tutarlılığı sağlandı.
    - **Frontend:** `AppointmentCalendar.jsx` bileşenindeki `handleDateChange` ve `toYYYYMMDD` fonksiyonları, saat dilimi sorunlarını ortadan kaldıran daha sağlam bir mantıkla yeniden yazıldı. Ayrıca, `createAppointment` çağrısındaki gereksiz `token` parametresi kaldırıldı.
- **Öğrenimler:** Frontend ve backend arasında veri yapılarının ve alan adlarının tutarlı olmasının ne kadar kritik olduğu anlaşıldı. JavaScript'te tarih ve saat dilimi (timezone) yönetiminin karmaşıklığı ve `toISOString()`'in UTC tabanlı çalışmasının potansiyel yan etkileri pratik olarak görüldü. Bir kullanıcı şikayetinin ("seçemiyorum" gibi) altında yatan birden çok teknik sorunun nasıl bir arada bulunabileceği ve sistematik bir şekilde ayıklanması gerektiği deneyimlendi.

---

### 66. Gün: Hata Ayıklama (403 Forbidden - Yetkilendirme Hatası)

- **Yapılanlar:** Müşteri olarak "Randevularım" sayfasına girildiğinde alınan `Request failed with status code 403` hatası çözüldü.
- **Karşılaşılan Sorunlar:** Hatanın, `CustomerAppointmentsPage` bileşeninin yanlışlıkla berberlere özel olan `getMyBarberAppointments` servis fonksiyonunu çağırmasından kaynaklandığı tespit edildi. Backend, `roleMiddleware('barber')` kontrolü sayesinde bu isteği doğru bir şekilde reddediyordu.
- **Çıktılar:** `CustomerAppointmentsPage.jsx` dosyasındaki API çağrısı, doğru olan `getMyCustomerAppointments` fonksiyonunu kullanacak şekilde düzeltildi.
- **Öğrenimler:** Rol bazlı yetkilendirmenin hem backend (erişimi engelleme) hem de frontend (doğru API'yi çağırma) katmanlarında doğru bir şekilde uygulanmasının önemi anlaşıldı. `403 Forbidden` hatasının, kimliğin doğrulanmış ancak istenen eylem için yetkinin olmaması durumunda döndürüldüğü pekiştirildi.

---

### 67. Gün: Hata Ayıklama (400 Bad Request - Eksik Veri)

- **Yapılanlar:** Randevu oluşturma sırasında alınan `Request failed with status code 400` hatası çözüldü.
- **Karşılaşılan Sorunlar:** Hatanın, frontend'in randevu oluşturma isteği (`POST /api/appointments`) gönderirken, seçilen hizmetin ID'sini (`service_id`) isteğin gövdesine eklememesinden kaynaklandığı tespit edildi. Backend, ciro takibi özelliği sonrası bu bilgiyi zorunlu hale getirmişti.
- **Çıktılar:** `backend/src/controllers/appointment.controller.js` dosyasındaki `createAppointment` fonksiyonu, `req.body`'den `service_id`'yi de okuyacak ve veritabanına kaydedilecek veriye ekleyecek şekilde güncellendi.
- **Öğrenimler:** `400 Bad Request` hatasının genellikle istemcinin sunucuya eksik veya hatalı formatta veri göndermesi durumunda ortaya çıktığı anlaşıldı. Frontend ve backend arasında veri sözleşmesinin (API contract) tutarlı olmasının ve bir tarafta yapılan bir değişikliğin diğer tarafı da etkileyeceğinin önemi pekiştirildi.

---

### 70. Gün: Kullanıcı Deneyimi İyileştirmesi (Halka Açık Ana Sayfa)

- **Yapılanlar:** Halka açık ana sayfadaki (`PublicLandingPage`) kullanıcı akışı ve içeriği, kullanıcıları platformu kullanmaya teşvik edecek şekilde yeniden düzenlendi.
- **Karşılaşılan Sorunlar:** Sayfanın en altındaki statik "Booking" bölümünün, sayfanın genel akışına uymadığı ve kullanıcıya bir değer sunmadığı tespit edildi.
- **Çıktılar:**
    - `PublicLandingPage.jsx` dosyasından anlamsız "Booking" bölümü kaldırıldı.
    - Yerine, "Neden Barber-Sync?" başlığı altında, platformun hem müşteriler hem de berberler için faydalarını (Kolay Randevu, İş Yönetimi, Anında Bildirimler) vurgulayan üç adet özellik kartı içeren yeni bir bölüm eklendi.
    - `PublicLandingPage.css` dosyası, bu yeni bölümü ve kartları modern bir tasarımla stilize edecek şekilde güncellendi.
- **Öğrenimler:** Bir "landing page" (karşılama sayfası) tasarımında, her bölümün belirli bir amacı olması (bilgi verme, teşvik etme vb.) ve kullanıcıyı hedeflenen bir eyleme (kayıt olma, giriş yapma) yönlendirmesi gerektiği anlaşıldı. Özellikleri, fayda odaklı kısa metinler ve ikonlarla sunmanın (feature cards), bir ürünün değer önerisini hızlı ve etkili bir şekilde iletmek için güçlü bir yöntem olduğu görüldü.

---

### 71. Gün: Ana Sayfa Animasyonunu Yenileme (Yatay Kaydırma)

- **Yapılanlar:** Ana karşılama sayfasındaki dikey kaydırma animasyonu, daha modern ve "yeni nesil" bir yatay kaydırma animasyonu ile değiştirildi.
- **Çıktılar:**
    - `PublicLandingPage.jsx` bileşeninin yapısı, metin bölümlerini (`.scroll-section`) yatay bir sarmalayıcı (`.horizontal-scroll-wrapper`) içine alacak şekilde güncellendi.
    - `useLayoutEffect` içindeki GSAP animasyon mantığı, sayfa aşağı kaydırıldıkça dikeyde sabitlenmiş bir alanda (`pin: true`) metin bölümlerini yatay olarak (`x` ekseninde) kaydıracak şekilde yeniden yazıldı.
    - `HomePage.css` dosyası, bu yeni yatay düzeni destekleyecek şekilde güncellendi. `.scroll-content` bir "viewport" (görüş alanı) haline getirildi ve `.horizontal-scroll-wrapper` tüm bölümleri yan yana içerecek şekilde genişletildi.
- **Öğrenimler:** GSAP ScrollTrigger kütüphanesinin, dikey kaydırma hareketini yatay bir animasyona dönüştürmek için nasıl kullanılabileceği öğrenildi. `pin: true` özelliğinin, bir elementi sayfa kaydırılırken ekranda nasıl sabitlediği pratik edildi. `will-change: transform` gibi CSS performans ipuçlarının, akıcı animasyonlar için tarayıcıya nasıl yardımcı olduğu anlaşıldı.

---

### 72. Gün: Ana Sayfa Animasyonunu Sinematik Hale Getirme

- **Yapılanlar:** Ana karşılama sayfasındaki yatay kaydırma animasyonu, daha sinematik ve profesyonel bir dikey kaydırma deneyimi ile değiştirildi. Sayfa boyutu orijinal, daha kompakt haline geri getirildi.
- **Çıktılar:**
    - `PublicLandingPage.jsx` bileşeni, 3D sahneyi ve metin animasyonlarını içerecek şekilde yeniden düzenlendi. GSAP ScrollTrigger kullanılarak, sayfa aşağı kaydırıldıkça tetiklenen yeni bir animasyon zaman çizelgesi (timeline) oluşturuldu:
        1.  Berber koltuğu 180 derece dönüyor.
        2.  Koltuk dönüşünü tamamladığında, metinler zarif bir şekilde beliriyor.
        3.  Daha fazla kaydırma ile ilk metin kaybolurken ikinci metin beliriyor ve alttaki sayfa göstergeleri (pagination dots) güncelleniyor.
    - `HomePage.css` dosyası, dikey kaydırma düzenine geri döndü ve yeni sinematik metin animasyonlarını destekleyecek şekilde güncellendi.
- **Öğrenimler:** GSAP'in zaman çizelgesi (timeline) özelliğinin, birden çok animasyonu hassas zamanlama ile sıralamak ve senkronize etmek için nasıl kullanıldığı pratik edildi. `pin: true` ve `scrub: 1` gibi ScrollTrigger özelliklerinin, bir "video gibi" kaydırma deneyimi yaratmadaki gücü anlaşıldı. Kullanıcı deneyimini iyileştirmek için animasyonlarda `ease` (yumuşatma) fonksiyonlarının önemini ve farklı `ease` tiplerinin animasyonun hissiyatını nasıl değiştirdiği görüldü.

---

### 73. Gün: İnatçı "Siyah Ekran" Hatasının Çözümü

- **Yapılanlar:** Önceki günlerde yapılan animasyon değişiklikleri sonrası devam eden "siyah ekran" hatası, çok katmanlı bir yaklaşımla kalıcı olarak çözüldü.
- **Karşılaşılan Sorunlar:**
    1.  **JavaScript Çökmesi:** `PublicLandingPage.jsx` içindeki `useLayoutEffect`'in, React'in 3D sahneyi ve diğer DOM elemanlarını render etmesini beklemeden çalıştığı ve `null` olan referanslara (`.current`) erişmeye çalışarak uygulamayı çökerttiği tespit edildi.
    2.  **CSS Yerleşim Hatası:** `HomePage.css` dosyasındaki `position: sticky` ve hatalı `height` değerlerinin, GSAP'in `pin` özelliğiyle çakışarak animasyon alanının doğru şekilde oluşturulmasını engellediği anlaşıldı.
- **Çıktılar:**
    - `PublicLandingPage.jsx` dosyasındaki `useLayoutEffect`'in başına, animasyon için gerekli tüm referansların (`ref.current`) var olup olmadığını kontrol eden bir "guard clause" (koruma koşulu) eklendi. Bu, JS çökmesini tamamen engelledi.
    - `HomePage.css` dosyası, animasyonlu konteynerin `height: 100vh` ve `position: relative` olmasını, GSAP'in `pin` özelliğinin ise bu konteyneri sarmalayan daha büyük bir alanda çalışmasını sağlayacak şekilde yeniden düzenlendi.
- **Öğrenimler:** Karmaşık animasyonlar oluştururken, React'in render döngüsü ile animasyon kütüphanesinin (GSAP) çalışma zamanlaması arasındaki potansiyel "yarış durumları" (race conditions) anlaşıldı. `useLayoutEffect` içinde referansların varlığını kontrol etmenin, bu tür hatalara karşı sağlam bir savunma mekanizması olduğu öğrenildi. GSAP'in `pin` özelliğinin doğru çalışması için CSS'te `position: sticky` gibi çakışan kurallardan kaçınılması ve doğru HTML/CSS yapısının kurulması gerektiği pekiştirildi.

---

### 74. Gün: Ana Sayfa Animasyonunu Sinematik Intro ile Değiştirme

- **Yapılanlar:** Projenin ana karşılama sayfası, eski 3D/GSAP kaydırma animasyonu yerine, belirli bir zaman çizelgesine göre çalışan, sinematik ve modern bir "intro" animasyonu ile tamamen yeniden tasarlandı.
- **Çıktılar:**
    - `framer-motion` paketi projeye eklendi.
    - `PublicLandingPage.jsx` bileşeni, `useState` ve `useEffect` hook'ları kullanılarak, 3 saniyelik aralıklarla değişen üç farklı metin slaytını gösterecek şekilde yeniden yazıldı.
    - `AnimatePresence` ve `motion.div` bileşenleri kullanılarak metinler arasında akıcı `fade` ve `slide` geçişleri sağlandı.
    - Animasyonun son aşamasında, kullanıcıyı `/login` sayfasına yönlendiren, parlayan bir "Randevu Al" butonu belirecek şekilde animasyon tamamlandı.
    - `HomePage.css` dosyası, bu yeni sinematik arayüzü (arka plan, metin stilleri, buton ve sayfalama göstergeleri) stilize etmek için tamamen yeniden düzenlendi.
- **Öğrenimler:** Framer Motion kütüphanesinin, React bileşenlerinde karmaşık ve zaman çizelgesine dayalı animasyonlar oluşturmak için nasıl kullanıldığı öğrenildi. `AnimatePresence` bileşeninin, DOM'dan kaldırılan elemanlar için "exit" animasyonları oluşturmadaki rolü anlaşıldı. `useState` ve `useEffect` ile zamanlanmış (timed) state değişiklikleri yaparak bir animasyon sekansı oluşturma pratiği yapıldı.

---

### 75. Gün: Frontend Hata Ayıklama (Eksik Bağımlılık - `framer-motion`)

- **Yapılanlar:** Yeni sinematik intro animasyonu eklendikten sonra karşılaşılan `Failed to resolve import "framer-motion"` hatası çözüldü.
- **Karşılaşılan Sorunlar:** Hatanın, animasyonlar için kullanılan `framer-motion` kütüphanesinin `frontend` projesine hiç yüklenmemiş olmasından (`package.json` dosyasında eksik) kaynaklandığı tespit edildi.
- **Çıktılar:** `frontend` klasöründe `npm install framer-motion` komutu çalıştırılarak eksik bağımlılık projeye eklendi ve sorun giderildi.
- **Öğrenimler:** Bir projeye yeni bir kütüphane eklerken, sadece `import` ifadesini yazmanın yeterli olmadığı, paketin `npm` veya `yarn` gibi bir paket yöneticisiyle projeye kurulması gerektiği pekiştirildi. `Failed to resolve import` hatasının, sadece dosya yolu yanlışlıklarından değil, aynı zamanda projenin `node_modules` klasöründe bulunmayan paketlerden de kaynaklanabileceği anlaşıldı.

---

### 76. Gün: Ana Sayfa Arayüz ve Etkileşim İyileştirmeleri

- **Yapılanlar:** Sinematik intro'ya sahip ana sayfanın kullanıcı deneyimi ve görsel zenginliği artırıldı.
- **Çıktılar:**
    - `PublicLandingPage.jsx` bileşeni güncellendi: Arka plan videosunun `loop` özelliği kaldırıldı. Alttaki ilerleme çizgilerine (`pagination-lines`), tıklandığında ilgili slayta geçişi sağlayan `onClick` olay yöneticileri eklendi. Ekranın soluna sosyal medya ikonları ve sağına iletişim bilgisi için yeni `div`'ler eklendi.
    - `HomePage.css` dosyasına, bu yeni eklenen yan elemanları (`.side-elements`) dikey olarak konumlandıran ve stilize eden yeni CSS kuralları eklendi. Ayrıca, ilerleme çizgilerinin tıklanabilir olduğunu belirtmek için `cursor: pointer` eklendi. Mobil cihazlarda daha temiz bir görünüm için yan elemanların gizlenmesi sağlandı.
- **Öğrenimler:** Bir web sayfasında "negatif boşluk" (negative space) alanlarını, kullanıcıyı ana içerikten uzaklaştırmayacak şekilde ikincil bilgilerle (sosyal medya, iletişim) nasıl doldurulacağı öğrenildi. CSS'te `writing-mode: vertical-rl` gibi özelliklerle dikey metin yerleşimlerinin nasıl yapılabileceği görüldü. React'te, bir dizi üzerinden `map` ile render edilen elemanlara, `onClick` ile state güncelleyen fonksiyonlar ekleyerek nasıl interaktif hale getirilebileceği pratik edildi.

---

### 77. Gün: Ana Sayfa Arayüzü Son Rötuşlar

- **Yapılanlar:** Ana karşılama sayfasındaki yerleşim ve görsel sorunlar giderildi.
- **Karşılaşılan Sorunlar:**
    1.  Arka plan videosunun üzerinde, görüntüyü bozan ve karartan dikdörtgen şeklinde bir filtre vardı.
    2.  Navigasyon menüsündeki logo ve butonlar ortalanmış duruyordu, sağa ve sola yaslanmaları gerekiyordu.
    3.  Sayfanın alt kısmında, sitenin amacını anlatan "Neden Biz?" bölümü eksikti.
- **Çıktılar:**
    - `HomePage.css` dosyasındaki `.background-overlay` kuralı, rahatsız edici `radial-gradient` yerine, videonun alt ve üst kısımlarını hafifçe karartarak metin okunurluğunu artıran daha zarif bir `linear-gradient` ile değiştirildi.
    - `PublicLandingPage.css` dosyasında, `.navbar`'a `left: 0` eklenerek tam genişliğe yayılması sağlandı ve `.nav-buttons`'a `margin-left: auto` eklenerek butonların sağa yaslanması sağlandı.
    - `PublicLandingPage.jsx` dosyasına, daha önce kaldırılmış olan "Neden Biz?" bölümü tekrar eklendi.
- **Öğrenimler:** CSS Flexbox'ta `margin: auto` kullanımının, bir grup elemanı konteynerin bir kenarına yaslamak için ne kadar güçlü bir araç olduğu anlaşıldı. `radial-gradient` ve `linear-gradient` arasındaki farklar ve metin okunurluğunu artırmak için arka plan üzerinde nasıl farklı karartma efektleri oluşturulabileceği pratik edildi.

---

### 78. Gün: CSS Çakışmalarını Giderme ve Arayüzü Düzeltme

- **Yapılanlar:** Ana karşılama sayfasındaki yerleşim sorunları ve görsel hatalar, CSS dosyaları birleştirilerek ve çakışan kurallar düzeltilerek çözüldü.
- **Karşılaşılan Sorunlar:** Önceki değişikliklerin etkili olmamasının nedeninin, `PublicLandingPage.jsx` bileşeninin hem `HomePage.css` hem de `PublicLandingPage.css` dosyalarını import etmesi ve bu durumun stil çakışmalarına yol açması olduğu tespit edildi. Navigasyon menüsündeki `justify-content: space-between` kuralı, `margin-left: auto` ile çakışarak butonların sağa yaslanmasını engelliyordu.
- **Çıktılar:**
    - `HomePage.css` dosyasındaki tüm stiller, ana stil dosyası olan `PublicLandingPage.css`'e taşındı.
    - Artık gereksiz olan `HomePage.css` dosyası ve `PublicLandingPage.jsx` içindeki import satırı silindi.
    - `PublicLandingPage.css` dosyasındaki `.navbar` kuralından `justify-content: space-between` kaldırılarak `margin-left: auto`'nun doğru çalışması sağlandı.
- **Öğrenimler:** Bir React bileşeni için stil kurallarını tek bir dosyada merkezileştirmenin, CSS çakışmalarını ve beklenmedik yerleşim hatalarını önlemedeki önemi anlaşıldı. CSS Flexbox'ta `justify-content` ve `margin: auto` gibi özelliklerin birbiriyle nasıl etkileşime girdiği ve bazen birbirini etkisiz hale getirebileceği pratik olarak görüldü.

---

### 82. Gün: Kritik Hata Ayıklama (Avatar Kaybolma Sorunu)

- **Yapılanlar:** Profil sayfasında, berberin avatar dışındaki bilgilerini güncellediğinde mevcut avatarının silinmesi sorunu kalıcı olarak çözüldü.
- **Karşılaşılan Sorunlar:** Sorunun kök nedeninin, `ProfileInfoForm` bileşeninin, yeni bir avatar dosyası seçilmediğinde mevcut `avatar_url` bilgisini backend'e göndermemesi olduğu tespit edildi. Bu durum, backend'in bu alanı `NULL` olarak yorumlamasına ve veritabanındaki mevcut avatar bilgisini silmesine neden oluyordu.
- **Çıktılar:** `ProfilePage.jsx` içindeki `ProfileInfoForm` bileşeninin `handleSubmit` fonksiyonuna, `avatarFile`'ın `null` olduğu durumda mevcut `profile.avatar_url`'yi `FormData`'ya ekleyen bir `else if` bloğu eklendi.
- **Öğrenimler:** `multipart/form-data` ile bir kaynağı güncellerken, değiştirilmeyen alanların (özellikle dosya yolları gibi) değerlerini de isteğe eklemenin, verinin istenmeden silinmesini (null'lanmasını) önlemek için ne kadar kritik olduğu anlaşıldı. Benzer özelliklere sahip farklı formların (Müşteri Profili vs. Berber Profili) mantıklarının birbiriyle tutarlı olması gerektiği pekiştirildi.

---

### 83. Gün: Kritik Backend Hata Ayıklaması (Avatar Kaybolma Sorununun Kök Nedeni)

- **Yapılanlar:** Profil sayfasında avatar dışındaki bilgileri güncellerken avatarın silinmesi sorunu, bu kez backend tarafında kalıcı olarak çözüldü.
- **Karşılaşılan Sorunlar:** Önceki frontend düzeltmesinin sorunu çözmemesi üzerine yapılan derinlemesine analizde, asıl sorunun `barberProfile.model.js` dosyasındaki `upsert` fonksiyonunda olduğu tespit edildi. Fonksiyon, `ON CONFLICT ... DO UPDATE` kısmında, gelen `avatar_url` değeri `undefined` (yani `NULL`) olduğunda, veritabanındaki mevcut değeri korumak yerine üzerine `NULL` yazarak siliyordu.
- **Çıktılar:**
    - `barberProfile.model.js` dosyasındaki `upsert` fonksiyonunun `UPDATE` kısmı, `COALESCE(EXCLUDED.avatar_url, barber_profiles.avatar_url)` kullanılarak yeniden yazıldı. Bu, yeni bir değer gelmediği takdirde mevcut değerin korunmasını garantileyen "savunmacı" bir programlama tekniğidir.
    - `user.controller.js` dosyasındaki tekrar eden `updateMyProfile` fonksiyonu silinerek kod temizliği yapıldı.
- **Öğrenimler:** Veritabanı modelleri tasarlarken, özellikle `UPDATE` veya `UPSERT` işlemlerinde, gönderilmeyen alanların istenmeden `NULL` olarak güncellenmesini önlemek için `COALESCE` gibi SQL fonksiyonlarını kullanmanın ne kadar önemli olduğu anlaşıldı. Bir hatanın gerçek kök nedenini bulmak için frontend'den backend'e ve veritabanı katmanına kadar tüm akışı takip etmenin gerekliliği pekiştirildi.

---

### 81. Gün: Ana Sayfa Arayüzü Genişlik Ayarlamaları

- **Yapılanlar:** Ana karşılama sayfasındaki "Neden Biz?" ve "Footer" bölümlerinin, tam ekran video gibi tüm ekran genişliğini kaplaması sağlandı.
- **Karşılaşılan Sorunlar:** Sayfanın ana konteyneri (`#root`) `max-width` ile sınırlandırıldığı için, normal akıştaki `section` ve `footer` elemanları da bu genişlikle sınırlı kalıyordu. Bu durum, tam ekran video bölümünden sonra gelen bölümlerde kenarlarda boşluklar oluşmasına neden oluyordu.
- **Çıktılar:**
    - `PublicLandingPage.css` dosyası güncellendi.
    - `.why-us-section` ve `.footer` sınıflarına, elemanları ana konteynerin genişlik kısıtlamasından çıkarıp tam ekran genişliğine (`100vw`) yaymak için `position: relative`, `width: 100vw`, `left: 50%` ve `transform: translateX(-50%)` CSS kuralları eklendi.
- **Öğrenimler:** Bir elemanı, `max-width` ile sınırlandırılmış bir üst konteynerin dışına taşıyarak tam ekran genişliğine sahip bir arka plan oluşturmanın CSS'teki teknikleri öğrenildi. `position: relative` ile birlikte `width: 100vw` ve `transform` kullanmanın, elemanı normal belge akışındaki yerini korurken görsel olarak nasıl genişletilebileceği pratik edildi.


---

### 75. Gün: Frontend Hata Ayıklama (Eksik Bağımlılık - `framer-motion`)

- **Yapılanlar:** Yeni sinematik intro animasyonu eklendikten sonra karşılaşılan `Failed to resolve import "framer-motion"` hatası çözüldü.
- **Karşılaşılan Sorunlar:** Hatanın, animasyonlar için kullanılan `framer-motion` kütüphanesinin `frontend` projesine hiç yüklenmemiş olmasından (`package.json` dosyasında eksik) kaynaklandığı tespit edildi.
- **Çıktılar:** `frontend` klasöründe `npm install framer-motion` komutu çalıştırılarak eksik bağımlılık projeye eklendi ve sorun giderildi.
- **Öğrenimler:** Bir projeye yeni bir kütüphane eklerken, sadece `import` ifadesini yazmanın yeterli olmadığı, paketin `npm` veya `yarn` gibi bir paket yöneticisiyle projeye kurulması gerektiği pekiştirildi. `Failed to resolve import` hatasının, sadece dosya yolu yanlışlıklarından değil, aynı zamanda projenin `node_modules` klasöründe bulunmayan paketlerden de kaynaklanabileceği anlaşıldı.

---

### 75. Gün: Frontend Hata Ayıklama (Eksik Bağımlılık - `framer-motion`)

- **Yapılanlar:** Yeni sinematik intro animasyonu eklendikten sonra karşılaşılan `Failed to resolve import "framer-motion"` hatası çözüldü.
- **Karşılaşılan Sorunlar:** Hatanın, animasyonlar için kullanılan `framer-motion` kütüphanesinin `frontend` projesine hiç yüklenmemiş olmasından (`package.json` dosyasında eksik) kaynaklandığı tespit edildi.
- **Çıktılar:** `frontend` klasöründe `npm install framer-motion` komutu çalıştırılarak eksik bağımlılık projeye eklendi ve sorun giderildi.
- **Öğrenimler:** Bir projeye yeni bir kütüphane eklerken, sadece `import` ifadesini yazmanın yeterli olmadığı, paketin `npm` veya `yarn` gibi bir paket yöneticisiyle projeye kurulması gerektiği pekiştirildi. `Failed to resolve import` hatasının, sadece dosya yolu yanlışlıklarından değil, aynı zamanda projenin `node_modules` klasöründe bulunmayan paketlerden de kaynaklanabileceği anlaşıldı.

---

### 68. Gün: Hata Ayıklama (400 Bad Request - Hatalı Zaman Doğrulaması)

- **Yapılanlar:** Randevu oluşturma sırasında, geçerli bir saat seçilmesine rağmen alınan `Request failed with status code 400` hatası çözüldü.
- **Karşılaşılan Sorunlar:** Sorunun, backend'deki `createAppointment` controller'ında bulunan sunucu taraflı zaman doğrulama mantığından kaynaklandığı tespit edildi. Kontrol, saatleri string (metin) olarak karşılaştırıyordu (`"10:00" < "09:00"`), bu da yanlış sonuçlara ve geçerli isteklerin reddedilmesine neden oluyordu. Ayrıca, kontrolün hizmet süresini hesaba katmadığı anlaşıldı.
- **Çıktılar:** `appointment.controller.js` dosyasındaki zaman doğrulama mantığı tamamen yeniden yazıldı. Artık saatler string olarak değil, başlangıç ve bitiş saatlerini dakikaya çevirerek sayısal olarak karşılaştırılıyor. Ayrıca, seçilen hizmetin süresi de hesaba katılarak, randevunun bitiş saatinin dükkanın kapanış saatini geçmemesi sağlanıyor.
- **Öğrenimler:** Zaman ve tarih verilerini string olarak karşılaştırmanın ne kadar kırılgan ve hatalı bir yaklaşım olduğu pratik olarak görüldü. Zaman karşılaştırmaları için veriyi sayısal bir formata (toplam dakika gibi) dönüştürmenin daha sağlam bir yöntem olduğu öğrenildi. Sunucu taraflı doğrulamanın, sadece gelen verinin varlığını değil, aynı zamanda iş kurallarına (çalışma saatleri, hizmet süresi) uygunluğunu da kontrol etmesi gerektiği pekiştirildi.
