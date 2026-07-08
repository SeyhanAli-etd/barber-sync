# Barber-Sync - Sistem Mimarisi Dokümanı

## 1. Genel Bakış

Bu doküman, berberler ve müşteriler için bir randevu yönetim sistemi olan **Barber-Sync** projesinin teknik mimarisini, tasarım kararlarını ve geliştirme yol haritasını tanımlar. Amacı, geliştirme sürecinde hem geliştiriciler hem de proje paydaşları için bir referans kaynağı olmaktır.

## 2. Teknoloji Yığını

| Katman | Teknoloji | Versiyon/Not |
|---|---|---|
| **Backend** | Node.js | v18.x veya üstü |
| | Express.js | v4.x |
| **Frontend** | React | v18.x |
| | Vite | Hızlı geliştirme sunucusu ve build aracı |
| **Veritabanı** | PostgreSQL | v16 veya üstü |
| **Kimlik Doğrulama** | JSON Web Tokens (JWT) | `jsonwebtoken` paketi |
| **Gerçek Zamanlı İletişim** | Socket.IO | Anlık bildirimler için |
| **Deployment & Geliştirme** | Docker, Docker Compose | Yerel geliştirme ve canlı ortam için |

### 2.1. Teknoloji Seçim Gerekçeleri

- **Node.js / Express.js (Backend):**
  - **Performans:** Asenkron ve non-blocking I/O yapısı sayesinde, anlık bildirimler ve çok sayıda veritabanı işlemi gibi görevler için yüksek performans sunar.
  - **Tek Dil Avantajı:** Frontend'de de JavaScript (React) kullanıldığı için, tüm projede tek bir dil (JavaScript/TypeScript) ile geliştirme yapma imkanı sunar. Bu, kod tutarlılığını ve geliştirici verimliliğini artırır.
  - **Geniş Ekosistem:** NPM (Node Package Manager) üzerinden erişilebilen milyonlarca paket sayesinde geliştirme süreci hızlanır.

- **React (Frontend):**
  - **Bileşen Tabanlı Mimari:** Tekrar kullanılabilir UI bileşenleri oluşturmayı sağlayarak kodun modüler, yönetilebilir ve ölçeklenebilir olmasını sağlar.
  - **Geniş Topluluk ve Ekosistem:** Karşılaşılan sorunlara kolayca çözüm bulunabilir ve `react-router-dom`, state management kütüphaneleri gibi birçok araçla zenginleştirilebilir.

- **PostgreSQL (Veritabanı):**
  - **Açık Kaynak ve Güçlü:** Tamamen ücretsiz ve açık kaynaklı olmasının yanı sıra, kurumsal düzeyde güvenilirlik ve veri bütünlüğü sunar. `barber-sync` gibi yeni başlayan bir proje için bu, maliyetleri sıfıra indirerek büyük bir avantaj sağlar.
  - **Esneklik:** `JSONB` gibi gelişmiş veri tipleri sayesinde, hem ilişkisel verileri (kullanıcılar, randevular) hem de esnek yapıdaki verileri (çalışma saatleri) aynı veritabanında verimli bir şekilde saklamamızı sağlar. Oracle gibi ticari ve maliyetli alternatiflere göre projemizin doğasına çok daha uygundur.

### 2.2. Yerel Geliştirme Ortamı

İzin, hizmet ve işletim sistemi uyumluluk sorunlarını ortadan kaldırmak için yerel geliştirme ortamında veritabanı, **Docker ve Docker Compose** kullanılarak çalıştırılacaktır. Bu yaklaşım, tüm geliştiriciler için tutarlı ve tekrarlanabilir bir ortam sağlar. Proje kök dizinindeki `docker-compose.yml` dosyası, veritabanı hizmetini tanımlar.

## 3. Sistem Mimarisi

Uygulama, üç ana bileşenden oluşan bir istemci-sunucu mimarisine sahiptir:

1.  **Frontend (React SPA):** Kullanıcıların (müşteri ve berber) etkileşimde bulunduğu, tarayıcıda çalışan tek sayfa uygulamasıdır.
2.  **Backend (Node.js API):** İş mantığını, veritabanı operasyonlarını ve kimlik doğrulamayı yöneten RESTful API sunucusudur.
3.  **Veritabanı (PostgreSQL):** Tüm kullanıcı, randevu ve profil verilerini kalıcı olarak saklar.

**İletişim Akışı:**
- **HTTP/S:** Frontend, veri çekmek veya göndermek için Backend API'sine RESTful istekler (GET, POST, PUT, DELETE) gönderir.
- **WebSockets:** Backend, bir olay gerçekleştiğinde (örn. yeni randevu talebi) ilgili istemcilere anlık bildirimler göndermek için Socket.IO kullanır.

