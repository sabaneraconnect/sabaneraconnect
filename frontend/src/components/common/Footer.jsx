import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={s.footer}>
      <div style={s.contenedor}>

        {/* Columna 1 */}
        <div style={s.columna}>
          <p style={s.marca}>SabaneraConnect</p>
          <p style={s.texto}>Plataforma de comercio electrónico que conecta organizadores de eventos con bandas culturales del Caribe colombiano.</p>
          <p style={s.texto}>Proyecto académico — Universidad de Cartagena, Ingeniería de Sistemas, Comercio Electrónico, 2026.</p>
        </div>

        {/* Columna 2 */}
        <div style={s.columna}>
          <p style={s.colTitulo}>Información legal</p>
          <p style={s.dato}><span style={s.etiqueta}>NIT:</span> 900.000.000-1</p>
          <p style={s.dato}><span style={s.etiqueta}>Razón social:</span> SabaneraConnect — Proyecto Académico</p>
          <p style={s.dato}><span style={s.etiqueta}>Dirección:</span> Universidad de Cartagena, Campus Piedra de Bolívar, Cartagena, Bolívar, Colombia</p>
          <p style={s.dato}><span style={s.etiqueta}>Correo:</span> contacto@sabaneraconnect.com</p>
        </div>

        {/* Columna 3 */}
        <div style={s.columna}>
          <p style={s.colTitulo}>Enlaces</p>
          <nav style={s.nav}>
            <Link to="/legal/terminos" style={s.enlace}>Términos y Condiciones</Link>
            <Link to="/legal/privacidad" style={s.enlace}>Política de Privacidad</Link>
            <Link to="/legal/pagos" style={s.enlace}>Seguridad en Pagos</Link>
            <a
              href="https://www.sic.gov.co"
              target="_blank"
              rel="noopener noreferrer"
              style={s.enlaceSIC}
            >
              Superintendencia de Industria y Comercio ↗
            </a>
          </nav>
        </div>

      </div>

      <div style={s.separador} />
      <p style={s.copyright}>© 2026 SabaneraConnect. Todos los derechos reservados.</p>
    </footer>
  );
}

const s = {
  footer: {
    backgroundColor: 'var(--color-secundario)',
    color: '#fff',
    padding: 'var(--espaciado-xl)',
  },
  contenedor: {
    maxWidth: '1000px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 'var(--espaciado-xl)',
  },
  columna: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  marca: {
    margin: 0,
    fontFamily: 'var(--fuente-encabezado)',
    fontSize: '1.2rem',
    fontWeight: 700,
    color: '#fff',
  },
  colTitulo: {
    margin: '0 0 4px',
    fontFamily: 'var(--fuente-encabezado)',
    fontSize: '1rem',
    fontWeight: 700,
    color: '#fff',
  },
  texto: {
    margin: 0,
    fontSize: '0.85rem',
    lineHeight: 1.6,
    color: 'rgba(255,255,255,0.82)',
  },
  dato: {
    margin: 0,
    fontSize: '0.85rem',
    lineHeight: 1.6,
    color: 'rgba(255,255,255,0.82)',
  },
  etiqueta: {
    fontWeight: 600,
    color: '#fff',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  enlace: {
    color: 'rgba(255,255,255,0.82)',
    textDecoration: 'none',
    fontSize: '0.9rem',
    transition: 'color 0.15s',
  },
  enlaceSIC: {
    color: 'var(--color-acento, #f9c74f)',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: 600,
    marginTop: 4,
  },
  separador: {
    maxWidth: '1000px',
    margin: 'var(--espaciado-lg) auto var(--espaciado-md)',
    borderTop: '1px solid rgba(255,255,255,0.2)',
  },
  copyright: {
    textAlign: 'center',
    margin: 0,
    fontSize: '0.8rem',
    color: 'rgba(255,255,255,0.6)',
  },
};
