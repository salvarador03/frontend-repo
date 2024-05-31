import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../features/Context/LanguageProvider';
import { Link } from 'react-router-dom';
import { Element } from 'react-scroll';
import ScrollMotionDiv from './ScrollMotionDiv';
import ImageGallery from './ImageGallery';
import { getMessages } from '../../../../services/FeaturesService';

const SobreMi = () => {
  const [messages, setMessages] = useState({});
  const { language } = useLanguage();

  useEffect(() => {
    getMessages(language)
      .then(data => setMessages(data))
      .catch(error => console.error('Error loading the messages:', error));
  }, [language]);

  const animationVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div>
      <Element name="top" className="element" />
      <div className="mt-80">
        <motion.div
          key="sobreMiMotionDiv" // Añado un key único para que se recargue correctamente
          className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6 mb-40 md:p-10"
          initial="hidden"
          animate="visible"
          variants={animationVariants}
          transition={{ duration: 1.5 }}
        >
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 flex justify-center mb-4 md:mb-0">
              <img
                src="https://placehold.co/300x300"
                alt="Profile Picture"
                className="rounded-lg w-48 h-48 md:w-full md:h-auto"
              />
            </div>
            <div className="md:w-2/3 md:pl-6">
              <h3 className="mt-4 text-lg font-semibold">Pablo Alvarado Ramos</h3>
              <p className="text-zinc-600">M-25747</p>
              <h2 className="text-2xl font-bold mb-3">{messages['text.sobremi.info']}</h2>
              <p className="mt-2">{messages['text.sobremi.parrafo1']}</p>
              <p className="mt-2">{messages['text.sobremi.parrafo2']}</p>
              <p className="mt-2">{messages['text.sobremi.parrafo3']}</p>
              <p className="mt-2">{messages['text.sobremi.parrafo4']}</p>
              <p className="mt-2">{messages['text.sobremi.parrafo5']}</p>
              <Link to="/contacto" className="mt-2 font-semibold text-blue-600">{messages['text.sobremi.parrafo6']}</Link>
            </div>
          </div>
        </motion.div>
      </div>

      <Element name="gallery" className="element">
        <div className='mb-24'>
          <ImageGallery images={[
            'https://placehold.co/600x400',
            'https://placehold.co/600x400',
            'https://placehold.co/600x400'
          ]} />
        </div>
      </Element>

      <Element name="trabajo" className="element">
        <ScrollMotionDiv direction="left" duration={1.5}>
          <div className="flex flex-col md:flex-row items-start">
            <div className="md:w-1/2 p-4">
              <h2 className="text-xl font-bold mb-3">{messages['text.sobremi.trabajo']}</h2>
              <p>{messages['text.sobremi.parrafo7']}</p>
              <h3 className="font-semibold mt-4">{messages['text.sobremi.areas']}</h3>
              <ul className="list-disc ml-5">
                <li>{messages['text.sobremi.area1']}</li>
                <li>{messages['text.sobremi.area2']}</li>
                <li>{messages['text.sobremi.area3']}</li>
                <li>{messages['text.sobremi.area4']}</li>
                <li>{messages['text.sobremi.area5']}</li>
                <li>{messages['text.sobremi.area6']}</li>
              </ul>
            </div>
            <div className="md:w-1/2">
              <img
                src="https://placehold.co/600x400"
                alt="Forensic Psychology Image"
                className="w-full h-auto"
              />
            </div>
          </div>
        </ScrollMotionDiv>
      </Element>

      <Element name="experiencia" className="element">
        <ScrollMotionDiv direction="right" duration={1.5}>
          <div className="flex flex-col md:flex-row items-start">
            <div className="md:w-1/2">
              <img src="https://placehold.co/600x400" alt="Health Psychology Image" className="w-full h-auto" />
            </div>
            <div className="md:w-1/2 p-4">
              <h2 className="text-xl font-bold mb-3">{messages['text.sobremi.experiencia']}</h2>
              <p>{messages['text.sobremi.parrafo8']}</p>
              <p>{messages['text.sobremi.parrafo9']}</p>
            </div>
          </div>
        </ScrollMotionDiv>
      </Element>

      <Element name="intereses" className="element">
        <ScrollMotionDiv direction="left" duration={1.5}>
          <div className="flex flex-col md:flex-row items-start">
            <div className="md:w-1/2 p-4">
              <h2 className="text-xl font-bold mb-3">{messages['text.sobremi.intereses']}</h2>
              <p>{messages['text.sobremi.parrafo10']}</p>
              <p>{messages['text.sobremi.parrafo11']}</p>
              <h3 className="font-semibold mt-4">{messages['text.sobremi.areas']}</h3>
              <ul className="list-disc ml-5">
                <li>{messages['text.sobremi.area1']}</li>
                <li>{messages['text.sobremi.area2']}</li>
                <li>{messages['text.sobremi.area3']}</li>
                <li>{messages['text.sobremi.area4']}</li>
                <li>{messages['text.sobremi.area5']}</li>
                <li>{messages['text.sobremi.area6']}</li>
              </ul>
            </div>
            <div className="md:w-1/2">
              <img
                src="https://placehold.co/600x400"
                alt="Forensic Psychology Image"
                className="w-full h-auto"
              />
            </div>
          </div>
        </ScrollMotionDiv>
      </Element>

      <div className="pb-20"></div> {/* Espacio al final de la página */}
    </div>
  );
};

export default SobreMi;
