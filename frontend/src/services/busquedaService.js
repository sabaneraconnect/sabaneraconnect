import api from './api';

export const buscarBandas = (filtros = {}, pagina = 1, limite = 5) => {
  const params = new URLSearchParams();
  Object.entries(filtros).forEach(([k, v]) => { if (v) params.set(k, v); });
  params.set('pagina', pagina);
  params.set('limite', limite);
  return api.get(`/api/busqueda/bandas?${params.toString()}`);
};
