import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";

const DeleteModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg">
        <div className="text-center">
          <FaExclamationTriangle className="text-red-500 text-3xl mx-auto mb-4" />
          <h2 className="text-2xl mb-4">¿Estás seguro?</h2>
          <p className="mb-4">¿Realmente deseas eliminar esta publicación? Este proceso no se puede deshacer.</p>
          <button onClick={onConfirm} className="bg-red-500 text-white p-2 rounded w-full mb-2">
            Sí, eliminar
          </button>
          <button onClick={onClose} className="p-2 w-full text-center rounded bg-gray-300 text-gray-700">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
