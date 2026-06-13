import SelectorEstrellas from './SelectorEstrellas';

export default function TarjetaResena({ resena }) {
  const fecha = new Date(resena.fechaCreacion).toLocaleDateString('es-CO', { dateStyle: 'medium' });

  return (
    <div style={styles.tarjeta}>
      <div style={styles.encabezado}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={styles.organizador}>{resena.organizador}</span>
          <span style={styles.fecha}>{fecha}</span>
        </div>
        <SelectorEstrellas valor={resena.calificacion} soloLectura />
      </div>
      {resena.comentario && <p style={styles.comentario}>{resena.comentario}</p>}
      {resena.respuestaBanda && (
        <div style={styles.respuestaBox}>
          <span style={styles.respuestaLabel}>Respuesta de la banda:</span>
          <p style={styles.respuestaTexto}>{resena.respuestaBanda}</p>
        </div>
      )}
    </div>
  );
}

const styles = {
  tarjeta: { border: '1px solid #eee', borderRadius: 'var(--radio-borde)', padding: 'var(--espaciado-md)', display: 'flex', flexDirection: 'column', gap: 'var(--espaciado-sm)', backgroundColor: '#fff' },
  encabezado: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  organizador: { fontWeight: 600, fontSize: '0.95rem', color: 'var(--color-texto)' },
  fecha: { fontSize: '0.75rem', color: 'var(--color-texto-secundario)' },
  comentario: { margin: 0, fontSize: '0.9rem', color: 'var(--color-texto)', lineHeight: 1.5 },
  respuestaBox: { backgroundColor: '#f5f5f5', borderLeft: '3px solid var(--color-secundario)', padding: '8px 12px', borderRadius: '0 var(--radio-borde) var(--radio-borde) 0', display: 'flex', flexDirection: 'column', gap: 4 },
  respuestaLabel: { fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-secundario)', textTransform: 'uppercase' },
  respuestaTexto: { margin: 0, fontSize: '0.88rem', color: 'var(--color-texto)' },
};
