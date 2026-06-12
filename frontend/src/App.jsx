import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RegistroBanda from './pages/auth/RegistroBanda';
import RegistroOrganizador from './pages/auth/RegistroOrganizador';
import Login from './pages/auth/Login';
import RecuperarContrasena from './pages/auth/RecuperarContrasena';
import NuevaContrasena from './pages/auth/NuevaContrasena';
import PerfilBanda from './pages/banda/PerfilBanda';
import EditarPerfil from './pages/banda/EditarPerfil';
import './App.css';

function Inicio() {
  return <h1>SabaneraConnect</h1>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/registro/banda" element={<RegistroBanda />} />
        <Route path="/registro/organizador" element={<RegistroOrganizador />} />
        <Route path="/login" element={<Login />} />
        <Route path="/recuperar-contrasena" element={<RecuperarContrasena />} />
        <Route path="/nueva-contrasena" element={<NuevaContrasena />} />
        <Route path="/banda/:id" element={<PerfilBanda />} />
        <Route path="/banda/:id/editar" element={<EditarPerfil />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;