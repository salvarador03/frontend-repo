import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaSearch, FaUser } from 'react-icons/fa';
import { useLanguage } from '../../features/Context/LanguageProvider';
import ProfileButton from '../ProfileButton/ProfileButton';
import IconWrapper from './IconWrapper';
import NavLink from './NavLink';
import { useAuth } from '../../features/Context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { getMessages } from '../../../../../services/FeaturesService';

const Navbar = () => {
  const [messages, setMessages] = useState({});
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('/');
  const [isSticky, setIsSticky] = useState(false);
  const { language } = useLanguage();
  const { isLoggedIn, user } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getMessages(language)
      .then(data => setMessages(data))
      .catch(error => console.error('Error loading the messages:', error));
  }, [language]);

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
    <>
      <header className={`${isSticky ? 'fixed' : 'absolute'} w-full bg-white z-50 text-gray-600 body-font`}>
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
                  className="w-full border border-gray-300 p-2 rounded pl-10"
                />
                <FaSearch className="absolute left-3 top-3 text-gray-600" />
              </div>
              <button onClick={handleSearch} className="text-black"><FaSearch /></button>
              <button onClick={() => setIsSearchOpen(false)} className="text-black"><FaTimes /></button>
            </div>
          ) : (
            <>
              <div className="flex items-center space-x-6">
                <Link to="/" className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
                  <img src="/src/assets/img/logo.svg" alt="Pablo Alvarado logo" className="w-40 h-40" />
                </Link>
                <div className="hidden md:flex items-center space-x-24">
                  {[
                    { key: 1, label: messages['text.navbar.sobremi'], link: '/sobremi' },
                    { key: 2, label: messages['text.navbar.servicios'], link: '/servicios' },
                    { key: 3, label: messages['text.navbar.preguntas'], link: '/preguntas' },
                    { key: 4, label: messages['text.navbar.publicaciones'], link: '/publicaciones' },
                    { key: 5, label: messages['text.navbar.contacto'], link: '/contacto' },
                  ].map((item) => (
                    <NavLink
                      key={item.key}
                      label={item.label}
                      to={item.link}
                      activeTab={activeTab}
                      setActiveTab={setActiveTab}
                    />
                  ))}
                  <div className="flex items-center space-x-6">
                    <IconWrapper><button onClick={() => setIsSearchOpen(true)} className="hover:text-gray-900"><FaSearch /></button></IconWrapper>
                    {isLoggedIn ? (
                      <ProfileButton user={user} />
                    ) : (
                      <IconWrapper><Link to="/login" className="hover:text-gray-900"><FaUser /></Link></IconWrapper>
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
                  className="z-50"
                >
                  {isMenuOpen ? <FaTimes /> : <FaBars />}
                </motion.button>
              </div>

              <AnimatePresence>
                {isMenuOpen && (
                  <motion.div
                    className="md:hidden bg-white p-4 text-center fixed top-0 left-0 w-full h-full z-40 flex flex-col justify-center"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <div className="mt-20 space-y-6">
                      {[
                        { key: 1, label: messages['text.navbar.sobremi'], link: '/sobremi' },
                        { key: 2, label: messages['text.navbar.servicios'], link: '/servicios' },
                        { key: 3, label: messages['text.navbar.preguntas'], link: '/preguntas' },
                        { key: 4, label: messages['text.navbar.publicaciones'], link: '/publicaciones' },
                        { key: 5, label: messages['text.navbar.contacto'], link: '/contacto' },
                      ].map((item) => (
                        <NavLink
                          key={item.key}
                          label={item.label}
                          to={item.link}
                          activeTab={activeTab}
                          setActiveTab={setActiveTab}
                        />
                      ))}
                      <div className="flex justify-center mt-4 space-x-6">
                        <IconWrapper><button onClick={() => setIsSearchOpen(true)} className="hover:text-gray-900"><FaSearch /></button></IconWrapper>
                        {isLoggedIn ? (
                          <ProfileButton user={user} />
                        ) : (
                          <IconWrapper><Link to="/login" className="hover:text-gray-900"><FaUser /></Link></IconWrapper>
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
    </>
  );
};

export default Navbar;
