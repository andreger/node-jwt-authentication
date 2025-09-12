class UpdateUserDTO {
  constructor(email, password) {
    this.email = email;
    this.password = password;
  }

  static fromRequest(req) {
    const { email, password } = req.body;
    return new UpdateUserDTO(email, password);
  }

  validate() {
    const errors = [];

    if (this.email && !this.isValidEmail(this.email)) {
      errors.push('Email must be valid');
    }

    if (this.password && this.password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    return errors;
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Return only the fields that are provided
  toUpdateData() {
    const updateData = {};
    if (this.email) updateData.email = this.email;
    if (this.password) updateData.password = this.password;
    return updateData;
  }
}

module.exports = UpdateUserDTO;