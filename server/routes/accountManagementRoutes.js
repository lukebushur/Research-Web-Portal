/*  This is the file for authentication and authorization routes. These routes are account type agnostic, so they can be used by either faculty or students. */

const express = require('express');
const accountManagement = require('../controllers/accountManagment');

//API MIDDLEWARE
const verifyToken = require('../helpers/verifyToken');
const rateLimiter = require('../helpers/rateLimiter');
const { accountModifyMajorValidation, verifiedValidation } = require('../helpers/inputValidation/accountValidation');

//Router initialisation
const router = express.Router();

//updateAccount Route, updates the account of a student or faculty
router.post('/updateAccount', [verifyToken, verifiedValidation, accountModifyMajorValidation], accountManagement.modifyAccount);

//Post Reset Password request - Does not require an access token because this route is used when the user forgots their password
router.post('/resetPassword', accountManagement.resetPassword);

//Post Confirm Reset Password 
router.post('/confirmResetPassword', accountManagement.resetPasswordConfirm);

//POST Change Email
router.post('/changeEmail', [verifyToken, verifiedValidation], accountManagement.changeEmail);

//POST Confirm Change Email
router.post('/changeEmailConfirm', [verifyToken, verifiedValidation], accountManagement.changeEmailConfirm);

//GET Get account info
router.get('/getAccountInfo', [verifyToken, verifiedValidation], accountManagement.getAccountInfo);

module.exports = router;