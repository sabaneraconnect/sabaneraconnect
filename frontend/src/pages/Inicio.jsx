import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import useAuth from '../hooks/useAuth';
import { obtenerMiBanda } from '../services/bandaService';
import heroImg from '../assets/hero-sabaneraconnect.png';

function AccesosRapidosBanda() {
  const [bandaId, setBandaId] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) return;
    obtenerMiBanda(token).then((r) => setBandaId(r.data.bandaId)).catch(() => {});
  }, [token]);

  if (!bandaId) return null;
  return (
    <>
      <Link to={`/banda/${bandaId}`} style={{ ...styles.boton, ...styles.botonPrimario }}>
        Ver mi perfil
      </Link>
      <Link to={`/banda/${bandaId}/editar`} style={{ ...styles.boton, ...styles.botonOutline }}>
        Editar perfil
      </Link>
      <Link to="/solicitudes/recibidas" style={{ ...styles.boton, ...styles.botonOutline }}>
        Solicitudes recibidas
      </Link>
    </>
  );
}

export default function Inicio() {
  const { estaAutenticado, rol, usuario } = useAuth();

  return (
    <>
    <Helmet>
      <title>SabaneraConnect — Contrata bandas culturales del Caribe colombiano</title>
      <meta name="description" content="Conecta con bandas de vallenato, cumbia, porro y más para tu próximo evento en la región Caribe de Colombia." />
    </Helmet>
    <style>{`
      .inicio-pagina { background-position: right center !important; }
      @media (max-width: 768px) {
        .inicio-pagina {
          background-position: center !important;
          justify-content: center !important;
        }
        .inicio-hero {
          align-items: center !important;
          text-align: center !important;
          max-width: 100% !important;
          background: rgba(255,255,255,0.82);
          border-radius: 12px;
        }
      }
    `}</style>
    <div className="inicio-pagina" style={{ ...styles.pagina, backgroundImage: `url(${heroImg})` }}>
      <div className="inicio-hero" style={styles.hero}>
        <h1 style={styles.titulo}>SabaneraConnect</h1>
        <p style={styles.subtitulo}>
          Conectamos organizadores de eventos con bandas culturales del Caribe colombiano.
        </p>

        {!estaAutenticado ? (
          <div style={styles.botones}>
            <Link to="/bandas/buscar" style={{ ...styles.boton, ...styles.botonPrimario }}>
              Buscar bandas
            </Link>
            <Link to="/registro/banda" style={{ ...styles.boton, ...styles.botonOutline }}>
              Registra tu banda
            </Link>
          </div>
        ) : (
          <div style={styles.bienvenida}>
            <p style={styles.saludo}>Bienvenido de nuevo, <strong>{usuario.nombre}</strong>.</p>
            <div style={styles.botones}>
              {rol === 'organizador' ? (
                <>
                  <Link to="/bandas/buscar" style={{ ...styles.boton, ...styles.botonPrimario }}>
                    Buscar bandas
                  </Link>
                  <Link to="/solicitudes/enviadas" style={{ ...styles.boton, ...styles.botonOutline }}>
                    Mis solicitudes
                  </Link>
                </>
              ) : (
                <AccesosRapidosBanda />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}

const styles = {
  pagina: {
    minHeight: '80vh',
    backgroundSize: 'cover',
    backgroundPosition: 'right center',
    backgroundRepeat: 'no-repeat',
    backgroundColor: 'var(--color-fondo)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 'var(--espaciado-xl)',
  },
  hero: {
    maxWidth: '500px',
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 'var(--espaciado-lg)',
    // fallback semi-transparente por si la imagen no carga en móvil
    padding: 'var(--espaciado-lg)',
  },
  titulo: {
    margin: 0,
    fontFamily: 'var(--fuente-encabezado)',
    color: 'var(--color-primario)',
    fontSize: 'clamp(2rem, 5vw, 3.5rem)',
    lineHeight: 1.1,
  },
  subtitulo: {
    margin: 0,
    fontSize: 'clamp(1rem, 2vw, 1.25rem)',
    color: 'var(--color-texto-secundario)',
    lineHeight: 1.6,
  },
  botones: {
    display: 'flex',
    gap: 'var(--espaciado-md)',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  boton: {
    padding: 'var(--espaciado-md) var(--espaciado-xl)',
    borderRadius: 'var(--radio-borde)',
    fontFamily: 'var(--fuente-encabezado)',
    fontWeight: 700,
    fontSize: '1rem',
    textDecoration: 'none',
  },
  botonPrimario: {
    backgroundColor: 'var(--color-primario)',
    color: '#fff',
    border: '2px solid var(--color-primario)',
  },
  botonOutline: {
    backgroundColor: 'transparent',
    color: 'var(--color-secundario)',
    border: '2px solid var(--color-secundario)',
  },
  bienvenida: { display: 'flex', flexDirection: 'column', gap: 'var(--espaciado-md)', alignItems: 'center' },
  saludo: { margin: 0, fontSize: '1.1rem', color: 'var(--color-texto)' },
};
