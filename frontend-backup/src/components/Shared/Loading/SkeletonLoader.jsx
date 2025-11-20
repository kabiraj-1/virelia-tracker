import React from 'react';

const SkeletonLoader = ({ count = 1, height = '20px', className = '' }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse bg-gray-200 rounded"
          style={{ height }}
        ></div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
