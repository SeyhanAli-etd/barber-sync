const db = require('../config/db');

const Review = {
  /**
   * Creates a new review for a completed appointment.
   * @param {object} reviewData
   * @param {string} reviewData.appointment_id
   * @param {string} reviewData.customer_id
   * @param {string} reviewData.barber_id
   * @param {number} reviewData.rating
   * @param {string} [reviewData.comment]
   * @returns {Promise<object>} The created review.
   */
  create: async ({ appointment_id, customer_id, barber_id, rating, comment }) => {
    const query = `
      INSERT INTO reviews (appointment_id, customer_id, barber_id, rating, comment)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [appointment_id, customer_id, barber_id, rating, comment];
    const { rows } = await db.query(query, values);
    return rows[0];
  },

  /**
   * Finds all reviews for a specific barber, including customer details.
   * @param {string} barberId - The ID of the barber.
   * @returns {Promise<object[]>} A list of reviews with customer info.
   */
  findByBarberId: async (barberId) => {
    const query = `
      SELECT
        r.id,
        r.rating,
        r.comment,
        r.created_at,
        u.full_name as customer_name,
        u.avatar_url as customer_avatar_url
      FROM reviews r
      JOIN users u ON r.customer_id = u.id
      WHERE r.barber_id = $1
      ORDER BY r.created_at DESC;
    `;
    const { rows } = await db.query(query, [barberId]);
    return rows;
  },

  /**
   * Checks if a review for a given appointment already exists.
   * @param {string} appointmentId
   * @returns {Promise<boolean>}
   */
  existsForAppointment: async (appointmentId) => {
    const query = 'SELECT 1 FROM reviews WHERE appointment_id = $1';
    const { rows } = await db.query(query, [appointmentId]);
    return rows.length > 0;
  },
};

module.exports = Review;