const bcrypt = require('bcrypt');

class User {
  constructor(id, email, password, createdAt = null, updatedAt = null) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  // Validation methods
  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validatePassword(password) {
    // Password must be at least 8 characters long
    return password && password.length >= 8;
  }

  // Instance validation
  isValid() {
    return User.validateEmail(this.email) && User.validatePassword(this.password);
  }

  // Password encryption
  async hashPassword() {
    if (this.password) {
      const saltRounds = 10;
      this.password = await bcrypt.hash(this.password, saltRounds);
    }
  }

  // Password verification
  async verifyPassword(plainPassword) {
    return await bcrypt.compare(plainPassword, this.password);
  }

  // Convert to JSON (exclude password for security)
  toJSON() {
    return {
      id: this.id,
      email: this.email,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  // Factory method to create user from plain data
  static async create(email, password) {
    const user = new User(null, email, password);
    
    if (!user.isValid()) {
      throw new Error('Invalid user data');
    }

    await user.hashPassword();
    return user;
  }

  // Factory method to create user from database data
  static fromDatabase(data) {
    return new User(
      data.id,
      data.email,
      data.password,
      data.createdAt,
      data.updatedAt
    );
  }
}

module.exports = User;