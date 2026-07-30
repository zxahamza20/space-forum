import React from 'react';
import { Link } from 'react-router-dom';
import { FaRocket, FaClock, FaComment } from 'react-icons/fa';

const PostCard = ({ post, onUpvote }) => {
  const formattedDate = new Date(post.created_at).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="post-card">
      {post.media_url && post.media_type === 'image' && (
        <div className="post-card-image">
          <img src={post.media_url} alt={post.title} loading="lazy" />
        </div>
      )}

      <div className="post-card-content">
        <div className="post-card-header">
          <span className="post-author">By {post.author || 'Anonymous'}</span>
          <span className="post-date">
            <FaClock className="icon" /> {formattedDate}
          </span>
        </div>

        <h2 className="post-card-title">
          <Link to={`/post/${post.id}`}>{post.title}</Link>
        </h2>

        <p className="post-card-excerpt">
          {post.content.length > 150
            ? `${post.content.substring(0, 150)}...`
            : post.content}
        </p>

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