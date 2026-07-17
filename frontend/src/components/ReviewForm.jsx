import React, { useState } from 'react';
import './ReviewForm.css';

const StarRatingInput = ({ rating, setRating }) => {
  return (
    <div className="star-rating-input">
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <label key={ratingValue}>
            <input
              type="radio"
              name="rating"
              value={ratingValue}
              onClick={() => setRating(ratingValue)}
              style={{ display: 'none' }}
            />
            <span className={`star ${ratingValue <= rating ? 'filled' : ''}`}>★</span>
          </label>
        );
      })}
    </div>
  );
};

const ReviewForm = ({ appointment, onSubmit, onCancel }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Lütfen 1-5 arası bir puan verin.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      // The parent component's onSubmit will handle the API call and success logic.
      // We await it and catch errors to display them in the form.
      await onSubmit({
        appointment_id: appointment.id,
        rating,
        comment,
      });
    } catch (err) {
      setError(err.message || 'Yorum gönderilirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="review-form">
      <h3>Deneyiminizi Değerlendirin</h3>
      <p><strong>Berber:</strong> {appointment.barber_name}</p>
      {error && <p className="error-message">{error}</p>}
      <div className="form-group">
        <label>Puanınız:</label>
        <StarRatingInput rating={rating} setRating={setRating} />
      </div>
      <div className="form-group">
        <label>Yorumunuz (isteğe bağlı):</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows="4"
          placeholder="Deneyiminiz hakkında birkaç kelime yazın..."
        />
      </div>
      <div className="modal-actions">
        <button type="button" onClick={onCancel} className="btn-secondary" disabled={loading}>
          İptal
        </button>
        <button type="submit" disabled={loading || rating === 0}>
          {loading ? 'Gönderiliyor...' : 'Yorumu Gönder'}
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;