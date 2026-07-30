import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaRocket, FaPlusCircle, FaHome } from 'react-icons/fa';

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
          <FaHome /> Home
        </NavLink>
        <NavLink to="/create" className={({ isActive }) => (isActive ? 'active' : '')}>
          <FaPlusCircle /> Create Post
        </NavLink>
      </nav>
    </header>
  );
};

export default Navbar;