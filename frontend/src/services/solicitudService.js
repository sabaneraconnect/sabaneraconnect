import api from './api';

const auth = (token) => ({ headers: { Authorization: `Bearer ${token}` } });

export const crearSolicitud = (datos, token) =>
  api.post('/api/solicitudes', datos, auth(token));

export const obtenerSolicitud = (id, token) =>
  api.get(`/api/solicitudes/${id}`, auth(token));

export const listarMisSolicitudes = (token) =>
  api.get('/api/solicitudes/organizador/mias', auth(token));

export const listarSolicitudesRecibidas = (token) =>
  api.get('/api/solicitudes/banda/recibidas', auth(token));

export const responderSolicitud = (id, accion, contraOferta, token) =>
  api.put(`/api/solicitudes/${id}/respuesta`, { accion, contraOferta }, auth(token));
