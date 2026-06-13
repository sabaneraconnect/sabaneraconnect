import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { obtenerMiBanda } from '../../services/bandaService';

export default function Navbar() {
  const { estaAutenticado, rol, usuario, cerrarSesion } = useAuth();
  const [bandaId, setBandaId] = useState(null);
  const [dropdownAbierto, setDropdownAbierto] = useState(false);

  useEffect(() => {
    if (rol !== 'banda') { setBandaId(null); return; }
    const token = localStorage.getItem('token');
    if (!token) return;
    obtenerMiBanda(token).then((r) => setBandaId(r.data.bandaId)).catch(() => {});
  }, [rol, usuario]);

  // Cierra el dropdown al hacer click fuera
  useEffect(() => {
    if (!dropdownAbierto) return;
    const handler = () => setDropdownAbierto(false);
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [dropdownAbierto]);

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.marca}>SabaneraConnect</Link>

      <div style={styles.derecha}>
        {!estaAutenticado ? (
          <>
            <Link to="/login" style={styles.enlace}>Iniciar sesión</Link>

            <div style={styles.dropdownContenedor}>
              <button
                style={styles.botonRegistro}
                onClick={(e) => { e.stopPropagation(); setDropdownAbierto((v) => !v); }}
              >
                Registrarse ▾
              </button>
              {dropdownAbierto && (
                <div style={styles.dropdown}>
                  <Link to="/registro/banda" style={styles.dropdownItem} onClick={() => setDropdownAbierto(false)}>
                    Como banda
                  </Link>
                  <Link to="/registro/organizador" style={styles.dropdownItem} onClick={() => setDropdownAbierto(false)}>
                    Como organizador
                  </Link>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {rol === 'organizador' && (
              <>
                <Link to="/bandas/buscar" style={styles.enlace}>Buscar bandas</Link>
                <Link to="/solicitudes/enviadas" style={styles.enlace}>Mis solicitudes</Link>
              </>
            )}
            {rol === 'banda' && bandaId && (
              <>
                <Link to={`/banda/${bandaId}/editar`} style={styles.enlace}>Mi perfil</Link>
                <Link to="/solicitudes/recibidas" style={styles.enlace}>Solicitudes recibidas</Link>
              </>
            )}
            <span style={styles.nombre}>{usuario?.nombre}</span>
            <button onClick={cerrarSesion} style={styles.botonSalir}>Cerrar sesión</button>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: '60px',
    backgroundColor: '#fff',
    borderBottom: '1px solid #e5e7eb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 var(--espaciado-lg)',
    zIndex: 100,
    boxSizing: 'border-box',
  },
  marca: {
    fontFamily: 'var(--fuente-encabezado)',
    color: 'var(--color-primario)',
    fontWeight: 700,
    fontSize: '1.15rem',
    textDecoration: 'none',
  },
  derecha: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--espaciado-md)',
    flexWrap: 'nowrap',
  },
  enlace: {
    color: 'var(--color-texto)',
    textDecoration: 'none',
    fontSize: '0.95rem',
    fontFamily: 'var(--fuente-cuerpo)',
    whiteSpace: 'nowrap',
  },
  nombre: {
    fontSize: '0.9rem',
    color: 'var(--color-texto-secundario)',
    whiteSpace: 'nowrap',
  },
  botonSalir: {
    padding: '5px 12px',
    backgroundColor: 'transparent',
    border: '1px solid #ddd',
    borderRadius: 'var(--radio-borde)',
    fontSize: '0.85rem',
    cursor: 'pointer',
    color: 'var(--color-texto)',
    fontFamily: 'var(--fuente-cuerpo)',
    whiteSpace: 'nowrap',
  },
  botonRegistro: {
    padding: '5px 12px',
    backgroundColor: 'var(--color-primario)',
    color: '#fff',
    border: 'none',
    borderRadius: 'var(--radio-borde)',
    fontSize: '0.9rem',
    cursor: 'pointer',
    fontFamily: 'var(--fuente-cuerpo)',
    whiteSpace: 'nowrap',
  },
  dropdownContenedor: {
    position: 'relative',
  },
  dropdown: {
    position: 'absolute',
    top: '110%',
    right: 0,
    backgroundColor: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: 'var(--radio-borde)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    minWidth: '160px',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    zIndex: 200,
  },
  dropdownItem: {
    padding: '10px 16px',
    color: 'var(--color-texto)',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontFamily: 'var(--fuente-cuerpo)',
    borderBottom: '1px solid #f3f4f6',
  },
};
