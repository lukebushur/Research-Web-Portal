/*  This is the file for student application routes. These all require an access token. Only routes that are related to the creation, deletion
    modification, and retrieval of application should be in this file.
*/

const express = require('express');
const applications = require('../controllers/studentControllers/studentApplications');

//API MIDDLEWARE
const verifyToken = require('../helpers/verifyToken');
const rateLimiter = require('../helpers/rateLimiter');
const { applicationValidation } = require('../helpers/inputValidation/projectValidation');


//Router initialisation
const router = express.Router();

//routes

/*  POST Create Application - Utilizes applicationValidation middleware to ensure than the application created by the student has expected
    values. For example, it ensures the responses to multiple choice questions are the provided answers by the faculty. It also ensures that the 
    student meets the minimum requirements to apply to the project. 
*/
router.post('/createApplication', [verifyToken, applicationValidation], applications.createApplication);

//DELETE Delete Application
router.delete('/deleteApplication', [verifyToken], applications.deleteApplication);

//GET Get Applications - Grabs all applications association with the student's account
router.get('/getApplications', [verifyToken], applications.getApplications);

router.get('/getTopRecentApplications', [verifyToken], applications.getTopRecentApplications);
router.get('/getTopRecentApplications/:num', [verifyToken], applications.getTopRecentApplications);

//POST Update Application - Utilizes the applicationValidation middleware which ensures the updating provides expected values for the project
router.put('/updateApplication', [verifyToken, applicationValidation], applications.updateApplication);

//POST Get Project Info - Route to allow students to access project information without accessing information such as other applicants' names and GPAs
router.post('/getProjectInfo', [verifyToken], applications.getProjectData);

//POST Get application, grabs a specific application's information
router.post('/getApplication', [verifyToken], applications.getApplication);

module.exports = router;