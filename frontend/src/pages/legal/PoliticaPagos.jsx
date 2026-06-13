export default function PoliticaPagos() {
  return (
    <div style={s.pagina}>
      <div style={s.contenedor}>
        <h1 style={s.titulo}>Política de Seguridad en Métodos de Pago</h1>
        <p style={s.subtituloApp}>SabaneraConnect</p>

        <Seccion titulo="1. Introducción">
          <p>SabaneraConnect incorpora una solución de pagos electrónicos con el propósito de simular el proceso de contratación entre organizadores de eventos y bandas culturales. La presente política establece los mecanismos de seguridad implementados para proteger la información relacionada con las transacciones realizadas dentro de la plataforma.</p>
        </Seccion>

        <Seccion titulo="2. Objetivo">
          <p>Garantizar la seguridad, integridad y confidencialidad de las operaciones de pago simuladas realizadas a través de SabaneraConnect, aplicando buenas prácticas de comercio electrónico y seguridad informática.</p>
        </Seccion>

        <Seccion titulo="3. Alcance">
          <p>Esta política aplica a todas las operaciones de pago realizadas dentro de la plataforma durante el desarrollo, pruebas y evaluación académica del proyecto.</p>
        </Seccion>

        <Seccion titulo="4. Método de pago implementado">
          <p>SabaneraConnect utiliza la plataforma Stripe en su entorno de pruebas (Stripe Test Mode), permitiendo simular transacciones electrónicas sin realizar cobros reales a los usuarios.</p>
          <p>La implementación tiene fines exclusivamente académicos y busca validar técnicamente el flujo completo de compra y contratación dentro de la plataforma.</p>
          <p>Las operaciones realizadas mediante este entorno:</p>
          <ul style={s.lista}>
            <li>No generan movimientos financieros reales.</li>
            <li>No realizan cobros a tarjetas bancarias.</li>
            <li>Utilizan tarjetas de prueba proporcionadas por Stripe.</li>
            <li>Permiten validar el comportamiento del sistema ante diferentes escenarios de pago.</li>
          </ul>
        </Seccion>

        <Seccion titulo="5. Arquitectura del procesamiento de pagos">
          <p>El flujo de pagos simulados se soporta mediante la siguiente arquitectura tecnológica:</p>
          <ul style={s.lista}>
            <li>Frontend desarrollado con React + Vite.</li>
            <li>Backend desarrollado con Node.js + Express.</li>
            <li>Integración con la API oficial de Stripe.</li>
            <li>Base de datos PostgreSQL gestionada mediante Prisma ORM.</li>
            <li>Infraestructura desplegada en Vercel, Render y Neon.</li>
          </ul>
          <p>La información financiera es procesada directamente por Stripe y no es almacenada por SabaneraConnect.</p>
        </Seccion>

        <Seccion titulo="6. Principios de seguridad">
          <h3 style={s.h3}>Confidencialidad</h3>
          <p>La información relacionada con medios de pago es gestionada por Stripe utilizando sus propios mecanismos de seguridad.</p>
          <h3 style={s.h3}>Integridad</h3>
          <p>Toda la información transmitida durante una transacción se encuentra protegida mediante protocolos de cifrado que garantizan que los datos no sean alterados.</p>
          <h3 style={s.h3}>Disponibilidad</h3>
          <p>La plataforma busca mantener disponible el servicio de pagos simulados durante el desarrollo y evaluación del proyecto.</p>
        </Seccion>

        <Seccion titulo="7. Medidas de seguridad implementadas">
          <p>Para proteger la información de los usuarios se implementan las siguientes medidas:</p>
          <ul style={s.lista}>
            <li>Uso obligatorio del protocolo HTTPS.</li>
            <li>Integración mediante las APIs oficiales de Stripe.</li>
            <li>Validación de solicitudes entre cliente y servidor.</li>
            <li>Protección de credenciales mediante variables de entorno.</li>
            <li>Restricción de acceso a recursos administrativos.</li>
            <li>Gestión segura de sesiones de usuario.</li>
            <li>Registro y monitoreo de errores en las transacciones.</li>
            <li>Almacenamiento seguro de contraseñas mediante algoritmos de cifrado hash.</li>
          </ul>
        </Seccion>

        <Seccion titulo="8. Protección de credenciales">
          <p>Las claves de integración utilizadas para la comunicación con Stripe son almacenadas mediante variables de entorno en el servidor backend desplegado en Render.</p>
          <p>Estas credenciales:</p>
          <ul style={s.lista}>
            <li>No son visibles para los usuarios.</li>
            <li>No se almacenan dentro del repositorio público de GitHub.</li>
            <li>Son utilizadas exclusivamente por el servidor para establecer comunicación segura con Stripe.</li>
          </ul>
        </Seccion>

        <Seccion titulo="9. Protección de la información financiera">
          <p>SabaneraConnect no almacena:</p>
          <ul style={s.lista}>
            <li>Números completos de tarjetas.</li>
            <li>Códigos de seguridad (CVV).</li>
            <li>Datos bancarios sensibles.</li>
          </ul>
          <p>La plataforma únicamente recibe información relacionada con el estado de la transacción simulada, manteniendo la privacidad de la información financiera.</p>
        </Seccion>

        <Seccion titulo="10. Control de versiones y seguridad del desarrollo">
          <p>El proyecto utiliza Git y GitHub como sistema de control de versiones bajo la siguiente estrategia:</p>
          <ul style={s.lista}>
            <li>Main: versión estable para despliegue y presentación.</li>
            <li>Develop: integración general del equipo.</li>
            <li>Feature/*: desarrollo individual de funcionalidades.</li>
          </ul>
          <p>Esta metodología permite reducir riesgos de errores, mantener trazabilidad de cambios y mejorar la seguridad durante el desarrollo.</p>
        </Seccion>

        <Seccion titulo="11. Responsabilidades del usuario">
          <p>Los usuarios deberán:</p>
          <ul style={s.lista}>
            <li>Utilizar únicamente las tarjetas de prueba autorizadas por Stripe.</li>
            <li>Mantener la confidencialidad de sus credenciales de acceso.</li>
            <li>No intentar modificar o vulnerar el funcionamiento de la plataforma.</li>
            <li>Reportar cualquier comportamiento anómalo detectado durante las pruebas.</li>
          </ul>
        </Seccion>

        <Seccion titulo="12. Gestión de incidentes">
          <p>En caso de presentarse errores o incidentes relacionados con pagos simulados:</p>
          <ul style={s.lista}>
            <li>Se registrará el incidente en los sistemas de monitoreo.</li>
            <li>Se verificará la comunicación entre la plataforma y Stripe.</li>
            <li>Se revisarán los registros generados por el backend.</li>
            <li>Se implementarán acciones correctivas para prevenir futuros inconvenientes.</li>
          </ul>
        </Seccion>

        <Seccion titulo="13. Escalabilidad futura">
          <p>La arquitectura implementada permite una migración sencilla desde Stripe Test Mode hacia Stripe Live Mode para una futura versión productiva.</p>
          <p>Esta transición permitiría:</p>
          <ul style={s.lista}>
            <li>Procesamiento de pagos reales.</li>
            <li>Cobros mediante tarjetas débito y crédito.</li>
            <li>Gestión de reembolsos.</li>
            <li>Operaciones comerciales reales.</li>
            <li>Cumplimiento de estándares internacionales de seguridad como PCI DSS.</li>
          </ul>
        </Seccion>

        <Seccion titulo="14. Actualización de la política">
          <p>Esta política podrá ser modificada en función de nuevas funcionalidades, cambios tecnológicos o mejoras implementadas en la plataforma.</p>
        </Seccion>

        <p style={s.actualizacion}>Última actualización: Junio de 2026.</p>
      </div>
    </div>
  );
}

function Seccion({ titulo, children }) {
  return (
    <section style={s.seccion}>
      <h2 style={s.h2}>{titulo}</h2>
      <div style={s.cuerpo}>{children}</div>
    </section>
  );
}

const s = {
  pagina: { backgroundColor: 'var(--color-fondo)', minHeight: '100vh', padding: 'var(--espaciado-xl)' },
  contenedor: { maxWidth: '700px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--espaciado-md)' },
  titulo: { fontFamily: 'var(--fuente-encabezado)', color: 'var(--color-primario)', margin: 0, fontSize: '1.75rem' },
  subtituloApp: { margin: 0, color: 'var(--color-texto-secundario)', fontSize: '1rem', fontStyle: 'italic' },
  seccion: { display: 'flex', flexDirection: 'column', gap: 8 },
  h2: { fontFamily: 'var(--fuente-encabezado)', color: 'var(--color-secundario)', margin: 0, fontSize: '1.1rem' },
  h3: { fontFamily: 'var(--fuente-encabezado)', color: 'var(--color-texto)', margin: '12px 0 4px', fontSize: '0.95rem' },
  lista: { margin: '4px 0', paddingLeft: '1.4rem', color: 'var(--color-texto)', fontSize: '0.95rem', lineHeight: 1.8 },
  cuerpo: { color: 'var(--color-texto)', fontSize: '0.95rem', lineHeight: 1.7 },
  actualizacion: { margin: 0, color: 'var(--color-texto-secundario)', fontSize: '0.85rem', fontStyle: 'italic' },
};
