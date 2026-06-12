import { useState, useEffect } from 'react';
import {
  obtenerDisponibilidad,
  crearFranja,
  actualizarFranja,
  eliminarFranja,
} from '../../services/disponibilidadService';

const formInicial = { fecha: '', fechaInicio: '', fechaFin: '', franjaInicio: '', franjaFin: '', estado: 'disponible' };

const formatearFecha = (fechaISO) => {
  const d = new Date(fechaISO);
  return d.toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
};

const agruparPorFecha = (franjas) => {
  return franjas.reduce((acc, f) => {
    const clave = f.fecha.split('T')[0];
    if (!acc[clave]) acc[clave] = [];
    acc[clave].push(f);
    return acc;
  }, {});
};

export default function CalendarioDisponibilidad({ bandaId, modoEdicion, token }) {
  const [franjas, setFranjas] = useState([]);
  const [form, setForm] = useState(formInicial);
  const [esRango, setEsRango] = useState(false);
  const [error, setError] = useState(null);
  const [avisoOmitidas, setAvisoOmitidas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);

  const cargar = async () => {
    try {
      const res = await obtenerDisponibilidad(bandaId);
      setFranjas(res.data);
    } catch {
      setError('No se pudo cargar la disponibilidad.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargar(); }, [bandaId]);

  const handleCrear = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setError(null);
    setAvisoOmitidas([]);
    try {
      const datos = esRango
        ? { fechaInicio: form.fechaInicio, fechaFin: form.fechaFin, franjaInicio: form.franjaInicio, franjaFin: form.franjaFin, estado: form.estado }
        : { fecha: form.fecha, franjaInicio: form.franjaInicio, franjaFin: form.franjaFin, estado: form.estado };
      const res = await crearFranja(bandaId, datos, token);
      if (res.data.omitidas?.length > 0) setAvisoOmitidas(res.data.omitidas);
      setForm(formInicial);
      await cargar();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear la franja.');
      if (err.response?.data?.omitidas?.length > 0) setAvisoOmitidas(err.response.data.omitidas);
    } finally {
      setEnviando(false);
    }
  };

  const toggleEstado = async (franja) => {
    const nuevoEstado = franja.estado === 'disponible' ? 'ocupado' : 'disponible';
    try {
      await actualizarFranja(bandaId, franja.id, { estado: nuevoEstado }, token);
      await cargar();
    } catch {
      setError('Error al actualizar la franja.');
    }
  };

  const handleEliminar = async (franjaId) => {
    if (!confirm('¿Eliminar esta franja?')) return;
    try {
      await eliminarFranja(bandaId, franjaId, token);
      await cargar();
    } catch {
      setError('Error al eliminar la franja.');
    }
  };

  const grupos = agruparPorFecha(franjas);
  const fechasOrdenadas = Object.keys(grupos).sort();

  return (
    <div style={styles.contenedor}>
      <h3 style={styles.titulo}>Disponibilidad</h3>

      {error && <p style={styles.errorMsg}>{error}</p>}
      {avisoOmitidas.length > 0 && (
        <p style={styles.avisoMsg}>
          Se omitieron {avisoOmitidas.length} día(s) por conflicto de horario: {avisoOmitidas.join(', ')}.
        </p>
      )}

      {modoEdicion && (
        <form onSubmit={handleCrear} style={styles.formNueva}>
          <label style={styles.checkboxLabel}>
            <input type="checkbox" checked={esRango} onChange={(e) => { setEsRango(e.target.checked); setForm(formInicial); }} style={{ marginRight: 6 }} />
            Aplicar a un rango de fechas
          </label>

          <div style={styles.formFila}>
            {esRango ? (
              <>
                <div style={styles.campo}>
                  <label style={styles.label}>Fecha inicio</label>
                  <input type="date" required value={form.fechaInicio}
                    onChange={(e) => setForm({ ...form, fechaInicio: e.target.value })} style={styles.input} />
                </div>
                <div style={styles.campo}>
                  <label style={styles.label}>Fecha fin</label>
                  <input type="date" required value={form.fechaFin}
                    onChange={(e) => setForm({ ...form, fechaFin: e.target.value })} style={styles.input} />
                </div>
              </>
            ) : (
              <div style={styles.campo}>
                <label style={styles.label}>Fecha</label>
                <input type="date" required value={form.fecha}
                  onChange={(e) => setForm({ ...form, fecha: e.target.value })} style={styles.input} />
              </div>
            )}
            <div style={styles.campo}>
              <label style={styles.label}>Inicio</label>
              <input type="time" required value={form.franjaInicio}
                onChange={(e) => setForm({ ...form, franjaInicio: e.target.value })} style={styles.input} />
            </div>
            <div style={styles.campo}>
              <label style={styles.label}>Fin</label>
              <input type="time" required value={form.franjaFin}
                onChange={(e) => setForm({ ...form, franjaFin: e.target.value })} style={styles.input} />
            </div>
            <div style={styles.campo}>
              <label style={styles.label}>Estado</label>
              <select value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value })} style={styles.input}>
                <option value="disponible">Disponible</option>
                <option value="ocupado">Ocupado</option>
              </select>
            </div>
          </div>
          <button type="submit" disabled={enviando} style={styles.botonAgregar}>
            {enviando ? 'Agregando...' : '+ Agregar franja'}
          </button>
        </form>
      )}

      {cargando ? (
        <p style={styles.vacio}>Cargando...</p>
      ) : fechasOrdenadas.length === 0 ? (
        <p style={styles.vacio}>No hay franjas registradas.</p>
      ) : (
        fechasOrdenadas.map((fecha) => (
          <div key={fecha} style={styles.grupo}>
            <p style={styles.fechaLabel}>{formatearFecha(fecha)}</p>
            {grupos[fecha].map((f) => (
              <div key={f.id} style={styles.franja}>
                <div style={styles.franjaInfo}>
                  <span style={styles.horario}>{f.franjaInicio} – {f.franjaFin}</span>
                  <span style={{ ...styles.badge, ...(f.estado === 'disponible' ? styles.disponible : styles.ocupado) }}>
                    {f.estado === 'disponible' ? 'Disponible' : 'Ocupado'}
                  </span>
                </div>
                {modoEdicion && (
                  <div style={styles.franjaAcciones}>
                    <button onClick={() => toggleEstado(f)} style={styles.btnToggle}>
                      {f.estado === 'disponible' ? 'Marcar ocupado' : 'Marcar disponible'}
                    </button>
                    <button onClick={() => handleEliminar(f.id)} style={styles.btnEliminar}>Eliminar</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}

const styles = {
  contenedor: { display: 'flex', flexDirection: 'column', gap: 'var(--espaciado-md)' },
  titulo: { margin: 0, fontFamily: 'var(--fuente-encabezado)', color: 'var(--color-texto)', fontSize: '1.1rem' },
  formNueva: { display: 'flex', flexDirection: 'column', gap: 'var(--espaciado-sm)', backgroundColor: '#f9f9f9', padding: 'var(--espaciado-md)', borderRadius: 'var(--radio-borde)' },
  formFila: { display: 'flex', gap: 'var(--espaciado-sm)', flexWrap: 'wrap' },
  campo: { display: 'flex', flexDirection: 'column', gap: 2, flex: 1, minWidth: 120 },
  label: { fontSize: '0.8rem', color: 'var(--color-texto-secundario)' },
  input: { padding: '6px 10px', border: '1px solid #ddd', borderRadius: 'var(--radio-borde)', fontSize: '0.9rem', fontFamily: 'var(--fuente-cuerpo)', color: 'var(--color-texto)', outline: 'none' },
  botonAgregar: { alignSelf: 'flex-start', padding: '8px 16px', backgroundColor: 'var(--color-secundario)', color: '#fff', border: 'none', borderRadius: 'var(--radio-borde)', fontSize: '0.9rem', fontFamily: 'var(--fuente-encabezado)', fontWeight: 600, cursor: 'pointer' },
  grupo: { display: 'flex', flexDirection: 'column', gap: 'var(--espaciado-sm)' },
  fechaLabel: { margin: 0, fontWeight: 600, color: 'var(--color-texto)', fontSize: '0.95rem', textTransform: 'capitalize' },
  franja: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', border: '1px solid #eee', borderRadius: 'var(--radio-borde)', backgroundColor: '#fff', flexWrap: 'wrap', gap: 8 },
  franjaInfo: { display: 'flex', alignItems: 'center', gap: 'var(--espaciado-md)' },
  horario: { fontFamily: 'var(--fuente-cuerpo)', fontSize: '0.95rem', color: 'var(--color-texto)', fontWeight: 500 },
  badge: { padding: '3px 10px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 600 },
  disponible: { backgroundColor: '#d1fae5', color: '#065f46' },
  ocupado: { backgroundColor: '#fde8e8', color: '#c0392b' },
  franjaAcciones: { display: 'flex', gap: 8 },
  btnToggle: { padding: '4px 10px', border: '1px solid #ddd', borderRadius: 'var(--radio-borde)', fontSize: '0.8rem', cursor: 'pointer', backgroundColor: '#fff', color: 'var(--color-texto)' },
  btnEliminar: { padding: '4px 10px', border: 'none', borderRadius: 'var(--radio-borde)', fontSize: '0.8rem', cursor: 'pointer', backgroundColor: '#fde8e8', color: '#c0392b', fontWeight: 600 },
  vacio: { color: 'var(--color-texto-secundario)', fontSize: '0.9rem', margin: 0 },
  errorMsg: { backgroundColor: '#fde8e8', color: '#c0392b', padding: 'var(--espaciado-sm) var(--espaciado-md)', borderRadius: 'var(--radio-borde)', fontSize: '0.9rem', margin: 0 },
  avisoMsg: { backgroundColor: '#fef3c7', color: '#92400e', padding: 'var(--espaciado-sm) var(--espaciado-md)', borderRadius: 'var(--radio-borde)', fontSize: '0.9rem', margin: 0 },
  checkboxLabel: { display: 'flex', alignItems: 'center', fontSize: '0.9rem', color: 'var(--color-texto)', cursor: 'pointer', userSelect: 'none' },
};
