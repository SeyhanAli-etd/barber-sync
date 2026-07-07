// backend/src/models/barberProfile.model.js
const db = require('../config/db');

const BarberProfile = {
  /**
   * Creates or updates a barber's profile.
   * This is an "upsert" operation.
   * @param {object} profileData - The profile data.
   * @param {string} profileData.user_id - The ID of the user (barber).
   * @param {string} [profileData.shop_name] - The name of the shop.
   * @param {string} [profileData.address] - The address of the shop.
   * @param {object} [profileData.working_hours] - The working hours in JSON format.
   * @param {string} [profileData.avatar_url] - The URL of the avatar image.
   * @returns {Promise<object>} The created or updated profile.
   */
  upsert: async ({ user_id, shop_name, address, working_hours, avatar_url }) => {
    const query = `
      INSERT INTO barber_profiles (user_id, shop_name, address, working_hours, avatar_url)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (user_id)
      DO UPDATE SET
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

  /**
   * Finds a barber's profile by their user ID, joining with the users table.
   * @param {string} user_id - The ID of the user (barber).
   * @returns {Promise<object|undefined>} The combined profile data or undefined if not found.
   */
  findByUserId: async (user_id) => {
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
    const { rows } = await db.query(query, [user_id]);
    return rows[0];
  },

  /**
   * Finds all barbers with an active profile.
   * @returns {Promise<object[]>} A list of barbers.
   */
  findAll: async () => {
    const query = `
      SELECT
        u.id,
        u.full_name,
        bp.shop_name,
        bp.address,
        bp.working_hours,
        bp.avatar_url
      FROM users u
      JOIN barber_profiles bp ON u.id = bp.user_id
      WHERE u.role = 'barber';
    `;
    const { rows } = await db.query(query);
    return rows;
  },
};

module.exports = BarberProfile;