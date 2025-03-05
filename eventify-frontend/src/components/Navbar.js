import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function AppNavbar({ isAuthenticated, onLogout }) {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchUnreadCount = async () => {
        try {
          const response = await fetch('http://localhost:3001/notificaciones', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            const unread = data.filter((notif) => !notif.leida).length;
            setUnreadCount(unread);
          }
        } catch (error) {
          console.error('Error al obtener el contador de notificaciones:', error);
        }
      };

      fetchUnreadCount();
    }
  }, [isAuthenticated]);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand" to="/">Eventify</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/">Inicio</Link>
            </li>
            {!isAuthenticated && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Register</Link>
                </li>
              </>
            )}
            {isAuthenticated && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/events">Eventos</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/EventForm">Crear Evento</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/notifications">
                    Notificaciones {unreadCount > 0 && `(${unreadCount})`}
                  </Link>
                </li>
                <li className="nav-item">
                  <button className="nav-link btn btn-link" onClick={onLogout}>
                    Cerrar Sesión
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default AppNavbar;
