/*  This helper functions in this file ensure that the caching of fetched mongoose schemas from the database are stored in a standardized 
    way. They will ensure that access and storage of the schemas such as User, Applications, and Projects are stored and retrieved with 
    minimal effort and code in the other middle ware and controllers. The controllers should still have code to fetch the record they need, 
    however they should check with this helper function to see if the object is already stored in the req object. Since JS is pass by reference
    for object, these methods will directly modify the req object to store the object retrieved from the database.
*/

const reqFieldName = "cachedObjs"; //name for the field where cached objects will be stored in the req object
//This method caches an object in the req obj parameter. It stores in it the field identified by the const above, and each object is then stored in 
//a subfield of the reqFieldName field by their objectids.
const cacheObject = (req, objectid, object) => {
    const id = objectid.toString();
    if (!id || typeof id !== "string") { return false; } //if the id was not able to be converted to string or does not exist, then return false;

    let newObj = req[reqFieldName]; //grab the current object that stored the cached objs
    newObj[id] = object; //add the new object by its id
    req[reqFieldName] = newObj; //assign current object to the update object

    return true; //return true, as it has been modified
} 
//This method checks the request obj for an object identified by the objectid and returns it if found otherwise returns false.
const checkForObj = (req, objectid) => {
    const obj = req[reqFieldName][objectid]; //get the object from the req object
    if(obj && typeof obj === "object") { return obj } //if its an object and exists, return it
    return false; //return false otherwise
}