const express = require('express');
const industryController = require('../controllers/industry');

// API Middleware
const verifyToken = require('../helpers/verifyToken')

// Router Initialisation
const router = express.Router();

// Routes

// GET - get all the active, draft, and archived jobs from a user
router.get('/getJobs', verifyToken, industryController.getJobs);

// POST - create a new job associated with a user
router.post('/createJob', verifyToken, industryController.createJob);

router.delete('/deleteJob/:jobId', verifyToken, industryController.deleteJob);

module.exports = router;