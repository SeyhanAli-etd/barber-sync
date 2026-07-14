import React, { useState } from 'react';
import './ReviewForm.css';

const StarRating = ({ rating, setRating }) => {
  return (
    <div className="star-rating">
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <span
            key={ratingValue}
            className={ratingValue <= rating ? 'star filled' : 'star'}
            onClick={() => setRating(ratingValue)}
          >
            ★
          </span>
        );
      })}
    </div>
  );
};

const ReviewForm = ({ appointment, onSubmit, onCancel }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Lütfen 1-5 arası bir puan verin.');
      return;
    }
    setError('');
    setLoading(true);
    try {
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
    <div className="review-form-modal">
      <h3>{appointment.barber_name} için Yorum Yap</h3>
      <p>{new Date(appointment.appointment_time).toLocaleString('tr-TR')} randevusu</p>
      <form onSubmit={handleSubmit}>
        {error && <p className="error-message">{error}</p>}
        <div className="form-group">
          <label>Puanınız</label>
          <StarRating rating={rating} setRating={setRating} />
        </div>
        <div className="form-group">
          <label>Yorumunuz (isteğe bağlı)</label>
          <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows="4" placeholder="Deneyiminizi paylaşın..." />
        </div>
        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={onCancel} disabled={loading}>İptal</button>
          <button type="submit" disabled={loading}>{loading ? 'Gönderiliyor...' : 'Yorumu Gönder'}</button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;