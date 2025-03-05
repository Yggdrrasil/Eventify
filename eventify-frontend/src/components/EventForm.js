import React, { useState } from 'react';

function EventForm({ onSubmit }) {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState('');
  const [ubicacion, setUbicacion] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEvent = { nombre, descripcion, fecha, ubicacion };
    onSubmit(newEvent);
  };

  return (
    <div className="container my-5">
      <h2 className="text-center text-primary mb-4">Crear Nuevo Evento</h2>
      <form onSubmit={handleSubmit} className="shadow-lg p-4 rounded bg-white">
        <div className="mb-3">
          <label htmlFor="nombre" className="form-label fw-bold">
            Nombre del Evento
          </label>
          <input
            type="text"
            id="nombre"
            className="form-control"
            placeholder="Ingrese el nombre del evento"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="descripcion" className="form-label fw-bold">
            Descripción
          </label>
          <textarea
            id="descripcion"
            className="form-control"
            placeholder="Describa el evento"
            rows="4"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="fecha" className="form-label fw-bold">
            Fecha y Hora del Evento
          </label>
          <input
            type="datetime-local"
            id="fecha"
            className="form-control"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="ubicacion" className="form-label fw-bold">
            Ubicación
          </label>
          <input
            type="text"
            id="ubicacion"
            className="form-control"
            placeholder="Ingrese la ubicación del evento"
            value={ubicacion}
            onChange={(e) => setUbicacion(e.target.value)}
            required
          />
        </div>

        <div className="text-center">
          <button type="submit" className="btn btn-success btn-lg">
            Crear Evento
          </button>
        </div>
      </form>
    </div>
  );
}

export default EventForm;
