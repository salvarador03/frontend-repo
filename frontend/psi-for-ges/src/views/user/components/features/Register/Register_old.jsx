import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../../context/LenguageProvider";
import Notification from "../Notification";

const Register = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(null);
  const [notification, setNotification] = useState({ isOpen: false, message: '', type: '' });
  const [messages, setMessages] = useState({});
  const navigate = useNavigate();
  const { language } = useLanguage();
  const apiEndpoint = import.meta.env.VITE_API_ENDPOINT;

  useEffect(() => {
    setPasswordMatch(password && confirmPassword && password === confirmPassword);
  }, [password, confirmPassword]);

  useEffect(() => {
    console.log(`Fetching messages for language: ${language}`);
    fetch(`${apiEndpoint}/usuarios/messages?lang=${language}`)
      .then(response => response.json())
      .then(data => {
        console.log(`Messages loaded for ${language}:`, data);
        setMessages(data);
      })
      .catch(error => console.error('Failed to load i18n messages:', error));
  }, [apiEndpoint, language]);

  const password = watch("contrasena");
  const confirmPassword = watch("confirmarContrasena");

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const handleNotification = (type, message) => {
    setNotification({ isOpen: true, message, type });
    setTimeout(() => {
      setNotification({ isOpen: false });
      if (type === 'success') {
        navigate('/login');
      }
    }, 3000);
  };

  const onSubmit = async (data) => {
    if (!passwordMatch) {
      handleNotification('error', messages['text.register.confirmar.error']);
      return;
    }

    try {
      const response = await fetch(`${apiEndpoint}/usuarios/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (response.ok) {
        const result = await response.json();
        handleNotification('success', messages['text.register.success']);
      } else {
        const errorResult = await response.json();
        handleNotification('error', errorResult.message || 'Error desconocido');
      }
    } catch (error) {
      console.error("An error occurred during registration:", error);
      handleNotification('error', 'An error occurred. Please check the console for more details.');
    }
  };

  return (
    <div className="flex items-center justify-center bg-zinc-100 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-zinc-900">{messages['text.register.titulo']}</h2>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm space-y-2">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-zinc-700">{messages['text.register.label.nombre']}</label>
              <input
                id="nombre"
                {...register("nombre", { required: true })}
                className="appearance-none block w-full px-3 py-2 border border-yellow-400 placeholder-zinc-500 text-gray-900 focus:outline-none focus:ring-yellow-600 focus:border-yellow-600 sm:text-sm hover:border-yellow-600 transition"
              />
              {errors.nombre && <p className="text-red-500">Nombre es requerido</p>}
            </div>
  
            <div>
              <label htmlFor="apellidos" className="block text-sm font-medium text-zinc-700">{messages['text.register.label.apellidos']}</label>
              <input
                id="apellidos"
                {...register("apellidos", { required: true })}
                className="appearance-none block w-full px-3 py-2 border border-yellow-400 placeholder-zinc-500 text-gray-900 focus:outline-none focus:ring-yellow-600 focus:border-yellow-600 sm:text-sm hover:border-yellow-600 transition"
              />
              {errors.apellidos && <p className="text-red-500">Apellidos es requerido</p>}
            </div>
  
            {[
              { name: "usuario", label: messages['text.register.label.username'], error: usernameError },
              { name: "email", label: messages['text.register.label.email'], error: emailError }
            ].map(({ name, label, error }) => (
              <div key={name}>
                <label htmlFor={name} className="block text-sm font-medium text-zinc-700">{label}</label>
                <input
                  id={name}
                  {...register(name, { required: `${label} es requerido` })}
                  className="appearance-none block w-full px-3 py-2 border border-yellow-400 placeholder-zinc-500 text-gray-900 focus:outline-none focus:ring-yellow-600 focus:border-yellow-600 sm:text-sm hover:border-yellow-600 transition"
                />
                {errors[name] && <p className="text-red-500">{errors[name].message}</p>}
                {error && <p className="text-red-500">{error}</p>}
              </div>
            ))}
  
            {[
              { name: "contrasena", label: messages['text.register.label.contrasena'] },
              { name: "confirmarContrasena", label: messages['text.register.label.confirmar'] }
            ].map(({ name, label }) => (
              <div key={name} className="relative">
                <label htmlFor={name} className="block text-sm font-medium text-zinc-700">{label}</label>
                <input
                  id={name}
                  type={showPassword ? "text" : "password"}
                  {...register(name, { required: `${label} es requerida` })}
                  className={`appearance-none block w-full px-3 py-2 border ${getBorderColor()} placeholder-zinc-500 text-gray-900 focus:outline-none sm:text-sm`}
                />
                {errors[name] && <p className="text-red-500">{errors[name].message}</p>}
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 top-5 flex items-center pr-3"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            ))}
  
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-gray-800 bg-yellow-400 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition"
            >
              {messages['text.register.boton']}
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

export default Register;

