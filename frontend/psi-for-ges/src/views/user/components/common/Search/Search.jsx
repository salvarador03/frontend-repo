import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Fuse from 'fuse.js';
import { sampleData } from './Data';
import { motion } from 'framer-motion';
import { FaSearch, FaArrowLeft } from 'react-icons/fa';

const Search = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query');
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchResults = () => {
      if (query) {
        const options = {
          includeScore: true,
          threshold: 0.3,
          keys: ['name', 'description', 'relatedTerms']
        };

        const fuse = new Fuse(sampleData, options);
        const result = fuse.search(query);
        setResults(result.map(res => res.item));
      } else {
        setResults([]);
      }
    };

    fetchResults();
  }, [query]);

  const animationVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="py-16 px-4 mt-72">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6 mb-10 md:p-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={animationVariants}
          transition={{ duration: 1 }}
        >
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 flex items-center justify-center">
            <FaSearch className="mr-2" /> Resultados de búsqueda para "{query}"
          </h2>
          {results.length > 0 ? (
            <motion.ul 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="space-y-4"
            >
              {results.map(result => (
                <motion.li 
                  key={result.id} 
                  initial={{ x: -20, opacity: 0 }} 
                  animate={{ x: 0, opacity: 1 }} 
                  transition={{ duration: 0.2 }}
                  className="p-4 bg-gray-100 hover:bg-gray-200 transition rounded-md shadow"
                >
                  <Link to={result.link} className="text-lg font-semibold text-blue-600 hover:text-blue-800 flex items-center">
                    <FaArrowLeft className="mr-2" /> {result.name}
                  </Link>
                  <p className="text-gray-600">{result.description}</p>
                </motion.li>
              ))}
            </motion.ul>
          ) : (
            <p className="text-gray-600 text-center">No se encontraron resultados.</p>
          )}
          <div className="mt-6 text-center">
            <Link to="/" className="text-blue-500 hover:text-blue-700 flex items-center justify-center">
              <FaArrowLeft className="mr-2" /> Volver a la página principal
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Search;
