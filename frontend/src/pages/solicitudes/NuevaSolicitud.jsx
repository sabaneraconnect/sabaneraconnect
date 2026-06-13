import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { crearSolicitud } from '../../services/solicitudService';
import { DEPARTAMENTOS, MUNICIPIOS_POR_DEPARTAMENTO } from '../../constants/ubicaciones';

const TIPOS_EVENTO = ['Cumpleaños', 'Boda', 'Festival', 'Corporativo', 'Quinceañera', 'Otro'];

const formInicial = {
  fecha: '', franjaInicio: '', franjaFin: '',
  departamento: '', municipio: '', tipoEvento: 'Cumpleaños',
  presupuesto: '',
};

export default function NuevaSolicitud() {
  const { bandaId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');

  const [form, setForm] = useState(formInicial);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);
  const [exito, setExito] = useState(false);

  if (!token || !usuario) {
    return (
      <div style={styles.pagina}>
        <div style={styles.contenedor}>
          <p style={styles.aviso}>
            Debes <Link to="/login" style={styles.enlaceLogin}>iniciar sesión</Link> para enviar una solicitud de contratación.
          </p>
        </div>
      </div>
    );
  }

  if (usuario.rol !== 'organizador') {
    return (
      <div style={styles.pagina}>
        <div style={styles.contenedor}>
          <p style={styles.aviso}>Solo los organizadores pueden enviar solicitudes de contratación.</p>
        </div>
      </div>
    );
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setError(null);
    try {
      const [hi, mi] = form.franjaInicio.split(':').map(Number);
      const [hf, mf] = form.franjaFin.split(':').map(Number);
      const duracionHoras = Math.round((hf * 60 + mf - (hi * 60 + mi)) / 60);
      await crearSolicitud({ ...form, bandaId: Number(bandaId), duracionHoras, presupuesto: Number(form.presupuesto) }, token);
      setExito(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al enviar la solicitud.');
    } finally {
      setEnviando(false);
    }
  };

  if (exito) {
    return (
      <div style={styles.pagina}>
        <div style={styles.contenedor}>
          <p style={styles.exitoMsg}>¡Solicitud enviada correctamente! La banda recibirá una notificación.</p>
          <button onClick={() => navigate('/solicitudes/enviadas')} style={styles.boton}>Ver mis solicitudes</button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.pagina}>
      <Helmet>
        <title>Solicitar contratación — SabaneraConnect</title>
        <meta name="description" content="Envía una solicitud de contratación a esta banda para tu evento." />
      </Helmet>
      <div style={styles.contenedor}>
        <h1 style={styles.titulo}>Solicitar contratación</h1>
        {error && <p style={styles.errorMsg}>{error}</p>}
        <form onSubmit={handleSubmit} style={styles.formulario}>
          <Campo label="Fecha del evento">
            <input type="date" name="fecha" required value={form.fecha} onChange={handleChange} style={styles.input} />
          </Campo>
          <div style={styles.fila}>
            <Campo label="Hora inicio">
              <input type="time" name="franjaInicio" required value={form.franjaInicio} onChange={handleChange} style={styles.input} />
            </Campo>
            <Campo label="Hora fin">
              <input type="time" name="franjaFin" required value={form.franjaFin} onChange={handleChange} style={styles.input} />
            </Campo>
          </div>
          <Campo label="Departamento">
            <select name="departamento" required value={form.departamento} onChange={(e) => setForm({ ...form, departamento: e.target.value, municipio: '' })} style={styles.input}>
              <option value="">— Selecciona —</option>
              {DEPARTAMENTOS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </Campo>
          <Campo label="Municipio">
            <select name="municipio" required value={form.municipio} onChange={handleChange} style={styles.input} disabled={!form.departamento}>
              <option value="">— Selecciona —</option>
              {(MUNICIPIOS_POR_DEPARTAMENTO[form.departamento] || []).map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </Campo>
          <Campo label="Tipo de evento">
            <select name="tipoEvento" value={form.tipoEvento} onChange={handleChange} style={styles.input}>
              {TIPOS_EVENTO.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </Campo>
          {form.franjaInicio && form.franjaFin && (() => {
            const [hi, mi] = form.franjaInicio.split(':').map(Number);
            const [hf, mf] = form.franjaFin.split(':').map(Number);
            const mins = hf * 60 + mf - (hi * 60 + mi);
            if (mins <= 0) return null;
            const h = Math.floor(mins / 60), m = mins % 60;
            return <p style={styles.duracionCalc}>Duración: <strong>{h > 0 ? `${h}h` : ''}{m > 0 ? ` ${m}min` : ''}</strong></p>;
          })()}
          <div style={styles.fila}>
            <Campo label="Presupuesto estimado (COP)">
              <input type="number" name="presupuesto" min="0" required placeholder="Ej: 1500000" value={form.presupuesto} onChange={handleChange} style={styles.input} />
            </Campo>
          </div>
          <button type="submit" disabled={enviando} style={styles.boton}>
            {enviando ? 'Enviando...' : 'Enviar solicitud'}
          </button>
        </form>
      </div>
    </div>
  );
}

function Campo({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
      <label style={{ fontSize: '0.875rem', color: 'var(--color-texto-secundario)' }}>{label}</label>
      {children}
    </div>
  );
}

const styles = {
  pagina: { minHeight: '100vh', backgroundColor: 'var(--color-fondo)', padding: 'var(--espaciado-lg)' },
  contenedor: { maxWidth: '600px', margin: '0 auto', backgroundColor: '#fff', borderRadius: 'var(--radio-borde)', padding: 'var(--espaciado-xl)', boxShadow: '0 2px 16px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', gap: 'var(--espaciado-md)' },
  titulo: { margin: 0, fontFamily: 'var(--fuente-encabezado)', color: 'var(--color-primario)', fontSize: '1.5rem' },
  formulario: { display: 'flex', flexDirection: 'column', gap: 'var(--espaciado-md)' },
  fila: { display: 'flex', gap: 'var(--espaciado-md)', flexWrap: 'wrap' },
  input: { padding: 'var(--espaciado-sm) var(--espaciado-md)', border: '1px solid #ddd', borderRadius: 'var(--radio-borde)', fontSize: '1rem', fontFamily: 'var(--fuente-cuerpo)', color: 'var(--color-texto)', outline: 'none', width: '100%', boxSizing: 'border-box' },
  boton: { alignSelf: 'flex-start', padding: 'var(--espaciado-sm) var(--espaciado-xl)', backgroundColor: 'var(--color-primario)', color: '#fff', border: 'none', borderRadius: 'var(--radio-borde)', fontSize: '1rem', fontFamily: 'var(--fuente-encabezado)', fontWeight: 600, cursor: 'pointer' },
  errorMsg: { backgroundColor: '#fde8e8', color: '#c0392b', padding: 'var(--espaciado-sm) var(--espaciado-md)', borderRadius: 'var(--radio-borde)', fontSize: '0.9rem', margin: 0 },
  exitoMsg: { backgroundColor: '#e6f9f0', color: '#1a7a4a', padding: 'var(--espaciado-md)', borderRadius: 'var(--radio-borde)', fontSize: '0.95rem', margin: 0 },
  aviso: { fontSize: '1rem', color: 'var(--color-texto)' },
  duracionCalc: { margin: 0, fontSize: '0.875rem', color: 'var(--color-texto-secundario)', padding: '6px 10px', backgroundColor: '#f0f9ff', borderRadius: 'var(--radio-borde)', border: '1px solid #bae6fd' },
  enlaceLogin: { color: 'var(--color-primario)', fontWeight: 600 },
};
