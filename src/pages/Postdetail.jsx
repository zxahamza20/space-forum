import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchPostById, upvotePost } from '../services/postsService';
import { fetchCommentsByPostId, createComment } from '../services/commentsService';
import LoadingSpinner from '../components/LoadingSpinner';
import { FaRocket, FaEdit, FaTrash, FaClock, FaUser, FaComment } from 'react-icons/fa';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [authorAlias, setAuthorAlias] = useState('');
  const [loading, setLoading] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [postData, commentsData] = await Promise.all([
        fetchPostById(id),
        fetchCommentsByPostId(id),
      ]);
      setPost(postData);
      setComments(commentsData);
    } catch (err) {
      setError('Failed to fetch transmission details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleUpvote = async () => {
    if (!post) return;
    try {
      setPost((prev) => ({ ...prev, upvotes: prev.upvotes + 1 }));
      await upvotePost(post.id, post.upvotes);
    } catch (err) {
      console.error('Upvote error:', err);
      loadData();
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setSubmittingComment(true);
      const comment = await createComment({
        post_id: id,
        author: authorAlias.trim() || 'Anonymous Explorer',
        content: newComment,
      });

      setComments((prev) => [...prev, comment]);
      setNewComment('');
    } catch (err) {
      setError('Could not post comment.');
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error || !post) return <div className="error-message">{error || 'Transmission not found.'}</div>;

  const formattedDate = new Date(post.created_at).toLocaleString();

  return (
    <div className="post-detail-container">
      <div className="detail-actions">
        <Link to="/" className="btn-secondary">← Back to Feed</Link>
        <div className="post-admin-actions">
          <Link to={`/edit/${post.id}`} className="btn-secondary">
            <FaEdit /> Edit / Delete
          </Link>
        </div>
      </div>

      <article className="post-detail-content">
        <h1>{post.title}</h1>
        <div className="post-meta">
          <span><FaUser /> {post.author || 'Anonymous'}</span>
          <span><FaClock /> {formattedDate}</span>
        </div>

        {post.media_url && (
          <div className="post-media-container">
            {post.media_type === 'video' ? (
              <iframe
                src={post.media_url}
                title={post.title}
                allowFullScreen
                className="post-video"
              ></iframe>
            ) : (
              <img src={post.media_url} alt={post.title} className="post-detail-image" />
            )}
          </div>
        )}

        <div className="post-body-text">
          <p>{post.content}</p>
        </div>

        <div className="upvote-bar">
          <button onClick={handleUpvote} className="upvote-btn-large">
            <FaRocket /> {post.upvotes} Upvotes
          </button>
        </div>
      </article>

      <hr className="divider" />

      <section className="comments-section">
        <h3><FaComment /> Transmissions Log ({comments.length})</h3>

        <form onSubmit={handleCommentSubmit} className="comment-form">
          <input
            type="text"
            placeholder="Your Alias (Optional)"
            value={authorAlias}
            onChange={(e) => setAuthorAlias(e.target.value)}
          />
          <textarea
            placeholder="Add your response or log entry..."
            rows="3"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            required
          ></textarea>
          <button type="submit" className="btn-primary" disabled={submittingComment}>
            {submittingComment ? 'Sending...' : 'Post Log'}
          </button>
        </form>

        <div className="comments-list">
          {comments.length === 0 ? (
            <p className="no-comments">No log entries recorded yet for this signal.</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="comment-card">
                <div className="comment-header">
                  <strong>{comment.author}</strong>
                  <small>{new Date(comment.created_at).toLocaleDateString()}</small>
                </div>
                <p className="comment-body">{comment.content}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default PostDetail;