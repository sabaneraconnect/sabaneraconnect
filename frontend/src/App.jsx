import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import api from './services/api';
import './App.css';

function Inicio() {
  const [mensaje, setMensaje] = useState('Cargando...');

  useEffect(() => {
    api.get('/')
      .then(response => setMensaje(response.data.message))
      .catch(() => setMensaje('Error al conectar con el backend.'));
  }, []);

  return <h1>{mensaje}</h1>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inicio />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;