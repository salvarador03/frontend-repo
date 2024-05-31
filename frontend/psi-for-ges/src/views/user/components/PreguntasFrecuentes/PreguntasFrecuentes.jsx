import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Element } from 'react-scroll';
import { fetchFaqs } from '../../../../services/FaqService';
import { FaSearch, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { getMessages } from '../../../../services/FeaturesService';
import { useForm } from 'react-hook-form';
import { useLanguage } from '../features/Context/LanguageProvider';

const PreguntasFrecuentes = () => {
  const [faqs, setFaqs] = useState([]);
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState({});
  const [messages, setMessages] = useState({});
  const { language } = useLanguage();
  const [thankYouMessage, setThankYouMessage] = useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    const loadFaqs = async () => {
      try {
        const data = await fetchFaqs();
        setFaqs(data);
      } catch (error) {
        console.error('Error loading FAQs:', error);
      }
    };

    const loadMessages = async (lang) => {
      try {
        const messages = await getMessages(lang);
        setMessages(messages);
      } catch (error) {
        console.error('Error loading i18n messages:', error);
      }
    };

    loadFaqs();
    loadMessages(language);
  }, [language]);

  const toggleOpen = (index) => {
    setIsOpen(prevState => ({ ...prevState, [index]: !prevState[index] }));
  };

  const debounce = (func, delay) => {
    let debounceTimer;
    return function(...args) {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func.apply(this, args), delay);
    };
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const debouncedSearch = useCallback(debounce(handleSearchChange, 300), []);

  const animationVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 }
  };

  const filteredFaqItems = faqs.filter(item =>
    item.question?.toLowerCase().includes(search.toLowerCase()) ||
    item.answer?.toLowerCase().includes(search.toLowerCase())
  );

  const onSubmit = (data) => {
    console.log("Comment submitted:", data);
    setThankYouMessage(messages['faq.thank_you_message']);
    reset();
  };

  return (
    <div className="py-16 px-4 pt-40">
      <Element name="faq" className="element">
        <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6 mb-10 md:p-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={animationVariants}
            transition={{ duration: 1 }}
          >
            <h2 className="text-3xl font-bold mb-6 text-center">
              {messages['faq.title']}
            </h2>
            <div className="relative mb-6">
              <input
                type="search"
                name="search"
                placeholder={messages['faq.search_placeholder']}
                className="w-full h-12 px-4 pr-10 text-sm bg-gray-100 border-2 border-gray-300 rounded-full focus:outline-none focus:bg-white focus:border-blue-400 transition duration-200 ease-in-out"
                onChange={debouncedSearch}
              />
              <button type="submit" className="absolute right-0 top-0 mt-3 mr-4 text-gray-600">
                <FaSearch className="h-5 w-5" />
              </button>
            </div>
            {filteredFaqItems.map((item, index) => (
              <div key={index} className="item mb-6">
                <div className="border-b-2 border-gray-200 pb-4">
                  <button
                    className="flex items-center justify-between w-full focus:outline-none"
                    onClick={() => toggleOpen(index)}
                  >
                    <h4 className={`text-lg font-medium ${isOpen[index] ? 'text-green-400' : ''}`}>{item.question}</h4>
                    {isOpen[index] ? (
                      <FaChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <FaChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </button>
                  {isOpen[index] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.5 }}
                      className="mt-3 text-gray-600"
                    >
                      <p>{item.answer}</p>
                    </motion.div>
                  )}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
        <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6 mb-10 md:p-10">
          <h3 className="text-2xl font-bold mb-4 text-center">{messages['faq.leave_comment']}</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <textarea
                id="comment"
                name="comment"
                rows="4"
                placeholder={messages['faq.comment_placeholder']}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                {...register("comment", { required: true })}
              />
              {errors.comment && <span className="text-red-500">{messages['NotEmpty.comment']}</span>}
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {messages['faq.submit_button']}
              </button>
            </div>
          </form>
          {thankYouMessage && (
            <div className="mt-4 text-green-600 text-center">
              {thankYouMessage}
            </div>
          )}
        </div>
      </Element>
    </div>
  );
};

export default PreguntasFrecuentes;
