const express = require('express');
const applications = require('../controllers/studentApplications');

//API MIDDLEWARE
const verifyToken = require('../helpers/verifyToken');
const rateLimiter = require('../helpers/rateLimiter');
const { questionAnswerValidation } = require('../helpers/inputValidation/projectValidation');


//Router initialisation
const router = express.Router();

//routes

//POST Create Application 
router.post('/createApplication', verifyToken, questionAnswerValidation, applications.createApplication);

//POST Create Project 
router.delete('/deleteApplication', verifyToken, applications.deleteApplication);

//GET Get Applications
router.get('/getApplications', verifyToken, applications.getApplications);

router.get('/getTopRecentApplications', verifyToken, applications.getTopRecentApplications);
router.get('/getTopRecentApplications/:num', verifyToken, applications.getTopRecentApplications);

//POST Update Applications
router.put('/updateApplication', verifyToken, questionAnswerValidation, applications.updateApplication);

router.get('/demoGetStudentInfo', verifyToken, applications.demoGetStudentInfo);


module.exports = router;