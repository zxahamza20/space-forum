import React from 'react';
import { Link } from 'react-router-dom';
import { FaRocket, FaClock, FaComment, FaQuestionCircle, FaLightbulb, FaComments, FaImage } from 'react-icons/fa';
import { getEmbedVideoUrl } from '../utils/videoHelper';

const PostCard = ({ post, onUpvote }) => {
  const formattedDate = new Date(post.created_at).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const renderCategoryBadge = (category) => {
    switch (category) {
      case 'Question':
        return <span className="badge badge-question"><FaQuestionCircle /> Question</span>;
      case 'Opinion':
        return <span className="badge badge-opinion"><FaLightbulb /> Opinion</span>;
      case 'Media':
        return <span className="badge badge-media"><FaImage /> Media</span>;
      default:
        return <span className="badge badge-discussion"><FaComments /> Discussion</span>;
    }
  };

  const embedVideoUrl = post.media_type === 'video' ? getEmbedVideoUrl(post.media_url) : null;

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

        {post.media_url && (
          <div className="post-card-media-preview">
            {post.media_type === 'video' && embedVideoUrl ? (
              <div className="video-responsive-preview">
                <iframe
                  src={embedVideoUrl}
                  title={post.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            ) : post.media_type === 'image' ? (
              <div className="post-card-image">
                <img src={post.media_url} alt={post.title} loading="lazy" />
              </div>
            ) : null}
          </div>
        )}

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