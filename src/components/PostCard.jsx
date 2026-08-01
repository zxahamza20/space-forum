import React from 'react';
import { Link } from 'react-router-dom';
import { FaRocket, FaClock, FaComment } from 'react-icons/fa';
import './PostCard.css';

const PostCard = ({ post, onUpvote }) => {
  const formattedDate = new Date(post.created_at).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const renderCategoryBadge = (category) => {
    switch (category) {
      case 'Question':
        return <span className="badge badge-question">❓ Question</span>;
      case 'Opinion':
        return <span className="badge badge-opinion">💡 Opinion</span>;
      case 'Media':
        return <span className="badge badge-media">🌌 Media</span>;
      default:
        return <span className="badge badge-discussion">💬 Discussion</span>;
    }
  };

  return (
    <div className="post-card">
      <div className="post-card-content">
        <div className="post-card-header">
          <div className="author-and-badge">
            {renderCategoryBadge(post.category || 'Discussion')}
            <span className="post-author">By {post.author || 'Anonymous'}</span>
          </div>
          <span className="post-date">
            <FaClock className="icon" /> {formattedDate}
          </span>
        </div>

        <h2 className="post-card-title">
          <Link to={`/post/${post.id}`}>{post.title}</Link>
        </h2>


        <div className="post-card-footer">
          <button
            className="upvote-btn"
            onClick={(e) => {
              e.preventDefault();
              onUpvote(post.id, post.upvotes);
            }}
          >
            <FaRocket /> {post.upvotes} Upvotes
          </button>

          <Link to={`/post/${post.id}`} className="details-link">
            View Discussion <FaComment />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PostCard;