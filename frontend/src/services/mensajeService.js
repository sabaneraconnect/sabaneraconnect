import axios from 'axios';
const BASE = import.meta.env.VITE_API_URL;

export const obtenerMensajes = (solicitudId, token) =>
  axios.get(`${BASE}/api/mensajes/${solicitudId}`, { headers: { Authorization: `Bearer ${token}` } });

export const enviarMensaje = (solicitudId, contenido, token) =>
  axios.post(`${BASE}/api/mensajes/${solicitudId}`, { contenido }, { headers: { Authorization: `Bearer ${token}` } });
