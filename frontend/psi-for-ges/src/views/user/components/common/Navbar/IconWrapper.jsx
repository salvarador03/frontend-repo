import React from 'react';
import { motion } from 'framer-motion';

const IconWrapper = ({ children }) => {
  const iconVariant = {
    initial: { y: -20, opacity: 0 },
    enter: { y: 0, opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 120, damping: 20 } },
    hover: {
      scale: 1.2,
      transition: {
        repeat: 1,
        repeatType: 'reverse',
        duration: 0.8 
      }
    },
    tap: { scale: 1.2 }
  };

  return (
    <motion.div variants={iconVariant} initial="initial" animate="enter" whileHover="hover" whileTap="tap">
      {children}
    </motion.div>
  );
};

export default IconWrapper;
