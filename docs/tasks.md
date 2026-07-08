# Barber-Sync - Geliştirme Görevleri

Bu dosya, projenin geliştirme görevlerini takip etmek için kullanılır.
## 🚧 Yapılacaklar (To Do)

### Backend

### Frontend
- [x] Proje iskeletini oluştur (Vite + React)
- [x] Sayfalar arası geçiş için routing altyapısını kur (React Router)
- [x] Ana sayfa tasarımını yap
- [x] Kayıt ve Giriş formlarını oluştur
- [x] Berber listeleme sayfasını oluştur
- [x] Berber detay ve randevu alma takvimi bileşenini oluştur
- [x] Müşteri "Randevularım" sayfasını (frontend) oluştur
- [x] Berber "Randevu Talepleri" panelini oluştur
- [x] Kullanıcı profil sayfasını oluştur
- [x] Bildirimleri gösterecek UI bileşenini ve altyapısını ekle

## ⏳ Üzerinde Çalışılan (In Progress)


## ✅ Tamamlananlar (Done)

- [x] Socket.IO ile bildirim altyapısını kur
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
- [x] Müşterinin kendi randevularını listeleyeceği API endpoint'ini oluştur
## 🗳️ Backlog (v2.0 için Planlananlar - Ciro Takibi)

- [x] **v2.0:** Ciro takibi için veritabanı altyapısını kur (`services` tablosu ve `appointments` güncellemesi).
- [x] **v2.0:** Berberin hizmetlerini (saç, sakal vb.) ve fiyatlarını yönetebileceği API endpoint'lerini oluştur (Backend).
- [x] **v2.0:** Randevuyu tamamlarken yapılan hizmeti ve ücreti kaydetme altyapısını kur (Backend & DB).
- [x] **v2.0:** Berberin günlük ve aylık cirosunu hesaplayan API endpoint'ini oluştur (Backend).
- [ ] **v2.0:** Berberin hizmetlerini yönetebileceği arayüzü oluştur (Frontend).
- [x] **v2.0:** Berberin hizmetlerini yönetebileceği arayüzü oluştur (Frontend).
- [x] **v2.0:** Berberin ciro raporlarını görebileceği dashboard ekranını oluştur (Frontend).

### v3.0 için Planlananlar (Gelişmiş Profil ve Etkileşim)

- [ ] **v3.0:** Puanlama ve yorum sistemi altyapısını kur (Backend & DB)
- [ ] **v3.0:** Harita entegrasyonu için berber profiline koordinat ekle (Backend & DB)
- [ ] **v3.0:** Gelişmiş profil özellikleri (hizmetler, galeri) için altyapı kur (Backend & DB)
- [ ] **v3.0:** Müşterinin yorum yapma ve puan verme arayüzünü oluştur (Frontend)
- [ ] **v3.0:** Berber profilinde harita, yorumlar ve galeriyi göster (Frontend)