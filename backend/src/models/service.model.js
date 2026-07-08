const db = require('../config/db');

const Service = {
  /**
   * Creates a new service for a barber.
   * @param {object} serviceData
   * @param {string} serviceData.barber_id
   * @param {string} serviceData.name
   * @param {number} serviceData.price
   * @param {number} serviceData.duration_minutes
   * @returns {Promise<object>} The created service.
   */
  create: async ({ barber_id, name, price, duration_minutes }) => {
    const query = `
      INSERT INTO services (barber_id, name, price, duration_minutes)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [barber_id, name, price, duration_minutes];
    const { rows } = await db.query(query, values);
    return rows[0];
  },

  /**
   * Finds all active services for a specific barber.
   * @param {string} barberId - The ID of the barber.
   * @returns {Promise<object[]>} A list of services.
   */
  findByBarberId: async (barberId) => {
    const query = `
      SELECT * FROM services
      WHERE barber_id = $1 AND is_active = TRUE
      ORDER BY name ASC;
    `;
    const { rows } = await db.query(query, [barberId]);
    return rows;
  },

  /**
   * Finds a single service by its ID.
   * @param {string} id - The ID of the service.
   * @returns {Promise<object|undefined>} The service object or undefined if not found.
   */
  findById: async (id) => {
    const query = 'SELECT * FROM services WHERE id = $1';
    const { rows } = await db.query(query, [id]);
    return rows[0];
  },

  /**
   * Updates an existing service.
   * @param {string} id - The ID of the service to update.
   * @param {object} serviceData
   * @param {string} serviceData.name
   * @param {number} serviceData.price
   * @param {number} serviceData.duration_minutes
   * @returns {Promise<object>} The updated service.
   */
  update: async (id, { name, price, duration_minutes }) => {
    const query = `
      UPDATE services
      SET name = $1, price = $2, duration_minutes = $3
      WHERE id = $4
      RETURNING *;
    `;
    const values = [name, price, duration_minutes, id];
    const { rows } = await db.query(query, values);
    return rows[0];
  },

  /**
   * Soft deletes a service by setting is_active to false.
   * @param {string} id - The ID of the service to delete.
   * @returns {Promise<object>} The updated service with is_active = false.
   */
  remove: async (id) => {
    const query = `
      UPDATE services
      SET is_active = FALSE
      WHERE id = $1
      RETURNING *;
    `;
    const { rows } = await db.query(query, [id]);
    return rows[0];
  },
};

module.exports = Service;