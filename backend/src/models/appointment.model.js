// backend/src/models/appointment.model.js
const db = require('../config/db');

const Appointment = {
  /**
   * Finds all appointments for a specific barber on a given date.
   * It only considers 'pending' and 'confirmed' appointments as blocking a slot.
   * @param {string} barberId - The ID of the barber.
   * @param {string} date - The date in 'YYYY-MM-DD' format.
   * @returns {Promise<object[]>} A list of appointments.
   */
  findByBarberAndDate: async (barberId, date) => {
    const query = `
      SELECT * FROM appointments
      WHERE barber_id = $1
        AND appointment_time::date = $2::date
        AND status IN ('pending', 'confirmed');
    `;
    const { rows } = await db.query(query, [barberId, date]);
    return rows;
  },

  /**
   * Creates a new appointment.
   * @param {object} appointmentData - The appointment data.
   * @param {string} appointmentData.customer_id - The ID of the customer.
   * @param {string} appointmentData.barber_id - The ID of the barber.
   * @param {string} appointmentData.appointment_time - The full timestamp of the appointment.
   * @param {string} [appointmentData.notes] - Optional notes from the customer.
   * @returns {Promise<object>} The created appointment.
   */
  create: async ({ customer_id, barber_id, appointment_time, notes }) => {
    const query = `
      INSERT INTO appointments (customer_id, barber_id, appointment_time, notes)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [customer_id, barber_id, appointment_time, notes];
    const { rows } = await db.query(query, values);
    return rows[0];
  },

  /**
   * Checks if a specific appointment slot is already booked.
   * @param {string} barberId - The ID of the barber.
   * @param {string} appointmentTime - The full timestamp to check.
   * @returns {Promise<boolean>} True if the slot is booked, false otherwise.
   */
  isSlotBooked: async (barberId, appointmentTime) => {
    const query = `
      SELECT 1 FROM appointments
      WHERE barber_id = $1
        AND appointment_time = $2
        AND status IN ('pending', 'confirmed');
    `;
    const { rows } = await db.query(query, [barberId, appointmentTime]);
    return rows.length > 0;
  },

  /**
   * Finds a single appointment by its ID.
   * @param {string} id - The ID of the appointment.
   * @returns {Promise<object|undefined>} The appointment object or undefined if not found.
   */
  findById: async (id) => {
    const query = 'SELECT * FROM appointments WHERE id = $1';
    const { rows } = await db.query(query, [id]);
    return rows[0];
  },

  /**
   * Updates the status of an appointment.
   * @param {string} id - The ID of the appointment to update.
   * @param {string} status - The new status ('confirmed', 'cancelled', etc.).
   * @returns {Promise<object>} The updated appointment.
   */
  updateStatus: async (id, status) => {
    const query = `
      UPDATE appointments
      SET status = $1
      WHERE id = $2
      RETURNING *;
    `;
    const { rows } = await db.query(query, [status, id]);
    return rows[0];
  },

  /**
   * Finds all appointments for a specific barber, including customer details.
   * Orders appointments by their time.
   * @param {string} barberId - The ID of the barber.
   * @returns {Promise<object[]>} A list of appointments with customer info.
   */
  findForBarber: async (barberId) => {
    const query = `
      SELECT
        a.id,
        a.appointment_time,
        a.status,
        a.notes,
        a.created_at,
        u.full_name as customer_name,
        u.phone_number as customer_phone
      FROM appointments a
      JOIN users u ON a.customer_id = u.id
      WHERE a.barber_id = $1
      ORDER BY a.appointment_time ASC;
    `;
    const { rows } = await db.query(query, [barberId]);
    return rows;
  },

  /**
   * Müşterinin kendi randevularını bulur (berber ve dükkan adı ile birlikte)
   * @param {string} customerId
   * @returns {Promise<object[]>}
   */
  findForCustomer: async (customerId) => {
    const query = `
      SELECT
        a.id,
        a.appointment_time,
        a.status,
        a.notes,
        a.created_at,
        u.full_name AS barber_name,
        bp.shop_name
      FROM appointments a
      JOIN users u ON a.barber_id = u.id
      LEFT JOIN barber_profiles bp ON a.barber_id = bp.user_id
      WHERE a.customer_id = $1
      ORDER BY a.appointment_time DESC;
    `;
    const { rows } = await db.query(query, [customerId]);
    return rows;
  },

  /**
   * Marks an appointment as completed and records the financial details.
   * @param {string} id - The ID of the appointment.
   * @param {object} details
   * @param {number} details.finalPrice - The final price charged.
   * @param {string} details.serviceName - The name of the service performed.
   * @returns {Promise<object>} The completed appointment.
   */
  complete: async (id, { finalPrice, serviceName }) => {
    const query = `
      UPDATE appointments
      SET
        status = 'completed',
        final_price = $1,
        performed_service_name = $2,
        completed_at = now()
      WHERE id = $3
      RETURNING *;
    `;
    const values = [finalPrice, serviceName, id];
    const { rows } = await db.query(query, values);
    return rows[0];
  },
};

module.exports = Appointment;