// src/components/Login.js
import React, { useState } from 'react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        window.location.href = '/'; // Esto recargará la página actual automáticamente.
        // Guardar el token JWT para futuras solicitudes
        localStorage.setItem('token', data.token);
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      alert('Error al iniciar sesión');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Inicio de Sesión</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Contraseña</label>
          <input
            type="password"
            name="password"
            className="form-control"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3">
          Iniciar Sesión
        </button>
      </form>
    </div>
  );
};

export default Login;
