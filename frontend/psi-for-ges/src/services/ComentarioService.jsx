import axios from 'axios';
const apiEndpoint = import.meta.env.VITE_API_ENDPOINT;

export const crearComentario = async (username, postid, comentario) => {
    const token = localStorage.getItem('authToken');

    try {
        const response = await axios.post(`${apiEndpoint}/usuarios/${username}/publicaciones/${postid}/comentarios`, comentario, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error creating comment:', error);
        throw error;
    }
};

export const actualizarComentario = async (username, postid, commentid, comentario) => {
    const token = localStorage.getItem('authToken');

    try {
        const response = await axios.put(`${apiEndpoint}/usuarios/${username}/publicaciones/${postid}/comentarios/${commentid}`, comentario, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error updating comment:', error);
        throw error;
    }
};

export const eliminarComentario = async (username, postid, commentid) => {
    const token = localStorage.getItem('authToken');

    try {
        const response = await axios.delete(`${apiEndpoint}/usuarios/${username}/publicaciones/${postid}/comentarios/${commentid}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting comment:', error);
        throw error;
    }
};
