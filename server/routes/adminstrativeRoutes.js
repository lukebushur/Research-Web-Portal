/*  This is the file for administrative routes. Currently, these only have routes for managing the list of majors in a university. These routes
    have sweeping effects on other routes, so administrative priviledges/accounts should be distributed carefully.
*/

const express = require('express');
const majorsRoutes = require('../controllers/administrativeControllers/universityMajors');

//API MIDDLEWARE
const verifyToken = require('../helpers/verifyToken')
const rateLimiter = require('../helpers/rateLimiter');
//Router initialisation
const router = express.Router();

//POST add majors Route for add a major(s) to a master list
router.post('/addMajor', [verifyToken], majorsRoutes.addMajors);

//DELETE Route for removing a major(s) to a master list
router.delete('/deleteMajor', [verifyToken], majorsRoutes.deleteMajors);

//POST for replacing majors
router.post('/replaceMajors', [verifyToken], majorsRoutes.replaceMajors);

module.exports = router;