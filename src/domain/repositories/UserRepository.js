class UserRepository {
  async create(user) {
    throw new Error('Method must be implemented');
  }

  async findById(id) {
    throw new Error('Method must be implemented');
  }

  async findByEmail(email) {
    throw new Error('Method must be implemented');
  }

  async findAll() {
    throw new Error('Method must be implemented');
  }

  async update(id, userData) {
    throw new Error('Method must be implemented');
  }

  async delete(id) {
    throw new Error('Method must be implemented');
  }

  async existsByEmail(email) {
    throw new Error('Method must be implemented');
  }
}

module.exports = UserRepository;