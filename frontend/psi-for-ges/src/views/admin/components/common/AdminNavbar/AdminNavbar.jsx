import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaSearch, FaUser, FaPlusCircle, FaCalendarAlt, FaTasks } from 'react-icons/fa';
import { useLanguage } from '../../../../user/components/features/Context/LanguageProvider';
import AdminProfileButton from '../../AdminProfileButton/AdminProfileButton';
import IconWrapper from '../../../../user/components/common/Navbar/IconWrapper';
import NavLink from './NavLink';
import { useAuth } from '../../../../user/components/features/Context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const AdminNavbar = () => {
  const [messages, setMessages] = useState({});
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('/');
  const [isSticky, setIsSticky] = useState(false);
  const { language } = useLanguage();
  const apiEndpoint = import.meta.env.VITE_API_ENDPOINT;
  const { isLoggedIn, user } = useAuth();
  const [showAddPublication, setShowAddPublication] = useState(false); // For dropdown
  const [isSearchOpen, setIsSearchOpen] = useState(false); // Estado del buscador
  const [searchQuery, setSearchQuery] = useState(''); // Estado del query de búsqueda
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${apiEndpoint}/messages?lang=${language}`)
      .then(response => response.json())
      .then(data => setMessages(data))
      .catch(error => console.error('Error loading the messages:', error));
  }, [language, apiEndpoint]);

  const toggleMenuMobile = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSearch = () => {
    navigate(`/search?query=${searchQuery}`);
    setIsSearchOpen(false);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <header className="fixed top-0 w-full bg-blue-500 z-50 text-white">
      <div className="container mx-auto flex flex-wrap p-5 items-center justify-between">
        {isSearchOpen ? (
          <div className="flex items-center w-full space-x-4">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full border border-gray-300 p-2 rounded pl-10 text-black"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-600" />
            </div>
            <button onClick={handleSearch} className="text-black"><FaSearch /></button>
            <button onClick={() => setIsSearchOpen(false)} className="text-black"><FaTimes /></button>
          </div>
        ) : (
          <>
            <div className="flex items-center space-x-6">
              <Link to="/" className="flex title-font font-medium items-center text-white mb-4 md:mb-0">
                <img src="/src/assets/img/logo.svg" alt="Pablo Alvarado logo" className="w-16 h-16" />
              </Link>
              <div className="hidden md:flex items-center space-x-24">
                {[
                  { key: 1, label: messages['text.navbar.sobremi'], link: '/sobremi' },
                  { key: 2, label: messages['text.navbar.servicios'], link: '/servicios' },
                  { key: 3, label: messages['text.navbar.preguntas'], link: '/admin/faq' },
                  { key: 4, label: messages['text.navbar.publicaciones'], link: '/admin/publicaciones' },
                  { key: 5, label: messages['text.navbar.contacto'], link: '/contacto' },
                ].map((item) => (
                  <NavLink
                    key={item.key}
                    label={item.label}
                    to={item.link}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    className="text-white hover:text-gray-300"
                  />
                ))}
                <div className="flex items-center space-x-6">
                  <IconWrapper><button onClick={() => setIsSearchOpen(true)} className="hover:text-gray-300"><FaSearch /></button></IconWrapper>
                  <IconWrapper>
                    <button onClick={() => setShowAddPublication(prev => !prev)} className="relative hover:text-gray-300">
                      <FaPlusCircle />
                      {showAddPublication && (
                        <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg py-2 z-50">
                          <Link to="/admin/crear-publicaciones" className="block px-4 py-2 text-black hover:bg-gray-200">Añadir Publicacion</Link>
                          <Link to="/admin/nuevo-caso" className="block px-4 py-2 text-black hover:bg-gray-200">Añadir Caso</Link>
                        </div>
                      )}
                    </button>
                  </IconWrapper>
                  <IconWrapper><Link to="/agenda" className="hover:text-gray-300"><FaCalendarAlt /></Link></IconWrapper>
                  <IconWrapper><Link to="/admin/gestion" className="hover:text-gray-300"><FaTasks /></Link></IconWrapper>
                  {isLoggedIn && (
                    <AdminProfileButton user={user} />
                  )}
                </div>
              </div>
            </div>

            <div className="md:hidden flex justify-center w-full relative z-50">
              <motion.button
                onClick={toggleMenuMobile}
                key={isMenuOpen ? "open" : "closed"}
                initial={{ opacity: 0, rotate: 90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                className="z-50 text-white"
              >
                {isMenuOpen ? <FaTimes /> : <FaBars />}
              </motion.button>
            </div>

            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  className="md:hidden bg-blue-700 p-4 text-center fixed top-0 left-0 w-full h-full z-40 flex flex-col justify-center text-white"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="mt-20 space-y-6">
                    {[
                      { key: 1, label: messages['text.navbar.sobremi'], link: '/sobremi' },
                      { key: 2, label: messages['text.navbar.servicios'], link: '/servicios' },
                      { key: 3, label: messages['text.navbar.preguntas'], link: '/admin/faq' },
                      { key: 4, label: messages['text.navbar.publicaciones'], link: '/admin/publicaciones' },
                      { key: 5, label: messages['text.navbar.contacto'], link: '/contacto' },
                    ].map((item) => (
                      <NavLink
                        key={item.key}
                        label={item.label}
                        to={item.link}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        className="text-white hover:text-gray-300"
                      />
                    ))}
                    <div className="flex justify-center mt-4 space-x-6">
                      <IconWrapper><button onClick={() => setIsSearchOpen(true)} className="hover:text-gray-300"><FaSearch /></button></IconWrapper>
                      <IconWrapper>
                        <button onClick={() => setShowAddPublication(prev => !prev)} className="relative hover:text-gray-300">
                          <FaPlusCircle />
                          {showAddPublication && (
                            <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg py-2 z-50">
                              <Link to="/admin/crear-publicaciones" className="block px-4 py-2 text-black hover:bg-gray-200">Añadir Publicacion</Link>
                              <Link to="/admin/nuevo-caso" className="block px-4 py-2 text-black hover:bg-gray-200">Añadir Caso</Link>
                            </div>
                          )}
                        </button>
                      </IconWrapper>
                      <IconWrapper><Link to="/agenda" className="hover:text-gray-300"><FaCalendarAlt /></Link></IconWrapper>
                      <IconWrapper><Link to="/admin/gestion" className="hover:text-gray-300"><FaTasks /></Link></IconWrapper>
                      {isLoggedIn && (
                        <AdminProfileButton user={user} />
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </header>
  );
};

export default AdminNavbar;
