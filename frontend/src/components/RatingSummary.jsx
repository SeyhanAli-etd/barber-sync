import React from 'react';
import './RatingSummary.css';

const RatingSummary = ({ reviews }) => {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="rating-summary">
        <h4>Değerlendirme</h4>
        <p>Henüz yorum yapılmamış.</p>
      </div>
    );
  }

  const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
  const averageRating = (totalRating / reviews.length).toFixed(1);

  return (
    <div className="rating-summary">
      <h4>Değerlendirme ({reviews.length})</h4>
      <div className="summary-content">
        <span className="average-rating">{averageRating}</span>
        <div className="summary-stars">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={i < Math.round(averageRating) ? 'star filled' : 'star'}>★</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RatingSummary;