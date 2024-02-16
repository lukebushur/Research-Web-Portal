const generateRes = require('../generateJSON');
const Application = require('../../models/application');
const Project = require('../../models/project');
const User = require('../../models/user');

/*  This helper function is used to get the faculty project from the database records. As future use cases are added, this function should be modified to 
    grab the project using information from the new requests 

    The helper function takes three parameters, req (the express request object), res (express response object), and student (the student record who is making the request)
*/
const getProject = async (req, res, student) => {
    let projectID = hasField(req.body, "projectID"); //Check if the projectID field exists 
    const professorEmail = hasField(req.body, "professorEmail"); //Check if professorEmail exists
    if (!projectID) { //If no projectID, then the projectID has to be accessed through database records - This code block handles the updateApplication Route
        let applicationID = hasField(req.body, "applicationID").applicationID; //Check if applicationID exists
        if (!applicationID) { //If not then there is not way to access the questions for validation
            res.status(400).json(generateRes(false, 400, "INPUT_ERROR", {}));
            return;
        }

        //This sequence of network operations are unavoidable as each relies on a previous operation to complete successfully
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

        return project;
    } else if (professorEmail) { //Otherwise the projectID exists and the professorEmail field exists.

        const faculty = await User.findOne({ email: professorEmail.professorEmail }); //Get faculty account record
        if (!faculty) {
            res.status(400).json(generateRes(false, 400, "INPUT_ERROR", { details: "Invalid professorEmail address." }));
            return
        }
        const projects = await Project.findOne({ _id: faculty.userType.FacultyProjects.Active }); //Get the activeProject record because students can only apply to active projects

        const project = projects.projects.find(x => x.id === projectID.projectID); //get the specific project because projectID exists
        return project;
    }

    return null;
}

/*  This helper function grabs the project object from the HTTP request and returns it. It takes the express request object and express response object as parameters.
    This function is onyl built to grab the project field from the create and update project faculty routes. If more routes are added that need to be validated, this method
    will have to be modified for those conditions
*/
const getMajors = (req, res) => {
    let project = hasField(req.body, "project");
    let major = hasField(req.body, "Major");

    if (!project && !major) { //Currently, only the update and creat project routes need to use the getMajors helper function. They both have a subfield of "project", so if it does not exist an error response is generated
        res.status(400).json(generateRes(false, 400, "INPUT_ERROR", { details: "Missing project or field." }));
        return
    } else if (project && !project.project.majors[0] && !major) { //This checks that the majors field exists, as future logic in the projectValidation will require it. This needs to be last
        res.status(400).json(generateRes(false, 400, "INPUT_ERROR", { details: "Missing majors field in project." }));
        return
    }

    if (project) { return project.project.majors; }
    else if (major) { return major.Major; }
}

const getDecision = (req, res) => {
    let decision = hasField(req.body, "decision");
    if (!decision) {
        res.status(400).json(generateRes(false, 400, "INPUT_ERROR", { details: "Missing decision field." }));
        return
    } else {
        return decision.decision;
    }
}

/*Helper function to check if a JS object has a field, or if its subfields have a field of a certain name
Returns the obj or the subfield that has the field of the specified name i.e. if the obj a : { test : { fruit: "Pineapple"} } 
was used with fieldName equal to fruit, the inner test obj would be returned.
*/
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
    getDecision, getMajors, getProject
}