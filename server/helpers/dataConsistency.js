const Application = require('../models/application');
const Project = require('../models/project');
const User = require('../models/user');
const JWT = require('jsonwebtoken');
const generateRes = require('../helpers/generateJSON');
const { retrieveOrCacheApplications } = require('./schemaCaching');

/*  This helper function updates student's information in their associated application record and project record. It takes three parameters, 
    User, the user schema object of the student - modifyFields, an object with the fields that are going to be modified - originalData, an object 
    with the student's original data. 

    This function will cause the student's appplication record to have an updated name, and any instance of application in project objects they applied to
    will have the data updated to match the new student information. If there is an error of any kind, the catch statement will reset the student's information
    and return false, which indicates that an error occurred. Otherwise the method will return true.
*/
const updateApplicationRecords = async (req, user, modifyFields, originalData) => {
    try {
        //These variables store the value of the moifyFields if they exist, otherwise they store the originalData
        const GPA = modifyFields.GPA || originalData.GPA;
        const Major = modifyFields.Major || originalData.Major;
        const studentName = modifyFields.name || originalData.name;
        const universityLocation = modifyFields.universityLocation || originalData.universityLocation;

        //Check if the user has any applications, otherwise end the method because there is no need to update non existant data.
        if (!user.userType.studentApplications) { return true; }
        let applications = await retrieveOrCacheApplications(req, user.userType.studentApplications);//Get application record
        if (!applications) { return false; } //if the application record was unable to be accessed, there is an error

        const promises = []; //Promises array

        for (const app of applications.applications) { //for loop that creates multiple promises and then store them into the project array
            const project = Project.findOneAndUpdate(
                {   //find the project associated with the application's recordId and the opportunityId, or in other words the project that was applied to
                    _id: app.opportunityRecordId,
                    "projects._id": app.opportunityId
                },
                {
                    $set: { //Set the values of the applicant object in the project object to the variables containing the data
                        "projects.$.applications.$[appIndex].GPA": GPA,
                        "projects.$.applications.$[appIndex].name": studentName,
                        "projects.$.applications.$[appIndex].major": Major,
                        "projects.$.applications.$[appIndex].location": universityLocation,
                    }
                },
                {
                    arrayFilters: [{ "appIndex.application": app.id }],
                }
            );
            if (project) { //If a promise exists, push it
                promises.push(project);
            }
        }
        //This will update the application record's name to match the new name if the name is being updated
        if (studentName !== originalData.name) { promises.push(Application.updateOne({ _id: user.userType.studentApplications }, { user: studentName })); }

        await Promise.all(promises); //await the promises, then return
        return true;
    } catch (error) { //If there is an error, then reset the student's data to the original values
        if (originalData.name) {
            user.name = originalData.name;
        }
        if (originalData.GPA) {
            user.GPA = originalData.GPA;
        }
        if (originalData.Major) {
            user.Major = originalData.Major;
        }
        if (originalData.universityLocation) {
            user.universityLocation = originalData.universityLocation;
        }

        await user.save();
        return false;
    }
}

const updateQuestions = async () => {

}

module.exports = {
    updateApplicationRecords,
}