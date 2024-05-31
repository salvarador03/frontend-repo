import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ObtenerPublicacionPorId, obtenerComentariosPorPublicacion } from '../../../../services/PublicacionService';
import { crearComentario } from '../../../../services/ComentarioService';
import { obtenerRespuestasPorComentario, crearRespuesta } from '../../../../services/RespuestasService';
import { motion } from 'framer-motion';
import { FaArrowDown, FaArrowLeft, FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp, FaPinterest, FaReddit } from 'react-icons/fa';
import { getProfilePictureUrl } from '../../../../services/UsuarioService';
import { useAuth } from '../../../user/components/features/Context/AuthContext';
import { FaCaretDown } from 'react-icons/fa';

const UserPublicacionPage = () => {
  const { publicacionid } = useParams();
  const [publicacion, setPublicacion] = useState(null);
  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [nuevaRespuesta, setNuevaRespuesta] = useState('');
  const [comentarioSeleccionado, setComentarioSeleccionado] = useState(null);
  const [notification, setNotification] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchPublicacion = async () => {
      try {
        const data = await ObtenerPublicacionPorId(publicacionid);
        setPublicacion(data);
      } catch (error) {
        console.error('Error obteniendo la publicación:', error);
      }
    };

    const fetchComentarios = async () => {
      try {
        const data = await obtenerComentariosPorPublicacion(publicacionid);
        const comentariosConRespuestas = await Promise.all(
          data.map(async (comentario) => {
            try {
              const respuestas = await obtenerRespuestasPorComentario(comentario.cid);
              return { ...comentario, respuestas: Array.isArray(respuestas) ? respuestas : [] };
            } catch (error) {
              console.error('Error obteniendo respuestas:', error);
              return { ...comentario, respuestas: [] };
            }
          })
        );
        setComentarios(comentariosConRespuestas);
      } catch (error) {
        console.error('Error obteniendo comentarios:', error);
      }
    };

    fetchPublicacion();
    fetchComentarios();
  }, [publicacionid]);

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    if (!user || !user.username) {
      setNotification('Debes estar logueado para comentar');
      return;
    }
    try {
      const data = await crearComentario(user.username, publicacionid, { comentario: nuevoComentario });
      setComentarios([...comentarios, { ...data, respuestas: [] }]);
      setNuevoComentario('');
      setNotification('Comentario añadido exitosamente');
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setNotification('Error: Comentario duplicado');
      } else {
        console.error('Error añadiendo comentario:', error);
        setNotification('Error añadiendo comentario');
      }
    }
  };

  const handleRespuestaSubmit = async (event, comentarioId) => {
    event.preventDefault();
    if (!user || !user.username) {
      setNotification('Debes estar logueado para responder');
      return;
    }
    if (!comentarioId) {
      console.error('Comentario ID is undefined');
      setNotification('Error: Comentario no encontrado');
      return;
    }
    try {
      const data = await crearRespuesta(user.username, comentarioId, nuevaRespuesta);
      setComentarios(comentarios.map(comentario =>
        comentario.cid === comentarioId
          ? { ...comentario, respuestas: [...comentario.respuestas, data] }
          : comentario
      ));
      setNuevaRespuesta('');
      setComentarioSeleccionado(null);
      setNotification('Respuesta añadida exitosamente');
    } catch (error) {
      console.error('Error añadiendo respuesta:', error);
      setNotification('Error añadiendo respuesta');
    }
  };

  const handleMostrarRespuestas = async (comentarioId, startIndex) => {
    try {
      const nuevasRespuestas = await obtenerRespuestasPorComentario(comentarioId);
      setComentarios(comentarios.map(comentario =>
        comentario.cid === comentarioId
          ? {
            ...comentario,
            respuestas: [
              ...comentario.respuestas.slice(0, startIndex),
              ...nuevasRespuestas.slice(startIndex, startIndex + 3)
            ]
          }
          : comentario
      ));
    } catch (error) {
      console.error('Error obteniendo más respuestas:', error);
    }
  };

  if (!publicacion) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  const contenidoSections = publicacion.contenido.split('\n\n').map((section, index) => {
    const titleMatch = section.match(/<h2>(.*?)<\/h2>/);
    const title = titleMatch ? titleMatch[1] : `Sección ${index + 1}`;
    const text = titleMatch ? section.replace(titleMatch[0], '').trim() : section.trim();
    const sectionId = `section-${index + 1}`;
    return {
      id: sectionId,
      text,
      title
    };
  });  

  const resumen = contenidoSections.map(section => section.text).join(' ').substring(0, 200);

  return (
    <div className="container mx-auto p-4 lg:max-w-7xl mt-72">
      <motion.h1
        className="text-4xl font-extrabold mb-6 text-center text-gray-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {publicacion.titulo}
      </motion.h1>
      <div className="flex flex-col lg:flex-row lg:space-x-8">
        <div className="w-full lg:w-2/3 p-4 bg-white rounded-lg shadow-lg">
          <motion.img
            src={`data:image/jpeg;base64,${publicacion.foto}`}
            alt={publicacion.titulo}
            className="w-full h-80 object-cover rounded-lg mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
          {contenidoSections.map((section, index) => (
            <motion.div
              key={section.id}
              id={section.id}
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <h2 className="text-2xl font-semibold mb-2 text-gray-800">{section.title}</h2>
              <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: section.text }}></div>
            </motion.div>
          ))}

          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Si te ha gustado, comparte este blog:</h2>
            <div className="flex space-x-4">
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}&quote=${resumen}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 text-3xl hover:text-blue-800"
              >
                <FaFacebook />
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${window.location.href}&text=${resumen}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 text-3xl hover:text-blue-600"
              >
                <FaTwitter />
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}&summary=${resumen}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 text-3xl hover:text-blue-900"
              >
                <FaLinkedin />
              </a>
              <a
                href={`https://wa.me/?text=${resumen} ${window.location.href}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-500 text-3xl hover:text-green-700"
              >
                <FaWhatsapp />
              </a>
              <a
                href={`https://pinterest.com/pin/create/button/?url=${window.location.href}&description=${resumen}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-600 text-3xl hover:text-red-800"
              >
                <FaPinterest />
              </a>
              <a
                href={`https://www.reddit.com/submit?url=${window.location.href}&title=${publicacion.titulo}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-500 text-3xl hover:text-orange-700"
              >
                <FaReddit />
              </a>
            </div>
          </div>

          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Comentarios</h2>
            <form onSubmit={handleCommentSubmit} className="mb-4 flex items-start space-x-4">
              {user && user.profilePicture ? (
                <img
                  src={getProfilePictureUrl(user.profilePicture)}
                  className="w-10 h-10 rounded-full"
                  alt="User profile"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-white">
                  {user ? user.name.charAt(0).toUpperCase() : '?'}
                </div>
              )}
              <textarea
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={`Añadir un comentario como ${user ? user.username : ''}`}
                value={nuevoComentario}
                onChange={(e) => setNuevoComentario(e.target.value)}
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Enviar
              </button>
            </form>
            {notification && <div className="text-green-500 mb-4">{notification}</div>}
            <ul>
              {comentarios.map((comentario) => (
                <li key={comentario.cid} className="mb-4 p-4 border border-gray-300 rounded-lg bg-gray-50">
                  <div className="flex items-center mb-2">
                    {comentario.usuarioFoto ? (
                      <img src={`data:image/jpeg;base64,${comentario.usuarioFoto}`} alt={comentario.username} className="w-10 h-10 rounded-full mr-4" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-300 text-gray-700 flex items-center justify-center mr-4">
                        {comentario.username ? comentario.username.charAt(0) : '?'}
                      </div>
                    )}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">{comentario.username}</h4>
                      <span className="text-sm text-gray-600">{new Date(comentario.fechaCreacion).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <p className="text-gray-700">{comentario.comentario}</p>
                  <button
                    onClick={() => setComentarioSeleccionado(comentario.cid)}
                    className="text-blue-500 hover:underline mt-2"
                  >
                    Responder
                  </button>
                  {comentarioSeleccionado === comentario.cid && (
                    <form onSubmit={(e) => handleRespuestaSubmit(e, comentario.cid)} className="mt-4 flex items-start space-x-4">
                      {user && user.profilePicture ? (
                        <img
                          src={getProfilePictureUrl(user.profilePicture)}
                          className="w-8 h-8 rounded-full"
                          alt="User profile"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white">
                          {user ? user.name.charAt(0).toUpperCase() : '?'}
                        </div>
                      )}
                      <textarea
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={`Responder como ${user ? user.username : ''}`}
                        value={nuevaRespuesta}
                        onChange={(e) => setNuevaRespuesta(e.target.value)}
                      />
                      <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                      >
                        Enviar
                      </button>
                    </form>
                  )}
                  {Array.isArray(comentario.respuestas) && comentario.respuestas.length > 0 && (
                    <div className="mt-4">
                      <ul className="pl-8">
                        {comentario.respuestas.slice(0, comentario.respuestasVisible || 3).map((respuesta) => (
                          <li key={respuesta.rid} className="mb-2 p-2 border border-gray-200 rounded-lg bg-gray-100">
                            <div className="flex items-center mb-1">
                              {respuesta.usuarioFoto ? (
                                <img src={`data:image/jpeg;base64,${respuesta.usuarioFoto}`} alt={respuesta.username} className="w-8 h-8 rounded-full mr-3" />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-700 flex items-center justify-center mr-3">
                                  {respuesta.username ? respuesta.username.charAt(0) : '?'}
                                </div>
                              )}
                              <div>
                                <h5 className="text-md font-semibold text-gray-800">{respuesta.username}</h5>
                                <span className="text-sm text-gray-600">{new Date(respuesta.fechaCreacion).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <p className="text-gray-700">{respuesta.respuesta}</p>
                          </li>
                        ))}
                      </ul>
                      {comentario.respuestas.length > (comentario.respuestasVisible || 3) && (
                        <button
                          onClick={() => handleMostrarRespuestas(comentario.cid, comentario.respuestasVisible || 3)}
                          className="text-blue-500 flex items-center mt-2 hover:underline"
                        >
                          Mostrar más respuestas {comentario.respuestas.length - (comentario.respuestasVisible || 3)}
                          <FaCaretDown className="ml-2" />
                        </button>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
            <Link to="/frontend-repo/publicaciones" className="text-blue-500 hover:underline mt-8 block flex items-center py-4 px-2 hover:bg-gray-200 transition-colors duration-300">
              <FaArrowLeft className="mr-2 text-xl" /> Volver a todas las publicaciones
            </Link>
          </div>
        </div>
        <div className="w-full lg:w-1/3 p-4 lg:sticky lg:top-20">
          <div className="bg-white rounded-lg shadow-lg p-4">
            <motion.h2
              className="text-2xl font-bold mb-4 text-gray-800"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Tabla de contenidos
            </motion.h2>
            <ul className="list-decimal ml-5 space-y-2 text-gray-800">
              {contenidoSections.map((section, index) => (
                <motion.li
                  key={section.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <button
                    onClick={() => document.getElementById(section.id).scrollIntoView({ behavior: 'smooth' })}
                    className="text-blue-500 hover:underline flex items-center"
                  >
                    {section.title} <FaArrowDown className="ml-2" />
                  </button>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPublicacionPage;
