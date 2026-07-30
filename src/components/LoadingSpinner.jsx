import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="spinner-container">
      <div className="spinner"></div>
      <p>Scanning frequencies...</p>
    </div>
  );
};

export default LoadingSpinner;