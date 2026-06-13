import { useState, useEffect, useRef } from 'react';
import BurbujaMensaje from './BurbujaMensaje';
import { obtenerMensajes, enviarMensaje } from '../../services/mensajeService';

export default function Chat({ solicitudId, estadoSolicitud }) {
  const token = localStorage.getItem('token');
  const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');
  const [mensajes, setMensajes] = useState([]);
  const [texto, setTexto] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);
  const endRef = useRef(null);
  const conteoRef = useRef(0);

  const deshabilitado = ['cancelada', 'rechazada'].includes(estadoSolicitud);

  const cargar = async () => {
    try {
      const res = await obtenerMensajes(solicitudId, token);
      setMensajes((prev) => {
        if (res.data.length !== prev.length) {
          conteoRef.current = res.data.length;
          return res.data;
        }
        return prev;
      });
    } catch {
      // silencioso en polling
    }
  };

  useEffect(() => {
    cargar();
    const intervalo = setInterval(cargar, 5000);
    return () => clearInterval(intervalo);
  }, [solicitudId]);

  useEffect(() => {
    if (mensajes.length > 0 && mensajes.length === conteoRef.current) {
      endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [mensajes]);

  const handleEnviar = async (e) => {
    e.preventDefault();
    if (!texto.trim()) return;
    setEnviando(true);
    setError(null);
    try {
      await enviarMensaje(solicitudId, texto.trim(), token);
      setTexto('');
      await cargar();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al enviar el mensaje.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div style={styles.contenedor}>
      <h3 style={styles.titulo}>Chat</h3>
      <div style={styles.historial}>
        {mensajes.length === 0 && <p style={styles.vacio}>Aún no hay mensajes. ¡Inicia la conversación!</p>}
        {mensajes.map((m) => (
          <BurbujaMensaje key={m.id} mensaje={m} esPropio={m.remitenteId === usuario?.id} />
        ))}
        <div ref={endRef} />
      </div>
      {deshabilitado ? (
        <p style={styles.deshabilitado}>El chat está cerrado para solicitudes {estadoSolicitud === 'cancelada' ? 'canceladas' : 'rechazadas'}.</p>
      ) : (
        <form onSubmit={handleEnviar} style={styles.formulario}>
          {error && <p style={styles.errorMsg}>{error}</p>}
          <div style={styles.fila}>
            <input
              type="text"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Escribe un mensaje..."
              style={styles.input}
              maxLength={1000}
            />
            <button type="submit" disabled={enviando || !texto.trim()} style={styles.boton}>
              {enviando ? '...' : 'Enviar'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

const styles = {
  contenedor: { display: 'flex', flexDirection: 'column', gap: 'var(--espaciado-sm)', border: '1px solid #eee', borderRadius: 'var(--radio-borde)', padding: 'var(--espaciado-md)', backgroundColor: '#fafafa' },
  titulo: { margin: 0, fontFamily: 'var(--fuente-encabezado)', color: 'var(--color-texto)', fontSize: '1.05rem' },
  historial: { minHeight: 150, maxHeight: 300, overflowY: 'auto', display: 'flex', flexDirection: 'column', padding: '4px 0' },
  vacio: { color: 'var(--color-texto-secundario)', fontSize: '0.85rem', textAlign: 'center', margin: 'auto' },
  formulario: { display: 'flex', flexDirection: 'column', gap: 4 },
  fila: { display: 'flex', gap: 8 },
  input: { flex: 1, padding: '8px 12px', border: '1px solid #ddd', borderRadius: 'var(--radio-borde)', fontSize: '0.9rem', fontFamily: 'var(--fuente-cuerpo)', outline: 'none' },
  boton: { padding: '8px 16px', backgroundColor: 'var(--color-primario)', color: '#fff', border: 'none', borderRadius: 'var(--radio-borde)', fontFamily: 'var(--fuente-encabezado)', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' },
  deshabilitado: { fontSize: '0.85rem', color: 'var(--color-texto-secundario)', fontStyle: 'italic', margin: 0 },
  errorMsg: { fontSize: '0.8rem', color: '#c0392b', margin: 0 },
};
