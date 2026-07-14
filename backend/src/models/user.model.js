const db = require('../config/db');

const User = {
  create: async ({ full_name, email, password_hash, role }) => {
    const query = `
      INSERT INTO users (full_name, email, password_hash, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, full_name, email, role, created_at;
    `;
    const values = [full_name, email, password_hash, role];
    const { rows } = await db.query(query, values);
    return rows[0];
  },

  findByEmail: async (email) => {
    const query = 'SELECT * FROM users WHERE email = $1';
    const { rows } = await db.query(query, [email]);
    return rows[0];
  },

  findById: async (id) => {
    const query = 'SELECT id, full_name, email, role, phone_number, avatar_url, created_at FROM users WHERE id = $1';
    const { rows } = await db.query(query, [id]);
    return rows[0];
  },

  /**
   * Updates an existing user's data.
   * @param {string} id - The ID of the user to update.
   * @param {object} userData - The user data to update { full_name, email, phone_number, avatar_url }.
   * @returns {Promise<object>} The updated user.
   */
  update: async (id, { full_name, email, phone_number, avatar_url }) => {
    // Gelen avatar_url boş bir metin ise, onu null'a çevir.
    // Bu, COALESCE'in veritabanındaki mevcut değeri korumasını sağlar.
    const final_avatar_url = avatar_url === "" ? null : avatar_url;

    const query = `
      UPDATE users
      SET 
        full_name = COALESCE($1, full_name), 
        email = COALESCE($2, email), 
        phone_number = COALESCE($3, phone_number), 
        avatar_url = COALESCE($4, avatar_url) -- Eğer $4 null ise, mevcut avatar_url'yi koru.
      WHERE id = $5
      RETURNING id, full_name, email, role, phone_number, avatar_url, created_at;
    `;
    const values = [full_name, email, phone_number, final_avatar_url, id];
    const { rows } = await db.query(query, values);
    return rows[0];
  },
};

module.exports = User;