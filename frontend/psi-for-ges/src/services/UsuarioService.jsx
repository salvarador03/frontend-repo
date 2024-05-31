import axios from 'axios';

const apiEndpoint = import.meta.env.VITE_API_ENDPOINT;

// Configuración global de Axios para incluir credenciales
axios.defaults.withCredentials = true;

export const getUserMessages = async (language) => {
  try {
    const response = await axios.get(`${apiEndpoint}/usuarios/messages?lang=${language}`);
    return response.data;
  } catch (error) {
    console.error('Failed to load i18n messages:', error);
    throw error;
  }
};

export const getProfilePictureUrl = (base64Image) => {
  return `data:image/jpeg;base64,${base64Image}`;
};

export const getAllCountries = async () => {
  try {
    const response = await axios.get('https://restcountries.com/v3.1/all');
    const countryNames = response.data.map(country => country.name.common);
    return countryNames;
  } catch (error) {
    console.error('Error fetching countries:', error);
    throw error;
  }
};

export const updateUser = async (userId, userData, photoFile) => {
  const token = localStorage.getItem('authToken');
  const formData = new FormData();
  formData.append('usuario', new Blob([JSON.stringify(userData)], { type: 'application/json' }));
  if (photoFile) {
    formData.append('foto', photoFile);
  }

  try {
    const response = await axios.put(`${apiEndpoint}/usuarios/actualizar/${userId}`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  const token = localStorage.getItem('authToken');
  try {
    await axios.delete(`${apiEndpoint}/usuarios/eliminar/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};
