import axios from 'axios';
const BASE = import.meta.env.VITE_API_URL;

const auth = (token) => ({ headers: { Authorization: `Bearer ${token}` } });

export const iniciarPago = (solicitudId, tipo, porcentajeAnticipo, token) =>
  axios.post(`${BASE}/api/pagos/${solicitudId}/iniciar`, { tipo, porcentajeAnticipo }, auth(token));

export const confirmarPagoUno = (solicitudId, token) =>
  axios.post(`${BASE}/api/pagos/${solicitudId}/confirmar-uno`, {}, auth(token));

export const iniciarPagoDos = (solicitudId, token) =>
  axios.post(`${BASE}/api/pagos/${solicitudId}/iniciar-dos`, {}, auth(token));

export const confirmarPagoDos = (solicitudId, token) =>
  axios.post(`${BASE}/api/pagos/${solicitudId}/confirmar-dos`, {}, auth(token));

export const obtenerPago = (solicitudId, token) =>
  axios.get(`${BASE}/api/pagos/${solicitudId}`, auth(token));
