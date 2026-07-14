const db = require('../config/db');

const BarberGallery = {
  /**
   * Adds a new photo to a barber's gallery.
   * @param {object} photoData
   * @param {string} photoData.barber_id
   * @param {string} photoData.image_url
   * @param {string} [photoData.description]
   * @returns {Promise<object>} The created gallery photo.
   */
  addPhoto: async ({ barber_id, image_url, description }) => {
    const query = `
      INSERT INTO barber_gallery_photos (barber_id, image_url, description)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const values = [barber_id, image_url, description];
    const { rows } = await db.query(query, values);
    return rows[0];
  },

  /**
   * Updates an existing gallery photo's description.
   * @param {string} photoId
   * @param {string} description
   * @returns {Promise<object>} The updated gallery photo.
   */
  updatePhoto: async (photoId, { description }) => {
    const query = `
      UPDATE barber_gallery_photos
      SET description = $1
      WHERE id = $2
      RETURNING *;
    `;
    const { rows } = await db.query(query, [description, photoId]);
    return rows[0];
  },

  /**
   * Deletes a gallery photo.
   * @param {string} photoId
   * @returns {Promise<void>}
   */
  deletePhoto: async (photoId) => {
    const query = 'DELETE FROM barber_gallery_photos WHERE id = $1;';
    await db.query(query, [photoId]);
  },
};

module.exports = BarberGallery;