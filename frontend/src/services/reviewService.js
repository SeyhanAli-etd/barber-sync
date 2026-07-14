import api from './api';

/**
 * Creates a new review for an appointment.
 * @param {object} reviewData - { appointment_id, rating, comment }
 * @returns {Promise<object>} The created review.
 */
export const createReview = async (reviewData) => {
  const response = await api.post('/reviews', reviewData);
  return response.data;
};

/**
 * Gets all reviews for a specific barber.
 * @param {string} barberId
 * @returns {Promise<Array>} A list of reviews.
 */
export const getBarberReviews = async (barberId) => {
    const response = await api.get(`/reviews/barber/${barberId}`);
    return response.data;
};