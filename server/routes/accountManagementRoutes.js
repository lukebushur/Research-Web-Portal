/*  This is the file for authentication and authorization routes. These routes are account type agnostic, so they can be used by either faculty or students. */

import express from 'express';

import {
    modifyAccount,
    changeEmail,
    changeEmailConfirm,
    resetPassword,
    resetPasswordConfirm,
    getAccountInfo,
} from '../controllers/accountManagment.js';

//API MIDDLEWARE
import verifyToken from '../helpers/verifyToken.js';
import rateLimiter from '../helpers/rateLimiter.js';
import { accountModifyMajorValidation, verifiedValidation } from '../helpers/inputValidation/accountValidation.js';

//Router initialisation
const router = express.Router();

//updateAccount Route, updates the account of a student or faculty
router.post('/updateAccount', [verifyToken, verifiedValidation, accountModifyMajorValidation], modifyAccount);

//Post Reset Password request - Does not require an access token because this route is used when the user forgots their password
router.post('/resetPassword', resetPassword);

//Post Confirm Reset Password 
router.post('/confirmResetPassword', resetPasswordConfirm);

//POST Change Email
router.post('/changeEmail', [verifyToken, verifiedValidation], changeEmail);

//POST Confirm Change Email
router.post('/changeEmailConfirm', [verifyToken, verifiedValidation], changeEmailConfirm);

//GET Get account info
router.get('/getAccountInfo', [verifyToken, verifiedValidation], getAccountInfo);

export default router;