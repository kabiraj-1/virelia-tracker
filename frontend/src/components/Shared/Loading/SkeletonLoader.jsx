import React from 'react';
import { motion } from 'framer-motion';

const SkeletonLoader = ({ type = 'card', count = 1 }) => {
  const skeletons = Array.from({ length: count }, (_, i) => i);

  const getSkeletonClass = () => {
    switch (type) {
      case 'card': return 'h-32 rounded-lg';
      case 'list': return 'h-16 rounded';
      case 'chart': return 'h-64 rounded-lg';
      default: return 'h-32 rounded-lg';
    }
  };

  return (
    <div className="space-y-4">
      {skeletons.map((item) => (
        <motion.div
          key={item}
          className={`bg-gray-200 dark:bg-gray-700 ${getSkeletonClass()}`}
          initial={{ opacity: 0.6 }}
          animate={{ 
            opacity: [0.6, 1, 0.6],
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity,
            delay: item * 0.1 
          }}
        />
      ))}
    </div>
  );
};

export default SkeletonLoader;