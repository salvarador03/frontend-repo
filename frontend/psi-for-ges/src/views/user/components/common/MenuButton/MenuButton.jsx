import React, { useState, useEffect } from 'react';
import { FaWhatsapp, FaArrowUp, FaBars, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const MenuButton = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [showButton, setShowButton] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 0) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!showButton) {
      setShowMenu(false);
    }
  }, [showButton]);

  return (
    <>
      <AnimatePresence>
        {showButton && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.5 }}
            className="fixed bottom-5 right-5 z-50 flex flex-col items-center space-y-3"
          >
            {showMenu && (
              <motion.button
                onClick={scrollToTop}
                initial={{ opacity: 0, y: 70 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 70 }}
                transition={{ duration: 0.5 }}
                className="bg-blue-500 rounded-full p-4 shadow-lg flex items-center justify-center"
              >
                <FaArrowUp className="text-white text-2xl" />
              </motion.button>
            )}

            <motion.button
              onClick={() => setShowMenu(prev => !prev)}
              className="bg-green-500 rounded-full p-4 shadow-lg flex items-center justify-center"
            >
              {showMenu ? <FaTimes className="text-white text-2xl" /> : <FaBars className="text-white text-2xl" />}
            </motion.button>

            {showMenu && (
              <motion.a
                href="https://wa.me/34662093620"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: 70 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 70 }}
                transition={{ duration: 0.5 }}
                className="bg-green-600 rounded-full p-4 shadow-lg flex items-center justify-center"
              >
                <FaWhatsapp className="text-white text-2xl" />
              </motion.a>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MenuButton;
