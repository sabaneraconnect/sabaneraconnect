import { useState } from 'react';
import { subirMultimedia, eliminarMultimedia } from '../../services/bandaService';

const MB = 1024 * 1024;
const LIMITE = { foto: 50 * MB, video: 500 * MB };

export default function GaleriaMultimedia({ bandaId, multimedia, token, onCambio }) {
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState(null);

  const handleArchivo = async (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;

    const tipo = archivo.type.startsWith('video/') ? 'video' : 'foto';
    if (archivo.size > LIMITE[tipo]) {
      setError(`El archivo supera el límite de ${tipo === 'video' ? '500' : '50'} MB.`);
      return;
    }

    setError(null);
    setSubiendo(true);
    try {
      await subirMultimedia(bandaId, archivo, tipo, token);
      onCambio();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al subir el archivo.');
    } finally {
      setSubiendo(false);
      e.target.value = '';
    }
  };

  const handleEliminar = async (archivoId) => {
    if (!confirm('¿Eliminar este archivo?')) return;
    try {
      await eliminarMultimedia(bandaId, archivoId, token);
      onCambio();
    } catch {
      setError('Error al eliminar el archivo.');
    }
  };

  return (
    <div style={styles.contenedor}>
      <h3 style={styles.titulo}>Multimedia</h3>

      {error && <p style={styles.errorMsg}>{error}</p>}

      <label style={styles.botonSubir}>
        {subiendo ? 'Subiendo...' : '+ Agregar foto o video'}
        <input
          type="file"
          accept="image/*,video/*"
          style={{ display: 'none' }}
          onChange={handleArchivo}
          disabled={subiendo}
        />
      </label>
      <p style={styles.ayuda}>Máx. 50 MB por foto · 500 MB por video</p>

      {multimedia.length === 0 ? (
        <p style={styles.vacio}>No hay archivos todavía.</p>
      ) : (
        <div style={styles.grid}>
          {multimedia.map((m) => (
            <div key={m.id} style={styles.item}>
              {m.tipo === 'video' ? (
                <video src={m.url} style={styles.media} controls />
              ) : (
                <img src={m.url} alt="foto banda" style={styles.media} />
              )}
              <button onClick={() => handleEliminar(m.id)} style={styles.btnEliminar}>✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  contenedor: { display: 'flex', flexDirection: 'column', gap: 'var(--espaciado-sm)' },
  titulo: { fontFamily: 'var(--fuente-encabezado)', color: 'var(--color-texto)', margin: 0 },
  botonSubir: {
    display: 'inline-block',
    padding: 'var(--espaciado-sm) var(--espaciado-md)',
    backgroundColor: 'var(--color-secundario)',
    color: '#fff',
    borderRadius: 'var(--radio-borde)',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontFamily: 'var(--fuente-encabezado)',
    fontWeight: 600,
    alignSelf: 'flex-start',
  },
  ayuda: { margin: 0, fontSize: '0.8rem', color: 'var(--color-texto-secundario)' },
  vacio: { color: 'var(--color-texto-secundario)', fontSize: '0.9rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 'var(--espaciado-sm)' },
  item: { position: 'relative', borderRadius: 'var(--radio-borde)', overflow: 'hidden', background: '#f0f0f0' },
  media: { width: '100%', height: '120px', objectFit: 'cover', display: 'block' },
  btnEliminar: {
    position: 'absolute', top: 4, right: 4,
    background: 'rgba(0,0,0,0.6)', color: '#fff',
    border: 'none', borderRadius: '50%',
    width: 24, height: 24, cursor: 'pointer',
    fontSize: '0.75rem', fontWeight: 700,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  errorMsg: {
    backgroundColor: '#fde8e8', color: '#c0392b',
    padding: 'var(--espaciado-sm) var(--espaciado-md)',
    borderRadius: 'var(--radio-borde)', fontSize: '0.9rem', margin: 0,
  },
};
