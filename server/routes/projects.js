const express = require('express');
const facultyProjects = require('../controllers/facultyProjects');

//API MIDDLEWARE
const verifyToken = require('../helpers/verifyToken')
const rateLimiter = require('../helpers/rateLimiter');


//Router initialisation
const router = express.Router();

//routes

//POST Create Project 
router.post('/createProject', verifyToken, facultyProjects.createProject);

//DELETE Delete Project
router.delete('/deleteProject', verifyToken, facultyProjects.deleteProject);

//GET Gets Projects from Account
router.get('/getProjects', verifyToken, facultyProjects.getProjects);

//PUT Update a Project from Account
router.put('/updateProject', verifyToken, facultyProjects.updateProject);

//PUT Archive a Project and move it to archived from Active
router.put('/archiveProject', verifyToken, facultyProjects.archiveProject);

//PUT Accept or Reject an application for a project
router.put('/application', verifyToken, facultyProjects.applicationDecision);

//GET gets all projects for faculty
router.get('/getAllProjects', verifyToken, facultyProjects.getAllActiveProjects);

//POST Get all applicants 
router.post('/getApplicants', verifyToken, facultyProjects.demoFetchApplicants);

//POST Get data about an applicant
router.post('/getApplicant', verifyToken, facultyProjects.fetchApplicant);

//POST Get single project
router.post('/getProject', verifyToken, facultyProjects.getProject);

module.exports = router;