// Dependencias
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('./middlewares/authMiddleware');
const Usuario = require('./models/Usuario');
const Evento = require('./models/Evento');
const Inscripcion = require('./models/Inscripcion');
const Comentario = require('./models/Comentario');
const Notificacion = require('./models/Notificacion');



// Relación entre Usuario y Evento
Usuario.hasMany(Evento, { foreignKey: 'usuarioId', onDelete: 'CASCADE' });
Evento.belongsTo(Usuario, { foreignKey: 'usuarioId' });

// Relación muchos-a-muchos entre Usuario y Evento a través de Inscripcion
Usuario.belongsToMany(Evento, { through: Inscripcion, foreignKey: 'usuarioId' });
Evento.belongsToMany(Usuario, { through: Inscripcion, foreignKey: 'eventoId' });


// Relación entre Usuario y Comentario
Usuario.hasMany(Comentario, { foreignKey: 'usuarioId', onDelete: 'CASCADE' });
Comentario.belongsTo(Usuario, { foreignKey: 'usuarioId' });

// Relación entre Evento y Comentario
Evento.hasMany(Comentario, { foreignKey: 'eventoId', onDelete: 'CASCADE' });
Comentario.belongsTo(Evento, { foreignKey: 'eventoId' });

// Relación entre Usuario y Notificacion
Usuario.hasMany(Notificacion, { foreignKey: 'usuarioId', onDelete: 'CASCADE' });
Notificacion.belongsTo(Usuario, { foreignKey: 'usuarioId' });

// Inicializar Express
const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(express.json());

// Ruta inicial
app.get('/', (req, res) => {
  res.send('Servidor funcionando correctamente');
});

