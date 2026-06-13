import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const leerStorage = () => {
  try {
    const token = localStorage.getItem('token');
    const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');
    return { token, usuario };
  } catch {
    return { token: null, usuario: null };
  }
};

export default function useAuth() {
  const [{ token, usuario }, setAuth] = useState(leerStorage);
  const navigate = useNavigate();

  useEffect(() => {
    const sincronizar = () => setAuth(leerStorage());
    window.addEventListener('authChange', sincronizar);
    window.addEventListener('storage', sincronizar);
    return () => {
      window.removeEventListener('authChange', sincronizar);
      window.removeEventListener('storage', sincronizar);
    };
  }, []);

  const cerrarSesion = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    window.dispatchEvent(new Event('authChange'));
    navigate('/');
  }, [navigate]);

  return {
    usuario,
    estaAutenticado: !!token && !!usuario,
    rol: usuario?.rol ?? null,
    cerrarSesion,
  };
}
