const db = require('../config/db');

const Report = {
  /**
   * Calculates revenue statistics for a barber within a given date range.
   * @param {string} barberId - The ID of the barber.
   * @param {Date} startDate - The start of the date range.
   * @param {Date} endDate - The end of the date range (exclusive).
   * @returns {Promise<object>} An object containing total_revenue and transaction_count.
   */
  getRevenueStats: async (barberId, startDate, endDate) => {
    const query = `
      SELECT
        COALESCE(SUM(final_price), 0) AS total_revenue,
        COUNT(*) AS transaction_count
      FROM appointments
      WHERE
        barber_id = $1
        AND status = 'completed'
        AND completed_at >= $2
        AND completed_at < $3;
    `;
    const values = [barberId, startDate, endDate];
    const { rows } = await db.query(query, values);

    // SUM'dan gelen numeric tipi float'a çeviriyoruz.
    return {
      total_revenue: parseFloat(rows[0].total_revenue),
      transaction_count: parseInt(rows[0].transaction_count, 10),
    };
  },
};

module.exports = Report;