const express = require('express');
const search = require('../controllers/studentControllers/studentSearchRecommend');

//API MIDDLEWARE
const verifyToken = require('../helpers/verifyToken');
const rateLimiter = require('../helpers/rateLimiter');

//Router initialisation
const router = express.Router();

//routes

//POST Create Application 
router.get('/searchProjects', verifyToken, search.searchProjects);

module.exports = router;