import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Banner from './components/Banner';
import Formulario from './components/Formulario';
import Rodape from './components/Rodape';
import Ticket from './components/Ticket';

function App() {
  return (
    <Router>
      <div className="App">
        <Banner />
        <Routes>
          <Route path="/" element={<Formulario />} />
          <Route path="/ticket" element={<Ticket />} />
        </Routes>
        <Rodape />
      </div>
    </Router>
  );
}

export default App;
