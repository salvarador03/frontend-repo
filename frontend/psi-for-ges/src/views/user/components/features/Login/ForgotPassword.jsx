import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FaEnvelope } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Notification from "../Notification/Notification";
import Breadcrumb from "../../common/Breadcrumb/Breadcrumb";
import { useLanguage } from "../Context/LanguageProvider";
import { getUserMessages, forgotPassword } from "../../../../../services/FeaturesService";

const ForgotPassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [notification, setNotification] = useState({ isOpen: false, message: '', type: '' });
  const [messages, setMessages] = useState({});
  const navigate = useNavigate();
  const { language } = useLanguage();

  useEffect(() => {
    getUserMessages(language)
      .then(data => setMessages(data))
      .catch(error => console.error('Failed to load i18n messages:', error));
  }, [language]);

  const onSubmit = async (data) => {
    try {
      const responseData = await forgotPassword(data.email);
      setNotification({ isOpen: true, message: responseData.message, type: 'success' });
    } catch (error) {
      setNotification({ isOpen: true, message: error.message, type: 'error' });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-100 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 p-6 bg-white rounded-lg shadow-lg">
        <Breadcrumb />
        <h2 className="text-center text-3xl font-extrabold text-zinc-900">
          {messages['text.login.forgot']}
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-700 flex items-center">
                <FaEnvelope className="mr-2" />
                {messages['text.register.label.email']}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none block w-full px-3 py-2 border border-yellow-400 placeholder-zinc-500 text-gray-900 focus:outline-none focus:ring-yellow-600 focus:border-yellow-600 sm:text-sm hover:border-yellow-600 transition rounded-md"
                {...register("email", { required: true })}
              />
              {errors.email && <span className="text-red-500">{messages['NotEmpty.usuario.email']}</span>}
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-gray-800 bg-yellow-400 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition"
            >
              {messages['text.login.boton']}
            </button>
          </div>
        </form>
        {notification.isOpen && (
          <Notification
            type={notification.type}
            message={notification.message}
            isOpen={notification.isOpen}
            onClose={() => setNotification({ isOpen: false })}
          />
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
