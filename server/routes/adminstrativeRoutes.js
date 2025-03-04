/*  This is the file for administrative routes. Currently, these only have routes for managing the list of majors in a university. These routes
    have sweeping effects on other routes, so administrative priviledges/accounts should be distributed carefully.
*/

import express from 'express';

import {
    addMajors,
    deleteMajors,
    replaceMajors,
} from '../controllers/administrativeControllers/universityMajors.js';

//API MIDDLEWARE
import verifyToken from '../helpers/verifyToken.js';
import { verifiedValidation } from '../helpers/inputValidation/accountValidation.js';
import rateLimiter from '../helpers/rateLimiter.js';

//Router initialisation
const router = express.Router();

//POST add majors Route for add a major(s) to a master list
router.post('/addMajor', [verifyToken, verifiedValidation], addMajors);

//DELETE Route for removing a major(s) to a master list
router.delete('/deleteMajor', [verifyToken, verifiedValidation], deleteMajors);

//POST for replacing majors
router.post('/replaceMajors', [verifyToken, verifiedValidation], replaceMajors);

export default router;