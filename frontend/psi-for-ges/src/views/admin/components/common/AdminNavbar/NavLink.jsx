import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const NavLink = ({ label, to, activeTab, setActiveTab }) => {
  const isActive = activeTab === to;

  const linkVariant = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    hover: { scale: 1.1, color: '#000000', backgroundColor: '#f0f0f0', transition: { duration: 0.4 } },
    tap: { scale: 0.95 }
  };

  return (
    <div className="relative mr-5">
      <motion.div
        initial="hidden"
        animate="visible"
        whileHover="hover"
        whileTap="tap"
        variants={linkVariant}
        className={`${isActive ? 'text-white' : 'text-white'} hover:text-white`}
      >
        <Link
          to={to}
          onClick={() => setActiveTab(to)}
          className="block p-2 rounded"
        >
          {label}
        </Link>
      </motion.div>
      {isActive && (
        <motion.div
          layoutId="underline"
          className="h-0.5 bg-gradient-to-r from-yellow-400 to-yellow-600 absolute bottom-0 left-0 right-0"
        />
      )}
    </div>
  );
};

export default NavLink;
