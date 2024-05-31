import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaChevronRight } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);
  
  return (
    <nav aria-label="breadcrumb" className="p-2 bg-gray-100 rounded-md mb-4">
      <motion.ol 
        className="flex space-x-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <li className="flex items-center">
          <Link to="/" className="text-blue-500 hover:underline flex items-center">
            <FaHome className="mr-1" /> Home
          </Link>
          <FaChevronRight className="mx-2 text-gray-500" />
        </li>
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          return (
            <li
              key={to}
              className={`flex items-center ${isLast ? 'text-gray-500' : 'text-blue-500 hover:underline'}`}
              aria-current={isLast ? 'page' : undefined}
            >
              {!isLast ? (
                <>
                  <Link to={to} className="flex items-center">
                    {value}
                  </Link>
                  <FaChevronRight className="mx-2 text-gray-500" />
                </>
              ) : (
                <span>{value}</span>
              )}
            </li>
          );
        })}
      </motion.ol>
    </nav>
  );
};

export default Breadcrumb;
