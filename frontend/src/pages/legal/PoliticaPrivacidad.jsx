export default function PoliticaPrivacidad() {
  return (
    <div style={s.pagina}>
      <div style={s.contenedor}>
        <h1 style={s.titulo}>Política de Protección de Datos Personales</h1>
        <p style={s.subtituloApp}>SabaneraConnect</p>

        <Seccion titulo="1. Introducción">
          <p>SabaneraConnect es una plataforma de comercio electrónico diseñada para conectar organizadores de eventos con bandas culturales del Caribe colombiano, facilitando la búsqueda, contratación y gestión de presentaciones musicales a través de una plataforma web.</p>
          <p>La presente Política de Protección de Datos Personales establece los lineamientos para la recolección, almacenamiento, uso, tratamiento y protección de la información suministrada por los usuarios de la plataforma, garantizando el cumplimiento de los principios establecidos en la Ley 1581 de 2012 y demás disposiciones legales aplicables en Colombia.</p>
        </Seccion>

        <Seccion titulo="2. Objetivo">
          <p>Garantizar la protección de los datos personales de los usuarios, promoviendo prácticas seguras para el tratamiento de la información y asegurando el respeto por los derechos de los titulares de los datos.</p>
        </Seccion>

        <Seccion titulo="3. Alcance">
          <p>Esta política aplica a todos los usuarios que interactúan con la plataforma SabaneraConnect, incluyendo organizadores de eventos, bandas musicales y administradores del sistema.</p>
        </Seccion>

        <Seccion titulo="4. Información recopilada">
          <h3 style={s.h3}>Información personal</h3>
          <ul style={s.lista}>
            <li>Nombre y apellidos.</li>
            <li>Correo electrónico.</li>
            <li>Número telefónico.</li>
            <li>Ciudad de residencia.</li>
          </ul>
          <h3 style={s.h3}>Información de perfil</h3>
          <ul style={s.lista}>
            <li>Nombre artístico de la banda.</li>
            <li>Descripción del grupo musical.</li>
            <li>Fotografías promocionales.</li>
            <li>Géneros musicales.</li>
            <li>Redes sociales y medios de contacto.</li>
          </ul>
          <h3 style={s.h3}>Información de actividad</h3>
          <ul style={s.lista}>
            <li>Historial de solicitudes de contratación.</li>
            <li>Historial de consultas realizadas.</li>
            <li>Preferencias de navegación dentro de la plataforma.</li>
            <li>Fecha y hora de acceso al sistema.</li>
          </ul>
        </Seccion>

        <Seccion titulo="5. Finalidad del tratamiento de los datos">
          <p>Los datos recopilados serán utilizados para:</p>
          <ul style={s.lista}>
            <li>Gestionar el registro y autenticación de usuarios.</li>
            <li>Facilitar la comunicación entre organizadores y bandas.</li>
            <li>Administrar solicitudes de contratación.</li>
            <li>Mejorar la experiencia de usuario dentro de la plataforma.</li>
            <li>Generar estadísticas para optimizar los servicios ofrecidos.</li>
            <li>Atender requerimientos legales o administrativos cuando sea necesario.</li>
            <li>Garantizar la seguridad y correcto funcionamiento del sistema.</li>
          </ul>
        </Seccion>

        <Seccion titulo="6. Infraestructura tecnológica">
          <p>La información gestionada por SabaneraConnect se almacena y procesa mediante la siguiente infraestructura tecnológica:</p>
          <ul style={s.lista}>
            <li>Frontend: React + Vite desplegado en Vercel.</li>
            <li>Backend: Node.js + Express desplegado en Render.</li>
            <li>Base de datos: PostgreSQL administrada mediante Prisma ORM y alojada en Neon.</li>
          </ul>
          <p>Los proveedores utilizados implementan mecanismos de seguridad y disponibilidad que contribuyen a la protección de la información almacenada.</p>
        </Seccion>

        <Seccion titulo="7. Medidas de seguridad">
          <p>SabaneraConnect implementa las siguientes medidas de protección:</p>
          <ul style={s.lista}>
            <li>Uso de conexiones seguras mediante protocolo HTTPS.</li>
            <li>Cifrado de contraseñas utilizando algoritmos hash seguros.</li>
            <li>Restricción de acceso a la base de datos mediante credenciales protegidas.</li>
            <li>Uso de variables de entorno para proteger información sensible.</li>
            <li>Control de acceso para usuarios administradores.</li>
            <li>Copias de seguridad periódicas de la información.</li>
            <li>Monitoreo de errores y actividades sospechosas.</li>
          </ul>
        </Seccion>

        <Seccion titulo="8. Derechos de los titulares">
          <p>Los usuarios podrán ejercer los siguientes derechos:</p>
          <ul style={s.lista}>
            <li>Conocer los datos personales almacenados.</li>
            <li>Solicitar la actualización o corrección de información.</li>
            <li>Solicitar la eliminación de sus datos cuando sea procedente.</li>
            <li>Revocar la autorización otorgada para el tratamiento de datos.</li>
            <li>Presentar consultas o reclamaciones relacionadas con el manejo de su información.</li>
          </ul>
        </Seccion>

        <Seccion titulo="9. Conservación de la información">
          <p>Los datos personales serán conservados únicamente durante el tiempo necesario para cumplir las finalidades establecidas en esta política o mientras exista una relación activa entre el usuario y la plataforma.</p>
        </Seccion>

        <Seccion titulo="10. Modificaciones de la política">
          <p>SabaneraConnect podrá actualizar esta política cuando sea necesario debido a cambios tecnológicos, normativos o funcionales de la plataforma. Las modificaciones serán publicadas oportunamente.</p>
        </Seccion>

        <Seccion titulo="11. Contacto">
          <p>Para consultas relacionadas con esta política o con el tratamiento de datos personales, los usuarios podrán comunicarse con el equipo responsable del proyecto SabaneraConnect mediante los canales de contacto establecidos en la plataforma.</p>
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
