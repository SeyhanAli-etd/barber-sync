# Barber-Sync - API Endpoint Listesi

Bu doküman, Barber-Sync backend API'sinde bulunan ana endpoint'leri listeler.

| Metot | Yol | Açıklama | Koruma |
|---|---|---|---|
| **Kimlik Doğrulama** | | | |
| `POST` | `/api/auth/register` | Yeni kullanıcı (müşteri/berber) kaydı oluşturur. | Herkese Açık |
| `POST` | `/api/auth/login` | Kullanıcı girişi yapar ve JWT döndürür. | Herkese Açık |
| `GET` | `/api/users/me` | Giriş yapmış kullanıcının bilgilerini döndürür. | Giriş Gerekli |
| **Halka Açık Berber Endpoint'leri** | | | |
| `GET` | `/api/barbers` | Tüm aktif berberleri listeler. | Herkese Açık |
| `GET` | `/api/barbers/:id` | Belirli bir berberin profil detaylarını getirir. | Herkese Açık |
| `GET` | `/api/barbers/:id/availability` | Berberin belirli bir tarihteki müsait saatlerini hesaplar. | Herkese Açık |
| **Berber Profil Yönetimi** | | | |
| `GET` | `/api/profile/me` | Giriş yapmış berberin kendi profilini getirir. | Berber Rolü |
| `PUT` | `/api/profile/me` | Giriş yapmış berberin kendi profilini oluşturur/günceller. | Berber Rolü |
| **Randevu Yönetimi** | | | |
| `POST` | `/api/appointments` | Yeni bir randevu talebi oluşturur. | Müşteri Rolü |
| `GET` | `/api/appointments/my-appointments` | Giriş yapmış müşterinin randevularını listeler. | Müşteri Rolü |
| `GET` | `/api/appointments/my-requests` | Giriş yapmış berberin randevu taleplerini listeler. | Berber Rolü |
| `PATCH`| `/api/appointments/:id/status` | Berberin bir randevunun durumunu (onay/iptal) güncellemesini sağlar. | Berber Rolü |
| `POST` | `/api/appointments/:id/complete` | Berberin bir randevuyu tamamlayıp ciroya işlemesini sağlar. | Berber Rolü |
| **Hizmet Yönetimi (v2.0)** | | | |
| `GET` | `/api/services` | Berberin kendi hizmetlerini listeler. | Berber Rolü |
| `POST` | `/api/services` | Berber için yeni bir hizmet ekler. | Berber Rolü |
| `PUT` | `/api/services/:id` | Berberin bir hizmetini günceller. | Berber Rolü |
| `DELETE`| `/api/services/:id` | Berberin bir hizmetini siler (soft delete). | Berber Rolü |
| **Raporlama (v2.0)** | | | |
| `GET` | `/api/reports/revenue` | Berberin günlük ve aylık ciro raporunu getirir. | Berber Rolü |
| **Yorum ve Puanlama (v3.0)** | | | |
| `POST` | `/api/reviews` | Müşterinin tamamlanmış bir randevuya yorum yapmasını sağlar. | Müşteri Rolü |
| `GET` | `/api/barbers/:id/reviews` | Bir berberin yorumlarını ve ortalama puanını getirir. | Herkese Açık |
