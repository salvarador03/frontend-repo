import axios from 'axios';

const apiEndpoint = import.meta.env.VITE_API_ENDPOINT;

export const fetchFaqs = async () => {
    const token = localStorage.getItem('authToken');

    try {
        const response = await axios.get(`${apiEndpoint}/faqs`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching FAQs:', error);
        throw error;
    }
};

export const createFaq = async (faq) => {
    const token = localStorage.getItem('authToken');

    try {
        const response = await axios.post(`${apiEndpoint}/faqs`, faq, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error creating FAQ:', error);
        throw error;
    }
};

export const updateFaq = async (id, faq) => {
    const token = localStorage.getItem('authToken');

    try {
        const response = await axios.put(`${apiEndpoint}/faqs/${id}`, faq, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error updating FAQ:', error);
        throw error;
    }
};

export const deleteFaq = async (id) => {
    const token = localStorage.getItem('authToken');

    try {
        await axios.delete(`${apiEndpoint}/faqs/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error deleting FAQ:', error);
        throw error;
    }
};
