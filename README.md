# Posts API with SQLite

This is a Node.js Express application with JWT authentication and SQLite database for managing posts.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Initialize the database:
   ```bash
   npm run init-db
   ```

3. Create a `.env` file with your JWT secrets:
   ```env
   ACCESS_TOKEN_SECRET=your_access_token_secret_here
   REFRESH_TOKEN_SECRET=your_refresh_token_secret_here
   ```

## Running the Application

- Start the main server (port 3000):
  ```bash
  npm run dev
  ```

- Start the auth server (port 4000):
  ```bash
  npm run devAuth
  ```

## Database

The application uses SQLite with a `posts` table that includes:
- `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
- `username` (TEXT NOT NULL)
- `title` (TEXT NOT NULL)
- `content` (TEXT)
- `created_at` (DATETIME DEFAULT CURRENT_TIMESTAMP)
- `updated_at` (DATETIME DEFAULT CURRENT_TIMESTAMP)

The initialization script (`initDatabase.js`) creates the table and populates it with sample data.

## API Endpoints

### Authentication (Port 4000)
- `POST /login` - Login and get tokens
- `POST /token` - Refresh access token
- `DELETE /logout` - Logout and invalidate refresh token

### Posts (Port 3000) - Requires Authentication
- `GET /posts` - Get posts for authenticated user
- `POST /posts` - Create a new post
- `GET /posts/all` - Get all posts (for testing)

## Database File

The SQLite database is stored as `database.sqlite` in the project root.