import React from 'react';
import Modal from 'react-modal';
import { FaTimes } from 'react-icons/fa';

Modal.setAppElement('#root');

const CustomModal = ({ isOpen, onClose, children, hideCloseButton }) => {
  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      padding: '20px',
      border: 'none',
      borderRadius: '0.5rem',
      boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)',
      maxWidth: '500px',
      width: '100%',
      zIndex: 1050 // Modal por encima del contenido
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 1040 // Fondo del modal por detrás del contenido del modal
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={customStyles}
      contentLabel="FAQ Modal"
    >
      <div className="bg-white p-6 rounded-lg shadow-lg relative">
        {!hideCloseButton && (
          <button
            onClick={onClose}
            className="absolute top-0 right-0 p-2 text-black"
          >
            <FaTimes size={24} />
          </button>
        )}
        {children}
      </div>
    </Modal>
  );
};

export default CustomModal;
