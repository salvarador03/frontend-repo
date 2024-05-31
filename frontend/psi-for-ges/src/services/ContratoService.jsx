import axios from 'axios';

const apiEndpoint = import.meta.env.VITE_API_ENDPOINT;

export const fetchContratos = async () => {
    const token = localStorage.getItem('authToken');

    try {
        const response = await axios.get(`${apiEndpoint}/contratos`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching contracts:', error);
        throw error;
    }
};
