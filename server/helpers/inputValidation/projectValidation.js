/*  This JavaScript file will handle the necessary validation for creating applications and projects. 
    The validation for creating applicatiosn will ensure that the answers provided by studnets match the choices offered by faculty
    The validation for project will ensure the listed majors match the majors available in the databas
*/

const User = require('../../models/user');
const Majors = require('../../models/majors')
const JWT = require('jsonwebtoken');
const generateRes = require('../generateJSON');
const { getProject, getMajors, getDecision } = require('./validationHelpers');
const { retrieveOrCacheMajors, retrieveOrCacheUsers, retrieveOrCacheProjects } = require('../schemaCaching');
const { activeProjectSchema } = require('./requestValidation');

const questionsWithChoices = ["radio button", "check box"]; //This is a const array of potential options for question types that have multiple provided answers
const statusChoices = ["Hold", "Accept", "Reject"]; //This is a const array for the options in updated an application decision

/*  This middleware function will validate applications, it ensures that a required question has an answer and that multiple choice questions only have answers that 
    coordinate with the choices the faculty has outlined.

    This method will grab the questions, and projectID from the request. In the case of the createApplication route, the project ID is provided,
    but in the case of the updateApplication route the projectID is not provided and it will be grabbed from the application record. Then, once the
    projectID is taken the answers will be compared against the question to ensure the number of questions and answers match, the required questions have
    answers, and that the answers for multiple choice match that of the provided choices.
*/
const applicationValidation = async (req, res, next) => {
    try {
        //First grab the student information, it will be needed to verify the student's GPA, and potentially to get the applications in the getProject method
        const accessToken = req.header('Authorization').split(' ')[1]; //Retrieve and decode access token
        const decodeAccessToken = JWT.verify(accessToken, process.env.SECRET_ACCESS_TOKEN);
        const student = await retrieveOrCacheUsers(req, decodeAccessToken.email); //Get student record

        const project = await getProject(req, res, student);
        if (!project) { return; } //If the project is not found, then a response has already been generated, so the function should end
        const studentQuestions = req.body.questions;
        const facultyQuestions = project.questions;
        if (facultyQuestions.length === 0 && studentQuestions.length === 0) { //If facultyQuestions.length is 0, that means questions were retrieved but it was empty so move on if the student's questions are also empty
            next();
        }

        //If there are missing questions or if the length of each array of questions are different, throw and error
        if ((!facultyQuestions || !studentQuestions) || (facultyQuestions.length !== studentQuestions.length)) {
            res.status(400).json(generateRes(false, 400, "INPUT_ERROR", {}));
            return;
        }

        for (let i = 0; i < facultyQuestions.length; i++) { //CASES 2 IF MULTIPLE CHOICE QUESTIONS have an provided answer - 
            if (facultyQuestions[i].required) { //Checks to see that each required question has a respective answer
                if (!studentQuestions[i].answers) {
                    res.status(400).json(generateRes(false, 400, "INPUT_ERROR", { details: "Missing required answers." }));
                    return;
                }
            }

            if (questionsWithChoices.includes(facultyQuestions[i].requirementType)) {
                if (!studentQuestions[i].answers && !facultyQuestions[i].required) { continue } //if the question is not required and there is no answer continue
                else if (!studentQuestions[i].answers.every(x => facultyQuestions[i].choices.includes(x))) {
                    res.status(400).json(generateRes(false, 400, "INPUT_ERROR", { details: "Answers do not align with the choices" }));
                    return;
                }
            }
        }

        //This validates that the student meets the minimum criteria i.e. GPA / Major
        if (project.GPA > student.userType.GPA) {
            res.status(409).json(generateRes(false, 409, "INVALID_GPA", {}));
            return;
        }

        let majorIncluded = false;
        student.userType.Major.forEach((major) => { //This checks every major a student has, and if one of them is included in the project's majors, then the student is allowed to apply 
            if (project.majors.includes(major)) { majorIncluded = true; }
        });
        if (!majorIncluded) {
            res.status(409).json(generateRes(false, 409, "INVALID_MAJOR", {}));
            return;
        }

        next();

    } catch (error) {
        res.status(500).json(generateRes(false, 500, "INPUT_ERROR", { "details": "Error in validating requirements." }));
        return;
    }
}

