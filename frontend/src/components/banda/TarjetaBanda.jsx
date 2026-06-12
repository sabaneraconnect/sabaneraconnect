import { Link } from 'react-router-dom';

export default function TarjetaBanda({ banda }) {
  return (
    <Link to={`/banda/${banda.id}`} style={styles.enlace}>
      <div style={styles.tarjeta}>
        <div style={styles.fotoContenedor}>
          {banda.foto ? (
            <img src={banda.foto} alt={banda.nombre} style={styles.foto} />
          ) : (
            <div style={styles.fotoPlaceholder}>
              <span style={styles.fotoIcono}>🎵</span>
            </div>
          )}
        </div>
        <div style={styles.info}>
          <h3 style={styles.nombre}>{banda.nombre}</h3>
          {banda.generos && <p style={styles.generos}>{banda.generos}</p>}
          <p style={styles.ubicacion}>
            {[banda.municipio, banda.departamento].filter(Boolean).join(', ')}
          </p>
          {banda.rangoPrecio && <p style={styles.precio}>{banda.rangoPrecio}</p>}
          <p style={styles.estrellas}>
            {banda.promedioEstrellas != null
              ? `★ ${banda.promedioEstrellas}`
              : 'Sin reseñas aún'}
          </p>
        </div>
      </div>
    </Link>
  );
}

const styles = {
  enlace: { textDecoration: 'none', color: 'inherit' },
  tarjeta: {
    backgroundColor: '#fff',
    borderRadius: 'var(--radio-borde)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
    overflow: 'hidden',
    transition: 'box-shadow 0.2s',
    display: 'flex',
    flexDirection: 'column',
  },
  fotoContenedor: { width: '100%', height: '160px', overflow: 'hidden', backgroundColor: '#f3f4f6' },
  foto: { width: '100%', height: '100%', objectFit: 'cover' },
  fotoPlaceholder: { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  fotoIcono: { fontSize: '2.5rem' },
  info: { padding: 'var(--espaciado-md)', display: 'flex', flexDirection: 'column', gap: 4 },
  nombre: { margin: 0, fontFamily: 'var(--fuente-encabezado)', color: 'var(--color-primario)', fontSize: '1rem' },
  generos: { margin: 0, fontSize: '0.85rem', color: 'var(--color-texto-secundario)' },
  ubicacion: { margin: 0, fontSize: '0.85rem', color: 'var(--color-texto-secundario)' },
  precio: { margin: 0, fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-texto)' },
  estrellas: { margin: 0, fontSize: '0.85rem', color: '#b45309' },
};
