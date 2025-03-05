import React from 'react';
import EventForm from '../components/EventForm';

function CreateEvent() {
  const handleCreateEvent = async (newEvent) => {
    try {
      const response = await fetch('http://localhost:3001/eventos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newEvent),
      });

      if (!response.ok) {
        throw new Error('Error al crear el evento');
      }

      window.location.reload();
    } catch (error) {
      console.error(error);
      alert('Hubo un error al crear el evento');
    }
  };

  return (
    <div className="create-event-page">
      <h2>Crear un Nuevo Evento</h2>
      <EventForm onSubmit={handleCreateEvent} />
    </div>
  );
}

export default CreateEvent;
