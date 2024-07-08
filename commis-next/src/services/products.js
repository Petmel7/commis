import api from './api';

export const getProducts = async () => {
    const response = await api.get('/products');
    return response.data;
};

export const addProducts = async (formData) => {
    const response = await api.post('/products', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};
