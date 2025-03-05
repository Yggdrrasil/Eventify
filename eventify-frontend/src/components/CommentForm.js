import React, { useState } from 'react';

function CommentForm({ eventoId, onCommentAdded }) {
  const [contenido, setContenido] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/comentarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ contenido, eventoId }),
      });

      if (!response.ok) {
        throw new Error('Error al añadir el comentario');
      }

      const comentario = await response.json();
      setContenido(''); // Limpiar el campo de texto tras enviar
      window.location.reload();
      if (onCommentAdded) {
        onCommentAdded(comentario); // Llamar al callback para actualizar la lista
      }
    } catch (error) {
      console.error('Hubo un error al añadir el comentario:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="comentario" className="form-label">Añadir un Comentario</label>
        <textarea
          id="comentario"
          className="form-control"
          value={contenido}
          onChange={(e) => setContenido(e.target.value)}
          placeholder="Escribe tu comentario aquí..."
          required
        />
      </div>
      <button type="submit" className="btn btn-primary">Enviar</button>
    </form>
  );
}

export default CommentForm;
