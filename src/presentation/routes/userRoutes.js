const express = require('express');
const UserController = require('../controllers/UserController');
const SequelizeUserRepository = require('../../infrastructure/repositories/SequelizeUserRepository');
const UserService = require('../../application/services/UserService');

const router = express.Router();

// Initialize dependencies
const userRepository = new SequelizeUserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

// Routes
router.post('/', userController.createUser.bind(userController));
router.get('/', userController.getAllUsers.bind(userController));
router.get('/email', userController.getUserByEmail.bind(userController));
router.post('/authenticate', userController.authenticateUser.bind(userController));
router.get('/:id', userController.getUserById.bind(userController));
router.put('/:id', userController.updateUser.bind(userController));
router.delete('/:id', userController.deleteUser.bind(userController));

module.exports = router;