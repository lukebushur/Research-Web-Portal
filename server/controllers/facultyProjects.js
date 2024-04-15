const Project = require('../models/project');
const Application = require('../models/application');
const User = require('../models/user');
const JWT = require('jsonwebtoken');
const { activeProjectSchema, deleteProjectSchema, appDecision } = require('../helpers/inputValidation/requestValidation');
const generateRes = require('../helpers/generateJSON');
const { retrieveOrCacheUsers, retrieveOrCacheApplications, retrieveOrCacheProjects } = require('../helpers/schemaCaching');

/*  This function handles the faculty project creation, should only be used as a POST request, and requires and access token
    This funciton takes information required for creating a faculty project, creates an active project in the DB, and updates the 
    faculty account with the projectID

    The request body requires the following fields : 
    projectType (String, the type of project being created (Draft or Active)) professor (String, name of professor) - 
    projectDetails (Object, contain all the project details) projectDetails fields : 
    posted (Date, date project was created) - description (String, description of the project) - projectName (String, name of the project)
    questions (Array of Strings, questions for applicants)
*/
const createProject = async (req, res) => {
    try {
        const accessToken = req.header('Authorization').split(' ')[1];
        const decodeAccessToken = JWT.verify(accessToken, process.env.SECRET_ACCESS_TOKEN);

        //check if user exists
        const user = await retrieveOrCacheUsers(req, decodeAccessToken.email);

        //check if user type is faculty
        if (user.userType.Type == process.env.FACULTY) {
            const userId = user._id;
            let projectType = req.body.projectType;

            if (!req.body.projectDetails.project.GPA) { req.body.projectDetails.project.GPA = 0; }
            
            if (projectType !== "Active" && projectType !== "Draft") { throw error; }
            let existingProject = user.userType.FacultyProjects[projectType]; //Grabs existing project list
            let projectObject
            //Two seperate blocks of code are needed, one for if the project type is active and one for draft. This is because draft projects 
            //can be partially incomplete while active projects need to complete as they are available for student access
            if (projectType === "Active") {
                projectObject = {
                    projectName: req.body.projectDetails.project.projectName,
                    professorId: userId,
                    posted: new Date(),
                    deadline: req.body.projectDetails.project.deadline,
                    description: req.body.projectDetails.project.description,
                    responsibilities: req.body.projectDetails.project.responsibilities,
                    questions: req.body.projectDetails.project.questions || [], //If no questions exist, create empty array which will be used in validation if applications are submitted without questions
                    GPA: req.body.projectDetails.project.GPA,
                    majors: req.body.projectDetails.project.majors,
                    categories: req.body.projectDetails.project.categories,
                }
            } else if (projectType === "Draft") {
                projectObject = { //first apply all non-required properties from the request body. If they don't exist it is fine, as they are not required
                    professorId: userId,
                    deadline: req.body.projectDetails.project.deadline,
                    questions: req.body.projectDetails.project.questions || [], //If there does not exist questions, create an empty array
                    GPA: req.body.projectDetails.project.GPA,
                    majors: req.body.projectDetails.project.majors,
                    categories: req.body.projectDetails.project.categories,
                    responsibilities: req.body.projectDetails.project.responsibilities,
                    projectName: req.body.projectDetails.project.projectName ? req.body.projectDetails.project.projectName : "Temporary Title",
                    description: req.body.projectDetails.project.description ? req.body.projectDetails.project.description : "Temporary description",
                }
            }

            //if there is no active mongodb record for this professor's active projects then create a new record
            if (!existingProject) {
                let newProjectList = new Project({
                    type: req.body.projectType,
                    professorEmail: user.email,
                    professorName: user.name,
                    projects: [projectObject]
                });
                await newProjectList.save();
                var $set = { $set: {} }; //This sets up the $set dynamically so that it can either save to DraftProjects or ActiveProjects
                $set.$set['userType.FacultyProjects.' + projectType] = newProjectList._id;

                await User.findOneAndUpdate({ _id: userId }, $set);
            } else { //otherwise there exists a faculty record for active projects so add a new element to the record's array
                await Project.updateOne({ _id: existingProject }, {
                    $push: { //push new project to the array 
                        projects: projectObject,
                    }
                });
            }
            return res.status(200).json(generateRes(true, 200, "PROJECT_CREATED", {}));
        } else {
            return res.status(401).json(generateRes(false, 401, "UNAUTHORIZED", {}));
        }
    } catch (error) {
        return res.status(500).json(generateRes(false, 500, "SERVER_ERROR", {}));
    }
}

/*  This function handles the faculty project deletion, should only be used with a DELETE request, and requires an access token
    This funciton takes the projectID and type and deletes the project specified, either active, draft, or archived
    
    The request body requires the following fields : 
    projectID (String, the mongodb __id of the project object to delete from array) - projectType (String, the type of project to delete)
*/
const deleteProject = async (req, res) => {
    try {
        const accessToken = req.header('Authorization').split(' ')[1];
        const decodeAccessToken = JWT.verify(accessToken, process.env.SECRET_ACCESS_TOKEN);

        //check if user exists
        const user = await retrieveOrCacheUsers(req, decodeAccessToken.email);

        //check if user type is faculty
        if (user.userType.Type === parseInt(process.env.FACULTY)) {
            const { error } = deleteProjectSchema.validate(req.body);
            if (error) { //validates request body otherwise returns an error
                return res.status(400).json(generateRes(false, 400, "INPUT_ERROR", {
                    errors: error.details,
                    original: error._original
                }));
            }

            let recordID; //recordID will be taken from the user's record depending on the projectType field in the request
            switch (req.body.projectType) {
                case "Active":
                    recordID = user.userType.FacultyProjects.Active;
                    break;
                case "Archived":
                    recordID = user.userType.FacultyProjects.Archived;
                    break;
                case "Draft":
                    recordID = user.userType.FacultyProjects.Draft;
                    break;
                default:
                    throw error; //if the projectType is not draft, archived, or active then there is an error
            }

            //gets the project record, otherwise sends error response 
            let project = await retrieveOrCacheProjects(req, recordID);
            if (!project) { return res.status(404).json(generateRes(false, 404, "PROJECT_LIST_NOT_FOUND", {})); }
            else {
                //If there is no error, get the number of projects from the projects array and then remove an the selected project from the array
                let numProjects = project._doc.projects.length;
                let selectedProject = project.projects.pull(req.body.projectID);

                if (selectedProject.length == numProjects) { //Check that an element was removed, if not send error response
                    return res.status(404).json(generateRes(false, 404, "PROJECT_NOT_FOUND", {}));
                }
                else {
                    await project.save();
                    return res.status(200).json(generateRes(true, 200, "PROJECT_DELETED", {}));
                }
            }

        } else {
            return res.status(401).json(generateRes(false, 401, "UNAUTHORIZED", {}));
        }
    } catch (error) {
        return res.status(500).json(generateRes(false, 500, "SERVER_ERROR", {}));
    }
}
/*  This function handles the access of a single faculty project, should only be used with a POST request, and requires an access token
    This funciton takes the projectID and type and then retrieves the project specified, either active, draft, or archived
    
    The request body requires the following fields : 
    projectID (String, the mongodb __id of the project object to delete from array) - projectType (String, the type of project to access)
*/
const getProject = async (req, res) => {
    try {                                                       
        if (!req.body.projectType || !req.body.projectID) { return res.status(400).json(generateRes(false, 400, "INPUT_ERROR", {})); }
        const accessToken = req.header('Authorization').split(' ')[1];
        const decodeAccessToken = JWT.verify(accessToken, process.env.SECRET_ACCESS_TOKEN);

        //check if user exists
        const user = await retrieveOrCacheUsers(req, decodeAccessToken.email);

        //check if user type is faculty
        if (user.userType.Type == process.env.FACULTY) {
            const userId = user._id;

            let recordID; //recordID will be taken from the user's record depending on the projectType field in the request
            switch (req.body.projectType) {
                case "Active":
                case "active":
                    recordID = user.userType.FacultyProjects.Active;
                    break;
                case "Archived":
                case "archived":
                    recordID = user.userType.FacultyProjects.Archived;
                    break;
                case "Draft":
                case "draft":
                    recordID = user.userType.FacultyProjects.Draft;
                    break;
                default:
                    throw error; //if the projectType is not draft, archived, or active then there is an error
            }

            let projectRecord = await retrieveOrCacheProjects(req, recordID);
            if (!projectRecord) { return res.status(404).json(generateRes(false, 404, "PROJECT_LIST_NOT_FOUND", {})); }
            else { //If the project list was found, then continue
                //get and update the project from the project array that has the matching information 
                const project = projectRecord.projects.find(x => x.id === req.body.projectID);
                if (project) {
                    const deadline = project.deadline
                        ? (new Date(project.deadline)).toDateString()
                        : null;
                    const posted = project.posted
                        ? (new Date(project.posted)).toDateString()
                        : null;
                    let returnProject = {
                        projectName: project.projectName,
                        questions: project.questions,
                        description: project.description,
                        deadline: deadline,
                        posted: posted,
                        professorId: userId,
                        categories: project.categories,
                        majors: project.majors,
                        GPA: project.GPA,
                        responsibilities: project.responsibilities
                    }
                    return res.status(200).json(generateRes(true, 200, "PROJECT_FOUND", { "project": returnProject }));
                }
                else
                    return res.status(404).json(generateRes(false, 404, "PROJECT_NOT_FOUND"));
            }
        } else {
            return res.status(401).json(generateRes(false, 401, "UNAUTHORIZED", {}));
        }
    } catch (error) {
        return res.status(500).json(generateRes(false, 500, "SERVER_ERROR", {}));
    }
}

/*  This function handles the requests to get the faculty projects, it should only be used with GET requests, and requires a valid access token

    The request body requires no fields
*/
const getProjects = async (req, res) => {
    try {
        const accessToken = req.header('Authorization').split(' ')[1];
        const decodeAccessToken = JWT.verify(accessToken, process.env.SECRET_ACCESS_TOKEN);

        //check if user exists
        const user = await retrieveOrCacheUsers(req, decodeAccessToken.email);

        //check if user type is faculty
        if (user.userType.Type === parseInt(process.env.FACULTY)) {
            const projectsList = user.userType.FacultyProjects;
            //get the project lists for active, archived, and draft projects

            let archivedProjects;
            let activeProjects;
            let draftProjects;

            const promises = [
                retrieveOrCacheProjects(req, projectsList.Archived),
                retrieveOrCacheProjects(req, projectsList.Active),
                retrieveOrCacheProjects(req, projectsList.Draft),
            ];

            await Promise.all(promises).then(results => {
                archivedProjects = results[0];
                activeProjects = results[1];
                draftProjects = results[2];
            });

            let allProjects = []
            let count = 1;
            //Grab all the projects and put them into the allProjects array
            if (activeProjects) {
                activeProjects.projects.forEach(x => {
                    y = createProjectObj(x, "active", count);
                    count++;
                    allProjects.push(y);
                });
            }
            if (draftProjects) {
                draftProjects.projects.forEach(x => {
                    y = createProjectObj(x, "draft", count);
                    count++;
                    allProjects.push(y);
                });
            }
            if (archivedProjects) {
                archivedProjects.projects.forEach(x => {
                    y = createProjectObj(x, "archived", count);
                    count++;
                    allProjects.push(y);
                });
            }

            //This specific response doesn't work with the generateRes method, so the allProjects just gets inserted directly
            return res.status(200).json({ success: { status: 200, message: "PROJECTS_FOUND", projects: allProjects } });
        } else {
            return res.status(401).json(generateRes(false, 401, "UNAUTHORIZED", {}));
        }
    } catch (error) {
        return res.status(500).json(generateRes(false, 500, "SERVER_ERROR", {}));
    }
}

/*  This function handles the faculty project update requests, should only be used as a PUT request, and requires an access token
    This funciton takes a project ID, project type (Draft, Active, Archived), and all of the project information (changed and unchanged)

    The request body requires the following fields : 
    projectID (String, the id of the project in the DB) - projectType (String, the type of project i.e. Active, Draft, or Archived) - 
    projectDetails (Object, contains all the information for the project, both changed and unchanged fields)
*/
const updateProject = async (req, res) => {
    try {
        const accessToken = req.header('Authorization').split(' ')[1];
        const decodeAccessToken = JWT.verify(accessToken, process.env.SECRET_ACCESS_TOKEN);

        //check if user exists
        const user = await retrieveOrCacheUsers(req, decodeAccessToken.email);

        //check if user type is faculty
        if (user.userType.Type == process.env.FACULTY) {
            const userId = user._id;

            let recordID; //recordID will be taken from the user's record depending on the projectType field in the request
            switch (req.body.projectType) {
                case "Active":
                    recordID = user.userType.FacultyProjects.Active;
                    break;
                case "Archived":
                    recordID = user.userType.FacultyProjects.Archived;
                    break;
                case "Draft":
                    recordID = user.userType.FacultyProjects.Draft;
                    break;
                default:
                    throw error; //if the projectType is not draft, archived, or active then there is an error
            }

            let project = await retrieveOrCacheProjects(req, recordID);
            if (!project) { return res.status(404).json(generateRes(false, 404, "PROJECT_LIST_NOT_FOUND", {})); }
            else { //If the project list was found, then continue
                //get and update the project from the project array that has the matching information 
                project = await Project.updateOne({ _id: recordID, "projects": { "$elemMatch": { "_id": req.body.projectID } } }, {
                    $set: {
                        "projects.$.projectName": req.body.projectDetails.project.projectName,
                        "projects.$.professorId": userId,
                        "projects.$.posted": req.body.projectDetails.project.posted,
                        "projects.$.deadline": req.body.projectDetails.project.deadline,
                        "projects.$.description": req.body.projectDetails.project.description,
                        "projects.$.responsibilities": req.body.projectDetails.project.responsibilities,
                        "projects.$.questions": req.body.projectDetails.project.questions,
                        "projects.$.categories": req.body.projectDetails.project.categories,
                        "projects.$.majors": req.body.projectDetails.project.majors,
                        "projects.$.GPA": req.body.projectDetails.project.GPA,
                    }
                })
                //check that the project was actually found then updated, if not send error response
                if (project.matchedCount === 0 || project.modifiedCount === 0)
                    return res.status(404).json(generateRes(false, 404, "PROJECT_NOT_UPDATED", {}));
                else
                    return res.status(200).json(generateRes(true, 200, "PROJECT_UPDATED", {}));
            }
        } else {
            return res.status(401).json(generateRes(false, 401, "UNAUTHORIZED", {}));
        }
    } catch (error) {
        return res.status(500).json(generateRes(false, 500, "SERVER_ERROR", {}));
    }
}

/*  This function handles the archiving of active requests, should only be used as a PUT request, and requires an access token
    This funciton removes the active project from the active project list, and puts that information into a new archived project

    The request body requires the following fields : 
    projectID (String, the objectID of the active project that will be archived)
*/
const archiveProject = async (req, res) => {
    try {
        const accessToken = req.header('Authorization').split(' ')[1];
        const decodeAccessToken = JWT.verify(accessToken, process.env.SECRET_ACCESS_TOKEN);

        //check if user exists
        const user = await retrieveOrCacheUsers(req, decodeAccessToken.email);

        //check if user type is faculty
        if (user.userType.Type == process.env.FACULTY) {
            if (!req.body.projectID) {
                return res.status(400).json(generateRes(false, 400, "INPUT_ERROR", {
                    errors: error.details,
                    original: error._original
                }));
            }

            const userId = user._id; //Grabs the active projects from the user specified by the access token and then checks to see if the list exists
            let project = await retrieveOrCacheProjects(req, user.userType.FacultyProjects.Active);
            if (!project) { return res.status(404).json(generateRes(false, 404, "PROJECT_LIST_NOT_FOUND", {})); }

            const archProject = project._doc.projects.find(x => x.id === req.body.projectID); //Grabs the specified project from the array from the Record
            if (!archProject) {
                return res.status(404).json(generateRes(false, 404, "PROJECT_NOT_FOUND", {}));
            }
            //If there is not an archived project list, create an archived project list
            if (!user.userType.FacultyProjects.Archived) {
                let newArchiveList = new Project({
                    type: "Archived",
                    professorEmail: user.email,
                    professorName: user.name,
                    projects: [{
                        projectName: archProject.projectName,
                        professorId: archProject.professorId,
                        archived: new Date(),
                        posted: archProject.posted,
                        deadline: archProject.deadline,
                        description: archProject.description,
                        responsibilities: archProject.responsibilities,
                        questions: archProject.questions,
                        applications: archProject.applications,
                        GPA: archProject.GPA,
                        majors: archProject.majors,
                        categories: archProject.categories,
                    }]
                });
                await newArchiveList.save(); //Save the archlive list
                var $set = { $set: {} };
                $set.$set['userType.FacultyProjects.' + "Archived"] = newArchiveList._id;
                await User.findOneAndUpdate({ _id: userId }, $set); //Set the archive id in the user facultyProjects
            } else { //otherwise there exists a faculty record for archived projects so add a new element to the record's array
                let newProject = {
                    projectName: archProject.projectName,
                    professorId: archProject.professorId,
                    archived: new Date(),
                    posted: archProject.posted,
                    deadline: archProject.deadline,
                    description: archProject.description,
                    responsibilities: archProject.responsibilities,
                    questions: archProject.questions,
                    applications: archProject.applications,
                    GPA: archProject.GPA,
                    majors: archProject.majors,
                    categories: archProject.categories,
                };
                await Project.updateOne({ _id: user.userType.FacultyProjects.Archived }, {
                    $push: { //push new project to the array 
                        projects: newProject,
                    }
                })
            }
            //Grab the length from the array and new length from the active array 
            let numProjects = project._doc.projects.length;
            let selectedProject = project.projects.pull(req.body.projectID);

            if (selectedProject.length == numProjects) { //Check that an element was removed, if not send error response
                return res.status(404).json(generateRes(false, 404, "PROJECT_NOT_FOUND", {}));
            }
            else {
                await project.save();
                return res.status(200).json(generateRes(true, 200, "PROJECT_ARCHIVED", {}));
            }
        } else {
            return res.status(401).json(generateRes(false, 401, "UNAUTHORIZED", {}));
        }
    } catch (error) {
        return res.status(500).json(generateRes(false, 500, "SERVER_ERROR", {}));
    }
}

/*  This function handles the faculty decision making for applications, should only be used as a PUT request, and requires an access token
    This funciton sets the values of status for the application to the value given in the request across both the faculty project record and the 
    student application record. This request takes project id, application id, and decision in the request body.

    The request body requires the following fields : 
    projectID (String, the objectID of the active project that was applied to) - applicationID (String, the objectID of the application that is being decide upon)
    decision (String, the decision for the application. Either Accept of Reject)
*/
const applicationDecision = async (req, res) => {
    try {
        const decision = req.body.decision; //checks if the decision is valid otherwise ends the request

        const accessToken = req.header('Authorization').split(' ')[1];
        const decodeAccessToken = JWT.verify(accessToken, process.env.SECRET_ACCESS_TOKEN);

        //check if user exists
        const faculty = await retrieveOrCacheUsers(req, decodeAccessToken.email);

        //check if user type is faculty
        if (faculty.userType.Type == process.env.FACULTY) {
            const { error } = appDecision.validate(req.body);
            if (error) { //validates request body otherwise returns an error
                return res.status(400).json(generateRes(false, 400, "INPUT_ERROR", {
                    errors: error.details,
                    original: error._original
                }));
            }
            //get the projectlist from the faculty account
            let project = await retrieveOrCacheProjects(req, faculty.userType.FacultyProjects.Active);
            if (!project) { return res.status(404).json(generateRes(false, 404, "PROJECT_LIST_NOT_FOUND", {})); }
            //get the index of the project for the projects array and the application index in the specified project's application array
            const projIndex = project.projects.findIndex(y => y.id === req.body.projectID);
            const projAppIndex = project.projects[projIndex].applications.findIndex(x => x.application.toString() === req.body.applicationID);
            //get the application list from the application id
            let application = await retrieveOrCacheApplications(req, project.projects[projIndex].applications[projAppIndex].applicationRecordID);
            if (!application) { return res.status(404).json(generateRes(false, 404, "APPLICATION_LIST_NOT_FOUND", {})); }
            //get the application index from the application record
            const appIndex = application.applications.findIndex(x => x.id === req.body.applicationID);
            //grabs the statuses from the project and application records
            projectStatus = project.projects[projIndex].applications[projAppIndex].status;
            applicationStatus = application.applications[appIndex].status;
            //if the status are not pending, then the request shouldn't modify anything because the decision is already made - MIGHT CHANGE IN FUTURE!
            if ((projectStatus != "Pending" || applicationStatus != "Pending") && (projectStatus != "Hold" || applicationStatus != "Hold")) { return res.status(401).json(generateRes(false, 401, "DECISION_ALREADY_UPDATED", {})); }
            //Set status
            project.projects[projIndex].applications[projAppIndex].status = decision;
            application.applications[appIndex].status = decision;
            application.applications[appIndex].lastModified = new Date();

            const savePromises = [
                project.save(),
                application.save()
            ];

            await Promise.all(savePromises);
            const io = req.app.get('io');
            io.emit('newApplication', 'yo');
            return res.status(200).json(generateRes(true, 200, "APPLICATION_STATUS_UPDATED", {}));
            

        } else {
            return res.status(401).json(generateRes(false, 401, "UNAUTHORIZED", {}));
        }
    } catch (error) {
        return res.status(500).json(generateRes(false, 500, "SERVER_ERROR", {}));
    }
}
//Demo route - used for the demostration to get a list of all active projects.
const getAllActiveProjects = async (req, res) => {
    try {
        const accessToken = req.header('Authorization').split(' ')[1];
        const decodeAccessToken = JWT.verify(accessToken, process.env.SECRET_ACCESS_TOKEN);

        //check if user exists
        const user = await retrieveOrCacheUsers(req, decodeAccessToken.email);
        /*
            if (user.userType.Type != process.env.FACULTY) {
                return res.status(400).json(generateRes(false, 400, "UNAUTHORIZED", {details: "Invalid account type for this route"}));
            }
        */

        //get the project lists for active, archived, and draft projects,
        let activeProjects = await Project.find({ type: "Active" });

        let data = [];

        activeProjects.forEach(x => {
            x.projects.forEach(y => {
                let project = {
                    projectName: y.projectName,
                    professorName: x.professorName,
                    professorEmail: x.professorEmail,
                    title: y.projectName,
                    projectID: y.id,
                    GPA: y.GPA,
                    majors: y.majors,
                    categories: y.categories,
                    description: y.description,
                    responsibilities: y.responsibilities,
                    posted: y.posted,
                    deadline: y.deadline,
                    questions: y.questions
                }
                data.push(project);
            });
        });

        //This specific response doesn't work with the generateRes method, will look into solutions
        return res.status(200).json({ success: { status: 200, message: "PROJECTS_FOUND", data } });


    } catch (error) {
        return res.status(500).json(generateRes(false, 500, "SERVER_ERROR", {}));
    }
}

/*  This function returns a single applicant's data for a professor. Should only be used with a POST request, and requires and access token,

    This function takes fields in the request body: projectID (String, the id of the project that the faculty member will be )
    and applicationID (String, the id of the application that the faculty wishes to view)
*/
const fetchApplicant = async (req, res) => {
    try {
        const accessToken = req.header('Authorization').split(' ')[1];
        const decodeAccessToken = JWT.verify(accessToken, process.env.SECRET_ACCESS_TOKEN);

        //check if user exists
        const user = await retrieveOrCacheUsers(req, decodeAccessToken.email);

        //check if user type is faculty
        if (user.userType.Type === parseInt(process.env.FACULTY)) {
            const projectsList = user.userType.FacultyProjects;
            //get the project lists for active, archived, and draft projects

            let activeProjects;

            activeProjects = await retrieveOrCacheProjects(req, projectsList.Active);

            //This block of code grabs the specified project from the projects record, then grabs the applicant index from the array of applicants and sets the applicant variable
            let applicant, project, applicantIndex;
            if (activeProjects) {
                project = activeProjects.projects.find((element) => element.id.toString() == req.body.projectID);
                applicantIndex = project.applications.findIndex((element) => element.application.toString() === req.body.applicationID);
                if (applicantIndex == -1) { return res.status(404).json(generateRes(false, 404, "APPLICANT_NOT_FOUND")); }
                else { applicant = project.applications[applicantIndex]; }
            }

            //This block of code then grabs teh specified applicantion record from the applicant's record in the project database
            //It then sets up the applicantData object to be sent back in the request
            let applicantRecord = await retrieveOrCacheApplications(req, applicant.applicationRecordID);
            let applicantData;
            if (applicantRecord) {
                const application = applicantRecord.applications.find((element) => element.id == applicant.application.toString());
                applicantData = {
                    status: applicant.status,
                    name: applicant.name,
                    GPA: applicant.GPA,
                    major: applicant.major,
                    email: applicant.email,
                    appliedDate: application.appliedDate,
                    answers: application.questions,
                    application: applicant.application,
                }
            }
            //sets up the projectData to set back in the response
            let projectData = {
                projectName: project.projectName,
                professorId: project.professorId,
                posted: project.posted,
                deadline: project.deadline,
                description: project.description,
                responsibilities: project.responsibilities,
                questions: project.questions,
                GPA: project.GPA,
                majors: project.majors,
                categories: project.categories,
            }
            //prepares the final object that will be returned in the response.
            let response = {
                applicantData: applicantData,
                projectData: projectData
            }

            return res.status(200).json({ success: { status: 200, message: "APPLICANT_FOUND", responseData: response } });
        } else {
            return res.status(401).json(generateRes(false, 401, "UNAUTHORIZED", {}));
        }
    } catch (error) {
        return res.status(500).json(generateRes(false, 500, "SERVER_ERROR", {}));
    }
}

/*  This is a general fetchApplicants route which fetches only basic information from each application. This is used in the faculty overiew web page,
    and is seperate from the fetchApplicantsFromProject which grabs more indepth information from the database and uses a lot more network operations

    This function grabs the basic information from all applicants from an active projects, it requires a faculty access token and a projectID in the request body.
    This function should be used with put requests, and it will grab the applicant data from the specified project. That data includes :
    applicationRecordID, application, status, name, GPA, major, email, appliedDate, and application object id
*/
const fetchAllApplicants = async (req, res) => {
    try {
        const accessToken = req.header('Authorization').split(' ')[1];
        const decodeAccessToken = JWT.verify(accessToken, process.env.SECRET_ACCESS_TOKEN);

        //check if user exists
        const user = await retrieveOrCacheUsers(req, decodeAccessToken.email);

        //check if user type is faculty
        if (user.userType.Type === parseInt(process.env.FACULTY)) {
            const projectsList = user.userType.FacultyProjects;
            //get the project lists for active, archived, and draft projects

            let activeProjects;

            activeProjects = await retrieveOrCacheProjects(req, projectsList.Active);

            let theApplicants = {}; //object to store the array of applicants
            if (activeProjects) {
                for (let i = 0; i < activeProjects.projects.length; i++) { //Checks every project and if it matches the provided id, then store the applicants in the obj
                    if (activeProjects.projects[i]._id.toString() === req.body.projectID) {
                        theApplicants = activeProjects.projects[i].applications;
                        break;
                    }
                }
            } else {
                return res.status(400).json(generateRes(false, 400, "BAD_REQUEST", { details: "No active project list exists." }));
            }

            //This specific response doesn't work with the generateRes method, will look into solutions
            return res.status(200).json({ success: { status: 200, message: "APPLICANTS_FOUND", applicants: theApplicants } });
        } else {
            return res.status(401).json(generateRes(false, 401, "UNAUTHORIZED", {}));
        }
    } catch (error) {
        return res.status(500).json(generateRes(false, 500, "SERVER_ERROR", {}));
    }
}

/*  This is a more specific fetchApplicants function. This will grab additional data only available in student records, and as such requires more
    network operations. It will be used with the faculty view project page. The data returned by this function includes: question object (with answers),
    GPA, majors, name, staus, email, and applied date.

    This request only requires a projectID in the body, as well as a faculty access token. 
*/
const fetchApplicantsFromProject = async (req, res) => {
    try {
        const accessToken = req.header('Authorization').split(' ')[1];
        const decodeAccessToken = JWT.verify(accessToken, process.env.SECRET_ACCESS_TOKEN);

        //check if user exists
        const user = await retrieveOrCacheUsers(req, decodeAccessToken.email);

        //check if user type is faculty
        if (user.userType.Type === parseInt(process.env.FACULTY)) {
            const projectsList = user.userType.FacultyProjects;
            //get the project lists for active, archived, and draft projects

            let activeProjects, project;
            activeProjects = await retrieveOrCacheProjects(req, projectsList.Active);

            let theApplicants = []; //An array for the applicants
            if (activeProjects) {
                project = activeProjects.projects.find(x => x.id.toString() === req.body.projectID);
            } else {
                return res.status(400).json(generateRes(false, 400, "BAD_REQUEST", { details: "No active project list exists." }));
            }

            if (!activeProjects) {
                return res.status(404).json(generateRes(false, 404, "BAD_REQUEST", { details: "Project not found." }));
            }

            const applications = project.applications; //grab applications from project
            const promises = []; //Promises array

            applications.forEach(x => promises.push(Application.findOne({ _id: x.applicationRecordID })
                .then(applicationRecord => {
                    if (applicationRecord) {
                        let application = applicationRecord.applications.find(y => y.id === x.application.toString());

                        if (application) {
                            theApplicants.push({
                                questions: application.questions,
                                email: x.email,
                                status: x.status,
                                GPA: x.GPA,
                                name: x.name,
                                majors: x.major,
                                appliedDate: x.appliedDate,
                                lastModified: application.lastUpdated,
                                location: x.location,
                                application: x.application,
                            })
                        }
                    }
                })
            ));

            await Promise.all(promises);
            theApplicants.sort((x, y) => x.name.localeCompare(y.name)); //Sorts applicants by name

            //This specific response doesn't work with the generateRes method, will look into solutions
            return res.status(200).json({ success: { status: 200, message: "APPLICANTS_FOUND", applicants: theApplicants } });
        } else {
            return res.status(401).json(generateRes(false, 401, "UNAUTHORIZED", {}));
        }
    } catch (error) {
        return res.status(500).json(generateRes(false, 500, "SERVER_ERROR", {}));
    }
}

const publishProject = async (req, res) => {
    try {
        const accessToken = req.header('Authorization').split(' ')[1];
        const decodeAccessToken = JWT.verify(accessToken, process.env.SECRET_ACCESS_TOKEN);

        //check if user exists
        const user = await retrieveOrCacheUsers(req, decodeAccessToken.email);

        //check if user type is faculty
        if (user.userType.Type === parseInt(process.env.FACULTY)) {
            let draftProjectRecord, activeProjectRecord;

            const promises = [
                retrieveOrCacheProjects(req, user.userType.FacultyProjects.Draft),
                retrieveOrCacheProjects(req, user.userType.FacultyProjects.Active),
            ];

            await Promise.all(promises).then(results => {
                draftProjectRecord = results[0];
                activeProjectRecord = results[1];
            });

            if (!draftProjectRecord) { return res.status(404).json(generateRes(false, 404, "PROJECTS_NOT_FOUND", {})); }
            let selectedProject = draftProjectRecord.projects.find(x => x.id.toString() === req.body.projectID);
            if (!selectedProject) { return res.status(404).json(generateRes(false, 404, "PROJECT_NOT_FOUND", {})); }

            const projectObject = {
                projectName: selectedProject.projectName,
                posted: new Date(),
                deadline: selectedProject.deadline,
                description: selectedProject.description,
                responsibilities: selectedProject.responsibilities,
                questions: selectedProject.questions || [], //If no questions exist, create empty array which will be used in validation if applications are submitted without questions
                GPA: selectedProject.GPA,
                majors: selectedProject.majors,
                categories: selectedProject.categories,
            }

            let numProjects = draftProjectRecord.projects.length;
            let newProjectList = draftProjectRecord.projects.pull(req.body.projectID);

            if (newProjectList.length == numProjects) { //Check that an element was removed, if not send error response
                return res.status(404).json(generateRes(false, 404, "PROJECT_NOT_FOUND", {}));
            }

            if (activeProjectRecord) {
                const promises = [
                    Project.updateOne({ _id: activeProjectRecord._id }, {
                        $push: { //push new project to the array 
                            projects: projectObject,
                        }
                    }),
                    draftProjectRecord.save(),
                ];

                await Promise.all(promises);
            } else {
                let newProjectList = new Project({
                    type: "Active",
                    professorEmail: user.email,
                    professorName: user.name,
                    projects: [projectObject]
                });

                const promises = [
                    newProjectList.save(),
                    draftProjectRecord.save(),
                ];

                await Promise.all(promises).then((results) => {
                    newProjectList = results[0];
                });

                var $set = { $set: {} }; //This sets up the $set dynamically so that it can either save to DraftProjects or ActiveProjects
                $set.$set['userType.FacultyProjects.Active'] = newProjectList._id;

                await User.findOneAndUpdate({ email: user.email }, $set);
            }

            return res.status(200).json(generateRes(true, 200, "DRAFT_PUBLISHED", {}));
        } else {
            return res.status(401).json(generateRes(false, 401, "UNAUTHORIZED", {}));
        }
    } catch (error) {
        return res.status(500).json(generateRes(false, 500, "SERVER_ERROR", {}));
    }
}

//This helper method is used to create a object that contains all project information which will be used to send back to users using getProjects
function createProjectObj(project, projectType, count) {
    if (typeof projectType !== 'string') { throw new Error('projectType is not a string!') }
    let obj = {
        projectType: projectType,
        applications: project.applications,
        deadline: project.deadline,
        description: project.description,
        majors: project.majors,
        projectName: project.projectName,
        professorId: project.professorId,
        id: project._id.toString(),
        questions: project.questions,
        posted: project.posted,
        GPA: project.GPA,
        number: count,
        numApp: project.applications.length
    }
    return obj;
}

module.exports = {
    createProject, deleteProject,
    getProjects, updateProject,
    archiveProject, applicationDecision,
    getAllActiveProjects, fetchAllApplicants,
    fetchApplicant, getProject,
    fetchApplicantsFromProject,
    publishProject,
};