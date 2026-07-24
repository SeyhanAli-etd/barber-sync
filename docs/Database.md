# Barber-Sync - Veritabanı Tasarımı (PostgreSQL)

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
  avatar_url varchar(255)
  created_at timestamp [default: `now()`]
}

Table barber_profiles {
  id uuid [pk, default: `gen_random_uuid()`]
  user_id uuid [ref: > users.id, unique, not null]
  shop_name varchar(150)
  address text
  working_hours jsonb // Örn: {"monday": "09:00-19:00", "tuesday": "09:00-19:00"}
  latitude numeric(9, 6)
  longitude numeric(9, 6)
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

Table barber_gallery_photos {
  id uuid [pk, default: `gen_random_uuid()`]
  barber_id uuid [ref: > users.id, not null]
  image_url varchar(255) [not null]
  description text
  created_at timestamp [default: `now()`]
}

Table reviews {
  id uuid [pk, default: `gen_random_uuid()`]
  appointment_id uuid [ref: > appointments.id, unique, not null]
  customer_id uuid [ref: > users.id, not null]
  barber_id uuid [ref: > users.id, not null]
  rating integer [not null] // 1-5
  comment text
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