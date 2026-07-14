import React from 'react';
import './ReviewCard.css';

const ReviewCard = ({ review }) => {
  const avatarSrc = review.customer_avatar_url
    ? `http://localhost:5000/${review.customer_avatar_url}`
    : "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyMCIgZmlsbD0iIzQ0NCIvPjwvc3ZnPg==";

  return (
    <div className="review-card">
      <div className="review-header">
        <img src={avatarSrc} alt={review.customer_name} className="review-avatar" />
        <div className="review-info">
          <span className="customer-name">{review.customer_name}</span>
          <span className="review-date">{new Date(review.created_at).toLocaleDateString('tr-TR')}</span>
        </div>
        <div className="review-stars">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={i < review.rating ? 'star filled' : 'star'}>★</span>
          ))}
        </div>
      </div>
      {review.comment && <p className="review-comment">"{review.comment}"</p>}
    </div>
  );
};

export default ReviewCard;