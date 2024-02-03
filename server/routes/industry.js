const express = require('express');
const industryController = require('../controllers/industry');

// API Middleware
const verifyToken = require('../helpers/verifyToken')

// Router Initialisation
const router = express.Router();

// Routes

// GET user's name 
router.get('/getName', verifyToken, industryController.getName);

router.get('/getJobs', verifyToken, industryController.getJobs);

// POST - create a new job associated with a user
router.post('/createJob', verifyToken, industryController.createJob);

module.exports = router;