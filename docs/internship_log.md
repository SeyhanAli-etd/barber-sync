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

### 34. Gün: Proje Değişikliklerini GitHub'a Yükleme (Git Workflow)

- **Yapılanlar:** Projede yapılan değişikliklerin ve eklenen yeni özelliklerin (frontend projesi, yeni API'ler vb.) yerel depodan GitHub'daki uzak depoya nasıl yükleneceği öğrenildi.
- **Çıktılar:** Temel Git iş akışı olan "add, commit, push" döngüsü pratik edildi:
    1.  `git add .`: Tüm yeni ve değiştirilmiş dosyaları "sahneye" (staging area) ekler.
    2.  `git commit -m "Açıklayıcı bir mesaj"`: Sahnedeki değişiklikleri, ne yapıldığını anlatan bir mesajla birlikte kalıcı bir versiyon (commit) olarak kaydeder.
    3.  `git push`: Yereldeki tüm yeni commit'leri GitHub'daki `origin main` dalına gönderir.
- **Öğrenimler:** Proje geçmişini temiz ve anlaşılır tutmak için düzenli olarak commit yapmanın ve açıklayıcı commit mesajları yazmanın önemi kavrandı. Bir geliştiricinin günlük iş akışında Git'i nasıl aktif olarak kullanacağı anlaşıldı.

---

### 33. Gün: Frontend-Backend Bağlantı Hatası ("Failed to fetch") ve CORS

- **Yapılanlar:** Frontend'deki kayıt formundan istek gönderilirken "Failed to fetch" hatası alındı ve bu hata ayıklandı.
- **Karşılaşılan Sorunlar:** Tarayıcı geliştirici konsolu incelendiğinde, hatanın "CORS policy" tarafından engellendiği görüldü. Bu, `http://localhost:5173` adresinde çalışan frontend'in, güvenlik nedeniyle `http://localhost:5000` adresindeki backend'e istek göndermesinin tarayıcı tarafından engellenmesi anlamına geliyordu.
- **Çıktılar:** Backend'deki `app.js` dosyasında bulunan `cors` middleware'i, `origin` seçeneği ile sadece frontend adresine (`http://localhost:5173`) izin verecek şekilde daha spesifik olarak yapılandırıldı. Bu değişiklik sonrası frontend'den gönderilen API istekleri başarıyla backend'e ulaştı.
- **Öğrenimler:** "Failed to fetch" hatasının genellikle bir ağ veya CORS sorunu olduğuna işaret ettiği öğrenildi. Tarayıcı geliştirici araçlarındaki "Console" ve "Network" sekmelerinin, bu tür hataların kök nedenini bulmak için ne kadar kritik olduğu anlaşıldı. CORS (Cross-Origin Resource Sharing) politikasının ne olduğu ve modern web uygulamalarında backend'in, hangi "origin"lerden (kaynaklardan) istek kabul edeceğini açıkça belirtmesi gerektiği kavrandı.
