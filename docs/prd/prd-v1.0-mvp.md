# PRD v1.0: Barber-Sync (MVP)

## 1. Amaç ve Hedef Kitle

**Amaç:** Berberler ve müşteriler arasında kolay, hızlı ve dijital bir randevu süreci oluşturmak. Kağıt-kalem ve telefon trafiğini ortadan kaldırmak.

**Hedef Kitle:**
- **Müşteriler:** Akıllı telefon kullanan, randevularını online yönetmek isteyen kişiler.
- **Berberler:** Randevu defterini dijitalleştirmek, müşteri takibini kolaylaştırmak ve boş zamanlarını verimli kullanmak isteyen küçük ve orta ölçekli berber dükkanları.

## 2. Kullanıcı Rolleri ve Yetkileri

- **Müşteri:**
  - Kayıt olabilir, giriş yapabilir.
  - Berberleri listeleyebilir.
  - Berberin takviminden uygun bir zamana randevu talebi gönderebilir.
  - Kendi randevularını görebilir (bekleyen, onaylanan, iptal edilen).
  - Randevu onay/iptal bildirimlerini alır.

- **Berber:**
  - Kayıt olabilir, giriş yapabilir.
  - Profilini (dükkan adı, çalışma saatleri) düzenleyebilir.
  - Gelen randevu taleplerini görebilir.
  - Randevu taleplerini onaylayabilir veya reddedebilir.
  - Yeni randevu talebi için bildirim alır.
  - Kendi takvimini (onaylanmış randevular) görebilir.

## 3. Özellik Listesi (Features)

- **F-01:** Kullanıcı Kayıt ve Giriş Sistemi (Müşteri ve Berber için ortak)
- **F-02:** Berber Listeleme ve Profil Görüntüleme
- **F-03:** Randevu Oluşturma Akışı (Müşteri için takvim arayüzü)
- **F-04:** Randevu Yönetim Paneli (Berber için talep listesi)
- **F-05:** Gerçek Zamanlı Bildirim Sistemi

## 4. Kapsam Dışı (Out of Scope for v1.0)

- Ödeme entegrasyonu
- Müşteri yorumları ve puanlama sistemi
- SMS/E-posta bildirimleri (sadece anlık bildirim olacak)
- Kampanya ve indirim modülü