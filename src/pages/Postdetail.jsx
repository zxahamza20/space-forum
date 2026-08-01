import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchPostWithParent, upvotePost, flagPost, createRepost } from '../services/postsService';
import { fetchCommentsByPostId, createComment } from '../services/commentsService';
import LoadingSpinner from '../components/LoadingSpinner';
import { getEmbedVideoUrl } from '../utils/videoHelper';
import { FaRocket, FaEdit, FaClock, FaUser, FaComment, FaFlag, FaRetweet, FaArrowLeft, FaLink, FaHashtag } from 'react-icons/fa';
import './PostDetail.css';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [authorAlias, setAuthorAlias] = useState('');
  const [loading, setLoading] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [flagged, setFlagged] = useState(false);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [postData, commentsData] = await Promise.all([
        fetchPostWithParent(id),
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

  const handleFlag = async () => {
    if (flagged || !post) return;
    try {
      await flagPost(post.id, post.flags || 0);
      setFlagged(true);
      alert('Transmission flagged for review.');
    } catch (err) {
      console.error('Error flagging post:', err);
    }
  };

  const handleRepost = async () => {
    if (!post) return;
    const author = prompt('Enter your alias for this repost:');
    if (author === null) return; 
    
    try {
      const repost = await createRepost(post, author || 'Anonymous Stargazer');
      navigate(`/post/${repost.id}`);
    } catch (err) {
      setError('Failed to mirror transmission.');
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
  const embedVideoUrl = post.media_type === 'video' ? getEmbedVideoUrl(post.media_url) : null;

  const parentFormattedDate = post.parent_post 
    ? new Date(post.parent_post.created_at).toLocaleString()
    : null;

  return (
    <div className="post-detail-container">
      <div className="detail-actions">
        <Link to="/" className="btn-secondary">
          <FaArrowLeft /> Back to Feed
        </Link>
        <div className="post-admin-actions">
          <Link to={`/edit/${post.id}`} className="btn-secondary">
            <FaEdit /> Edit / Delete
          </Link>
        </div>
      </div>

      <article className="post-detail-content">
        <div className="detail-header-tags">
          <span className="category-tag">{post.category || 'Discussion'}</span>
        </div>
        
        <h1>{post.title}</h1>
        
        <div className="post-meta">
          <span><FaUser /> {post.author || 'Anonymous'}</span>
          <span><FaClock /> {formattedDate}</span>
          <span className="post-id-display">
            <FaHashtag /> ID: <span className="post-id-text">{post.id}</span>
          </span>
        </div>

        {post.parent_post && (
          <div className="parent-post-container">
            <div className="parent-post-header">
              <FaLink className="parent-link-icon" />
              <span>Reposted From:</span>
            </div>
            <div className="parent-post-card">
              <Link to={`/post/${post.parent_post.id}`} className="parent-post-link">
                <div className="parent-post-content">
                  <div className="parent-post-badge">
                    <span className="parent-category-tag">{post.parent_post.category || 'Discussion'}</span>
                  </div>
                  <h3 className="parent-post-title">{post.parent_post.title}</h3>
                  <div className="parent-post-meta">
                    <span><FaUser /> {post.parent_post.author || 'Anonymous'}</span>
                    <span><FaClock /> {parentFormattedDate}</span>
                  </div>
                  {post.parent_post.content && (
                    <p className="parent-post-excerpt">
                      {post.parent_post.content.length > 200
                        ? `${post.parent_post.content.substring(0, 200)}...`
                        : post.parent_post.content}
                    </p>
                  )}
                  <span className="parent-post-view-link">Click to view original →</span>
                </div>
              </Link>
            </div>
          </div>
        )}

        {post.media_url && (
          <div className="post-media-container">
            {post.media_type === 'video' && embedVideoUrl ? (
              <div className="video-responsive">
                <iframe
                  src={embedVideoUrl}
                  title={post.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            ) : post.media_type === 'image' ? (
              <img src={post.media_url} alt={post.title} className="post-detail-image" />
            ) : null}
          </div>
        )}

        {post.content && (
          <div className="post-body-text">
            <p>{post.content}</p>
          </div>
        )}

        <div className="post-interaction-bar">
          <button onClick={handleUpvote} className="upvote-btn-large">
            <FaRocket /> {post.upvotes} Upvotes
          </button>
          
          <button onClick={handleRepost} className="btn-secondary">
            <FaRetweet /> Repost
          </button>

          <button 
            onClick={handleFlag} 
            className={`btn-secondary ${flagged ? 'flagged' : ''}`}
            disabled={flagged}
          >
            <FaFlag /> {flagged ? 'Flagged' : 'Flag Signal'}
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