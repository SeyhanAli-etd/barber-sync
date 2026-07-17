import api from './api';

/**
 * Creates a new review for a completed appointment.
 * @param {object} reviewData - The review data.
 * @param {string} reviewData.appointment_id - The ID of the appointment.
 * @param {number} reviewData.rating - The rating from 1 to 5.
 * @param {string} [reviewData.comment] - The review comment (optional).
 * @returns {Promise<object>} The newly created review object.
 */
export const createReview = async (reviewData) => {
  const { data } = await api.post('/reviews', reviewData);
  return data;
};

/**
 * Gets all reviews for a specific barber.
 * @param {string} barberId - The ID of the barber.
 * @returns {Promise<Array<object>>} An array of review objects.
 */
export const getBarberReviews = async (barberId) => {
    const { data } = await api.get(`/reviews/barber/${barberId}`);
    return data;
};