// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AppNavbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Events from './pages/Events';
import CreateEvent from './pages/CreateEvent';
import Notifications from './pages/Notifications';
import './styles.scss';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decodifica el token
        setIsAuthenticated(true);
        setUserRole(decodedToken.role); // Asigna el rol desde el token
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        handleLogout(); // Elimina cualquier token inválido
      }
    }
  }, []);

  const handleLogin = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decodifica el token
        setIsAuthenticated(true);
        setUserRole(decodedToken.role); // Asigna el rol al iniciar sesión
      } catch (error) {
        console.error('Error al decodificar el token al iniciar sesión:', error);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUserRole(null); // Restablece el estado del rol
  };

  return (
    <Router>
      <AppNavbar isAuthenticated={isAuthenticated} onLogout={handleLogout} userRole={userRole} />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/events" element={isAuthenticated ? <Events /> : <Home />} />
          <Route
            path="/EventForm"
            element={isAuthenticated  ? <CreateEvent /> : <Home />}
          />
          <Route path="/notifications" element={isAuthenticated ? <Notifications /> : <Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
