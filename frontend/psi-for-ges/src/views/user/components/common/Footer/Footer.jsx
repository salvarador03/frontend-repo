import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../features/Context/LanguageProvider";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope, FaGlobe } from "react-icons/fa";
import { motion } from "framer-motion";
import { getMessages } from "../../../../../services/FeaturesService";

const Footer = () => {
  const { language, changeLanguage } = useLanguage();
  const [messages, setMessages] = useState({});
  const [hoveredLink, setHoveredLink] = useState(null);
  const navRef = useRef(null);

  const handleChangeLanguage = (event) => {
    changeLanguage(event.target.value);
  };

  useEffect(() => {
    getMessages(language)
      .then(data => setMessages(data))
      .catch(error => console.error('Error loading the messages:', error));
  }, [language]);

  const handleMouseEnter = (e) => {
    const linkRect = e.target.getBoundingClientRect();
    setHoveredLink({
      width: linkRect.width,
      height: linkRect.height,
      top: linkRect.top,
      left: linkRect.left
    });
  };

  const handleMouseLeave = () => {
    setHoveredLink(null);
  };

  return (
    <footer className="text-gray-600 body-font bg-white">
      <div className="container px-5 py-24 mx-auto flex flex-col md:flex-row md:items-center lg:items-start flex-wrap">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="w-64 flex-shrink-0 mx-auto text-center md:text-left md:my-8"
        >
          <Link to="/" className="flex title-font font-medium items-center justify-center md:justify-start text-gray-900">
            <img src="/src/assets/img/logo.svg" alt="logo" className="w-56 h-56" />
          </Link>
          <p className="mt-2 text-sm text-gray-500">{messages['text.footer.parrafo']}</p>
        </motion.div>

        <div ref={navRef} className="flex-grow flex flex-wrap md:pl-20 -mb-10 md:mt-0 mt-10 md:text-left text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="lg:w-1/4 md:w-1/2 w-full px-4"
          >
            <h2 className="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">{messages['text.footer.sobremi']}</h2>
            <nav className="list-none mb-10">
              <li>
                <Link 
                  to="/formacion" 
                  className="text-gray-600 hover:text-gray-800 relative z-10"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  {messages['text.footer.informacion']}
                </Link>
              </li>
              <li>
                <Link 
                  to="/experiencia-laboral" 
                  className="text-gray-600 hover:text-gray-800 relative z-10"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  {messages['text.footer.experiencia']}
                </Link>
              </li>
              <li>
                <Link 
                  to="/intereses" 
                  className="text-gray-600 hover:text-gray-800 relative z-10"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  {messages['text.footer.trabajo']}
                </Link>
              </li>
              <li>
                <Link 
                  to="/proyectos" 
                  className="text-gray-600 hover:text-gray-800 relative z-10"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  {messages['text.footer.intereses']}
                </Link>
              </li>
            </nav>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="lg:w-1/4 md:w-1/2 w-full px-4"
          >
            <h2 className="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">{messages['text.footer.contacto']}</h2>
            <nav className="list-none mb-10">
              <li><span className="text-gray-600 hover:text-gray-800">{messages['text.footer.email']}</span></li>
              <li><span className="text-gray-600 hover:text-gray-800">{messages['text.footer.telefono']}</span></li>
              <li><a href={messages['text.footer.web']} className="text-gray-600 hover:text-gray-800">{messages['text.footer.web']}</a></li>
            </nav>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="lg:w-1/4 md:w-1/2 w-full px-4"
          >
            <h2 className="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">{messages['text.footer.ultimaspublicaciones']}</h2>
            <ul>
              {/* Add the titles of the latest 4 recent publications */}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="lg:w-1/4 md:w-1/2 w-full px-4"
          >
            <h2 className="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">{messages['text.footer.suscribe']}</h2>
            <div className="flex flex-col items-center border-b border-gray-300 py-4 space-y-4">
              <div className="mt-6 md:mt-0">
                <form onSubmit={(e) => e.preventDefault()} className="items-center gap-x-3 space-y-3 sm:space-y-0 md:space-y-3 sm:flex md:block w-full">
                  <div className="relative w-full">
                    <FaEnvelope className="w-6 h-6 text-gray-400 absolute left-3 inset-y-0 my-auto" />
                    <input
                      type="email"
                      required
                      placeholder={messages['text.footer.email.placeholder']}
                      className="w-full pl-12 pr-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                    />
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="block w-full py-3 px-4 bg-yellow-400 text-sm text-black rounded-lg hover:bg-yellow-500 transition"
                  >
                    {messages['text.footer.button.suscribe']}
                  </motion.button>
                </form>
              </div>
              <div className="w-full">
                <div className="flex items-center">
                  <FaGlobe className="text-gray-500 mr-2" />
                  <label htmlFor="language" className="text-gray-900 text-sm">{messages['text.footer.label.select.idioma']}</label>
                </div>
                <select
                  id="language"
                  name="language"
                  className="bg-white border border-gray-300 text-gray-900 rounded-lg py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  value={language}
                  onChange={handleChangeLanguage}
                >
                  <option value="es">{messages['text.footer.select.idioma.español']}</option>
                  <option value="en">{messages['text.footer.select.idioma.ingles']}</option>
                  <option value="fr">{messages['text.footer.select.idioma.frances']}</option>
                  <option value="de">{messages['text.footer.select.idioma.aleman']}</option>
                </select>
              </div>
            </div>
          </motion.div>

          {hoveredLink && (
            <motion.div
              className="absolute bg-gray-200 z-0 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: 1,
                width: hoveredLink.width,
                height: hoveredLink.height,
                top: hoveredLink.top - navRef.current.getBoundingClientRect().top,
                left: hoveredLink.left - navRef.current.getBoundingClientRect().left
              }}
              transition={{ duration: 0.3 }}
            />
          )}
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="bg-gray-200"
      >
        <div className="container mx-auto py-4 px-5 flex flex-wrap flex-col sm:flex-row">
          <p className="text-gray-500 text-sm text-center sm:text-left">
            {messages['text.footer.copy']} —
            <a
              href="https://www.instagram.com/shiroi_shi4?igsh=dzA0YnF6bTZ5M204"
              className="text-gray-600 ml-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              @shiroi_shi4
            </a>
          </p>
          <span className="inline-flex sm:ml-auto sm:mt-0 mt-2 justify-center sm:justify-start">
            <motion.a 
              whileHover={{ scale: 1.2, color: "#3b5998" }}
              whileTap={{ scale: 0.9 }}
              href="https://www.facebook.com" 
              className="text-gray-500" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <FaFacebook />
            </motion.a>
            <motion.a 
              whileHover={{ scale: 1.2, color: "#1DA1F2" }}
              whileTap={{ scale: 0.9 }}
              href="https://www.twitter.com" 
              className="ml-3 text-gray-500" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <FaTwitter />
            </motion.a>
            <motion.a 
              whileHover={{ scale: 1.2, color: "#C13584" }}
              whileTap={{ scale: 0.9 }}
              href="https://www.instagram.com" 
              className="ml-3 text-gray-500" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <FaInstagram />
            </motion.a>
            <motion.a 
              whileHover={{ scale: 1.2, color: "#0077B5" }}
              whileTap={{ scale: 0.9 }}
              href="https://www.linkedin.com" 
              className="ml-3 text-gray-500" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <FaLinkedin />
            </motion.a>
          </span>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;
