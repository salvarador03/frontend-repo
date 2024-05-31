import React from 'react';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';

const ImageGallery = ({ images }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const variants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.8 } }
  };

  return (
    <div ref={ref} className="flex justify-around my-8">
      {images.map((image, index) => (
        <motion.img
          key={index}
          src={image}
          alt={`Gallery image ${index + 1}`}
          className="rounded-lg"
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={variants}
          style={{ width: '30%', height: 'auto' }}
        />
      ))}
    </div>
  );
};

export default ImageGallery;
