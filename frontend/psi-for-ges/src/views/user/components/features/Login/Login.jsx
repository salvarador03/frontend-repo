import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash, FaUser, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Notification from "../Notification/Notification";
import setSession from "../Session/Session";
import { useLanguage } from "../Context/LanguageProvider";
import { useAuth } from '../../features/Context/AuthContext';
import Breadcrumb from "../../common/Breadcrumb/Breadcrumb";
import { loginUsuario, getUserMessages } from "../../../../../services/FeaturesService";

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [notification, setNotification] = useState({ isOpen: false, message: '', type: '' });
  const [messages, setMessages] = useState({});
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { login } = useAuth();

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
        navigate("/sobremi");
      }
    }, 3000);
  };

  const onSubmit = async (data) => {
    try {
      const result = await loginUsuario(data.usuario, data.contrasena, language);
      const user = await setSession(result.token); // Guardar el token de sesión del usuario y obtener el usuario decodificado
      login(result.token); // Actualizar el estado de autenticación
      handleNotification('success', result.mensaje);
    } catch (error) {
      console.error("Error al intentar iniciar sesión:", error);
      handleNotification('error', error.response?.data?.message || messages['text.login.error']);
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-100 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 p-6 bg-white rounded-lg shadow-lg">
        <Breadcrumb />
        <h2 className="text-center text-3xl font-extrabold text-zinc-900">
          {messages['text.login.titulo']}
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="usuario" className="block text-sm font-medium text-zinc-700 flex items-center">
                <FaUser className="mr-2" />
                {messages['text.login.usuario']}
              </label>
              <input
                id="usuario"
                name="usuario"
                type="text"
                autoComplete="usuario"
                required
                className="appearance-none block w-full px-3 py-2 border border-yellow-400 placeholder-zinc-500 text-gray-900 focus:outline-none focus:ring-yellow-600 focus:border-yellow-600 sm:text-sm hover:border-yellow-600 transition rounded-md"
                {...register("usuario", { required: true })}
              />
              {errors.usuario && <span className="text-red-500">{messages['NotEmpty.usuario.email']}</span>}
            </div>
            <div className="relative">
              <label htmlFor="contrasena" className="block text-sm font-medium text-zinc-700 flex items-center">
                <FaLock className="mr-2" />
                {messages['text.login.contrasena']}
              </label>
              <input
                id="contrasena"
                name="contrasena"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                className="appearance-none block w-full px-3 py-2 pr-10 border border-yellow-400 placeholder-zinc-500 text-gray-900 focus:outline-none focus:ring-yellow-600 focus:border-yellow-600 sm:text-sm hover:border-yellow-600 transition rounded-md"
                {...register("contrasena", { required: true })}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 top-5 flex items-center px-3 text-zinc-700 hover:text-zinc-900"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              {errors.contrasena && <span className="text-red-500">{messages['NotEmpty.usuario.contrasena']}</span>}
            </div>
          </div>
          <div className="text-center">
            <Link to="/forgot-password" className="font-medium text-gray-700 hover:text-gray-800 transition">
              {messages['text.login.forgot']}
            </Link>
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
        <div className="text-center">
          <Link
            to="/register"
            className="font-medium text-gray-700 hover:text-gray-800 transition"
          >
            {messages['text.login.createAccount']}
          </Link>
        </div>
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

export default Login;
