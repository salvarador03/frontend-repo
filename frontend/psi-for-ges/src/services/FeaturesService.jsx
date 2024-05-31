import axios from 'axios';

const apiEndpoint = import.meta.env.VITE_API_ENDPOINT;

export const loginUsuario = async (usuario, contrasena, language) => {
    try {
        const response = await axios.post(`${apiEndpoint}/usuarios/login`, {
            usuario,
            contrasena,
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
            params: { lang: language },
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
};

export const registerUsuario = async (data, language) => {
  try {
      const response = await axios.post(`${apiEndpoint}/usuarios/register`, data, {
          headers: { "Content-Type": "application/json" },
          params: { lang: language },
          withCredentials: true,
      });

      // Comprueba si la respuesta es exitosa y tiene el token
      if (response.status === 201 && response.data.token) {
          return {
              status: 201,
              token: response.data.token,
              message: response.data.message
          };
      } else {
          // Maneja la respuesta que no tiene el token
          return {
              status: response.status,
              message: response.data.message || "Error desconocido"
          };
      }
  } catch (error) {
      console.error("An error occurred during registration:", error);
      // Lanza el error para manejarlo desde frontend
      throw {
          status: error.response?.status || 500,
          message: error.response?.data?.message || "Error desconocido"
      };
  }
};

export const getUserMessages = async (language) => {
    try {
        const response = await axios.get(`${apiEndpoint}/usuarios/messages`, {
            params: { lang: language },
        });
        return response.data;
    } catch (error) {
        console.error('Failed to load i18n messages:', error);
        throw error;
    }
};

export const getMessages = async (language) => {
    try {
        const response = await axios.get(`${apiEndpoint}/messages`, {
            params: { lang: language },
        });
        return response.data;
    } catch (error) {
        console.error('Failed to load i18n messages:', error);
        throw error;
    }
};

export const forgotPassword = async (email) => {
    try {
      const response = await axios.post(`${apiEndpoint}/usuarios/forgot-password`, { email }, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("An error occurred during password reset request:", error);
      throw error;
    }
  };
  
export const verifyResetToken = async (token) => {
    try {
      const response = await axios.post(`${apiEndpoint}/usuarios/verify-reset-token`, { token }, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.status === 200;
    } catch (error) {
      console.error("Error verifying token:", error);
      throw error;
    }
};
  
export const resetPassword = async (token, newPassword) => {
    try {
      const response = await axios.put(`${apiEndpoint}/usuarios/reset-password`, { token, newPassword }, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("An error occurred during password reset:", error);
      throw error;
    }
};

export const sendContactEmail = async (data) => {
    try {
        const response = await axios.post(`${apiEndpoint}/contacto/enviarEmail`, data, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.status;
    } catch (error) {
        console.error('Error sending contact email:', error);
        throw error;
    }
};

export const getServiceList = async () => {
    try {
        const response = await axios.get(`${apiEndpoint}/servicios`);
        return response.data;
    } catch (error) {
        console.error('Failed to load services list:', error);
        throw error;
    }
};

export const contractService = async (data) => {
    try {
        const response = await axios.post(`${apiEndpoint}/contacto/contratar`, {
            ...data,
            servicio: {
                id: data.servicio, // Enviar solo el ID del servicio
            },
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.status;
    } catch (error) {
        console.error('Error contracting service:', error);
        throw error;
    }
};
