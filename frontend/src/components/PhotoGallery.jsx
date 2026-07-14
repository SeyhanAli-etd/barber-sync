import React, { useState } from 'react';
import Modal from './Modal';
import './PhotoGallery.css';

const PhotoGallery = ({ photos }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  if (!photos || photos.length === 0) {
    return <p>Bu berber için galeri fotoğrafı bulunmamaktadır.</p>;
  }

  const openModal = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <>
      <div className="photo-gallery-grid">
        {photos.map((photo) => (
          <div key={photo.id} className="gallery-item" onClick={() => openModal(photo.image_url)}>
            <img src={`http://localhost:5000/${photo.image_url}`} alt={photo.description || 'Gallery image'} />
          </div>
        ))}
      </div>

      {selectedImage && (
        <Modal onClose={closeModal}>
          <div className="gallery-modal-content">
            <img src={`http://localhost:5000/${selectedImage}`} alt="Enlarged gallery view" />
          </div>
        </Modal>
      )}
    </>
  );
};

export default PhotoGallery;