**Barber-Sync**, berberler ve müşterileri dijital bir platformda buluşturan, randevu ve işletme yönetimi sürecini kolaylaştıran modern bir full-stack web uygulamasıdır.


## 🎯 Çözülen Problem

Geleneksel berber randevu sistemleri genellikle telefon görüşmelerine veya manuel olarak tutulan defterlere dayanır. Bu durum:
- **Müşteriler için:** Müsaitlik durumu öğrenme, karşılaştırma yapma ve randevu alma süreçlerini yavaş ve verimsiz hale getirir.
- **Berberler için:** Randevu defterini yönetme, müşteri takibi, ciro hesaplama gibi operasyonel yükleri artırır ve iş verimliliğini düşürür.

**Barber-Sync**, bu süreci dijitalleştirerek her iki taraf için de modern, hızlı ve verimli bir çözüm sunar.

## ✨ Temel Özellikler

Proje, MVP, v2.0 ve v3.0 olmak üzere üç ana fazda geliştirilmiştir.

### 🧔 Berberler İçin

- **Randevu Yönetim Paneli:** Gelen randevu taleplerini anlık olarak görme, onaylama, reddetme ve tamamlama.
- **Hizmet Yönetimi (CRUD):** Kendi hizmet menüsünü (saç, sakal, vb.) fiyat ve süre bilgileriyle oluşturma, güncelleme ve silme.
- **Ciro Takibi ve Raporlama:** Tamamlanan randevuları ciroya işleme, günlük ve aylık kazançları bir panelde takip etme.
- **Gelişmiş Profil Yönetimi:** Dükkan adı, adres, çalışma saatleri, konum (harita) ve fotoğraf galerisi gibi bilgileri yönetme.
- **Anlık Bildirimler:** Yeni bir randevu talebi geldiğinde anlık bildirim alma.

### 💇 Müşteriler İçin

- **Berber Keşfetme:** Sistemdeki berberleri listeleme ve profillerini (yorumlar, puanlar, galeri, harita) detaylı inceleme.
- **Anlık Müsaitlik Kontrolü:** Seçilen bir tarihteki boş randevu saatlerini anında görme.
- **Kolay Randevu Alma:** Sadece birkaç tıkla online randevu oluşturma.
- **Randevu Takibi:** Kendi geçmiş ve gelecek randevularını tek bir panelden yönetme.
- **Anlık Bildirimler:** Randevu durumu (onaylandı, iptal edildi) değiştiğinde anlık bildirim alma.
- **Puanlama ve Yorum:** Tamamlanan randevular sonrası hizmet aldığı berbere puan verme ve yorum yapma.

## 🛠️ Teknoloji Yığını

Proje, modern ve ölçeklenebilir teknolojiler kullanılarak geliştirilmiştir.

| Katman | Teknoloji | Gerekçe |
|---|---|---|
| **Backend** | Node.js, Express.js | Asenkron yapısı sayesinde yüksek performans ve tüm projede tek dil (JavaScript) kullanma avantajı. |
| **Frontend** | React (Vite ile) | Bileşen tabanlı mimarisi sayesinde modüler ve yönetilebilir arayüzler oluşturma kolaylığı. |
| **Veritabanı** | PostgreSQL | Güçlü, açık kaynaklı ve `JSONB` gibi esnek veri tipleri sayesinde gelişmiş sorgu yetenekleri. |
| **Geliştirme Ortamı** | Docker & WSL | "Benim makinemde çalışıyordu" sorununu ortadan kaldıran, standart ve izole geliştirme ortamı. |
| **Kimlik Doğrulama** | JSON Web Tokens (JWT) | Stateless ve güvenli API iletişimi için endüstri standardı. |
| **Gerçek Zamanlı İletişim**| Socket.IO | Anlık bildirimler için verimli ve çift yönlü iletişim kanalı. |
| **Animasyon** | Framer Motion | Akıcı ve profesyonel kullanıcı arayüzü animasyonları oluşturmak için. |

## 🏗️ Sistem Mimarisi

Uygulama, klasik bir **İstemci-Sunucu** mimarisine sahiptir:

1.  **Frontend (React):** Kullanıcının tarayıcısında çalışan, etkileşimli arayüzü sunan Tek Sayfa Uygulaması (SPA).
2.  **Backend (Node.js API):** İş mantığını, veritabanı işlemlerini, güvenliği ve bildirimleri yöneten RESTful API sunucusu.
3.  **Veritabanı (PostgreSQL):** Tüm verilerin kalıcı olarak saklandığı yer.

İletişim, standart **REST API (HTTP)** ve anlık bildirimler için **WebSockets (Socket.IO)** üzerinden sağlanır.

## 🚀 Kurulum ve Çalıştırma

Proje, geliştirme ortamındaki uyumluluk sorunlarını ortadan kaldırmak için **Docker** üzerine kurulmuştur.

### Gereksinimler
- Docker
- Node.js (v18.x veya üstü)
- Git

### Adımlar

1.  **Projeyi klonlayın:**
    ```bash
    git clone https://github.com/SeyhanAli-etd/barber-sync.git
    cd barber-sync
    ```

2.  **Çevre Değişkenlerini Ayarlayın:**
    `backend` klasörü içinde `.env.example` dosyasını kopyalayarak `.env` adında yeni bir dosya oluşturun ve içindeki değerleri (özellikle `JWT_SECRET`) düzenleyin.

3.  **Veritabanını Başlatın:**
    Projenin ana dizinindeyken aşağıdaki komutu çalıştırın. Bu komut, Docker ile PostgreSQL veritabanını ayağa kaldıracaktır.
    ```bash
    docker-compose up -d
    ```

4.  **Backend'i Çalıştırın:**
    Yeni bir terminal açın ve `backend` dizinine gidin.
    ```bash
    cd backend
    npm install
    npm run dev
    ```
    API sunucusu `http://localhost:5000` adresinde çalışmaya başlayacaktır.

5.  **Frontend'i Çalıştırın:**
    Yeni bir terminal daha açın ve `frontend` dizinine gidin.
    ```bash
    cd frontend
    npm install
    npm run dev
    ```
    Uygulama arayüzü `http://localhost:5173` (veya Vite'ın verdiği farklı bir port) adresinde çalışmaya başlayacaktır.

Artık uygulamaya tarayıcınızdan erişebilirsiniz!

## 📂 Proje Dokümantasyonu

Bu proje, geliştirme sürecinin her aşamasını belgeleyen kapsamlı bir dokümantasyon setine sahiptir.

- **Ürün Gereksinimleri (PRD):** Projenin v1.0, v2.0 ve v3.0 için hedeflenen özelliklerini ve kullanıcı hikayelerini içerir.
- **Teknik Mimari:** Teknoloji yığını, sistem mimarisi ve tasarım kararlarını detaylandırır.
- **Veritabanı Şeması:** PostgreSQL veritabanı modelini ve tablolar arasındaki ilişkileri gösterir.
- **API Endpoint Listesi:** Backend tarafından sunulan tüm API yollarını, metotlarını ve açıklamalarını listeler.
- **Geliştirme Görevleri:** Proje boyunca tamamlanan ve planlanan tüm görevlerin listesi.
