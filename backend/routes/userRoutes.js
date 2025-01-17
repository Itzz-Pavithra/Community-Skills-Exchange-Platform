const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const searchController = require('../controllers/searchController');

// User routes
router.post('/create', userController.createUser);
router.get('/current', userController.getCurrentUser);
router.get('/stats', userController.getUserStats);
router.get('/profile/:id', userController.getUserProfile);
router.put('/profile/update', userController.updateProfile);

// Search routes
router.get('/search', searchController.searchUsers);
router.get('/nearby', searchController.getNearbyUsers);

// Contact routes
router.post('/contact', userController.initiateContact);

// Stats and analytics
router.get('/analytics/skills', userController.getSkillsAnalytics);
router.post('/exchange/complete', userController.completeExchange);

module.exports = router;