// Conexión a la base de datos y sincronización
async function syncDatabase() {
    try {
      await sequelize.authenticate();
      console.log('Conexión exitosa a la base de datos');
  
      // Sincronización en el orden correcto para evitar dependencias cruzadas
      await Usuario.sync({ alter: true });   // Luego Usuarios
      await Evento.sync({ alter: true });    // Luego Eventos
      await Inscripcion.sync({ alter: true }); // Luego Inscripciones
      await Comentario.sync({ alter: true }); // Finalmente Comentarios
      await Notificacion.sync({ alter: true }); // Notificaciones
  
      console.log('Base de datos sincronizada');
  
      // Iniciar el servidor
      app.listen(PORT, () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`);
      });
    } catch (err) {
      console.error('Error al conectar o sincronizar la base de datos:', err);
    }
  }
  
  syncDatabase();

  /* ====================== RUTAS DE AUTENTICACION ====================== */

  // Registro de usuarios (POST /register)

  app.post('/register', async (req, res) => {
    try {
      const { nombre, email, password, tipo_usuario } = req.body;
  
      // Verificar si el usuario ya existe
      const existingUser = await Usuario.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'El usuario ya existe' });
      }
  
      // Hash de la contraseña antes de almacenarla
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Crear nuevo usuario
      const usuario = await Usuario.create({ nombre, email, password: hashedPassword, tipo_usuario });
      res.status(201).json(usuario);
    } catch (error) {
      res.status(500).json({ error: 'Error al registrar el usuario' });
    }
  });
  
  // Inicio de sesión (POST /login)
  app.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Buscar al usuario por su email
      const usuario = await Usuario.findOne({ where: { email } });
      if (!usuario) {
        return res.status(400).json({ error: 'Credenciales incorrectas' });
      }
  
      // Comparar el password ingresado con el almacenado (encriptado)
      const isPasswordValid = await bcrypt.compare(password, usuario.password);
      if (!isPasswordValid) {
        return res.status(400).json({ error: 'Credenciales incorrectas' });
      }
  
      // Generar un token JWT
      const token = jwt.sign({ id: usuario.id }, 'secret_key', { expiresIn: '1h' });
      res.json({ token });
    } catch (error) {
      res.status(500).json({ error: 'Error en el inicio de sesión' });
    }
  })
  
  // Obtener todos los usuarios (GET /usuarios)
  app.get('/usuarios', authMiddleware, async (req, res) => {
    try {
      const usuarios = await Usuario.findAll();
      res.status(200).json(usuarios);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
  });
  
  // Obtener un usuario por ID (GET /usuarios/:id)
  app.get('/usuarios/:id', authMiddleware, async (req, res) => {
    try {
      const usuario = await Usuario.findByPk(req.params.id);
      if (usuario) {
        res.status(200).json(usuario);
      } else {
        res.status(404).json({ error: 'Usuario no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el usuario' });
    }
  });
  
  // Actualizar un usuario por ID (PUT /usuarios/:id)
  app.put('/usuarios/:id', authMiddleware, async (req, res) => {
    try {
      const { nombre, email, password, tipo_usuario } = req.body;
      const usuario = await Usuario.findByPk(req.params.id);
  
      if (usuario) {
        await usuario.update({ nombre, email, password, tipo_usuario });
        res.status(200).json(usuario);
      } else {
        res.status(404).json({ error: 'Usuario no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar el usuario' });
    }
  });
  
  // Eliminar un usuario por ID (DELETE /usuarios/:id)
  app.delete('/usuarios/:id', authMiddleware, async (req, res) => {
    try {
      const usuario = await Usuario.findByPk(req.params.id);
  
      if (usuario) {
        await usuario.destroy();
        res.status(200).json({ message: 'Usuario eliminado' });
      } else {
        res.status(404).json({ error: 'Usuario no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar el usuario' });
    }
  });

    /* ====================== RUTAS DE EVENTOS ====================== */


    // Crear un evento (POST /eventos)
    app.post('/eventos', authMiddleware, async (req, res) => {
    try {
      const { nombre, descripcion, fecha, ubicacion, categoriaId } = req.body;
  
      const evento = await Evento.create({
        nombre,
        descripcion,
        fecha,
        ubicacion,
        usuarioId: req.user.id,
        categoriaId
      });
  
      res.status(201).json(evento);
    } catch (error) {
        console.error("Detalles del error al crear el evento:", error);
        res.status(500).json({ error: 'Error al crear el evento', details: error.message });
      }
    });
  
  // Obtener todos los eventos (GET /eventos)
  app.get('/eventos', authMiddleware, async (req, res) => {
    console.log(req.headers);
    try {
      const eventos = await Evento.findAll();
      res.status(200).json(eventos);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los eventos' });
    }
  });
  
  // Obtener un evento por ID (GET /eventos/:id)
  app.get('/eventos/:id', authMiddleware, async (req, res) => {
    try {
      const evento = await Evento.findByPk(req.params.id);
      if (evento) {
        res.status(200).json(evento);
      } else {
        res.status(404).json({ error: 'Evento no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el evento' });
    }
  });
  
  // Actualizar un evento por ID (PUT /eventos/:id)
  app.put('/eventos/:id', authMiddleware, async (req, res) => {
    try {
      const { nombre, descripcion, fecha, ubicacion, categoriaId } = req.body;
      const evento = await Evento.findByPk(req.params.id);
  
      if (evento && evento.usuarioId === req.user.id) {
        await evento.update({ nombre, descripcion, fecha, ubicacion, categoriaId });
        res.status(200).json(evento);
      } else {
        res.status(404).json({ error: 'Evento no encontrado o no tienes permiso' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar el evento' });
    }
  });
  
// Eliminar un evento por ID (DELETE /eventos/:id)
app.delete('/eventos/:id', authMiddleware, async (req, res) => {
  try {
    // Encontrar el evento por ID
    const evento = await Evento.findByPk(req.params.id);

    // Verificar si el evento existe y si el usuario autenticado es el creador
    if (!evento || evento.usuarioId !== req.user.id) {
      return res.status(404).json({ error: 'Evento no encontrado o no tienes permiso' });
    }

    // Obtener todas las inscripciones asociadas al evento
    const inscripciones = await Inscripcion.findAll({ where: { eventoId: evento.id } });

    // Crear notificaciones para los usuarios inscritos
    for (const inscripcion of inscripciones) {
      await Notificacion.create({
        tipo: 'Cancelación',
        contenido: `El evento "${evento.nombre}" ha sido cancelado.`,
        usuarioId: inscripcion.usuarioId, // ID de cada usuario inscrito
      });
    }

    // Eliminar el evento
    await evento.destroy();

    res.status(200).json({ message: 'Evento eliminado y notificaciones enviadas' });
  } catch (error) {
    console.error('Error al eliminar el evento:', error);
    res.status(500).json({ error: 'Error al eliminar el evento' });
  }
});


  /* ====================== RUTAS DE INSCRIPCIONES ====================== */

  // Crear una inscripción (POST /inscripciones)
app.post('/inscripciones', authMiddleware, async (req, res) => {
  try {
    const { eventoId } = req.body;

    // Verificar si el evento existe
    const evento = await Evento.findByPk(eventoId);
    if (!evento) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }

    // Verificar si el usuario ya está inscrito en el evento
    const inscripcionExistente = await Inscripcion.findOne({
      where: {
        usuarioId: req.user.id,
        eventoId: eventoId,
      },
    });

    if (inscripcionExistente) {
      return res.status(400).json({ error: 'Ya estás inscrito en este evento' });
    }

    // Crear la inscripción
    const inscripcion = await Inscripcion.create({
      usuarioId: req.user.id,
      eventoId,
      fecha_inscripcion: new Date(),
    });

    // Crear una notificación para el creador del evento
    const creador = await Usuario.findByPk(evento.usuarioId); // Verificar que el creador existe
    if (creador) {
      await Notificacion.create({
        tipo: 'Inscripción',
        contenido: `Un nuevo usuario  se ha inscrito en tu evento "${evento.nombre}"`,
        usuarioId: evento.usuarioId, // ID del creador del evento
      });
    }

    res.status(201).json(inscripcion);
  } catch (error) {
    console.error('Error al inscribirse en el evento:', error);
    res.status(500).json({ error: 'Error al inscribirse en el evento' });
  }
});
  
  // Obtener todas las inscripciones del usuario (GET /inscripciones)
  app.get('/inscripciones', authMiddleware, async (req, res) => {
    try {
      const inscripciones = await Inscripcion.findAll({
        where: { usuarioId: req.user.id }
      });
      res.status(200).json(inscripciones);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener las inscripciones' });
    }
  });

  // Obtener si el usuario está inscrito en un evento específico (GET /inscripciones/:eventoId)
  app.get('/inscripciones/:eventoId', authMiddleware, async (req, res) => {
    try {
      // Buscar si existe una inscripción del usuario autenticado al evento especificado
      const inscripcion = await Inscripcion.findOne({
        where: {
          usuarioId: req.user.id,
          eventoId: req.params.eventoId
        }
      });
  
      // Si no existe la inscripción, devolver inscrito como false
      if (!inscripcion) {
        return res.status(200).json({ inscrito: false });
      }
  
      // Si existe la inscripción, devolver inscrito como true y el id de la inscripción
      res.status(200).json({ inscrito: true, inscripcionId: inscripcion.id });
    } catch (error) {
      console.error('Error al verificar la inscripción:', error);
      res.status(500).json({ error: 'Error al verificar la inscripción' });
    }
  });
  
  
  // Eliminar una inscripción (DELETE /inscripciones/:id)
  app.delete('/inscripciones/:id', authMiddleware, async (req, res) => {
    try {
      const inscripcion = await Inscripcion.findOne({
        where: {
          id: req.params.id,
          usuarioId: req.user.id
        }
      });
  
      if (!inscripcion) {
        return res.status(404).json({ error: 'Inscripción no encontrada o no tienes permiso para eliminarla' });
      }
  
      await inscripcion.destroy();
      res.status(200).json({ message: 'Inscripción eliminada' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar la inscripción' });
    }
  });
  
    
  
 /* ====================== RUTAS DE COMENTARIOS ====================== */

// Crear un comentario (POST /comentarios)
app.post('/comentarios', authMiddleware, async (req, res) => {
  try {
    const { contenido, eventoId } = req.body;

    // Verificar que el evento existe
    const evento = await Evento.findByPk(eventoId);
    if (!evento) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }

    // Crear el comentario
    const comentario = await Comentario.create({
      contenido,
      usuarioId: req.user.id,
      eventoId,
    });

    // Obtener el nombre del usuario que realiza el comentario
    const usuario = await Usuario.findByPk(req.user.id, {
      attributes: ['nombre']
    });

    // Crear una notificación para el creador del evento si no es el mismo usuario
    if (req.user.id !== evento.usuarioId) {
      await Notificacion.create({
        tipo: 'Nuevo Comentario',
        contenido: `El usuario "${usuario?.nombre || 'Usuario desconocido'}" comentó en tu evento "${evento.nombre}"`,
        usuarioId: evento.usuarioId, // Asignar la notificación al creador del evento
      });
    }

    // Responder con el comentario creado y el nombre del usuario
    res.status(201).json({
      id: comentario.id,
      contenido: comentario.contenido,
      nombreUsuario: usuario?.nombre || 'Usuario desconocido',
    });
  } catch (error) {
    console.error('Error al crear el comentario:', error);
    res.status(500).json({ error: 'Error al crear el comentario' });
  }
});


// Obtener comentarios de un evento específico (GET /comentarios/evento/:eventoId)
app.get('/comentarios/evento/:eventoId', authMiddleware, async (req, res) => {
  try {
    const comentarios = await Comentario.findAll({
      where: { eventoId: req.params.eventoId },
      include: {
        model: Usuario,
        attributes: ['nombre'], // Incluir el nombre del usuario
      },
    });

    const comentariosConNombre = comentarios.map((comentario) => ({
      id: comentario.id,
      contenido: comentario.contenido,
      nombreUsuario: comentario.Usuario?.nombre || 'Usuario desconocido',
    }));

    res.status(200).json(comentariosConNombre);
  } catch (error) {
    console.error('Error al obtener los comentarios:', error);
    res.status(500).json({ error: 'Error al obtener los comentarios' });
  }
});

// Obtener un comentario por ID (GET /comentarios/:id)
app.get('/comentarios/:id', authMiddleware, async (req, res) => {
  try {
    const comentario = await Comentario.findByPk(req.params.id);
    if (comentario) {
      res.status(200).json(comentario);
    } else {
      res.status(404).json({ error: 'Comentario no encontrado' });
    }
  } catch (error) {
    console.error('Error al obtener el comentario:', error);
    res.status(500).json({ error: 'Error al obtener el comentario' });
  }
});

// Actualizar un comentario por ID (PUT /comentarios/:id)
app.put('/comentarios/:id', authMiddleware, async (req, res) => {
  try {
    const { contenido } = req.body;
    const comentario = await Comentario.findByPk(req.params.id);

    if (comentario && comentario.usuarioId === req.user.id) {
      await comentario.update({ contenido });
      res.status(200).json(comentario);
    } else {
      res.status(404).json({ error: 'Comentario no encontrado o no tienes permiso para actualizarlo' });
    }
  } catch (error) {
    console.error('Error al actualizar el comentario:', error);
    res.status(500).json({ error: 'Error al actualizar el comentario' });
  }
});

// Eliminar un comentario (DELETE /comentarios/:id)
app.delete('/comentarios/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar el comentario
    const comentario = await Comentario.findOne({
      where: {
        id,
        usuarioId: req.user.id, // Solo permitir eliminar si es el autor
      },
    });

    if (!comentario) {
      return res.status(404).json({ error: 'Comentario no encontrado o no tienes permiso para eliminarlo' });
    }

    // Eliminar el comentario
    await comentario.destroy();
    res.status(200).json({ message: 'Comentario eliminado' });
  } catch (error) {
    console.error('Error al eliminar el comentario:', error);
    res.status(500).json({ error: 'Error al eliminar el comentario' });
  }
});

  
/* ====================== RUTAS DE NOTIFICACIONES ====================== */

// Crear una notificación (POST /notificaciones)
app.post('/notificaciones', authMiddleware, async (req, res) => {
  try {
    const { usuarioId, tipo, contenido } = req.body;

    // Verificar si el usuario existe
    const usuario = await Usuario.findByPk(usuarioId);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Crear la notificación
    const notificacion = await Notificacion.create({ usuarioId, tipo, contenido });
    res.status(201).json(notificacion);
  } catch (error) {
    console.error('Error al crear la notificación:', error);
    res.status(500).json({ error: 'Error al crear la notificación' });
  }
});

// Obtener todas las notificaciones de un usuario (GET /notificaciones)
app.get('/notificaciones', authMiddleware, async (req, res) => {
  try {
    const notificaciones = await Notificacion.findAll({
      where: { usuarioId: req.user.id },
      order: [['createdAt', 'DESC']], // Ordenar por fecha de creación
    });
    res.status(200).json(notificaciones);
  } catch (error) {
    console.error('Error al obtener las notificaciones:', error);
    res.status(500).json({ error: 'Error al obtener las notificaciones' });
  }
});

// Obtener una notificación por ID (GET /notificaciones/:id)
app.get('/notificaciones/:id', authMiddleware, async (req, res) => {
  try {
    const notificacion = await Notificacion.findOne({
      where: {
        id: req.params.id,
        usuarioId: req.user.id,
      },
    });

    if (!notificacion) {
      return res.status(404).json({ error: 'Notificación no encontrada o no tienes permiso para verla' });
    }

    res.status(200).json(notificacion);
  } catch (error) {
    console.error('Error al obtener la notificación:', error);
    res.status(500).json({ error: 'Error al obtener la notificación' });
  }
});

// Actualizar una notificación por ID (PUT /notificaciones/:id)
app.put('/notificaciones/:id', authMiddleware, async (req, res) => {
  try {
    const { contenido } = req.body; // Eliminar lógica de título si no es necesario
    const notificacion = await Notificacion.findOne({
      where: {
        id: req.params.id,
        usuarioId: req.user.id,
      },
    });

    if (!notificacion) {
      return res.status(404).json({ error: 'Notificación no encontrada o no tienes permiso para actualizarla' });
    }

    await notificacion.update({ contenido });
    res.status(200).json(notificacion);
  } catch (error) {
    console.error('Error al actualizar la notificación:', error);
    res.status(500).json({ error: 'Error al actualizar la notificación' });
  }
});

// Eliminar una notificación por ID (DELETE /notificaciones/:id)
app.delete('/notificaciones/:id', authMiddleware, async (req, res) => {
  try {
    const notificacion = await Notificacion.findOne({
      where: {
        id: req.params.id,
        usuarioId: req.user.id,
      },
    });

    if (!notificacion) {
      return res.status(404).json({ error: 'Notificación no encontrada o no tienes permiso para eliminarla' });
    }

    await notificacion.destroy();
    res.status(200).json({ message: 'Notificación eliminada' });
  } catch (error) {
    console.error('Error al eliminar la notificación:', error);
    res.status(500).json({ error: 'Error al eliminar la notificación' });
  }
});

// Marcar una notificación como leída (PATCH /notificaciones/:id/leida)
app.patch('/notificaciones/:id/leida', authMiddleware, async (req, res) => {
  try {
    const notificacion = await Notificacion.findOne({
      where: {
        id: req.params.id,
        usuarioId: req.user.id,
      },
    });

    if (!notificacion) {
      return res.status(404).json({ error: 'Notificación no encontrada o no tienes permiso para actualizarla' });
    }

    await notificacion.update({ leida: true });
    res.status(200).json(notificacion);
  } catch (error) {
    console.error('Error al marcar la notificación como leída:', error);
    res.status(500).json({ error: 'Error al marcar la notificación como leída' });
  }
});


module.exports = app;
