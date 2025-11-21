import React, { useState, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const MediaUpload = ({ onMediaUpload, type = 'post' }) => {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Create preview
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      // Simulate upload process
      simulateUpload(file);
    }
  };

  const simulateUpload = (file) => {
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          
          // Create mock uploaded file data
          const uploadedFile = {
            id: Date.now(),
            url: previewUrl || URL.createObjectURL(file),
            type: file.type.startsWith('image/') ? 'image' : 'video',
            name: file.name,
            size: file.size,
            uploadedAt: new Date().toISOString()
          };

          if (onMediaUpload) {
            onMediaUpload(uploadedFile);
          }

          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div style={{
      background: '#2d3748',
      padding: '1.5rem',
      borderRadius: '0.5rem',
      marginBottom: '1rem'
    }}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*,video/*"
        style={{ display: 'none' }}
      />

      {!previewUrl && !isUploading && (
        <div
          onClick={triggerFileInput}
          style={{
            border: '2px dashed #4a5568',
            borderRadius: '0.5rem',
            padding: '2rem',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>Ì≥Å</div>
          <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>
            Upload Media
          </h3>
          <p style={{ color: '#a0aec0', marginBottom: '1rem' }}>
            Click to upload images or videos
          </p>
        </div>
      )}

      {isUploading && (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>‚è≥</div>
          <h3 style={{ color: 'white', marginBottom: '1rem' }}>Uploading...</h3>
          <div style={{
            width: '100%',
            height: '8px',
            background: '#4a5568',
            borderRadius: '4px',
            overflow: 'hidden',
            marginBottom: '1rem'
          }}>
            <div style={{
              width: `${uploadProgress}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
              borderRadius: '4px',
              transition: 'width 0.3s ease'
            }}></div>
          </div>
          <div style={{ color: '#a0aec0' }}>{uploadProgress}%</div>
        </div>
      )}

      {previewUrl && !isUploading && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>‚úÖ</div>
          <h3 style={{ color: 'white', marginBottom: '1rem' }}>Upload Complete!</h3>
        </div>
      )}
    </div>
  );
};

export default MediaUpload;
