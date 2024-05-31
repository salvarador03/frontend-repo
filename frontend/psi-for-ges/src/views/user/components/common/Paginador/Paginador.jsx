import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Paginador = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex items-center justify-center mt-4">
      <button
        className={`p-2 ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600'}`}
        onClick={handlePrevPage}
        disabled={currentPage === 1}
      >
        <FaChevronLeft />
      </button>
      <span className="mx-4 text-gray-700">
        Página {currentPage} de {totalPages}
      </span>
      <button
        className={`p-2 ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600'}`}
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
      >
        <FaChevronRight />
      </button>
    </div>
  );
};

export default Paginador;