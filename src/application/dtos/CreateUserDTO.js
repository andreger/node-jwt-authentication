class CreateUserDTO {
  constructor(email, password) {
    this.email = email;
    this.password = password;
  }

  static fromRequest(req) {
    const { email, password } = req.body;
    return new CreateUserDTO(email, password);
  }

  validate() {
    const errors = [];

    if (!this.email) {
      errors.push('Email is required');
    } else if (!this.isValidEmail(this.email)) {
      errors.push('Email must be valid');
    }

    if (!this.password) {
      errors.push('Password is required');
    } else if (this.password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    return errors;
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

module.exports = CreateUserDTO;