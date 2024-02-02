const User = require('../../models/user');
const JWT = require('jsonwebtoken');
const generateRes = require('../../helpers/generateJSON');
const Major = require('../../models/majors');
const { adminMajors } = require('../../helpers/inputValidation/validation');


/*  This function handles the addition of new major(s) to the database, requires a JWT, should be used with a POST request, and should only
    be accessible by adminstrative accounts. This will take an array of one or more majors and add them to the database if they
    do not already exist. 

    This function takes one field in the request body: majors (Array of Strings, the list of majors or major to be added to the db)
*/
const addMajors = async (req, res) => {
    try {
        //validates the request body
        const { error } = adminMajors.validate(req.body);
        if (error) {
            return res.status(400).json(generateRes(false, 400, "INPUT_ERROR", {
                errors: error.details,
                original: error._original
            }));
        }

        //decode the user's access token and then decodes it
        const accessToken = req.header('Authorization').split(' ')[1];
        const decodeAccessToken = JWT.verify(accessToken, process.env.SECRET_ACCESS_TOKEN);
        //grab the adminstrator's account
        let admin = await User.findOne({ email: decodeAccessToken.email });
        //check that the account type is an adminstrator account, other throw a authorized error response
        if (admin.userType.Type == process.env.ADMIN) {
            let majorsRecord = await Major.findOne({ location: admin.universityLocation });
            //checks if a major record could be found, if so then adds the majors to the db, otherwise creates a new record.
            if (!majorsRecord) {
                let majors = new Major({
                    location: admin.universityLocation,
                    majors: req.body.majors
                })
                await majors.save();
            } else {
                //Get a new array of all elements from the request body that do not exist in the db, then concat them into the db
                let newMajors = req.body.majors.filter(major => !majorsRecord.majors.includes(major));
                //checks if there exists any new majors, otherwise returns an error
                if (newMajors.length === 0) { return res.status(409).json(generateRes(true, 409, "MAJOR_ALREADY_EXIST")); }
                await Major.findOneAndUpdate({ _id: majorsRecord.id }, { "$push": { "majors": { "$each": newMajors } } });
            }
            return res.status(200).json(generateRes(true, 200, "MAJOR_LIST_UPDATED"));
        }
        else { return res.status(401).json(generateRes(false, 401, "UNAUTHORIZED", {})); }
    } catch (error) {
        res.status(500).json(generateRes(false, 500, "SERVER_ERROR", {}));
    }
}

/*  This function handles the removal of new major(s) to the database, requires a JWT, should be used with a DELETE request, and should only
    be accessible by adminstrative accounts. This will take an array of one or more majors and remove them from the database if they
    exist.

    This function takes one field in the request body: majors (Array of Strings, the list of majors or major to be removed from the db)
*/
const deleteMajors = async (req, res) => {
    try {
        //validates the request body
        const { error } = adminMajors.validate(req.body);
        if (error) {
            return res.status(400).json(generateRes(false, 400, "INPUT_ERROR", {
                errors: error.details,
                original: error._original
            }));
        }

        //decode the user's access token and then decodes it
        const accessToken = req.header('Authorization').split(' ')[1];
        const decodeAccessToken = JWT.verify(accessToken, process.env.SECRET_ACCESS_TOKEN);
        //grab the adminstrator's account
        let admin = await User.findOne({ email: decodeAccessToken.email });
        //check that the account type is an adminstrator account, other throw a authorized error response
        if (admin.userType.Type == process.env.ADMIN) {
            let majorsRecord = await Major.findOne({ location: admin.universityLocation });
            //checks if a major record could be found, if so then adds the majors to the db, otherwise creates a new record.
            if (!majorsRecord) {
                return res.status(404).json(generateRes(true, 404, "MAJOR_LIST_NOT_FOUND"));
            } else {
                //Get a new array of all elements from the request body that do not exist in the db, then concat them into the db
                let newMajors = req.body.majors.filter(major => majorsRecord.majors.includes(major));
                //checks if there exists any new majors, otherwise returns an error
                if (newMajors.length === 0) { return res.status(409).json(generateRes(true, 409, "MAJORS_DO_NOT_EXIST")); }
                await Major.findOneAndUpdate({ _id: majorsRecord.id }, { "$pull": { "majors": { "$in": newMajors } } });
            }
            return res.status(200).json(generateRes(true, 200, "MAJORS_REMOVED"));
        }
        else { return res.status(401).json(generateRes(false, 401, "UNAUTHORIZED", {})); }
    } catch (error) {
        res.status(500).json(generateRes(false, 500, "SERVER_ERROR", {}));
    }
}

/*  This function handles the replacement of majors to the database, requires a JWT, should be used with a POST request, and should only
    be accessible by adminstrative accounts. This will take an array of one or more majors and set the majors in the db to that array.

    This function takes one field in the request body: majors (Array of Strings, the list of majors or major to be replaced in the db)
*/
const replaceMajors = async (req, res) => {
    try {
        //validates the request body
        const { error } = adminMajors.validate(req.body);
        if (error) {
            return res.status(400).json(generateRes(false, 400, "INPUT_ERROR", {
                errors: error.details,
                original: error._original
            }));
        }

        //decode the user's access token and then decodes it
        const accessToken = req.header('Authorization').split(' ')[1];
        const decodeAccessToken = JWT.verify(accessToken, process.env.SECRET_ACCESS_TOKEN);
        //grab the adminstrator's account
        let admin = await User.findOne({ email: decodeAccessToken.email });
        //check that the account type is an adminstrator account, other throw a authorized error response
        if (admin.userType.Type == process.env.ADMIN) {
            let majorsRecord = await Major.findOne({ location: admin.universityLocation });
            //checks if a major record could be found, if so then adds the majors to the db, otherwise creates a new record.
            if (!majorsRecord) {
                let majors = new Major({
                    location: admin.universityLocation,
                    majors: req.body.majors
                })
                await majors.save();
            } else {
                //otherwise update majors
                await Major.findOneAndUpdate({ _id: majorsRecord.id }, { "$set": { "majors": req.body.majors } });
            }
            return res.status(200).json(generateRes(true, 200, "MAJORS_REPLACED"));
        }
        else { return res.status(401).json(generateRes(false, 401, "UNAUTHORIZED", {})); }
    } catch (error) {
        res.status(500).json(generateRes(false, 500, "SERVER_ERROR", {}));
    }
}

module.exports = {
    addMajors, deleteMajors,
    replaceMajors
};