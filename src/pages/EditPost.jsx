import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchPostById, updatePost, deletePost } from '../services/postsService';
import { uploadMediaFile } from '../services/storageService';
import LoadingSpinner from '../components/LoadingSpinner';
import { FaTrash, FaSave, FaKey, FaArrowLeft, FaFileUpload, FaImage, FaVideo, FaTimes } from 'react-icons/fa';
import './EditPost.css';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    media_url: '',
    media_type: 'image',
  });

  const [enteredSecretKey, setEnteredSecretKey] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [error, setError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [mediaOption, setMediaOption] = useState('url'); 

  useEffect(() => {
    const loadPost = async () => {
      try {
        setLoading(true);
        const data = await fetchPostById(id);
        setPost(data);
        setFormData({
          title: data.title,
          content: data.content || '',
          media_url: data.media_url || '',
          media_type: data.media_type || 'image',
        });
        setPreviewUrl(data.media_url || '');
      } catch (err) {
        setError('Unable to load transmission for editing.');
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleMediaTypeChange = (type) => {
    setFormData((prev) => ({
      ...prev,
      media_type: type,
      media_url: '',
    }));
    setPreviewUrl('');
    setMediaOption('url');
  };

  const verifySecretKey = () => {
    if (enteredSecretKey !== post.secret_key) {
      setError('Invalid Secret Key! Verification failed.');
      return false;
    }
    return true;
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File is too large. Please upload an image under 5MB.');
      return;
    }

    try {
      setUploadingFile(true);
      setError(null);
      const publicUrl = await uploadMediaFile(file);
      setFormData((prev) => ({
        ...prev,
        media_url: publicUrl,
        media_type: 'image',
      }));
      setPreviewUrl(publicUrl);
      setMediaOption('upload');
    } catch (err) {
      setError('Failed to upload file to storage. Please try again.');
    } finally {
      setUploadingFile(false);
    }
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setFormData((prev) => ({
      ...prev,
      media_url: url,
    }));
    setPreviewUrl(url);
    setMediaOption('url');
  };

  const handleRemoveMedia = () => {
    setFormData((prev) => ({
      ...prev,
      media_url: '',
    }));
    setPreviewUrl('');
    setMediaOption('url');
    const fileInput = document.getElementById('file-upload');
    if (fileInput) fileInput.value = '';
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError(null);

    if (!verifySecretKey()) return;

    try {
      setSubmitting(true);
      await updatePost(id, {
        title: formData.title,
        content: formData.content,
        media_url: formData.media_url,
        media_type: formData.media_type,
      });
      navigate(`/post/${id}`);
    } catch (err) {
      setError('Failed to update transmission.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setError(null);

    if (!verifySecretKey()) return;

    const confirmed = window.confirm('Are you sure you want to purge this transmission from orbit?');
    if (!confirmed) return;

    try {
      setSubmitting(true);
      await deletePost(id);
      navigate('/');
    } catch (err) {
      setError('Failed to purge transmission.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error && !post) return <div className="error-message">{error}</div>;

  return (
    <div className="edit-post-container">
      <button onClick={() => navigate(-1)} className="btn-secondary back-btn">
        <FaArrowLeft /> Cancel
      </button>

      <h1>Modify Transmission #{id}</h1>
      {error && <div className="error-banner">{error}</div>}

      <form onSubmit={handleUpdate} className="post-form">
        <div className="form-group auth-group">
          <label><FaKey /> Enter Secret Key (Required for Verification)</label>
          <input
            type="password"
            value={enteredSecretKey}
            onChange={(e) => setEnteredSecretKey(e.target.value)}
            placeholder="Key supplied at creation"
            required
          />
        </div>

        <hr className="divider" />

        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Transmission Content</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows="6"
          />
        </div>

        <div className="form-group media-edit-section">
          <label>Media Attachment</label>
          
          <div className="media-type-selector">
            <button
              type="button"
              className={`media-type-btn ${formData.media_type === 'image' ? 'active' : ''}`}
              onClick={() => handleMediaTypeChange('image')}
            >
              <FaImage /> Image
            </button>
            <button
              type="button"
              className={`media-type-btn ${formData.media_type === 'video' ? 'active' : ''}`}
              onClick={() => handleMediaTypeChange('video')}
            >
              <FaVideo /> Video
            </button>
          </div>

          {previewUrl && (
            <div className="current-media-preview">
              <div className="preview-header">
                <span className="preview-label">Current Media:</span>
                <button
                  type="button"
                  className="remove-media-btn"
                  onClick={handleRemoveMedia}
                >
                  <FaTimes /> Remove
                </button>
              </div>
              {formData.media_type === 'image' ? (
                <img src={previewUrl} alt="Current media" className="preview-image" />
              ) : (
                <div className="preview-video">
                  <span>🎬 Video URL: {previewUrl}</span>
                  {previewUrl && (
                    <a href={previewUrl} target="_blank" rel="noopener noreferrer">
                      View Video
                    </a>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="media-input-options">
            <div className="media-option upload-option">
              <label className="upload-label">
                <FaFileUpload /> Upload from System
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploadingFile || formData.media_type === 'video'}
                />
              </label>
              {uploadingFile && <span className="upload-status">Uploading...</span>}
              {formData.media_type === 'video' && (
                <span className="upload-hint">Upload is only available for images</span>
              )}
            </div>

            <div className="media-option url-option">
              <label>Enter URL from Internet</label>
              <input
                type="url"
                name="media_url"
                value={formData.media_url}
                onChange={handleUrlChange}
                placeholder={
                  formData.media_type === 'video'
                    ? 'https://www.youtube.com/watch?v=...'
                    : 'https://example.com/image.jpg'
                }
                disabled={uploadingFile}
              />
            </div>
          </div>
        </div>

        <div className="action-buttons">
          <button type="submit" className="btn-primary" disabled={submitting || uploadingFile}>
            <FaSave /> {submitting ? 'Saving...' : 'Save Changes'}
          </button>
          
          <button
            type="button"
            onClick={handleDelete}
            className="btn-danger"
            disabled={submitting || uploadingFile}
          >
            <FaTrash /> Delete Transmission
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPost;