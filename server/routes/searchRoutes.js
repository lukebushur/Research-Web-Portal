/*  This is the file for the searchRoute(s). Currently only has the searchProjects route, but can/should be expanded to include other
    search related routes such as student search.
*/

import express from 'express';

import { searchProjects } from '../controllers/studentControllers/studentSearchRecommend.js';

//API MIDDLEWARE
import verifyToken from '../helpers/verifyToken.js';
import { verifiedValidation } from '../helpers/inputValidation/accountValidation.js';
import rateLimiter from '../helpers/rateLimiter.js';

//Router initialisation
const router = express.Router();

//GET - Search for projects  
router.get('/searchProjects', [verifyToken, verifiedValidation], searchProjects);

export default router;