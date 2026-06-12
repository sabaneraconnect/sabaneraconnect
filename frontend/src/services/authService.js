import api from './api';

export const registrarBanda = (datos) => api.post('/api/auth/registro-banda', datos);
export const registrarOrganizador = (datos) => api.post('/api/auth/registro-organizador', datos);
