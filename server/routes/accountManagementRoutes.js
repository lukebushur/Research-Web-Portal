const express = require('express');
const accountManagement = require('../controllers/accountManagment');

//API MIDDLEWARE
const verifyToken = require('../helpers/verifyToken');
const rateLimiter = require('../helpers/rateLimiter');

//Router initialisation
const router = express.Router();

//updateAccount Route, updates the account of a student or faculty
router.post('/updateAccount', verifyToken, accountManagement.modifyAccount);

//Post Reset Password request
router.post('/resetPassword', accountManagement.resetPassword);

//Post Confirm Reset Password
router.post('/confirmResetPassword', accountManagement.resetPasswordConfirm);

//POST Change Email
router.post('/changeEmail', verifyToken, accountManagement.changeEmail);

//POST Confirm Change Email
router.post('/changeEmailConfirm', verifyToken, accountManagement.changeEmailConfirm);

//GET Get account info
router.get('/getAccountInfo', verifyToken, accountManagement.getAccountInfo);

module.exports = router;