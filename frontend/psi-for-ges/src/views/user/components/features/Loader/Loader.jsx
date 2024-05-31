import { motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import LogoSVG from '../../../../../assets/icon/LogoSVG';
import { useLanguage } from '../Context/LanguageProvider';

const Loader = () => {
  const [messages, setMessages] = useState({});
  const { language } = useLanguage();
  const apiEndpoint = import.meta.env.VITE_API_ENDPOINT;

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`${apiEndpoint}/messages?lang=${language}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error('Error loading the messages:', error);
      }
    };

    fetchMessages();
  }, [apiEndpoint, language]);

  const loadingText = messages['text.loader.cargando'] || 'Loading';

  return (
    <motion.div
      className="loader"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        backdropFilter: 'blur(10px)',
        zIndex: 1000
      }}
      transition={{ repeat: Infinity, duration: 2 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div style={{ transform: 'scale(0.5)', textAlign: 'center' }}>
        <LogoSVG />
        <em>
          <p style={{ marginTop: '20px', fontSize: '4.4em' }} className='text-gray-900'>
            {loadingText}
            <motion.span
              style={{ display: 'inline-block' }}
              animate={{ x: [0, 10, 0] }}
              transition={{
                repeat: Infinity,
                duration: 1,
                ease: 'easeInOut'
              }}
            >
              ...
            </motion.span>
          </p>
        </em>
      </div>
    </motion.div>
  );
};

export default Loader;
