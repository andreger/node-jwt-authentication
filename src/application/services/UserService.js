const User = require('../../domain/entities/User');
const CreateUserDTO = require('../dtos/CreateUserDTO');
const UpdateUserDTO = require('../dtos/UpdateUserDTO');

class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async createUser(createUserDTO) {
    // Validate DTO
    const validationErrors = createUserDTO.validate();
    if (validationErrors.length > 0) {
      throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
    }

    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(createUserDTO.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Create domain entity
    const user = await User.create(createUserDTO.email, createUserDTO.password);

    // Save to repository
    const savedUser = await this.userRepository.create(user);
    return savedUser.toJSON();
  }

  async getUserById(id) {
    if (!id || isNaN(id)) {
      throw new Error('Invalid user ID');
    }

    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    return user.toJSON();
  }

  async getUserByEmail(email) {
    if (!email) {
      throw new Error('Email is required');
    }

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    return user.toJSON();
  }

  async getAllUsers() {
    const users = await this.userRepository.findAll();
    return users.map(user => user.toJSON());
  }

  async updateUser(id, updateUserDTO) {
    if (!id || isNaN(id)) {
      throw new Error('Invalid user ID');
    }

    // Validate DTO
    const validationErrors = updateUserDTO.validate();
    if (validationErrors.length > 0) {
      throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
    }

    // Check if user exists
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new Error('User not found');
    }

    // Check if email is being changed and if it already exists
    if (updateUserDTO.email && updateUserDTO.email !== existingUser.email) {
      const emailExists = await this.userRepository.existsByEmail(updateUserDTO.email);
      if (emailExists) {
        throw new Error('User with this email already exists');
      }
    }

    // Prepare update data
    const updateData = updateUserDTO.toUpdateData();

    // Hash password if it's being updated
    if (updateData.password) {
      const tempUser = new User(null, null, updateData.password);
      await tempUser.hashPassword();
      updateData.password = tempUser.password;
    }

    // Update user
    const updatedUser = await this.userRepository.update(id, updateData);
    return updatedUser.toJSON();
  }

  async deleteUser(id) {
    if (!id || isNaN(id)) {
      throw new Error('Invalid user ID');
    }

    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    await this.userRepository.delete(id);
    return { message: 'User deleted successfully' };
  }

  async authenticateUser(email, password) {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await user.verifyPassword(password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    return user.toJSON();
  }
}

module.exports = UserService;