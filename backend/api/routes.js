const express = require('express');
const router = express.Router();

// Import routes
const userRoutes = require('./src/user/route.user');
const taskRoutes = require('./src/task/route.task');
const authRoutes = require('./src/auth/route.auth');

// Use routes
router.use('/users', userRoutes);
router.use('/tasks', taskRoutes);
router.use('/auth', authRoutes);

module.exports = router;