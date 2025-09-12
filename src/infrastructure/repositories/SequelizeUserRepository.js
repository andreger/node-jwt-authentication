const UserRepository = require('../../domain/repositories/UserRepository');
const User = require('../../domain/entities/User');
const SequelizeUser = require('../database/models/User');

class SequelizeUserRepository extends UserRepository {
  async create(user) {
    try {
      const sequelizeUser = await SequelizeUser.create({
        email: user.email,
        password: user.password
      });
      
      return User.fromDatabase(sequelizeUser.toJSON());
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new Error('User with this email already exists');
      }
      throw error;
    }
  }

  async findById(id) {
    try {
      const sequelizeUser = await SequelizeUser.findByPk(id);
      if (!sequelizeUser) {
        return null;
      }
      return User.fromDatabase(sequelizeUser.toJSON());
    } catch (error) {
      throw error;
    }
  }

  async findByEmail(email) {
    try {
      const sequelizeUser = await SequelizeUser.findOne({
        where: { email }
      });
      if (!sequelizeUser) {
        return null;
      }
      return User.fromDatabase(sequelizeUser.toJSON());
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      const sequelizeUsers = await SequelizeUser.findAll({
        order: [['createdAt', 'DESC']]
      });
      return sequelizeUsers.map(user => User.fromDatabase(user.toJSON()));
    } catch (error) {
      throw error;
    }
  }

  async update(id, userData) {
    try {
      const sequelizeUser = await SequelizeUser.findByPk(id);
      if (!sequelizeUser) {
        throw new Error('User not found');
      }

      await sequelizeUser.update(userData);
      return User.fromDatabase(sequelizeUser.toJSON());
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new Error('User with this email already exists');
      }
      throw error;
    }
  }

  async delete(id) {
    try {
      const sequelizeUser = await SequelizeUser.findByPk(id);
      if (!sequelizeUser) {
        throw new Error('User not found');
      }

      await sequelizeUser.destroy();
      return true;
    } catch (error) {
      throw error;
    }
  }

  async existsByEmail(email) {
    try {
      const count = await SequelizeUser.count({
        where: { email }
      });
      return count > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = SequelizeUserRepository;