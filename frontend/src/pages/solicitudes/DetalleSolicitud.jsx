import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { obtenerSolicitud, responderSolicitud } from '../../services/solicitudService';
import { crearResena, responderResena, obtenerResenasPorBanda } from '../../services/resenaService';
import Chat from '../../components/chat/Chat';
import SelectorEstrellas from '../../components/resenas/SelectorEstrellas';
import TarjetaResena from '../../components/resenas/TarjetaResena';

const COLORES_ESTADO = {
  pendiente:      { bg: '#fef3c7', color: '#92400e' },
  en_negociacion: { bg: '#fed7aa', color: '#9a3412' },
  confirmada:     { bg: '#d1fae5', color: '#065f46' },
  rechazada:      { bg: '#fde8e8', color: '#c0392b' },
  cancelada:      { bg: '#fde8e8', color: '#c0392b' },
};

const ETIQUETAS_ESTADO = {
  pendiente: 'Pendiente',
  en_negociacion: 'En negociación',
  confirmada: 'Confirmada',
  rechazada: 'Rechazada',
  cancelada: 'Cancelada',
};

const eventoRealizado = (sol) => {
  if (sol.estado !== 'confirmada') return false;
  const [h, m] = sol.franjaFin.split(':').map(Number);
  const dt = new Date(sol.fecha);
  dt.setUTCHours(h, m, 0, 0);
  return new Date() > dt;
};