## 4. Veritabanı Tasarımı (PostgreSQL)

Veri modeli, ilişkisel bir yapıda tasarlanmıştır. Aşağıda `dbdiagram.io` formatında şema tanımı bulunmaktadır.

```
// dbdiagram.io formatı

Table users {
  id uuid [pk, default: `gen_random_uuid()`]
  full_name varchar(100) [not null]
  email varchar(255) [unique, not null]
  password_hash varchar(255) [not null]
  phone_number varchar(20)
  role user_role [not null]
  created_at timestamp [default: `now()`]
}

Table barber_profiles {
  id uuid [pk, default: `gen_random_uuid()`]
  user_id uuid [ref: > users.id, unique, not null]
  shop_name varchar(150)
  address text
  working_hours jsonb // Örn: {"monday": "09:00-19:00", "tuesday": "09:00-19:00"}
  avatar_url varchar(255)
}

Table appointments {
  id uuid [pk, default: `gen_random_uuid()`]
  customer_id uuid [ref: > users.id, not null]
  barber_id uuid [ref: > users.id, not null]
  appointment_time timestamp [not null]
  status appointment_status [not null, default: 'pending']
  notes text
  created_at timestamp [default: `now()`]
  
  // Ciro takibi için eklendi (v2.0)
  final_price numeric(10, 2)
  performed_service_name varchar(255)
  completed_at timestamp
}

Table services {
  id uuid [pk, default: `gen_random_uuid()`]
  barber_id uuid [ref: > users.id, not null]
  name varchar(100) [not null]
  price numeric(10, 2) [not null]
  duration_minutes integer [not null]
  is_active boolean [default: true]
  created_at timestamp [default: `now()`]
}

Enum user_role {
  customer
  barber
}

Enum appointment_status {
  pending
  confirmed
  cancelled
  completed
}

```

**Tasarım Gerekçeleri:**
- `users` ve `barber_profiles` tabloları, kullanıcı bilgilerini ve berbere özel profesyonel bilgileri ayırmak için bire-bir ilişkiyle (one-to-one) bağlanmıştır. Bu, sistemin gelecekte farklı kullanıcı rolleri için genişlemesini kolaylaştırır.
- `ENUM` tipleri (`user_role`, `appointment_status`), veri bütünlüğünü sağlar ve geçersiz değerlerin girilmesini önler.
- `jsonb` tipi, berberlerin çalışma saatleri gibi esnek ve yapılandırılmış verileri verimli bir şekilde saklamak için kullanılır.

## 5. Backend Mimarisi (Node.js / Express)

### 5.1. Klasör Yapısı
```
backend/
└── src/
    ├── api/
    │   ├── routes/         # API rotalarını tanımlar (auth.routes.js, appointments.routes.js)
    │   └── middlewares/    # Ara katmanlar (auth.middleware.js)
    ├── config/             # Ortam değişkenleri, veritabanı bağlantısı
    ├── controllers/        # İstekleri işler, servisleri çağırır ve cevap döner
    ├── models/             # Veritabanı sorguları ve veri erişim mantığı
    ├── services/           # İş mantığının bulunduğu katman
    ├── sockets/            # Socket.IO olay yöneticileri
    └── app.js              # Express uygulama başlangıcı
```

### 5.2. Güvenlik
- **Kimlik Doğrulama:** Kullanıcı girişi sonrası oluşturulan JWT, `Authorization: Bearer <token>` başlığı ile korunmuş endpoint'lere erişim için kullanılır.
- **Yetkilendirme:** `auth.middleware.js` gibi ara katmanlar (middleware), gelen istekteki JWT'yi doğrulayarak bir endpoint'e sadece geçerli bir token'a sahip kullanıcıların erişmesini sağlar. Ayrıca bu middleware'ler, token içindeki role bakarak bir endpoint'e sadece belirli rollerin (örn. randevu onayını sadece 'berber' rolünün yapabilmesi) erişebilmesini de sağlayabilir.
- **Şifre Yönetimi:** Şifreler asla düz metin olarak saklanmaz. `bcrypt` kütüphanesi kullanılarak hash'lenir.
- **Veri Doğrulama:** Gelen isteklerin gövdeleri (`req.body`), `express-validator` gibi kütüphanelerle doğrulanarak beklenmedik veya kötü niyetli verilerin sisteme girmesi engellenir.
- **CORS:** `cors` paketi ile sadece izin verilen frontend domain'inden gelen isteklere izin verilir.

## 6. Frontend Mimarisi (React)

