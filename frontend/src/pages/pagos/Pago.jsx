import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import ResumenPago from '../../components/pagos/ResumenPago';
import { iniciarPago, confirmarPagoUno, iniciarPagoDos, confirmarPagoDos, obtenerPago } from '../../services/pagoService';
import { obtenerSolicitud } from '../../services/solicitudService';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Comprueba en frontend si el evento ya ocurrió
const eventoRealizado = (sol) => {
  if (sol.estado !== 'confirmada') return false;
  const [h, m] = sol.franjaFin.split(':').map(Number);
  const dt = new Date(sol.fecha);
  dt.setUTCHours(h, m, 0, 0);
  return new Date() > dt;
};

function FormularioPago({ clientSecret, solicitudId, esDos, onExito }) {
  const stripe = useStripe();
  const elements = useElements();
  const token = localStorage.getItem('token');
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setProcesando(true);
    setError(null);
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: elements.getElement(CardElement) },
    });
    if (result.error) {
      setError(result.error.message);
      setProcesando(false);
    } else {
      try {
        if (esDos) await confirmarPagoDos(solicitudId, token);
        else await confirmarPagoUno(solicitudId, token);
        onExito();
      } catch (err) {
        setError(err.response?.data?.error || 'Error al confirmar el pago.');
        setProcesando(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.formularioPago}>
      <p style={styles.instruccion}>Ingresa los datos de tu tarjeta (modo prueba de Stripe):</p>
      <div style={styles.cardBox}>
        <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
      </div>
      {error && <p style={styles.errorMsg}>{error}</p>}
      <button type="submit" disabled={procesando || !stripe} style={styles.botonPagar}>
        {procesando ? 'Procesando...' : esDos ? 'Pagar saldo' : 'Pagar anticipo'}
      </button>
    </form>
  );
}

export default function Pago() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');

  const [solicitud, setSolicitud] = useState(null);
  const [pago, setPago] = useState(null);
  const [tieneCuenta, setTieneCuenta] = useState(true);
  const [clientSecret, setClientSecret] = useState(null);
  const [esDos, setEsDos] = useState(false);
  const [tipo, setTipo] = useState('dividido');
  const [pctAnticipo, setPctAnticipo] = useState(50);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [iniciando, setIniciando] = useState(false);

  const cargar = async () => {
    try {
      const [resSol, resPago] = await Promise.all([
        obtenerSolicitud(id, token),
        obtenerPago(id, token).catch(() => ({ data: null })),
      ]);
      setSolicitud(resSol.data);
      setPago(resPago.data);
      setTieneCuenta(!!resSol.data?.banda?.numeroCuenta);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cargar el pago.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { if (token) cargar(); }, [id]);

  if (!token || !usuario) return <div style={styles.pagina}><p style={styles.aviso}>Debes iniciar sesión.</p></div>;
  if (cargando) return <div style={styles.pagina}><p>Cargando...</p></div>;
  if (error) return <div style={styles.pagina}><p style={styles.errorMsg}>{error}</p></div>;
  if (!solicitud) return null;

  const esOrganizador = solicitud.organizador?.usuario && usuario.rol === 'organizador';
  const realizado = eventoRealizado(solicitud);

  const handleIniciar = async () => {
    setIniciando(true);
    setError(null);
    try {
      const res = await iniciarPago(id, tipo, pctAnticipo, token);
      setPago(res.data.pago);
      setClientSecret(res.data.clientSecret);
      setEsDos(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al iniciar el pago.');
    } finally {
      setIniciando(false);
    }
  };

  const handleIniciarDos = async () => {
    setIniciando(true);
    setError(null);
    try {
      const res = await iniciarPagoDos(id, token);
      setPago(res.data.pago);
      setClientSecret(res.data.clientSecret);
      setEsDos(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al iniciar el segundo pago.');
    } finally {
      setIniciando(false);
    }
  };

  const handleExito = async () => {
    setClientSecret(null);
    await cargar();
  };

  const mostrarFormularioPago = clientSecret && pago;
  const puedeIniciarDos = pago && pago.tipo === 'dividido' && pago.estadoPagoUno === 'pagado' && pago.estadoPagoDos === 'pendiente' && !clientSecret;
  const todoPagado = pago && pago.estadoPagoUno === 'pagado' && (pago.estadoPagoDos === 'pagado' || pago.estadoPagoDos === 'no_aplica');

  return (
    <div style={styles.pagina}>
      <Helmet>
        <title>Pago — SabaneraConnect</title>
      </Helmet>
      <div style={styles.contenedor}>
        <h1 style={styles.titulo}>Pago — Solicitud #{id}</h1>

        {pago && <ResumenPago pago={pago} />}

        {todoPagado && (
          <div style={styles.exitoMsg}>✓ Todos los pagos completados. ¡Gracias!</div>
        )}

        {!pago && esOrganizador && solicitud.estado === 'confirmada' && (
          <div style={styles.seccion}>
            <h3 style={styles.subtitulo}>Configurar pago</h3>
            <div style={styles.campo}>
              <label style={styles.label}>Modalidad</label>
              <select value={tipo} onChange={(e) => setTipo(e.target.value)} style={styles.input}>
                <option value="completo">Pago completo (100% anticipado)</option>
                <option value="dividido">Dividido (anticipo + saldo al finalizar)</option>
              </select>
            </div>
            {tipo === 'dividido' && (
              <div style={styles.campo}>
                <label style={styles.label}>Porcentaje de anticipo: <strong>{pctAnticipo}%</strong></label>
                <input type="range" min="10" max="90" step="10" value={pctAnticipo} onChange={(e) => setPctAnticipo(Number(e.target.value))} style={{ width: '100%' }} />
                <span style={styles.hint}>Saldo restante ({100 - pctAnticipo}%) se paga tras el evento.</span>
              </div>
            )}
            {error && <p style={styles.errorMsg}>{error}</p>}
            <button onClick={handleIniciar} disabled={iniciando} style={styles.boton}>
              {iniciando ? 'Iniciando...' : 'Continuar al pago'}
            </button>
          </div>
        )}

        {mostrarFormularioPago && (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <FormularioPago clientSecret={clientSecret} solicitudId={id} esDos={esDos} onExito={handleExito} />
          </Elements>
        )}

        {puedeIniciarDos && (
          <div style={styles.seccion}>
            <p style={styles.instruccion}>El primer pago fue completado. Puedes realizar el pago del saldo restante cuando lo desees.</p>
            {error && <p style={styles.errorMsg}>{error}</p>}
            <button onClick={handleIniciarDos} disabled={iniciando} style={styles.boton}>
              {iniciando ? 'Iniciando...' : 'Pagar saldo restante'}
            </button>
          </div>
        )}

        {pago && pago.estadoPagoUno === 'pendiente' && !clientSecret && (
          <div style={styles.seccion}>
            <p style={styles.instruccion}>El pago anterior no fue completado. Puedes iniciar uno nuevo.</p>
            {error && <p style={styles.errorMsg}>{error}</p>}
            <button onClick={handleIniciar} disabled={iniciando} style={styles.boton}>
              {iniciando ? 'Iniciando...' : 'Iniciar nuevo pago'}
            </button>
          </div>
        )}

        <button onClick={() => navigate(`/solicitudes/${id}`)} style={styles.btnVolver}>
          ← Volver a la solicitud
        </button>
      </div>
    </div>
  );
}

const styles = {
  pagina: { minHeight: '100vh', backgroundColor: 'var(--color-fondo)', padding: 'var(--espaciado-lg)' },
  contenedor: { maxWidth: '600px', margin: '0 auto', backgroundColor: '#fff', borderRadius: 'var(--radio-borde)', padding: 'var(--espaciado-xl)', boxShadow: '0 2px 16px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', gap: 'var(--espaciado-lg)' },
  titulo: { margin: 0, fontFamily: 'var(--fuente-encabezado)', color: 'var(--color-primario)', fontSize: '1.4rem' },
  subtitulo: { margin: 0, fontFamily: 'var(--fuente-encabezado)', fontSize: '1rem', color: 'var(--color-texto)' },
  seccion: { display: 'flex', flexDirection: 'column', gap: 'var(--espaciado-sm)' },
  campo: { display: 'flex', flexDirection: 'column', gap: 4 },
  label: { fontSize: '0.85rem', color: 'var(--color-texto-secundario)' },
  input: { padding: '8px 12px', border: '1px solid #ddd', borderRadius: 'var(--radio-borde)', fontSize: '1rem', fontFamily: 'var(--fuente-cuerpo)' },
  hint: { fontSize: '0.8rem', color: 'var(--color-texto-secundario)' },
  boton: { alignSelf: 'flex-start', padding: 'var(--espaciado-sm) var(--espaciado-xl)', backgroundColor: 'var(--color-primario)', color: '#fff', border: 'none', borderRadius: 'var(--radio-borde)', fontSize: '1rem', fontFamily: 'var(--fuente-encabezado)', fontWeight: 600, cursor: 'pointer' },
  formularioPago: { display: 'flex', flexDirection: 'column', gap: 'var(--espaciado-sm)' },
  instruccion: { margin: 0, fontSize: '0.9rem', color: 'var(--color-texto-secundario)' },
  cardBox: { border: '1px solid #ddd', borderRadius: 'var(--radio-borde)', padding: '12px', backgroundColor: '#fafafa' },
  botonPagar: { alignSelf: 'flex-start', padding: 'var(--espaciado-sm) var(--espaciado-xl)', backgroundColor: '#059669', color: '#fff', border: 'none', borderRadius: 'var(--radio-borde)', fontSize: '1rem', fontFamily: 'var(--fuente-encabezado)', fontWeight: 600, cursor: 'pointer' },
  exitoMsg: { backgroundColor: '#d1fae5', color: '#065f46', padding: 'var(--espaciado-md)', borderRadius: 'var(--radio-borde)', fontWeight: 600, textAlign: 'center' },
  errorMsg: { backgroundColor: '#fde8e8', color: '#c0392b', padding: 'var(--espaciado-sm) var(--espaciado-md)', borderRadius: 'var(--radio-borde)', fontSize: '0.9rem', margin: 0 },
  aviso: { color: 'var(--color-texto)', fontSize: '1rem' },
  btnVolver: { alignSelf: 'flex-start', background: 'none', border: 'none', color: 'var(--color-primario)', cursor: 'pointer', fontSize: '0.9rem', padding: 0, fontFamily: 'var(--fuente-cuerpo)' },
};
