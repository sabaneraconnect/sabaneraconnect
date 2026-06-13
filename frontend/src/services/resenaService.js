import axios from 'axios';
const BASE = import.meta.env.VITE_API_URL;

export const crearResena = (solicitudId, calificacion, comentario, token) =>
  axios.post(`${BASE}/api/resenas/${solicitudId}`, { calificacion, comentario }, { headers: { Authorization: `Bearer ${token}` } });

export const responderResena = (resenaId, respuesta, token) =>
  axios.put(`${BASE}/api/resenas/${resenaId}/respuesta`, { respuesta }, { headers: { Authorization: `Bearer ${token}` } });

export const obtenerResenasPorBanda = (bandaId) =>
  axios.get(`${BASE}/api/resenas/banda/${bandaId}`);
