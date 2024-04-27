//  This JavaScript file will handle the necessary validation for creating accountActions such as registration and modification, any other 
//  account related validations should be put in here.

const JWT = require('jsonwebtoken');
const generateRes = require('../generateJSON');
const { getMajors } = require('./validationHelpers');
const { retrieveOrCacheMajors, retrieveOrCacheUsers } = require('../schemaCaching');

//  This middleware provides the validation required for account registering, such as ensuring that the account's major and GPA is correct (for student)
const registerMajorValidation = async (req, res, next) => {
    try {
        const majors = await retrieveOrCacheMajors(req, req.body.universityLocation);
        if (!majors && (req.body.accountType == process.env.STUDENT || req.body.accountType == process.env.FACULTY)) { //if there are no majors and the account type is faculty or student there is an error
            res.status(400).json(generateRes(false, 400, "INPUT_ERROR", { details: "Invalid university location." }));
            return;
        }
        //If account type is a student, then validate its fields are valid. If other faculty specific validation becomes required, then create an else if to address that case
        if (req.body.accountType == process.env.STUDENT) {
            if (!req.body.GPA || !req.body.Major) {
                res.status(400).json(generateRes(false, 400, "INPUT_ERROR", { details: "Missing student fields." }));
                return;
            }
            //Validate that the GPA is within normal bounds: 
            if (req.body.GPA > 4 || req.body.GPA < 0) {
                res.status(400).json(generateRes(false, 400, "INPUT_ERROR", { details: "GPA out of bounds." }));
                return;
            }
            //ensure the majors the student is selecting is valid
            if (!req.body.Major.every(x => majors.majors.includes(x))) {
                res.status(400).json(generateRes(false, 400, "INPUT_ERROR", { details: "Provided major do not align with the univeristy's major list." }));
                return;
            }
        }

        next();
    } catch (error) {
        res.status(500).json(generateRes(false, 500, "SERVER_ERROR", {}));
        return;
    }
}

//This validation middleware is used to validate the updateAccount function. It ensures the majors will either match the current university's or new university's list of majors
//and that the new university has a list of majors if the request is changing the account's university as well. It also ensures that the GPA is within 0-4 bounds
const accountModifyMajorValidation = async (req, res, next) => {
    try {
        //Grab information about user account information
        const accessToken = req.header('Authorization').split(' ')[1]; //Retrieve and decode access token
        const decodeAccessToken = JWT.verify(accessToken, process.env.SECRET_ACCESS_TOKEN);
        const userAccount = await retrieveOrCacheUsers(req, decodeAccessToken.email); 
        //Validate that the GPA is within normal bounds: 
        if (req.body.GPA) {
            if (req.body.GPA > 4 || req.body.gpa < 0) {
                res.status(400).json(generateRes(false, 400, "INPUT_ERROR", { details: "GPA out of bounds." }));
                return;
            }
        }

        //The code below here will check that the majors match for the current university or new university
        //Get list of majors corresponding to the user's university
        if (!userAccount.universityLocation) { next(); } //This is a temporary inclusion to ensure that the request can succeed if the user account does not have an universityLocation field 

        let promises = [ retrieveOrCacheMajors(req, userAccount.universityLocation)]; //First push a promise that will retrieve the majors associated with the user's account
        if (req.body.universityLocation) { promises.push(retrieveOrCacheMajors(req, req.body.universityLocation)); } //then fetch a promise that will retrieve the majors associated with the new university, if it is a field in the request

        let major;
        let newMajors;
        await Promise.all(promises).then(values => { //Excute one or both promises depending on if the university location is getting switched
            major = values[0];
            if (values.length > 1) {
                newMajors = values[1];
            }
        });

        if (!major) { //If no major list, the request cannot be validated 
            res.status(500).json(generateRes(false, 500, "SERVER_ERROR", { details: "Cannot validate request, no major list found corresponding to user university location." }));
            return;
        }

        if (req.body.universityLocation && !newMajors) { //Checks if the new university that the request will change the account to has a majorlist, otherwise error
            res.status(500).json(generateRes(false, 500, "SERVER_ERROR", { details: "Cannot validate request, no major list found corresponding to the new university location." }));
            return;
        }

        if (userAccount.userType.Type == process.env.STUDENT) {
            let reqMajors = getMajors(req, res); //grab majors from the request
            if (!reqMajors && !res.headersSent) { //Checks if there is a majors field found and if the response hasn't be send, if so there has been an input error
                res.status(400).json(generateRes(false, 400, "INPUT_ERROR", { details: "No provided majors" }));
                return;
            } else if (!reqMajors) { return } //If reqMajors doesn't exist and the res has been sent, then the response is s already been generated or the request by the helper
            if (!reqMajors.every(x => major.majors.includes(x))) {
                res.status(400).json(generateRes(false, 400, "INPUT_ERROR", { details: "Provided major do not align with the univeristy's major list." }));
                return;
            }
        }

        next();
    } catch (error) {
        res.status(500).json(generateRes(false, 500, "SERVER_ERROR", {}));
        return;
    }
}

const verifiedValidation = async (req, res, next) => {
    try {
        const accessToken = req.header('Authorization').split(' ')[1]; //Retrieve and decode access token
        const decodeAccessToken = JWT.verify(accessToken, process.env.SECRET_ACCESS_TOKEN);
        const userAccount = await retrieveOrCacheUsers(req, decodeAccessToken.email); 

        if(userAccount.emailConfirmed === false) {
            res.status(401).json(generateRes(false, 401, "UNAUTHORIZED", {}));
            return;
        } else {
            next();
        }
    } catch (error) {
        res.status(500).json(generateRes(false, 500, "SERVER_ERROR", {}));
        return;
    }
}

module.exports = {
    accountModifyMajorValidation, registerMajorValidation,
    verifiedValidation
}