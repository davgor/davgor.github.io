import React from 'react';
import BlogCard from '../components/BlogCard';

const Dogs: React.FC = () => {
  return (
    <BlogCard
      title="My Dogs"
      content={[
        "My dog page will be here"
      ]}
    />
  );
};

export default Dogs;
