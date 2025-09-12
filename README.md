# User Management API with DDD Architecture

This project implements a User Management API using Domain-Driven Design (DDD) principles, Sequelize ORM, and bcrypt for password encryption.

## Project Structure

```
src/
├── domain/                    # Domain Layer
│   ├── entities/             # Domain entities
│   │   └── User.js          # User domain entity
│   └── repositories/        # Repository interfaces
│       └── UserRepository.js
├── infrastructure/           # Infrastructure Layer
│   ├── database/            # Database configuration
│   │   ├── config.js        # Database configuration
│   │   ├── connection.js    # Database connection
│   │   └── models/          # Sequelize models
│   │       └── User.js      # Sequelize User model
│   └── repositories/        # Repository implementations
│       └── SequelizeUserRepository.js
├── application/             # Application Layer
│   ├── services/            # Application services
│   │   └── UserService.js   # User business logic
│   └── dtos/               # Data Transfer Objects
│       ├── CreateUserDTO.js
│       └── UpdateUserDTO.js
└── presentation/           # Presentation Layer
    ├── controllers/         # Controllers
    │   └── UserController.js
    └── routes/             # Route definitions
        └── userRoutes.js
```

## Features

- ✅ User CRUD operations (Create, Read, Update, Delete)
- ✅ Password encryption using bcrypt
- ✅ Email validation
- ✅ Domain-Driven Design architecture
- ✅ Sequelize ORM with SQLite database
- ✅ Input validation and error handling
- ✅ RESTful API endpoints

## Installation

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp .env.example .env
```

3. Update the `.env` file with your configuration.

## Running the Application

### Development Mode
```bash
npm run devApp
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:3000` (or the port specified in your `.env` file).

## API Endpoints

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users` | Create a new user |
| GET | `/api/users` | Get all users |
| GET | `/api/users/:id` | Get user by ID |
| GET | `/api/users/email/:email` | Get user by email |
| PUT | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user |
| POST | `/api/users/authenticate` | Authenticate user |

### Health Check
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Server health check |

## API Examples

### Create User
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Get All Users
```bash
curl http://localhost:3000/api/users
```

### Get User by ID
```bash
curl http://localhost:3000/api/users/1
```

### Update User
```bash
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newemail@example.com"
  }'
```

### Delete User
```bash
curl -X DELETE http://localhost:3000/api/users/1
```

### Authenticate User
```bash
curl -X POST http://localhost:3000/api/users/authenticate \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

## Response Format

All API responses follow this format:

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

## Database Schema

### Users Table
| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT |
| email | STRING | NOT NULL, UNIQUE |
| password | STRING | NOT NULL |
| createdAt | DATETIME | NOT NULL |
| updatedAt | DATETIME | NOT NULL |

## Validation Rules

- **Email**: Must be a valid email format
- **Password**: Must be at least 8 characters long
- **Unique Email**: Each email can only be used once

## Security Features

- Passwords are hashed using bcrypt with salt rounds of 10
- Password field is excluded from JSON responses
- Input validation on all endpoints
- Error handling without exposing sensitive information

## DDD Architecture Benefits

1. **Separation of Concerns**: Each layer has a specific responsibility
2. **Testability**: Easy to unit test each layer independently
3. **Maintainability**: Changes in one layer don't affect others
4. **Scalability**: Easy to add new features or change implementations
5. **Domain Focus**: Business logic is centralized in the domain layer

## Development

The project uses:
- **Node.js** with **Express.js** for the web framework
- **Sequelize** as the ORM
- **SQLite** as the database (easily configurable for other databases)
- **bcrypt** for password hashing
- **dotenv** for environment configuration