import jwt from 'jsonwebtoken';

import Application from '../../models/application.js';
import Project from '../../models/project.js';
import User from '../../models/user.js';
import generateRes from '../../helpers/generateJSON.js';
import { applicationSchema } from '../../helpers/inputValidation/requestValidation.js';
import { retrieveOrCacheUsers, retrieveOrCacheProjects, retrieveOrCacheApplications } from '../../helpers/schemaCaching.js';

/*  This function handles the application creation for the student accounts. This function should be used with POST requests and 
    requires an access token. This function should create a new applicaiton object in the user's application record as well as create
    an object that has the application object ID and record ID in the project that the student applied too.

    This request takes three fields : 
    projectID (String, the object id of the project that the student is applying to) - professorEmail (String, the email of the professor
    that created the project) - questions (Array, the questions objects that stores all information for the application) 
*/
const createApplication = async (req, res) => { //TODO ADD DEADLINE CHECKING
    try {
        //Check for error in application http request
        const { error } = applicationSchema.validate(req.body);
        if (error) {
            return res.status(400).json(generateRes(false, 400, "INPUT_ERROR", {
                errors: error.details,
                original: error._original
            }));
        }

        const accessToken = req.header('Authorization').split(' ')[1];
        const decodeAccessToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        //student and faculty record
        let student;
        let faculty;
        //promise to make both user requests at the same time
        const promises = [
            retrieveOrCacheUsers(req, decodeAccessToken.email),
            retrieveOrCacheUsers(req, req.body.professorEmail)
        ];

        await Promise.all(promises).then(results => {
            student = results[0];
            faculty = results[1];
        });
        //check if user type is student
        if (student && student.userType.Type == process.env.STUDENT) {

            const activeProjectID = faculty.userType.FacultyProjects.Active; //activeProjectID is the id of the activeProjects record for the faculty accounts
            const activeProjects = await retrieveOrCacheProjects(req, activeProjectID); //grabs the array of active projects from the project record
            if (!activeProjects) { return res.status(404).json(generateRes(false, 404, "PROJECT_LIST_NOT_FOUND", {})) }

            const existingProject = activeProjects._doc.projects.find(x => x.id === req.body.projectID); //Grabs the specified project from the array by the projectID in the request

            if (!existingProject) { //checks if the project specified by the ID exists
                return res.status(400).json(generateRes(false, 400, "INPUT_ERROR", { "details": "Invalid projectID" }));
            }
            //gets the ID of the record that holds the student applications 
            const applicationRecord = student.userType.studentApplications;
            const status = "Pending";

            //This validates that the student meets the minimum criteria i.e. GPA / Major
            if (existingProject.GPA > student.userType.GPA) { return res.status(409).json(generateRes(false, 409, "INVALID_GPA", {})) }
            let majorIncluded = false;
            student.userType.Major.forEach((major) => {
                if (existingProject.majors.includes(major)) { majorIncluded = true; }
            });
            if (!majorIncluded) { return res.status(409).json(generateRes(false, 409, "INVALID_MAJOR", {})) }

            //if there is no active mongodb record for student's applications then create a new record
            if (!applicationRecord) {
                let applicationList = new Application({
                    user: student.name,
                    applications: [
                        {
                            questions: req.body.questions,
                            opportunityRecordId: activeProjectID,
                            opportunityId: existingProject._id,
                            status: status,
                            appliedDate: new Date(),
                            lastModified: new Date(),
                            lastUpdated: new Date(),
                        }
                    ]
                });
                //these promises save the application list for the new record
                const savePromises = [
                    applicationList.save(),
                    Project.updateOne({ _id: activeProjectID, "projects": { "$elemMatch": { "_id": existingProject._id } } }, {
                        $push: {
                            'projects.$.applications': {
                                'applicationRecordID': applicationList._id,
                                'application': applicationList.applications[0]._id,
                                'status': status,
                                'name': student.name,
                                'GPA': student.userType.GPA,
                                'major': student.userType.Major,
                                'email': student.email,
                                'appliedDate': new Date(),
                                'location': student.universityLocation,
                            }
                        }
                    }),
                    User.updateOne({ email: student.email }, {
                        $set: {
                            'userType.studentApplications': applicationList._id
                        }
                    })
                ];
                //save all
                await Promise.all(savePromises);
            } else { //otherwise there exists a faculty record for active projects so add a new element to the record's array
                //This checks if an application for the project was already made, as if it was teh applicationRecordID that corresponds to the
                //student will exist in the applicants pool, otherwise it will not and the application can be made

                const existingApp = existingProject.applications.find(x => x.applicationRecordID == applicationRecord._id.toString());
                if (existingApp) { return res.status(403).json(generateRes(false, 403, "APPLICATION_ALREADY_EXISTS", {})) }

                let newApplication = {
                    questions: req.body.questions,
                    opportunityRecordId: activeProjectID,
                    opportunityId: existingProject._id,
                    appliedDate: new Date(),
                    status: status,
                    lastModified: new Date(),
                    lastUpdated: new Date(),
                };
                //these await statements cannot be used with a promise because they require the newApplication ID which needs to be 
                //pushed and then fetched from the database
                await Application.updateOne({ _id: applicationRecord }, {
                    $push: { //push new application to the array 
                        applications: newApplication,
                    }
                });
                //Because the ID in the db doesn't exist until it is in the db, retrieve the updated document and then get the newApplication object into newApp
                //DO NOT USE retrieveOrCacheApplication here as it is necessary to refetch the data
                const doc = await Application.findOne({ _id: applicationRecord });
                const newApp = doc._doc.applications.find(y => y.opportunityId == existingProject.id);
                //update the project with a new application
                console.log(student.GPA + student.Major);
                await Project.updateOne({ _id: activeProjectID, "projects": { "$elemMatch": { "_id": existingProject._id } } }, {
                    $push: {
                        'projects.$.applications': {
                            'applicationRecordID': applicationRecord,
                            'application': newApp._id,
                            'status': status,
                            'name': student.name,
                            'GPA': student.userType.GPA,
                            'major': student.userType.Major,
                            'email': student.email,
                            'appliedDate': new Date(),
                            'location': student.universityLocation,
                        }
                    }
                });
            }
            return res.status(200).json(generateRes(true, 200, "APPLICATION_CREATED", {}));
        } else {
            return res.status(401).json(generateRes(false, 401, "UNAUTHORIZED", {}));
        }
    } catch (error) {
        return res.status(500).json(generateRes(false, 500, "SERVER_ERROR", {}));
    }
}

