/*  This helper functions in this file ensure that the caching of fetched mongoose objects from the database are stored in a standardized 
    way. They will ensure that access and storage of the objects such as User, Applications, and Projects are stored and retrieved with 
    minimal code in the other middle ware and controllers. The controllers should check with this helper function to see if the object 
    is already stored in the req object. Since JS is pass by reference for objects, these methods will directly modify the req object to 
    store the object retrieved from the database.

    There exists a seperate retrieve or cache <RECORD> method for each record. This is because they each require a different function call 
    to retrieve. As such, its easiest to seperate these into methods so that the developer using the method can clearly decide what record 
    they want to try to retrieve
*/

const User = require('../models/user');
const Majors = require('../models/majors');
const Application = require('../models/application');
const Project = require('../models/project');
const IndustryData = require('../models/industryData');

const reqFieldName = "cachedObjs"; //name for the field where cached objects will be stored in the req object

//This method caches an object in the req obj parameter. It stores in it the field identified by the const above, and each object is then stored in 
//a subfield of the reqFieldName field by their objectids. This should not modify the object parameter, only store it
const cacheObject = (req, objectid, object) => {
    let id;
    if (!req[reqFieldName]) { req[reqFieldName] = {} } //This is to ensure req[reqFieldName] is not undefined
    if (typeof objectid !== "string" && objectid) { //Checks if the objectid parameter is a not string, indicating an objectID object was used to retrieve the object
        id = objectid.toString();
        if (!id || typeof id !== "string") { return false; } //if the id was not able to be converted to string or does not exist, then return false;
        let newObj = req[reqFieldName]; //grab the current object that stored the cached objs
        newObj[id] = object; //add the new object by its id
        req[reqFieldName] = newObj; //assign current object to the update object
    } else { //Otherwise, the objectid parameter is a string, and the string was used to retrieve the object from the db, so objectid is used as is for the key.
        let newObj = req[reqFieldName]; //grab the current object that stored the cached objs
        newObj[objectid] = object; //add the new object by its id
        req[reqFieldName] = newObj; //assign current object to the update object
    }

    return true; //return true, as it has been modified
}

//This method checks the request obj for an object identified by the objectid and returns true if found otherwise returns false.
const checkForObj = (req, objectid) => {
    let id;
    if (typeof objectid !== "string" && objectid) { //if objectid is not a string, then it needs to be converted from objectID to string
        id = objectid.toString();
    } else { //otherwise is is a string (or should be) and id is set to it
        id = objectid;
    }

    let obj;
    if (req[reqFieldName] && req[reqFieldName][id]) { //If there exists both the cachedObjs field and an object for this objectid, then grab it
        obj = req[reqFieldName][id];
    } else { obj = false; } //otherwise there is not a cached object
    if (obj && typeof obj === "object") { return true; } //if its an object and exists, return it
    return false; //return false otherwise as there has been an error
}

//This method grabs an object from the req object parameter by the objectid if it exists, otherwise it returns false
const getObj = (req, objectid) => {
    let id;
    if (typeof objectid !== "string") { //Convert to string if the objectid is an object
        id = objectid.toString();
    } else { //otherwise objectid should be a string so just set that to the the id 
        id = objectid;
    }
    try { //attempt to access and return the cached object
        return req[reqFieldName][id];
    } catch (err) { return false; }
}

//This method utilizes the above methods to check for a cached majors object, and if not existing, then caches it. Otherwise if it exists it returns it 
const retrieveOrCacheMajors = async (req, location) => {
    let tempMajors; //temp variable for storing and return the majors object

    if (checkForObj(req, location)) { //Check if the object exists, if so store it
        tempMajors = getObj(req, location);
    } else { //otherwise grab it from the database and cache the object
        tempMajors = await Majors.findOne({ location: location });
        cacheObject(req, location, tempMajors);
    }

    return tempMajors;
}

//This method utilizes the above methods to check for a cached project object, and if not existing, then caches it. Otherwise if it exists it returns it 
const retrieveOrCacheProjects = async (req, objectid) => {
    let tempProject; //temp variable for storing and return the project object

    if (checkForObj(req, objectid)) { //Check if the object exists, if so store it
        tempProject = getObj(req, objectid);
    } else { //otherwise grab it from the database and cache the object
        tempProject = await Project.findById(objectid); 
        cacheObject(req, objectid, tempProject);
    }

    return tempProject;
}

//This method utilizes the above methods to check for a cached user object, and if not existing, then caches it. Otherwise if it exists it returns it 
const retrieveOrCacheUsers = async (req, email) => {
    let tempUser; //temp variable for storing and return the user object 

    if (checkForObj(req, email)) { //Check if the object exists, if so store it
        tempUser = getObj(req, email);
    } else { //otherwise grab it from the database and cache the object
        tempUser = await User.findOne({ email: email }); 
        cacheObject(req, email, tempUser);
    }

    return tempUser;
}

//This method utilizes the above methods to check for a cached application object, and if not existing, then caches it. Otherwise if it exists it returns it 
const retrieveOrCacheApplications = async (req, objectid) => {
    let tempApplication; //temp variable for storing and return the application object 

    if (checkForObj(req, objectid)) { //Check if the object exists, if so store it
        tempApplication = getObj(req, objectid);
    } else { //otherwise grab it from the database and cache the object
        tempApplication = await Application.findById(objectid); 
        cacheObject(req, objectid, tempApplication);
    }

    return tempApplication;
}

//This method utilizes the above methods to check for a cached industry object, and if not existing, then caches it. Otherwise if it exists it returns it 
const retrieveOrCacheIndustry = async (req, objectid) => {
    let tempIndustry; //temp variable for storing and return the industry object

    if (checkForObj(req, objectid)) { //Check if the object exists, if so store it
        tempIndustry = getObj(req, objectid);
    } else { //otherwise grab it from the database and cache the object
        tempIndustry = await IndustryData.findById(objectid); 
        cacheObject(req, objectid, tempIndustry);
    }

    return tempIndustry;
}

module.exports = {
    retrieveOrCacheMajors, retrieveOrCacheApplications,
    retrieveOrCacheUsers, retrieveOrCacheProjects,
    retrieveOrCacheIndustry
}