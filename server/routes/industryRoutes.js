const express = require('express');
const industryController = require('../controllers/industry');

// API Middleware
const verifyToken = require('../helpers/verifyToken')

// Router Initialisation
const router = express.Router();

// Job Routes

// GET - get all the active, draft, and archived jobs from a user
router.get('/getJobs', [verifyToken], industryController.getJobs);

// GET - get a job associated with the user at the specified ID
router.get('/getJob/:jobId', [verifyToken], industryController.getJob);

// POST - create a new job associated with a user
router.post('/createJob', [verifyToken], industryController.createJob);

// PUT - edit an existing job
router.put('/editJob', [verifyToken], industryController.editJob);

// DELETE - delete the job at the specified ID
router.delete('/deleteJob/:jobId', [verifyToken], industryController.deleteJob);

// Assessment Routes

// GET - get all assessments
router.get('/getAssessments', [verifyToken], industryController.getAssessments);

// GET - get the assessment at the specified ID
router.get('/getAssessment/:assessmentId', [verifyToken], industryController.getAssessment);

// POST - create a new assessment
router.post('/createAssessment', [verifyToken], industryController.createAssessment);

// PUT - edit an existing assessment
router.put('/editAssessment', [verifyToken], industryController.editAssessment);

// DELETE - delete the assessment at the specified ID
router.delete('/deleteAssessment/:assessmentId', [verifyToken], industryController.deleteAssessment);

module.exports = router;