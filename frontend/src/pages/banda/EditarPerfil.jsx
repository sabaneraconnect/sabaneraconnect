import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { obtenerPerfil, actualizarPerfil, publicarPerfil } from '../../services/bandaService';
import GaleriaMultimedia from '../../components/banda/GaleriaMultimedia';

export default function EditarPerfil() {
  const { id } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');

  const [form, setForm] = useState({
    integrantes: '', generos: '', municipiosCobertura: '',
    aniosExperiencia: 0, municipio: '', nit: '',
  });
  const [multimedia, setMultimedia] = useState([]);
  const [estadoPerfil, setEstadoPerfil] = useState('borrador');
  const [mensaje, setMensaje] = useState(null);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const cargarPerfil = async () => {
    try {
      const res = await obtenerPerfil(id);
      const b = res.data;
      setForm({
        integrantes: b.integrantes || '',
        generos: b.generos || '',
        municipiosCobertura: b.municipiosCobertura || '',
        aniosExperiencia: b.aniosExperiencia || 0,
        municipio: b.municipio || '',
        nit: b.nit || '',
      });
      setMultimedia(b.multimedia || []);
      setEstadoPerfil(b.estadoPerfil);
    } catch {
      setError('No se pudo cargar el perfil.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (!token || !usuario) { navigate('/login'); return; }
    cargarPerfil();
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleGuardar = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setMensaje(null);
    setError(null);
    try {
      await actualizarPerfil(id, form, token);
      setMensaje('Cambios guardados correctamente.');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar.');
    } finally {
      setGuardando(false);
    }
  };

  const handlePublicar = async () => {
    if (!confirm('¿Publicar el perfil? Será visible para todos los organizadores.')) return;
    setError(null);
    try {
      await publicarPerfil(id, token);
      setEstadoPerfil('publicado');
      setMensaje('¡Perfil publicado correctamente!');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al publicar.');
    }
  };

  const puedePublicar = form.integrantes.trim() && form.generos.trim() && form.municipio.trim();

  if (cargando) return <div style={styles.pagina}><p>Cargando...</p></div>;

  return (
    <div style={styles.pagina}>
      <div style={styles.contenedor}>
        <div style={styles.encabezado}>
          <h2 style={styles.titulo}>Editar perfil de banda</h2>
          <span style={{ ...styles.estado, ...(estadoPerfil === 'publicado' ? styles.publicado : styles.borrador) }}>
            {estadoPerfil === 'publicado' ? 'Publicado' : 'Borrador'}
          </span>
        </div>

        {mensaje && <p style={styles.exito}>{mensaje}</p>}
        {error && <p style={styles.errorMsg}>{error}</p>}

        <form onSubmit={handleGuardar} style={styles.formulario}>
          {[
            { name: 'municipio', label: 'Municipio base', placeholder: 'Ej: Bogotá' },
            { name: 'integrantes', label: 'Integrantes', placeholder: 'Ej: Juan (guitarra), Ana (voz)' },
            { name: 'generos', label: 'Géneros musicales', placeholder: 'Ej: Vallenato, Cumbia, Salsa' },
            { name: 'municipiosCobertura', label: 'Municipios de cobertura', placeholder: 'Ej: Bogotá, Medellín, Cali' },
            { name: 'nit', label: 'NIT (opcional)', placeholder: '' },
          ].map(({ name, label, placeholder }) => (
            <div key={name} style={styles.campo}>
              <label style={styles.label}>{label}</label>
              <input
                name={name} value={form[name]} onChange={handleChange}
                placeholder={placeholder} style={styles.input}
              />
            </div>
          ))}

          <div style={styles.campo}>
            <label style={styles.label}>Años de experiencia</label>
            <input
              name="aniosExperiencia" type="number" min="0" max="100"
              value={form.aniosExperiencia} onChange={handleChange} style={styles.input}
            />
          </div>

          <div style={styles.acciones}>
            <button type="submit" disabled={guardando} style={styles.botonGuardar}>
              {guardando ? 'Guardando...' : 'Guardar cambios'}
            </button>
            {estadoPerfil !== 'publicado' && (
              <button
                type="button"
                onClick={handlePublicar}
                disabled={!puedePublicar}
                style={{ ...styles.botonPublicar, opacity: puedePublicar ? 1 : 0.5, cursor: puedePublicar ? 'pointer' : 'not-allowed' }}
              >
                Publicar perfil
              </button>
            )}
          </div>
        </form>

        <hr style={styles.separador} />

        <GaleriaMultimedia
          bandaId={id}
          multimedia={multimedia}
          token={token}
          onCambio={cargarPerfil}
        />
      </div>
    </div>
  );
}

const styles = {
  pagina: { minHeight: '100vh', backgroundColor: 'var(--color-fondo)', padding: 'var(--espaciado-lg)' },
  contenedor: {
    maxWidth: '700px', margin: '0 auto', backgroundColor: '#fff',
    borderRadius: 'var(--radio-borde)', padding: 'var(--espaciado-xl)',
    boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
  },
  encabezado: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--espaciado-md)' },
  titulo: { margin: 0, fontFamily: 'var(--fuente-encabezado)', color: 'var(--color-primario)' },
  estado: { padding: '4px 12px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 600 },
  borrador: { backgroundColor: '#fef3c7', color: '#92400e' },
  publicado: { backgroundColor: '#d1fae5', color: '#065f46' },
  formulario: { display: 'flex', flexDirection: 'column', gap: 'var(--espaciado-md)' },
  campo: { display: 'flex', flexDirection: 'column', gap: '4px' },
  label: { fontSize: '0.875rem', color: 'var(--color-texto-secundario)' },
  input: {
    padding: 'var(--espaciado-sm) var(--espaciado-md)',
    border: '1px solid #ddd', borderRadius: 'var(--radio-borde)',
    fontSize: '1rem', fontFamily: 'var(--fuente-cuerpo)', color: 'var(--color-texto)', outline: 'none',
  },
  acciones: { display: 'flex', gap: 'var(--espaciado-md)', flexWrap: 'wrap' },
  botonGuardar: {
    padding: 'var(--espaciado-sm) var(--espaciado-lg)',
    backgroundColor: 'var(--color-primario)', color: '#fff',
    border: 'none', borderRadius: 'var(--radio-borde)',
    fontSize: '1rem', fontFamily: 'var(--fuente-encabezado)', fontWeight: 600, cursor: 'pointer',
  },
  botonPublicar: {
    padding: 'var(--espaciado-sm) var(--espaciado-lg)',
    backgroundColor: 'var(--color-secundario)', color: '#fff',
    border: 'none', borderRadius: 'var(--radio-borde)',
    fontSize: '1rem', fontFamily: 'var(--fuente-encabezado)', fontWeight: 600,
  },
  separador: { border: 'none', borderTop: '1px solid #eee', margin: 'var(--espaciado-lg) 0' },
  exito: { backgroundColor: '#e6f9f0', color: '#1a7a4a', padding: 'var(--espaciado-sm) var(--espaciado-md)', borderRadius: 'var(--radio-borde)', fontSize: '0.9rem', margin: 0 },
  errorMsg: { backgroundColor: '#fde8e8', color: '#c0392b', padding: 'var(--espaciado-sm) var(--espaciado-md)', borderRadius: 'var(--radio-borde)', fontSize: '0.9rem', margin: 0 },
};
