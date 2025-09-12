const { DataTypes } = require('sequelize');
const { sequelize } = require('../connection');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
      notEmpty: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [8, 255]
    }
  }
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  hooks: {
    beforeCreate: async (user) => {
      // Password should already be hashed by the domain entity
      // This is just a safety check
      if (user.password && !user.password.startsWith('$2b$')) {
        throw new Error('Password must be hashed before saving');
      }
    }
  }
});

module.exports = User;