/*  This function will validate that a project's conforms to the standards required by the application/database. Currently, it will ensure that
    the project that will be created or updated will only have selected majors that are available for the respective university.
*/
const projectValidation = (mode = "create") => {
    return async (req, res, next) => {
        try {
            //Grab information about user account information
            const accessToken = req.header('Authorization').split(' ')[1]; //Retrieve and decode access token
            const decodeAccessToken = JWT.verify(accessToken, process.env.SECRET_ACCESS_TOKEN);
            const userAccount = await retrieveOrCacheUsers(req, decodeAccessToken.email);

            if (userAccount.userType.Type !== parseInt(process.env.FACULTY)) {
                return res.status(401).json(generateRes(false, 401, "UNAUTHORIZED", {}));
            }

            let reqMajors, project; //these values will be used to validate the project. reqMajors is the request majors of the project and project should be the actual project
            //if the project is a draft, then it doesn't need to conform to the major validation requirements yet
            if (req.body.projectType === "Draft") { next(); return; }
            //Get list of majors corresponding to the user's university
            if (mode === "publish") {
                let draftProjectRecord;
                const promises = [
                    retrieveOrCacheProjects(req, userAccount.userType.FacultyProjects.Draft),
                    retrieveOrCacheProjects(req, userAccount.userType.FacultyProjects.Active), //this is included to reduce the number of needed i/o requests
                ];

                await Promise.all(promises).then(results => {
                    draftProjectRecord = results[0];
                });
                //if there is not draft project record or draft project, then the request is invalid due to the resource not being locatable
                if (!draftProjectRecord) { return res.status(404).json(generateRes(false, 404, "PROJECTS_NOT_FOUND", {})); }
                let selectedProject = draftProjectRecord.projects.find(x => x.id.toString() === req.body.projectID);
                if (!selectedProject) { return res.status(404).json(generateRes(false, 404, "PROJECT_NOT_FOUND", {})); }
                reqMajors = selectedProject.majors; //otherwise set the majors so that they can be validated
                project = selectedProject._doc;
            }

            const majors = await retrieveOrCacheMajors(req, userAccount.universityLocation);
            if (!majors) {
                res.status(500).json(generateRes(false, 500, "SERVER_ERROR", { details: "No major list found corresponding to user university location." }));
                return;
            }
            //if reqMajors already exists, don't resassing it, otherwise make it equal to getMajors
            reqMajors = reqMajors ? reqMajors : getMajors(req, res);
            if (!reqMajors && !res.headersSent) { //Checks if there is a majors field found and if the response hasn't be send, if so there has been an input error
                res.status(400).json(generateRes(false, 400, "INPUT_ERROR", { details: "No provided majors" }));
                return;
            } else if (!reqMajors) { return } //If reqMajors doesn't exist and the res has been sent, then the response is s already been generated or the request by the helper
            if (!reqMajors.every(x => majors.majors.includes(x))) {
                res.status(400).json(generateRes(false, 400, "INPUT_ERROR", { details: "Provided major do not align with the univeristy's major list." }));
                return;
            }
            //if the project obj doesn't exist, then grab it from the request
            project = project ? project : req.body.projectDetails.project;
            const { error } = activeProjectSchema.validate(project);
            if (error) { //If there is an error validating the project, then 
                return res.status(400).json(generateRes(false, 400, "INPUT_ERROR", {
                    errors: error.details,
                    original: error._original
                }));
            }

            next();
        } catch (error) {
            res.status(500).json(generateRes(false, 500, "SERVER_ERROR", {}));
            return;
        }
    }
}

const decisionValidation = async (req, res, next) => {
    try {
        const decision = getDecision(req, res);
        if (!decision) { return; } //if no decision is found, then return as the response has already been sent

        if (!statusChoices.includes(decision)) {
            return res.status(400).json(generateRes(false, 400, "INPUT_ERROR", { details: "Provided decisions is not an acceptable value." }));
        }

        next();
    } catch (error) {
        res.status(500).json(generateRes(false, 400, "INPUT_ERROR", { details: "Missing decision field" }));
        return;
    }
}

module.exports = {
    applicationValidation, projectValidation,
    decisionValidation
}