const esEventoRealizado = (solicitud) => {
  if (solicitud.estado !== 'confirmada') return false;
  const [hora, minuto] = solicitud.franjaFin.split(':').map(Number);
  const fechaEvento = new Date(solicitud.fecha);
  fechaEvento.setUTCHours(hora, minuto, 0, 0);
  return new Date() > fechaEvento;
};

module.exports = { esEventoRealizado };
