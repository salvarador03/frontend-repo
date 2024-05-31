import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const Notification = ({ type, message, isOpen, onClose }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(onClose, 500); // Deja tiempo para que la animación de desaparición termine
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: show ? 1 : 0, y: show ? 0 : 50, scale: show ? 1 : 0.3 }}
      transition={{ duration: 0.5 }}
      className={`fixed bottom-5 right-5 p-4 rounded-lg shadow-lg ${type === 'error' ? 'bg-red-500' : 'bg-green-500'} text-white`}
      style={{ zIndex: 2000 }} // Asegurar que las notificaciones tengan mayor prioridad en el z-index
    >
      {message}
      <button onClick={onClose} className="absolute top-1 right-1 text-lg">&times;</button>
    </motion.div>
  );
};

export default Notification;
