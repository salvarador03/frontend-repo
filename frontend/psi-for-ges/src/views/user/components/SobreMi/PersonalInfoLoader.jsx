import React from 'react';
import { motion } from 'framer-motion';

const curtainVariants = {
  hidden: { height: '0%' },
  visible: { height: '100%', transition: { duration: 1 } },
  exit: { opacity: 0, transition: { duration: 2 } }
};

const PersonalInfoLoader = () => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={curtainVariants}
      className="fixed inset-0 bg-white flex items-center justify-center z-50"
    >
      <div className="loader-content">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
      </div>
    </motion.div>
  );
};

export default PersonalInfoLoader;
