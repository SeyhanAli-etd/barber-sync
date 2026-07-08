# PRD v3.0: Barber-Sync (Gelişmiş Profil ve Etkileşim)

Bu doküman, Barber-Sync projesinin v2.0 (Ciro Takibi) sürümünden sonra geliştirilmesi planlanan özellikleri ve iyileştirmeleri tanımlar.

## 1. Amaç

v3.0'ın temel amacı, kullanıcı deneyimini zenginleştirmek, müşteri ile berber arasındaki etkileşimi artırmak ve platforma daha fazla değer katmaktır. Bu sürüm, berberlerin dükkanlarını daha iyi tanıtmalarını, müşterilerin ise daha bilinçli seçimler yapmalarını sağlayacaktır.

## 2. Yeni Özellik Listesi (Features)

### F-09: Puanlama ve Yorum Sistemi

- **Açıklama:** Müşteriler, tamamladıkları randevular sonrasında hizmet aldıkları berberlere puan verebilir ve yorum yazabilirler.
- **Kullanıcı Hikayesi (Müşteri):** "Bir müşteri olarak, randevu alacağım berberin diğer müşterilerden aldığı puanları ve yorumları görmek istiyorum, böylece hizmet kalitesi hakkında fikir edinebilirim."
- **Kullanıcı Hikayesi (Berber):** "Bir berber olarak, müşterilerimden aldığım olumlu yorumları profilimde sergileyerek yeni müşteriler çekmek istiyorum."
- **Detaylar:**
    - 1-5 arası yıldızla puanlama.
    - Yorum metni alanı.
    - Berber profil sayfasında ortalama puanın ve son yorumların listelenmesi.

### F-10: Harita Entegrasyonu ve Yol Tarifi

- **Açıklama:** Berberin adresi, profil sayfasında interaktif bir harita üzerinde gösterilir ve kullanıcılar tek tıkla yol tarifi alabilir.
- **Kullanıcı Hikayesi (Müşteri):** "Bir müşteri olarak, randevu alacağım berber dükkanının tam konumunu haritada görmek ve telefonumdaki harita uygulamasıyla kolayca yol tarifi almak istiyorum."
- **Detaylar:**
    - Berber profiline `react-leaflet` veya `google-maps-react` gibi bir kütüphane ile harita bileşeni eklenmesi.
    - "Yol Tarifi Al" butonunun, kullanıcıyı cihazındaki varsayılan harita uygulamasına (Google Maps, Apple Maps vb.) yönlendirmesi.

### F-11: Fotoğraf Galerisi
- **Açıklama:** Berberlerin dükkanlarından ve yaptıkları işlerden fotoğraflar yükleyebileceği bir galeri bölümü.

## 3. Teknik Etkiler ve Gereksinimler

- **Veritabanı:**
    - `reviews` adında yeni bir tablo oluşturulması gerekecek.
      - `id`, `appointment_id`, `customer_id`, `barber_id`, `rating` (INTEGER), `comment` (TEXT), `created_at`
    - `barber_profiles` tablosuna hizmetler/fiyatlar ve galeri için `jsonb` veya ayrı tablolar eklenebilir.
    - `barber_profiles` tablosuna harita için `latitude` ve `longitude` (numeric) kolonları eklenebilir.
- **Backend:**
    - Yorum oluşturma, listeleme ve silme için yeni API endpoint'leri (`/api/barbers/:id/reviews`).
    - Berber profilini güncellemek için (hizmetler, galeri) mevcut endpoint'lerin genişletilmesi.

- **Frontend:**
    - Yorum yapma formu (modal veya ayrı bir sayfa).
    - Berber profilinde puanları, yorumları ve haritayı gösterecek yeni bileşenler.
    - Harita kütüphanesi entegrasyonu.