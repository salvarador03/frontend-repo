import axios from 'axios';

const API_URL = import.meta.env.VITE_API_ENDPOINT;

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const obtenerRespuestasPorComentario = async (comentarioId) => {
  try {
    const response = await axios.get(`${API_URL}/respuestas/comentario/${comentarioId}`);
    return response.data;
  } catch (error) {
    console.error('Error obteniendo respuestas por comentario:', error);
    throw error;
  }
};

export const crearRespuesta = async (username, comentarioId, respuesta) => {
  try {
    const response = await axios.post(`${API_URL}/respuestas`, { username, comentarioId, respuesta });
    return response.data;
  } catch (error) {
    console.error('Error creando respuesta:', error);
    throw error;
  }
};
