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
        u.id as user_id,
        u.full_name,
        u.email,
        u.phone_number,
        bp.id as profile_id,
        bp.shop_name,
        bp.address,
        bp.working_hours,
        bp.avatar_url
      FROM users u
      INNER JOIN barber_profiles bp ON u.id = bp.user_id
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
    const query = `
      SELECT
        u.id as user_id,
        u.full_name,
        u.email,
        u.phone_number,
        bp.id as profile_id,
        bp.shop_name,
        bp.address,
        bp.working_hours,
        bp.avatar_url
      FROM users u
      LEFT JOIN barber_profiles bp ON u.id = bp.user_id
      WHERE u.id = $1 AND u.role = 'barber';
    `;
    const { rows } = await db.query(query, [userId]);
    return rows[0];
  },

  /**
   * Creates or updates a barber's profile.
   * @param {object} profileData - The profile data.
   * @returns {Promise<object>} The created/updated profile.
   */
  upsert: async ({ user_id, shop_name, address, working_hours, avatar_url }) => {
    const query = `
      INSERT INTO barber_profiles (user_id, shop_name, address, working_hours, avatar_url)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (user_id) DO UPDATE SET
        shop_name = EXCLUDED.shop_name,
        address = EXCLUDED.address,
        working_hours = EXCLUDED.working_hours,
        avatar_url = EXCLUDED.avatar_url
      RETURNING *;
    `;
    const values = [user_id, shop_name, address, working_hours, avatar_url];
    const { rows } = await db.query(query, values);
    return rows[0];
  },
};

module.exports = BarberProfile;