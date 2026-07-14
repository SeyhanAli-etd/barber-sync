const db = require('../config/db');

const BarberProfile = {
  /**
   * Finds all barbers who have a profile.
   * Joins users and barber_profiles tables.
   * @returns {Promise<object[]>} A list of barber profiles.
   */
  findAll: async () => {
    const query = `
      SELECT
        u.id as id,
        u.full_name,
        u.email,
        u.phone_number,
        bp.id as profile_id,
        bp.shop_name,
        bp.address,
        bp.working_hours,
        bp.latitude,
        bp.longitude,
        u.avatar_url,  -- Avatar artık 'users' tablosundan geliyor
        COALESCE(rev.avg_rating, 0) as average_rating,
        COALESCE(rev.review_count, 0) as review_count
      FROM users u
      LEFT JOIN barber_profiles bp ON u.id = bp.user_id
      LEFT JOIN (
          SELECT
              barber_id,
              AVG(rating) as avg_rating,
              COUNT(id) as review_count
          FROM reviews
          GROUP BY barber_id
      ) as rev ON u.id = rev.barber_id
      WHERE u.role = 'barber';
    `;
    const { rows } = await db.query(query);
    return rows;
  },

  /**
   * Finds a single barber's profile by their user ID.
   * @param {string} userId - The user's ID.
   * @returns {Promise<object|undefined>} The barber profile or undefined.
   */
  findByUserId: async (userId) => {
    // İki sorguyu aynı anda (paralel) çalıştırmak için Promise.all kullanıyoruz.
    // Bu, arka arkaya çalıştırmaktan daha performanslıdır.
    const [profileRes, servicesRes, galleryRes, reviewsRes] = await Promise.all([
      // 1. Berberin profil bilgilerini çek
      db.query(
        `SELECT u.id, u.full_name, u.email, bp.shop_name, bp.address, bp.working_hours, u.avatar_url, bp.latitude, bp.longitude
         FROM users u
         LEFT JOIN barber_profiles bp ON u.id = bp.user_id
         WHERE u.id = $1 AND u.role = 'barber'`,
        [userId]
      ),
      // 2. Berbere ait aktif hizmetleri çek
      db.query(
        `SELECT id, name, price, duration_minutes FROM services WHERE barber_id = $1 AND is_active = true ORDER BY name`,
        [userId]
      ),
      // 3. Berberin galeri fotoğraflarını çek
      db.query(
        `SELECT id, image_url, description FROM barber_gallery_photos WHERE barber_id = $1 ORDER BY created_at DESC`,
        [userId]
      ),
      // 4. Berberin yorumlarını çek
      db.query(
        `SELECT r.id, r.rating, r.comment, r.created_at, u.full_name as customer_name, u.avatar_url as customer_avatar_url
         FROM reviews r
         JOIN users u ON r.customer_id = u.id
         WHERE r.barber_id = $1
         ORDER BY r.created_at DESC
         LIMIT 10
        `,
        [userId]
      )
    ]);

    if (profileRes.rows.length === 0) {
      return null;
    }

    const profile = profileRes.rows[0];
    const services = servicesRes.rows;
    const gallery = galleryRes.rows;
    const reviews = reviewsRes.rows;

    // Profil bilgisine hizmetleri de ekleyerek tek bir obje olarak döndür.
    return { ...profile, services, gallery, reviews };
  },

  /**
   * Creates or updates a barber's profile.
   * @param {object} profileData - The profile data.
   * @returns {Promise<object>} The created/updated profile.
   */
  upsert: async ({ user_id, shop_name, address, working_hours, latitude, longitude }) => {
    const query = `
      INSERT INTO barber_profiles (user_id, shop_name, address, working_hours, latitude, longitude)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (user_id) DO UPDATE SET
        shop_name = COALESCE(EXCLUDED.shop_name, barber_profiles.shop_name),
        address = COALESCE(EXCLUDED.address, barber_profiles.address),
        working_hours = COALESCE(EXCLUDED.working_hours, barber_profiles.working_hours),
        latitude = COALESCE(EXCLUDED.latitude, barber_profiles.latitude),
        longitude = COALESCE(EXCLUDED.longitude, barber_profiles.longitude)
      RETURNING *;
    `;
    const values = [user_id, shop_name, address, working_hours, latitude, longitude];
    const { rows } = await db.query(query, values);
    return rows[0];
  },
};

module.exports = BarberProfile;