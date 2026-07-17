import React, { useState, useRef } from 'react';
import './ImageUpload.css';

const ImageUpload = ({ currentAvatar, onFileSelect }) => {
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileSelect(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Harici sitelere bağımlılığı ve ağ hatalarını önlemek için kendi SVG yer tutucumuz.
  const placeholderSvg = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iNzUiIGN5PSI3NSIgcj0iNzUiIGZpbGw9IiM0NDQiLz48L3N2Zz4=";

  // Construct the full URL for the current avatar, assuming backend serves it from root
  const avatarSrc = preview 
    ? preview 
    : (currentAvatar ? `http://localhost:5000/${currentAvatar}` : placeholderSvg);

  return (
    <div className="image-upload-container" onClick={() => fileInputRef.current.click()}>
      <img 
        src={avatarSrc} 
        alt="Profile Avatar" 
        className="avatar-preview" 
        onError={(e) => { e.target.onerror = null; e.target.src = placeholderSvg; }}/>
      <div className="upload-overlay">
        <span>Değiştir</span>
      </div>
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/png, image/jpeg, image/webp" style={{ display: 'none' }} />
    </div>
  );
};

export default ImageUpload;