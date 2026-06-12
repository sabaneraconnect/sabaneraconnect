import api from './api';

const authHeader = (token) => ({ headers: { Authorization: `Bearer ${token}` } });

export const obtenerDisponibilidad = (bandaId) => api.get(`/api/disponibilidad/${bandaId}`);
export const crearFranja = (bandaId, datos, token) => api.post(`/api/disponibilidad/${bandaId}`, datos, authHeader(token));
export const actualizarFranja = (bandaId, franjaId, datos, token) => api.put(`/api/disponibilidad/${bandaId}/${franjaId}`, datos, authHeader(token));
export const eliminarFranja = (bandaId, franjaId, token) => api.delete(`/api/disponibilidad/${bandaId}/${franjaId}`, authHeader(token));
