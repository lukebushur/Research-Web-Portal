/*  This is the file for student application routes. These all require an access token. Only routes that are related to the creation, deletion
    modification, and retrieval of application should be in this file.
*/

import express from 'express';

import {
    createApplication,
    deleteApplication,
    getApplications,
    getTopRecentApplications,
    updateApplication,
    getProjectData,
    getApplication,
} from '../controllers/studentControllers/studentApplications.js';

//API MIDDLEWARE
import verifyToken from '../helpers/verifyToken.js';
import rateLimiter from '../helpers/rateLimiter.js';
import { applicationValidation } from '../helpers/inputValidation/projectValidation.js';
import { verifiedValidation } from '../helpers/inputValidation/accountValidation.js';

//Router initialisation
const router = express.Router();

//routes

/*  POST Create Application - Utilizes applicationValidation middleware to ensure than the application created by the student has expected
    values. For example, it ensures the responses to multiple choice questions are the provided answers by the faculty. It also ensures that the 
    student meets the minimum requirements to apply to the project. 
*/
router.post('/createApplication', [verifyToken, verifiedValidation, applicationValidation], createApplication);

//DELETE Delete Application
router.delete('/deleteApplication', [verifyToken, verifiedValidation], deleteApplication);

//GET Get Applications - Grabs all applications association with the student's account
router.get('/getApplications', [verifyToken, verifiedValidation], getApplications);

router.get('/getTopRecentApplications', [verifyToken, verifiedValidation], getTopRecentApplications);
router.get('/getTopRecentApplications/:num', [verifyToken, verifiedValidation], getTopRecentApplications);

//POST Update Application - Utilizes the applicationValidation middleware which ensures the updating provides expected values for the project
router.put('/updateApplication', [verifyToken, verifiedValidation, applicationValidation], updateApplication);

//POST Get Project Info - Route to allow students to access project information without accessing information such as other applicants' names and GPAs
router.post('/getProjectInfo', [verifyToken, verifiedValidation], getProjectData);

//POST Get application, grabs a specific application's information
router.post('/getApplication', [verifyToken, verifiedValidation], getApplication);

export default router;