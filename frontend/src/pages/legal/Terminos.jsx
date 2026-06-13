export default function Terminos() {
  return (
    <div style={s.pagina}>
      <div style={s.contenedor}>
        <h1 style={s.titulo}>Términos y Condiciones de Uso</h1>
        <p style={s.subtituloApp}>SabaneraConnect</p>

        <Seccion titulo="1. Naturaleza de la plataforma">
          <p>SabaneraConnect es un proyecto académico desarrollado por estudiantes de Ingeniería de Sistemas de la Universidad de Cartagena, para la asignatura de Comercio Electrónico. Funciona como un marketplace que conecta organizadores de eventos con bandas musicales culturales del Caribe colombiano.</p>
        </Seccion>

        <Seccion titulo="2. Usuarios de la plataforma">
          <p>La plataforma cuenta con dos tipos de usuario: Bandas musicales, que publican su perfil, disponibilidad y servicios; y Organizadores de eventos, que buscan y contratan bandas para sus presentaciones. Ambos deben proporcionar información veraz al registrarse.</p>
        </Seccion>

        <Seccion titulo="3. Proceso de contratación">
          <p>Las solicitudes de contratación pasan por los estados: pendiente, en negociación, confirmada, rechazada o cancelada. La banda puede aceptar, rechazar o realizar una contraoferta sobre cualquier solicitud recibida.</p>
        </Seccion>

        <Seccion titulo="4. Comisión de la plataforma">
          <p>SabaneraConnect aplica una comisión del 5% sobre el valor de cada servicio contratado a través de la plataforma, la cual es descontada del monto pagado a la banda.</p>
        </Seccion>

        <Seccion titulo="5. Pagos">
          <p>Los pagos se procesan mediante Stripe en modo de pruebas, sin que se generen transacciones financieras reales, conforme a lo establecido en la Política de Seguridad en Métodos de Pago.</p>
        </Seccion>

        <Seccion titulo="6. Reseñas y calificaciones">
          <p>Tras la realización de un evento, el organizador podrá calificar el servicio recibido. La banda calificada tendrá derecho a una única respuesta pública por reseña.</p>
        </Seccion>

        <Seccion titulo="7. Cancelaciones">
          <p>Una solicitud puede ser cancelada o rechazada antes de su confirmación. Una vez confirmada, las franjas de disponibilidad asociadas quedan reservadas para la banda.</p>
        </Seccion>

        <Seccion titulo="8. Protección de datos">
          <p>El tratamiento de la información personal de los usuarios se rige por la Política de Protección de Datos Personales de SabaneraConnect, conforme a la Ley 1581 de 2012.</p>
        </Seccion>

        <Seccion titulo="9. Limitación de responsabilidad">
          <p>Al tratarse de un proyecto académico, SabaneraConnect no garantiza disponibilidad continua del servicio ni se responsabiliza por acuerdos comerciales reales realizados fuera de la plataforma entre bandas y organizadores.</p>
        </Seccion>

        <Seccion titulo="10. Modificaciones">
          <p>Estos términos podrán ser actualizados conforme evolucione la plataforma. Los cambios serán publicados en esta misma sección.</p>
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
  cuerpo: { color: 'var(--color-texto)', fontSize: '0.95rem', lineHeight: 1.7 },
  actualizacion: { margin: 0, color: 'var(--color-texto-secundario)', fontSize: '0.85rem', fontStyle: 'italic' },
};
