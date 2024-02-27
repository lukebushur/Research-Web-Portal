const express = require('express');
const industryController = require('../controllers/industry');

// API Middleware
const verifyToken = require('../helpers/verifyToken')

// Router Initialisation
const router = express.Router();

// Routes

// GET - get all the active, draft, and archived jobs from a user
router.get('/getJobs', verifyToken, industryController.getJobs);

// GET - get a job associated with the user at the specified ID
router.get('/getJob/:jobId', verifyToken, industryController.getJob);

// POST - create a new job associated with a user
router.post('/createJob', verifyToken, industryController.createJob);

// PUT - edit an existing job
router.put('/editJob', verifyToken, industryController.editJob);

// DELETE - delete a job at the specified ID
router.delete('/deleteJob/:jobId', verifyToken, industryController.deleteJob);

// POST - create a new assessment
router.post('/createAssessment', verifyToken, industryController.createAssessment);

module.exports = router;