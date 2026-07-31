import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../services/postsService';
import { fetchAstronomyPictureOfDay, searchNasaLibrary } from '../services/nasaService';
import { uploadMediaFile } from '../services/storageService';
import { FaRocket, FaSearch, FaFileUpload } from 'react-icons/fa';

const CreatePost = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
    secret_key: '',
    media_url: '',
    media_type: 'image',
    category: 'Question',
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFetchAPOD = async () => {
    try {
      setLoading(true);
      const apod = await fetchAstronomyPictureOfDay();
      setFormData((prev) => ({
        ...prev,
        title: prev.title || apod.title,
        content: prev.content || apod.description,
        media_url: apod.url,
        media_type: apod.mediaType === 'video' ? 'video' : 'image',
        category: 'Media',
      }));
    } catch (err) {
      setError('Failed to fetch NASA APOD data.');
    } finally {
      setLoading(false);
    }
  };

  const handleNasaSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    try {
      setIsSearching(true);
      const results = await searchNasaLibrary(searchQuery);
      setSearchResults(results);
    } catch (err) {
      setError('Error retrieving NASA images.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectNasaImage = (item) => {
    setFormData((prev) => ({
      ...prev,
      title: prev.title || item.title,
      content: prev.content || item.description,
      media_url: item.url,
      media_type: 'image',
      category: 'Media',
    }));
    setSearchResults([]);
    setSearchQuery('');
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadingFile(true);
      const publicUrl = await uploadMediaFile(file);
      setFormData((prev) => ({
        ...prev,
        media_url: publicUrl,
        media_type: 'image',
      }));
    } catch (err) {
      setError('Failed to upload file to storage.');
    } finally {
      setUploadingFile(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content || !formData.secret_key) {
      setError('Please fill out all required fields (Title, Content, Secret Key).');
      return;
    }

    try {
      setLoading(true);
      const newPost = await createPost({
        title: formData.title,
        content: formData.content,
        author: formData.author.trim() || 'Anonymous',
        secret_key: formData.secret_key,
        media_url: formData.media_url,
        media_type: formData.media_type,
        category: formData.category,
      });
      navigate(`/post/${newPost.id}`);
    } catch (err) {
      setError('Failed to create transmission.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-container">
      <h1>Transmit New Space Discussion</h1>
      {error && <p className="error-message">{error}</p>}

      {/* NASA Media Integration Helper */}
      <div className="nasa-helper-section">
        <h3>Import NASA Media</h3>
        <div className="nasa-buttons">
          <button type="button" onClick={handleFetchAPOD} disabled={loading} className="btn-secondary">
            <FaRocket /> Fetch Picture of the Day
          </button>
        </div>

        <form onSubmit={handleNasaSearch} className="nasa-search-form">
          <input
            type="text"
            placeholder="Search NASA library (e.g., Hubble, Mars, Orion)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" disabled={isSearching} className="btn-secondary">
            <FaSearch /> Search
          </button>
        </form>

        {searchResults.length > 0 && (
          <div className="nasa-results-grid">
            {searchResults.map((item) => (
              <div key={item.id} className="nasa-result-card" onClick={() => handleSelectNasaImage(item)}>
                <img src={item.url} alt={item.title} />
                <p>{item.title}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <hr className="divider" />

      {/* Main Post Form */}
      <form onSubmit={handleSubmit} className="post-form">
        <div className="form-group">
          <label>Post Flag / Characteristic *</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="Question">❓ Question</option>
            <option value="Opinion">💡 Opinion</option>
            <option value="Discussion">💬 Discussion</option>
            <option value="Media">🌌 Media / Discovery</option>
          </select>
        </div>

        <div className="form-group">
          <label>Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter transmission title"
            required
          />
        </div>

        <div className="form-group">
          <label>Author Alias</label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            placeholder="Anonymous Stargazer"
          />
        </div>

        <div className="form-group">
          <label>Secret Key * (Required to Edit/Delete)</label>
          <input
            type="password"
            name="secret_key"
            value={formData.secret_key}
            onChange={handleChange}
            placeholder="Passcode for authorization"
            required
          />
        </div>

        <div className="form-group">
          <label>Media Attachment Type</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="media_type"
                value="image"
                checked={formData.media_type === 'image'}
                onChange={handleChange}
              /> Image URL
            </label>
            <label>
              <input
                type="radio"
                name="media_type"
                value="video"
                checked={formData.media_type === 'video'}
                onChange={handleChange}
              /> Web Video (YouTube / Vimeo)
            </label>
          </div>

          <input
            type="url"
            name="media_url"
            value={formData.media_url}
            onChange={handleChange}
            placeholder={
              formData.media_type === 'video'
                ? 'https://www.youtube.com/watch?v=...'
                : 'https://...'
            }
          />
        </div>

        <div className="form-group">
          <label><FaFileUpload /> Or Upload Image File</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploadingFile}
          />
          {uploadingFile && <small>Uploading file to deep space storage...</small>}
        </div>

        <div className="form-group">
          <label>Transmission Content *</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows="6"
            placeholder="Share your thoughts on cosmic phenomena..."
            required
          ></textarea>
        </div>

        <button type="submit" className="btn-primary" disabled={loading || uploadingFile}>
          {loading ? 'Transmitting...' : 'Send Transmission'}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;