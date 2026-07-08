# PRD v2.0: Barber-Sync (Ciro Takibi ve Yönetimi)

## 1. Amaç

v2.0'ın temel amacı, Barber-Sync uygulamasını basit bir randevu aracından, berberlerin işlerini yönetebilecekleri temel bir finansal araca dönüştürmektir. Bu sürüm, berberlerin gelirlerini takip etmelerini, hizmetlerini dijital olarak yönetmelerini ve iş performanslarını anlamalarını sağlayacaktır.

## 2. Kullanıcı Rolleri ve Yetkileri

- **Berber:**
  - Kendi hizmet menüsünü (saç, sakal, vb.) fiyat ve süre bilgileriyle oluşturabilir, güncelleyebilir ve silebilir.
  - Onaylanmış bir randevuyu "tamamlandı" olarak işaretleyebilir.
  - Bir randevuyu tamamlarken, hangi hizmetin verildiğini seçebilir ve gerekirse standart fiyattan farklı bir nihai ücret girebilir.
  - Günlük ve aylık toplam cirosunu ve işlem sayısını gösteren bir raporlama ekranını görebilir.

## 3. Özellik Listesi (Features)

### F-06: Hizmet Yönetimi (CRUD)
- **Açıklama:** Berberin, sunduğu hizmetleri ve bu hizmetlerin standart fiyat/süre bilgilerini yönetebileceği bir arayüz.
- **Kullanıcı Hikayesi:** "Bir berber olarak, müşterilerime sunduğum 'Saç Kesimi', 'Sakal Tıraşı' gibi hizmetleri fiyatları ve ne kadar sürdükleri ile birlikte sisteme eklemek istiyorum, böylece randevuları ve ciromu daha kolay yönetebilirim."

### F-07: Randevu Tamamlama ve Ciroya İşleme
- **Açıklama:** Berberin, tamamladığı bir randevuyu sisteme işlemesini sağlayan akış.
- **Kullanıcı Hikayesi:** "Bir berber olarak, bir müşterinin randevusu bittiğinde, bu işlemi 'tamamlandı' olarak işaretlemek, hangi hizmeti verdiğimi seçmek ve aldığım ücreti kaydederek günlük ciroma eklemek istiyorum."

### F-08: Ciro Raporları Paneli
- **Açıklama:** Berberin, finansal performansını takip edebileceği basit bir raporlama ekranı.
- **Kullanıcı Hikayesi:** "Bir berber olarak, bugün ne kadar kazandığımı ve bu ay toplamda ne kadar ciro yaptığımı tek bir ekrandan hızlıca görmek istiyorum."

## 4. Teknik Etkiler ve Gereksinimler

- **Veritabanı:**
  - `services` adında yeni bir tablo oluşturulması.
  - `appointments` tablosuna `final_price`, `performed_service_name`, `completed_at` kolonlarının eklenmesi.

- **Backend:**
  - Hizmet yönetimi için `/api/services` üzerinde tam CRUD endpoint'leri.
  - Randevu tamamlama için `/api/appointments/:id/complete` endpoint'i.
  - Ciro raporları için `/api/reports/revenue` endpoint'i.

- **Frontend:**
  - Berberler için "Hizmet Yönetimi", "Randevu Paneli" ve "Ciro Raporları" sayfalarının oluşturulması.
  - Randevu tamamlama işlemi için bir modal (pencere) bileşeni.