export default function DetalleSolicitud() {
  const { id } = useParams();
  const token = localStorage.getItem('token');
  const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');

  const [solicitud, setSolicitud] = useState(null);
  const [error, setError] = useState(null);
  const [accionando, setAccionando] = useState(false);
  const [mensajeAccion, setMensajeAccion] = useState(null);
  const [mostrarContraoferta, setMostrarContraoferta] = useState(false);
  const [contraForm, setContraForm] = useState({ presupuesto: '', mensaje: '' });

  // Reseña
  const [resena, setResena] = useState(null);
  const [resenaForm, setResenaForm] = useState({ calificacion: 0, comentario: '' });
  const [enviandoResena, setEnviandoResena] = useState(false);
  const [errorResena, setErrorResena] = useState(null);
  const [respuestaForm, setRespuestaForm] = useState('');
  const [enviandoRespuesta, setEnviandoRespuesta] = useState(false);

  const cargar = async () => {
    try {
      const res = await obtenerSolicitud(id, token);
      setSolicitud(res.data);
      // Cargar reseña si aplica
      if (res.data.estado === 'confirmada') {
        obtenerResenasPorBanda(res.data.banda.id)
          .then((r) => {
            const r2 = r.data.resenas.find((re) => re.solicitudId === Number(id));
            if (r2) setResena(r2);
          })
          .catch(() => {});
      }
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo cargar la solicitud.');
    }
  };

  useEffect(() => { if (token) cargar(); }, [id]);

  if (!token || !usuario) return <div style={styles.pagina}><p style={styles.aviso}>Debes iniciar sesión para ver esta solicitud.</p></div>;
  if (error) return <div style={styles.pagina}><p style={styles.errorMsg}>{error}</p></div>;
  if (!solicitud) return <div style={styles.pagina}><p>Cargando...</p></div>;

  const soyBanda = solicitud.banda.usuarioId === usuario.id;
  const soyOrganizador = solicitud.organizador.usuarioId === usuario.id;
  const puedeResponder = soyBanda && ['pendiente', 'en_negociacion'].includes(solicitud.estado);
  const realizado = eventoRealizado(solicitud);

  const ejecutarAccion = async (accion, contraOferta) => {
    setAccionando(true);
    setMensajeAccion(null);
    try {
      await responderSolicitud(id, accion, contraOferta, token);
      setMensajeAccion(accion === 'aceptar' ? '¡Solicitud confirmada!' : accion === 'rechazar' ? 'Solicitud rechazada.' : 'Contraoferta enviada.');
      await cargar();
      setMostrarContraoferta(false);
    } catch (err) {
      setMensajeAccion(err.response?.data?.error || 'Error al procesar la acción.');
    } finally {
      setAccionando(false);
    }
  };

  const handleEnviarResena = async () => {
    if (!resenaForm.calificacion) return setErrorResena('Selecciona una calificación.');
    setEnviandoResena(true);
    setErrorResena(null);
    try {
      await crearResena(id, resenaForm.calificacion, resenaForm.comentario, token);
      await cargar();
    } catch (err) {
      setErrorResena(err.response?.data?.error || 'Error al enviar la reseña.');
    } finally {
      setEnviandoResena(false);
    }
  };

  const handleResponderResena = async () => {
    if (!respuestaForm.trim()) return;
    setEnviandoRespuesta(true);
    try {
      await responderResena(resena.id, respuestaForm.trim(), token);
      await cargar();
    } catch (err) {
      setErrorResena(err.response?.data?.error || 'Error al responder.');
    } finally {
      setEnviandoRespuesta(false);
    }
  };

  const colorEstado = COLORES_ESTADO[solicitud.estado] || COLORES_ESTADO.pendiente;
  const fechaStr = new Date(solicitud.fecha).toLocaleDateString('es-CO', { dateStyle: 'long', timeZone: 'UTC' });
  const contraOfertaData = solicitud.contraOferta ? JSON.parse(solicitud.contraOferta) : null;

  return (
    <div style={styles.pagina}>
      <div style={styles.contenedor}>
        <div style={styles.encabezado}>
          <h1 style={styles.titulo}>Solicitud #{solicitud.id}</h1>
          <span style={{ ...styles.badge, backgroundColor: colorEstado.bg, color: colorEstado.color }}>
            {ETIQUETAS_ESTADO[solicitud.estado] ?? solicitud.estado}
          </span>
        </div>

        <div style={styles.grid}>
          <Dato label="Banda" valor={solicitud.banda.usuario.nombre} />
          <Dato label="Organizador" valor={solicitud.organizador.usuario.nombre} />
          <Dato label="Fecha" valor={fechaStr} />
          <Dato label="Horario" valor={`${solicitud.franjaInicio} – ${solicitud.franjaFin}`} />
          <Dato label="Municipio" valor={solicitud.municipio} />
          <Dato label="Tipo de evento" valor={solicitud.tipoEvento} />
          <Dato label="Duración" valor={`${solicitud.duracionHoras} hora${solicitud.duracionHoras !== 1 ? 's' : ''}`} />
          <Dato label="Presupuesto estimado" valor={`$${Number(solicitud.presupuesto).toLocaleString('es-CO')}`} />
        </div>

        {contraOfertaData && (
          <div style={styles.contraOfertaBox}>
            <p style={styles.contraOfertaTitulo}>Contraoferta de la banda</p>
            {contraOfertaData.presupuesto && <p style={styles.contraOfertaDato}>Presupuesto propuesto: <strong>${Number(contraOfertaData.presupuesto).toLocaleString('es-CO')}</strong></p>}
            {contraOfertaData.mensaje && <p style={styles.contraOfertaDato}>Mensaje: {contraOfertaData.mensaje}</p>}
          </div>
        )}

        {mensajeAccion && (
          <p style={mensajeAccion.includes('Error') || mensajeAccion.includes('error') ? styles.errorMsg : styles.exitoMsg}>
            {mensajeAccion}
          </p>
        )}

        {puedeResponder && (
          <div style={styles.acciones}>
            <button onClick={() => ejecutarAccion('aceptar')} disabled={accionando} style={styles.btnAceptar}>Aceptar</button>
            <button onClick={() => ejecutarAccion('rechazar')} disabled={accionando} style={styles.btnRechazar}>Rechazar</button>
            <button onClick={() => setMostrarContraoferta(!mostrarContraoferta)} style={styles.btnContra}>
              {mostrarContraoferta ? 'Cancelar contraoferta' : 'Hacer contraoferta'}
            </button>
          </div>
        )}

        {puedeResponder && mostrarContraoferta && (
          <div style={styles.contraForm}>
            <p style={styles.contraFormTitulo}>Contraoferta</p>
            <div style={styles.campo}>
              <label style={styles.label}>Presupuesto propuesto (COP)</label>
              <input type="number" min="0" value={contraForm.presupuesto} onChange={(e) => setContraForm({ ...contraForm, presupuesto: e.target.value })} style={styles.input} placeholder="Ej: 1200000" />
            </div>
            <div style={styles.campo}>
              <label style={styles.label}>Mensaje</label>
              <textarea value={contraForm.mensaje} onChange={(e) => setContraForm({ ...contraForm, mensaje: e.target.value })} style={{ ...styles.input, minHeight: 80, resize: 'vertical' }} placeholder="Condiciones o comentarios adicionales..." />
            </div>
            <button onClick={() => ejecutarAccion('contraofertar', { presupuesto: Number(contraForm.presupuesto), mensaje: contraForm.mensaje })} disabled={accionando || !contraForm.presupuesto} style={styles.btnEnviarContra}>
              {accionando ? 'Enviando...' : 'Enviar contraoferta'}
            </button>
          </div>
        )}

        {/* Botón de pagos si está confirmada */}
        {solicitud.estado === 'confirmada' && soyOrganizador && (
          <div>
            <Link to={`/solicitudes/${id}/pago`} style={styles.btnPago}>
              💳 Ir a pagos
            </Link>
          </div>
        )}

        {/* Chat */}
        <Chat solicitudId={id} estadoSolicitud={solicitud.estado} />

        {/* Sección de reseña */}
        {realizado && (
          <div style={styles.seccionResena}>
            <h3 style={styles.subtitulo}>Reseña del evento</h3>
            {resena ? (
              <>
                <TarjetaResena resena={{ ...resena, organizador: solicitud.organizador.usuario.nombre }} />
                {soyBanda && !resena.respuestaBanda && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
                    <label style={styles.label}>Tu respuesta:</label>
                    <textarea value={respuestaForm} onChange={(e) => setRespuestaForm(e.target.value)} style={{ ...styles.input, minHeight: 70, resize: 'vertical' }} placeholder="Responde públicamente a esta reseña..." />
                    {errorResena && <p style={styles.errorMsg}>{errorResena}</p>}
                    <button onClick={handleResponderResena} disabled={enviandoRespuesta || !respuestaForm.trim()} style={styles.btnEnviarContra}>
                      {enviandoRespuesta ? 'Enviando...' : 'Responder reseña'}
                    </button>
                  </div>
                )}
              </>
            ) : soyOrganizador ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--espaciado-sm)' }}>
                <div style={styles.campo}>
                  <label style={styles.label}>Calificación</label>
                  <SelectorEstrellas valor={resenaForm.calificacion} onChange={(v) => setResenaForm({ ...resenaForm, calificacion: v })} />
                </div>
                <div style={styles.campo}>
                  <label style={styles.label}>Comentario (opcional, máx 500 caracteres)</label>
                  <textarea value={resenaForm.comentario} onChange={(e) => setResenaForm({ ...resenaForm, comentario: e.target.value })} maxLength={500} style={{ ...styles.input, minHeight: 80, resize: 'vertical' }} placeholder="¿Cómo fue tu experiencia con esta banda?" />
                </div>
                {errorResena && <p style={styles.errorMsg}>{errorResena}</p>}
                <button onClick={handleEnviarResena} disabled={enviandoResena || !resenaForm.calificacion} style={styles.btnAceptar}>
                  {enviandoResena ? 'Enviando...' : 'Enviar reseña'}
                </button>
              </div>
            ) : (
              <p style={{ color: 'var(--color-texto-secundario)', fontSize: '0.9rem' }}>
                El organizador aún no ha dejado una reseña.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Dato({ label, valor }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <span style={{ fontSize: '0.75rem', color: 'var(--color-texto-secundario)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
      <span style={{ fontSize: '1rem', color: 'var(--color-texto)', fontWeight: 500 }}>{valor}</span>
    </div>
  );
}

const styles = {
  pagina: { minHeight: '100vh', backgroundColor: 'var(--color-fondo)', padding: 'var(--espaciado-lg)' },
  contenedor: { maxWidth: '700px', margin: '0 auto', backgroundColor: '#fff', borderRadius: 'var(--radio-borde)', padding: 'var(--espaciado-xl)', boxShadow: '0 2px 16px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', gap: 'var(--espaciado-lg)' },
  encabezado: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  titulo: { margin: 0, fontFamily: 'var(--fuente-encabezado)', color: 'var(--color-primario)', fontSize: '1.5rem' },
  badge: { padding: '4px 14px', borderRadius: 20, fontSize: '0.85rem', fontWeight: 600 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--espaciado-md)' },
  contraOfertaBox: { backgroundColor: '#fffbeb', border: '1px solid #fcd34d', borderRadius: 'var(--radio-borde)', padding: 'var(--espaciado-md)' },
  contraOfertaTitulo: { margin: '0 0 8px', fontWeight: 700, color: '#92400e' },
  contraOfertaDato: { margin: '4px 0', fontSize: '0.95rem', color: 'var(--color-texto)' },
  acciones: { display: 'flex', gap: 'var(--espaciado-sm)', flexWrap: 'wrap' },
  btnAceptar: { padding: 'var(--espaciado-sm) var(--espaciado-lg)', backgroundColor: '#059669', color: '#fff', border: 'none', borderRadius: 'var(--radio-borde)', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--fuente-encabezado)' },
  btnRechazar: { padding: 'var(--espaciado-sm) var(--espaciado-lg)', backgroundColor: '#dc2626', color: '#fff', border: 'none', borderRadius: 'var(--radio-borde)', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--fuente-encabezado)' },
  btnContra: { padding: 'var(--espaciado-sm) var(--espaciado-lg)', backgroundColor: '#fff', color: 'var(--color-primario)', border: '2px solid var(--color-primario)', borderRadius: 'var(--radio-borde)', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--fuente-encabezado)' },
  btnPago: { display: 'inline-block', padding: 'var(--espaciado-sm) var(--espaciado-lg)', backgroundColor: 'var(--color-acento)', color: '#fff', borderRadius: 'var(--radio-borde)', textDecoration: 'none', fontFamily: 'var(--fuente-encabezado)', fontWeight: 600, fontSize: '0.95rem' },
  contraForm: { backgroundColor: '#f9f9f9', borderRadius: 'var(--radio-borde)', padding: 'var(--espaciado-md)', display: 'flex', flexDirection: 'column', gap: 'var(--espaciado-sm)' },
  contraFormTitulo: { margin: 0, fontWeight: 600, color: 'var(--color-texto)' },
  campo: { display: 'flex', flexDirection: 'column', gap: 4 },
  label: { fontSize: '0.85rem', color: 'var(--color-texto-secundario)' },
  input: { padding: 'var(--espaciado-sm) var(--espaciado-md)', border: '1px solid #ddd', borderRadius: 'var(--radio-borde)', fontSize: '0.95rem', fontFamily: 'var(--fuente-cuerpo)', color: 'var(--color-texto)', outline: 'none' },
  btnEnviarContra: { alignSelf: 'flex-start', padding: 'var(--espaciado-sm) var(--espaciado-lg)', backgroundColor: 'var(--color-secundario)', color: '#fff', border: 'none', borderRadius: 'var(--radio-borde)', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--fuente-encabezado)' },
  seccionResena: { display: 'flex', flexDirection: 'column', gap: 'var(--espaciado-sm)' },
  subtitulo: { margin: 0, fontFamily: 'var(--fuente-encabezado)', color: 'var(--color-texto)', fontSize: '1.05rem' },
  errorMsg: { backgroundColor: '#fde8e8', color: '#c0392b', padding: 'var(--espaciado-sm) var(--espaciado-md)', borderRadius: 'var(--radio-borde)', fontSize: '0.9rem', margin: 0 },
  exitoMsg: { backgroundColor: '#e6f9f0', color: '#1a7a4a', padding: 'var(--espaciado-sm) var(--espaciado-md)', borderRadius: 'var(--radio-borde)', fontSize: '0.9rem', margin: 0 },
  aviso: { fontSize: '1rem', color: 'var(--color-texto)' },
};
