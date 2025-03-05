const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Inscripcion = sequelize.define('Inscripcion', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true, // 
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuarios',
      key: 'id'
    }
  },
  eventoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'eventos',
      key: 'id'
    }
  },
  fecha_inscripcion: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'inscripciones',
  indexes: [
    {
      unique: true,
      fields: ['usuarioId', 'eventoId']
    }
  ]
});

module.exports = Inscripcion;
