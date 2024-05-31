import axios from 'axios';

const apiEndpoint = import.meta.env.VITE_API_ENDPOINT;

export const AddPublicacionConDatosForm = async (stateData, imagedata, categoriaId, username) => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    console.error('No authentication token found');
    throw new Error('No authentication token found');
  }

  const formData = new FormData();
  const publicacion = {
    titulo: stateData.titulo,
    contenido: stateData.contenido,
    categoriaId: Number(categoriaId),
    username: username
  };

  formData.append('publicacion', JSON.stringify(publicacion));
  if (imagedata) {
    formData.append('file', imagedata);
  } else {
    throw new Error('File is required');
  }

  try {
    const response = await axios.post(`${apiEndpoint}/publicaciones`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error adding publication:', error);
    throw error;
  }
};

export const CargarTodasLasPublicaciones = async (masrecienteprimero = true) => {
  try {
    const response = await axios.get(`${apiEndpoint}/publicaciones`, {
      params: { masrecienteprimero },
    });
    console.log('Publicaciones cargadas:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error loading publications:', error);
    throw error;
  }
};

export const ObtenerPublicacionPorId = async (publicacionid) => {
  try {
    const response = await axios.get(`${apiEndpoint}/publicaciones/${publicacionid}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching publication:', error);
    throw error;
  }
};

export const BorrarPublicacionPorId = async (publicacionid) => {
  const token = localStorage.getItem('authToken');
  if (!token) throw new Error('No authentication token found');

  try {
    await axios.delete(`${apiEndpoint}/publicaciones/${publicacionid}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error('Error deleting publication:', error);
    throw error;
  }
};

export const fetchPublicacionPorId = async (publicacionid) => {
  const token = localStorage.getItem('authToken');
  if (!token) throw new Error('No authentication token found');

  try {
    const response = await axios.get(`${apiEndpoint}/publicaciones/${publicacionid}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching publication:', error);
    throw error;
  }
};

export const updatePublicacion = async (publicacionid, publicacionData, file = null) => {
  const token = localStorage.getItem('authToken');
  if (!token) throw new Error('No authentication token found');

  let formData;
  let headers = {
    'Authorization': `Bearer ${token}`,
  };

  if (file) {
    formData = new FormData();
    formData.append('publicacion', JSON.stringify(publicacionData));
    formData.append('file', file);
    headers['Content-Type'] = 'multipart/form-data';
  } else {
    formData = publicacionData;
    headers['Content-Type'] = 'application/json';
  }

  try {
    const response = await axios.put(`${apiEndpoint}/publicaciones/${publicacionid}`, formData, { headers });
    return response.data;
  } catch (error) {
    console.error('Error updating publication:', error);
    throw error;
  }
};


// Nuevo método para obtener comentarios por publicación
export const obtenerComentariosPorPublicacion = async (publicacionid) => {
  try {
    const response = await axios.get(`${apiEndpoint}/publicaciones/${publicacionid}/comentarios`);
    return response.data;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};
