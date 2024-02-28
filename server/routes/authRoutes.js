const express = require('express');
const authController = require('../controllers/authenticate');

//API MIDDLEWARE
const verifyToken = require('../helpers/verifyToken');
const rateLimiter = require('../helpers/rateLimiter');
const { registerMajorValidation } = require('../helpers/inputValidation/accountValidation');


//Router initialisation
const router = express.Router();

//routes
router.get('/auth/test', [rateLimiter(50, 10), verifyToken], authController.test);

//POST REGISTER
router.post('/register', registerMajorValidation, authController.register);

//POST TOKEN
router.post('/token', authController.token);

//POST Confirm Email!
router.post('/confirmEmail', verifyToken, authController.confirmEmailToken);

//POST Login
router.post('/login', authController.login);

//GET Get available Majors
router.get('/getMajors', authController.getAvailableMajors)

module.exports = router;