const ESTADO_COLORES = {
  pendiente: { bg: '#fef3c7', color: '#92400e', label: 'Pendiente' },
  pagado:    { bg: '#d1fae5', color: '#065f46', label: 'Pagado' },
  no_aplica: { bg: '#f3f4f6', color: '#6b7280', label: 'No aplica' },
};

function EstadoBadge({ estado }) {
  const c = ESTADO_COLORES[estado] || ESTADO_COLORES.pendiente;
  return <span style={{ padding: '2px 10px', borderRadius: 12, fontSize: '0.8rem', fontWeight: 600, backgroundColor: c.bg, color: c.color }}>{c.label}</span>;
}

function Linea({ label, valor, negrita }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: negrita ? '1rem' : '0.9rem', fontWeight: negrita ? 700 : 400, color: 'var(--color-texto)', padding: '4px 0', borderBottom: '1px solid #f0f0f0' }}>
      <span>{label}</span>
      <span>{valor}</span>
    </div>
  );
}

const fmt = (n) => Number(n).toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 });

export default function ResumenPago({ pago, tieneCuentaBancaria = true }) {
  const mostrarTransferenciaUno = pago.estadoPagoUno === 'pagado';
  const mostrarTransferenciaDos = pago.tipo === 'dividido' && pago.estadoPagoDos === 'pagado';

  return (
    <div style={styles.caja}>
      <h3 style={styles.titulo}>Resumen del pago</h3>
      <div style={styles.tabla}>
        <Linea label="Monto total acordado" valor={fmt(pago.montoTotal)} negrita />
        <Linea label="Comisión plataforma (5%)" valor={fmt(pago.comision)} />
        {pago.tipo === 'dividido' && <>
          <Linea label={`Primer pago (${pago.porcentajeAnticipo}% anticipo)`} valor={fmt(pago.montoAnticipo)} />
          <Linea label={`Segundo pago (${100 - pago.porcentajeAnticipo}% saldo)`} valor={fmt(pago.montoRestante)} />
        </>}
      </div>

      <div style={styles.estados}>
        <div style={styles.filaEstado}>
          <span style={styles.labelEstado}>{pago.tipo === 'dividido' ? 'Primer pago' : 'Pago'}</span>
          <EstadoBadge estado={pago.estadoPagoUno} />
        </div>
        {pago.tipo === 'dividido' && (
          <div style={styles.filaEstado}>
            <span style={styles.labelEstado}>Segundo pago</span>
            <EstadoBadge estado={pago.estadoPagoDos} />
          </div>
        )}
      </div>

      {(mostrarTransferenciaUno || mostrarTransferenciaDos) && (
        <div style={styles.seccionBanda}>
          <p style={styles.tituloBanda}>Transferencia a la banda</p>
          {!tieneCuentaBancaria && (
            <p style={styles.nota}>(Pago acordado en efectivo o por transferencia directa)</p>
          )}
          {mostrarTransferenciaUno && (
            <div style={styles.filaTransferencia}>
              <span style={styles.labelEstado}>{pago.tipo === 'dividido' ? 'Primer pago' : 'Pago'}</span>
              {pago.estadoPagoBandaUno === 'transferido'
                ? <span style={styles.transferido}>✓ Transferido: {fmt(pago.montoTransferidoUno)}</span>
                : <span style={styles.pendienteBanda}>Pendiente</span>}
            </div>
          )}
          {mostrarTransferenciaDos && (
            <div style={styles.filaTransferencia}>
              <span style={styles.labelEstado}>Segundo pago</span>
              {pago.estadoPagoBandaDos === 'transferido'
                ? <span style={styles.transferido}>✓ Transferido: {fmt(pago.montoTransferidoDos)}</span>
                : <span style={styles.pendienteBanda}>Pendiente</span>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  caja: { border: '1px solid #e5e7eb', borderRadius: 'var(--radio-borde)', padding: 'var(--espaciado-md)', display: 'flex', flexDirection: 'column', gap: 'var(--espaciado-sm)', backgroundColor: '#fff' },
  titulo: { margin: 0, fontFamily: 'var(--fuente-encabezado)', color: 'var(--color-primario)', fontSize: '1.05rem' },
  tabla: { display: 'flex', flexDirection: 'column' },
  estados: { display: 'flex', flexDirection: 'column', gap: 6, paddingTop: 4 },
  filaEstado: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  labelEstado: { fontSize: '0.9rem', color: 'var(--color-texto-secundario)' },
  seccionBanda: { borderTop: '1px solid #e5e7eb', paddingTop: 'var(--espaciado-sm)', display: 'flex', flexDirection: 'column', gap: 6 },
  tituloBanda: { margin: 0, fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-texto)' },
  nota: { margin: 0, fontSize: '0.8rem', color: 'var(--color-texto-secundario)', fontStyle: 'italic' },
  filaTransferencia: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  transferido: { fontSize: '0.85rem', color: '#065f46', fontWeight: 600 },
  pendienteBanda: { fontSize: '0.85rem', color: '#92400e' },
};
