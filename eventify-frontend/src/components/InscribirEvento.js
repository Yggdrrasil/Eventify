import React, { useState, useEffect } from 'react';

function InscribirEvento({ eventoId, esCreador }) {
  const [inscrito, setInscrito] = useState(false);
  const [inscripcionId, setInscripcionId] = useState(null);

  useEffect(() => {
    // Comprobar si el usuario ya está inscrito en el evento
    const verificarInscripcion = async () => {
      try {
        console.log('Verificando inscripción para evento:', eventoId);
        const response = await fetch(`http://localhost:3001/inscripciones/${eventoId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
        });
  
        if (response.ok) {
          const data = await response.json();
          if (data && data.inscrito) {
            setInscrito(true);
            setInscripcionId(data.inscripcionId); // Guardar el id de la inscripción
          } else {
            setInscrito(false);
            setInscripcionId(null);
          }
        } else {
          console.error('Error al verificar inscripción:', response.status);
        }
      } catch (error) {
        console.error('Error al verificar la inscripción', error);
      }
    };
  
    if (eventoId) {
      verificarInscripcion();
    }
  }, [eventoId]);
  

  const handleInscribir = async () => {
    try {
      console.log('Intentando inscribirse al evento:', eventoId);
      const response = await fetch('http://localhost:3001/inscripciones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ eventoId }),
      });

      if (!response.ok) {
        console.error('Error en la solicitud:', response.status, response.statusText);
        throw new Error('Error al inscribirse en el evento');
      }

      const data = await response.json();
      alert('Inscripción exitosa');
      setInscrito(true);
      setInscripcionId(data.id); // Guardar el id de la inscripción después de inscribirse
    } catch (error) {
      console.error('Hubo un error al inscribirse:', error);
      alert('Hubo un error al inscribirse en el evento');
    }
  };

  const handleAnularInscripcion = async () => {
    if (!inscripcionId) {
      console.error('No se puede anular inscripción porque no hay inscripcionId');
      alert('No se encontró la inscripción.');
      return;
    }

    try {
      console.log('Intentando anular inscripción con id:', inscripcionId);
      const response = await fetch(`http://localhost:3001/inscripciones/${inscripcionId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });

      if (!response.ok) {
        console.error('Error en la solicitud de eliminación:', response.status, response.statusText);
        throw new Error('Error al anular la inscripción en el evento');
      }

      alert('Inscripción anulada');
      setInscrito(false);
      setInscripcionId(null);
    } catch (error) {
      console.error('Hubo un error al anular la inscripción:', error);
      alert('Hubo un error al anular la inscripción en el evento');
    }
  };

  const handleEliminarEvento = async () => {
    try {
      console.log('Intentando eliminar evento:', eventoId);
      const response = await fetch(`http://localhost:3001/eventos/${eventoId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });

      if (!response.ok) {
        console.error('Error en la solicitud de eliminación del evento:', response.status, response.statusText);
        throw new Error('Error al eliminar el evento');
      }

      window.location.reload(); //refrescamos la pagina cuando el evento se borra
    } catch (error) {
      console.error('Hubo un error al eliminar el evento:', error);
      alert('Hubo un error al eliminar el evento');
    }
  };

  return (
    <>
      {esCreador && (
        <button className="btn btn-danger" onClick={handleEliminarEvento}>
          Eliminar Evento
        </button>
      )}
      {inscrito ? (
        <button className="btn btn-secondary" onClick={handleAnularInscripcion}>
          Anular Inscripción
        </button>
      ) : (
        <button className="btn btn-primary" onClick={handleInscribir}>
          Inscribirse al Evento
        </button>
      )}
    </>
  );
}

export default InscribirEvento;
