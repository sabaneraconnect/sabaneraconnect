import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/common/Layout';
import Inicio from './pages/Inicio';
import RegistroBanda from './pages/auth/RegistroBanda';
import RegistroOrganizador from './pages/auth/RegistroOrganizador';
import Login from './pages/auth/Login';
import RecuperarContrasena from './pages/auth/RecuperarContrasena';
import NuevaContrasena from './pages/auth/NuevaContrasena';
import PerfilBanda from './pages/banda/PerfilBanda';
import EditarPerfil from './pages/banda/EditarPerfil';
import BuscarBandas from './pages/busqueda/BuscarBandas';
import NuevaSolicitud from './pages/solicitudes/NuevaSolicitud';
import DetalleSolicitud from './pages/solicitudes/DetalleSolicitud';
import SolicitudesEnviadas from './pages/solicitudes/SolicitudesEnviadas';
import SolicitudesRecibidas from './pages/solicitudes/SolicitudesRecibidas';
import Terminos from './pages/legal/Terminos';
import PoliticaPrivacidad from './pages/legal/PoliticaPrivacidad';
import PoliticaPagos from './pages/legal/PoliticaPagos';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/registro/banda" element={<RegistroBanda />} />
          <Route path="/registro/organizador" element={<RegistroOrganizador />} />
          <Route path="/login" element={<Login />} />
          <Route path="/recuperar-contrasena" element={<RecuperarContrasena />} />
          <Route path="/nueva-contrasena" element={<NuevaContrasena />} />
          <Route path="/banda/:id" element={<PerfilBanda />} />
          <Route path="/banda/:id/editar" element={<EditarPerfil />} />
          <Route path="/bandas/buscar" element={<BuscarBandas />} />
          <Route path="/solicitudes/nueva/:bandaId" element={<NuevaSolicitud />} />
          <Route path="/solicitudes/enviadas" element={<SolicitudesEnviadas />} />
          <Route path="/solicitudes/recibidas" element={<SolicitudesRecibidas />} />
          <Route path="/solicitudes/:id" element={<DetalleSolicitud />} />
          <Route path="/legal/terminos" element={<Terminos />} />
          <Route path="/legal/privacidad" element={<PoliticaPrivacidad />} />
          <Route path="/legal/pagos" element={<PoliticaPagos />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
