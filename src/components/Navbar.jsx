import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaRocket, FaPlusCircle, FaHome } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  return (
    <header className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="logo">
          <FaRocket className="logo-icon" />
          <span>SpaceForum</span>
        </Link>
      </div>
      <nav className="navbar-links">
        <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')} end>
          <FaHome /> <span>Home</span>
        </NavLink>
        <NavLink to="/create" className={({ isActive }) => (isActive ? 'active' : '')}>
          <FaPlusCircle /> <span>Create Post</span>
        </NavLink>
        <div className="user-badge">
          <FaRocket />
          <span className="user-id">User-7X3K9Q</span>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;