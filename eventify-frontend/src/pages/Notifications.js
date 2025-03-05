import React, { useState, useEffect } from 'react';

function Notifications() {
  const [notificaciones, setNotificaciones] = useState([]);
  const [error, setError] = useState(null);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('http://localhost:3001/notificaciones', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener las notificaciones');
      }

      const data = await response.json();
      setNotificaciones(data);
    } catch (error) {
      console.error('Error al obtener las notificaciones:', error);
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/notificaciones/${id}/leida`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al marcar la notificación como leída');
      }

      setNotificaciones((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, leida: true } : notif
        )
      );
    } catch (error) {
      console.error('Error al marcar la notificación como leída:', error);
      setError('Error al marcar la notificación como leída');
    }
  };

  const deleteNotification = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/notificaciones/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al eliminar la notificación');
      }

      setNotificaciones((prev) => prev.filter((notif) => notif.id !== id));
    } catch (error) {
      console.error('Error al eliminar la notificación:', error);
      setError('Error al eliminar la notificación');
    }
  };

  return (
    <div className="notifications-page">
      <h2>Mis Notificaciones</h2>
      {error && <p className="error">{error}</p>}
      <ul className="notifications-list">
        {notificaciones.map((notificacion) => (
          <li
            key={notificacion.id}
            className={`notification-item ${notificacion.leida ? 'read' : 'unread'}`}
          >
            <h4>{notificacion.tipo}</h4>
            <p>{notificacion.contenido}</p>
            <div>
              {!notificacion.leida && (
                <button
                  className="btn btn-sm btn-success"
                  onClick={() => markAsRead(notificacion.id)}
                >
                  Marcar como leída
                </button>
              )}
              <button
                className="btn btn-sm btn-danger"
                onClick={() => deleteNotification(notificacion.id)}
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Notifications;
