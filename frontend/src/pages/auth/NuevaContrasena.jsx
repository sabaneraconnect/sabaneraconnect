import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { nuevaContrasena } from '../../services/authService';

export default function NuevaContrasena() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [contrasena, setContrasena] = useState('');
  const [mensaje, setMensaje] = useState(null);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError(null);

    try {
      const res = await nuevaContrasena(token, contrasena);
      setMensaje(res.data.mensaje);
    } catch (err) {
      setError(err.response?.data?.error || 'El enlace es inválido o ha expirado.');
    } finally {
      setCargando(false);
    }
  };

  if (!token) {
    return (
      <div style={styles.pagina}>
        <div style={styles.formulario}>
          <p style={styles.errorMsg}>Enlace de recuperación inválido.</p>
          <Link to="/recuperar-contrasena" style={styles.link}>Solicitar un nuevo enlace</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.pagina}>
      <form onSubmit={handleSubmit} style={styles.formulario}>
        <h2 style={styles.titulo}>Nueva contraseña</h2>

        {mensaje && (
          <>
            <p style={styles.exito}>{mensaje}</p>
            <Link to="/login" style={styles.link}>Ir al inicio de sesión</Link>
          </>
        )}

        {error && <p style={styles.errorMsg}>{error}</p>}

        {!mensaje && (
          <>
            <div style={styles.campo}>
              <label htmlFor="contrasena" style={styles.label}>Nueva contraseña</label>
              <input
                id="contrasena" type="password" required minLength={6}
                value={contrasena} onChange={(e) => setContrasena(e.target.value)} style={styles.input}
              />
            </div>
            <button type="submit" disabled={cargando} style={styles.boton}>
              {cargando ? 'Guardando...' : 'Guardar contraseña'}
            </button>
          </>
        )}
      </form>
    </div>
  );
}

const styles = {
  pagina: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--color-fondo)',
    padding: 'var(--espaciado-lg)',
  },
  formulario: {
    backgroundColor: '#fff',
    padding: 'var(--espaciado-xl)',
    borderRadius: 'var(--radio-borde)',
    boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
    width: '100%',
    maxWidth: '420px',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--espaciado-md)',
  },
  titulo: {
    margin: 0,
    fontFamily: 'var(--fuente-encabezado)',
    color: 'var(--color-primario)',
    textAlign: 'center',
  },
  campo: { display: 'flex', flexDirection: 'column', gap: 'var(--espaciado-sm)' },
  label: { fontSize: '0.875rem', color: 'var(--color-texto-secundario)', fontFamily: 'var(--fuente-cuerpo)' },
  input: {
    padding: 'var(--espaciado-sm) var(--espaciado-md)',
    border: '1px solid #ddd',
    borderRadius: 'var(--radio-borde)',
    fontSize: '1rem',
    fontFamily: 'var(--fuente-cuerpo)',
    color: 'var(--color-texto)',
    outline: 'none',
  },
  boton: {
    padding: 'var(--espaciado-md)',
    backgroundColor: 'var(--color-primario)',
    color: '#fff',
    border: 'none',
    borderRadius: 'var(--radio-borde)',
    fontSize: '1rem',
    fontFamily: 'var(--fuente-encabezado)',
    cursor: 'pointer',
    fontWeight: 600,
  },
  link: { textAlign: 'center', color: 'var(--color-secundario)', fontSize: '0.875rem', textDecoration: 'none' },
  exito: {
    backgroundColor: '#e6f9f0',
    color: '#1a7a4a',
    padding: 'var(--espaciado-sm) var(--espaciado-md)',
    borderRadius: 'var(--radio-borde)',
    fontSize: '0.9rem',
    margin: 0,
  },
  errorMsg: {
    backgroundColor: '#fde8e8',
    color: '#c0392b',
    padding: 'var(--espaciado-sm) var(--espaciado-md)',
    borderRadius: 'var(--radio-borde)',
    fontSize: '0.9rem',
    margin: 0,
  },
};
