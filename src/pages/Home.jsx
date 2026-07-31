import React, { useState, useEffect } from 'react';
import { fetchPosts, upvotePost } from '../services/postsService';
import PostCard from '../components/PostCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { FaSearch, FaSort, FaFilter } from 'react-icons/fa';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await fetchPosts({
        searchQuery,
        category: selectedCategory,
        sortBy,
      });
      setPosts(data);
      setError(null);
    } catch (err) {
      setError('Failed to retrieve transmissions from deep space.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadPosts();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, sortBy]);

  const handleUpvote = async (id, currentUpvotes) => {
    try {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === id ? { ...post, upvotes: post.upvotes + 1 } : post
        )
      );
      await upvotePost(id, currentUpvotes);
    } catch (err) {
      console.error('Failed to register upvote:', err);
      loadPosts();
    }
  };

  return (
    <div className="home-container">
      <header className="feed-header">
        <h1>Mission Control Feed</h1>
        <p>Explore recent interstellar discussions and media.</p>
      </header>

      {/* Category Flag Pills */}
      <div className="category-filter-bar">
        <span className="filter-label"><FaFilter /> Filter Flag:</span>
        <div className="category-pills">
          {['', 'Question', 'Opinion', 'Discussion', 'Media'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`pill-btn ${selectedCategory === cat ? 'active' : ''}`}
            >
              {cat === '' ? 'All Signals' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Search & Sort Controls */}
      <div className="filter-bar">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search posts by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="sort-box">
          <label htmlFor="sort-select">
            <FaSort /> Order By:
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="created_at">Newest First</option>
            <option value="upvotes">Most Popular (Upvotes)</option>
          </select>
        </div>
      </div>

      {/* Main Content Render */}
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : posts.length === 0 ? (
        <div className="empty-feed">
          <p>No transmissions found matching your scan.</p>
        </div>
      ) : (
        <div className="posts-feed">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} onUpvote={handleUpvote} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;