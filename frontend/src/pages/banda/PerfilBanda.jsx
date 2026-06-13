import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { obtenerPerfil } from '../../services/bandaService';
import CalendarioDisponibilidad from '../../components/banda/CalendarioDisponibilidad';
import SelectorEstrellas from '../../components/resenas/SelectorEstrellas';
import TarjetaResena from '../../components/resenas/TarjetaResena';
import { obtenerResenasPorBanda } from '../../services/resenaService';

export default function PerfilBanda() {
  const { id } = useParams();
  const [banda, setBanda] = useState(null);
  const [error, setError] = useState(null);
  const [resenasData, setResenasData] = useState({ promedioEstrellas: null, total: 0, resenas: [] });

  useEffect(() => {
    obtenerPerfil(id)
      .then((res) => {
        setBanda(res.data);
        obtenerResenasPorBanda(res.data.id)
          .then((r) => setResenasData(r.data))
          .catch(() => {});
      })
      .catch(() => setError('No se encontró el perfil de esta banda.'));
  }, [id]);

  if (error) return <div style={styles.pagina}><p style={styles.errorMsg}>{error}</p></div>;
  if (!banda) return <div style={styles.pagina}><p>Cargando...</p></div>;

  const fotos = banda.multimedia.filter((m) => m.tipo === 'foto');
  const videos = banda.multimedia.filter((m) => m.tipo === 'video');

  const nombreBanda = banda.usuario.nombre;
  const tituloPagina = nombreBanda ? `${nombreBanda} — SabaneraConnect` : 'Perfil de banda — SabaneraConnect';
  const descPagina = nombreBanda
    ? `Conoce el repertorio${banda.generos ? ` (${banda.generos})` : ''}, disponibilidad y reseñas de ${nombreBanda}, banda musical del Caribe colombiano.`
    : 'Conoce el perfil de esta banda musical del Caribe colombiano.';

  return (
    <div style={styles.pagina}>
      <Helmet>
        <title>{tituloPagina}</title>
        <meta name="description" content={descPagina} />
      </Helmet>
      <div style={styles.contenedor}>
        <div style={styles.encabezado}>
          <h1 style={styles.nombre}>{banda.usuario.nombre}</h1>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ ...styles.estado, ...(banda.estadoPerfil === 'publicado' ? styles.publicado : styles.borrador) }}>
              {banda.estadoPerfil === 'publicado' ? 'Publicado' : 'Borrador'}
            </span>
            <Link to={`/solicitudes/nueva/${banda.id}`} style={styles.btnSolicitar}>
              Solicitar contratación
            </Link>
          </div>
        </div>

        <div style={styles.grid}>
          {banda.municipio && <Dato label="Municipio base" valor={banda.municipio} />}
          {banda.aniosExperiencia > 0 && <Dato label="Años de experiencia" valor={banda.aniosExperiencia} />}
          {banda.generos && <Dato label="Géneros" valor={banda.generos} />}
          {banda.integrantes && <Dato label="Integrantes" valor={banda.integrantes} />}
          {banda.municipiosCobertura && <Dato label="Cobertura" valor={banda.municipiosCobertura} />}
          {banda.usuario.telefono && <Dato label="Contacto" valor={banda.usuario.telefono} />}
        </div>

        {fotos.length > 0 && (
          <section style={styles.seccion}>
            <h2 style={styles.subtitulo}>Fotos</h2>
            <div style={styles.galeria}>
              {fotos.map((f) => (
                <img key={f.id} src={f.url} alt="foto" style={styles.foto} />
              ))}
            </div>
          </section>
        )}

        {videos.length > 0 && (
          <section style={styles.seccion}>
            <h2 style={styles.subtitulo}>Videos</h2>
            <div style={styles.galeria}>
              {videos.map((v) => (
                <video key={v.id} src={v.url} controls style={styles.foto} />
              ))}
            </div>
          </section>
        )}

        {banda.multimedia.length === 0 && (
          <p style={styles.vacio}>Esta banda aún no ha subido fotos o videos.</p>
        )}

        <section style={styles.seccion}>
          <CalendarioDisponibilidad bandaId={banda.id} modoEdicion={false} />
        </section>

        <section style={styles.seccion}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <h2 style={styles.subtitulo}>Reseñas</h2>
            {resenasData.promedioEstrellas !== null && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <SelectorEstrellas valor={Math.round(resenasData.promedioEstrellas)} soloLectura />
                <span style={{ fontSize: '0.9rem', color: 'var(--color-texto-secundario)' }}>
                  {resenasData.promedioEstrellas.toFixed(1)} ({resenasData.total} {resenasData.total === 1 ? 'reseña' : 'reseñas'})
                </span>
              </div>
            )}
          </div>
          {resenasData.resenas.length === 0 ? (
            <p style={styles.vacio}>Esta banda aún no tiene reseñas.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--espaciado-sm)' }}>
              {resenasData.resenas.map((r) => <TarjetaResena key={r.id} resena={r} />)}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function Dato({ label, valor }) {
  return (
    <div style={datoStyles.contenedor}>
      <span style={datoStyles.label}>{label}</span>
      <span style={datoStyles.valor}>{valor}</span>
    </div>
  );
}

const datoStyles = {
  contenedor: { display: 'flex', flexDirection: 'column', gap: 2 },
  label: { fontSize: '0.75rem', color: 'var(--color-texto-secundario)', textTransform: 'uppercase', letterSpacing: '0.05em' },
  valor: { fontSize: '1rem', color: 'var(--color-texto)', fontWeight: 500 },
};

const styles = {
  pagina: { minHeight: '100vh', backgroundColor: 'var(--color-fondo)', padding: 'var(--espaciado-lg)' },
  contenedor: {
    maxWidth: '800px', margin: '0 auto', backgroundColor: '#fff',
    borderRadius: 'var(--radio-borde)', padding: 'var(--espaciado-xl)',
    boxShadow: '0 2px 16px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', gap: 'var(--espaciado-lg)',
  },
  encabezado: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  nombre: { margin: 0, fontFamily: 'var(--fuente-encabezado)', color: 'var(--color-primario)', fontSize: '1.75rem' },
  estado: { padding: '4px 12px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 600 },
  borrador: { backgroundColor: '#fef3c7', color: '#92400e' },
  publicado: { backgroundColor: '#d1fae5', color: '#065f46' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--espaciado-md)' },
  seccion: { display: 'flex', flexDirection: 'column', gap: 'var(--espaciado-sm)' },
  subtitulo: { margin: 0, fontFamily: 'var(--fuente-encabezado)', color: 'var(--color-texto)', fontSize: '1.1rem' },
  galeria: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 'var(--espaciado-sm)' },
  foto: { width: '100%', height: '150px', objectFit: 'cover', borderRadius: 'var(--radio-borde)' },
  vacio: { color: 'var(--color-texto-secundario)', fontSize: '0.9rem', margin: 0 },
  errorMsg: { backgroundColor: '#fde8e8', color: '#c0392b', padding: 'var(--espaciado-md)', borderRadius: 'var(--radio-borde)' },
  btnSolicitar: { padding: '6px 16px', backgroundColor: 'var(--color-secundario)', color: '#fff', borderRadius: 'var(--radio-borde)', textDecoration: 'none', fontFamily: 'var(--fuente-encabezado)', fontWeight: 600, fontSize: '0.9rem' },
};
