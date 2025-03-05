const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Notificacion = sequelize.define('Notificacion', {
  tipo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contenido: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  leida: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuarios', // Nombre exacto de la tabla a la que hace referencia
      key: 'id',
    },
    onDelete: 'CASCADE', // Eliminar las notificaciones si el usuario se elimina
    onUpdate: 'CASCADE',
  },
}, {
  tableName: 'notificaciones', // Nombre de la tabla consistente con el nombre de la base de datos
  timestamps: true, // Asegúrate de que createdAt y updatedAt están habilitados
});

module.exports = Notificacion;
