import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000', // La URL de tu Flask
});

export const getProductos = () => api.get('/productos');
export const crearProducto = (data) => api.post('/productos', data);
export const actualizarProducto = (id, data) => api.put(`/productos/${id}`, data);
export const eliminarProducto = (id) => api.delete(`/productos/${id}`);

export default api;