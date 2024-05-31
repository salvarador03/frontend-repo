import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes, FaSearch, FaUser, FaCaretDown } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useLanguage } from '../../../../../context/LenguageProvider';
import LogoSVG from '../../../../../assets/icon/icon';

const NavLink = ({ label, to, activeTab, setActiveTab }) => {
  const isActive = activeTab === to;

  const linkVariant = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    hover: { scale: 1.1, color: '#1a202c', transition: { duration: 0.4 } },
    tap: { scale: 0.95 }
  };

  return (
    <div className="relative mr-5">
      <motion.div
        initial="hidden"
        animate="visible"
        whileHover="hover"
        whileTap="tap"
        variants={linkVariant}
        className={`${isActive ? 'text-gray-900' : 'text-gray-600'} hover:text-gray-900`}
      >
        <Link
          to={to}
          onClick={() => setActiveTab(to)}
          style={{ display: 'block' }}
        >
          {label}
        </Link>
      </motion.div>
      {isActive && (
        <motion.div
          layoutId="underline"
          className="h-0.5 bg-gradient-to-r from-yellow-400 to-yellow-600 absolute bottom-0 left-0 right-0"
        />
      )}
    </div>
  );
};
const UserMenu = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="relative">
      <button onClick={toggleDropdown} className="flex items-center space-x-1 text-gray-900 hover:text-gray-900">
        <span>{user.nombre}</span>
        <FaCaretDown />
      </button>
      {isOpen && (
        <div className="absolute right-0 bg-white shadow-lg mt-2 py-1 w-48">
          <Link to="/frontend-repo/mi-cuenta" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Mi Cuenta</Link>
          <button onClick={onLogout} className="block px-4 py-2 text-sm text-red-500 hover:bg-gray-100 w-full text-left">Cerrar Sesión</button>
        </div>
      )}
    </div>
  );
};

const Navbar = () => {
  const [messages, setMessages] = useState({});
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null); // Aquí guardamos la información del usuario logueado
  const { language, changeLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState('/');
  const apiEndpoint = import.meta.env.VITE_API_ENDPOINT;

  useEffect(() => {
    // Cargar mensajes
    fetch(`${apiEndpoint}/messages?lang=${language}`)
      .then(response => response.json())
      .then(data => setMessages(data))
      .catch(error => console.error('Error loading the messages:', error));

    // Verificar si existe una sesión guardada
    const sessionUser = JSON.parse(localStorage.getItem('userSession'));
    if (sessionUser && new Date().getTime() < sessionUser.expiry) {
      setUser(sessionUser.value);
    }
  }, [language]);

  const handleLogout = () => {
    localStorage.removeItem('userSession');
    setUser(null);
  };

  const toggleMenuMobile = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  return (
    <header className="text-gray-600 body-font">
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        <Link to="/frontend-repo/" className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
          <img src="/src/assets/img/logo.svg" alt="logo" className="w-56 h-56" />
        </Link>

        {isMenuOpen && (
          <div className="md:hidden bg-white p-4 text-center">
            {[
              { key: 1, label: messages['text.navbar.sobremi'], link: '/sobremi' },
              { key: 2, label: messages['text.navbar.consultas'], link: '/consultas' },
              { key: 3, label: messages['text.navbar.servicios'], link: '/servicios' },
              { key: 4, label: messages['text.navbar.problemasatratar'], link: '/problemasatratar' },
              { key: 5, label: messages['text.navbar.preguntas'], link: '/preguntas' },
              { key: 6, label: messages['text.navbar.publicaciones'], link: '/publicaciones' },
              { key: 7, label: messages['text.navbar.contacto'], link: '/contacto' },
            ].map((item) => (
              <NavLink
                key={item.key}
                label={item.label}
                to={item.link}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            ))}
            <div className="flex justify-center mt-4 space-x-4">
              <IconWrapper><Link to="/frontend-repo/search" className="hover:text-gray-900"><FaSearch /></Link></IconWrapper>
              {user ? <UserMenu user={user} onLogout={handleLogout} /> : <IconWrapper><Link to="/frontend-repo/login" className="hover:text-gray-900"><FaUser /></Link></IconWrapper>}
            </div>
          </div>
        )}

        <div className="flex md:hidden justify-center w-full">
          <button onClick={toggleMenuMobile}>{isMenuOpen ? <FaTimes /> : <FaBars />}</button>
        </div>

        <div className="hidden md:flex items-center md:ml-auto">
          {[
            { key: 1, label: messages['text.navbar.sobremi'], link: '/sobremi' },
            { key: 2, label: messages['text.navbar.consultas'], link: '/consultas' },
            { key: 3, label: messages['text.navbar.servicios'], link: '/servicios' },
            { key: 4, label: messages['text.navbar.problemasatratar'], link: '/problemasatratar' },
            { key: 5, label: messages['text.navbar.preguntas'], link: '/preguntas' },
            { key: 6, label: messages['text.navbar.publicaciones'], link: '/publicaciones' },
            { key: 7, label: messages['text.navbar.contacto'], link: '/contacto' },
          ].map((item) => (
            <NavLink
              key={item.key}
              label={item.label}
              to={item.link}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          ))}
          {user ? <UserMenu user={user} onLogout={handleLogout} /> : <IconWrapper><Link to="/frontend-repo/login" className="hover:text-gray-900"><FaUser /></Link></IconWrapper>}
        </div>
      </div>
    </header>
  );
};

export default Navbar;