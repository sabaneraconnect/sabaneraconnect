import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { registrarOrganizador } from '../../services/authService';

const camposIniciales = {
  nombre: '',
  correo: '',
  contrasena: '',
  telefono: '',
};

export default function RegistroOrganizador() {
  const [form, setForm] = useState(camposIniciales);
  const [mensaje, setMensaje] = useState(null);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setMensaje(null);
    setError(null);

    try {
      const res = await registrarOrganizador(form);
      setMensaje(`¡Registro exitoso! Bienvenido, ${res.data.usuario.nombre}.`);
      setForm(camposIniciales);
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Ocurrió un error. Intenta de nuevo.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={styles.pagina}>
      <Helmet>
        <title>Regístrate como organizador de eventos — SabaneraConnect</title>
        <meta name="description" content="Crea tu cuenta y empieza a contratar bandas musicales para tus eventos." />
      </Helmet>
      <form onSubmit={handleSubmit} style={styles.formulario}>
        <h2 style={styles.titulo}>Registro de Organizador</h2>

        {mensaje && <p style={styles.exito}>{mensaje}</p>}
        {error && <p style={styles.errorMsg}>{error}</p>}

        {[
          { name: 'nombre', label: 'Nombre completo', type: 'text', required: true },
          { name: 'correo', label: 'Correo electrónico', type: 'email', required: true },
          { name: 'contrasena', label: 'Contraseña', type: 'password', required: true },
          { name: 'telefono', label: 'Teléfono', type: 'text', required: true },
        ].map(({ name, label, type, required }) => (
          <div key={name} style={styles.campo}>
            <label htmlFor={name} style={styles.label}>{label}</label>
            <input
              id={name}
              name={name}
              type={type}
              required={required}
              value={form[name]}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
        ))}

        <button type="submit" disabled={cargando} style={styles.boton}>
          {cargando ? 'Registrando...' : 'Registrar organizador'}
        </button>
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
    maxWidth: '460px',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--espaciado-md)',
  },
  titulo: {
    margin: 0,
    fontFamily: 'var(--fuente-encabezado)',
    color: 'var(--color-secundario)',
    textAlign: 'center',
  },
  campo: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--espaciado-sm)',
  },
  label: {
    fontSize: '0.875rem',
    color: 'var(--color-texto-secundario)',
    fontFamily: 'var(--fuente-cuerpo)',
  },
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
    backgroundColor: 'var(--color-secundario)',
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
  errorMsg: {
    backgroundColor: '#fde8e8',
    color: '#c0392b',
    padding: 'var(--espaciado-sm) var(--espaciado-md)',
    borderRadius: 'var(--radio-borde)',
    fontSize: '0.9rem',
    margin: 0,
  },
};
