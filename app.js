require('dotenv').config();

const express = require('express');
const { sequelize, testConnection } = require('./src/infrastructure/database/connection');
const userRoutes = require('./src/presentation/routes/userRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware (optional)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Routes
app.use('/api/users', userRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Initialize database and start server
const startServer = async () => {
  try {
    // Test database connection
    await testConnection();
    
    // Sync database (create tables if they don't exist)
    await sequelize.sync({ force: false });
    console.log('Database synchronized successfully');
    
    // Start server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
      console.log(`Users API: http://localhost:${PORT}/api/users`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;