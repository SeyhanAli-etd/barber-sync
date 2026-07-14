const db = require('../config/db');

const Report = {
  /**
   * Belirtilen tarih aralığı için bir berberin ciro ve işlem sayısı istatistiklerini alır.
   * @param {string} barberId
   * @param {string} startDate
   * @param {string} endDate
   * @returns {Promise<object>}
   */
  getRevenueStats: async (barberId, startDate, endDate) => {
    const query = `
      SELECT
        COALESCE(SUM(final_price), 0) AS total_revenue,
        COUNT(id) AS transaction_count
      FROM appointments
      WHERE barber_id = $1
        AND status = 'completed'
        AND completed_at >= $2 AND completed_at < $3;
    `;
    const { rows } = await db.query(query, [barberId, startDate, endDate]);
    return rows[0];
  },

  /**
   * Bir berber için son 12 ayın aylık ciro özetini alır.
   * @param {string} barberId
   * @returns {Promise<object[]>}
   */
  getMonthlyRevenue: async (barberId) => {
    const query = `
      SELECT
        to_char(date_trunc('month', completed_at), 'YYYY-MM') AS month,
        SUM(final_price) AS total_revenue
      FROM
        appointments
      WHERE
        barber_id = $1
        AND status = 'completed'
        AND completed_at IS NOT NULL
        AND completed_at >= date_trunc('month', now() - interval '11 months')
      GROUP BY
        date_trunc('month', completed_at)
      ORDER BY
        date_trunc('month', completed_at) ASC;
    `;
    const { rows } = await db.query(query, [barberId]);
    return rows;
  },
};

module.exports = Report;