export default function Paginacion({ paginaActual, totalPaginas, onCambioPagina }) {
  if (totalPaginas <= 1) return null;

  const paginas = Array.from({ length: totalPaginas }, (_, i) => i + 1);

  return (
    <div style={styles.contenedor}>
      <button
        onClick={() => onCambioPagina(paginaActual - 1)}
        disabled={paginaActual === 1}
        style={{ ...styles.boton, ...(paginaActual === 1 ? styles.deshabilitado : {}) }}
      >
        Anterior
      </button>

      {paginas.map((p) => (
        <button
          key={p}
          onClick={() => onCambioPagina(p)}
          style={{ ...styles.boton, ...(p === paginaActual ? styles.activo : {}) }}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onCambioPagina(paginaActual + 1)}
        disabled={paginaActual === totalPaginas}
        style={{ ...styles.boton, ...(paginaActual === totalPaginas ? styles.deshabilitado : {}) }}
      >
        Siguiente
      </button>
    </div>
  );
}

const styles = {
  contenedor: { display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' },
  boton: {
    padding: '6px 14px',
    border: '1px solid #ddd',
    borderRadius: 'var(--radio-borde)',
    fontSize: '0.9rem',
    cursor: 'pointer',
    backgroundColor: '#fff',
    color: 'var(--color-texto)',
    fontFamily: 'var(--fuente-cuerpo)',
  },
  activo: { backgroundColor: 'var(--color-primario)', color: '#fff', borderColor: 'var(--color-primario)', fontWeight: 600 },
  deshabilitado: { opacity: 0.4, cursor: 'not-allowed' },
};
