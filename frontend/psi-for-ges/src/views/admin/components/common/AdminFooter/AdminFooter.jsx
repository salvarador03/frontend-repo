import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../../../user/components/features/Context/LanguageProvider";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope, FaGlobe } from "react-icons/fa";
import { motion } from "framer-motion";
// Importa el logo
import logo from '../../../../../assets/img/logo.svg';


const AdminFooter = () => {
  const { language, changeLanguage } = useLanguage();
  const [messages, setMessages] = useState({});
  const [hoveredLink, setHoveredLink] = useState(null);
  const apiEndpoint = import.meta.env.VITE_API_ENDPOINT;
  const navRef = useRef(null);
  

  const handleChangeLanguage = (event) => {
    changeLanguage(event.target.value);
  };

  useEffect(() => {
    fetch(`${apiEndpoint}/messages?lang=${language}`)
      .then(response => response.json())
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
    <footer className="text-white bg-blue-500 body-font relative z-10">
      <div className="container px-5 py-24 mx-auto flex flex-col md:flex-row md:items-center lg:items-start flex-wrap">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="w-64 flex-shrink-0 mx-auto text-center md:text-left md:my-8"
        >
          <Link to="/frontend-repo/" className="flex title-font font-medium items-center justify-center md:justify-start text-white">
          <img src={logo} alt="Logo" className="w-56 h-56 mx-auto my-4" />
          </Link>
          <p className="mt-2 text-sm text-white">{messages['text.footer.parrafo']}</p>
        </motion.div>

        <div ref={navRef} className="flex-grow flex flex-wrap md:pl-20 -mb-10 md:mt-0 mt-10 md:text-left text-center relative">
          <FooterSection 
            title={messages['text.footer.sobremi']} 
            links={[
              { to: '/formacion', label: messages['text.footer.informacion'] },
              { to: '/experiencia-laboral', label: messages['text.footer.experiencia'] },
              { to: '/intereses', label: messages['text.footer.trabajo'] },
              { to: '/proyectos', label: messages['text.footer.intereses'] }
            ]}
            handleMouseEnter={handleMouseEnter}
            handleMouseLeave={handleMouseLeave}
          />

          <FooterSection 
            title={messages['text.footer.contacto']} 
            links={[
              { label: messages['text.footer.email'] },
              { label: messages['text.footer.telefono'] },
              { href: messages['text.footer.web'], label: messages['text.footer.web'] }
            ]}
          />

          <FooterSection title={messages['text.footer.ultimaspublicaciones']} links={[]} />
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="lg:w-1/4 md:w-1/2 w-full px-4"
          >
            <h2 className="title-font font-medium text-white tracking-widest text-sm mb-3">{messages['text.footer.suscribe']}</h2>
            <div className="flex flex-col items-center border-b border-gray-600 py-4 space-y-4">
              <div className="mt-6 md:mt-0">
                <form onSubmit={(e) => e.preventDefault()} className="items-center gap-x-3 space-y-3 sm:space-y-0 md:space-y-3 sm:flex md:block w-full">
                  <div className="relative w-full">
                    <FaEnvelope className="w-6 h-6 text-white absolute left-3 inset-y-0 my-auto" />
                    <input
                      type="email"
                      required
                      placeholder={messages['text.footer.email.placeholder']}
                      className="w-full pl-12 pr-3 py-2 text-white bg-transparent outline-none border focus:border-indigo-400 shadow-sm rounded-lg"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="block w-full py-3 px-4 bg-indigo-500 text-sm text-white rounded-lg hover:bg-indigo-600 transition"
                  >
                    {messages['text.footer.button.suscribe']}
                  </motion.button>
                </form>
              </div>
              <div className="w-full">
                <div className="flex items-center">
                  <FaGlobe className="text-white mr-2" />
                  <label htmlFor="language" className="text-white text-sm">{messages['text.footer.label.select.idioma']}</label>
                </div>
                <select
                  id="language"
                  name="language"
                  className="bg-blue-700 border border-gray-600 text-white rounded-lg py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
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
              className="absolute bg-gray-400 z-0 rounded-lg"
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
        className="bg-blue-800"
      >
        <div className="container mx-auto py-4 px-5 flex flex-wrap flex-col sm:flex-row">
          <p className="text-white text-sm text-center sm:text-left">
            {messages['text.footer.copy']} —
            <a
              href="https://www.instagram.com/shiroi_shi4?igsh=dzA0YnF6bTZ5M204"
              className="text-white ml-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              @shiroi_shi4
            </a>
          </p>
          <span className="inline-flex sm:ml-auto sm:mt-0 mt-2 justify-center sm:justify-start">
            <SocialIcon href="https://www.facebook.com" icon={<FaFacebook />} />
            <SocialIcon href="https://www.twitter.com" icon={<FaTwitter />} />
            <SocialIcon href="https://www.instagram.com" icon={<FaInstagram />} />
            <SocialIcon href="https://www.linkedin.com" icon={<FaLinkedin />} />
          </span>
        </div>
      </motion.div>
    </footer>
  );
};

const FooterSection = ({ title, links, handleMouseEnter, handleMouseLeave }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1 }}
    className="lg:w-1/4 md:w-1/2 w-full px-4"
  >
    <h2 className="title-font font-medium text-white tracking-widest text-sm mb-3">{title}</h2>
    <nav className="list-none mb-10">
      {links.map((link, index) => (
        <li key={index}>
          <Link
            to={link.to || "#"}
            className="text-white hover:text-black relative z-10"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {link.label}
          </Link>
        </li>
      ))}
    </nav>
  </motion.div>
);

const SocialIcon = ({ href, icon }) => (
  <motion.a
    whileHover={{ scale: 1.2 }}
    whileTap={{ scale: 0.9 }}
    href={href}
    className="ml-3 text-white"
    target="_blank"
    rel="noopener noreferrer"
  >
    {icon}
  </motion.a>
);

export default AdminFooter;
