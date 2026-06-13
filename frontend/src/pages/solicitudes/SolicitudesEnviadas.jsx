import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { listarMisSolicitudes } from '../../services/solicitudService';

const COLORES_ESTADO = {
  pendiente:      { bg: '#fef3c7', color: '#92400e' },
  en_negociacion: { bg: '#fed7aa', color: '#9a3412' },
  confirmada:     { bg: '#d1fae5', color: '#065f46' },
  rechazada:      { bg: '#fde8e8', color: '#c0392b' },
  cancelada:      { bg: '#fde8e8', color: '#c0392b' },
};

const ETIQUETAS = { pendiente: 'Pendiente', en_negociacion: 'En negociación', confirmada: 'Confirmada', rechazada: 'Rechazada', cancelada: 'Cancelada' };

export default function SolicitudesEnviadas() {
  const token = localStorage.getItem('token');
  const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');
  const [solicitudes, setSolicitudes] = useState([]);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!token) { setCargando(false); return; }
    listarMisSolicitudes(token)
      .then((r) => setSolicitudes(r.data))
      .catch(() => setError('Error al cargar las solicitudes.'))
      .finally(() => setCargando(false));
  }, []);

  if (!token || !usuario) return <div style={styles.pagina}><p>Debes iniciar sesión para ver tus solicitudes.</p></div>;

  return (
    <div style={styles.pagina}>
      <div style={styles.contenedor}>
        <h1 style={styles.titulo}>Mis solicitudes enviadas</h1>
        {error && <p style={styles.errorMsg}>{error}</p>}
        {cargando && <p>Cargando...</p>}
        {!cargando && solicitudes.length === 0 && <p style={styles.vacio}>No has enviado solicitudes aún.</p>}
        {solicitudes.map((s) => {
          const c = COLORES_ESTADO[s.estado] || COLORES_ESTADO.pendiente;
          const fechaStr = new Date(s.fecha).toLocaleDateString('es-CO', { dateStyle: 'medium', timeZone: 'UTC' });
          return (
            <Link key={s.id} to={`/solicitudes/${s.id}`} style={styles.enlace}>
              <div style={styles.fila}>
                <div style={styles.filaInfo}>
                  <span style={styles.banda}>{s.banda.usuario.nombre}</span>
                  <span style={styles.fecha}>{fechaStr} · {s.franjaInicio}–{s.franjaFin}</span>
                  <span style={styles.tipo}>{s.tipoEvento} · {s.municipio}</span>
                </div>
                <span style={{ ...styles.badge, backgroundColor: c.bg, color: c.color }}>{ETIQUETAS[s.estado] ?? s.estado}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  pagina: { minHeight: '100vh', backgroundColor: 'var(--color-fondo)', padding: 'var(--espaciado-lg)' },
  contenedor: { maxWidth: '700px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--espaciado-md)' },
  titulo: { margin: 0, fontFamily: 'var(--fuente-encabezado)', color: 'var(--color-primario)', fontSize: '1.5rem' },
  enlace: { textDecoration: 'none', color: 'inherit' },
  fila: { backgroundColor: '#fff', borderRadius: 'var(--radio-borde)', padding: 'var(--espaciado-md)', boxShadow: '0 1px 4px rgba(0,0,0,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--espaciado-md)', flexWrap: 'wrap' },
  filaInfo: { display: 'flex', flexDirection: 'column', gap: 2 },
  banda: { fontWeight: 600, color: 'var(--color-texto)', fontSize: '1rem' },
  fecha: { fontSize: '0.85rem', color: 'var(--color-texto-secundario)' },
  tipo: { fontSize: '0.85rem', color: 'var(--color-texto-secundario)' },
  badge: { padding: '4px 12px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 600, whiteSpace: 'nowrap' },
  vacio: { color: 'var(--color-texto-secundario)', fontSize: '0.9rem' },
  errorMsg: { backgroundColor: '#fde8e8', color: '#c0392b', padding: 'var(--espaciado-sm) var(--espaciado-md)', borderRadius: 'var(--radio-borde)', fontSize: '0.9rem', margin: 0 },
};
