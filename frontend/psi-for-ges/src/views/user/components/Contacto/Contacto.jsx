import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useLanguage } from '../features/Context/LanguageProvider';
import Notification from '../features/Notification/Notification';
import Breadcrumb from '../common/Breadcrumb/Breadcrumb';
import { getMessages, sendContactEmail, getServiceList, contractService } from '../../../../services/FeaturesService';
import { useAuth } from '../features/Context/AuthContext';

const Contacto = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { language } = useLanguage();
  const { user } = useAuth();
  const [messages, setMessages] = useState({});
  const [notification, setNotification] = useState({
    isOpen: false,
    type: '',
    message: ''
  });
  const [serviceType, setServiceType] = useState('contact');
  const [serviceList, setServiceList] = useState([]);

  useEffect(() => {
    getMessages(language)
      .then(data => setMessages(data))
      .catch(error => console.error('Failed to load i18n messages:', error));

    getServiceList()
      .then(data => setServiceList(data))
      .catch(error => console.error('Failed to load services list:', error));
  }, [language]);

  const onSubmit = async (data) => {
    try {
      if (serviceType === 'service') {
        const contractStatus = await contractService({
          ...data,
          servicio: data.servicio,
          usuario: {
            id: user.id,
            nombre: user.name,
            email: data.email, // Usar el email proporcionado en el formulario
          },
          descripcionConsulta: data.descripcionConsulta
        });
        if (contractStatus === 200) {
          setNotification({
            isOpen: true,
            type: 'success',
            message: 'Se ha realizado la consulta del servicio.'
          });
        } else {
          setNotification({
            isOpen: true,
            type: 'error',
            message: 'Error al realizar la consulta.'
          });
        }
      } else {
        const status = await sendContactEmail(data);
        if (status === 200) {
          setNotification({
            isOpen: true,
            type: 'success',
            message: 'Mensaje enviado correctamente.'
          });
        } else {
          setNotification({
            isOpen: true,
            type: 'error',
            message: 'Error al enviar el mensaje.'
          });
        }
      }
    } catch (error) {
      setNotification({
        isOpen: true,
        type: 'error',
        message: 'Error al procesar la solicitud.'
      });
    }
  };

  const closeNotification = () => {
    setNotification({ ...notification, isOpen: false });
  };

  return (
    <div className="flex items-center justify-center bg-zinc-100 px-4 pt-48 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-md w-full space-y-6 p-6 bg-white rounded-lg shadow-lg mb-40">
        <Breadcrumb />
        <h2 className="text-center text-3xl font-extrabold text-zinc-900">
          {messages['text.formulario.contacto.titulo']}
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="tipoServicio" className="block text-sm font-medium text-zinc-700">
              {messages['text.formulario.contacto.tipoServicio']}
            </label>
            <select
              id="tipoServicio"
              name="tipoServicio"
              className="block w-full px-3 py-2 border border-yellow-400 text-gray-900 focus:outline-none focus:ring-yellow-600 focus:border-yellow-600 sm:text-sm rounded-md"
              {...register("tipoServicio", { required: true })}
              onChange={(e) => setServiceType(e.target.value)}
            >
              <option value="contact">Contacto</option>
              <option value="service">Contratar Servicio</option>
            </select>
            {errors.tipoServicio && <span className="text-red-500">Este campo es requerido</span>}
          </div>

          {serviceType === 'service' && (
            <>
              <div>
                <label htmlFor="servicio" className="block text-sm font-medium text-zinc-700">
                  {messages['text.formulario.contacto.servicio']}
                </label>
                <select
                  id="servicio"
                  name="servicio"
                  className="block w-full px-3 py-2 border border-yellow-400 text-gray-900 focus:outline-none focus:ring-yellow-600 focus:border-yellow-600 sm:text-sm rounded-md"
                  {...register("servicio", { required: true })}
                >
                  {serviceList.map((service) => (
                    <option key={service.id} value={service.id}>{service.nombre}</option>
                  ))}
                </select>
                {errors.servicio && <span className="text-red-500">Este campo es requerido</span>}
              </div>

              <div>
                <label htmlFor="descripcionConsulta" className="block text-sm font-medium text-zinc-700">
                  {messages['text.formulario.contacto.descripcionConsulta']}
                </label>
                <textarea
                  id="descripcionConsulta"
                  name="descripcionConsulta"
                  rows="4"
                  className="appearance-none block w-full px-3 py-2 border border-yellow-400 placeholder-zinc-500 text-gray-900 focus:outline-none focus:ring-yellow-600 focus:border-yellow-600 sm:text-sm hover:border-yellow-600 transition rounded-md"
                  {...register("descripcionConsulta", { required: true })}
                ></textarea>
                {errors.descripcionConsulta && <span className="text-red-500">Este campo es requerido</span>}
              </div>
            </>
          )}

          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-zinc-700">
              {messages['text.formulario.contacto.nombre']}
            </label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              className="appearance-none block w-full px-3 py-2 border border-yellow-400 placeholder-zinc-500 text-gray-900 focus:outline-none focus:ring-yellow-600 focus:border-yellow-600 sm:text-sm hover:border-yellow-600 transition rounded-md"
              {...register("nombre", { required: true })}
            />
            {errors.nombre && <span className="text-red-500">El nombre es requerido</span>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-zinc-700">
              {messages['text.formulario.contacto.email']}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="appearance-none block w-full px-3 py-2 border border-yellow-400 placeholder-zinc-500 text-gray-900 focus:outline-none focus:ring-yellow-600 focus:border-yellow-600 sm:text-sm hover:border-yellow-600 transition rounded-md"
              {...register("email", { required: true })}
            />
            {errors.email && <span className="text-red-500">El email es requerido</span>}
          </div>

          {serviceType === 'contact' && (
            <>
              <div>
                <label htmlFor="asunto" className="block text-sm font-medium text-zinc-700">
                  {messages['text.formulario.contacto.asunto']}
                </label>
                <input
                  id="asunto"
                  name="asunto"
                  type="text"
                  className="appearance-none block w-full px-3 py-2 border border-yellow-400 placeholder-zinc-500 text-gray-900 focus:outline-none focus:ring-yellow-600 focus:border-yellow-600 sm:text-sm hover:border-yellow-600 transition rounded-md"
                  {...register("asunto")}
                />
              </div>

              <div>
                <label htmlFor="mensaje" className="block text-sm font-medium text-zinc-700">
                  {messages['text.formulario.contacto.mensaje']}
                </label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  rows="4"
                  className="appearance-none block w-full px-3 py-2 border border-yellow-400 placeholder-zinc-500 text-gray-900 focus:outline-none focus:ring-yellow-600 focus:border-yellow-600 sm:text-sm hover:border-yellow-600 transition rounded-md"
                  {...register("mensaje")}
                ></textarea>
              </div>
            </>
          )}

          <div className="text-sm text-zinc-600">
            {messages['text.formulario.contacto.privacidad']} <a href="#" className="text-green-600">{messages['text.formulario.contacto.privacidad.enlace']}</a>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-gray-800 bg-yellow-400 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition"
            >
              {messages['text.formulario.contacto.boton']}
            </button>
          </div>
        </form>
      </div>
      <Notification
        type={notification.type}
        message={notification.message}
        isOpen={notification.isOpen}
        onClose={closeNotification}
      />
    </div>
  );
};

export default Contacto;
