import { useState } from 'react';
import { recuperarContrasena } from '../../services/authService';

export default function RecuperarContrasena() {
  const [correo, setCorreo] = useState('');
  const [mensaje, setMensaje] = useState(null);
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setMensaje(null);

    try {
      const res = await recuperarContrasena(correo);
      setMensaje(res.data.mensaje);
    } catch {
      setMensaje('Si ese correo está registrado, recibirás un enlace de recuperación.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={styles.pagina}>
      <form onSubmit={handleSubmit} style={styles.formulario}>
        <h2 style={styles.titulo}>Recuperar contraseña</h2>
        <p style={styles.descripcion}>Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.</p>

        {mensaje && <p style={styles.exito}>{mensaje}</p>}

        {!mensaje && (
          <>
            <div style={styles.campo}>
              <label htmlFor="correo" style={styles.label}>Correo electrónico</label>
              <input
                id="correo" type="email" required
                value={correo} onChange={(e) => setCorreo(e.target.value)} style={styles.input}
              />
            </div>
            <button type="submit" disabled={cargando} style={styles.boton}>
              {cargando ? 'Enviando...' : 'Enviar enlace'}
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
  descripcion: { margin: 0, fontSize: '0.9rem', color: 'var(--color-texto-secundario)', textAlign: 'center' },
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
  exito: {
    backgroundColor: '#e6f9f0',
    color: '#1a7a4a',
    padding: 'var(--espaciado-sm) var(--espaciado-md)',
    borderRadius: 'var(--radio-borde)',
    fontSize: '0.9rem',
    margin: 0,
  },
};
