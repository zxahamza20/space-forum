import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchPostById, updatePost, deletePost } from '../services/postsService';
import LoadingSpinner from '../components/LoadingSpinner';
import { FaTrash, FaSave, FaKey, FaArrowLeft } from 'react-icons/fa';

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
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPost = async () => {
      try {
        setLoading(true);
        const data = await fetchPostById(id);
        setPost(data);
        setFormData({
          title: data.title,
          content: data.content,
          media_url: data.media_url || '',
          media_type: data.media_type || 'image',
        });
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

  const verifySecretKey = () => {
    if (enteredSecretKey !== post.secret_key) {
      setError('Invalid Secret Key! Verification failed.');
      return false;
    }
    return true;
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
          <label>Media URL</label>
          <input
            type="url"
            name="media_url"
            value={formData.media_url}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Transmission Content</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows="6"
            required
          ></textarea>
        </div>

        <div className="action-buttons">
          <button type="submit" className="btn-primary" disabled={submitting}>
            <FaSave /> Save Changes
          </button>
          
          <button
            type="button"
            onClick={handleDelete}
            className="btn-danger"
            disabled={submitting}
          >
            <FaTrash /> Delete Transmission
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPost;