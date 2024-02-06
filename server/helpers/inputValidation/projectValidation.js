/*  This JavaScript file will handle the necessary validation for creating applications and projects. 
    The validation for creating applicatiosn will ensure that the answers provided by studnets match the choices offered by faculty
    The validation for project will ensure the listed majors match the majors available in the databas
*/

const Application = require('../../models/application');
const Project = require('../../models/project');
const User = require('../../models/user');
const JWT = require('jsonwebtoken');
const generateRes = require('../generateJSON');
const questionsWithChoices = ["radio button", "check box"];
/*  This middleware function will validate that a required question has an answer and that multiple choice questions only have answers that 
    coordinate with the choices the faculty has outlined.

    This method will grab the questions, and projectID from the request. In the case of the createApplication route, the project ID is provided,
    but in the case of the updateApplication route the projectID is not provided and it will be grabbed from the application record. Then, once the
    projectID is taken the answers will be compared against the question to ensure the number of questions and answers match, the required questions have
    answers, and that the answers for multiple choice match that of the provided choices.
*/

// Step two grab the questions from the request - Step three compare the questions from the request to the record
const questionAnswerValidation = async (req, res, next) => {
    try {
        const studentQuestions = req.body.questions;
        const facultyQuestions = await getQuestions(req, res);
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

        next();

    } catch (error) {
        res.status(400).json(generateRes(false, 400, "INPUT_ERROR", {}));
        return;
    }
}


//This helper function is used to get the questions from the database records
const getQuestions = async (req, res) => {
    let projectID = hasField(req.body, "projectID"); //Check if the projectID field exists 
    const professorEmail = hasField(req.body, "professorEmail"); //Check if professorEmail exists
    if (!projectID) { //If no projectID, then the projectID has to be accessed through database records - This code block handles the updateApplication Route
        let applicationID = hasField(req.body, "applicationID").applicationID; //Check if applicationID exists
        if (!applicationID) { //If not then there is not way to access the questions for validation
            res.status(400).json(generateRes(false, 400, "INPUT_ERROR", {}));
            return;
        } 

        const accessToken = req.header('Authorization').split(' ')[1]; //Retrieve and decode access token
        const decodeAccessToken = JWT.verify(accessToken, process.env.SECRET_ACCESS_TOKEN);

        //This sequence of network operations are unavoidable as each relies on a previous operation to complete successfully
        const student = await User.findOne({ email: decodeAccessToken.email }); //Get student record
        const applications = await Application.findOne({ _id: student.userType.studentApplications }); //Get Application record from student information
        if (!applications) {
            res.status(400).json(generateRes(false, 400, "INPUT_ERROR", { details: "Invalid applicationID." }));
            return;
        }
        const application = applications.applications.find(y => y.id === req.body.applicationID); //Get specific application
        projectID = application.opportunityId; //get the projectID from the application

        const projects = await Project.findOne({ _id: application.opportunityRecordId }); //Get project records
        if (!projects) { //If the project record doesn't exist, there is an error with the request
            res.status(400).json(generateRes(false, 400, "INPUT_ERROR", { details: "The project the application is associated with no longer exists." }));
            return;
        }
        const project = projects.projects.find(x => x.id === projectID.toString()); //get the specific project

        return project.questions;
    } else if (professorEmail) { //Otherwise the projectID exists and the professorEmail field exists.
        
        const faculty = await User.findOne({ email: professorEmail.professorEmail }); //Get faculty account record
        if (!faculty) {
            res.status(400).json(generateRes(false, 400, "INPUT_ERROR", { details: "Invalid professorEmail address." }));
            return
        }
        const projects = await Project.findOne({ _id: faculty.userType.FacultyProjects.Active }); //Get the activeProject record because students can only apply to active projects

        const project = projects.projects.find(x => x.id === projectID.projectID); //get the specific project because projectID exists
        return project.questions;
    }

    return null;
}

//Helper function to check if a JS object has a field, or if its subfields have a field of a certain name
//Returns the obj or the subfield that has the field of the specified name
function hasField(obj, fieldName) {
    //Check if the field exists at the top level
    if (obj.hasOwnProperty(fieldName)) {
        return obj;
    }

    //Otherwise check if the field exists in any subfields
    for (const key in obj) {
        if (obj[key] && typeof obj[key] === 'object') {
            const subField = hasField(obj[key], fieldName); //Recursively call the hasField method to check if its subfields have the field
            if (subField) { //Recursively call the hasField method to check if its subfields have the field
                return subField;
            }
        }
    }

    return null;
}

module.exports = {
    questionAnswerValidation
}