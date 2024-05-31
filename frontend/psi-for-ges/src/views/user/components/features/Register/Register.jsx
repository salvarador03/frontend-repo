import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock, FaRegUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../Context/LanguageProvider";
import Notification from "../Notification/Notification";
import Breadcrumb from "../../common/Breadcrumb/Breadcrumb";
import { useAuth } from '../../features/Context/AuthContext';
import { getUserMessages, registerUsuario } from "../../../../../services/FeaturesService";

const Register = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(null);
  const [notification, setNotification] = useState({ isOpen: false, message: '', type: '' });
  const [messages, setMessages] = useState({});
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { login } = useAuth();

  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');

  const password = watch("contrasena");
  const confirmPassword = watch("confirmarContrasena");

  useEffect(() => {
    setPasswordMatch(password && confirmPassword && password === confirmPassword);
  }, [password, confirmPassword]);

  useEffect(() => {
    getUserMessages(language)
      .then(data => setMessages(data))
      .catch(error => console.error('Failed to load i18n messages:', error));
  }, [language]);

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const handleNotification = (type, message) => {
    setNotification({ isOpen: true, message, type });
    setTimeout(() => {
      setNotification({ isOpen: false });
      if (type === 'success') {
        navigate('/sobremi');
      }
    }, 3000);
  };

  const onSubmit = async (data) => {
    if (!passwordMatch) {
      handleNotification('error', messages['text.register.contrasenas.no.coinciden']);
      return;
    }

    try {
      const response = await registerUsuario(data, language);

      if (response.status === 201) {
        const token = response.token;
        login(token);
        handleNotification('success', response.message || messages['text.register.success']);
      } else {
        handleNotification('error', response.message || 'Error desconocido');
      }
    } catch (error) {
      console.error("An error occurred during registration:", error);
      handleNotification('error', error.message || 'An error occurred. Please check the console for more details.');
    }
  };

  const getBorderColor = () => {
    if (!password || !confirmPassword) {
      return "border-gray-300"; // defecto
    } else if (passwordMatch) {
      return "border-green-500"; // coinciden
    } else {
      return "border-red-500"; // no coinciden
    }
  };

  return (
    <div className="flex items-center justify-center bg-zinc-100 px-4 pt-36 sm:px-6 lg:px-8 h-screen">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <Breadcrumb />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-zinc-900">{messages['text.register.titulo']}</h2>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-zinc-700 flex items-center">
                <FaRegUserCircle className="mr-2" />
                {messages['text.register.label.nombre']}
              </label>
              <input
                id="nombre"
                {...register("nombre", { required: true })}
                className="appearance-none block w-full px-3 py-2 border border-yellow-400 placeholder-zinc-500 text-gray-900 focus:outline-none focus:ring-yellow-600 focus:border-yellow-600 sm:text-sm hover:border-yellow-600 transition rounded-md"
              />
              {errors.nombre && <p className="text-red-500">Nombre es requerido</p>}
            </div>

            <div>
              <label htmlFor="apellidos" className="block text-sm font-medium text-zinc-700 flex items-center">
                <FaRegUserCircle className="mr-2" />
                {messages['text.register.label.apellidos']}
              </label>
              <input
                id="apellidos"
                {...register("apellidos", { required: true })}
                className="appearance-none block w-full px-3 py-2 border border-yellow-400 placeholder-zinc-500 text-gray-900 focus:outline-none focus:ring-yellow-600 focus:border-yellow-600 sm:text-sm hover:border-yellow-600 transition rounded-md"
              />
              {errors.apellidos && <p className="text-red-500">Apellidos es requerido</p>}
            </div>

            {[
              { name: "usuario", label: messages['text.register.label.username'], error: usernameError, icon: <FaUser className="mr-2" /> },
              { name: "email", label: messages['text.register.label.email'], error: emailError, icon: <FaEnvelope className="mr-2" /> }
            ].map(({ name, label, error, icon }) => (
              <div key={name}>
                <label htmlFor={name} className="block text-sm font-medium text-zinc-700 flex items-center">
                  {icon}
                  {label}
                </label>
                <input
                  id={name}
                  {...register(name, { required: `${label} es requerido` })}
                  className="appearance-none block w-full px-3 py-2 border border-yellow-400 placeholder-zinc-500 text-gray-900 focus:outline-none focus:ring-yellow-600 focus:border-yellow-600 sm:text-sm hover:border-yellow-600 transition rounded-md"
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
                <label htmlFor={name} className="block text-sm font-medium text-zinc-700 flex items-center">
                  <FaLock className="mr-2" />
                  {label}
                </label>
                <div className="flex relative">
                  <input
                    id={name}
                    type={showPassword ? "text" : "password"}
                    {...register(name, { required: `${label} es requerida` })}
                    className={`appearance-none block w-full px-3 py-2 border ${getBorderColor()} placeholder-zinc-500 text-gray-900 focus:outline-none sm:text-sm rounded-md`}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-700 hover:text-zinc-900"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors[name] && <p className="text-red-500 mt-2">{errors[name].message}</p>}
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
