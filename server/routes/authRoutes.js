/*  This is the file for authentication and authorization routes. These routes are account type agnostic, so they can be used by either faculty or students. */
import express from 'express';

import {
    register,
    token,
    confirmEmailToken,
    login,
    getAvailableMajors,
} from '../controllers/authenticate';

import verifyToken from '../helpers/verifyToken';

//API MIDDLEWARE
const rateLimiter = require('../helpers/rateLimiter');
const { registerMajorValidation, verifiedValidation } = require('../helpers/inputValidation/accountValidation');



//Router initialisation
const router = express.Router();

//POST REGISTER - Route to create an account, utilizes the registerMajorValidation middleware to ensure that student accounts have majors
//that align with the available majors from their university.
router.post('/register', [registerMajorValidation], register);

//POST TOKEN - Route to regenerate an access token given a refresh token and valid access token
router.post('/token', [verifyToken, verifiedValidation], token);

//POST Confirm Email 
router.post('/confirmEmail', [verifyToken], confirmEmailToken);

//POST Login
router.post('/login', login);

//GET Get available Majors - This route grabs the list of available majors from a university, which allows the frontend to popualte drop down boxes
router.get('/getMajors', getAvailableMajors)

export default router;