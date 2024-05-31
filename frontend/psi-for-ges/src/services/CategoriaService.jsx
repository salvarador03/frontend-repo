import axios from 'axios';

const apiEndpoint = import.meta.env.VITE_API_ENDPOINT;

export const CargarCategorias = async () => {
    const token = localStorage.getItem('authToken');

    try {
        const response = await axios.get(`${apiEndpoint}/categorias`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
};

export const CrearCategoria = async (categoria) => {
    const token = localStorage.getItem('authToken');

    try {
        const response = await axios.post(`${apiEndpoint}/categorias`, categoria, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error creating category:', error);
        throw error;
    }
};

export const ActualizarCategoria = async (cid, categoria) => {
    const token = localStorage.getItem('authToken');

    try {
        const response = await axios.put(`${apiEndpoint}/categorias/${cid}`, categoria, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error updating category:', error);
        throw error;
    }
};

export const EliminarCategoria = async (cid) => {
    const token = localStorage.getItem('authToken');

    try {
        const response = await axios.delete(`${apiEndpoint}/categorias/${cid}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting category:', error);
        throw error;
    }
};
