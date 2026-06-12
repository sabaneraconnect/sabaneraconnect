import api from './api';

const authHeader = (token) => ({ headers: { Authorization: `Bearer ${token}` } });

export const obtenerPerfil = (id) => api.get(`/api/bandas/${id}`);
export const actualizarPerfil = (id, datos, token) => api.put(`/api/bandas/${id}`, datos, authHeader(token));
export const subirMultimedia = (id, archivo, tipo, token) => {
  const form = new FormData();
  form.append('archivo', archivo);
  form.append('tipo', tipo);
  return api.post(`/api/bandas/${id}/multimedia`, form, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
  });
};
export const eliminarMultimedia = (id, archivoId, token) =>
  api.delete(`/api/bandas/${id}/multimedia/${archivoId}`, authHeader(token));
export const publicarPerfil = (id, token) => api.put(`/api/bandas/${id}/publicar`, {}, authHeader(token));