/*  This function handles the application update for the student accounts. This function should be used with POST requests and 
    requires an access token. This function should update an existing student application and takes most of the same data as the create application
    function - The information in the application is not shared with the faculty's project record, the only data shared there is from the student's
    user account record. As such, no data consistency functions are required 

    This request takes two fields : 
    questions (Array, the questions objects that stores all information for the application) - applicationID (String, the id
    of the applicantion object that will be updated)
*/
const updateApplication = async (req, res) => {
    try {
        //Validate the http request body
        const { error } = applicationSchema.validate(req.body);
        if (error) {
            return res.status(400).json(generateRes(false, 400, "INPUT_ERROR", {
                errors: error.details,
                original: error._original
            }));
        }

        const accessToken = req.header('Authorization').split(' ')[1];
        const decodeAccessToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

        let student = await retrieveOrCacheUsers(req, decodeAccessToken.email);

        if (student && student.userType.Type === parseInt(process.env.STUDENT)) {
            //fetch application list from db, then check if it exists
            let applications = await retrieveOrCacheApplications(req, student.userType.studentApplications);
            if (!applications) { return res.status(404).json(generateRes(false, 404, "APPLICATION_LIST_NOT_FOUND", {})) }
            //update the application that matches by the id provided in the body
            applications = await Application.updateOne({ _id: student.userType.studentApplications, "applications": { "$elemMatch": { "_id": req.body.applicationID } } }, {
                $set: {
                    "applications.$.questions": req.body.questions,
                    "applications.$.lastUpdated": new Date()
                }
            });
            //ensure that the application was actually updated
            if (applications.matchedCount === 0)
                return res.status(404).json(generateRes(false, 404, "APPLICATION_NOT_FOUND", {}));
            else
                return res.status(200).json(generateRes(true, 200, "APPLICATION_UPDATED", {}));

        } else {
            return res.status(401).json(generateRes(false, 401, "UNAUTHORIZED", {}));
        }
    } catch (error) {
        return res.status(500).json(generateRes(false, 500, "SERVER_ERROR", {}));
    }
}

/*  This function handles the application deletion for the student accounts. This function should be used with DELETE request and 
    requires an access token. This function should remove the specified application from the student's application record as well as 
    from the array of applications in the faculty's project record.

    This request takes one fields : 
    applicationID (String, the object id of the application to be deleted) 
*/
const deleteApplication = async (req, res) => {
    try {
        const accessToken = req.header('Authorization').split(' ')[1];
        const decodeAccessToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

        //get the student and store applicationID in local variable
        const student = await retrieveOrCacheUsers(req, decodeAccessToken.email);
        const applicationID = req.body.applicationID;
        //check if user type is student
        if (student.userType.Type === parseInt(process.env.STUDENT)) {

            if (!applicationID) { //if there isn't an applicationID throw an error
                return res.status(400).json(generateRes(false, 400, "INPUT_ERROR", {
                    errors: error.details,
                    original: error._original
                }));
            }

            //recordID is the student's application record ID and will be used to get the application list 
            const recordID = student.userType.studentApplications;

            //gets the application record, otherwise sends error response 
            let applications = await retrieveOrCacheApplications(req, recordID);
            if (!applications) { return res.status(404).json(generateRes(false, 404, "APPLICATION_LIST_NOT_FOUND", {})) }
            else {
                //get the specific application object to get the project object id and then fetch that project
                const selectedApp = applications._doc.applications.find(y => y.id === applicationID);
                const project = await retrieveOrCacheProjects(req, selectedApp.opportunityRecordId);
                //get the specific project index that application is for and then get the index of the respective application object in that project's application array
                const projectIndex = project._doc.projects.findIndex(y => y.id === selectedApp.opportunityId.toString());
                const selectedProjectAppID = project._doc.projects[projectIndex].applications.find(y => y.application.toString() === applicationID);

                /*  these variables are to ensure that an element is removed from the respective arrays
                    projectNumApplicaitons - the number of applications for the specific project | projectSelectedApplication the applicaitons array without the application specified in the request body
                    numApplicaitons - the number of applications in the application record | selectedApplication the applicaitons array without the application specified in the request body
                */
                const projectNumApplications = project._doc.projects[projectIndex].applications.length;
                const projectSelectedApplication = project._doc.projects[projectIndex].applications.pull(selectedProjectAppID._id);
                const numApplications = applications._doc.applications.length;
                const selectedApplication = applications.applications.pull(applicationID);
                //if the length of the new arrays + 1 is not equal to the length of the old arrays, then the application was not removed therefore an error occurred
                if (selectedApplication.length + 1 != numApplications || projectSelectedApplication.length + 1 != projectNumApplications) { //Check that an element was removed, if not send error response
                    return res.status(404).json(generateRes(false, 404, "APPLICATION_NOT_FOUND", {}));
                }
                else {
                    const savePromises = [
                        project.save(),
                        applications.save()
                    ];

                    await Promise.all(savePromises);
                    return res.status(200).json(generateRes(true, 200, "APPLICATION_DELETED", {}));
                }
            }
        } else {
            return res.status(401).json(generateRes(false, 401, "UNAUTHORIZED", {}));
        }
    } catch (error) {
        return res.status(500).json(generateRes(false, 500, "SERVER_ERROR", {}));
    }
}

