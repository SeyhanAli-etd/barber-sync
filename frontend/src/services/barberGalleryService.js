import api from './api';

/**
 * Uploads a new gallery photo for the logged-in barber.
 * @param {FormData} formData - Contains 'image' file and 'description'.
 * @returns {Promise<object>} The uploaded photo data.
 */
export const uploadGalleryPhoto = async (formData) => {
  const response = await api.post('/profile/gallery', formData, {
    headers: {
      'Content-Type': 'multipart/form-data', // Axios handles this automatically for FormData, but explicit is fine.
    },
  });
  return response.data;
};

/**
 * Updates a gallery photo's description.
 * @param {string} photoId
 * @param {object} data - { description }
 * @returns {Promise<object>} The updated photo data.
 */
export const updateGalleryPhoto = async (photoId, data) => {
  const response = await api.put(`/profile/gallery/${photoId}`, data);
  return response.data;
};

/**
 * Deletes a gallery photo.
 * @param {string} photoId
 * @returns {Promise<void>}
 */
export const deleteGalleryPhoto = async (photoId) => {
  await api.delete(`/profile/gallery/${photoId}`);
};