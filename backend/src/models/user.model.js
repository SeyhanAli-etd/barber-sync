// backend/src/models/user.model.js

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
    const query = 'SELECT * FROM users WHERE id = $1';
    const { rows } = await db.query(query, [id]);
    return rows[0];
  },

};

module.exports = User;
