import React from 'react';
import { useParams } from 'react-router-dom';

const PostDetail = () => {
  const { id } = useParams();
  return (
    <div className="page-container">
      <h1>Transmission #{id}</h1>
    </div>
  );
};

export default PostDetail;