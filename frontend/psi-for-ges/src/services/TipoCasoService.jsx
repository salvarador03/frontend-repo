import axios from 'axios';

const API_URL = import.meta.env.VITE_API_ENDPOINT;

export const getTiposCaso = async () => {
  const response = await axios.get(`${API_URL}/tipos-caso`);
  return response.data;
};

export const getTipoCasoById = async (id) => {
  const response = await axios.get(`${API_URL}/tipos-caso/${id}`);
  return response.data;
};

export const createTipoCaso = async (tipoCaso) => {
  const response = await axios.post(`${API_URL}/tipos-caso`, tipoCaso);
  return response.data;
};

export const updateTipoCaso = async (id, tipoCaso) => {
  const response = await axios.put(`${API_URL}/tipos-caso/${id}`, tipoCaso);
  return response.data;
};

export const deleteTipoCaso = async (id) => {
  const response = await axios.delete(`${API_URL}/tipos-caso/${id}`);
  return response.data;
};
