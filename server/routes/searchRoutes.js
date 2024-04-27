/*  This is the file for the searchRoute(s). Currently only has the searchProjects route, but can/should be expanded to include other
    search related routes such as student search.
*/

const express = require('express');
const search = require('../controllers/studentControllers/studentSearchRecommend');

//API MIDDLEWARE
const verifyToken = require('../helpers/verifyToken');
const rateLimiter = require('../helpers/rateLimiter');

//Router initialisation
const router = express.Router();

//GET - Search for projects  
router.get('/searchProjects', [verifyToken], search.searchProjects);

module.exports = router;