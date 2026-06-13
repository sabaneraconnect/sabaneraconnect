export default function BurbujaMensaje({ mensaje, esPropio }) {
  const hora = new Date(mensaje.fechaEnvio).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });

  return (
    <div style={{ ...styles.fila, justifyContent: esPropio ? 'flex-end' : 'flex-start' }}>
      <div style={{ ...styles.burbuja, ...(esPropio ? styles.propio : styles.ajeno) }}>
        {!esPropio && <span style={styles.nombre}>{mensaje.remitente.nombre}</span>}
        <p style={styles.texto}>{mensaje.contenido}</p>
        <span style={styles.hora}>{hora}</span>
      </div>
    </div>
  );
}

const styles = {
  fila: { display: 'flex', marginBottom: 8 },
  burbuja: { maxWidth: '70%', padding: '8px 12px', borderRadius: 12, display: 'flex', flexDirection: 'column', gap: 2 },
  propio: { backgroundColor: 'var(--color-primario)', color: '#fff', borderBottomRightRadius: 4 },
  ajeno: { backgroundColor: '#f0f0f0', color: 'var(--color-texto)', borderBottomLeftRadius: 4 },
  nombre: { fontSize: '0.7rem', fontWeight: 700, opacity: 0.7 },
  texto: { margin: 0, fontSize: '0.9rem', lineHeight: 1.4 },
  hora: { fontSize: '0.65rem', opacity: 0.6, alignSelf: 'flex-end' },
};
