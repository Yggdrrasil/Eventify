import React, { useEffect, useState } from 'react';

function CommentList({ eventoId }) {
  const [comentarios, setComentarios] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComentarios = async () => {
      try {
        const response = await fetch(`http://localhost:3001/comentarios/evento/${eventoId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener los comentarios');
        }

        const data = await response.json();
        setComentarios(data);
      } catch (error) {
        console.error('Error al obtener los comentarios:', error);
        setError('Error al obtener los comentarios');
      }
    };

    fetchComentarios();
  }, [eventoId]);

  const handleDelete = async (comentarioId) => {
    try {
      const response = await fetch(`http://localhost:3001/comentarios/${comentarioId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el comentario');
      }

      setComentarios((prev) => prev.filter((comentario) => comentario.id !== comentarioId));
    } catch (error) {
      console.error('Hubo un error al eliminar el comentario:', error);
    }
  };

  return (
    <div>
      {error && <p>{error}</p>}
      {comentarios.length === 0 ? (
        <p>No hay comentarios aún.</p>
      ) : (
        <ul className="list-group">
          {comentarios.map((comentario) => (
            <li key={comentario.id} className="list-group-item">
              <strong>{comentario.nombreUsuario}:</strong> {comentario.contenido}
              <button
                className="btn btn-danger btn-sm float-end"
                onClick={() => handleDelete(comentario.id)}
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CommentList;
