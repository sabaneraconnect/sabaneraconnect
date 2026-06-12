import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RegistroBanda from './pages/auth/RegistroBanda';
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;