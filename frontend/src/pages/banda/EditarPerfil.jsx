import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { obtenerPerfil, actualizarPerfil, publicarPerfil } from '../../services/bandaService';
import GaleriaMultimedia from '../../components/banda/GaleriaMultimedia';
import SelectorUbicacion from '../../components/common/SelectorUbicacion';
import { GENEROS_MUSICALES, DEPARTAMENTOS } from '../../constants/ubicaciones';

const GENEROS_BASE = GENEROS_MUSICALES.filter((g) => g !== 'Otro');

function parsearGeneros(generosStr) {
  if (!generosStr) return { seleccionados: [], otro: '' };
  const lista = generosStr.split(',').map((g) => g.trim()).filter(Boolean);
  const seleccionados = lista.filter((g) => GENEROS_BASE.includes(g));
  const otros = lista.filter((g) => !GENEROS_BASE.includes(g));
  return { seleccionados, otro: otros.join(', ') };
}

export default function EditarPerfil() {
  const { id } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');

  const [form, setForm] = useState({
    integrantes: '', municipiosCobertura: '', aniosExperiencia: 0, municipio: '', departamento: '', nit: '',
  });
  const [generosSeleccionados, setGenerosSeleccionados] = useState([]);
  const [otroGenero, setOtroGenero] = useState('');
  const [deptosCobertura, setDeptosCobertura] = useState([]);
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
      const { seleccionados, otro } = parsearGeneros(b.generos);
      const deptosCob = b.municipiosCobertura
        ? b.municipiosCobertura.split(',').map((d) => d.trim()).filter(Boolean)
        : [];
      setDeptosCobertura(deptosCob);
      setForm({
        integrantes: b.integrantes || '',
        aniosExperiencia: b.aniosExperiencia || 0,
        municipio: b.municipio || '',
        departamento: b.departamento || '',
        nit: b.nit || '',
      });
      setGenerosSeleccionados(seleccionados);
      setOtroGenero(otro);
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

  const handleGeneroCheck = (genero) => {
    setGenerosSeleccionados((prev) =>
      prev.includes(genero) ? prev.filter((g) => g !== genero) : [...prev, genero]
    );
  };

  const construirGenerosString = () => {
    const todos = [...generosSeleccionados];
    if (otroGenero.trim()) {
      otroGenero.split(',').map((g) => g.trim()).filter(Boolean).forEach((g) => {
        if (!todos.includes(g)) todos.push(g);
      });
    }
    return todos.join(', ');
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setMensaje(null);
    setError(null);
    try {
      await actualizarPerfil(id, { ...form, generos: construirGenerosString(), municipiosCobertura: deptosCobertura.join(', ') }, token);
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

  const puedePublicar = form.integrantes.trim() && generosSeleccionados.length > 0 && form.municipio.trim();

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
          {/* Ubicación con selector en cascada */}
          <SelectorUbicacion
            departamento={form.departamento}
            municipio={form.municipio}
            onDepartamentoChange={(v) => setForm((f) => ({ ...f, departamento: v, municipio: '' }))}
            onMunicipioChange={(v) => setForm((f) => ({ ...f, municipio: v }))}
          />

          {[
            { name: 'integrantes', label: 'Integrantes', placeholder: 'Ej: Juan (guitarra), Ana (voz)' },
            { name: 'nit', label: 'NIT (opcional)', placeholder: '' },
          ].map(({ name, label, placeholder }) => (
            <div key={name} style={styles.campo}>
              <label style={styles.label}>{label}</label>
              <input name={name} value={form[name]} onChange={handleChange} placeholder={placeholder} style={styles.input} />
            </div>
          ))}

          {/* Checkboxes departamentos de cobertura */}
          <div style={styles.campo}>
            <label style={styles.label}>Departamentos de cobertura</label>
            <div style={styles.checkboxGrid}>
              {DEPARTAMENTOS.map((d) => (
                <label key={d} style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={deptosCobertura.includes(d)}
                    onChange={() => setDeptosCobertura((prev) =>
                      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
                    )}
                    style={{ marginRight: 6 }}
                  />
                  {d}
                </label>
              ))}
            </div>
          </div>

          <div style={styles.campo}>
            <label style={styles.label}>Años de experiencia</label>
            <input name="aniosExperiencia" type="number" min="0" max="100" value={form.aniosExperiencia} onChange={handleChange} style={styles.input} />
          </div>

          {/* Checkboxes géneros */}
          <div style={styles.campo}>
            <label style={styles.label}>Géneros musicales</label>
            <div style={styles.checkboxGrid}>
              {GENEROS_BASE.map((g) => (
                <label key={g} style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={generosSeleccionados.includes(g)}
                    onChange={() => handleGeneroCheck(g)}
                    style={{ marginRight: 6 }}
                  />
                  {g}
                </label>
              ))}
            </div>
            {generosSeleccionados.includes('Otro') || (
              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={otroGenero.length > 0}
                  onChange={() => otroGenero ? setOtroGenero('') : setOtroGenero(' ')}
                  style={{ marginRight: 6 }}
                />
                Otro
              </label>
            )}
            {otroGenero !== undefined && (
              <div style={{ marginTop: 4 }}>
                <label style={styles.label}>Otros géneros (separados por coma)</label>
                <input
                  type="text"
                  value={otroGenero}
                  onChange={(e) => setOtroGenero(e.target.value)}
                  placeholder="Ej: Reggaeton, Rock"
                  style={styles.input}
                />
              </div>
            )}
          </div>

          <div style={styles.acciones}>
            <button type="submit" disabled={guardando} style={styles.botonGuardar}>
              {guardando ? 'Guardando...' : 'Guardar cambios'}
            </button>
            {estadoPerfil !== 'publicado' && (
              <button
                type="button" onClick={handlePublicar} disabled={!puedePublicar}
                style={{ ...styles.botonPublicar, opacity: puedePublicar ? 1 : 0.5, cursor: puedePublicar ? 'pointer' : 'not-allowed' }}
              >
                Publicar perfil
              </button>
            )}
          </div>
        </form>

        <hr style={styles.separador} />

        <GaleriaMultimedia bandaId={id} multimedia={multimedia} token={token} onCambio={cargarPerfil} />
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
  campo: { display: 'flex', flexDirection: 'column', gap: 4 },
  label: { fontSize: '0.875rem', color: 'var(--color-texto-secundario)' },
  input: {
    padding: 'var(--espaciado-sm) var(--espaciado-md)', border: '1px solid #ddd',
    borderRadius: 'var(--radio-borde)', fontSize: '1rem', fontFamily: 'var(--fuente-cuerpo)',
    color: 'var(--color-texto)', outline: 'none',
  },
  checkboxGrid: { display: 'flex', flexWrap: 'wrap', gap: 'var(--espaciado-sm)' },
  checkboxLabel: { display: 'flex', alignItems: 'center', fontSize: '0.9rem', color: 'var(--color-texto)', cursor: 'pointer' },
  acciones: { display: 'flex', gap: 'var(--espaciado-md)', flexWrap: 'wrap' },
  botonGuardar: {
    padding: 'var(--espaciado-sm) var(--espaciado-lg)', backgroundColor: 'var(--color-primario)', color: '#fff',
    border: 'none', borderRadius: 'var(--radio-borde)', fontSize: '1rem',
    fontFamily: 'var(--fuente-encabezado)', fontWeight: 600, cursor: 'pointer',
  },
  botonPublicar: {
    padding: 'var(--espaciado-sm) var(--espaciado-lg)', backgroundColor: 'var(--color-secundario)', color: '#fff',
    border: 'none', borderRadius: 'var(--radio-borde)', fontSize: '1rem',
    fontFamily: 'var(--fuente-encabezado)', fontWeight: 600,
  },
  separador: { border: 'none', borderTop: '1px solid #eee', margin: 'var(--espaciado-lg) 0' },
  exito: { backgroundColor: '#e6f9f0', color: '#1a7a4a', padding: 'var(--espaciado-sm) var(--espaciado-md)', borderRadius: 'var(--radio-borde)', fontSize: '0.9rem', margin: 0 },
  errorMsg: { backgroundColor: '#fde8e8', color: '#c0392b', padding: 'var(--espaciado-sm) var(--espaciado-md)', borderRadius: 'var(--radio-borde)', fontSize: '0.9rem', margin: 0 },
};
