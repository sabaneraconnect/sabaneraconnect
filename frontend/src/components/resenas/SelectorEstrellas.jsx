import { useState } from 'react';

export default function SelectorEstrellas({ valor, onChange, soloLectura = false }) {
  const [hover, setHover] = useState(0);

  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {[1, 2, 3, 4, 5].map((estrella) => {
        const activa = estrella <= (hover || valor);
        return (
          <span
            key={estrella}
            onClick={() => !soloLectura && onChange && onChange(estrella)}
            onMouseEnter={() => !soloLectura && setHover(estrella)}
            onMouseLeave={() => !soloLectura && setHover(0)}
            style={{
              fontSize: soloLectura ? '1rem' : '1.5rem',
              color: activa ? 'var(--color-acento)' : '#ccc',
              cursor: soloLectura ? 'default' : 'pointer',
              transition: 'color 0.1s',
              userSelect: 'none',
            }}
          >
            ★
          </span>
        );
      })}
    </div>
  );
}
