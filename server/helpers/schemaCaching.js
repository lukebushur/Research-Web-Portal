/*  This helper functions in this file ensure that the caching of fetched mongoose schemas from the database are stored in a standardized 
    way. They will ensure that access and storage of the schemas such as User, Applications, and Projects are stored and retrieved with 
    minimal effort and code in the other middle ware and controllers. The controllers should still have code to fetch the record they need, 
    however they should check with this helper function to see if the object is already stored in the req object. Since JS is pass by reference
    for object, these methods will directly modify the req object to store the object retrieved from the database.
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
    if (typeof objectid !== "string" && objectid) {
        id = objectid.toString();
        if (!id || typeof id !== "string") { return false; } //if the id was not able to be converted to string or does not exist, then return false;
        let newObj = req[reqFieldName]; //grab the current object that stored the cached objs
        newObj[id] = object; //add the new object by its id
        req[reqFieldName] = newObj; //assign current object to the update object
    } else {
        let newObj = req[reqFieldName]; //grab the current object that stored the cached objs
        newObj[objectid] = object; //add the new object by its id
        req[reqFieldName] = newObj; //assign current object to the update object
    }

    return true; //return true, as it has been modified
}
//This method checks the request obj for an object identified by the objectid and returns true if found otherwise returns false.
const checkForObj = (req, objectid) => {
    let id;
    if (typeof objectid !== "string" && objectid) {
        id = objectid.toString();
    } else {
        id = objectid;
    }

    let obj;
    if (req[reqFieldName] && req[reqFieldName][id]) {
        obj = req[reqFieldName][id];
    } else { obj = false; }
    if (obj && typeof obj === "object") { return true; } //if its an object and exists, return it
    return false; //return false otherwise
}

const getObj = (req, objectid) => {
    let id;
    if (typeof objectid !== "string") {
        id = objectid.toString();
    } else {
        id = objectid;
    }
    try {
        return req[reqFieldName][id];
    } catch (err) { return false; }
}

const retrieveOrCacheMajors = async (req, location) => {
    let tempMajors; //temporary 

    if (checkForObj(req, location)) {
        tempMajors = getObj(req, location);
    } else {
        tempMajors = await Majors.findOne({ location: location }); //Get application record
        cacheObject(req, location, tempMajors);
    }

    return tempMajors;
}

const retrieveOrCacheProjects = async (req, objectid) => {
    let tempProject; //temporary 

    if (checkForObj(req, objectid)) {
        tempProject = getObj(req, objectid);
    } else {
        tempProject = await Project.findById(objectid); //Get application record
        cacheObject(req, objectid, tempProject);
    }

    return tempProject;
}

const retrieveOrCacheUsers = async (req, email) => {
    let tempUser; //temporary 

    if (checkForObj(req, email)) {
        tempUser = getObj(req, email);
    } else {
        tempUser = await User.findOne({ email: email }); //Get application record
        cacheObject(req, email, tempUser);
    }

    return tempUser;
}

const retrieveOrCacheApplications = async (req, objectid) => {
    let tempApplication; //temporary 

    if (checkForObj(req, objectid)) {
        tempApplication = getObj(req, objectid);
    } else {
        tempApplication = await Application.findById(objectid); //Get application record
        cacheObject(req, objectid, tempApplication);
    }

    return tempApplication;
}

const retrieveOrCacheIndustry = async (req, objectid) => {
    let tempIndustry;

    if (checkForObj(req, objectid)) {
        tempIndustry = getObj(req, objectid);
    } else {
        tempIndustry = await IndustryData.findById(objectid); //Get industry data record
        cacheObject(req, objectid, tempIndustry);
    }

    return tempIndustry;
}

module.exports = {
    retrieveOrCacheMajors, retrieveOrCacheApplications,
    retrieveOrCacheUsers, retrieveOrCacheProjects,
    retrieveOrCacheIndustry
}