/*  This function handles the application applicaiton retrieval for student applications. It should be used with GET request and requires an
    access token. The request takes no fields in the request body.
*/
const getApplications = async (req, res) => {
    try {
        const accessToken = req.header('Authorization').split(' ')[1];
        const decodeAccessToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

        //check if user exists
        const student = await retrieveOrCacheUsers(req, decodeAccessToken.email);

        if (student.userType.Type === parseInt(process.env.STUDENT)) {
            const applicationList = student.userType.studentApplications;
            //get the project lists for active, archived, and draft projects
            const applications = await retrieveOrCacheApplications(req, applicationList);
            if (!applications) { return res.status(404).json(generateRes(false, 404, "APPLICATION_LIST_NOT_FOUND", {})); }

            let recordIDs = []; //array for each projectRecordID
            let opportunityIDs = {}; //dictionary where each key is a projectRecordID and its value is an array with each element being an array of size 2, with the opporutnityID and the index of that application

            applications.applications.forEach((item, index) => {
                /*  it was difficult to compare the IDs of the objects in the application as they are not stored as strings but rather objects.
                    So what I did was I added both the ID object and the same ID but with .toString() to make it a string, I then checked if the 
                    ID.toString() was in the array of records and if so I didn't add the duplicated project record id. Below I only grabbed the 
                    even elements to avoid duplication
                */
                if (!recordIDs.includes(item.opportunityRecordId.toString())) {
                    recordIDs.push(item.opportunityRecordId);
                    recordIDs.push(item.opportunityRecordId.toString());
                }

                //This checks if the opporunityIDs object has the opportunityRecord as a field and if not creates an array, otherwise pushes to the array
                if (!opportunityIDs[item.opportunityRecordId.toString()]) {
                    opportunityIDs[item.opportunityRecordId.toString()] = [[item.opportunityId, index]];
                } else {
                    opportunityIDs[item.opportunityRecordId.toString()].push([item.opportunityId, index]);
                }
            });
            //Get the even elements and intialize a return array
            const evenElements = [...recordIDs].filter((element, index) => index % 2 === 0);
            let returnArray = [];
            //get the project records that are in the array of record ids, uses a more specific db request to get multiple projects so it should not use the retrieveOrCacheProjects
            const posts = await Project.find({ _id: { $in: evenElements } });
            /*  For each projectrecord in the posts array, check if the opporunityIDs object has a field for that specified projectRecord 
                Then for each of the array elements in the corresponding value, get the application from the index in the value array and the projectIndex from the 
                opporunity id in the value array
            */
            posts.forEach((postItem) => {
                if (opportunityIDs[postItem.id]) {
                    opportunityIDs[postItem.id].forEach((item) => {
                        const appIndex = item[1];
                        const projIndex = postItem._doc.projects.findIndex(y => y.id === item[0].toString());
                        //create a new index for the return array from the values of the project records and application records
                        let newObj = {
                            questions: applications.applications[appIndex].questions,
                            status: applications.applications[appIndex].status,
                            opportunityRecordId: applications.applications[appIndex].opportunityRecordId,
                            opportunityId: applications.applications[appIndex].opportunityId,
                            projectName: postItem.projects[projIndex].projectName,
                            posted: postItem.projects[projIndex].posted,
                            description: postItem.projects[projIndex].description,
                            professorEmail: postItem.professorEmail,
                            appliedDate: applications.applications[appIndex].appliedDate,
                            deadline: postItem.projects[projIndex].deadline,
                            GPAREQ: postItem.projects[projIndex].GPA,
                            projectSponsor: postItem.professorName,
                            applicationID: applications.applications[appIndex]._id,
                        }
                        returnArray.push(newObj);
                    });
                }
            });

            return res.status(200).json({ success: { status: 200, message: "APPLICATIONS_FOUND", applications: returnArray } });
        } else {
            return res.status(401).json(generateRes(false, 401, "UNAUTHORIZED", {}));
        }
    } catch (error) {
        return res.status(500).json(generateRes(false, 500, "SERVER_ERROR", {}));
    }
}

/*  This route grabs a specific application from a student's record. It requires a student access token and should be used with a post request
    This route takes one field in the http body which is applicationID. This is a string that is the object id of the application object in the 
    array of applications that will be fetched from the db
*/
const getApplication = async (req, res) => {
    try {
        const accessToken = req.header('Authorization').split(' ')[1];
        const decodeAccessToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

        //check if user exists
        const student = await retrieveOrCacheUsers(req, decodeAccessToken.email);

        if (student.userType.Type === parseInt(process.env.STUDENT)) {
            const applicationList = student.userType.studentApplications;
            //get the project lists for active, archived, and draft projects
            const applications = await retrieveOrCacheApplications(req, applicationList);
            if (!applications) { return res.status(404).json(generateRes(false, 404, "APPLICATION_LIST_NOT_FOUND", {})); }

            let application = applications.applications.find((x) => x.id === req.body.applicationID);
            const project = await retrieveOrCacheProjects(req, application.opportunityRecordId);
            let returnApplication = { ...application._doc };

            returnApplication.professorEmail = project.professorEmail;
            if (application) { return res.status(200).json({ success: { status: 200, message: "APPLICATION_FOUND", application: returnApplication } }); }
            else { return res.status(404).json(generateRes(false, 404, "APPLICATION_NOT_FOUND", {})); }
        } else {
            return res.status(401).json(generateRes(false, 401, "UNAUTHORIZED", {}));
        }
    } catch (error) {
        return res.status(500).json(generateRes(false, 500, "SERVER_ERROR", {}));
    }
}

