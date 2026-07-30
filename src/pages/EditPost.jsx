import React from 'react';
import { useParams } from 'react-router-dom';

const EditPost = () => {
  const { id } = useParams();
  return (
    <div className="page-container">
      <h1>Modify Transmission #{id}</h1>
    </div>
  );
};

export default EditPost;