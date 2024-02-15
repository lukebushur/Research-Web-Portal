const express = require('express');
const industryController = require('../controllers/industry');

//API MIDDLEWARE
const verifyToken = require('../helpers/verifyToken')

//Router initialisation
const router = express.Router();

//routes

//GET user's name 
router.get('/getName', verifyToken, industryController.getName);

module.exports = router;