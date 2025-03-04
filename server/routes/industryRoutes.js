import express from 'express';

import {
    getJobs,
    getJob,
    createJob,
    editJob,
    deleteJob,
    getAssessments,
    getAssessment,
    createAssessment,
    editAssessment,
    deleteAssessment,
} from '../controllers/industry.js';

// API Middleware
import verifyToken from '../helpers/verifyToken.js'
import { verifiedValidation } from '../helpers/inputValidation/accountValidation.js';

// Router Initialisation
const router = express.Router();

// Job Routes

// GET - get all the active, draft, and archived jobs from a user
router.get('/getJobs', [verifyToken, verifiedValidation], getJobs);

// GET - get a job associated with the user at the specified ID
router.get('/getJob/:jobId', [verifyToken, verifiedValidation], getJob);

// POST - create a new job associated with a user
router.post('/createJob', [verifyToken, verifiedValidation], createJob);

// PUT - edit an existing job
router.put('/editJob', [verifyToken, verifiedValidation], editJob);

// DELETE - delete the job at the specified ID
router.delete('/deleteJob/:jobId', [verifyToken, verifiedValidation], deleteJob);

// Assessment Routes

// GET - get all assessments
router.get('/getAssessments', [verifyToken], getAssessments);

// GET - get the assessment at the specified ID
router.get('/getAssessment/:assessmentId', [verifyToken], getAssessment);

// POST - create a new assessment
router.post('/createAssessment', [verifyToken], createAssessment);

// PUT - edit an existing assessment
router.put('/editAssessment', [verifyToken], editAssessment);

// DELETE - delete the assessment at the specified ID
router.delete('/deleteAssessment/:assessmentId', [verifyToken], deleteAssessment);

export default router;