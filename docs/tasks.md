# Barber-Sync - Geliştirme Görevleri

Bu dosya, projenin geliştirme görevlerini takip etmek için kullanılır.
## 🚧 Yapılacaklar (To Do)

### Backend
- [ ] Socket.IO ile bildirim altyapısını kur

### Frontend
- [ ] Proje iskeletini oluştur (Vite + React)
- [ ] Ana sayfa tasarımını yap
- [ ] Kayıt ve Giriş formlarını oluştur
- [ ] Berber listeleme sayfasını oluştur
- [ ] Berber detay ve randevu alma takvimi bileşenini oluştur
- [ ] Müşteri "Randevularım" sayfasını oluştur
- [ ] Berber "Randevu Talepleri" panelini oluştur
- [ ] Bildirimleri gösterecek UI bileşenini ekle

## ⏳ Üzerinde Çalışılan (In Progress)


## ✅ Tamamlananlar (Done)

- [x] Proje dokümantasyon yapısını oluştur (architecture, prd, tasks)
- [x] Yerel geliştirme ortamını kur (WSL, Docker)
- [x] Veritabanı tablolarını oluştur (users, barber_profiles, appointments)
- [x] Kullanıcı kayıt (register) API endpoint'ini oluştur
- [x] Kullanıcı giriş (login) ve JWT oluşturma API endpoint'ini oluştur
- [x] JWT ile korumalı rota (protected route) oluşturma ve test etme
- [x] Role göre yetkilendirme (authorization) middleware'i oluşturma (örn. sadece berberler)
- [x] Berberleri listeleyen API endpoint'ini oluştur
- [x] Berberin kendi profilini oluşturma/güncelleme (`PUT`) ve getirme (`GET`) API endpoint'lerini oluştur
- [x] Müşterinin randevu oluşturma API endpoint'ini oluştur (sunucu taraflı saat kontrolü ile)
- [x] Berberin randevu onaylama/reddetme API endpoint'ini oluştur
- [x] Berberin randevu taleplerini listeleyeceği API endpoint'ini oluştur
## 🗳️ Backlog (v2.0 için Planlananlar)

- [ ] **v2.0:** Puanlama ve yorum sistemi altyapısını kur (Backend & DB)
- [ ] **v2.0:** Harita entegrasyonu için berber profiline koordinat ekle (Backend & DB)
- [ ] **v2.0:** Gelişmiş profil özellikleri (hizmetler, galeri) için altyapı kur (Backend & DB)
- [ ] **v2.0:** Müşterinin yorum yapma ve puan verme arayüzünü oluştur (Frontend)
- [ ] **v2.0:** Berber profilinde harita, yorumlar ve galeriyi göster (Frontend)

### v3.0 için Planlananlar (Ciro Takibi)

- [ ] **v3.0:** Hizmet/fiyat listesi altyapısını kur (Backend & DB: `services` tablosu).
- [ ] **v3.0:** Berberin hizmetlerini (saç, sakal vb.) ve fiyatlarını yönetebileceği API endpoint'lerini oluştur (Backend).
- [ ] **v3.0:** Randevuyu tamamlarken yapılan hizmeti ve ücreti kaydetme altyapısını kur (Backend & DB).
- [ ] **v3.0:** Berberin günlük ve aylık cirosunu hesaplayan API endpoint'ini oluştur (Backend).
- [ ] **v3.0:** Berberin hizmetlerini yönetebileceği arayüzü oluştur (Frontend).
- [ ] **v3.0:** Berberin randevu tamamlama ve hizmet seçme arayüzünü oluştur (Frontend).
- [ ] **v3.0:** Berberin ciro raporlarını görebileceği dashboard ekranını oluştur (Frontend).