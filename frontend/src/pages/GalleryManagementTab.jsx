import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getMyBarberProfile } from '../services/profileService'; // To get current gallery
import { uploadGalleryPhoto, updateGalleryPhoto, deleteGalleryPhoto } from '../services/barberGalleryService';
import ImageUpload from '../components/ImageUpload';
import Modal from '../components/Modal';
import './GalleryManagementTab.css';

const GalleryManagementTab = () => {
  const { user } = useAuth();
  const [galleryPhotos, setGalleryPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newImageFile, setNewImageFile] = useState(null);
  const [newImageDescription, setNewImageDescription] = useState('');
  const [editPhoto, setEditPhoto] = useState(null); // Photo being edited

  const fetchGalleryPhotos = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      // We fetch the full barber profile which includes the gallery
      const profile = await getMyBarberProfile();
      setGalleryPhotos(profile.gallery || []);
    } catch (err) {
      setError(err.message || 'Galeri fotoğrafları yüklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleryPhotos();
  }, [user?.id]);

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!newImageFile) {
      setError('Lütfen bir fotoğraf seçin.');
      return;
    }
    setError('');
    try {
      const formData = new FormData();
      formData.append('image', newImageFile);
      formData.append('description', newImageDescription);
      await uploadGalleryPhoto(formData);
      setNewImageFile(null);
      setNewImageDescription('');
      fetchGalleryPhotos(); // Refresh list
    } catch (err) {
      setError(err.message || 'Fotoğraf yüklenirken bir hata oluştu.');
    }
  };

  const handleUpdateDescription = async (photoId, newDescription) => {
    try {
      await updateGalleryPhoto(photoId, { description: newDescription });
      fetchGalleryPhotos(); // Refresh list
      setEditPhoto(null); // Close modal
    } catch (err) {
      setError(err.message || 'Açıklama güncellenirken bir hata oluştu.');
    }
  };

  const handleDeletePhoto = async (photoId) => {
    if (window.confirm('Bu fotoğrafı silmek istediğinizden emin misiniz?')) {
      try {
        await deleteGalleryPhoto(photoId);
        fetchGalleryPhotos(); // Refresh list
      } catch (err) {
        setError(err.message || 'Fotoğraf silinirken bir hata oluştu.');
      }
    }
  };

  if (loading) return <div>Galeri yükleniyor...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="gallery-management-container">
      <h3>Yeni Fotoğraf Yükle</h3>
      <form onSubmit={handleUploadSubmit} className="upload-form">
        <ImageUpload currentAvatar={null} onFileSelect={setNewImageFile} />
        <input type="text" value={newImageDescription} onChange={(e) => setNewImageDescription(e.target.value)} placeholder="Açıklama (isteğe bağlı)" />
        <button type="submit" disabled={!newImageFile}>Yükle</button>
      </form>

      <h3>Mevcut Galeri Fotoğrafları</h3>
      {galleryPhotos.length === 0 ? (
        <p>Henüz galeri fotoğrafı bulunmamaktadır.</p>
      ) : (
        <div className="gallery-grid">
          {galleryPhotos.map(photo => (
            <div key={photo.id} className="gallery-item-manage">
              <img src={`http://localhost:5000/${photo.image_url}`} alt={photo.description} />
              <p>{photo.description || 'Açıklama yok'}</p>
              <div className="item-actions">
                <button onClick={() => setEditPhoto(photo)}>Düzenle</button>
                <button onClick={() => handleDeletePhoto(photo.id)} className="btn-cancel">Sil</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editPhoto && (
        <Modal onClose={() => setEditPhoto(null)}>
          <form onSubmit={(e) => { e.preventDefault(); handleUpdateDescription(editPhoto.id, editPhoto.description); }} className="edit-description-form">
            <h3>Açıklamayı Düzenle</h3>
            <img src={`http://localhost:5000/${editPhoto.image_url}`} alt="Düzenlenen fotoğraf" className="edit-preview-img" />
            <textarea value={editPhoto.description} onChange={(e) => setEditPhoto({ ...editPhoto, description: e.target.value })} rows="3" />
            <div className="modal-actions">
              <button type="button" onClick={() => setEditPhoto(null)} className="btn-secondary">İptal</button>
              <button type="submit">Kaydet</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default GalleryManagementTab;