### 6.1. Klasör Yapısı
```
frontend/
└── src/
    ├── assets/             # Resimler, fontlar, global CSS
    ├── components/         # Tekrar kullanılabilir UI bileşenleri (Button, Calendar, Modal)
    ├── context/            # Global state yönetimi (AuthContext, NotificationContext)
    ├── hooks/              # Özel hook'lar (useAuth, useApi)
    ├── pages/              # Uygulama sayfaları (HomePage, LoginPage, AppointmentsPage)
    ├── services/           # API isteklerini yöneten modüller (api.js, authService.js)
    ├── utils/              # Yardımcı fonksiyonlar (tarih formatlama vb.)
    ├── App.jsx             # Ana uygulama bileşeni
    └── main.jsx            # Uygulama başlangıç noktası
```

### 6.2. State Management
- MVP (Minimum Viable Product) için, global state yönetimi React'in yerleşik **Context API**'si ile yapılacaktır.
- **`AuthContext`**: Oturum açmış kullanıcı bilgilerini ve token'ı uygulama genelinde tutar.
- **`NotificationContext`**: Socket.IO'dan gelen bildirimleri yönetir.

### 6.3. Routing
- Sayfa yönlendirmeleri için `react-router-dom` kütüphanesi kullanılacaktır.
- Korumalı rotalar (örn. randevu sayfası), kullanıcının oturum açıp açmadığını `AuthContext` üzerinden kontrol eden özel bir `PrivateRoute` bileşeni ile yönetilecektir.

## 7. Gerçek Zamanlı Bildirim Sistemi (Socket.IO)

| Olay Adı (Event Name) | Gönderen | Alıcı | Tetikleyici | Amaç |
|---|---|---|---|---|
| `new_appointment` | Müşteri (Backend aracılığıyla) | Berber | Müşteri yeni randevu talebi oluşturduğunda | Berbere anlık olarak yeni bir talep geldiğini bildirmek. |
| `appointment_update` | Berber (Backend aracılığıyla) | Müşteri | Berber randevu talebini onayladığında/iptal ettiğinde | Müşteriye randevu durumunun değiştiğini bildirmek. |

**İşleyiş:**
- Kullanıcılar (hem berber hem müşteri) giriş yaptıklarında, kendi `user_id`'leri ile adlandırılmış bir Socket.IO odasına katılırlar.
- Bir olay tetiklendiğinde, backend bu olayı hedef kullanıcının odasına (`io.to(targetUserId).emit(...)`) gönderir.

## 8. Geliştirme Yol Haritası (MVP)

1.  **Faz 0 - Kurulum & Planlama:** Proje iskeletleri (backend/frontend), dokümantasyon ve veritabanı şeması oluşturuldu.
2.  **Faz 1 - Veritabanı & Temel Backend:** PostgreSQL tablolarının oluşturulması. Node.js/Express sunucusunun temel kurulumu.
3.  **Faz 2 - Kimlik Doğrulama:** Kullanıcı kayıt ve giriş (register/login) API endpoint'lerinin JWT ile oluşturulması. Frontend'de kayıt/giriş formlarının ve `AuthContext`'in hazırlanması.
4.  **Faz 3 - Temel Randevu Akışı:** Müşterinin randevu oluşturma ve berberin randevuları listeleme API'lerinin yapılması. Frontend'de berber listeleme ve takvimden randevu seçme arayüzünün oluşturulması.
5.  **Faz 4 - Randevu Yönetimi:** Berberin randevu onaylama/reddetme API'sinin yapılması. Frontend'de berber için randevu yönetim panelinin oluşturulması.
6.  **Faz 5 - Bildirim Sistemi:** Socket.IO entegrasyonunun backend ve frontend'de yapılması. Anlık bildirimlerin UI'da gösterilmesi.
7.  **Faz 6 - Cilalama & Test:** UI/UX iyileştirmeleri, hata yönetimi, boş durum (empty state) ekranları ve temel testlerin yapılması.
8.  **Faz 7 - Deployment:** Uygulamanın Vercel ve Render platformlarında canlıya alınması.

## 9. Gelecek Yol Haritası (v2.0)

MVP sürümünden sonra eklenmesi planlanan ana özellikler şunlardır:

- **Puanlama ve Yorum Sistemi:** Müşterilerin tamamlanan randevular için berberlere puan ve yorum bırakabilmesi.
- **Harita Entegrasyonu ve Yol Tarifi:** Berber profillerinde interaktif harita gösterimi ve tek tıkla yol tarifi alma imkanı.
- **Gelişmiş Berber Profili:** Berberlerin hizmet/fiyat listesi ve fotoğraf galerisi gibi ek bilgilerle profillerini zenginleştirebilmesi.