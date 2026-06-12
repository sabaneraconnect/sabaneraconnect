import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

function Inicio() {
  return <h1>SabaneraConnect</h1>;
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