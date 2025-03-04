/*  This is the file for project related routes. These routes are primarily accessible by faculty accounts. Any routes relating indirectly
    to projects such as creating applications to projects do not belong here. All of these routes require an access token to access.
*/

import express from 'express';

import {
    createProject,
    deleteProject,
    getProjects,
    updateProject,
    archiveProject,
    unarchiveProject,
    applicationDecision,
    fetchAllApplicants,
    fetchApplicant,
    getProject,
    fetchApplicantsFromProject,
    publishProject,
} from '../controllers/facultyProjects.js';

//API MIDDLEWARE
import verifyToken from '../helpers/verifyToken.js';
import rateLimiter from '../helpers/rateLimiter.js';
import { projectValidation, decisionValidation } from '../helpers/inputValidation/projectValidation.js';
import { verifiedValidation } from '../helpers/inputValidation/accountValidation.js';

//Router initialisation
const router = express.Router();

//routes

//POST Create Project - Utilizes projectValidation middleware to ensure that the project has valid majors for the university the faculty is
//apart of and that the project conforms to minimum requirements (if an active project, drafts are exempt)
router.post('/createProject', [verifyToken, verifiedValidation, projectValidation("create")], createProject);

//DELETE Delete Project
router.delete('/deleteProject', [verifyToken, verifiedValidation], deleteProject);

//GET Gets Projects from Account - Grabs all projects and their information for a specific faculty account
router.get('/getProjects', [verifyToken, verifiedValidation], getProjects);

//PUT Update a Project from Account - Updates a project, utilizes projectValidation middleware to ensure the updating conforms to minimum
//standards.
router.put('/updateProject', [verifyToken, verifiedValidation, projectValidation("update")], updateProject);

//PUT Archive a Project and move it to archived from Active
router.put('/archiveProject', [verifyToken, verifiedValidation], archiveProject);

//PUT Unarchive a project and move it to the active project
router.put('/unarchiveProject', [verifyToken], unarchiveProject);

//PUT Accept or Reject an application for a project - utilizies decisionValidation middleware to ensure than the choice made with the request
//is a value that the server expects so that the backend and frontend applications can work with the data stored in the database
router.put('/application', [verifyToken, decisionValidation], applicationDecision);

//POST Get all applicants - Grabs all the basic information from all the applicants to a specific active project. This is used to populate
//tables on the frontend to provide an overview of the applications to a project.
router.post('/getApplicants', [verifyToken], fetchAllApplicants);

//POST Get data about an applicant - This route grabs more detailed information from a specific applicant. This route is used to populate 
//a page dedicated to providing detailed information about a specific applicant.
router.post('/getApplicant', [verifyToken], fetchApplicant);

//POST Get single project - This route grabs the project information for a single, specific project.
router.post('/getProject', [verifyToken], getProject);

//POST Get detailed applicant data - This requires more network operations than the getApplicants route. As such, it provides more details 
//about the fetched applicants, but can grab multiple unlike getApplicant.
router.post('/getDetailedApplicants', [verifyToken], fetchApplicantsFromProject);

//PUT This route changes a draft project to an active project. It utilizes the projectValidation middleware to ensure the draft conforms to the 
//minimum standards of an active project before publishing.
router.put('/publishDraft', [verifyToken, projectValidation("publish")], publishProject);

export default router;