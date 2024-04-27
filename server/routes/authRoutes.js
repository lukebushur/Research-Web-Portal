/*  This is the file for authentication and authorization routes. These routes are account type agnostic, so they can be used by either faculty or students. */

const express = require('express');
const authController = require('../controllers/authenticate');

//API MIDDLEWARE
const verifyToken = require('../helpers/verifyToken');
const rateLimiter = require('../helpers/rateLimiter');
const { registerMajorValidation, verifiedValidation } = require('../helpers/inputValidation/accountValidation');



//Router initialisation
const router = express.Router();

//POST REGISTER - Route to create an account, utilizes the registerMajorValidation middleware to ensure that student accounts have majors
//that align with the available majors from their university.
router.post('/register', [registerMajorValidation], authController.register);

//POST TOKEN - Route to regenerate an access token given a refresh token and valid access token
router.post('/token', [verifyToken, verifiedValidation], authController.token);

//POST Confirm Email 
router.post('/confirmEmail', [verifyToken], authController.confirmEmailToken);

//POST Login
router.post('/login', authController.login);

//GET Get available Majors - This route grabs the list of available majors from a university, which allows the frontend to popualte drop down boxes
router.get('/getMajors', authController.getAvailableMajors)

module.exports = router;