const getTopRecentApplications = async (req, res) => {
    try {
        const numApplications = req.params.num || 3;

        const accessToken = req.header('Authorization').split(' ')[1];
        const decodeAccessToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

        //check if user exists
        const student = await retrieveOrCacheUsers(req, decodeAccessToken.email);

        if (student.userType.Type == parseInt(process.env.STUDENT)) {
            const applicationList = student.userType.studentApplications;
            //get the project lists for active, archived, and draft projects
            const applications = await retrieveOrCacheApplications(req, applicationList);

            // sort according to most recent
            const sortedApplications = applications.applications.toSorted((a, b) => {
                b.lastModified.getTime() - a.lastModified.getTime();
            });

            const changedApplications = sortedApplications.filter(application => {
                application.lastModified !== application.appliedDate;
            }).toSpliced(numApplications);
            const unchangedApplications = sortedApplications.filter(application => {
                application.lastModified === application.appliedDate;
            });

            // get the top n applications by getting the most recently updated applictions
            // first (e.g., status updated to accepted/reject), followed by most recently
            // posted if necessary
            const topApplications = (changedApplications.length < numApplications)
                ? changedApplications.concat(unchangedApplications).toSpliced(numApplications)
                : changedApplications;

            const opportunitySet = new Set();
            for (const application of topApplications) {
                const recordId = application.opportunityRecordId.toString();
                opportunitySet.add(recordId);
            }

            // find the professors associated with the top applications, uses a specific db request for multiple projects so shoudln't use retrieveOrCacheProjects
            const professors = await Project.find({ _id: { $in: opportunitySet.values().toArray() } });

            // compile relevent information about the top applications in an array
            const topApplicationsData = new Array(topApplications.length);
            for (const application of topApplications) {
                const professor = professors.find((prof) => prof.id.toString() === application.opportunityRecordId.toString());
                const project = professor.projects.find((proj) => proj.id.toString() === application.opportunityId.toString());

                let applicationData = {
                    questions: application.questions,
                    status: application.status,
                    opportunityRecordId: application.opportunityRecordId,
                    opportunityId: application.opportunityId,
                    projectName: project.projectName,
                    posted: project.posted,
                    description: project.description,
                    professorEmail: professor.professorEmail,
                };
                topApplicationsData.push(applicationData);
            }

            return res.status(200).json({ success: { status: 200, message: "APPLICATIONS_FOUND", applications: returnArray } });
        } else {
            return res.status(401).json(generateRes(false, 401, "UNAUTHORIZED", {}));
        }
    } catch (error) {
        return res.status(500).json(generateRes(false, 500, "SERVER_ERROR", {}));
    }
};

/*  This simple function allows students to get the project data of an active faculty project. It requires an a student access token to use and should be
    used with a post request. It takes fields in the http body, professorEmail and projectID. These allow the server to grab the specified professor's 
    active project through the id. This function should only ever be able to grab active project data as otherwise it could allow students to access data 
    that is private. (archived or draft projects)

    This response should return details about the project including and limited to :
    projectName, questions, posted date, deadline, description, responsibilities, categories, majors, and GPA requirement. This route should NEVER be able 
    to return applicant data!
 */
const getProjectData = async (req, res) => {
    try {
        //ensure that the body contains the necessary fields
        if (!req.body.professorEmail || !req.body.projectID) { return res.status(400).json(generateRes(false, 400, "INPUT_ERROR", {})); }
        const accessToken = req.header('Authorization').split(' ')[1];
        const decodeAccessToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

        const promises = [ //promises to grab both accounts
            retrieveOrCacheUsers(req, decodeAccessToken.email),
            retrieveOrCacheUsers(req, req.body.professorEmail)]

        let student;
        let faculty;

        await Promise.all(promises).then(results => {
            student = results[0];
            faculty = results[1];
        });

        //check if user type is a student
        if (student.userType.Type == process.env.STUDENT) {
            const profID = faculty._id.toString(); //store faculty id for later use

            let recordID = faculty.userType.FacultyProjects.Active; //recordID will be taken from the user's record depending on the projectType field in the request

            let projectRecord = await retrieveOrCacheProjects(req, recordID); //get the active project record
            if (!projectRecord) { return res.status(404).json(generateRes(false, 404, "PROJECT_LIST_NOT_FOUND", {})); }
            else { //If the project list was found, then continue
                //get the project that matches the projectID
                const project = projectRecord.projects.find(x => x.id === req.body.projectID);
                if (project) { //IMPORTANT : Ensure that applicant data is never returned through this method, as that data should be private
                    let returnProject = {
                        projectName: project.projectName,
                        questions: project.questions,
                        description: project.description,
                        posted: project.posted.toISOString(),
                        deadline: project.deadline.toISOString(),
                        professorId: profID,
                        categories: project.categories,
                        majors: project.majors,
                        GPA: project.GPA,
                        responsibilities: project.responsibilities,
                        professorName: projectRecord.professorName
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

export {
    createApplication,
    deleteApplication,
    getApplications,
    getTopRecentApplications,
    updateApplication,
    getProjectData,
    getApplication,
};
