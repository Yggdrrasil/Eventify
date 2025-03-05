import React, { useEffect, useState } from 'react';
import InscribirEvento from '../components/InscribirEvento';
import CommentForm from '../components/CommentForm';
import CommentList from '../components/CommentList';

function Events() {
  const [eventos, setEventos] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:3001/eventos', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener los eventos');
        }

        const data = await response.json();
        setEventos(data);
      } catch (error) {
        console.error(error);
        setError(error.message);
      }
    };

    fetchEvents();
  }, []);

  const getUserIdFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id; // Asegúrate de que el payload contenga el ID del usuario
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return null;
    }
  };

  const userId = getUserIdFromToken();

  return (
    <div className="events-page py-5">
      <div className="container">
        <h2 className="mb-4 text-center text-primary">Eventos Disponibles</h2>
        {error && <p className="alert alert-danger">{error}</p>}
        {eventos.length === 0 && !error ? (
          <p className="text-center text-secondary">No hay eventos disponibles.</p>
        ) : (
          <div className="row">
            {eventos.map((evento) => {
              const esCreador = userId === evento.usuarioId;
              return (
                <div key={evento.id} className="col-md-6 mb-4">
                  <div className="card shadow-sm h-100">
                    <div className="card-body">
                      <h5 className="card-title text-primary">{evento.nombre}</h5>
                      <p className="card-text text-secondary">
                        {evento.descripcion.length > 100
                          ? `${evento.descripcion.substring(0, 100)}...`
                          : evento.descripcion}
                      </p>
                      <p className="card-text">
                        <strong>Fecha:</strong> {new Date(evento.fecha).toLocaleDateString()}
                      </p>
                      <p className="card-text">
                        <strong>Ubicación:</strong> {evento.ubicacion}
                      </p>
                      <div className="d-flex justify-content-between align-items-center">
                        <InscribirEvento eventoId={evento.id} esCreador={esCreador} />
                        {esCreador && (
                          <span className="badge bg-success text-light">Organizador</span>
                        )}
                      </div>
                    </div>
                    <div className="card-footer">
                      <h6 className="text-secondary">Comentarios</h6>
                      <CommentList eventoId={evento.id} />
                      <CommentForm
                        eventoId={evento.id}
                        onCommentAdded={() => {
                          // Recargar comentarios después de agregar uno nuevo
                          setEventos((prev) =>
                            prev.map((ev) =>
                              ev.id === evento.id ? { ...ev } : ev
                            )
                          );
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Events;
