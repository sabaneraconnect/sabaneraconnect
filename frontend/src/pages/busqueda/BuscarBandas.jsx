import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { buscarBandas } from '../../services/busquedaService';
import TarjetaBanda from '../../components/banda/TarjetaBanda';
import Paginacion from '../../components/common/Paginacion';
import { GENEROS_MUSICALES, DEPARTAMENTOS } from '../../constants/ubicaciones';

const filtrosIniciales = { genero: '', departamento: '', fecha: '', franjaInicio: '', franjaFin: '' };

export default function BuscarBandas() {
  const [filtros, setFiltros] = useState(filtrosIniciales);
  const [filtrosActivos, setFiltrosActivos] = useState(filtrosIniciales);
  const [resultados, setResultados] = useState([]);
  const [total, setTotal] = useState(0);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [buscado, setBuscado] = useState(false);

  const ejecutarBusqueda = async (filtrosUsados, paginaUsada) => {
    setCargando(true);
    setError(null);
    try {
      const res = await buscarBandas(filtrosUsados, paginaUsada);
      setResultados(res.data.resultados);
      setTotal(res.data.total);
      setPagina(res.data.pagina);
      setTotalPaginas(res.data.totalPaginas);
      setBuscado(true);
    } catch {
      setError('Error al buscar bandas. Intenta de nuevo.');
    } finally {
      setCargando(false);
    }
  };

  const handleBuscar = (e) => {
    e.preventDefault();
    setFiltrosActivos(filtros);
    ejecutarBusqueda(filtros, 1);
  };

  const handleCambioPagina = (nuevaPagina) => {
    ejecutarBusqueda(filtrosActivos, nuevaPagina);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleChange = (e) => setFiltros({ ...filtros, [e.target.name]: e.target.value });

  return (
    <div style={styles.pagina}>
      <Helmet>
        <title>Buscar bandas musicales para tu evento — SabaneraConnect</title>
        <meta name="description" content="Encuentra bandas disponibles por género, departamento, fecha y horario para tu evento." />
      </Helmet>
      <div style={styles.contenedor}>
        <h1 style={styles.titulo}>Buscar bandas</h1>

        <form onSubmit={handleBuscar} style={styles.formulario}>
          <div style={styles.formGrid}>
            <div style={styles.campo}>
              <label style={styles.label}>Género musical</label>
              <select name="genero" value={filtros.genero} onChange={handleChange} style={styles.input}>
                <option value="">Todos los géneros</option>
                {GENEROS_MUSICALES.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div style={styles.campo}>
              <label style={styles.label}>Departamento</label>
              <select name="departamento" value={filtros.departamento} onChange={handleChange} style={styles.input}>
                <option value="">Todos los departamentos</option>
                {DEPARTAMENTOS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div style={styles.campo}>
              <label style={styles.label}>Fecha del evento</label>
              <input type="date" name="fecha" value={filtros.fecha} onChange={handleChange} style={styles.input} />
            </div>

            <div style={styles.campo}>
              <label style={styles.label}>Hora inicio</label>
              <input type="time" name="franjaInicio" value={filtros.franjaInicio} onChange={handleChange} style={styles.input} />
            </div>

            <div style={styles.campo}>
              <label style={styles.label}>Hora fin</label>
              <input type="time" name="franjaFin" value={filtros.franjaFin} onChange={handleChange} style={styles.input} />
            </div>
          </div>

          <button type="submit" disabled={cargando} style={styles.botonBuscar}>
            {cargando ? 'Buscando...' : 'Buscar'}
          </button>
        </form>

        {error && <p style={styles.errorMsg}>{error}</p>}

        {buscado && !cargando && (
          <>
            <p style={styles.total}>
              {total === 0 ? 'No se encontraron bandas con esos criterios.' : `${total} banda${total !== 1 ? 's' : ''} encontrada${total !== 1 ? 's' : ''}`}
            </p>

            {resultados.length > 0 && (
              <>
                <div style={styles.grid}>
                  {resultados.map((b) => (
                    <TarjetaBanda key={b.id} banda={b} />
                  ))}
                </div>
                <Paginacion paginaActual={pagina} totalPaginas={totalPaginas} onCambioPagina={handleCambioPagina} />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  pagina: { minHeight: '100vh', backgroundColor: 'var(--color-fondo)', padding: 'var(--espaciado-lg)' },
  contenedor: { maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--espaciado-lg)' },
  titulo: { margin: 0, fontFamily: 'var(--fuente-encabezado)', color: 'var(--color-primario)', fontSize: '1.75rem' },
  formulario: {
    backgroundColor: '#fff', borderRadius: 'var(--radio-borde)',
    padding: 'var(--espaciado-xl)', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    display: 'flex', flexDirection: 'column', gap: 'var(--espaciado-md)',
  },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 'var(--espaciado-md)' },
  campo: { display: 'flex', flexDirection: 'column', gap: 4 },
  label: { fontSize: '0.85rem', color: 'var(--color-texto-secundario)' },
  input: {
    padding: 'var(--espaciado-sm) var(--espaciado-md)', border: '1px solid #ddd',
    borderRadius: 'var(--radio-borde)', fontSize: '0.95rem',
    fontFamily: 'var(--fuente-cuerpo)', color: 'var(--color-texto)', outline: 'none',
  },
  botonBuscar: {
    alignSelf: 'flex-start', padding: 'var(--espaciado-sm) var(--espaciado-xl)',
    backgroundColor: 'var(--color-primario)', color: '#fff',
    border: 'none', borderRadius: 'var(--radio-borde)',
    fontSize: '1rem', fontFamily: 'var(--fuente-encabezado)', fontWeight: 600, cursor: 'pointer',
  },
  total: { margin: 0, color: 'var(--color-texto-secundario)', fontSize: '0.9rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 'var(--espaciado-md)' },
  errorMsg: { backgroundColor: '#fde8e8', color: '#c0392b', padding: 'var(--espaciado-sm) var(--espaciado-md)', borderRadius: 'var(--radio-borde)', fontSize: '0.9rem', margin: 0 },
};
