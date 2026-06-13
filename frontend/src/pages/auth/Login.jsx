import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../services/authService';

export default function Login() {
  const [form, setForm] = useState({ correo: '', contrasena: '' });
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError(null);

    try {
      const res = await login(form.correo, form.contrasena);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('usuario', JSON.stringify(res.data.usuario));
      window.dispatchEvent(new Event('authChange'));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Ocurrió un error. Intenta de nuevo.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={styles.pagina}>
      <Helmet>
        <title>Iniciar sesión — SabaneraConnect</title>
        <meta name="description" content="Accede a tu cuenta de SabaneraConnect." />
      </Helmet>
      <form onSubmit={handleSubmit} style={styles.formulario}>
        <h2 style={styles.titulo}>Iniciar sesión</h2>

        {error && <p style={styles.errorMsg}>{error}</p>}

        <div style={styles.campo}>
          <label htmlFor="correo" style={styles.label}>Correo electrónico</label>
          <input
            id="correo" name="correo" type="email" required
            value={form.correo} onChange={handleChange} style={styles.input}
          />
        </div>

        <div style={styles.campo}>
          <label htmlFor="contrasena" style={styles.label}>Contraseña</label>
          <input
            id="contrasena" name="contrasena" type="password" required
            value={form.contrasena} onChange={handleChange} style={styles.input}
          />
        </div>

        <button type="submit" disabled={cargando} style={styles.boton}>
          {cargando ? 'Ingresando...' : 'Ingresar'}
        </button>

        <Link to="/recuperar-contrasena" style={styles.link}>
          ¿Olvidaste tu contraseña?
        </Link>
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
    marginTop: 'var(--espaciado-sm)',
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
  link: {
    textAlign: 'center',
    color: 'var(--color-secundario)',
    fontSize: '0.875rem',
    textDecoration: 'none',
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
