import React from 'react';
import { Link } from 'react-router-dom';
import { FaTasks, FaClipboardList } from 'react-icons/fa';
import { motion } from 'framer-motion';

const GestionPage = () => {
  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-100">
      <motion.h1 
        className="text-4xl mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        Opciones de Gestión
      </motion.h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Link to="/frontend-repo/admin/kanban/casos">
          <motion.div 
            className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaTasks className="text-blue-500 text-6xl mb-4" />
            <h2 className="text-2xl font-semibold">Gestión de Casos</h2>
          </motion.div>
        </Link>
        <Link to="/frontend-repo/admin/gestion-servicios">
          <motion.div 
            className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaClipboardList className="text-green-500 text-6xl mb-4" />
            <h2 className="text-2xl font-semibold">Gestión de Servicios</h2>
          </motion.div>
        </Link>
      </div>
    </div>
  );
};

export default GestionPage;
