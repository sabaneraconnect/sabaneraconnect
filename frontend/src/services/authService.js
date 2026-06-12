import api from './api';

export const registrarBanda = (datos) => api.post('/api/auth/registro-banda', datos);
export const registrarOrganizador = (datos) => api.post('/api/auth/registro-organizador', datos);
export const login = (correo, contrasena) => api.post('/api/auth/login', { correo, contrasena });
export const recuperarContrasena = (correo) => api.post('/api/auth/recuperar-contrasena', { correo });
export const nuevaContrasena = (token, nuevaContrasena) => api.put('/api/auth/nueva-contrasena', { token, nuevaContrasena });
