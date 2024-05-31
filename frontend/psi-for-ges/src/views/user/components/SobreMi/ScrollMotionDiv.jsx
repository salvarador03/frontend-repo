import React from "react";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";

const ScrollMotionDiv = ({ children, direction = 'left', duration = 2, imageDuration = 3 }) => {
  const leftVariant = {
    hidden: { x: -300, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 120, duration: duration } }
  };

  const rightVariant = {
    hidden: { x: 300, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 120, duration: duration } }
  };

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div className="flex mb-24">
      <motion.div
        ref={ref}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={direction === 'left' ? leftVariant : rightVariant}
        className="max-w-7xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-8"
      >
        {children}
      </motion.div>
    </div>
  );
};

export default ScrollMotionDiv;
