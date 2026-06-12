import { useState, useEffect } from 'react';
import { DEPARTAMENTOS, MUNICIPIOS_POR_DEPARTAMENTO } from '../../constants/ubicaciones';

export default function SelectorUbicacion({ departamento, municipio, onDepartamentoChange, onMunicipioChange }) {
  const [otroMunicipio, setOtroMunicipio] = useState('');
  const municipios = departamento ? (MUNICIPIOS_POR_DEPARTAMENTO[departamento] || []) : [];
  const seleccionOtro = municipio === 'Otro' || (municipio && municipios.length > 0 && !municipios.includes(municipio));

  // Si el municipio actual no está en la lista del depto (valor libre previo), activar "Otro"
  useEffect(() => {
    if (departamento && municipio && municipios.length > 0 && !municipios.includes(municipio) && municipio !== 'Otro') {
      setOtroMunicipio(municipio);
      onMunicipioChange('Otro');
    }
  }, [departamento]);

  const handleDepartamento = (e) => {
    onDepartamentoChange(e.target.value);
    onMunicipioChange('');
    setOtroMunicipio('');
  };

  const handleMunicipio = (e) => {
    onMunicipioChange(e.target.value);
    if (e.target.value !== 'Otro') setOtroMunicipio('');
  };

  const handleOtroMunicipio = (e) => {
    setOtroMunicipio(e.target.value);
    onMunicipioChange(e.target.value);
  };

  return (
    <div style={styles.contenedor}>
      <div style={styles.campo}>
        <label style={styles.label}>Departamento</label>
        <select value={departamento} onChange={handleDepartamento} required style={styles.select}>
          <option value="">— Selecciona un departamento —</option>
          {DEPARTAMENTOS.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      {departamento && (
        <div style={styles.campo}>
          <label style={styles.label}>Municipio</label>
          <select
            value={seleccionOtro ? 'Otro' : municipio}
            onChange={handleMunicipio}
            required
            style={styles.select}
          >
            <option value="">— Selecciona un municipio —</option>
            {municipios.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      )}

      {seleccionOtro && (
        <div style={styles.campo}>
          <label style={styles.label}>Especifica el municipio</label>
          <input
            type="text"
            value={otroMunicipio}
            onChange={handleOtroMunicipio}
            placeholder="Escribe el nombre del municipio"
            required
            style={styles.input}
          />
        </div>
      )}
    </div>
  );
}

const styles = {
  contenedor: { display: 'flex', flexDirection: 'column', gap: 'var(--espaciado-md)' },
  campo: { display: 'flex', flexDirection: 'column', gap: '4px' },
  label: { fontSize: '0.875rem', color: 'var(--color-texto-secundario)', fontFamily: 'var(--fuente-cuerpo)' },
  select: {
    padding: 'var(--espaciado-sm) var(--espaciado-md)',
    border: '1px solid #ddd',
    borderRadius: 'var(--radio-borde)',
    fontSize: '1rem',
    fontFamily: 'var(--fuente-cuerpo)',
    color: 'var(--color-texto)',
    backgroundColor: '#fff',
    outline: 'none',
  },
  input: {
    padding: 'var(--espaciado-sm) var(--espaciado-md)',
    border: '1px solid #ddd',
    borderRadius: 'var(--radio-borde)',
    fontSize: '1rem',
    fontFamily: 'var(--fuente-cuerpo)',
    color: 'var(--color-texto)',
    outline: 'none',
  },
};
